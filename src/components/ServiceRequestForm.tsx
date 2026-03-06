import { useState } from 'react'
import type { ServiceCategory } from '../lib/types'
import { ALL_CATEGORIES } from '../lib/categoryConfig'
import CategoryPicker from './CategoryPicker'

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
  }) => void
}) {
  const [category, setCategory] = useState<ServiceCategory>('AC')
  const [subcategory, setSubcategory] = useState<string | undefined>(undefined)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [budget, setBudget] = useState(1000)
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high'>('medium')
  const [location, setLocation] = useState('')

  return (
    <form
      className="rounded-2xl border border-white/10 bg-white/5 p-4"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit({ category, subcategory, title, description, budget, urgency, location })
        setTitle('')
        setDescription('')
        setBudget(1000)
        setUrgency('medium')
        setLocation('')
      }}
    >
      <div className="mb-3 text-sm font-semibold text-white">Create Service Request</div>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-white/70">Category</label>
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
            className="w-full rounded-xl border border-white/10 bg-[#0b1220] px-3 py-2 text-sm text-white"
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
          <label className="mb-1 block text-xs text-white/70">Budget (MVR)</label>
          <input
            type="number"
            className="w-full rounded-xl border border-white/10 bg-[#0b1220] px-3 py-2 text-sm text-white"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            min={0}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-white/70">Title</label>
          <input
            className="w-full rounded-xl border border-white/10 bg-[#0b1220] px-3 py-2 text-sm text-white"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. AC not cooling"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-white/70">Urgency</label>
          <select
            className="w-full rounded-xl border border-white/10 bg-[#0b1220] px-3 py-2 text-sm text-white"
            value={urgency}
            onChange={(e) => setUrgency(e.target.value as 'low' | 'medium' | 'high')}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-xs text-white/70">Description</label>
          <textarea
            className="min-h-[90px] w-full rounded-xl border border-white/10 bg-[#0b1220] px-3 py-2 text-sm text-white"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue and expectations"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-xs text-white/70">Location</label>
          <input
            className="w-full rounded-xl border border-white/10 bg-[#0b1220] px-3 py-2 text-sm text-white"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City / Area"
            required
          />
        </div>
      </div>

      <button className="mt-4 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-black hover:bg-white/90">
        Create Request
      </button>
    </form>
  )
}
