import { useMemo, useState } from 'react'
import Auth from './components/Auth'
import AdminDashboard from './components/AdminDashboard'
import CustomerDashboard from './components/CustomerDashboard'
import WorkerDashboard from './components/WorkerDashboard'
import InstallButton from './components/InstallButton'
import { seedIfEmpty } from './lib/db'
import type { SessionUser } from './lib/types'

export default function App() {
  useMemo(() => {
    seedIfEmpty()
  }, [])

  const [user, setUser] = useState<SessionUser | null>(null)

  if (!user) {
    return <Auth onLogin={setUser} />
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-[#2d3748]/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Fannu Bazaar" className="h-10 w-10 rounded-xl object-contain" />
            <div>
              <div className="text-lg font-semibold">Fannu Bazaar</div>
              <div className="text-xs text-white/60">Service marketplace demo</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="rounded-xl border border-white/10 bg-white/20 px-3 py-2 text-sm text-white/70">
                {user.role} • {user.name}
              </div>
            </div>
            <button
              className="rounded-xl border border-white/10 bg-white/20 px-3 py-2 text-sm text-white hover:bg-white/30"
              onClick={() => setUser(null)}
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {user.role === 'admin' ? (
          <AdminDashboard user={user} />
        ) : user.role === 'customer' ? (
          <CustomerDashboard user={user} />
        ) : (
          <WorkerDashboard user={user} />
        )}
      </main>
      
      <InstallButton />
    </div>
  )
}
