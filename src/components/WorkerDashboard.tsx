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
import Illustration from './Illustration'
import CategoryPicker from './CategoryPicker'
import { ALL_CATEGORIES } from '../lib/categoryConfig'
import {
  Search, Briefcase, CheckCircle, Clock, Star, User,
  Wrench, DollarSign, Calendar, MapPin
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
  pink: '#EC4899',
}

const CATEGORIES: Array<ServiceCategory | 'All'> = ['All', ...ALL_CATEGORIES]

function statusLabel(s: ServiceRequest['status']) { return s.replace(/_/g, ' ') }
function formatIso(iso?: string) {
  if (!iso) return '-'
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function WorkerDashboard({ user }: { user: SessionUser }) {
  const db = useDBSnapshot()
  const [activeTab, setActiveTab] = useState<'browse' | 'assigned' | 'completed' | 'actions' | 'profile'>('browse')
  const [browseCategory, setBrowseCategory] = useState<ServiceCategory | 'All'>('All')
  const [browseSubcategory, setBrowseSubcategory] = useState<string | undefined>(undefined)
  const [browseQuery, setBrowseQuery] = useState('')

  const myAssigned = useMemo(() => db.requests.filter((r) => r.acceptedWorkerId === user.id), [db.requests, user.id])
  const myActiveAssigned = useMemo(() => myAssigned.filter((r) => r.status !== 'completed'), [myAssigned])
  const myCompletedAssigned = useMemo(() => myAssigned.filter((r) => r.status === 'completed'), [myAssigned])
  const needsMyAction = useMemo(() => myAssigned.filter((r) => ['inspection_pending_worker_proposal','inspection_scheduled','awaiting_quote','work_pending_worker_schedule','work_scheduled','payment_pending'].includes(r.status)), [myAssigned])
  const openRequests = useMemo(() => {
    const q = browseQuery.trim().toLowerCase()
    const sub = (browseSubcategory ?? '').trim().toLowerCase()
    return db.requests
      .filter((r) => r.status === 'open')
      .filter((r) => (browseCategory === 'All' ? true : r.category === browseCategory))
      .filter((r) => (!sub ? true : (r.subcategory ?? '').toLowerCase().includes(sub) || r.title.toLowerCase().includes(sub) || r.description.toLowerCase().includes(sub)))
      .filter((r) => !q || r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.location.toLowerCase().includes(q) || (r.subcategory ?? '').toLowerCase().includes(q))
  }, [browseCategory, browseQuery, browseSubcategory, db.requests])
  const worker = useMemo(() => db.workers.find((w) => w.id === user.id), [db.workers, user.id])

  const tabs = [
    { id: 'browse', label: 'Browse Jobs', count: openRequests.length, icon: Search },
    { id: 'assigned', label: 'My Jobs', count: myActiveAssigned.length, icon: Briefcase },
    { id: 'actions', label: 'Action Needed', count: needsMyAction.length, icon: Clock },
    { id: 'completed', label: 'Completed', count: myCompletedAssigned.length, icon: CheckCircle },
    { id: 'profile', label: 'My Profile', count: null, icon: User },
  ]

  return (
    <div className="min-h-screen" style={{ background: THEME.bg }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="sticky top-0 z-10 backdrop-blur-xl border-b border-gray-200/50" style={{ background: 'rgba(255,255,255,0.95)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: THEME.primary }}>
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Welcome back, {user.name}</h1>
                <p className="text-sm text-gray-500">Worker Dashboard</p>
              </div>
            </div>
            {worker && (
              <div className="flex items-center gap-3">
                <div className="hidden md:block">
                  <Illustration
                    filename="Construction%20worker-bro.svg"
                    alt="Worker dashboard illustration"
                    className="w-28 h-16 object-contain"
                    loading="eager"
                  />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium" style={{ background: THEME.primaryLight, color: THEME.primaryDark }}>
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-semibold">{worker.ratingAvg.toFixed(1)}</span>
                </div>
                <div className="px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                  {worker.jobsDone} jobs done
                </div>
              </div>
            )}
          </div>

          {/* Tabs */}
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
          {activeTab === 'browse' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <CategoryPicker
                      allowAllCategory
                      category={browseCategory}
                      subcategory={browseSubcategory}
                      onChange={(next) => {
                        setBrowseCategory(next.category)
                        setBrowseSubcategory(next.subcategory)
                      }}
                      className="mb-4"
                    />
                    <select
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={browseCategory}
                      onChange={(e) => {
                        const next = e.target.value as ServiceCategory | 'All'
                        setBrowseCategory(next)
                        setBrowseSubcategory(undefined)
                      }}
                    >
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Search Requests</label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-12 pr-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500" value={browseQuery} onChange={(e) => setBrowseQuery(e.target.value)} placeholder="Search by title, description, location..." />
                    </div>
                  </div>
                </div>
              </div>

              {/* Jobs List */}
              {openRequests.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-12 text-center">
                  <Illustration
                    filename="Job%20hunt-bro.svg"
                    alt="No requests found"
                    className="w-56 h-40 object-contain mx-auto mb-6"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No requests found</h3>
                  <p className="text-gray-500">Try adjusting your search or category filter</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {openRequests.map((r) => <OpenRequestCard key={r.id} req={r} workerId={user.id} recommended={!!worker?.categories.includes(r.category)} />)}
                </div>
              )}
            </div>
          )}

          {activeTab === 'assigned' && (
            <div className="space-y-4">
              {myActiveAssigned.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-12 text-center">
                  <Illustration
                    filename="Maintenance-bro.svg"
                    alt="No assigned jobs"
                    className="w-56 h-40 object-contain mx-auto mb-6"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No assigned jobs</h3>
                  <p className="text-gray-500 mb-6">Browse open requests and express interest</p>
                  <button onClick={() => setActiveTab('browse')} className="px-8 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all" style={{ background: THEME.primary }}>Browse Requests</button>
                </div>
              ) : (
                myActiveAssigned.map((r) => <WorkerJobCard key={r.id} req={r} />)
              )}
            </div>
          )}

          {activeTab === 'completed' && (
            <div className="space-y-4">
              {myCompletedAssigned.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-12 text-center">
                  <Illustration
                    filename="Work%20in%20progress-pana.svg"
                    alt="No completed jobs yet"
                    className="w-56 h-40 object-contain mx-auto mb-6"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No completed jobs yet</h3>
                  <p className="text-gray-500">Your completed jobs will appear here</p>
                </div>
              ) : (
                myCompletedAssigned.map((r) => <WorkerJobCard key={r.id} req={r} />)
              )}
            </div>
          )}

          {activeTab === 'actions' && (
            <div className="space-y-4">
              {needsMyAction.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-12 text-center">
                  <Illustration
                    filename="Processing-cuate.svg"
                    alt="All caught up"
                    className="w-56 h-40 object-contain mx-auto mb-6"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">All caught up!</h3>
                  <p className="text-gray-500">No pending actions at the moment</p>
                </div>
              ) : (
                needsMyAction.map((r) => <WorkerActionCard key={r.id} req={r} workerId={user.id} />)
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100" style={{ background: THEME.gray50 }}>
                <h2 className="text-xl font-bold text-gray-900">My Profile</h2>
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

function CardShell({ children, className = '', style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  return <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow ${className}`} style={style}>{children}</div>
}

function StatusBadge({ status }: { status: ServiceRequest['status'] }) {
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
  return <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>{statusLabel(status)}</span>
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
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-bold text-gray-900">{req.title}</h3>
              {recommended && <span className="px-2.5 py-1 rounded-full text-xs bg-green-100 text-green-700 font-medium flex items-center gap-1"><Star className="w-3 h-3" /> Recommended</span>}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
              <span className="flex items-center gap-1.5"><Wrench className="w-4 h-4" style={{ color: THEME.primary }} />{req.category}</span>
              <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4 text-gray-400" />MVR {req.budget}</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gray-400" />{req.location}</span>
            </div>
          </div>
          <StatusBadge status={req.status} />
        </div>
      </div>
      <div className="p-6">
        <p className="text-gray-600 mb-4">{req.description}</p>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-gray-500">Urgency: <span className="font-medium" style={{ color: req.urgency === 'high' ? '#f97316' : '#6b7280' }}>{req.urgency}</span></span>
        </div>
        <div className="grid gap-4">
          <button onClick={() => acceptRequest({ requestId: req.id, workerId })} className={`w-full py-3.5 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all ${alreadyInterested ? 'bg-gray-100 text-gray-600 cursor-default' : 'text-white'}`} style={alreadyInterested ? {} : { background: THEME.primary }}>
            {alreadyInterested ? 'Already Interested ✓' : "I'm Interested"}
          </button>
          <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50">
            <div className="text-sm font-semibold text-gray-800 mb-3">Send Quotation (MVR)</div>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Amount</label>
                <input type="number" min={0} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500" value={offerAmount} onChange={(e) => setOfferAmount(Number(e.target.value))} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Notes (optional)</label>
                <input className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500" value={offerNotes} onChange={(e) => setOfferNotes(e.target.value)} placeholder="Inspection included..." />
              </div>
            </div>
            <button onClick={() => submitQuoteOffer({ requestId: req.id, workerId, amount: offerAmount, notes: offerNotes.trim() || undefined })} className="mt-3 w-full py-3 rounded-xl font-semibold border-2 transition-all hover:bg-green-50" style={{ borderColor: THEME.primary, color: THEME.primary }}>Submit Quotation</button>
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
            <h3 className="text-lg font-bold text-gray-900 mb-1">{req.title}</h3>
            <div className="text-sm font-medium" style={{ color: THEME.primary }}>{req.category}</div>
          </div>
          <StatusBadge status={req.status} />
        </div>
      </div>
      <div className="p-6">
        {customer && (
          <div className="mb-4 p-4 rounded-2xl border border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center"><User className="w-5 h-5" style={{ color: THEME.primary }} /></div>
              <div><div className="font-semibold text-gray-900">{customer.name}</div></div>
            </div>
            <div className="grid gap-1 text-sm text-gray-600 md:grid-cols-2">
              <div>📞 {customer.phone ?? '-'}</div>
              <div>✉️ {customer.email ?? '-'}</div>
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
        {customer && (
          <div className="mb-4 p-4 rounded-2xl border border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center"><User className="w-5 h-5" style={{ color: THEME.primary }} /></div>
              <div><div className="font-semibold text-gray-900">{customer.name}</div></div>
            </div>
            <div className="grid gap-1 text-sm text-gray-600 md:grid-cols-2">
              <div>📞 {customer.phone ?? '-'}</div>
              <div>✉️ {customer.email ?? '-'}</div>
            </div>
          </div>
        )}

        {req.status === 'inspection_pending_worker_proposal' && (
          <div className="p-4 rounded-2xl border border-purple-200 bg-purple-50">
            <label className="block text-sm font-semibold text-gray-800 mb-3">Propose Inspection Date/Time</label>
            <input type="datetime-local" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 mb-3" value={when} onChange={(e) => setWhen(e.target.value)} />
            <button onClick={() => proposeInspection({ requestId: req.id, workerId, whenIso: new Date(when).toISOString() })} className="w-full py-3.5 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all" style={{ background: THEME.primary }}>Propose Inspection</button>
          </div>
        )}

        {req.status === 'inspection_scheduled' && (
          <div className="p-4 rounded-2xl border border-indigo-200 bg-indigo-50">
            <p className="text-sm text-gray-600 mb-3">Inspection scheduled. Mark as completed when done.</p>
            <button onClick={() => workerCompleteInspection({ requestId: req.id, workerId })} className="w-full py-3.5 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all" style={{ background: THEME.primary }}>Mark Inspection Completed</button>
          </div>
        )}

        {req.status === 'awaiting_quote' && (
          <div className="p-4 rounded-2xl border border-pink-200 bg-pink-50">
            <label className="block text-sm font-semibold text-gray-800 mb-3">Submit Your Quote</label>
            <div className="grid gap-3 mb-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Amount (MVR)</label>
                <input type="number" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500" value={amount} onChange={(e) => setAmount(Number(e.target.value))} min={0} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Notes (optional)</label>
                <input className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Materials, timeline..." />
              </div>
            </div>
            <button onClick={() => submitQuote({ requestId: req.id, workerId, amount, notes })} className="w-full py-3.5 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all" style={{ background: THEME.primary }}>Submit Quote</button>
          </div>
        )}

        {req.status === 'work_pending_worker_schedule' && (
          <div className="p-4 rounded-2xl border border-cyan-200 bg-cyan-50">
            <label className="block text-sm font-semibold text-gray-800 mb-3">Schedule Work Date/Time</label>
            <input type="datetime-local" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 mb-3" value={when} onChange={(e) => setWhen(e.target.value)} />
            <button onClick={() => scheduleWork({ requestId: req.id, workerId, whenIso: new Date(when).toISOString() })} className="w-full py-3.5 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all" style={{ background: THEME.primary }}>Schedule Work</button>
          </div>
        )}

        {req.status === 'work_scheduled' && (
          <div className="p-4 rounded-2xl border border-orange-200 bg-orange-50">
            <p className="text-sm text-gray-600 mb-3">Work is scheduled. Mark as completed when finished.</p>
            <button onClick={() => workerCompleteWork({ requestId: req.id, workerId })} className="w-full py-3.5 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all" style={{ background: THEME.primary }}>Mark Work Completed</button>
          </div>
        )}

        {req.status === 'payment_pending' && (
          <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50">
            <p className="text-sm text-gray-600 mb-3">Payment is pending. Confirm when received.</p>
            <div className="flex gap-3">
              <button onClick={() => markPayment({ requestId: req.id, workerId, status: 'pending' })} className="flex-1 py-3.5 rounded-xl font-semibold border-2 border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors">Keep Pending</button>
              <button onClick={() => markPayment({ requestId: req.id, workerId, status: 'paid' })} className="flex-1 py-3.5 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all" style={{ background: THEME.primary }}>Mark Paid</button>
            </div>
          </div>
        )}
      </div>
    </CardShell>
  )
}
