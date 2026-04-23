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
      <div className={`grid gap-3 ${dense ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
        {items.map((item) => {
          const active = item.category === value
          return (
            <button
              key={item.category}
              type="button"
              onClick={() => onChange(item.category)}
              className={`group rounded-2xl border p-3 sm:p-4 text-left shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 ${active ? 'border-emerald-300 bg-emerald-50/60 ring-2 ring-emerald-100' : 'border-gray-200 bg-white hover:border-emerald-200 hover:bg-emerald-50/30'}`}
            >
              <div className="flex flex-row sm:flex-row items-center gap-3">
                <div className={`rounded-xl sm:rounded-2xl p-1.5 sm:p-2 flex-shrink-0 ${active ? 'bg-white' : 'bg-gray-50'}`}>
                  <Illustration
                    filename={item.filename}
                    alt={`${item.category} illustration`}
                    className={`${dense ? 'h-10 w-12 sm:h-14 sm:w-16' : 'h-12 w-14 sm:h-16 sm:w-20'} object-contain`}
                    loading="lazy"
                  />
                </div>
                <div className="min-w-0 flex-1 overflow-hidden">
                  <div className={`font-semibold text-sm sm:text-base truncate ${active ? 'text-emerald-900' : 'text-gray-900'}`}>{item.category}</div>
                  <div className="mt-0.5 text-xs text-gray-500 line-clamp-2">{item.blurb}</div>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
