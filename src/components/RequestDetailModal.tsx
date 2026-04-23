import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useDBSnapshot } from '../lib/hooks'
import type { ServiceRequest } from '../lib/types'
import { selectWorker } from '../lib/db'
import RequestTimeline from './RequestTimeline'
import { X, Wrench, MapPin, DollarSign, Clock, User, Star } from 'lucide-react'

const THEME = {
  primary: '#10B981',
  primaryDark: '#059669',
  primaryLight: '#D1FAE5',
  bg: '#F0FDF4',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray800: '#1F2937',
}

function formatIso(iso?: string) {
  if (!iso) return '-'
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function statusLabel(s: ServiceRequest['status']) { return s.replace(/_/g, ' ') }

export default function RequestDetailModal({
  req,
  onClose,
  onShowWorkerProfile,
  customerId,
}: {
  req: ServiceRequest
  onClose: () => void
  onShowWorkerProfile: (id: string) => void
  customerId: string
}) {
  const db = useDBSnapshot()
  const worker = useMemo(() => db.workers.find((w) => w.id === req.acceptedWorkerId), [db.workers, req.acceptedWorkerId])
  const interested = useMemo(() => db.workers.filter((w) => (req.interestedWorkerIds ?? []).includes(w.id)), [db.workers, req.interestedWorkerIds])
  const offers = req.quoteOffers ?? []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100 flex-shrink-0" style={{ background: THEME.gray50 }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{req.title}</h2>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1.5"><Wrench className="w-4 h-4" style={{ color: THEME.primary }} />{req.category}</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gray-400" />{req.location}</span>
                <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4 text-gray-400" />MVR {req.budget}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-gray-400" />{req.urgency}</span>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="mt-4">
            <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
              {statusLabel(req.status)}
            </span>
          </div>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
            <p className="text-gray-600">{req.description}</p>
          </div>

          <RequestTimeline req={req} />

          {worker && (
            <div className="p-4 rounded-2xl border border-green-200 bg-green-50">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Assigned Worker</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                    <User className="w-6 h-6" style={{ color: THEME.primary }} />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{worker.name}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-400 fill-current" />
                      {worker.ratingAvg.toFixed(1)} ({worker.ratingCount} reviews)
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onShowWorkerProfile(worker.id)}
                  className="px-4 py-2 rounded-xl font-medium text-sm border border-gray-200 hover:bg-white transition-colors"
                >
                  View Profile
                </button>
              </div>
            </div>
          )}

          {interested.length > 0 && !worker && (
            <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Interested Workers ({interested.length})</h3>
              <div className="space-y-3">
                {interested.map((w) => (
                  <div key={w.id} className="flex items-center justify-between p-3 rounded-xl bg-white border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                        <User className="w-5 h-5" style={{ color: THEME.primary }} />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{w.name}</div>
                        <div className="text-sm text-gray-500">Rating: {w.ratingAvg.toFixed(1)}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onShowWorkerProfile(w.id)}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={() => selectWorker({ requestId: req.id, customerId, workerId: w.id })}
                        className="px-4 py-2 rounded-lg font-medium text-sm text-white shadow-md hover:shadow-lg transition-all"
                        style={{ background: THEME.primary }}
                      >
                        Select
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {offers.length > 0 && (
            <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Quote Offers ({offers.length})</h3>
              <div className="space-y-2">
                {offers.map((o, idx) => {
                  const w = db.workers.find((x) => x.id === o.workerId)
                  return (
                    <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                      <div className="text-sm">
                        <span className="font-medium">{w?.name ?? 'Unknown'}</span>
                        {o.notes && <span className="text-gray-500 ml-2">- {o.notes}</span>}
                      </div>
                      <div className="font-semibold" style={{ color: THEME.primary }}>MVR {o.amount}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
            <div>
              <span className="font-medium">Created:</span> {formatIso(req.createdAt)}
            </div>
            {req.inspection?.scheduledFor && (
              <div>
                <span className="font-medium">Inspection:</span> {formatIso(req.inspection.scheduledFor)}
              </div>
            )}
            {req.work?.scheduledFor && (
              <div>
                <span className="font-medium">Work Scheduled:</span> {formatIso(req.work.scheduledFor)}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
