import { Code2, Building2, Heart } from 'lucide-react'
import { useLanguage } from '../lib/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-emerald-400" />
            <span className="text-sm">
              {t('footer.developedBy')} <span className="text-white font-semibold">Retts Web Dev</span> since 2016
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <span className="text-sm">
              {t('footer.poweredBy')} <span className="text-white font-semibold">7brother PVT LTD</span>
            </span>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 pt-6 text-center">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
            {t('footer.madeWith')} <Heart className="w-3 h-3 text-red-500 fill-current" /> {t('footer.inMaldives')}
          </p>
        </div>
      </div>
    </footer>
  )
}
