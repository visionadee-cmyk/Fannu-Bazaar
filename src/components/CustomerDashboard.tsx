import { useMemo, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import {
  createRequest,
  selectWorker,
  customerConfirmInspection,
  customerConfirmInspectionCompleted,
  approveQuote,
  customerConfirmWorkSchedule,
  customerConfirmWorkCompleted,
} from '../lib/db'
import { useDBSnapshot } from '../lib/hooks'
import WorkerProfileModal from './WorkerProfileModal'
import Illustration from './Illustration'
import type { ServiceCategory, ServiceRequest, SessionUser, WorkerProfile } from '../lib/types'
import {
  Search, Briefcase, CheckCircle, Plus, Star, User,
  Wrench, DollarSign, MapPin, Clock
} from 'lucide-react'

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

const CATEGORIES = ['All','AC','Plumbing','Electrical','Carpentry','Cleaning','Painting','Appliance','PestControl','Other'] as const

function statusLabel(s: ServiceRequest['status']) { return s.replace(/_/g, ' ') }
function formatIso(iso?: string) {
  if (!iso) return '-'
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function CustomerDashboard({ user }: { user: SessionUser }) {
  const db = useDBSnapshot()
  const [activeTab, setActiveTab] = useState<'create' | 'my' | 'completed' | 'confirm' | 'workers'>('my')
  const [workerCategory, setWorkerCategory] = useState<ServiceCategory | 'All'>('All')
  const [workerQuery, setWorkerQuery] = useState('')
  const [profileModalWorkerId, setProfileModalWorkerId] = useState<string | null>(null)

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
    return db.workers.filter((w) => (workerCategory === 'All' ? true : w.categories.includes(workerCategory))).filter((w) => !q || w.name.toLowerCase().includes(q) || w.categories.join(',').toLowerCase().includes(q) || w.skills.join(',').toLowerCase().includes(q) || (w.about ?? '').toLowerCase().includes(q)).sort((a, b) => (b.ratingAvg ?? 0) - (a.ratingAvg ?? 0))
  }, [db.workers, workerCategory, workerQuery])

  const tabs = [
    { id: 'my', label: 'My Requests', count: myActiveRequests.length, icon: Briefcase },
    { id: 'create', label: 'New Request', count: null, icon: Plus },
    { id: 'confirm', label: 'Needs Action', count: needsMyAction.length, icon: Clock },
    { id: 'workers', label: 'Find Workers', count: null, icon: Search },
    { id: 'completed', label: 'Completed', count: myCompletedRequests.length, icon: CheckCircle },
  ]

  return (
    <div className="min-h-screen" style={{ background: THEME.bg }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="sticky top-0 z-10 backdrop-blur-xl border-b border-gray-200/50" style={{ background: 'rgba(255,255,255,0.95)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: THEME.primary }}>
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Welcome back, {user.name}</h1>
                <p className="text-sm text-gray-500">Customer Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:block">
                <Illustration
                  filename="Business%20growth-amico.svg"
                  alt="Customer dashboard illustration"
                  className="w-28 h-16 object-contain"
                  loading="eager"
                />
              </div>
              <span className="px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-700">
                {myActiveRequests.length} Active Request{myActiveRequests.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-1 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${isActive ? 'text-white shadow-lg shadow-green-500/25' : 'text-gray-600 hover:bg-gray-100'}`} style={isActive ? { background: THEME.primary } : {}}>
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.count !== null && tab.count > 0 && <span className={`px-2 py-0.5 rounded-full text-xs ${isActive ? 'bg-white/20' : 'bg-gray-200 text-gray-600'}`}>{tab.count}</span>}
                </button>
              )
            })}
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {activeTab === 'create' && (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100" style={{ background: THEME.gray50 }}>
                <h2 className="text-xl font-bold text-gray-900">Create New Request</h2>
                <p className="text-gray-500">Describe your service needs to get matched with skilled workers</p>
              </div>
              <div className="p-6">
                <ServiceRequestForm onSubmit={(v) => { createRequest({ customerId: user.id, ...v }); setActiveTab('my') }} />
              </div>
            </div>
          )}

          {activeTab === 'workers' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500" value={workerCategory} onChange={(e) => setWorkerCategory(e.target.value as ServiceCategory | 'All')}>
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Search Workers</label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-12 pr-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500" value={workerQuery} onChange={(e) => setWorkerQuery(e.target.value)} placeholder="Name, skill, category..." />
                    </div>
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
                <div className="grid gap-4">
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
                myActiveRequests.map((r: ServiceRequest) => <CustomerRequestCard key={r.id} req={r} userId={user.id} hasReviewed={reviewsByRequest.has(r.id)} onShowWorkerProfile={setProfileModalWorkerId} />)
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
                myCompletedRequests.map((r: ServiceRequest) => <CustomerRequestCard key={r.id} req={r} userId={user.id} hasReviewed={reviewsByRequest.has(r.id)} onShowWorkerProfile={setProfileModalWorkerId} />)
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

function ServiceRequestForm({ onSubmit }: { onSubmit: (values: { category: ServiceCategory; title: string; description: string; location: string; budget: number; urgency: 'low' | 'medium' | 'high' }) => void }) {
  const [category, setCategory] = useState<ServiceCategory>('AC')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [budget, setBudget] = useState<number>(1000)
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high'>('medium')

  return (
    <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onSubmit({ category, title: title.trim(), description: description.trim(), location: location.trim(), budget, urgency }) }}>
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Service Category</label>
          <select className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500" value={category} onChange={(e) => setCategory(e.target.value as ServiceCategory)}>
            {CATEGORIES.filter(c => c !== 'All').map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
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

      <div className="flex gap-4 pt-4">
        <button type="submit" className="px-8 py-3.5 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all" style={{ background: THEME.primary }}>Create Request</button>
      </div>
    </form>
  )
}

function WorkerCard({ worker, onShowProfile }: { worker: WorkerProfile; onShowProfile: (id: string) => void }) {
  return (
    <CardShell>
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: THEME.primaryLight }}>
              <Wrench className="w-7 h-7" style={{ color: THEME.primary }} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{worker.name}</h3>
              <div className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1 text-sm font-medium text-amber-600"><Star className="w-4 h-4 fill-current" /> {worker.ratingAvg.toFixed(1)}</span>
                <span className="text-sm text-gray-500">{worker.jobsDone} jobs</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {worker.categories.map(c => <span key={c} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-700">{c}</span>)}
              </div>
            </div>
          </div>
          <button onClick={() => onShowProfile(worker.id)} className="px-4 py-2 rounded-xl font-medium text-sm border border-gray-200 hover:bg-gray-50 transition-colors">View Profile</button>
        </div>
        {worker.about && <p className="mt-4 text-gray-600 text-sm line-clamp-2">{worker.about}</p>}
      </div>
    </CardShell>
  )
}

function CustomerRequestCard({ req, onShowWorkerProfile }: { req: ServiceRequest; userId: string; hasReviewed: boolean; onShowWorkerProfile: (id: string) => void }) {
  const db = useDBSnapshot()
  const worker = useMemo(() => db.workers.find((w) => w.id === req.acceptedWorkerId), [db.workers, req.acceptedWorkerId])
  const offers = req.quoteOffers ?? []

  return (
    <CardShell>
      <div className="p-6 border-b border-gray-100" style={{ background: THEME.gray50 }}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2">{req.title}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
              <span className="flex items-center gap-1.5"><Wrench className="w-4 h-4" style={{ color: THEME.primary }} />{req.category}</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gray-400" />{req.location}</span>
              <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4 text-gray-400" />MVR {req.budget}</span>
            </div>
          </div>
          <StatusBadge status={req.status} />
        </div>
      </div>
      <div className="p-6">
        <p className="text-gray-600 mb-4">{req.description}</p>
        {worker && (
          <div className="mb-4 p-4 rounded-2xl border border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center"><User className="w-5 h-5" style={{ color: THEME.primary }} /></div>
                <div><div className="font-semibold text-gray-900">{worker.name}</div><div className="text-sm text-gray-500">Assigned Worker</div></div>
              </div>
              <button onClick={() => onShowWorkerProfile(worker.id)} className="px-3 py-1.5 rounded-lg text-sm font-medium text-green-600 hover:bg-green-50 transition-colors">View</button>
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

          {req.status === 'inspection_pending_customer_confirmation' && req.inspection?.scheduledFor && (
          <div className="p-4 rounded-2xl border border-indigo-200 bg-indigo-50">
            <p className="text-sm font-semibold text-gray-800 mb-3">Inspection proposed for: <span className="font-bold">{formatIso(req.inspection?.scheduledFor)}</span></p>
            <div className="flex gap-3">
              <button onClick={() => customerConfirmInspection({ requestId: req.id, customerId })} className="flex-1 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all" style={{ background: THEME.primary }}>Confirm</button>
            </div>
          </div>
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

        {req.status === 'work_pending_customer_confirmation' && req.work?.scheduledFor && (
          <div className="p-4 rounded-2xl border border-cyan-200 bg-cyan-50">
            <p className="text-sm font-semibold text-gray-800 mb-3">Work scheduled for: <span className="font-bold">{formatIso(req.work?.scheduledFor)}</span></p>
            <div className="flex gap-3">
              <button onClick={() => customerConfirmWorkSchedule({ requestId: req.id, customerId })} className="flex-1 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all" style={{ background: THEME.primary }}>Confirm Schedule</button>
            </div>
          </div>
        )}

        {req.status === 'work_completed_pending_customer_confirm' && (
          <div className="p-4 rounded-2xl border border-orange-200 bg-orange-50">
            <p className="text-sm text-gray-600 mb-3">Worker marked work as completed. Please confirm.</p>
            <button onClick={() => customerConfirmWorkCompleted({ requestId: req.id, customerId })} className="w-full py-3.5 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all" style={{ background: THEME.primary }}>Confirm Work Completed</button>
          </div>
        )}
      </div>
    </CardShell>
  )
}
