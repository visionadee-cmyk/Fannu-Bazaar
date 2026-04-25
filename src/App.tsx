import { useEffect, useState } from 'react'
import Auth from './components/Auth'
import AdminDashboard from './components/AdminDashboard'
import CustomerDashboard from './components/CustomerDashboard'
import WorkerDashboard from './components/WorkerDashboard'
import InstallButton from './components/InstallButton'
import BottomNav, { type CustomerTab, type WorkerTab, type AdminTab } from './components/BottomNav'
import NotificationBell from './components/NotificationBell'
import Footer from './components/Footer'
import LanguageToggle from './components/LanguageToggle'
import { LanguageProvider, useLanguage } from './lib/LanguageContext'
import { getDB } from './lib/db'
import type { AdminProfile, CustomerProfile, WorkerProfile, SessionUser } from './lib/types'
import { Menu, X, ArrowLeftRight } from 'lucide-react'
import { onAuthStateChanged } from 'firebase/auth'
import { firebaseAuth } from './lib/firebase'

function AppContent() {
  const { t, fontClass, language } = useLanguage()
  
  useEffect(() => {
    // void seedIfEmpty() // Disabled to prevent interference with data persistence
  }, [])

  const [user, setUser] = useState<SessionUser | null>(null)
  const [impersonator, setImpersonator] = useState<SessionUser | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)

  // Bottom navigation tab state
  const [customerTab, setCustomerTab] = useState<CustomerTab>('my')
  const [workerTab, setWorkerTab] = useState<WorkerTab>('jobs')
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard')

  // Restore session from Firebase auth on page load
  useEffect(() => {
    const unsub = onAuthStateChanged(firebaseAuth, (firebaseUser) => {
      if (firebaseUser?.email) {
        const db = getDB()
        const normalizedEmail = firebaseUser.email.toLowerCase().trim()
        
        // Look up user in database by email
        const admin = db.admins.find((a: AdminProfile) => a.email.toLowerCase() === normalizedEmail)
        const customer = db.customers.find((c: CustomerProfile) => c.email?.toLowerCase() === normalizedEmail)
        const worker = db.workers.find((w: WorkerProfile) => w.email?.toLowerCase() === normalizedEmail)
        
        if (admin) {
          setUser({ id: admin.id, role: 'admin', name: admin.name })
        } else if (customer && worker) {
          setUser({ id: customer.id, role: 'dual', name: customer.name, currentView: 'customer', workerId: worker.id })
        } else if (customer) {
          setUser({ id: customer.id, role: 'customer', name: customer.name })
        } else if (worker) {
          setUser({ id: worker.id, role: 'worker', name: worker.name })
        }
      }
      setAuthLoading(false)
    })
    return () => unsub()
  }, [])

  // Toggle between customer and worker view for dual role users
  const toggleUserView = () => {
    if (user?.role === 'dual' && user.currentView) {
      setUser({
        ...user,
        currentView: user.currentView === 'customer' ? 'worker' : 'customer'
      })
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  if (!user) {
    return <Auth onLogin={setUser} />
  }

  const isImpersonating = !!impersonator

  return (
    <div className={`min-h-screen flex flex-col ${fontClass}`}>
      <header className="sticky top-0 z-30 border-b border-gray-200/60 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Fannu Bazaar"
              className="h-10 w-10 rounded-xl bg-white object-contain shadow-sm ring-1 ring-gray-200"
            />
            <div className="leading-tight">
              <div className="text-base font-semibold text-gray-900">{t('app.title')}</div>
              <div className="text-xs text-gray-500">{t('app.subtitle')}</div>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageToggle />
            
            {/* Dual Role View Toggle */}
            {user.role === 'dual' && (
              <button
                onClick={toggleUserView}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-emerald-600 hover:to-teal-600 transition-all"
              >
                <ArrowLeftRight className="w-4 h-4" />
                <span>
                  {user.currentView === 'customer' 
                    ? (language === 'en' ? 'Switch to Worker' : 'މުވައްޒަފު މޯޑަށް')
                    : (language === 'en' ? 'Switch to Customer' : 'ކަސްޓަމަރު މޯޑަށް')
                  }
                </span>
              </button>
            )}
            
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100 capitalize">
              {user.role === 'dual' 
                ? (user.currentView === 'customer' ? t('auth.role.customer') : t('auth.role.worker'))
                : t(`auth.role.${user.role}`)
              }
            </span>

            {isImpersonating && (
              <button
                className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black"
                onClick={() => {
                  setUser(impersonator)
                  setImpersonator(null)
                }}
              >
                {t('dashboard.backToAdmin')}
              </button>
            )}

            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500">{t('dashboard.alerts')}:</span>
              <NotificationBell user={user} />
            </div>

            <div className="flex items-center gap-2 rounded-2xl bg-gray-50 px-3 py-2 ring-1 ring-gray-200">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
                {(user.name ?? 'U').trim().charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                <div className="text-[11px] text-gray-500">{t('auth.signIn')}</div>
              </div>
            </div>

            <button
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 active:bg-emerald-800"
              onClick={() => {
                setUser(null)
                setImpersonator(null)
              }}
            >
              {t('auth.signOut')}
            </button>
          </div>

          {/* Mobile Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <NotificationBell user={user} />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-3">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
                  {(user.name ?? 'U').trim().charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{user.name}</div>
                  <div className="mt-0.5 inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-100 capitalize">
                    {user.role === 'dual' 
                      ? (user.currentView === 'customer' ? t('auth.role.customer') : t('auth.role.worker'))
                      : user.role
                    }
                  </div>
                </div>
              </div>

              {/* Mobile Dual Role Toggle */}
              {user.role === 'dual' && (
                <button
                  onClick={() => {
                    toggleUserView()
                    setMobileMenuOpen(false)
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3 text-sm font-semibold text-white"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                  <span>
                    {user.currentView === 'customer' 
                      ? (language === 'en' ? 'Switch to Worker' : 'މުވައްޒަފު މޯޑަށް')
                      : (language === 'en' ? 'Switch to Customer' : 'ކަސްޓަމަރު މޯޑަށް')
                    }
                  </span>
                </button>
              )}

              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2 ring-1 ring-gray-200">
                <div className="text-sm font-semibold text-gray-800">{t('dashboard.notifications')}</div>
                <NotificationBell user={user} />
              </div>

              {isImpersonating && (
                <button
                  className="w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white"
                  onClick={() => {
                    setUser(impersonator)
                    setImpersonator(null)
                    setMobileMenuOpen(false)
                  }}
                >
                  {t('dashboard.backToAdmin')}
                </button>
              )}

              <button
                className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white"
                onClick={() => {
                  setUser(null)
                  setImpersonator(null)
                  setMobileMenuOpen(false)
                }}
              >
                {t('auth.signOut')}
              </button>

              <button
                className="w-full rounded-xl bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('dashboard.close')}
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 pb-24 md:pb-6 lg:px-6 flex-1">
        {user.role === 'admin' ? (
          <AdminDashboard
            user={user}
            activeTab={adminTab}
            onTabChange={setAdminTab}
            onImpersonate={(next: SessionUser) => {
              if (!impersonator) setImpersonator(user)
              setUser(next)
            }}
          />
        ) : user.role === 'dual' ? (
          // Dual role: render based on currentView
          user.currentView === 'customer' ? (
            <CustomerDashboard 
              user={{ ...user, id: user.customerId!, role: 'customer' }} 
              activeTab={customerTab}
              onTabChange={setCustomerTab}
            />
          ) : (
            <WorkerDashboard 
              user={{ ...user, id: user.workerId!, role: 'worker' }} 
              activeTab={workerTab}
              onTabChange={setWorkerTab}
            />
          )
        ) : user.role === 'customer' ? (
          <CustomerDashboard 
            user={user} 
            activeTab={customerTab}
            onTabChange={setCustomerTab}
          />
        ) : (
          <WorkerDashboard 
            user={user} 
            activeTab={workerTab}
            onTabChange={setWorkerTab}
          />
        )}
      </main>
      
      <BottomNav
        userRole={user.role === 'dual' ? user.currentView! : user.role}
        activeTab={user.role === 'admin' ? adminTab : user.role === 'customer' || (user.role === 'dual' && user.currentView === 'customer') ? customerTab : workerTab}
        onTabChange={(tab) => {
          if (user.role === 'admin') {
            setAdminTab(tab as AdminTab)
          } else if (user.role === 'customer' || user.currentView === 'customer') {
            setCustomerTab(tab as CustomerTab)
          } else {
            setWorkerTab(tab as WorkerTab)
          }
        }}
        onSignOut={() => {
          setUser(null)
          setImpersonator(null)
        }}
      />
      <InstallButton />
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  )
}
