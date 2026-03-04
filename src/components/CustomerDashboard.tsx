import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  addReview,
  chooseOffer,
  createRequest,
  customerConfirmInspection,
  customerConfirmInspectionCompleted,
  customerConfirmWorkCompleted,
  customerConfirmWorkSchedule,
  selectWorker,
} from '../lib/db'
import { useDBSnapshot } from '../lib/hooks'
import ServiceRequestForm from './ServiceRequestForm'
import WorkerProfileModal from './WorkerProfileModal'
import type { ServiceCategory, ServiceRequest, SessionUser, WorkerProfile } from '../lib/types'
import { 
  Plus, Search, CheckCircle, Clock, Star, User, Briefcase, 
  ChevronRight, Calendar, DollarSign, MapPin, Wrench
} from 'lucide-react'

const THEME = {
  primary: '#14b8a6',
  primaryDark: '#0d9488',
  primaryLight: '#5eead4',
  bg: '#f0fdfa',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray800: '#1f2937',
}

const CATEGORIES: Array<ServiceCategory | 'All'> = [
  'All', 'AC', 'Plumbing', 'Electrical', 'Carpentry', 
  'Cleaning', 'Painting', 'Appliance', 'PestControl', 'Other'
]

function statusLabel(s: string) { return s.replace(/_/g, ' ') }

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
    { id: 'confirm', label: 'Needs Action', count: needsMyAction.length, icon: CheckCircle },
    { id: 'workers', label: 'Find Workers', count: null, icon: Search },
    { id: 'completed', label: 'Completed', count: myCompletedRequests.length, icon: CheckCircle },
  ]

  return (
    <div className="min-h-screen" style={{ background: THEME.bg }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="sticky top-0 z-10 backdrop-blur-xl border-b border-gray-200/50" style={{ background: 'rgba(255,255,255,0.9)' }}>
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: THEME.primary }}>
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Welcome back, {user.name}</h1>
                <p className="text-sm text-gray-500">Customer Dashboard</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ background: THEME.primaryLight, color: THEME.primaryDark }}>{myActiveRequests.length} Active</span>
          </div>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 px-4 py-3 rounded-2xl font-medium transition-all whitespace-nowrap ${isActive ? 'shadow-lg text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`} style={isActive ? { background: THEME.primary } : {}}>
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.count !== null && tab.count > 0 && <span className={`px-2 py-0.5 rounded-full text-xs ${isActive ? 'bg-white/20' : 'bg-teal-100 text-teal-700'}`}>{tab.count}</span>}
                </button>
              )
            })}
          </div>
        </motion.div>

        <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
          {activeTab === 'create' && (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100" style={{ background: THEME.gray50 }}>
                <h2 className="text-xl font-bold text-gray-800">Create New Request</h2>
                <p className="text-gray-500">Describe your service needs</p>
              </div>
              <div className="p-6">
                <ServiceRequestForm onSubmit={(v) => { createRequest({ customerId: user.id, ...v }); setActiveTab('my') }} />
              </div>
            </div>
          )}

          {activeTab === 'workers' && (
            <div className="space-y-4">
              <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500" value={workerCategory} onChange={(e) => setWorkerCategory(e.target.value as ServiceCategory | 'All')}>
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Search Workers</label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-12 pr-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500" value={workerQuery} onChange={(e) => setWorkerQuery(e.target.value)} placeholder="Name, skill, category..." />
                    </div>
                  </div>
                </div>
              </div>
              {workers.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4"><Search className="w-8 h-8 text-gray-400" /></div>
                  <h3 className="text-lg font-semibold text-gray-800">No workers found</h3>
                  <p className="text-gray-500 mt-1">Try adjusting your search or filters</p>
                </div>
              ) : (
                <div className="grid gap-4">{workers.map((w) => <WorkerCard key={w.id} worker={w} onShowProfile={setProfileModalWorkerId} />)}</div>
              )}
            </div>
          )}

          {activeTab === 'my' && (
            <div className="space-y-4">
              {myActiveRequests.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center mx-auto mb-4"><Briefcase className="w-8 h-8" style={{ color: THEME.primary }} /></div>
                  <h3 className="text-lg font-semibold text-gray-800">No active requests</h3>
                  <p className="text-gray-500 mt-1 mb-4">Create a new request to get started</p>
                  <button onClick={() => setActiveTab('create')} className="px-6 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all" style={{ background: THEME.primary }}>Create Request</button>
                </div>
              ) : myActiveRequests.map((r: ServiceRequest) => <CustomerRequestCard key={r.id} req={r} userId={user.id} hasReviewed={reviewsByRequest.has(r.id)} onShowWorkerProfile={setProfileModalWorkerId} />)}
            </div>
          )}

          {activeTab === 'completed' && (
            <div className="space-y-4">
              {myCompletedRequests.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-8 h-8 text-gray-400" /></div>
                  <h3 className="text-lg font-semibold text-gray-800">No completed jobs</h3>
                  <p className="text-gray-500 mt-1">Your completed requests will appear here</p>
                </div>
              ) : myCompletedRequests.map((r: ServiceRequest) => <CustomerRequestCard key={r.id} req={r} userId={user.id} hasReviewed={reviewsByRequest.has(r.id)} onShowWorkerProfile={setProfileModalWorkerId} />)}
            </div>
          )}

          {activeTab === 'confirm' && (
            <div className="space-y-4">
              {needsMyAction.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-8 h-8 text-green-500" /></div>
                  <h3 className="text-lg font-semibold text-gray-800">All caught up!</h3>
                  <p className="text-gray-500 mt-1">Nothing needs your attention right now</p>
                </div>
              ) : needsMyAction.map((r: ServiceRequest) => <CustomerActionCard key={r.id} req={r} customerId={user.id} onShowWorkerProfile={setProfileModalWorkerId} />)}
            </div>
          )}
        </motion.div>
      </div>

      {profileModalWorkerId && <WorkerProfileModal workerId={profileModalWorkerId} onClose={() => setProfileModalWorkerId(null)} />}
    </div>
  )
}

function CardShell({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden ${className}`}>{children}</div>
}

function StatusBadge({ status }: { status: string }) {
  const statusColors: Record<string, { bg: string; text: string }> = {
    'open': { bg: 'bg-blue-100', text: 'text-blue-700' },
    'pending_customer_confirmation': { bg: 'bg-amber-100', text: 'text-amber-700' },
    'completed': { bg: 'bg-green-100', text: 'text-green-700' },
  }
  const colors = statusColors[status] || { bg: 'bg-gray-100', text: 'text-gray-700' }
  return <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>{statusLabel(status)}</span>
}

function CustomerRequestCard({ req, userId, hasReviewed, onShowWorkerProfile }: any) {
  const db = useDBSnapshot()
  const [rating, setRating] = useState<1 | 2 | 3 | 4 | 5>(5)
  const [comment, setComment] = useState('')
  const interestedWorkers = useMemo(() => (req.interestedWorkerIds ?? []).map((id: string) => db.workers.find((w) => w.id === id)).filter(Boolean) as WorkerProfile[], [db.workers, req.interestedWorkerIds])
  const assignedWorker = useMemo(() => req.acceptedWorkerId ? db.workers.find((w) => w.id === req.acceptedWorkerId) : null, [db.workers, req.acceptedWorkerId])
  const offers = useMemo(() => (req.quoteOffers ?? []).slice().sort((a: any, b: any) => a.amount - b.amount), [req.quoteOffers])

  return (
    <CardShell>
      <div className="p-6 border-b border-gray-100" style={{ background: THEME.gray50 }}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 mb-1">{req.title}</h3>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span className="flex items-center gap-1"><Wrench className="w-4 h-4" style={{ color: THEME.primary }} />{req.category}</span>
              <span className="flex items-center gap-1"><DollarSign className="w-4 h-4 text-gray-400" />MVR {req.budget}</span>
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-gray-400" />{req.location}</span>
            </div>
          </div>
          <StatusBadge status={req.status} />
        </div>
      </div>
      <div className="p-6">
        <p className="text-gray-600 mb-4">{req.description}</p>
        <div className="flex items-center gap-4 mb-6 text-sm">
          <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-400" /><span className="text-gray-600">Inspection: {formatIso(req.inspection?.scheduledFor)}</span></div>
          <div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-gray-400" /><span className="text-gray-600">Quote: {req.quote?.amount ? `MVR ${req.quote.amount}` : '-'}</span></div>
        </div>
        {assignedWorker && (
          <div className="mb-6 p-4 rounded-2xl border border-teal-100" style={{ background: THEME.bg }}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-teal-500 flex items-center justify-center"><User className="w-6 h-6 text-white" /></div>
                <div>
                  <div className="font-semibold text-gray-800">{assignedWorker.name}</div>
                  <div className="flex items-center gap-2 text-sm text-gray-500"><Star className="w-4 h-4 text-amber-400 fill-current" /><span>{assignedWorker.ratingAvg.toFixed(1)} ({assignedWorker.ratingCount})</span><span>•</span><span>{assignedWorker.jobsDone} jobs</span></div>
                </div>
              </div>
              <button onClick={() => onShowWorkerProfile(assignedWorker.id)} className="px-4 py-2 rounded-xl text-sm font-medium border border-teal-200 hover:bg-teal-50 transition-colors" style={{ color: THEME.primary }}>View Profile</button>
            </div>
          </div>
        )}
        {req.status === 'open' && interestedWorkers.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Interested Workers ({interestedWorkers.length})</h4>
            <div className="space-y-2">
              {interestedWorkers.slice(0, 3).map((w) => (
                <div key={w.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center"><User className="w-5 h-5" style={{ color: THEME.primary }} /></div>
                    <div><div className="font-medium text-gray-800">{w.name}</div><div className="text-xs text-gray-500">{w.categories.slice(0, 2).join(', ')}</div></div>
                  </div>
                  <button onClick={() => selectWorker({ requestId: req.id, customerId: userId, workerId: w.id })} className="px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all" style={{ background: THEME.primary }}>Select</button>
                </div>
              ))}
            </div>
          </div>
        )}
        {req.status === 'open' && offers.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Quotations ({offers.length})</h4>
            <div className="space-y-2">
              {offers.slice(0, 3).map((o: any) => (
                <div key={o.workerId} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50">
                  <div><div className="font-medium text-gray-800">{o.worker?.name ?? o.workerId}</div><div className="text-lg font-bold" style={{ color: THEME.primary }}>MVR {o.amount}</div>{o.notes && <div className="text-xs text-gray-500">{o.notes}</div>}</div>
                  <button onClick={() => chooseOffer({ requestId: req.id, customerId: userId, workerId: o.workerId })} className="px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all" style={{ background: THEME.primary }}>Accept</button>
                </div>
              ))}
            </div>
          </div>
        )}
        {req.status === 'completed' && !hasReviewed && (
          <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50">
            <h4 className="text-sm font-semibold text-gray-800 mb-3">Rate this worker</h4>
            <div className="grid gap-3">
              <select className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500" value={rating} onChange={(e) => setRating(Number(e.target.value) as 1 | 2 | 3 | 4 | 5)}>{[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>)}</select>
              <input className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="How was the service? (optional)" />
              <button onClick={() => addReview({ requestId: req.id, customerId: userId, rating, comment: comment.trim() || undefined })} className="w-full py-3 rounded-xl font-semibold text-white shadow-lg" style={{ background: THEME.primary }}>Submit Rating</button>
            </div>
          </div>
        )}
        {hasReviewed && <div className="flex items-center gap-2 text-green-600"><CheckCircle className="w-5 h-5" /><span className="font-medium">Thank you! You rated this job.</span></div>}
      </div>
    </CardShell>
  )
}

function WorkerCard({ worker, onShowProfile }: { worker: WorkerProfile; onShowProfile: (id: string) => void }) {
  return (
    <CardShell className="hover:shadow-xl transition-shadow">
      {worker.promoPosterUrl && <img src={worker.promoPosterUrl} alt="" className="h-48 w-full object-cover" loading="lazy" />}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: THEME.primary }}><User className="w-7 h-7 text-white" /></div>
            <div>
              <h3 className="font-bold text-gray-800">{worker.name}</h3>
              <div className="flex items-center gap-1 text-sm text-gray-500"><Star className="w-4 h-4 text-amber-400 fill-current" /><span className="font-medium text-gray-700">{worker.ratingAvg.toFixed(1)}</span><span>({worker.ratingCount})</span></div>
            </div>
          </div>
          <div className="flex flex-wrap gap-1">{worker.categories.slice(0, 2).map((cat) => <span key={cat} className="px-2 py-1 rounded-lg text-xs font-medium border" style={{ background: THEME.primaryLight, color: THEME.primaryDark, borderColor: THEME.primary }}>{cat}</span>)}</div>
        </div>
        {worker.about && <p className="text-gray-600 text-sm mb-4 line-clamp-2">{worker.about}</p>}
        {worker.skills.length > 0 && <div className="flex flex-wrap gap-2 mb-4">{worker.skills.slice(0, 4).map((skill) => <span key={skill} className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-600">{skill}</span>)}{worker.skills.length > 4 && <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-600">+{worker.skills.length - 4}</span>}</div>}
        <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
          {worker.phone && <div className="flex items-center gap-2 text-gray-600"><div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center"><span className="text-green-600 text-xs">??</span></div><span className="truncate">{worker.phone}</span></div>}
          {worker.whatsapp && <div className="flex items-center gap-2 text-gray-600"><div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center"><span className="text-green-600 text-xs">??</span></div><span className="truncate">{worker.whatsapp}</span></div>}
        </div>
        <button onClick={() => onShowProfile(worker.id)} className="w-full py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all" style={{ background: THEME.primary }}>View Full Profile</button>
      </div>
    </CardShell>
  )
}

function CustomerActionCard({ req, customerId, onShowWorkerProfile }: any) {
  const db = useDBSnapshot()
  const assignedWorker = useMemo(() => req.acceptedWorkerId ? db.workers.find((w) => w.id === req.acceptedWorkerId) : null, [db.workers, req.acceptedWorkerId])
  const actions: Record<string, { label: string; action: () => void }> = {
    'pending_customer_confirmation': { label: 'Confirm Worker', action: () => selectWorker({ requestId: req.id, customerId, workerId: req.acceptedWorkerId! }) },
    'inspection_pending_customer_confirmation': { label: 'Confirm Inspection', action: () => customerConfirmInspection({ requestId: req.id, customerId }) },
    'inspection_completed_pending_customer_confirm': { label: 'Confirm Inspection Completed', action: () => customerConfirmInspectionCompleted({ requestId: req.id, customerId }) },
    'quote_pending_approval': { label: 'Approve Quote (MVR ' + (req.quote?.amount ?? '-') + ')', action: () => customerConfirmWorkSchedule({ requestId: req.id, customerId }) },
    'work_pending_customer_confirmation': { label: 'Confirm Work Schedule', action: () => customerConfirmWorkSchedule({ requestId: req.id, customerId }) },
    'work_completed_pending_customer_confirm': { label: 'Confirm Work Completed', action: () => customerConfirmWorkCompleted({ requestId: req.id, customerId }) },
  }
  const action = actions[req.status]
  if (!action) return null

  return (
    <CardShell className="border-l-4" style={{ borderLeftColor: THEME.primary }}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div><h3 className="text-lg font-bold text-gray-800 mb-1">{req.title}</h3><StatusBadge status={req.status} /></div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center"><Clock className="w-6 h-6 text-amber-500" /></div>
        </div>
        <p className="text-gray-600 mb-4">{req.description}</p>
        {assignedWorker && (
          <div className="mb-4 p-4 rounded-2xl border border-gray-100 bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center"><User className="w-5 h-5" style={{ color: THEME.primary }} /></div>
              <div><div className="font-medium text-gray-800">{assignedWorker.name}</div><div className="text-sm text-gray-500">? {assignedWorker.ratingAvg.toFixed(1)} • {assignedWorker.jobsDone} jobs</div></div>
              <button onClick={() => onShowWorkerProfile(assignedWorker.id)} className="ml-auto text-sm font-medium" style={{ color: THEME.primary }}>View</button>
            </div>
          </div>
        )}
        {req.quote && <div className="mb-4 p-3 rounded-xl bg-teal-50 border border-teal-100"><div className="text-sm text-gray-600">Quote Amount</div><div className="text-2xl font-bold" style={{ color: THEME.primary }}>MVR {req.quote.amount}</div>{req.quote.notes && <div className="text-sm text-gray-500 mt-1">{req.quote.notes}</div>}</div>}
        <button onClick={action.action} className="w-full py-4 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all" style={{ background: THEME.primary }}>{action.label}</button>
      </div>
    </CardShell>
  )
}
