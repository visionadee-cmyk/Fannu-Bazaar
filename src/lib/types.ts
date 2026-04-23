export type Role = 'customer' | 'worker' | 'admin'

export type ServiceCategory =
  // Home Services (1-12)
  | 'AC'
  | 'Plumbing'
  | 'Electrical'
  | 'Carpentry'
  | 'Cleaning'
  | 'Painting'
  | 'Appliance'
  | 'PestControl'
  | 'Masonry'
  | 'Welding'
  | 'Moving'
  | 'Gardening'
  // Construction & Renovation (13-20)
  | 'CivilWorks'
  | 'Roofing'
  | 'Flooring'
  | 'Waterproofing'
  | 'InteriorDesign'
  | 'Renovation'
  | 'Scaffolding'
  | 'Demolition'
  // Technical & IT (21-28)
  | 'IT'
  | 'CCTV'
  | 'Networking'
  | 'SecuritySystems'
  | 'Solar'
  | 'Generator'
  | 'Elevator'
  | 'FireSafety'
  // Beauty & Personal Care (29-34)
  | 'Beauty'
  | 'Barber'
  | 'Spa'
  | 'Massage'
  | 'Fitness'
  | 'Yoga'
  // Events & Media (35-42)
  | 'Photography'
  | 'Videography'
  | 'EventPlanning'
  | 'Catering'
  | 'Bartending'
  | 'DJ'
  | 'Decoration'
  | 'Entertainment'
  // Professional Services (43-48)
  | 'Tutoring'
  | 'Legal'
  | 'Accounting'
  | 'Consulting'
  | 'Translation'
  | 'Writing'
  // Transportation & Logistics (49-54)
  | 'Delivery'
  | 'Driving'
  | 'Logistics'
  | 'Courier'
  | 'BikeRepair'
  | 'AutoRepair'
  // Other Specialized (55-60)
  | 'Laundry'
  | 'Tailoring'
  | 'PetCare'
  | 'ChildCare'
  | 'ElderCare'
  | 'Other'

export type ServiceRequestStatus =
  | 'open'
  | 'pending_customer_confirmation'
  | 'inspection_pending_worker_proposal'
  | 'inspection_pending_customer_confirmation'
  | 'inspection_scheduled'
  | 'inspection_completed_pending_customer_confirm'
  | 'awaiting_quote'
  | 'quote_pending_approval'
  | 'work_pending_worker_schedule'
  | 'work_pending_customer_confirmation'
  | 'work_scheduled'
  | 'work_completed_pending_customer_confirm'
  | 'payment_pending'
  | 'completed'

export type SessionUser = {
  id: string
  role: Role
  name: string
}

export type AdminProfile = {
  id: string
  name: string
  email: string
  active: boolean
}

export type CustomerProfile = {
  id: string
  name: string
  email: string
  password?: string
  phone?: string
  active: boolean
}

export type WorkerProfile = {
  id: string
  name: string
  email?: string
  password?: string
  phone?: string
  whatsapp?: string
  viber?: string
  categories: ServiceCategory[]
  skills: string[]
  about?: string
  promoPosterUrl?: string
  ratingAvg: number
  ratingCount: number
  jobsDone: number
  active: boolean
}

export type Review = {
  id: string
  createdAt: string
  requestId: string
  customerId: string
  workerId: string
  rating: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  comment?: string
}

export type TimeProposal = {
  proposedAt: string
  scheduledFor: string
  proposedBy: 'worker' | 'customer'
  status: 'pending' | 'accepted' | 'rejected'
  rejectionReason?: string
}

export type InspectionInfo = {
  proposals?: TimeProposal[]
  scheduledFor?: string
  customerConfirmedAt?: string
  workerConfirmedAt?: string
  completedAt?: string
  completedByWorkerAt?: string
  completedConfirmedByCustomerAt?: string
}

export type QuoteInfo = {
  amount?: number
  notes?: string
  submittedAt?: string
  approvedAt?: string
}

export type QuoteOffer = {
  workerId: string
  amount: number
  notes?: string
  submittedAt: string
}

export type WorkInfo = {
  proposals?: TimeProposal[]
  scheduledFor?: string
  scheduledByWorkerAt?: string
  confirmedByCustomerAt?: string
  completedByWorkerAt?: string
  completedConfirmedByCustomerAt?: string
}

export type PaymentInfo = {
  status?: 'pending' | 'paid'
  markedAt?: string
  paidOnSpot?: boolean
  customerMarkedAt?: string
  workerConfirmedAt?: string
}

export type Invoice = {
  id: string
  amount: number
  description: string
  generatedAt: string
  dueDate?: string
  status: 'pending' | 'paid' | 'overdue'
}

export type RecurringFrequency = 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly'

export type ServiceRequest = {
  id: string
  createdAt: string
  status: ServiceRequestStatus
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
  recurringFrequency?: RecurringFrequency
  recurringDiscount?: number

  customerId: string
  interestedWorkerIds?: string[]
  acceptedWorkerId?: string

  quoteOffers?: QuoteOffer[]

  inspection?: InspectionInfo
  quote?: QuoteInfo
  work?: WorkInfo
  payment?: PaymentInfo
  invoice?: Invoice
}

export type Notification = {
  id: string
  userId: string
  userRole: 'customer' | 'worker' | 'admin'
  type: 'worker_selected' | 'quote_received' | 'inspection_scheduled' | 'work_scheduled' | 'work_completed' | 'payment_received' | 'worker_interested' | 'invoice_ready' | 'payment_confirmed'
  title: string
  message: string
  requestId?: string
  read: boolean
  createdAt: string
}

export type DB = {
  admins: AdminProfile[]
  customers: CustomerProfile[]
  workers: WorkerProfile[]
  requests: ServiceRequest[]
  reviews: Review[]
  notifications: Notification[]
}
