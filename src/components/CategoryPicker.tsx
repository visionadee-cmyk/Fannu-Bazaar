import { useMemo, useState } from 'react'
import type { ServiceCategory } from '../lib/types'
import { CATEGORY_CONFIG, getCategoryMeta } from '../lib/categoryConfig'
import WorkTypeCards from './WorkTypeCards'

export default function CategoryPicker({
  category,
  subcategory,
  onChange,
  className = '',
  allowAllCategory = false,
}: {
  category: ServiceCategory | 'All'
  subcategory?: string
  onChange: (next: { category: ServiceCategory | 'All'; subcategory?: string }) => void
  className?: string
  allowAllCategory?: boolean
}) {
  const [query, setQuery] = useState('')

  const normalizedQuery = query.trim().toLowerCase()

  const activeCategory: ServiceCategory | null = useMemo(() => {
    if (category === 'All') return null
    return category
  }, [category])

  const meta = useMemo(() => {
    return activeCategory ? getCategoryMeta(activeCategory) : undefined
  }, [activeCategory])

  const subcategoryOptions = useMemo(() => {
    if (!meta) return []
    const list = meta.subcategories ?? []
    if (!normalizedQuery) return list
    return list.filter((s) => s.toLowerCase().includes(normalizedQuery))
  }, [meta, normalizedQuery])

  const categoryMatches = useMemo(() => {
    if (!normalizedQuery) return CATEGORY_CONFIG.map((c) => c.category)
    return CATEGORY_CONFIG.filter((c) => {
      const inCategory = c.category.toLowerCase().includes(normalizedQuery)
      const inSub = (c.subcategories ?? []).some((s) => s.toLowerCase().includes(normalizedQuery))
      return inCategory || inSub
    }).map((c) => c.category)
  }, [normalizedQuery])

  const selectedCategoryForCards: ServiceCategory = useMemo(() => {
    if (category === 'All') return 'AC'
    return category
  }, [category])

  return (
    <div className={className}>
      <div className="mb-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search category or subcategory..."
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {allowAllCategory && (
        <button
          type="button"
          onClick={() => onChange({ category: 'All', subcategory: undefined })}
          className={`mb-3 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 transition-colors ${category === 'All' ? 'bg-emerald-50 text-emerald-700 ring-emerald-100' : 'bg-gray-50 text-gray-600 ring-gray-200 hover:bg-gray-100'}`}
        >
          All Categories
        </button>
      )}

      <div className="mb-4">
        <WorkTypeCards
          value={selectedCategoryForCards}
          onChange={(c) => onChange({ category: c, subcategory: undefined })}
          dense
          className=""
        />
      </div>

      {activeCategory && (
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <div className="text-sm font-semibold text-gray-900">Sub-categories</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {subcategoryOptions.map((s) => {
              const active = s === subcategory
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => onChange({ category: activeCategory, subcategory: s })}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 transition-colors ${active ? 'bg-emerald-50 text-emerald-700 ring-emerald-100' : 'bg-gray-50 text-gray-700 ring-gray-200 hover:bg-gray-100'}`}
                >
                  {s}
                </button>
              )
            })}

            {subcategoryOptions.length === 0 && (
              <div className="text-xs text-gray-500">No matching sub-categories.</div>
            )}
          </div>
        </div>
      )}

      {normalizedQuery && (
        <div className="mt-3 text-xs text-gray-500">
          Matching categories: {categoryMatches.length}
        </div>
      )}
    </div>
  )
}
