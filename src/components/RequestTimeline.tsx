import type { ServiceRequest } from '../lib/types'
import { Check, Clock, Circle } from 'lucide-react'

type TimelineStep = {
  status: ServiceRequest['status']
  label: string
  description: string
}

const workflowSteps: TimelineStep[] = [
  { status: 'open', label: 'Request Created', description: 'Customer created the request' },
  { status: 'pending_customer_confirmation', label: 'Worker Interested', description: 'Worker(s) marked interest' },
  { status: 'inspection_pending_worker_proposal', label: 'Worker Selected', description: 'Customer selected a worker' },
  { status: 'inspection_pending_customer_confirmation', label: 'Inspection Proposed', description: 'Worker proposed inspection date' },
  { status: 'inspection_scheduled', label: 'Inspection Confirmed', description: 'Customer confirmed inspection' },
  { status: 'inspection_completed_pending_customer_confirm', label: 'Inspection Done', description: 'Worker completed inspection' },
  { status: 'awaiting_quote', label: 'Awaiting Quote', description: 'Ready for quotation' },
  { status: 'quote_pending_approval', label: 'Quote Submitted', description: 'Worker submitted quote' },
  { status: 'work_pending_worker_schedule', label: 'Quote Approved', description: 'Customer approved quote' },
  { status: 'work_pending_customer_confirmation', label: 'Work Scheduled', description: 'Worker scheduled work' },
  { status: 'work_scheduled', label: 'Work Confirmed', description: 'Customer confirmed schedule' },
  { status: 'work_completed_pending_customer_confirm', label: 'Work Completed', description: 'Worker finished the job' },
  { status: 'payment_pending', label: 'Payment Pending', description: 'Awaiting payment confirmation' },
  { status: 'completed', label: 'Job Completed', description: 'Job fully completed' },
]

function formatIso(iso?: string) {
  if (!iso) return ''
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function getStepDate(req: ServiceRequest, stepStatus: string): string | undefined {
  switch (stepStatus) {
    case 'open':
      return req.createdAt
    case 'inspection_pending_worker_proposal':
      return req.acceptedWorkerId ? req.createdAt : undefined
    case 'inspection_pending_customer_confirmation':
      return req.inspection?.proposals?.[0]?.proposedAt
    case 'inspection_scheduled':
      return req.inspection?.customerConfirmedAt
    case 'inspection_completed_pending_customer_confirm':
      return req.inspection?.completedByWorkerAt
    case 'awaiting_quote':
      return req.inspection?.completedConfirmedByCustomerAt
    case 'quote_pending_approval':
      return req.quote?.submittedAt
    case 'work_pending_worker_schedule':
      return req.quote?.approvedAt
    case 'work_pending_customer_confirmation':
      return req.work?.scheduledByWorkerAt
    case 'work_scheduled':
      return req.work?.confirmedByCustomerAt
    case 'work_completed_pending_customer_confirm':
      return req.work?.completedByWorkerAt
    case 'payment_pending':
      return req.payment?.markedAt
    case 'completed':
      return req.work?.completedConfirmedByCustomerAt
    default:
      return undefined
  }
}

function getStepState(req: ServiceRequest, _step: TimelineStep, index: number): 'completed' | 'current' | 'pending' {
  const currentIndex = workflowSteps.findIndex(s => s.status === req.status)
  
  if (index < currentIndex) return 'completed'
  if (index === currentIndex) return 'current'
  return 'pending'
}

export default function RequestTimeline({ req }: { req: ServiceRequest }) {
  const relevantSteps = workflowSteps.filter((_step, index) => {
    // Show all steps up to current + 2 future steps for context
    const currentIndex = workflowSteps.findIndex(s => s.status === req.status)
    return index <= currentIndex + 2
  })

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Job Progress Timeline</h3>
      
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
        
        <div className="space-y-4">
          {relevantSteps.map((step) => {
            const state = getStepState(req, step, workflowSteps.indexOf(step))
            const date = getStepDate(req, step.status)
            
            return (
              <div key={step.status} className="relative flex items-start gap-4">
                {/* Status dot */}
                <div className="relative z-10 flex-shrink-0">
                  {state === 'completed' && (
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                  {state === 'current' && (
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center ring-4 ring-blue-100">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                  )}
                  {state === 'pending' && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <Circle className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium text-sm ${
                      state === 'completed' ? 'text-gray-800' :
                      state === 'current' ? 'text-blue-700' :
                      'text-gray-400'
                    }`}>
                      {step.label}
                    </span>
                    {state === 'current' && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        Current
                      </span>
                    )}
                  </div>
                  <p className={`text-xs mt-0.5 ${
                    state === 'pending' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {step.description}
                  </p>
                  {date && (
                    <p className="text-xs text-gray-400 mt-1">
                      {formatIso(date)}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      
      {/* Horizontal progress bar */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-gray-500">Overall Progress</span>
          <span className="text-xs font-medium text-gray-700">
            {Math.round(((workflowSteps.findIndex(s => s.status === req.status) + 1) / workflowSteps.length) * 100)}%
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-500"
            style={{ 
              width: `${((workflowSteps.findIndex(s => s.status === req.status) + 1) / workflowSteps.length) * 100}%` 
            }}
          />
        </div>
      </div>
    </div>
  )
}
