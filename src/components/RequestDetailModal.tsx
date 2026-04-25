import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useDBSnapshot } from '../lib/hooks'
import type { ServiceRequest } from '../lib/types'
import { selectWorker, customerConfirmInspection, customerRejectInspectionWithAlternate, approveQuote, customerConfirmInspectionCompleted, customerConfirmWorkCompleted, customerConfirmWorkSchedule, customerRejectWorkScheduleWithAlternate } from '../lib/db'
import RequestTimeline from './RequestTimeline'
import { X, Wrench, MapPin, DollarSign, Clock, User, Star, CheckCircle, XCircle } from 'lucide-react'

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

// Work Schedule Confirmation Section Component
function WorkScheduleConfirmationSection({ req, customerId }: { req: ServiceRequest; customerId: string }) {
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
            style={{ background: '#F43F5E' }}
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
          style={{ background: '#10B981' }}
        >
          <CheckCircle className="w-5 h-5 inline mr-1" />
          Confirm
        </button>
        <button
          onClick={() => setShowRejectForm(true)}
          className="flex-1 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all"
          style={{ background: '#F43F5E' }}
        >
          <XCircle className="w-5 h-5 inline mr-1" />
          Reject + Propose
        </button>
      </div>
    </div>
  )
}

// Inspection Confirmation Section Component
function InspectionConfirmationSection({ req, customerId }: { req: ServiceRequest; customerId: string }) {
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
            style={{ background: '#F43F5E' }}
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
          className="flex-1 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          style={{ background: '#10B981' }}
        >
          <CheckCircle className="w-5 h-5" />
          Confirm
        </button>
        <button
          onClick={() => setShowRejectForm(true)}
          className="flex-1 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          style={{ background: '#F43F5E' }}
        >
          <XCircle className="w-5 h-5" />
          Reject + Propose
        </button>
      </div>
    </div>
  )
}

export default function RequestDetailModal({
  req: initialReq,
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
  // Get fresh request data from DB
  const req = useMemo(() => db.requests.find((r) => r.id === initialReq.id) ?? initialReq, [db.requests, initialReq])
  const [justSelectedWorkerId, setJustSelectedWorkerId] = useState<string | null>(null)
  const worker = useMemo(() => db.workers.find((w) => w.id === req.acceptedWorkerId), [db.workers, req.acceptedWorkerId])
  const interested = useMemo(() => db.workers.filter((w) => (req.interestedWorkerIds ?? []).includes(w.id)), [db.workers, req.interestedWorkerIds])
  const offers = req.quoteOffers ?? []
  const canSelectWorker = (req.status === 'open' || req.status === 'pending_customer_confirmation') && !req.acceptedWorkerId && !justSelectedWorkerId

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
                      {canSelectWorker ? (
                        <button
                          onClick={() => {
                            setJustSelectedWorkerId(w.id)
                            selectWorker({ requestId: req.id, customerId, workerId: w.id })
                          }}
                          className="px-4 py-2 rounded-lg font-medium text-sm text-white shadow-md hover:shadow-lg transition-all"
                          style={{ background: THEME.primary }}
                        >
                          Select
                        </button>
                      ) : justSelectedWorkerId === w.id || req.acceptedWorkerId === w.id ? (
                        <button
                          disabled
                          className="px-4 py-2 rounded-lg font-medium text-sm text-green-700 bg-green-100 cursor-default"
                        >
                          <CheckCircle className="w-4 h-4 inline mr-1" />
                          Selected
                        </button>
                      ) : null}
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

          {/* Inspection Confirmation UI */}
          {req.status === 'inspection_pending_customer_confirmation' && (
            <InspectionConfirmationSection req={req} customerId={customerId} />
          )}

          {/* Quote Approval UI */}
          {req.status === 'quote_pending_approval' && req.quote && (
            <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Quote Received</h3>
              <div className="text-2xl font-bold mb-3" style={{ color: THEME.primary }}>MVR {req.quote.amount}</div>
              {req.quote.notes && <p className="text-sm text-gray-600 mb-3">{req.quote.notes}</p>}
              <button
                onClick={() => approveQuote({ requestId: req.id, customerId })}
                className="w-full py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all"
                style={{ background: THEME.primary }}
              >
                Approve Quote
              </button>
            </div>
          )}

          {/* Inspection Completed Confirmation */}
          {req.status === 'inspection_completed_pending_customer_confirm' && (
            <div className="p-4 rounded-2xl border border-purple-200 bg-purple-50">
              <p className="text-sm text-gray-600 mb-3">Inspection completed. Please confirm to proceed.</p>
              <button
                onClick={() => customerConfirmInspectionCompleted({ requestId: req.id, customerId })}
                className="w-full py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all"
                style={{ background: THEME.primary }}
              >
                Confirm Inspection Done
              </button>
            </div>
          )}

          {/* Work Schedule Confirmation */}
          {req.status === 'work_pending_customer_confirmation' && (
            <WorkScheduleConfirmationSection req={req} customerId={customerId} />
          )}

          {/* Work Completed Confirmation */}
          {req.status === 'work_completed_pending_customer_confirm' && (
            <div className="p-4 rounded-2xl border border-orange-200 bg-orange-50">
              <p className="text-sm text-gray-600 mb-3">Worker marked work as completed. Please confirm.</p>
              <button
                onClick={() => customerConfirmWorkCompleted({ requestId: req.id, customerId })}
                className="w-full py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all"
                style={{ background: THEME.primary }}
              >
                Confirm Work Completed
              </button>
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
