import { useState } from 'react'
import type { RecurringFrequency, ServiceCategory } from '../lib/types'
import { ALL_CATEGORIES } from '../lib/categoryConfig'
import CategoryPicker from './CategoryPicker'
import { RefreshCw, User } from 'lucide-react'

export default function ServiceRequestForm({
  onSubmit,
}: {
  onSubmit: (v: {
    category: ServiceCategory
    subcategory?: string
    title: string
    description: string
    budget: number
    urgency: 'low' | 'medium' | 'high'
    location: string
    contactName?: string
    contactPhone?: string
    isRecurring?: boolean
    recurringFrequency?: RecurringFrequency
    recurringDiscount?: number
  }) => void
}) {
  const [category, setCategory] = useState<ServiceCategory>('AC')
  const [subcategory, setSubcategory] = useState<string | undefined>(undefined)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [budget, setBudget] = useState(1000)
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high'>('medium')
  const [location, setLocation] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurringFrequency, setRecurringFrequency] = useState<RecurringFrequency>('monthly')
  const [recurringDiscount, setRecurringDiscount] = useState(10)

  return (
    <form
      className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit({
          category,
          subcategory,
          title,
          description,
          budget,
          urgency,
          location,
          contactName: contactName || undefined,
          contactPhone: contactPhone || undefined,
          isRecurring: isRecurring || undefined,
          recurringFrequency: isRecurring ? recurringFrequency : undefined,
          recurringDiscount: isRecurring ? recurringDiscount : undefined,
        })
        setTitle('')
        setDescription('')
        setBudget(1000)
        setUrgency('medium')
        setLocation('')
        setContactName('')
        setContactPhone('')
        setIsRecurring(false)
        setRecurringDiscount(10)
      }}
    >
      <div className="mb-3 text-sm font-semibold text-gray-900">Create Service Request</div>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-gray-600">Category</label>
          <CategoryPicker
            category={category}
            subcategory={subcategory}
            onChange={(next) => {
              if (next.category === 'All') return
              setCategory(next.category)
              setSubcategory(next.subcategory)
            }}
            className="mb-3"
          />
          <select
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={category}
            onChange={(e) => setCategory(e.target.value as ServiceCategory)}
          >
            {ALL_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs text-gray-600">Budget (MVR)</label>
          <input
            type="number"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-400"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            min={0}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-gray-600">Title</label>
          <input
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. AC not cooling"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-gray-600">Urgency</label>
          <select
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={urgency}
            onChange={(e) => setUrgency(e.target.value as 'low' | 'medium' | 'high')}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-xs text-gray-600">Description</label>
          <textarea
            className="min-h-[90px] w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-400"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue and expectations"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-xs text-gray-600">Location</label>
          <input
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-400"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City / Area"
            required
          />
        </div>

        <div className="md:col-span-2 border-t border-gray-200 pt-4 mt-2">
          <div className="flex items-center gap-2 mb-3">
            <User className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-900">Contact Person (Optional)</span>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-gray-600">Contact Name</label>
              <input
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-400"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Person to contact on-site"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-600">Contact Phone</label>
              <input
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-400"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="Phone number"
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-2 border-t border-gray-200 pt-4 mt-2">
          <div className="flex items-center gap-2 mb-3">
            <RefreshCw className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-900">Recurring Service</span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-700">This is a recurring service</span>
            </label>
          </div>
          {isRecurring && (
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-gray-600">How Often?</label>
                <select
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={recurringFrequency}
                  onChange={(e) => setRecurringFrequency(e.target.value as RecurringFrequency)}
                >
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Every 2 Weeks</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-600">
                  Request Discount (%)
                  <span className="ml-1 text-xs text-gray-500">- Workers may offer discounts for recurring jobs</span>
                </label>
                <input
                  type="number"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-400"
                  value={recurringDiscount}
                  onChange={(e) => setRecurringDiscount(Number(e.target.value))}
                  min={0}
                  max={50}
                  placeholder="e.g. 10 for 10% off"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <button className="mt-4 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 shadow-sm">
        Create Request
      </button>
    </form>
  )
}
