import type {
  AdminProfile,
  CustomerProfile,
  DB,
  Review,
  ServiceCategory,
  ServiceRequest,
  ServiceRequestStatus,
  WorkerProfile,
  Visitor,
} from './types'

import { doc, getDoc, setDoc } from 'firebase/firestore'
import { firebaseDb } from './firebase'

type Listener = () => void
const listeners = new Set<Listener>()

let cache: DB = { admins: [], customers: [], workers: [], requests: [], reviews: [], notifications: [], visitors: [] }

function cloneDB(db: DB): DB {
  return JSON.parse(JSON.stringify(db)) as DB
}

function nowIso() {
  return new Date().toISOString()
}

function stripUndefinedDeep<T>(value: T): any {
  if (value === undefined) return undefined
  if (value === null) return null
  if (Array.isArray(value)) {
    return value
      .map((v) => stripUndefinedDeep(v))
      .filter((v) => v !== undefined)
  }
  if (typeof value === 'object') {
    const out: Record<string, any> = {}
    for (const [k, v] of Object.entries(value as Record<string, any>)) {
      const next = stripUndefinedDeep(v)
      if (next !== undefined) out[k] = next
    }
    return out
  }
  return value
}

export function createCustomer(input: { name: string; email: string; password?: string; phone?: string }) {
  const db = load()
  const c: CustomerProfile = {
    id: `c_${Math.random().toString(16).slice(2)}`,
    name: input.name,
    email: input.email,
    password: input.password,
    phone: input.phone,
    active: true,
  }
  db.customers.unshift(c)
  save(db)
  return c
}

export function updateCustomer(params: { customerId: string; patch: Partial<Pick<CustomerProfile, 'name' | 'email' | 'phone'>> }) {
  const db = load()
  const c = db.customers.find((x) => x.id === params.customerId)
  if (!c) throw new Error('Customer not found')
  Object.assign(c, params.patch)
  save(db)
}

export function setCustomerActive(params: { customerId: string; active: boolean }) {
  const db = load()
  const c = db.customers.find((x) => x.id === params.customerId)
  if (!c) throw new Error('Customer not found')
  c.active = params.active
  save(db)
}

export function deleteCustomer(params: { customerId: string }) {
  const db = load()
  db.customers = db.customers.filter((c) => c.id !== params.customerId)
  save(db)
}

export function createAdmin(input: { name: string; email: string }) {
  const db = load()
  const a: AdminProfile = {
    id: `a_${Math.random().toString(16).slice(2)}`,
    name: input.name,
    email: input.email,
    active: true,
  }
  db.admins.unshift(a)
  save(db)
  return a
}

export function createWorker(input: {
  name: string
  email?: string
  password?: string
  phone?: string
  active?: boolean
}) {
  const db = load()
  const w: WorkerProfile = {
    id: `w_${Math.random().toString(16).slice(2)}`,
    name: input.name,
    email: input.email,
    password: input.password,
    phone: input.phone,
    whatsapp: undefined,
    viber: undefined,
    categories: ['Other'],
    skills: [],
    about: undefined,
    promoPosterUrl: undefined,
    ratingAvg: 0,
    ratingCount: 0,
    jobsDone: 0,
    active: input.active ?? true,
  }
  db.workers.unshift(w)
  save(db)
  return w
}

export function updateWorker(params: {
  workerId: string
  patch: Partial<Pick<WorkerProfile, 'name' | 'email' | 'phone' | 'whatsapp' | 'viber' | 'categories' | 'skills' | 'about' | 'promoPosterUrl'>>
}) {
  const db = load()
  const w = db.workers.find((x) => x.id === params.workerId)
  if (!w) throw new Error('Worker not found')
  Object.assign(w, params.patch)
  if (!Array.isArray(w.categories)) w.categories = ['Other']
  if (!Array.isArray(w.skills)) w.skills = []
  save(db)
}

export function setWorkerActive(params: { workerId: string; active: boolean }) {
  const db = load()
  const w = db.workers.find((x) => x.id === params.workerId)
  if (!w) throw new Error('Worker not found')
  w.active = params.active
  save(db)
}

export function deleteWorker(params: { workerId: string }) {
  const db = load()
  db.workers = db.workers.filter((w) => w.id !== params.workerId)
  save(db)
}

export async function importWorkersFromJSON(workersData: any[]) {
  const db = load()
  let added = 0
  let updated = 0

  // Category mapping from JSON to app categories
  const categoryMap: Record<string, string> = {
    'AC Service': 'AC',
    'AC': 'AC',
    'Electrical': 'Electrical',
    'Plumbing': 'Plumbing',
    'Cleaning': 'Cleaning',
    'Appliance': 'Appliance',
    'Pest Control': 'PestControl',
    'Masonry': 'Masonry',
    'Moving': 'Moving',
    'Gardening': 'Gardening',
    'Painting': 'Painting',
    'Waterproofing': 'Waterproofing',
    'Interior Design': 'InteriorDesign',
    'Renovation': 'Renovation',
    'Carpentry': 'Carpentry',
    'Locksmith': 'Locksmith',
    'Security Systems': 'SecuritySystems',
    'Solar': 'Solar',
    'Beauty': 'Beauty',
    'Barber': 'Barber',
    'Spa': 'Spa',
    'Massage': 'Massage',
    'Photography': 'Photography',
    'Event Planning': 'EventPlanning',
    'Catering': 'Catering',
    'Bartending': 'Bartending',
    'Laundry': 'Laundry',
    'Child Care': 'ChildCare',
    'Elder Care': 'ElderCare',
    'Baking': 'Baking',
    'Food Stall': 'FoodStall',
    'Fresh Produce': 'FreshProduce',
    'Delivery': 'Delivery',
    'Driving': 'Driving',
    'Bike Repair': 'BikeRepair',
    'Auto Repair': 'AutoRepair',
    'Tutoring': 'Tutoring',
    'Equipment Rental': 'EquipmentRental',
    'Real Estate': 'RealEstate',
  }

  for (const data of workersData) {
    const existing = db.workers.find((w) => w.id === data.id)
    const mappedCategory = data.category ? (categoryMap[data.category] || data.category) : null
    const worker: WorkerProfile = {
      id: data.id,
      name: data.businessName || data.name || 'Unnamed Worker',
      email: data.contact?.email || data.email,
      phone: data.contact?.phone || data.phone,
      whatsapp: data.contact?.whatsapp || data.whatsapp,
      viber: data.contact?.viber,
      categories: mappedCategory ? [mappedCategory] : data.categories || ['Other'],
      skills: data.subCategories || data.skills || [],
      about: data.description || data.about,
      promoPosterUrl: data.bannerImage || data.promoPosterUrl,
      ratingAvg: data.rating?.average || 0,
      ratingCount: data.rating?.totalReviews || 0,
      jobsDone: 0,
      active: true,
      // Enhanced profile fields
      businessName: data.businessName,
      subCategories: data.subCategories,
      tagline: data.tagline,
      description: data.description,
      services: data.services,
      promotionalOffer: data.promotionalOffer,
      brandsSupported: data.brandsSupported,
      warranty: data.warranty,
      contactInfo: data.contact,
      locationInfo: data.location,
      availability: data.availability,
      languages: data.languages,
      isVerified: data.isVerified ?? false,
      profileImage: data.profileImage,
      bannerImage: data.bannerImage,
      galleryImages: data.galleryImages,
      updatedAt: data.updatedAt,
    }

    if (existing) {
      const idx = db.workers.indexOf(existing)
      db.workers[idx] = worker
      updated++
    } else {
      db.workers.push(worker)
      added++
    }
  }

  cache = db
  for (const l of listeners) l()
  await persist(db)
  await refreshDB()
  return { added, updated, total: db.workers.length }
}

export async function clearAllData() {
  const db = load()
  const workerCount = db.workers.length
  const customerCount = db.customers.length
  const requestCount = db.requests.length
  const reviewCount = db.reviews.length

  db.workers = []
  db.customers = []
  db.requests = []
  db.reviews = []
  db.notifications = []
  
  save(db)
  await persist(db)
  await refreshDB()
  return { workerCount, customerCount, requestCount, reviewCount }
}

export function removeWorkersByNames(names: string[]) {
  const db = load()
  const namesLower = names.map(n => n.toLowerCase())
  const removed = db.workers.filter((w) => namesLower.includes(w.name.toLowerCase()))
  db.workers = db.workers.filter((w) => !namesLower.includes(w.name.toLowerCase()))
  save(db)
  return { removedCount: removed.length, removedWorkers: removed.map((w) => w.name) }
}

export function getAllWorkerNames() {
  const db = load()
  return db.workers.map(w => w.name)
}

function load(): DB {
  return cloneDB(cache)
}

async function persist(db: DB) {
  try {
    const cleanDb = stripUndefinedDeep(db)
    await setDoc(doc(firebaseDb, 'app_state', 'global'), { db: cleanDb }, { merge: true })
  } catch (e: any) {
    if (e?.code === 'permission-denied') {
      console.warn('Firestore permission denied while saving app state. Falling back to local state only.')
      return
    }
    throw e
  }
}

function save(db: DB) {
  cache = db
  for (const l of listeners) l()
  void persist(db)
}

export function subscribe(listener: Listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function getDB(): DB {
  return load()
}

export async function refreshDB() {
  try {
    const snap = await getDoc(doc(firebaseDb, 'app_state', 'global'))
    const data = snap.data() as { db?: DB } | undefined
    if (data?.db) cache = data.db
    else cache = { admins: [], customers: [], workers: [], requests: [], reviews: [], notifications: [], visitors: [] }
  } catch (e: any) {
    if (e?.code === 'permission-denied') {
      console.warn('Firestore permission denied while loading app state. Using local state only.')
    } else {
      throw e
    }
  }
  for (const l of listeners) l()
}

export function resetDB() {
  cache = { admins: [], customers: [], workers: [], requests: [], reviews: [], notifications: [], visitors: [] }
  for (const l of listeners) l()
  void persist(cache)
}

export async function seedIfEmpty() {
  await refreshDB()
  const db = load()
  if (
    db.admins.length ||
    db.customers.length ||
    db.workers.length ||
    db.requests.length ||
    db.reviews.length
  )
    return

  const admins: AdminProfile[] = [
    {
      id: 'a_1',
      name: 'Admin',
      email: 'admin@demo.com',
      active: true,
    },
    {
      id: 'a_2',
      name: 'Rettey',
      email: 'retey.ay@hotmail.com',
      active: true,
    },
  ]

  const customers: CustomerProfile[] = []

  const workers: WorkerProfile[] = []

  const requests: ServiceRequest[] = []

  save({ admins, customers, workers, requests, reviews: [], notifications: [], visitors: [] })
}

export function listWorkers(category?: ServiceCategory) {
  const db = load()
  if (!category) return db.workers
  return db.workers.filter((w) => w.categories.includes(category))
}

export function listRequests() {
  return load().requests
}

export function listAdmins() {
  return load().admins
}

export function getWorker(workerId: string) {
  const db = load()
  return db.workers.find((w) => w.id === workerId)
}

export function updateWorkerProfile(params: {
  workerId: string
  patch: Partial<Pick<WorkerProfile, 'name' | 'email' | 'phone' | 'whatsapp' | 'viber' | 'categories' | 'skills' | 'about' | 'promoPosterUrl'>>
}) {
  const db = load()
  const w = db.workers.find((x) => x.id === params.workerId)
  if (!w) throw new Error('Worker not found')
  if (!w.active) throw new Error('Worker is deactivated')

  Object.assign(w, params.patch)

  if (!Array.isArray(w.categories)) w.categories = ['Other']
  if (!Array.isArray(w.skills)) w.skills = []
  save(db)
}

export function createRequest(input: {
  customerId: string
  category: ServiceCategory
  subcategory?: string
  title: string
  description: string
  budget: number
  urgency: 'low' | 'medium' | 'high'
  location: string
  requiresInspection?: boolean
  contactName?: string
  contactPhone?: string
  isRecurring?: boolean
  recurringFrequency?: import('./types').RecurringFrequency
  recurringDiscount?: number
  images?: string[]
}) {
  const db = load()
  const customer = db.customers.find((c) => c.id === input.customerId)
  if (!customer) throw new Error('Customer not found')
  if (!customer.active) throw new Error('Customer is deactivated')
  const req: ServiceRequest = {
    id: `r_${Math.random().toString(16).slice(2)}`,
    createdAt: nowIso(),
    status: 'open',
    interestedWorkerIds: [],
    quoteOffers: [],
    ...input,
  }
  db.requests.unshift(req)
  save(db)
  return req
}

export function cancelRequest(params: { requestId: string; customerId: string }) {
  const db = load()
  const req = findReqOrThrow(db, params.requestId)
  if (req.customerId !== params.customerId) throw new Error('Not your request')
  // Only allow cancellation for requests that haven't started work yet
  const cancellableStatuses: ServiceRequestStatus[] = [
    'open',
    'pending_customer_confirmation',
    'inspection_pending_worker_proposal',
    'inspection_pending_customer_confirmation',
    'inspection_scheduled',
    'awaiting_quote',
    'quote_pending_approval',
  ]
  if (!cancellableStatuses.includes(req.status)) {
    throw new Error('Cannot cancel request at this stage')
  }
  // Notify interested workers if any
  if (req.interestedWorkerIds && req.interestedWorkerIds.length > 0) {
    req.interestedWorkerIds.forEach((workerId) => {
      createNotification({
        userId: workerId,
        userRole: 'worker',
        type: 'work_completed', // Using existing type
        title: 'Request Cancelled',
        message: `The request "${req.title}" has been cancelled by the customer.`,
        requestId: params.requestId,
      })
    })
  }
  // Remove the request from the database
  db.requests = db.requests.filter((r) => r.id !== params.requestId)
  save(db)
}

export function deleteAllRequests() {
  const db = load()
  db.requests = []
  save(db)
}

export function toggleInspectionRequirement(params: { requestId: string; customerId: string; requiresInspection: boolean }) {
  const db = load()
  const req = findReqOrThrow(db, params.requestId)
  if (req.customerId !== params.customerId) throw new Error('Not your request')
  // Can only change before inspection is completed
  const blockedStatuses: ServiceRequestStatus[] = [
    'inspection_completed_pending_customer_confirm',
    'awaiting_quote',
    'quote_pending_approval',
    'work_pending_worker_schedule',
    'work_pending_customer_confirmation',
    'work_scheduled',
    'work_completed_pending_customer_confirm',
    'payment_pending',
    'completed',
  ]
  if (blockedStatuses.includes(req.status)) {
    throw new Error('Cannot change inspection requirement after inspection is completed')
  }
  req.requiresInspection = params.requiresInspection
  // If turning off inspection, move to awaiting_quote if worker is selected
  if (!params.requiresInspection && req.acceptedWorkerId) {
    setStatus(req, 'awaiting_quote')
    createNotification({
      userId: req.acceptedWorkerId,
      userRole: 'worker',
      type: 'inspection_scheduled',
      title: 'Inspection not required',
      message: `Customer changed request "${req.title}" - no inspection needed. Please submit your quote directly.`,
      requestId: params.requestId,
    })
  }
  save(db)
}

export function createNotification(input: {
  userId: string
  userRole: 'customer' | 'worker' | 'admin'
  type: 'worker_selected' | 'quote_received' | 'inspection_scheduled' | 'work_scheduled' | 'work_completed' | 'payment_received' | 'worker_interested' | 'invoice_ready' | 'payment_confirmed'
  title: string
  message: string
  requestId?: string
}) {
  const db = load()
  db.notifications = Array.isArray((db as any).notifications) ? (db as any).notifications : []
  const n = {
    id: `n_${Math.random().toString(16).slice(2)}`,
    ...input,
    read: false,
    createdAt: nowIso(),
  }
  db.notifications.unshift(n)
  save(db)
  return n
}

export function listNotificationsForUser(userId: string, userRole: 'customer' | 'worker' | 'admin') {
  const db = load()
  db.notifications = Array.isArray((db as any).notifications) ? (db as any).notifications : []
  return db.notifications.filter((n) => n.userId === userId && n.userRole === userRole).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function markNotificationRead(notificationId: string) {
  const db = load()
  db.notifications = Array.isArray((db as any).notifications) ? (db as any).notifications : []
  const n = db.notifications.find((x) => x.id === notificationId)
  if (n) {
    n.read = true
    save(db)
  }
}

export function markAllNotificationsRead(userId: string, userRole: 'customer' | 'worker' | 'admin') {
  const db = load()
  db.notifications = Array.isArray((db as any).notifications) ? (db as any).notifications : []
  let changed = false
  db.notifications.forEach((n) => {
    if (n.userId === userId && n.userRole === userRole && !n.read) {
      n.read = true
      changed = true
    }
  })
  if (changed) save(db)
}

function setStatus(req: ServiceRequest, next: ServiceRequestStatus) {
  req.status = next
}

function findReqOrThrow(db: DB, requestId: string) {
  const req = db.requests.find((r) => r.id === requestId)
  if (!req) throw new Error('Request not found')
  return req
}

export function acceptRequest(params: { requestId: string; workerId: string }) {
  const db = load()
  const req = findReqOrThrow(db, params.requestId)
  if (req.status !== 'open' && req.status !== 'pending_customer_confirmation') {
    throw new Error('Request is not open')
  }

  const worker = db.workers.find((w) => w.id === params.workerId)
  if (!worker) throw new Error('Worker not found')
  if (!worker.active) throw new Error('Worker is deactivated')

  req.interestedWorkerIds = Array.isArray(req.interestedWorkerIds) ? req.interestedWorkerIds : []
  if (!req.interestedWorkerIds.includes(params.workerId)) {
    req.interestedWorkerIds.push(params.workerId)

    // Send notification to customer when worker first shows interest
    createNotification({
      userId: req.customerId,
      userRole: 'customer',
      type: 'worker_interested',
      title: 'Worker interested!',
      message: `${worker.name} is interested in your request "${req.title}". Review and select them.`,
      requestId: params.requestId,
    })
  }
  if (req.status === 'open') setStatus(req, 'pending_customer_confirmation')
  save(db)
}

export function selectWorker(params: { requestId: string; customerId: string; workerId: string }) {
  const db = load()
  const req = findReqOrThrow(db, params.requestId)
  if (req.customerId !== params.customerId) throw new Error('Not your request')
  if (req.status !== 'open' && req.status !== 'pending_customer_confirmation') {
    throw new Error('Request is not open')
  }

  const worker = db.workers.find((w) => w.id === params.workerId)
  if (!worker) throw new Error('Worker not found')
  if (!worker.active) throw new Error('Worker is deactivated')

  req.acceptedWorkerId = params.workerId
  req.interestedWorkerIds = Array.isArray(req.interestedWorkerIds) ? req.interestedWorkerIds : []
  if (!req.interestedWorkerIds.includes(params.workerId)) {
    req.interestedWorkerIds.push(params.workerId)
  }
  const needsInspection = req.requiresInspection !== false
  setStatus(req, needsInspection ? 'inspection_pending_worker_proposal' : 'awaiting_quote')

  createNotification({
    userId: params.workerId,
    userRole: 'worker',
    type: 'worker_selected',
    title: 'You have been selected!',
    message: needsInspection
      ? `Customer selected you for "${req.title}". Please propose an inspection date.`
      : `Customer selected you for "${req.title}". Please submit your quote.`,
    requestId: params.requestId,
  })

  save(db)
}

export function submitQuoteOffer(params: {
  requestId: string
  workerId: string
  amount: number
  notes?: string
}) {
  const db = load()
  const req = findReqOrThrow(db, params.requestId)
  if (req.status !== 'open' && req.status !== 'pending_customer_confirmation') {
    throw new Error('Request is not open')
  }
  if (!Number.isFinite(params.amount) || params.amount < 0) throw new Error('Invalid amount')

  const worker = db.workers.find((w) => w.id === params.workerId)
  if (!worker) throw new Error('Worker not found')
  if (!worker.active) throw new Error('Worker is deactivated')

  req.interestedWorkerIds = Array.isArray(req.interestedWorkerIds) ? req.interestedWorkerIds : []
  if (!req.interestedWorkerIds.includes(params.workerId)) {
    req.interestedWorkerIds.push(params.workerId)
  }

  req.quoteOffers = Array.isArray(req.quoteOffers) ? req.quoteOffers : []
  const idx = req.quoteOffers.findIndex((o) => o.workerId === params.workerId)
  const offer = {
    workerId: params.workerId,
    amount: params.amount,
    notes: params.notes,
    submittedAt: nowIso(),
  }
  if (idx >= 0) req.quoteOffers[idx] = offer
  else req.quoteOffers.push(offer)

  save(db)
}

export function chooseOffer(params: { requestId: string; customerId: string; workerId: string }) {
  const db = load()
  const req = findReqOrThrow(db, params.requestId)
  if (req.customerId !== params.customerId) throw new Error('Not your request')
  if (req.status !== 'open' && req.status !== 'pending_customer_confirmation') {
    throw new Error('Request is not open')
  }

  const offers = Array.isArray(req.quoteOffers) ? req.quoteOffers : []
  const offer = offers.find((o) => o.workerId === params.workerId)
  if (!offer) throw new Error('Quote offer not found')

  req.acceptedWorkerId = params.workerId
  setStatus(req, 'quote_pending_approval')
  req.quote = {
    amount: offer.amount,
    notes: offer.notes,
    submittedAt: offer.submittedAt,
  }
  save(db)
}

export function addReview(params: {
  requestId: string
  customerId: string
  rating: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  comment?: string
}) {
  const db = load()
  const req = findReqOrThrow(db, params.requestId)
  if (req.customerId !== params.customerId) throw new Error('Not your request')
  if (req.status !== 'completed') throw new Error('Request is not completed')
  if (!req.acceptedWorkerId) throw new Error('No worker assigned')

  const exists = db.reviews.find(
    (r) => r.requestId === params.requestId && r.customerId === params.customerId,
  )
  if (exists) throw new Error('Already reviewed')

  const review: Review = {
    id: `rev_${Math.random().toString(16).slice(2)}`,
    createdAt: nowIso(),
    requestId: params.requestId,
    customerId: params.customerId,
    workerId: req.acceptedWorkerId,
    rating: params.rating,
    comment: params.comment,
  }
  db.reviews.unshift(review)

  const worker = db.workers.find((w) => w.id === req.acceptedWorkerId)
  if (worker) {
    const nextCount = (worker.ratingCount ?? 0) + 1
    const nextAvg = ((worker.ratingAvg ?? 0) * (worker.ratingCount ?? 0) + params.rating) / nextCount
    worker.ratingAvg = Math.round(nextAvg * 10) / 10
    worker.ratingCount = nextCount
  }

  save(db)
  return review
}

export function listReviewsForWorker(workerId: string) {
  const db = load()
  return db.reviews.filter((r) => r.workerId === workerId)
}

export function customerConfirmWorker(params: { requestId: string; customerId: string }) {
  const db = load()
  const req = findReqOrThrow(db, params.requestId)
  if (req.customerId !== params.customerId) throw new Error('Not your request')
  if (req.status !== 'pending_customer_confirmation') {
    throw new Error('Request is not awaiting customer confirmation')
  }
  setStatus(req, 'inspection_pending_worker_proposal')
  save(db)
}

export function proposeInspection(params: {
  requestId: string
  workerId: string
  whenIso: string
}) {
  const db = load()
  const req = findReqOrThrow(db, params.requestId)
  if (req.acceptedWorkerId !== params.workerId) throw new Error('Not assigned worker')
  if (req.status !== 'inspection_pending_worker_proposal') {
    throw new Error('Not awaiting inspection proposal')
  }
  const proposals = req.inspection?.proposals ?? []
  proposals.push({
    proposedAt: nowIso(),
    scheduledFor: params.whenIso,
    proposedBy: 'worker',
    status: 'pending',
  })
  req.inspection = {
    ...(req.inspection ?? {}),
    proposals,
  }
  setStatus(req, 'inspection_pending_customer_confirmation')

  createNotification({
    userId: req.customerId,
    userRole: 'customer',
    type: 'inspection_scheduled',
    title: 'Inspection time proposed',
    message: `Worker proposed an inspection time for "${req.title}". Please review and confirm or propose an alternate.`,
    requestId: params.requestId,
  })

  save(db)
}

export function customerConfirmInspection(params: { requestId: string; customerId: string }) {
  const db = load()
  const req = findReqOrThrow(db, params.requestId)
  if (req.customerId !== params.customerId) throw new Error('Not your request')
  if (req.status !== 'inspection_pending_customer_confirmation') {
    throw new Error('Not awaiting customer inspection confirmation')
  }
  const proposals = req.inspection?.proposals ?? []
  const currentProposal = proposals.find((p) => p.status === 'pending')
  if (currentProposal) {
    currentProposal.status = 'accepted'
  }
  req.inspection = {
    ...(req.inspection ?? {}),
    scheduledFor: currentProposal?.scheduledFor,
    customerConfirmedAt: nowIso(),
    proposals,
  }
  setStatus(req, 'inspection_scheduled')

  if (req.acceptedWorkerId) {
    createNotification({
      userId: req.acceptedWorkerId,
      userRole: 'worker',
      type: 'inspection_scheduled',
      title: 'Inspection confirmed!',
      message: `Customer confirmed the inspection for "${req.title}". Please arrive on time.`,
      requestId: params.requestId,
    })
  }

  save(db)
}

export function customerRejectInspectionWithAlternate(params: {
  requestId: string
  customerId: string
  rejectionReason: string
  alternateTimeIso: string
}) {
  const db = load()
  const req = findReqOrThrow(db, params.requestId)
  if (req.customerId !== params.customerId) throw new Error('Not your request')
  if (req.status !== 'inspection_pending_customer_confirmation') {
    throw new Error('Not awaiting customer inspection confirmation')
  }

  const proposals = req.inspection?.proposals ?? []
  const currentProposal = proposals.find((p) => p.status === 'pending')
  if (currentProposal) {
    currentProposal.status = 'rejected'
    currentProposal.rejectionReason = params.rejectionReason
  }
  proposals.push({
    proposedAt: nowIso(),
    scheduledFor: params.alternateTimeIso,
    proposedBy: 'customer',
    status: 'pending',
  })
  req.inspection = {
    ...(req.inspection ?? {}),
    proposals,
  }
  setStatus(req, 'inspection_pending_worker_proposal')

  if (req.acceptedWorkerId) {
    createNotification({
      userId: req.acceptedWorkerId,
      userRole: 'worker',
      type: 'inspection_scheduled',
      title: 'Inspection time rejected - alternate proposed',
      message: `Customer rejected your inspection time for "${req.title}". Reason: ${params.rejectionReason}. They proposed an alternate time. Please review.`,
      requestId: params.requestId,
    })
  }

  save(db)
}

export function workerProposeAlternateInspection(params: {
  requestId: string
  workerId: string
  whenIso: string
}) {
  const db = load()
  const req = findReqOrThrow(db, params.requestId)
  if (req.acceptedWorkerId !== params.workerId) throw new Error('Not assigned worker')
  if (req.status !== 'inspection_pending_worker_proposal') {
    throw new Error('Not awaiting inspection proposal')
  }

  const proposals = req.inspection?.proposals ?? []
  proposals.push({
    proposedAt: nowIso(),
    scheduledFor: params.whenIso,
    proposedBy: 'worker',
    status: 'pending',
  })
  req.inspection = {
    ...(req.inspection ?? {}),
    proposals,
  }
  setStatus(req, 'inspection_pending_customer_confirmation')

  createNotification({
    userId: req.customerId,
    userRole: 'customer',
    type: 'inspection_scheduled',
    title: 'New inspection time proposed',
    message: `Worker proposed a new inspection time for "${req.title}". Please review and confirm.`,
    requestId: params.requestId,
  })

  save(db)
}

export function workerCompleteInspection(params: { requestId: string; workerId: string }) {
  const db = load()
  const req = findReqOrThrow(db, params.requestId)
  if (req.acceptedWorkerId !== params.workerId) throw new Error('Not assigned worker')
  if (req.status !== 'inspection_scheduled') throw new Error('Inspection not scheduled')
  req.inspection = { ...(req.inspection ?? {}), completedByWorkerAt: nowIso() }
  setStatus(req, 'inspection_completed_pending_customer_confirm')
  save(db)
}

export function customerConfirmInspectionCompleted(params: {
  requestId: string
  customerId: string
}) {
  const db = load()
  const req = findReqOrThrow(db, params.requestId)
  if (req.customerId !== params.customerId) throw new Error('Not your request')
  if (req.status !== 'inspection_completed_pending_customer_confirm') {
    throw new Error('Not awaiting inspection completion confirmation')
  }
  req.inspection = { ...(req.inspection ?? {}), completedConfirmedByCustomerAt: nowIso() }
  setStatus(req, 'awaiting_quote')

  if (req.acceptedWorkerId) {
    createNotification({
      userId: req.acceptedWorkerId,
      userRole: 'worker',
      type: 'quote_received',
      title: 'Submit your quote!',
      message: `Inspection completed for "${req.title}". Customer is waiting for your price quote.`,
      requestId: params.requestId,
    })
  }

  save(db)
}

export function submitQuote(params: {
  requestId: string
  workerId: string
  amount: number
  notes?: string
}) {
  const db = load()
  const req = findReqOrThrow(db, params.requestId)
  if (req.acceptedWorkerId !== params.workerId) throw new Error('Not assigned worker')
  if (req.status !== 'awaiting_quote') throw new Error('Not awaiting quote')

  req.quote = {
    amount: params.amount,
    notes: params.notes,
    submittedAt: nowIso(),
  }
  setStatus(req, 'quote_pending_approval')
  save(db)
}

export function approveQuote(params: { requestId: string; customerId: string }) {
  const db = load()
  const req = findReqOrThrow(db, params.requestId)
  if (req.customerId !== params.customerId) throw new Error('Not your request')
  if (req.status !== 'quote_pending_approval') throw new Error('Not awaiting quote approval')

  req.quote = { ...(req.quote ?? {}), approvedAt: nowIso() }
  setStatus(req, 'work_pending_worker_schedule')

  if (req.acceptedWorkerId) {
    createNotification({
      userId: req.acceptedWorkerId,
      userRole: 'worker',
      type: 'quote_received',
      title: 'Quote approved!',
      message: `Customer approved your quote for "${req.title}". Please schedule the work.`,
      requestId: params.requestId,
    })
  }

  save(db)
}

export function scheduleWork(params: {
  requestId: string
  workerId: string
  whenIso: string
}) {
  const db = load()
  const req = findReqOrThrow(db, params.requestId)
  if (req.acceptedWorkerId !== params.workerId) throw new Error('Not assigned worker')
  if (req.status !== 'work_pending_worker_schedule') throw new Error('Not awaiting work schedule')

  const proposals = req.work?.proposals ?? []
  proposals.push({
    proposedAt: nowIso(),
    scheduledFor: params.whenIso,
    proposedBy: 'worker',
    status: 'pending',
  })
  req.work = {
    ...(req.work ?? {}),
    proposals,
  }
  setStatus(req, 'work_pending_customer_confirmation')

  createNotification({
    userId: req.customerId,
    userRole: 'customer',
    type: 'work_scheduled',
    title: 'Work time proposed',
    message: `Worker proposed a work schedule for "${req.title}". Please review and confirm or propose an alternate.`,
    requestId: params.requestId,
  })

  save(db)
}

export function customerRejectWorkScheduleWithAlternate(params: {
  requestId: string
  customerId: string
  rejectionReason: string
  alternateTimeIso: string
}) {
  const db = load()
  const req = findReqOrThrow(db, params.requestId)
  if (req.customerId !== params.customerId) throw new Error('Not your request')
  if (req.status !== 'work_pending_customer_confirmation') {
    throw new Error('Not awaiting customer work confirmation')
  }

  const proposals = req.work?.proposals ?? []
  const currentProposal = proposals.find((p) => p.status === 'pending')
  if (currentProposal) {
    currentProposal.status = 'rejected'
    currentProposal.rejectionReason = params.rejectionReason
  }
  proposals.push({
    proposedAt: nowIso(),
    scheduledFor: params.alternateTimeIso,
    proposedBy: 'customer',
    status: 'pending',
  })
  req.work = {
    ...(req.work ?? {}),
    proposals,
  }
  setStatus(req, 'work_pending_worker_schedule')

  if (req.acceptedWorkerId) {
    createNotification({
      userId: req.acceptedWorkerId,
      userRole: 'worker',
      type: 'work_scheduled',
      title: 'Work schedule rejected - alternate proposed',
      message: `Customer rejected your work schedule for "${req.title}". Reason: ${params.rejectionReason}. They proposed an alternate time. Please review.`,
      requestId: params.requestId,
    })
  }

  save(db)
}

export function workerProposeAlternateWorkSchedule(params: {
  requestId: string
  workerId: string
  whenIso: string
}) {
  const db = load()
  const req = findReqOrThrow(db, params.requestId)
  if (req.acceptedWorkerId !== params.workerId) throw new Error('Not assigned worker')
  if (req.status !== 'work_pending_worker_schedule') {
    throw new Error('Not awaiting work schedule')
  }

  const proposals = req.work?.proposals ?? []
  proposals.push({
    proposedAt: nowIso(),
    scheduledFor: params.whenIso,
    proposedBy: 'worker',
    status: 'pending',
  })
  req.work = {
    ...(req.work ?? {}),
    proposals,
  }
  setStatus(req, 'work_pending_customer_confirmation')

  createNotification({
    userId: req.customerId,
    userRole: 'customer',
    type: 'work_scheduled',
    title: 'New work time proposed',
    message: `Worker proposed a new work schedule for "${req.title}". Please review and confirm.`,
    requestId: params.requestId,
  })

  save(db)
}

export function customerConfirmWorkSchedule(params: { requestId: string; customerId: string }) {
  const db = load()
  const req = findReqOrThrow(db, params.requestId)
  if (req.customerId !== params.customerId) throw new Error('Not your request')
  if (req.status !== 'work_pending_customer_confirmation') {
    throw new Error('Not awaiting customer work confirmation')
  }
  req.work = { ...(req.work ?? {}), confirmedByCustomerAt: nowIso() }
  setStatus(req, 'work_scheduled')

  if (req.acceptedWorkerId) {
    createNotification({
      userId: req.acceptedWorkerId,
      userRole: 'worker',
      type: 'work_scheduled',
      title: 'Work schedule confirmed!',
      message: `Customer confirmed the work schedule for "${req.title}". Please arrive on time.`,
      requestId: params.requestId,
    })
  }

  save(db)
}

export function workerCompleteWork(params: { requestId: string; workerId: string }) {
  const db = load()
  const req = findReqOrThrow(db, params.requestId)
  if (req.acceptedWorkerId !== params.workerId) throw new Error('Not assigned worker')
  if (req.status !== 'work_scheduled') throw new Error('Work is not scheduled')

  req.work = { ...(req.work ?? {}), completedByWorkerAt: nowIso() }
  setStatus(req, 'work_completed_pending_customer_confirm')
  save(db)
}

export function customerConfirmWorkCompleted(params: { requestId: string; customerId: string }) {
  const db = load()
  const req = findReqOrThrow(db, params.requestId)
  if (req.customerId !== params.customerId) throw new Error('Not your request')
  if (req.status !== 'work_completed_pending_customer_confirm') {
    throw new Error('Not awaiting customer work completion confirmation')
  }
  req.work = { ...(req.work ?? {}), completedConfirmedByCustomerAt: nowIso() }
  setStatus(req, 'payment_pending')

  if (req.acceptedWorkerId) {
    createNotification({
      userId: req.acceptedWorkerId,
      userRole: 'worker',
      type: 'work_completed',
      title: 'Work completed by customer!',
      message: `Customer confirmed work completion for "${req.title}". Please mark payment status.`,
      requestId: params.requestId,
    })
  }

  save(db)
}

export function generateInvoice(params: {
  requestId: string
  customerId: string
  amount: number
  description: string
  dueDateIso?: string
}) {
  const db = load()
  const req = findReqOrThrow(db, params.requestId)
  if (req.customerId !== params.customerId) throw new Error('Not your request')
  if (req.status !== 'work_completed_pending_customer_confirm' && req.status !== 'payment_pending') {
    throw new Error('Cannot generate invoice at this stage')
  }

  req.invoice = {
    id: `inv_${Math.random().toString(16).slice(2)}`,
    amount: params.amount,
    description: params.description,
    generatedAt: nowIso(),
    dueDate: params.dueDateIso,
    status: 'pending',
  }

  if (req.status === 'work_completed_pending_customer_confirm') {
    setStatus(req, 'payment_pending')
  }

  createNotification({
    userId: req.customerId,
    userRole: 'customer',
    type: 'invoice_ready',
    title: 'Invoice ready for payment',
    message: `An invoice of MVR ${params.amount} has been generated for "${req.title}". Please review and pay or choose "Paid on spot".`,
    requestId: params.requestId,
  })

  save(db)
  return req.invoice
}

export function markPaidOnSpot(params: { requestId: string; customerId: string }) {
  const db = load()
  const req = findReqOrThrow(db, params.requestId)
  if (req.customerId !== params.customerId) throw new Error('Not your request')
  if (req.status !== 'payment_pending') throw new Error('Not in payment phase')

  req.payment = {
    status: 'pending',
    markedAt: nowIso(),
    paidOnSpot: true,
    customerMarkedAt: nowIso(),
  }

  if (req.acceptedWorkerId) {
    createNotification({
      userId: req.acceptedWorkerId,
      userRole: 'worker',
      type: 'payment_received',
      title: 'Customer marked paid on spot',
      message: `Customer marked "${req.title}" as paid on spot. Please confirm receipt of payment.`,
      requestId: params.requestId,
    })
  }

  save(db)
}

export function markPaymentWithSlip(params: { requestId: string; customerId: string; paymentSlipUrl: string; paymentMethod: 'bank_transfer' | 'cash' | 'other' }) {
  const db = load()
  const req = findReqOrThrow(db, params.requestId)
  if (req.customerId !== params.customerId) throw new Error('Not your request')
  if (req.status !== 'payment_pending') throw new Error('Not in payment phase')

  req.payment = {
    status: 'pending',
    markedAt: nowIso(),
    customerMarkedAt: nowIso(),
    paymentSlipUrl: params.paymentSlipUrl,
    paymentMethod: params.paymentMethod,
  }

  if (req.acceptedWorkerId) {
    createNotification({
      userId: req.acceptedWorkerId,
      userRole: 'worker',
      type: 'payment_received',
      title: 'Payment marked with slip',
      message: `Customer uploaded payment slip for "${req.title}". Please confirm receipt of payment.`,
      requestId: params.requestId,
    })
  }

  save(db)
}

export function workerConfirmPaymentReceived(params: { requestId: string; workerId: string }) {
  const db = load()
  const req = findReqOrThrow(db, params.requestId)
  if (req.acceptedWorkerId !== params.workerId) throw new Error('Not assigned worker')
  if (req.status !== 'payment_pending') throw new Error('Not in payment phase')

  req.payment = {
    ...(req.payment ?? {}),
    status: 'paid',
    workerConfirmedAt: nowIso(),
  }
  setStatus(req, 'completed')

  createNotification({
    userId: req.customerId,
    userRole: 'customer',
    type: 'payment_confirmed',
    title: 'Payment confirmed - Leave a review!',
    message: `Worker confirmed payment for "${req.title}". Please leave a rating and review.`,
    requestId: params.requestId,
  })

  save(db)
}

export function markPayment(params: { requestId: string; workerId: string; status: 'pending' | 'paid' }) {
  const db = load()
  const req = findReqOrThrow(db, params.requestId)
  if (req.acceptedWorkerId !== params.workerId) throw new Error('Not assigned worker')
  if (req.status !== 'payment_pending') throw new Error('Not in payment phase')

  req.payment = { ...(req.payment ?? {}), status: params.status, markedAt: nowIso() }
  if (params.status === 'paid') {
    setStatus(req, 'completed')
  }
  save(db)
}

export function checkUpcomingReminders(userId: string, userRole: 'customer' | 'worker') {
  const db = load()
  const now = new Date()
  const reminders: Array<{
    type: 'inspection' | 'work'
    requestId: string
    title: string
    scheduledFor: string
    minutesUntil: number
    urgency: '30min' | '15min' | 'now'
  }> = []

  const relevantRequests = db.requests.filter((r) => {
    if (userRole === 'customer') return r.customerId === userId
    return r.acceptedWorkerId === userId
  })

  for (const req of relevantRequests) {
    if (req.inspection?.scheduledFor) {
      const scheduled = new Date(req.inspection.scheduledFor)
      const diff = scheduled.getTime() - now.getTime()
      const minutes = Math.floor(diff / 60000)
      if (minutes >= 0 && minutes <= 30) {
        reminders.push({
          type: 'inspection',
          requestId: req.id,
          title: req.title,
          scheduledFor: req.inspection.scheduledFor,
          minutesUntil: minutes,
          urgency: minutes <= 15 ? '15min' : '30min',
        })
      }
    }
    if (req.work?.scheduledFor) {
      const scheduled = new Date(req.work.scheduledFor)
      const diff = scheduled.getTime() - now.getTime()
      const minutes = Math.floor(diff / 60000)
      if (minutes >= 0 && minutes <= 30) {
        reminders.push({
          type: 'work',
          requestId: req.id,
          title: req.title,
          scheduledFor: req.work.scheduledFor,
          minutesUntil: minutes,
          urgency: minutes <= 15 ? '15min' : '30min',
        })
      }
    }
  }

  return reminders
}

// User agent parser for device/browser/OS detection
function parseUserAgent(userAgent?: string): {
  browser?: string
  os?: string
  device?: string
  deviceType?: 'desktop' | 'mobile' | 'tablet'
} {
  if (!userAgent) return {}

  const ua = userAgent.toLowerCase()
  let browser: string | undefined
  let os: string | undefined
  let device: string | undefined
  let deviceType: 'desktop' | 'mobile' | 'tablet' = 'desktop'

  // Browser detection
  if (ua.includes('chrome') && !ua.includes('edg')) browser = 'Chrome'
  else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari'
  else if (ua.includes('firefox')) browser = 'Firefox'
  else if (ua.includes('edg')) browser = 'Edge'
  else if (ua.includes('opera') || ua.includes('opr')) browser = 'Opera'
  else browser = 'Other'

  // OS detection
  if (ua.includes('windows')) os = 'Windows'
  else if (ua.includes('mac os') || ua.includes('macos')) os = 'macOS'
  else if (ua.includes('android')) os = 'Android'
  else if (ua.includes('iphone') || ua.includes('ipad')) os = 'iOS'
  else if (ua.includes('linux')) os = 'Linux'
  else os = 'Other'

  // Device detection
  if (ua.includes('iphone')) {
    device = 'iPhone'
    deviceType = 'mobile'
  } else if (ua.includes('ipad')) {
    device = 'iPad'
    deviceType = 'tablet'
  } else if (ua.includes('android')) {
    deviceType = 'mobile'
    device = 'Android'
  } else if (ua.includes('mobile')) {
    deviceType = 'mobile'
    device = 'Mobile'
  } else if (ua.includes('tablet')) {
    deviceType = 'tablet'
    device = 'Tablet'
  } else {
    device = 'Desktop'
    deviceType = 'desktop'
  }

  return { browser, os, device, deviceType }
}

// Visitor tracking functions
export async function trackVisitor(params: {
  sessionId: string
  ip?: string
  userAgent?: string
  referrer?: string
  isRegistered?: boolean
  userId?: string
  userRole?: 'customer' | 'worker' | 'admin'
}): Promise<Visitor> {
  await refreshDB()
  const db = load()
  const now = nowIso()
  const deviceInfo = parseUserAgent(params.userAgent)
  
  // Check if visitor already exists for this session
  let visitor = db.visitors.find((v) => v.sessionId === params.sessionId)
  
  if (visitor) {
    // Update existing visitor
    visitor.lastSeenAt = now
    visitor.pageViews += 1
    if (params.isRegistered !== undefined) visitor.isRegistered = params.isRegistered
    if (params.userId) visitor.userId = params.userId
    if (params.userRole) visitor.userRole = params.userRole
  } else {
    // Create new visitor
    visitor = {
      id: `v_${Math.random().toString(16).slice(2)}`,
      sessionId: params.sessionId,
      ip: params.ip,
      userAgent: params.userAgent,
      ...deviceInfo,
      referrer: params.referrer,
      visitedAt: now,
      lastSeenAt: now,
      pageViews: 1,
      isRegistered: params.isRegistered ?? false,
      userId: params.userId,
      userRole: params.userRole,
    }
    db.visitors.push(visitor)
  }
  
  save(db)
  return visitor
}

export function getVisitorStats() {
  const db = load()
  const now = new Date()
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  
  const totalVisitors = db.visitors.length
  const registeredVisitors = db.visitors.filter((v) => v.isRegistered).length
  const anonymousVisitors = totalVisitors - registeredVisitors
  
  const yesterdayVisitors = db.visitors.filter((v) => new Date(v.visitedAt) >= yesterday).length
  const lastWeekVisitors = db.visitors.filter((v) => new Date(v.visitedAt) >= lastWeek).length
  
  const totalPageViews = db.visitors.reduce((sum, v) => sum + v.pageViews, 0)
  
  const byRole: Record<string, number> = {
    customer: db.visitors.filter((v) => v.userRole === 'customer').length,
    worker: db.visitors.filter((v) => v.userRole === 'worker').length,
    admin: db.visitors.filter((v) => v.userRole === 'admin').length,
  }
  
  const byDeviceType: Record<string, number> = {
    desktop: db.visitors.filter((v) => v.deviceType === 'desktop').length,
    mobile: db.visitors.filter((v) => v.deviceType === 'mobile').length,
    tablet: db.visitors.filter((v) => v.deviceType === 'tablet').length,
  }
  
  const byBrowser: Record<string, number> = {
    Chrome: db.visitors.filter((v) => v.browser === 'Chrome').length,
    Safari: db.visitors.filter((v) => v.browser === 'Safari').length,
    Firefox: db.visitors.filter((v) => v.browser === 'Firefox').length,
    Edge: db.visitors.filter((v) => v.browser === 'Edge').length,
    Other: db.visitors.filter((v) => !v.browser || v.browser === 'Other').length,
  }
  
  const byOS: Record<string, number> = {
    Windows: db.visitors.filter((v) => v.os === 'Windows').length,
    macOS: db.visitors.filter((v) => v.os === 'macOS').length,
    Android: db.visitors.filter((v) => v.os === 'Android').length,
    iOS: db.visitors.filter((v) => v.os === 'iOS').length,
    Linux: db.visitors.filter((v) => v.os === 'Linux').length,
    Other: db.visitors.filter((v) => !v.os || v.os === 'Other').length,
  }
  
  return {
    totalVisitors,
    registeredVisitors,
    anonymousVisitors,
    yesterdayVisitors,
    lastWeekVisitors,
    totalPageViews,
    byRole,
    byDeviceType,
    byBrowser,
    byOS,
  }
}
