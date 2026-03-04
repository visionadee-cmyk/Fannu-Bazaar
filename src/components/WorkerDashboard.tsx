import { useMemo, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import {
  acceptRequest,
  markPayment,
  proposeInspection,
  scheduleWork,
  submitQuoteOffer,
  submitQuote,
  workerCompleteInspection,
  workerCompleteWork,
} from '../lib/db'
import { useDBSnapshot } from '../lib/hooks'
import type { ServiceCategory, ServiceRequest, SessionUser } from '../lib/types'
import WorkerProfileForm from './WorkerProfileForm'
import { 
  Search, Briefcase, CheckCircle, Clock, Star, User, 
  Wrench, DollarSign, Calendar, MapPin, ArrowRight,
  Filter, Award
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

const CATEGORIES = ['All','AC','Plumbing','Electrical','Carpentry','Cleaning','Painting','Appliance','PestControl','Other'] as const

function statusLabel(s: ServiceRequest['status']) { return s.replace(/_/g, ' ') }
function formatIso(iso?: string) {
  if (!iso) return '-'
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function WorkerDashboard({ user }: { user: SessionUser }) {
  const db = useDBSnapshot()
  const [activeTab, setActiveTab] = useState<'browse' | 'assigned' | 'completed' | 'actions' | 'profile'>('browse')
  const [browseCategory, setBrowseCategory] = useState<ServiceCategory | 'All'>('All')
  const [browseQuery, setBrowseQuery] = useState('')

  const myAssigned = useMemo(() => db.requests.filter((r) => r.acceptedWorkerId === user.id), [db.requests, user.id])
  const myActiveAssigned = useMemo(() => myAssigned.filter((r) => r.status !== 'completed'), [myAssigned])
  const myCompletedAssigned = useMemo(() => myAssigned.filter((r) => r.status === 'completed'), [myAssigned])
  const needsMyAction = useMemo(() => myAssigned.filter((r) => ['inspection_pending_worker_proposal','inspection_scheduled','awaiting_quote','work_pending_worker_schedule','work_scheduled','payment_pending'].includes(r.status)), [myAssigned])
  const openRequests = useMemo(() => {
    const q = browseQuery.trim().toLowerCase()
    return db.requests.filter((r) => r.status === 'open').filter((r) => (browseCategory === 'All' ? true : r.category === browseCategory)).filter((r) => !q || r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.location.toLowerCase().includes(q))
  }, [browseCategory, browseQuery, db.requests])
  const worker = useMemo(() => db.workers.find((w) => w.id === user.id), [db.workers, user.id])

  const tabs = [
    { id: 'browse', label: 'Browse', count: openRequests.length, icon: Search },
    { id: 'assigned', label: 'My Jobs', count: myActiveAssigned.length, icon: Briefcase },
    { id: 'actions', label: 'Action Needed', count: needsMyAction.length, icon: Clock },
    { id: 'completed', label: 'Completed', count: myCompletedAssigned.length, icon: CheckCircle },
    { id: 'profile', label: 'Profile', count: null, icon: User },
  ]

  return (
    <div className="min-h-screen" style={{ background: THEME.bg }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="sticky top-0 z-10 backdrop-blur-xl border-b border-gray-200/50" style={{ background: 'rgba(255,255,255,0.9)' }}>
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: THEME.primary }}>
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Welcome back, {user.name}</h1>
                <p className="text-sm text-gray-500">Worker Dashboard</p>
              </div>
            </div>
            {worker && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium" style={{ background: THEME.primaryLight, color: THEME.primaryDark }}>
                  <Star className="w-4 h-4 fill-current" />
                  <span>{worker.ratingAvg.toFixed(1)}</span>
                </div>
                <div className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                  {worker.jobsDone} jobs
                </div>
              </div>
            )}
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
          {activeTab === 'browse' && (
            <div className="space-y-4">
              <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500" value={browseCategory} onChange={(e) => setBrowseCategory(e.target.value as ServiceCategory | 'All')}>
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Search Requests</label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-12 pr-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500" value={browseQuery} onChange={(e) => setBrowseQuery(e.target.value)} placeholder="Search by title, description, location..." />
                    </div>
                  </div>
                </div>
              </div>
              {openRequests.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4"><Search className="w-8 h-8 text-gray-400" /></div>
                  <h3 className="text-lg font-semibold text-gray-800">No requests found</h3>
                  <p className="text-gray-500 mt-1">Try adjusting your search or category filter</p>
                </div>
              ) : (
                <div className="grid gap-4">{openRequests.map((r) => <OpenRequestCard key={r.id} req={r} workerId={user.id} recommended={!!worker?.categories.includes(r.category)} />)}</div>
              )}
            </div>
          )}

          {activeTab === 'assigned' && (
            <div className="space-y-4">
              {myActiveAssigned.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center mx-auto mb-4"><Briefcase className="w-8 h-8" style={{ color: THEME.primary }} /></div>
                  <h3 className="text-lg font-semibold text-gray-800">No assigned jobs</h3>
                  <p className="text-gray-500 mt-1 mb-4">Browse open requests and express interest</p>
                  <button onClick={() => setActiveTab('browse')} className="px-6 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all" style={{ background: THEME.primary }}>Browse Requests</button>
                </div>
              ) : <div className="grid gap-4">{myActiveAssigned.map((r) => <WorkerJobCard key={r.id} req={r} />)}</div>}
            </div>
          )}

          {activeTab === 'completed' && (
            <div className="space-y-4">
              {myCompletedAssigned.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-8 h-8 text-gray-400" /></div>
                  <h3 className="text-lg font-semibold text-gray-800">No completed jobs yet</h3>
                  <p className="text-gray-500 mt-1">Your completed jobs will appear here</p>
                </div>
              ) : <div className="grid gap-4">{myCompletedAssigned.map((r) => <WorkerJobCard key={r.id} req={r} />)}</div>}
            </div>
          )}

          {activeTab === 'actions' && (
            <div className="space-y-4">
              {needsMyAction.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-8 h-8 text-green-500" /></div>
                  <h3 className="text-lg font-semibold text-gray-800">All caught up!</h3>
                  <p className="text-gray-500 mt-1">No pending actions at the moment</p>
                </div>
              ) : <div className="grid gap-4">{needsMyAction.map((r) => <WorkerActionCard key={r.id} req={r} workerId={user.id} />)}</div>}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100" style={{ background: THEME.gray50 }}>
                <h2 className="text-xl font-bold text-gray-800">My Profile</h2>
                <p className="text-gray-500">Manage your skills and availability</p>
              </div>
              <div className="p-6"><WorkerProfileForm user={user} /></div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

function CardShell({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden ${className}`}>{children}</div>
}

function StatusBadge({ status }: { status: string }) {
  const statusColors: Record<string, { bg: string; text: string }> = {
    'open': { bg: 'bg-blue-100', text: 'text-blue-700' },
    'pending_customer_confirmation': { bg: 'bg-amber-100', text: 'text-amber-700' },
    'inspection_pending_worker_proposal': { bg: 'bg-purple-100', text: 'text-purple-700' },
    'inspection_scheduled': { bg: 'bg-indigo-100', text: 'text-indigo-700' },
    'awaiting_quote': { bg: 'bg-pink-100', text: 'text-pink-700' },
    'work_pending_worker_schedule': { bg: 'bg-cyan-100', text: 'text-cyan-700' },
    'work_scheduled': { bg: 'bg-orange-100', text: 'text-orange-700' },
    'payment_pending': { bg: 'bg-rose-100', text: 'text-rose-700' },
    'completed': { bg: 'bg-green-100', text: 'text-green-700' },
  }
  const colors = statusColors[status] || { bg: 'bg-gray-100', text: 'text-gray-700' }
  return <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>{statusLabel(status)}</span>
}

function OpenRequestCard({ req, workerId, recommended }: { req: ServiceRequest; workerId: string; recommended: boolean }) {
  const alreadyInterested = (req.interestedWorkerIds ?? []).includes(workerId)
  const myOffer = (req.quoteOffers ?? []).find((o) => o.workerId === workerId)
  const [offerAmount, setOfferAmount] = useState<number>(myOffer?.amount ?? 0)
  const [offerNotes, setOfferNotes] = useState<string>(myOffer?.notes ?? '')

  return (
    <CardShell>
      <div className="p-6 border-b border-gray-100" style={{ background: THEME.gray50 }}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-gray-800">{req.title}</h3>
              {recommended && <span className="px-2 py-0.5 rounded-full text-xs bg-teal-100 text-teal-700 font-medium">Recommended</span>}
            </div>
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
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-gray-500">Urgency: <span className="font-medium" style={{ color: req.urgency === 'urgent' ? '#ef4444' : req.urgency === 'high' ? '#f97316' : '#6b7280' }}>{req.urgency}</span></span>
        </div>
        <div className="grid gap-4">
          <button onClick={() => acceptRequest({ requestId: req.id, workerId })} className={`w-full py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all ${alreadyInterested ? 'bg-gray-100 text-gray-600' : 'text-white'}`} style={alreadyInterested ? {} : { background: THEME.primary }}>
            {alreadyInterested ? 'Already Interested ?' : "I'm Interested"}
          </button>
          <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50">
            <div className="text-sm font-semibold text-gray-700 mb-3">Send Quotation (MVR)</div>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Amount</label>
                <input type="number" min={0} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500" value={offerAmount} onChange={(e) => setOfferAmount(Number(e.target.value))} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Notes (optional)</label>
                <input className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500" value={offerNotes} onChange={(e) => setOfferNotes(e.target.value)} placeholder="Inspection included..." />
              </div>
            </div>
            <button onClick={() => submitQuoteOffer({ requestId: req.id, workerId, amount: offerAmount, notes: offerNotes.trim() || undefined })} className="mt-3 w-full py-3 rounded-xl font-semibold border-2 transition-all" style={{ borderColor: THEME.primary, color: THEME.primary }}>Submit Quotation</button>
          </div>
        </div>
      </div>
    </CardShell>
  )
}

function WorkerJobCard({ req }: { req: ServiceRequest }) {
  const db = useDBSnapshot()
  const customer = useMemo(() => db.customers.find((c) => c.id === req.customerId), [db.customers, req.customerId])

  return (
    <CardShell>
      <div className="p-6 border-b border-gray-100" style={{ background: THEME.gray50 }}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">{req.title}</h3>
            <div className="text-sm" style={{ color: THEME.primary }}>{req.category}</div>
          </div>
          <StatusBadge status={req.status} />
        </div>
      </div>
      <div className="p-6">
        {customer && (
          <div className="mb-4 p-4 rounded-2xl border border-gray-100 bg-gray-50">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center"><User className="w-5 h-5" style={{ color: THEME.primary }} /></div>
              <div><div className="font-semibold text-gray-800">{customer.name}</div></div>
            </div>
            <div className="grid gap-1 text-sm text-gray-600 md:grid-cols-2">
              <div>?? {customer.phone ?? '-'}</div>
              <div>?? {customer.email ?? '-'}</div>
            </div>
          </div>
        )}
        <div className="grid gap-2 text-sm text-gray-600 md:grid-cols-2">
          <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-400" /><span>Inspection: {formatIso(req.inspection?.scheduledFor)}</span></div>
          <div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-gray-400" /><span>Quote: {req.quote?.amount ? `MVR ${req.quote.amount}` : '-'}</span></div>
          <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-400" /><span>Work: {formatIso(req.work?.scheduledFor)}</span></div>
          <div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-gray-400" /><span>Payment: {req.payment?.status ?? '-'}</span></div>
        </div>
      </div>
    </CardShell>
  )
}

function WorkerActionCard({ req, workerId }: { req: ServiceRequest; workerId: string }) {
  const [when, setWhen] = useState(() => new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().slice(0, 16))
  const [amount, setAmount] = useState(1500)
  const [notes, setNotes] = useState('')
  const db = useDBSnapshot()
  const customer = useMemo(() => db.customers.find((c) => c.id === req.customerId), [db.customers, req.customerId])

  return (
    <CardShell className="border-l-4" style={{ borderLeftColor: THEME.primary }}>
      <div className="p-6 border-b border-gray-100" style={{ background: THEME.gray50 }}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">{req.title}</h3>
            <div className="text-sm" style={{ color: THEME.primary }}>{req.category}</div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={req.status} />
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center"><Clock className="w-5 h-5 text-amber-500" /></div>
          </div>
        </div>
      </div>
      <div className="p-6">
        {customer && (
          <div className="mb-4 p-4 rounded-2xl border border-gray-100 bg-gray-50">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center"><User className="w-5 h-5" style={{ color: THEME.primary }} /></div>
              <div><div className="font-semibold text-gray-800">{customer.name}</div></div>
            </div>
            <div className="grid gap-1 text-sm text-gray-600 md:grid-cols-2">
              <div>?? {customer.phone ?? '-'}</div>
              <div>?? {customer.email ?? '-'}</div>
            </div>
          </div>
        )}

        {req.status === 'inspection_pending_worker_proposal' && (
          <div className="p-4 rounded-2xl border border-purple-100 bg-purple-50">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Propose Inspection Date/Time</label>
            <input type="datetime-local" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 mb-3" value={when} onChange={(e) => setWhen(e.target.value)} />
            <button onClick={() => proposeInspection({ requestId: req.id, workerId, whenIso: new Date(when).toISOString() })} className="w-full py-3 rounded-xl font-semibold text-white shadow-lg" style={{ background: THEME.primary }}>Propose Inspection</button>
          </div>
        )}

        {req.status === 'inspection_scheduled' && (
          <div className="p-4 rounded-2xl border border-indigo-100 bg-indigo-50">
            <p className="text-sm text-gray-600 mb-3">Inspection scheduled. Mark as completed when done.</p>
            <button onClick={() => workerCompleteInspection({ requestId: req.id, workerId })} className="w-full py-3 rounded-xl font-semibold text-white shadow-lg" style={{ background: THEME.primary }}>Mark Inspection Completed</button>
          </div>
        )}

        {req.status === 'awaiting_quote' && (
          <div className="p-4 rounded-2xl border border-pink-100 bg-pink-50">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Submit Your Quote</label>
            <div className="grid gap-3 mb-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Amount (MVR)</label>
                <input type="number" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500" value={amount} onChange={(e) => setAmount(Number(e.target.value))} min={0} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Notes (optional)</label>
                <input className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Materials, timeline..." />
              </div>
            </div>
            <button onClick={() => submitQuote({ requestId: req.id, workerId, amount, notes })} className="w-full py-3 rounded-xl font-semibold text-white shadow-lg" style={{ background: THEME.primary }}>Submit Quote</button>
          </div>
        )}

        {req.status === 'work_pending_worker_schedule' && (
          <div className="p-4 rounded-2xl border border-cyan-100 bg-cyan-50">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Schedule Work Date/Time</label>
            <input type="datetime-local" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 mb-3" value={when} onChange={(e) => setWhen(e.target.value)} />
            <button onClick={() => scheduleWork({ requestId: req.id, workerId, whenIso: new Date(when).toISOString() })} className="w-full py-3 rounded-xl font-semibold text-white shadow-lg" style={{ background: THEME.primary }}>Schedule Work</button>
          </div>
        )}

        {req.status === 'work_scheduled' && (
          <div className="p-4 rounded-2xl border border-orange-100 bg-orange-50">
            <p className="text-sm text-gray-600 mb-3">Work is scheduled. Mark as completed when finished.</p>
            <button onClick={() => workerCompleteWork({ requestId: req.id, workerId })} className="w-full py-3 rounded-xl font-semibold text-white shadow-lg" style={{ background: THEME.primary }}>Mark Work Completed</button>
          </div>
        )}

        {req.status === 'payment_pending' && (
          <div className="p-4 rounded-2xl border border-rose-100 bg-rose-50">
            <p className="text-sm text-gray-600 mb-3">Payment is pending. Confirm when received.</p>
            <div className="flex gap-3">
              <button onClick={() => markPayment({ requestId: req.id, workerId, status: 'pending' })} className="flex-1 py-3 rounded-xl font-semibold border-2 border-gray-200 text-gray-600">Keep Pending</button>
              <button onClick={() => markPayment({ requestId: req.id, workerId, status: 'paid' })} className="flex-1 py-3 rounded-xl font-semibold text-white shadow-lg" style={{ background: THEME.primary }}>Mark Paid</button>
            </div>
          </div>
        )}
      </div>
    </CardShell>
  )
}
