import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import {
  createRequest,
  createWorker,
  selectWorker,
  customerConfirmInspection,
  customerConfirmInspectionCompleted,
  approveQuote,
  customerConfirmWorkSchedule,
  customerConfirmWorkCompleted,
  customerRejectInspectionWithAlternate,
  customerRejectWorkScheduleWithAlternate,
  generateInvoice,
  markPaidOnSpot,
  markPaymentWithSlip,
  addReview,
  checkUpcomingReminders,
  cancelRequest,
  toggleInspectionRequirement,
} from '../lib/db'
import { useDBSnapshot } from '../lib/hooks'
import WorkerProfileModal from './WorkerProfileModal'
import RequestDetailModal from './RequestDetailModal'
import NotificationBell from './NotificationBell'
import Illustration from './Illustration'
import CategoryPicker from './CategoryPicker'
import type { ServiceCategory, ServiceRequest, SessionUser, WorkerProfile } from '../lib/types'
import type { CustomerTab } from './BottomNav'
import { ALL_CATEGORIES, getCategoryFormConfig } from '../lib/categoryConfig'
import { Search, Briefcase, CheckCircle, Plus, Star, User,
  Wrench, DollarSign, MapPin, Clock, AlertCircle, FileText, RefreshCw, Phone, Upload, X, ImageIcon, Loader2 } from 'lucide-react'
import { uploadImageToCloudinary } from '../lib/cloudinary'

const THEME = {
  primary: '#10B981',
  primaryDark: '#059669',
  primaryLight: '#D1FAE5',
  bg: '#F0FDF4',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray800: '#1F2937',
  white: '#FFFFFF',
  amber: '#F59E0B',
  blue: '#3B82F6',
  purple: '#8B5CF6',
  indigo: '#6366F1',
  rose: '#F43F5E',
}


function statusLabel(s: ServiceRequest['status']) { return s.replace(/_/g, ' ') }
function formatIso(iso?: string) {
  if (!iso) return '-'
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

interface CustomerDashboardProps {
  user: SessionUser;
  activeTab?: CustomerTab;
  onTabChange?: (tab: CustomerTab) => void;
}

export default function CustomerDashboard({ user, activeTab: externalTab, onTabChange }: CustomerDashboardProps) {
  const db = useDBSnapshot()
  const [internalTab, setInternalTab] = useState<CustomerTab>('my')
  const activeTab = externalTab ?? internalTab
  const setActiveTab = (tab: CustomerTab) => {
    setInternalTab(tab)
    onTabChange?.(tab)
  }
  const [workerCategory, setWorkerCategory] = useState<ServiceCategory | 'All'>('All')
  const [workerSubcategory, setWorkerSubcategory] = useState<string | undefined>(undefined)
  const [workerQuery, setWorkerQuery] = useState('')
  const [profileModalWorkerId, setProfileModalWorkerId] = useState<string | null>(null)
  const [detailRequest, setDetailRequest] = useState<ServiceRequest | null>(null)
  const [reminders, setReminders] = useState<ReturnType<typeof checkUpcomingReminders>>([])
  const [showRegisterWorker, setShowRegisterWorker] = useState(false)

  // Check if this user already has a worker profile
  const existingWorker = useMemo(() => {
    const customer = db.customers.find((c) => c.id === user.id)
    if (!customer?.email) return null
    return db.workers.find((w) => w.email?.toLowerCase() === customer.email.toLowerCase())
  }, [db.customers, db.workers, user.id])

  useEffect(() => {
    if (activeTab !== 'create') return
    const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 639px)').matches
    if (!isMobile) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [activeTab])

  useEffect(() => {
    const interval = setInterval(() => {
      setReminders(checkUpcomingReminders(user.id, 'customer'))
    }, 60000)
    setReminders(checkUpcomingReminders(user.id, 'customer'))
    return () => clearInterval(interval)
  }, [user.id])

  const myRequests = useMemo(() => db.requests.filter((r: ServiceRequest) => r.customerId === user.id), [db.requests, user.id])
  const myActiveRequests = useMemo(() => myRequests.filter((r) => r.status !== 'completed'), [myRequests])
  const myCompletedRequests = useMemo(() => myRequests.filter((r) => r.status === 'completed'), [myRequests])
  const needsMyAction = useMemo(() => myRequests.filter((r: ServiceRequest) =>
    ['pending_customer_confirmation','inspection_pending_customer_confirmation','inspection_completed_pending_customer_confirm','quote_pending_approval','work_pending_customer_confirmation','work_completed_pending_customer_confirm'].includes(r.status)), [myRequests])
  const reviewsByRequest = useMemo(() => {
    const map = new Map<string, true>()
    db.reviews.filter((r) => r.customerId === user.id).forEach((r) => map.set(r.requestId, true))
    return map
  }, [db.reviews, user.id])
  const workers = useMemo(() => {
    const q = workerQuery.trim().toLowerCase()
    const sub = (workerSubcategory ?? '').trim().toLowerCase()
    const filtered = db.workers
      .filter((w) => (workerCategory === 'All' ? true : w.categories.includes(workerCategory)))
      .filter((w) => (!sub ? true : w.skills.some((s) => s.toLowerCase().includes(sub)) || (w.about ?? '').toLowerCase().includes(sub)))
      .filter(
        (w) =>
          !q ||
          w.name.toLowerCase().includes(q) ||
          w.categories.join(',').toLowerCase().includes(q) ||
          w.skills.join(',').toLowerCase().includes(q) ||
          (w.about ?? '').toLowerCase().includes(q)
      )
      .sort((a, b) => (b.ratingAvg ?? 0) - (a.ratingAvg ?? 0))
    return filtered
  }, [db.workers, workerCategory, workerQuery, workerSubcategory])

  const tabs = [
    { id: 'my', label: 'My Requests', count: myActiveRequests.length, icon: Briefcase },
    { id: 'create', label: 'New Request', count: null, icon: Plus },
    { id: 'confirm', label: 'Needs Action', count: needsMyAction.length, icon: Clock },
    { id: 'workers', label: 'Find Workers', count: null, icon: Search },
    { id: 'completed', label: 'Completed', count: myCompletedRequests.length, icon: CheckCircle },
  ]

  const mobileTabLabel = (id: (typeof tabs)[number]['id']) => {
    if (id === 'my') return 'My'
    if (id === 'create') return 'New'
    if (id === 'confirm') return 'Action'
    if (id === 'workers') return 'Workers'
    return 'Done'
  }

  return (
    <div className="min-h-screen" style={{ background: THEME.bg }}>
      {activeTab === 'create' && (
        <div className="sm:hidden fixed inset-0 z-[9999]">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setActiveTab('my')}
            aria-label="Close"
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[92vh] overflow-y-auto rounded-t-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between gap-3 p-4 border-b border-gray-100" style={{ background: THEME.gray50 }}>
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-gray-900 truncate">Create New Request</h2>
                <p className="text-sm text-gray-500 truncate">Fill details to get matched with workers</p>
              </div>
              <button
                type="button"
                className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white"
                onClick={() => setActiveTab('my')}
              >
                Close
              </button>
            </div>
            <div className="p-4">
              <ServiceRequestForm onSubmit={(v) => { createRequest({ customerId: user.id, ...v }); setActiveTab('my') }} />
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="sticky top-0 z-10 backdrop-blur-xl border-b border-gray-200/50" style={{ background: 'rgba(255,255,255,0.95)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 sm:py-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: THEME.primary }}>
                <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-xl font-bold text-gray-900 truncate">Welcome back, {user.name}</h1>
                <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Customer Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden md:block">
                <Illustration
                  filename="Business%20growth-amico.svg"
                  alt="Customer dashboard illustration"
                  className="w-28 h-16 object-contain"
                  loading="eager"
                />
              </div>
              {!existingWorker && (
                <button
                  onClick={() => setShowRegisterWorker(true)}
                  className="hidden sm:flex px-4 py-2 rounded-full text-sm font-semibold bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors items-center gap-2"
                >
                  <Briefcase className="w-4 h-4" />
                  Become a Worker
                </button>
              )}
              <NotificationBell user={user} />
              <span className="hidden sm:inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-green-100 text-green-700">
                {myActiveRequests.length} Active{myActiveRequests.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div className="sm:hidden pb-4">
            <div className="grid grid-cols-2 gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${isActive ? 'text-white shadow-lg shadow-green-500/25' : 'text-gray-700 bg-white hover:bg-gray-50 ring-1 ring-gray-200'}`}
                    style={isActive ? { background: THEME.primary } : {}}
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{mobileTabLabel(tab.id as any)}</span>
                    </span>
                    {tab.count !== null && tab.count > 0 && (
                      <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs ${isActive ? 'bg-white/20' : 'bg-gray-200 text-gray-700'}`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="hidden sm:flex gap-1 overflow-x-auto pb-4 snap-x snap-mandatory" style={{ WebkitOverflowScrolling: 'touch' }}>
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`snap-start flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${isActive ? 'text-white shadow-lg shadow-green-500/25' : 'text-gray-600 hover:bg-gray-100'}`}
                  style={isActive ? { background: THEME.primary } : {}}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.count !== null && tab.count > 0 && <span className={`px-2 py-0.5 rounded-full text-xs ${isActive ? 'bg-white/20' : 'bg-gray-200 text-gray-600'}`}>{tab.count}</span>}
                </button>
              )
            })}
          </div>
        </div>
      </motion.div>

      {/* Reminders Banner */}
      {reminders.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          {reminders.map((r) => (
            <div
              key={`${r.requestId}-${r.type}`}
              className={`mb-2 p-3 rounded-xl flex items-center gap-3 ${
                r.urgency === 'now' ? 'bg-red-100 text-red-800 border border-red-200' :
                r.urgency === '15min' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                'bg-blue-100 text-blue-800 border border-blue-200'
              }`}
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <div className="flex-1">
                <span className="font-semibold">
                  {r.urgency === 'now' ? 'Starting now:' : r.urgency === '15min' ? '15 minutes:' : '30 minutes:'}
                </span>{' '}
                {r.type === 'inspection' ? 'Inspection' : 'Work'} for "{r.title}" at {formatIso(r.scheduledFor)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {activeTab === 'create' && (
            <>
              <div className="hidden sm:block bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100" style={{ background: THEME.gray50 }}>
                  <h2 className="text-xl font-bold text-gray-900">Create New Request</h2>
                  <p className="text-gray-500">Describe your service needs to get matched with skilled workers</p>
                </div>
                <div className="p-6">
                  <ServiceRequestForm onSubmit={(v) => { createRequest({ customerId: user.id, ...v }); setActiveTab('my') }} />
                </div>
              </div>
            </>
          )}

          {activeTab === 'workers' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={workerCategory}
                      onChange={(e) => { setWorkerCategory(e.target.value as any); setWorkerSubcategory(undefined) }}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    >
                      <option value="All">All Categories</option>
                      {ALL_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                    <input
                      type="text"
                      value={workerQuery}
                      onChange={(e) => setWorkerQuery(e.target.value)}
                      placeholder="Search workers by name, skills..."
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setWorkerCategory('All')
                        setWorkerSubcategory(undefined)
                        setWorkerQuery('')
                      }}
                      className="w-full rounded-xl bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>

              {/* Workers Grid */}
              {workers.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-12 text-center">
                  <Illustration
                    filename="Job%20hunt-amico.svg"
                    alt="No workers found"
                    className="w-56 h-40 object-contain mx-auto mb-6"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No workers found</h3>
                  <p className="text-gray-500">Try adjusting your search or filters</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {workers.map((w) => <WorkerCard key={w.id} worker={w} onShowProfile={setProfileModalWorkerId} />)}
                </div>
              )}
            </div>
          )}

          {activeTab === 'my' && (
            <div className="space-y-4">
              {myActiveRequests.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-12 text-center">
                  <Illustration
                    filename="Work%20in%20progress-amico.svg"
                    alt="No active requests"
                    className="w-56 h-40 object-contain mx-auto mb-6"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No active requests</h3>
                  <p className="text-gray-500 mb-6">Create a new request to get started with finding skilled workers</p>
                  <button onClick={() => setActiveTab('create')} className="px-8 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all" style={{ background: THEME.primary }}>Create Request</button>
                </div>
              ) : (
                myActiveRequests.map((r: ServiceRequest) => <CustomerRequestCard key={r.id} req={r} userId={user.id} hasReviewed={reviewsByRequest.has(r.id)} onShowWorkerProfile={setProfileModalWorkerId} onViewDetails={setDetailRequest} />)
              )}
            </div>
          )}

          {activeTab === 'completed' && (
            <div className="space-y-4">
              {myCompletedRequests.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-12 text-center">
                  <Illustration
                    filename="Processing-cuate.svg"
                    alt="No completed jobs"
                    className="w-56 h-40 object-contain mx-auto mb-6"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No completed jobs</h3>
                  <p className="text-gray-500">Your completed requests will appear here</p>
                </div>
              ) : (
                myCompletedRequests.map((r: ServiceRequest) => <CustomerRequestCard key={r.id} req={r} userId={user.id} hasReviewed={reviewsByRequest.has(r.id)} onShowWorkerProfile={setProfileModalWorkerId} onViewDetails={setDetailRequest} />)
              )}
            </div>
          )}

          {activeTab === 'confirm' && (
            <div className="space-y-4">
              {needsMyAction.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-12 text-center">
                  <Illustration
                    filename="Soft%20skills-pana.svg"
                    alt="All caught up"
                    className="w-56 h-40 object-contain mx-auto mb-6"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">All caught up!</h3>
                  <p className="text-gray-500">Nothing needs your attention right now</p>
                </div>
              ) : (
                needsMyAction.map((r: ServiceRequest) => <CustomerActionCard key={r.id} req={r} customerId={user.id} onShowWorkerProfile={setProfileModalWorkerId} />)
              )}
            </div>
          )}
        </motion.div>
      </div>

      {profileModalWorkerId && <WorkerProfileModal workerId={profileModalWorkerId} onClose={() => setProfileModalWorkerId(null)} />}
      {detailRequest && (
        <RequestDetailModal
          req={detailRequest}
          onClose={() => setDetailRequest(null)}
          onShowWorkerProfile={setProfileModalWorkerId}
          customerId={user.id}
        />
      )}
      {showRegisterWorker && (
        <RegisterWorkerModal
          customerId={user.id}
          onClose={() => setShowRegisterWorker(false)}
        />
      )}
    </div>
  )
}

function RegisterWorkerModal({ customerId, onClose }: { customerId: string; onClose: () => void }) {
  const db = useDBSnapshot()
  const customer = db.customers.find((c) => c.id === customerId)

  const [name, setName] = useState(customer?.name || '')
  const [phone, setPhone] = useState(customer?.phone || '')
  const [categories, setCategories] = useState<string[]>([])
  const [skills, setSkills] = useState('')
  const [about, setAbout] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customer?.email) return

    setIsSubmitting(true)
    createWorker({
      name: name.trim(),
      email: customer.email,
      phone: phone.trim() || undefined,
      active: true,
    })

    // Get the newly created worker and update with additional details
    const newWorker = db.workers.find((w) => w.email?.toLowerCase() === customer.email?.toLowerCase())
    if (newWorker) {
      const skillList = skills.split(',').map((s) => s.trim()).filter(Boolean)
      Object.assign(newWorker, {
        categories: categories.length > 0 ? categories : ['Other'],
        skills: skillList,
        about: about.trim() || undefined,
      })
    }

    setIsSubmitting(false)
    onClose()
    alert('You are now registered as a worker! Please log out and log back in to access the Worker Dashboard.')
  }

  const toggleCategory = (cat: string) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 p-4 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: THEME.amber }}>
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Become a Worker</h2>
              <p className="text-sm text-gray-500">Offer your services and earn</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <span className="sr-only">Close</span>
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Your name as it will appear to customers"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="+960..."
            />
            <p className="text-xs text-gray-500 mt-1">Customers will see this to contact you</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Service Categories <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-2">Select all that apply</p>
            <div className="flex flex-wrap gap-2">
              {ALL_CATEGORIES.map((cat) => {
                const selected = categories.includes(cat)
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      selected
                        ? 'bg-amber-100 text-amber-700 ring-1 ring-amber-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>
            {categories.length === 0 && (
              <p className="text-xs text-red-500 mt-1">Please select at least one category</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Skills</label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="e.g., AC repair, plumbing, painting, electrical..."
            />
            <p className="text-xs text-gray-500 mt-1">Separate multiple skills with commas</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">About You</label>
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 min-h-[100px]"
              placeholder="Describe your experience, expertise, and what makes you a great choice..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || categories.length === 0 || !name.trim()}
              className="flex-1 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              style={{ background: THEME.primary }}
            >
              {isSubmitting ? 'Creating...' : 'Register as Worker'}
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Your email ({customer?.email}) will be used for both customer and worker accounts.
          </p>
        </form>
      </motion.div>
    </div>
  )
}

function CardShell({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow ${className}`}>{children}</div>
}

function StatusBadge({ status }: { status: ServiceRequest['status'] }) {
  const statusColors: Record<string, { bg: string; text: string }> = {
    'open': { bg: 'bg-blue-100', text: 'text-blue-700' },
    'pending_customer_confirmation': { bg: 'bg-amber-100', text: 'text-amber-700' },
    'inspection_pending_worker_proposal': { bg: 'bg-purple-100', text: 'text-purple-700' },
    'inspection_pending_customer_confirmation': { bg: 'bg-indigo-100', text: 'text-indigo-700' },
    'inspection_scheduled': { bg: 'bg-cyan-100', text: 'text-cyan-700' },
    'awaiting_quote': { bg: 'bg-pink-100', text: 'text-pink-700' },
    'quote_pending_approval': { bg: 'bg-amber-100', text: 'text-amber-700' },
    'work_scheduled': { bg: 'bg-orange-100', text: 'text-orange-700' },
    'payment_pending': { bg: 'bg-rose-100', text: 'text-rose-700' },
    'completed': { bg: 'bg-green-100', text: 'text-green-700' },
  }
  const colors = statusColors[status] || { bg: 'bg-gray-100', text: 'text-gray-700' }
  return <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>{statusLabel(status)}</span>
}

function ServiceRequestForm({
  onSubmit,
}: {
  onSubmit: (values: {
    category: ServiceCategory
    subcategory?: string
    title: string
    description: string
    location: string
    budget: number
    urgency: 'low' | 'medium' | 'high'
    requiresInspection?: boolean
    categorySpecificData?: Record<string, string | number | boolean | string[]>
    images?: string[]
  }) => void
}) {
  const [category, setCategory] = useState<ServiceCategory>('AC')
  const [subcategory, setSubcategory] = useState<string | undefined>(undefined)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [budget, setBudget] = useState<number>(1000)
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high'>('medium')
  const [requiresInspection, setRequiresInspection] = useState(true)
  const [showCategoryPicker, setShowCategoryPicker] = useState(true)
  const [categorySpecificData, setCategorySpecificData] = useState<Record<string, string | number | boolean | string[]>>({})
  const [images, setImages] = useState<string[]>([])
  const [uploadingImages, setUploadingImages] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const detailsRef = useRef<HTMLDivElement | null>(null)

  // Get category-specific form fields
  const categoryFields = useMemo(() => getCategoryFormConfig(category), [category])
  const hasCustomFields = categoryFields.length > 0

  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 639px)').matches

  const goToDetails = () => {
    setShowCategoryPicker(false)
    if (isMobile) {
      requestAnimationFrame(() => {
        detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }
  }

  // Handle category-specific field changes
  const handleFieldChange = (fieldName: string, value: string | number | boolean | string[]) => {
    setCategorySpecificData((prev) => ({ ...prev, [fieldName]: value }))
  }

  // Clear category-specific data when category changes
  const handleCategoryChange = (newCategory: ServiceCategory) => {
    setCategory(newCategory)
    setCategorySpecificData({})
    setSubcategory(undefined)
  }

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit({
          category,
          subcategory,
          title: title.trim(),
          description: description.trim(),
          location: location.trim(),
          budget,
          urgency,
          requiresInspection,
          categorySpecificData: hasCustomFields ? categorySpecificData : undefined,
          images: images.length > 0 ? images : undefined,
        })
      }}
    >
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-gray-800 truncate">Inspection required?</div>
          <div className="text-xs text-gray-500 truncate">Turn off if worker can quote without inspection</div>
        </div>
        <button
          type="button"
          onClick={() => setRequiresInspection((v) => !v)}
          className={`shrink-0 rounded-full px-3 py-2 text-xs font-semibold ring-1 ${requiresInspection ? 'bg-emerald-600 text-white ring-emerald-600' : 'bg-white text-gray-700 ring-gray-200'}`}
        >
          {requiresInspection ? 'Yes' : 'No'}
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <div className="flex items-center justify-between gap-3 mb-2">
            <label className="block text-sm font-semibold text-gray-800">Service Category</label>
            {!showCategoryPicker && (
              <button
                type="button"
                className="text-sm font-semibold text-green-700"
                onClick={() => setShowCategoryPicker(true)}
              >
                Change
              </button>
            )}
          </div>

          {showCategoryPicker ? (
            <>
              <CategoryPicker
                category={category}
                subcategory={subcategory}
                onChange={(next) => {
                  if (next.category === 'All') return
                  handleCategoryChange(next.category)
                  setSubcategory(next.subcategory)
                  goToDetails()
                }}
                className="mb-4"
              />
              <select
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={category}
                onChange={(e) => {
                  handleCategoryChange(e.target.value as ServiceCategory)
                  goToDetails()
                }}
              >
                {ALL_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </>
          ) : (
            <div className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800">
              <div className="font-semibold">{category}</div>
              {subcategory ? <div className="text-sm text-gray-500">{subcategory}</div> : null}
            </div>
          )}
        </div>
        <div ref={detailsRef}>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Title</label>
          <input className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., AC not cooling" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2">Description</label>
        <textarea className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[120px]" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the problem or service needed in detail..." />
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Location</label>
          <input className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Your address" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Budget (MVR)</label>
          <input type="number" min={0} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500" value={budget} onChange={(e) => setBudget(Number(e.target.value))} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Urgency</label>
          <select className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500" value={urgency} onChange={(e) => setUrgency(e.target.value as any)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {/* Category-specific fields */}
      {hasCustomFields && (
        <div className="border-t border-gray-200 pt-5 mt-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Wrench className="w-4 h-4 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-900">{category} Details</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {categoryFields.map((field) => (
              <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field.helperText && (
                  <p className="text-xs text-gray-500 mb-1.5">{field.helperText}</p>
                )}
                {field.type === 'select' && (
                  <select
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={(categorySpecificData[field.name] as string) || ''}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    required={field.required}
                  >
                    <option value="">Select {field.label}</option>
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                )}
                {field.type === 'multiselect' && (
                  <div className="flex flex-wrap gap-2">
                    {field.options?.map((opt) => {
                      const selected = ((categorySpecificData[field.name] as string[]) || []).includes(opt)
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            const current = (categorySpecificData[field.name] as string[]) || []
                            const updated = selected
                              ? current.filter((c) => c !== opt)
                              : [...current, opt]
                            handleFieldChange(field.name, updated)
                          }}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                            selected
                              ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {opt}
                        </button>
                      )
                    })}
                  </div>
                )}
                {field.type === 'text' && (
                  <input
                    type="text"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder={field.placeholder}
                    value={(categorySpecificData[field.name] as string) || ''}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    required={field.required}
                  />
                )}
                {field.type === 'number' && (
                  <input
                    type="number"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    min={field.min}
                    max={field.max}
                    step={field.step || 1}
                    value={(categorySpecificData[field.name] as number) || ''}
                    onChange={(e) => handleFieldChange(field.name, Number(e.target.value))}
                    required={field.required}
                  />
                )}
                {field.type === 'date' && (
                  <input
                    type="date"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={(categorySpecificData[field.name] as string) || ''}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    required={field.required}
                  />
                )}
                {field.type === 'time' && (
                  <input
                    type="time"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={(categorySpecificData[field.name] as string) || ''}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    required={field.required}
                  />
                )}
                {field.type === 'textarea' && (
                  <textarea
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[80px]"
                    placeholder={field.placeholder}
                    value={(categorySpecificData[field.name] as string) || ''}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    required={field.required}
                  />
                )}
                {field.type === 'checkbox' && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      checked={(categorySpecificData[field.name] as boolean) || false}
                      onChange={(e) => handleFieldChange(field.name, e.target.checked)}
                    />
                    <span className="text-sm text-gray-700">Yes</span>
                  </label>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image Upload */}
      <div className="border-t border-gray-200 pt-4 mt-2">
        <div className="flex items-center gap-2 mb-3">
          <ImageIcon className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-900">Upload Images (Optional)</span>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          multiple
          className="hidden"
          onChange={async (e) => {
            const files = e.target.files
            if (files) {
              setUploadingImages(true)
              try {
                for (const file of Array.from(files)) {
                  if (images.length >= 5) break
                  const imageUrl = await uploadImageToCloudinary(file)
                  setImages((prev) => [...prev, imageUrl])
                }
              } catch (error) {
                alert('Failed to upload image. Please try again.')
              } finally {
                setUploadingImages(false)
                if (fileInputRef.current) {
                  fileInputRef.current.value = ''
                }
              }
            }
          }}
        />
        <div className="flex flex-wrap gap-2 mb-3">
          {images.map((img, idx) => (
            <div key={idx} className="relative">
              <img src={img} alt={`Upload ${idx + 1}`} className="w-20 h-20 object-cover rounded-lg" />
              <button
                type="button"
                onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {uploadingImages && (
            <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-gray-500 animate-spin" />
            </div>
          )}
          {!uploadingImages && images.length < 5 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-emerald-500 hover:text-emerald-500 transition-colors"
            >
              <Upload className="w-6 h-6 mb-1" />
              <span className="text-xs">Add</span>
            </button>
          )}
        </div>
        <p className="text-xs text-gray-500">Upload up to 5 images to help workers understand the job better</p>
      </div>

      <div className="flex gap-4 pt-4">
        <button type="submit" className="px-8 py-3.5 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all" style={{ background: THEME.primary }}>Create Request</button>
      </div>
    </form>
  )
}

function WorkerCard({ worker, onShowProfile }: { worker: WorkerProfile; onShowProfile: (id: string) => void }) {
  return (
    <CardShell>
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: THEME.primaryLight }}>
              <Wrench className="w-5 h-5 sm:w-7 sm:h-7" style={{ color: THEME.primary }} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">{worker.businessName || worker.name}</h3>
              {worker.tagline && <p className="text-xs sm:text-sm text-gray-500 mt-0.5 truncate">{worker.tagline}</p>}
              <div className="flex items-center gap-2 sm:gap-3 mt-1 flex-wrap">
                <span className="flex items-center gap-1 text-xs sm:text-sm font-medium text-amber-600"><Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" /> {worker.ratingAvg.toFixed(1)}</span>
                <span className="text-xs sm:text-sm text-gray-500">{worker.jobsDone} jobs</span>
                {worker.isVerified && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">Verified</span>
                )}
              </div>
            </div>
          </div>
          <button onClick={() => onShowProfile(worker.id)} className="w-full sm:w-auto px-4 py-2 rounded-xl font-medium text-sm border border-gray-200 hover:bg-gray-50 transition-colors">View Profile</button>
        </div>
        {worker.about && <p className="mt-3 sm:mt-4 text-gray-600 text-xs sm:text-sm line-clamp-2">{worker.about}</p>}
        
        {/* Services with Prices */}
        {worker.services && worker.services.length > 0 && (
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
            <h4 className="text-xs sm:text-sm font-semibold text-gray-800 mb-2">Services & Prices</h4>
            <div className="space-y-1.5 sm:space-y-2">
              {worker.services.slice(0, 5).map((service, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-gray-600 truncate flex-1">{service.name}</span>
                  <span className="font-medium text-gray-900 ml-2 flex-shrink-0">
                    {service.price > 0 ? `${service.currency} ${service.price}${service.originalPrice ? ` (was ${service.originalPrice})` : ''}` : 'Quote'}
                  </span>
                </div>
              ))}
              {worker.services.length > 5 && (
                <p className="text-xs text-gray-500 mt-1">+{worker.services.length - 5} more services</p>
              )}
            </div>
          </div>
        )}
        
        {/* Contact Info */}
        {worker.contactInfo && (worker.contactInfo.phone || worker.contactInfo.whatsapp) && (
          <div className="mt-3 sm:mt-4 flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
            {worker.contactInfo.phone && (
              <a href={`tel:${worker.contactInfo.phone}`} className="flex items-center gap-1.5 text-green-700 hover:text-green-800" onClick={(e) => e.stopPropagation()}>
                <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> {worker.contactInfo.phone}
              </a>
            )}
          </div>
        )}
        
        {/* Location */}
        {worker.locationInfo && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
            <MapPin className="w-3 h-3" />
            {worker.locationInfo.serviceArea}
          </div>
        )}
        
        {/* Promotional Offer */}
        {worker.promotionalOffer?.active && (
          <div className="mt-3 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200">
            <p className="text-xs font-medium text-amber-800">
              {worker.promotionalOffer.title}: {worker.promotionalOffer.description}
            </p>
          </div>
        )}
      </div>
    </CardShell>
  )
}

function CustomerRequestCard({ req, userId, onShowWorkerProfile, onViewDetails }: { req: ServiceRequest; userId: string; hasReviewed: boolean; onShowWorkerProfile: (id: string) => void; onViewDetails?: (req: ServiceRequest) => void }) {
  const db = useDBSnapshot()
  const worker = useMemo(() => db.workers.find((w) => w.id === req.acceptedWorkerId), [db.workers, req.acceptedWorkerId])
  const interestedCount = (req.interestedWorkerIds ?? []).length
  const offers = req.quoteOffers ?? []

  // Check if request can be cancelled
  const canCancel = ['open', 'pending_customer_confirmation', 'inspection_pending_worker_proposal', 'inspection_pending_customer_confirmation', 'inspection_scheduled', 'awaiting_quote', 'quote_pending_approval'].includes(req.status)

  return (
    <CardShell>
      <div className="p-6 border-b border-gray-100" style={{ background: THEME.gray50 }}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h3 className="text-lg font-bold text-gray-900">{req.title}</h3>
              {req.isRecurring && (
                <span className="px-2.5 py-1 rounded-full text-xs bg-blue-100 text-blue-700 font-medium flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" /> {req.recurringFrequency} • {req.recurringDiscount}% off
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
              <span className="flex items-center gap-1.5"><Wrench className="w-4 h-4" style={{ color: THEME.primary }} />{req.category}</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gray-400" />{req.location}</span>
              <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4 text-gray-400" />MVR {req.budget}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {interestedCount > 0 && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                {interestedCount} interested
              </span>
            )}
            <StatusBadge status={req.status} />
            {onViewDetails && (
              <button
                onClick={() => onViewDetails(req)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 transition-colors"
              >
                Open
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="p-6">
        <p className="text-gray-600 mb-4">{req.description}</p>
        {(req.contactName || req.contactPhone) && (
          <div className="mb-4 p-3 rounded-xl bg-blue-50 border border-blue-100">
            <p className="text-sm font-medium text-gray-800 mb-1">Contact on-site:</p>
            {req.contactName && <p className="text-sm text-gray-600 flex items-center gap-1"><User className="w-3 h-3" /> {req.contactName}</p>}
            {req.contactPhone && <p className="text-sm text-gray-600 flex items-center gap-1"><Phone className="w-3 h-3" /> {req.contactPhone}</p>}
          </div>
        )}
        {/* Display uploaded images */}
        {req.images && req.images.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Attached Images:</p>
            <div className="flex flex-wrap gap-2">
              {req.images.map((img, idx) => (
                <img key={idx} src={img} alt={`Request image ${idx + 1}`} className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80" onClick={() => window.open(img, '_blank')} />
              ))}
            </div>
          </div>
        )}

        {/* Toggle Inspection Requirement - only before inspection completed */}
        {['open', 'pending_customer_confirmation', 'inspection_pending_worker_proposal', 'inspection_pending_customer_confirmation', 'inspection_scheduled'].includes(req.status) && (
          <div className="mb-4 p-4 rounded-2xl border border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-gray-800 truncate">Inspection Required?</div>
                <div className="text-xs text-gray-500 truncate">Turn off if worker can quote without seeing the site</div>
              </div>
              <button
                onClick={() => toggleInspectionRequirement({ requestId: req.id, customerId: userId, requiresInspection: !req.requiresInspection })}
                className={`shrink-0 rounded-full px-3 py-2 text-xs font-semibold ring-1 transition-all ${req.requiresInspection !== false ? 'bg-emerald-600 text-white ring-emerald-600' : 'bg-white text-gray-700 ring-gray-200'}`}
              >
                {req.requiresInspection !== false ? 'Yes' : 'No'}
              </button>
            </div>
          </div>
        )}

        {worker && (
          <div className="mb-4 p-4 rounded-2xl border border-emerald-200 bg-emerald-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center"><User className="w-5 h-5 text-emerald-600" /></div>
                <div><div className="font-semibold text-gray-900">{worker.name}</div><div className="text-sm text-emerald-600 font-medium">✓ Selected Worker</div></div>
              </div>
              <button onClick={() => onShowWorkerProfile(worker.id)} className="px-3 py-1.5 rounded-lg text-sm font-medium text-emerald-600 hover:bg-emerald-100 transition-colors">View</button>
            </div>
          </div>
        )}
        {offers.length > 0 && (
          <div className="mt-4 p-4 rounded-2xl border border-gray-200 bg-gray-50">
            <div className="text-sm font-semibold text-gray-800 mb-2">Quotation Offers ({offers.length})</div>
            <div className="space-y-2">
              {offers.slice(0, 3).map((o, idx) => {
                const w = db.workers.find((x) => x.id === o.workerId)
                return (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                    <div className="text-sm"><span className="font-medium">{w?.name ?? 'Unknown'}</span>{o.notes && <span className="text-gray-500 ml-2">- {o.notes}</span>}</div>
                    <div className="font-semibold" style={{ color: THEME.primary }}>MVR {o.amount}</div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Cancel Button */}
        {canCancel && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                if (confirm('Are you sure you want to cancel this request?')) {
                  cancelRequest({ requestId: req.id, customerId: userId })
                }
              }}
              className="w-full py-2.5 rounded-xl font-medium text-sm text-red-600 bg-red-50 hover:bg-red-100 transition-colors border border-red-200"
            >
              Cancel Request
            </button>
          </div>
        )}
      </div>
    </CardShell>
  )
}

function CustomerActionCard({ req, customerId, onShowWorkerProfile }: { req: ServiceRequest; customerId: string; onShowWorkerProfile: (id: string) => void }) {
  const db = useDBSnapshot()
  const interested = useMemo(() => db.workers.filter((w) => (req.interestedWorkerIds ?? []).includes(w.id)), [db.workers, req.interestedWorkerIds])

  return (
    <CardShell className="border-l-4 border-green-500">
      <div className="p-6 border-b border-gray-100" style={{ background: THEME.gray50 }}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">{req.title}</h3>
            <div className="text-sm font-medium" style={{ color: THEME.primary }}>{req.category}</div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={req.status} />
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center"><Clock className="w-5 h-5 text-amber-500" /></div>
          </div>
        </div>
      </div>
      <div className="p-6">
        {req.status === 'pending_customer_confirmation' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50">
              <div className="text-sm font-semibold text-gray-800 mb-3">Interested Workers ({interested.length})</div>
              {interested.length === 0 ? <p className="text-sm text-gray-600">No workers have expressed interest yet.</p> : (
                <div className="space-y-2">
                  {interested.map((w) => (
                    <div key={w.id} className="flex items-center justify-between p-3 rounded-xl bg-white border border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center"><Wrench className="w-5 h-5" style={{ color: THEME.primary }} /></div>
                        <div><div className="font-semibold text-gray-900">{w.name}</div><div className="text-sm text-gray-500">Rating: {w.ratingAvg.toFixed(1)}</div></div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => onShowWorkerProfile(w.id)} className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">View</button>
                        <button onClick={() => selectWorker({ requestId: req.id, customerId, workerId: w.id })} className="px-4 py-2 rounded-lg font-medium text-sm text-white shadow-md hover:shadow-lg transition-all" style={{ background: THEME.primary }}>Select</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

          {req.status === 'inspection_pending_customer_confirmation' && (
          <InspectionConfirmationUI req={req} customerId={customerId} />
        )}

        {req.status === 'inspection_completed_pending_customer_confirm' && (
          <div className="p-4 rounded-2xl border border-purple-200 bg-purple-50">
            <p className="text-sm text-gray-600 mb-3">Inspection completed. Please confirm to proceed to quotation.</p>
            <button onClick={() => customerConfirmInspectionCompleted({ requestId: req.id, customerId })} className="w-full py-3.5 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all" style={{ background: THEME.primary }}>Confirm Inspection Done</button>
          </div>
        )}

        {req.status === 'quote_pending_approval' && req.quote && (
          <div className="p-4 rounded-2xl border border-pink-200 bg-pink-50">
            <div className="text-sm font-semibold text-gray-800 mb-2">Quote Received</div>
            <div className="text-2xl font-bold mb-3" style={{ color: THEME.primary }}>MVR {req.quote.amount}</div>
            {req.quote.notes && <p className="text-sm text-gray-600 mb-3">{req.quote.notes}</p>}
            <div className="flex gap-3">
              <button onClick={() => approveQuote({ requestId: req.id, customerId })} className="flex-1 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all" style={{ background: THEME.primary }}>Approve Quote</button>
            </div>
          </div>
        )}

        {req.status === 'work_pending_customer_confirmation' && (
          <WorkConfirmationUI req={req} customerId={customerId} />
        )}

        {req.status === 'work_completed_pending_customer_confirm' && (
          <div className="p-4 rounded-2xl border border-orange-200 bg-orange-50">
            <p className="text-sm text-gray-600 mb-3">Worker marked work as completed. Please confirm.</p>
            <button onClick={() => customerConfirmWorkCompleted({ requestId: req.id, customerId })} className="w-full py-3.5 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all" style={{ background: THEME.primary }}>Confirm Work Completed</button>
          </div>
        )}

        {req.status === 'payment_pending' && (
          <PaymentAndInvoiceUI req={req} customerId={customerId} />
        )}
      </div>
    </CardShell>
  )
}

function InspectionConfirmationUI({ req, customerId }: { req: ServiceRequest; customerId: string }) {
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [alternateTime, setAlternateTime] = useState('')
  const pendingProposal = req.inspection?.proposals?.find((p) => p.status === 'pending')

  if (showRejectForm) {
    return (
      <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50">
        <p className="text-sm font-semibold text-gray-800 mb-3">Propose alternate inspection time</p>
        <textarea
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          placeholder="Reason for rejecting current time..."
          className="w-full p-3 rounded-xl border border-gray-200 mb-3 text-sm"
          rows={2}
        />
        <input
          type="datetime-local"
          value={alternateTime}
          onChange={(e) => setAlternateTime(e.target.value)}
          className="w-full p-3 rounded-xl border border-gray-200 mb-3 text-sm"
        />
        <div className="flex gap-3">
          <button
            onClick={() => setShowRejectForm(false)}
            className="flex-1 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (rejectionReason && alternateTime) {
                customerRejectInspectionWithAlternate({
                  requestId: req.id,
                  customerId,
                  rejectionReason,
                  alternateTimeIso: new Date(alternateTime).toISOString(),
                })
              }
            }}
            disabled={!rejectionReason || !alternateTime}
            className="flex-1 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            style={{ background: THEME.rose }}
          >
            Send Alternate
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 rounded-2xl border border-indigo-200 bg-indigo-50">
      <p className="text-sm font-semibold text-gray-800 mb-2">
        Inspection proposed for:{' '}
        <span className="font-bold">{formatIso(pendingProposal?.scheduledFor ?? req.inspection?.scheduledFor)}</span>
      </p>
      {pendingProposal?.rejectionReason && (
        <p className="text-xs text-rose-600 mb-3">Previous rejection: {pendingProposal.rejectionReason}</p>
      )}
      <div className="flex gap-3">
        <button
          onClick={() => customerConfirmInspection({ requestId: req.id, customerId })}
          className="flex-1 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all"
          style={{ background: THEME.primary }}
        >
          Confirm
        </button>
        <button
          onClick={() => setShowRejectForm(true)}
          className="flex-1 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all"
          style={{ background: THEME.rose }}
        >
          Reject + Propose
        </button>
      </div>
    </div>
  )
}

function WorkConfirmationUI({ req, customerId }: { req: ServiceRequest; customerId: string }) {
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [alternateTime, setAlternateTime] = useState('')
  const pendingProposal = req.work?.proposals?.find((p) => p.status === 'pending')

  if (showRejectForm) {
    return (
      <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50">
        <p className="text-sm font-semibold text-gray-800 mb-3">Propose alternate work time</p>
        <textarea
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          placeholder="Reason for rejecting current time..."
          className="w-full p-3 rounded-xl border border-gray-200 mb-3 text-sm"
          rows={2}
        />
        <input
          type="datetime-local"
          value={alternateTime}
          onChange={(e) => setAlternateTime(e.target.value)}
          className="w-full p-3 rounded-xl border border-gray-200 mb-3 text-sm"
        />
        <div className="flex gap-3">
          <button
            onClick={() => setShowRejectForm(false)}
            className="flex-1 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (rejectionReason && alternateTime) {
                customerRejectWorkScheduleWithAlternate({
                  requestId: req.id,
                  customerId,
                  rejectionReason,
                  alternateTimeIso: new Date(alternateTime).toISOString(),
                })
              }
            }}
            disabled={!rejectionReason || !alternateTime}
            className="flex-1 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            style={{ background: THEME.rose }}
          >
            Send Alternate
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 rounded-2xl border border-cyan-200 bg-cyan-50">
      <p className="text-sm font-semibold text-gray-800 mb-2">
        Work scheduled for:{' '}
        <span className="font-bold">{formatIso(pendingProposal?.scheduledFor ?? req.work?.scheduledFor)}</span>
      </p>
      {pendingProposal?.rejectionReason && (
        <p className="text-xs text-rose-600 mb-3">Previous rejection: {pendingProposal.rejectionReason}</p>
      )}
      <div className="flex gap-3">
        <button
          onClick={() => customerConfirmWorkSchedule({ requestId: req.id, customerId })}
          className="flex-1 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all"
          style={{ background: THEME.primary }}
        >
          Confirm
        </button>
        <button
          onClick={() => setShowRejectForm(true)}
          className="flex-1 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all"
          style={{ background: THEME.rose }}
        >
          Reject + Propose
        </button>
      </div>
    </div>
  )
}

function PaymentAndInvoiceUI({ req, customerId }: { req: ServiceRequest; customerId: string }) {
  const [showInvoiceForm, setShowInvoiceForm] = useState(false)
  const [invoiceAmount, setInvoiceAmount] = useState(req.quote?.amount?.toString() || '')
  const [invoiceDesc, setInvoiceDesc] = useState('')
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'bank_transfer' | 'cash' | 'other'>('bank_transfer')
  const [paymentSlipUrl, setPaymentSlipUrl] = useState('')
  const [uploadingSlip, setUploadingSlip] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [rating, setRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')

  // Check if payment is already marked
  const isPaymentMarked = req.payment?.status === 'pending' || req.payment?.status === 'paid'
  const isPaymentConfirmed = req.payment?.status === 'paid'

  if (showReviewForm && isPaymentConfirmed) {
    return (
      <div className="p-4 rounded-2xl border border-yellow-200 bg-yellow-50">
        <p className="text-sm font-semibold text-gray-800 mb-3">Leave a Review</p>
        <div className="mb-3">
          <label className="block text-xs text-gray-500 mb-1">Rating (1-10)</label>
          <input
            type="range"
            min="1"
            max="10"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-center font-semibold text-lg" style={{ color: THEME.primary }}>{rating}/10</div>
        </div>
        <textarea
          value={reviewComment}
          onChange={(e) => setReviewComment(e.target.value)}
          placeholder="How was the work? Write your review..."
          className="w-full p-3 rounded-xl border border-gray-200 mb-3 text-sm"
          rows={3}
        />
        <div className="flex gap-3">
          <button
            onClick={() => setShowReviewForm(false)}
            className="flex-1 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (req.acceptedWorkerId) {
                addReview({
                  requestId: req.id,
                  customerId,
                  rating: rating as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10,
                  comment: reviewComment,
                })
              }
            }}
            className="flex-1 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all"
            style={{ background: THEME.primary }}
          >
            Submit Review
          </button>
        </div>
      </div>
    )
  }

  if (showPaymentForm) {
    return (
      <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50">
        <p className="text-sm font-semibold text-gray-800 mb-3">Upload Payment Proof</p>
        <div className="mb-3">
          <label className="block text-xs text-gray-500 mb-1">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as 'bank_transfer' | 'cash' | 'other')}
            className="w-full p-3 rounded-xl border border-gray-200 text-sm"
          >
            <option value="bank_transfer">Bank Transfer</option>
            <option value="cash">Cash</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="block text-xs text-gray-500 mb-1">Payment Slip / Receipt</label>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={async (e) => {
              const file = e.target.files?.[0]
              if (file) {
                setUploadingSlip(true)
                try {
                  const url = await uploadImageToCloudinary(file)
                  setPaymentSlipUrl(url)
                } catch {
                  alert('Failed to upload. Please try again.')
                } finally {
                  setUploadingSlip(false)
                }
              }
            }}
            className="w-full text-sm"
          />
          {uploadingSlip && <p className="text-xs text-gray-500 mt-1">Uploading...</p>}
          {paymentSlipUrl && <p className="text-xs text-green-600 mt-1">✓ Uploaded successfully</p>}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowPaymentForm(false)}
            className="flex-1 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (paymentSlipUrl) {
                markPaymentWithSlip({
                  requestId: req.id,
                  customerId,
                  paymentSlipUrl,
                  paymentMethod,
                })
                setShowPaymentForm(false)
              }
            }}
            disabled={!paymentSlipUrl || uploadingSlip}
            className="flex-1 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            style={{ background: THEME.primary }}
          >
            Submit Payment
          </button>
        </div>
      </div>
    )
  }

  if (showInvoiceForm) {
    return (
      <div className="p-4 rounded-2xl border border-purple-200 bg-purple-50">
        <p className="text-sm font-semibold text-gray-800 mb-3">Generate Invoice</p>
        <input
          type="number"
          value={invoiceAmount}
          onChange={(e) => setInvoiceAmount(e.target.value)}
          placeholder="Amount (MVR)"
          className="w-full p-3 rounded-xl border border-gray-200 mb-3 text-sm"
        />
        <textarea
          value={invoiceDesc}
          onChange={(e) => setInvoiceDesc(e.target.value)}
          placeholder="Description of work done..."
          className="w-full p-3 rounded-xl border border-gray-200 mb-3 text-sm"
          rows={2}
        />
        <div className="flex gap-3">
          <button
            onClick={() => setShowInvoiceForm(false)}
            className="flex-1 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (invoiceAmount && invoiceDesc) {
                generateInvoice({
                  requestId: req.id,
                  customerId,
                  amount: Number(invoiceAmount),
                  description: invoiceDesc,
                })
              }
            }}
            disabled={!invoiceAmount || !invoiceDesc}
            className="flex-1 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            style={{ background: THEME.primary }}
          >
            Generate Invoice
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50">
      {/* Payment Status */}
      {isPaymentConfirmed ? (
        <>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-semibold text-gray-800">Payment Confirmed</span>
          </div>
          <p className="text-sm text-gray-600 mb-3">Worker confirmed payment received. Thank you!</p>
          <button
            onClick={() => setShowReviewForm(true)}
            className="w-full py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all"
            style={{ background: THEME.primary }}
          >
            Leave a Review
          </button>
        </>
      ) : isPaymentMarked ? (
        <>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-semibold text-gray-800">Payment Pending Confirmation</span>
          </div>
          <p className="text-sm text-gray-600 mb-3">You marked payment. Waiting for worker to confirm receipt.</p>
          {req.payment?.paymentSlipUrl && (
            <div className="mb-3 p-2 rounded-lg bg-white">
              <p className="text-xs text-gray-500 mb-1">Payment Slip:</p>
              <a href={req.payment.paymentSlipUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">View Receipt</a>
            </div>
          )}
        </>
      ) : req.invoice ? (
        <>
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-semibold text-gray-800">Invoice #{req.invoice.id.slice(-6)}</span>
          </div>
          <div className="text-2xl font-bold mb-2" style={{ color: THEME.primary }}>MVR {req.invoice.amount}</div>
          <p className="text-sm text-gray-600 mb-3">{req.invoice.description}</p>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setShowPaymentForm(true)}
              className="flex-1 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all"
              style={{ background: THEME.primary }}
            >
              Upload Payment
            </button>
            <button
              onClick={() => markPaidOnSpot({ requestId: req.id, customerId })}
              className="flex-1 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all"
              style={{ background: THEME.gray800 }}
            >
              Paid on Spot
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm text-gray-600 mb-3">No invoice generated. Worker should provide invoice or you can mark as paid.</p>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setShowInvoiceForm(true)}
              className="flex-1 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all"
              style={{ background: THEME.primary }}
            >
              Generate Invoice
            </button>
            <button
              onClick={() => setShowPaymentForm(true)}
              className="flex-1 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all"
              style={{ background: THEME.primary }}
            >
              Upload Payment
            </button>
            <button
              onClick={() => markPaidOnSpot({ requestId: req.id, customerId })}
              className="flex-1 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all"
              style={{ background: THEME.gray800 }}
            >
              Paid on Spot
            </button>
          </div>
        </>
      )}
    </div>
  )
}
