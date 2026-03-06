import type { ServiceCategory } from '../lib/types'
import { CATEGORY_CONFIG } from '../lib/categoryConfig'
import Illustration from './Illustration'

export default function WorkTypeCards({
  value,
  onChange,
  className = '',
  dense = false,
}: {
  value: ServiceCategory
  onChange: (c: ServiceCategory) => void
  className?: string
  dense?: boolean
}) {
  const items = CATEGORY_CONFIG.map((c) => ({ category: c.category, filename: c.filename, blurb: c.blurb }))

  return (
    <div className={className}>
      <div className={`grid gap-3 ${dense ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
        {items.map((item) => {
          const active = item.category === value
          return (
            <button
              key={item.category}
              type="button"
              onClick={() => onChange(item.category)}
              className={`group rounded-2xl border p-4 text-left shadow-sm transition-all hover:shadow-md ${active ? 'border-emerald-300 bg-emerald-50/60' : 'border-gray-200 bg-white hover:border-emerald-200'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`rounded-2xl p-2 ${active ? 'bg-white' : 'bg-gray-50'}`}>
                  <Illustration
                    filename={item.filename}
                    alt={`${item.category} illustration`}
                    className={`${dense ? 'h-14 w-16' : 'h-16 w-20'} object-contain`}
                    loading="lazy"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className={`font-semibold ${active ? 'text-emerald-900' : 'text-gray-900'}`}>{item.category}</div>
                  <div className="mt-0.5 text-xs text-gray-500">{item.blurb}</div>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
