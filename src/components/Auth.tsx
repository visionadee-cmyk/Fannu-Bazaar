import { useMemo, useState } from 'react'
import type { SessionUser } from '../lib/types'
import { useDBSnapshot } from '../lib/hooks'
import { 
  Wrench, 
  Paintbrush, 
  Zap, 
  Droplets, 
  Hammer, 
  Truck, 
  Camera, 
  Music, 
  Laptop, 
  ChefHat,
  Scissors,
  Car,
  Home,
  Flower2,
  Shirt,
  Baby,
  Dog,
  Calendar,
  BookOpen,
  Dumbbell,
  Search,
  Briefcase,
  UserCog,
  Sparkles,
  ArrowRight,
  CheckCircle2
} from 'lucide-react'

const skillIcons = [
  { icon: Wrench, color: 'text-blue-400', bg: 'bg-blue-400/20' },
  { icon: Paintbrush, color: 'text-purple-400', bg: 'bg-purple-400/20' },
  { icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-400/20' },
  { icon: Droplets, color: 'text-cyan-400', bg: 'bg-cyan-400/20' },
  { icon: Hammer, color: 'text-orange-400', bg: 'bg-orange-400/20' },
  { icon: Truck, color: 'text-green-400', bg: 'bg-green-400/20' },
  { icon: Camera, color: 'text-pink-400', bg: 'bg-pink-400/20' },
  { icon: Music, color: 'text-indigo-400', bg: 'bg-indigo-400/20' },
  { icon: Laptop, color: 'text-slate-400', bg: 'bg-slate-400/20' },
  { icon: ChefHat, color: 'text-red-400', bg: 'bg-red-400/20' },
  { icon: Scissors, color: 'text-teal-400', bg: 'bg-teal-400/20' },
  { icon: Car, color: 'text-emerald-400', bg: 'bg-emerald-400/20' },
  { icon: Home, color: 'text-amber-400', bg: 'bg-amber-400/20' },
  { icon: Flower2, color: 'text-rose-400', bg: 'bg-rose-400/20' },
  { icon: Shirt, color: 'text-violet-400', bg: 'bg-violet-400/20' },
  { icon: Baby, color: 'text-sky-400', bg: 'bg-sky-400/20' },
  { icon: Dog, color: 'text-lime-400', bg: 'bg-lime-400/20' },
  { icon: Calendar, color: 'text-fuchsia-400', bg: 'bg-fuchsia-400/20' },
  { icon: BookOpen, color: 'text-cyan-400', bg: 'bg-cyan-400/20' },
  { icon: Dumbbell, color: 'text-orange-400', bg: 'bg-orange-400/20' },
]

export default function Auth({ onLogin }: { onLogin: (u: SessionUser) => void }) {
  const db = useDBSnapshot()
  const [selectedRole, setSelectedRole] = useState<'customer' | 'worker' | 'admin' | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showAdminLogin, setShowAdminLogin] = useState(false)

  const ADMIN_EMAIL = 'rettey.ay@hotmail.com'

  const handleRoleSelect = (role: 'customer' | 'worker') => {
    setSelectedRole(role)
    // Auto-login with first available profile for demo
    const options = role === 'customer' 
      ? db.customers.filter((c) => c.active)
      : db.workers.filter((w) => w.active)
    
    if (options[0]) {
      onLogin({
        id: options[0].id,
        role,
        name: options[0].name,
      })
    }
  }

  const handleAdminLogin = () => {
    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && password) {
      const admin = db.admins.find((a) => a.active && a.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase())
      if (admin) {
        onLogin({
          id: admin.id,
          role: 'admin',
          name: admin.name,
        })
      }
    }
  }

  if (showAdminLogin) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/20 to-white/5 p-8 text-white shadow-2xl backdrop-blur-xl">
          {/* Logo */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20">
              <img src="/logo.png" alt="Fannu Bazaar" className="h-16 w-16 object-contain" />
            </div>
            <h1 className="text-2xl font-bold">Admin Access</h1>
            <p className="mt-2 text-sm text-white/60">Authorized personnel only</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={ADMIN_EMAIL}
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder-white/40 focus:border-[#c9a227] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder-white/40 focus:border-[#c9a227] focus:outline-none"
              />
            </div>
            <button
              onClick={handleAdminLogin}
              className="w-full rounded-xl bg-gradient-to-r from-[#1e3a5f] to-[#2a4a73] px-4 py-3 text-sm font-semibold text-white shadow-lg hover:from-[#2a4a73] hover:to-[#1e3a5f] transition-all"
            >
              Sign In as Admin
            </button>
          </div>

          <button
            onClick={() => setShowAdminLogin(false)}
            className="mt-6 w-full text-center text-sm text-white/60 hover:text-white"
          >
            ← Back to main login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4 py-8">
      {/* Main Card */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/20 to-white/5 p-8 text-white shadow-2xl backdrop-blur-xl">
        
        {/* Logo & Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-white/20 shadow-inner">
            <img src="/logo.png" alt="Fannu Bazaar" className="h-20 w-20 object-contain" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#c9a227] to-[#1e3a5f] bg-clip-text text-transparent">
            Fannu Bazaar
          </h1>
          <p className="mt-2 text-sm text-white/70">Maldives Skills Marketplace</p>
          <div className="mt-3 flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 text-[#c9a227]" />
            <span className="text-xs text-[#c9a227]">Empowering Dreams</span>
            <Sparkles className="h-4 w-4 text-[#c9a227]" />
          </div>
        </div>

        {/* Skill Icons Animation */}
        <div className="mb-8 grid grid-cols-5 gap-3">
          {skillIcons.slice(0, 10).map((skill, index) => (
            <div
              key={index}
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${skill.bg} ${skill.color} transition-transform hover:scale-110`}
            >
              <skill.icon className="h-6 w-6" />
            </div>
          ))}
        </div>

        {/* Role Selection */}
        <div className="space-y-4">
          <h2 className="text-center text-lg font-semibold">How can we help you?</h2>
          
          {/* Looking for Skills - Customer */}
          <button
            onClick={() => handleRoleSelect('customer')}
            className="group w-full rounded-2xl border border-white/10 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 p-5 text-left transition-all hover:border-blue-400/50 hover:shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-500/30">
                <Search className="h-7 w-7 text-blue-300" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-200 group-hover:text-blue-100">
                  Looking for Skills
                </h3>
                <p className="text-sm text-white/60">
                  Find skilled workers for any task you need
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-blue-300 transition-transform group-hover:translate-x-1" />
            </div>
            <div className="mt-3 flex gap-2">
              <span className="rounded-full bg-blue-500/20 px-2 py-1 text-xs text-blue-200">Plumbing</span>
              <span className="rounded-full bg-blue-500/20 px-2 py-1 text-xs text-blue-200">Electrical</span>
              <span className="rounded-full bg-blue-500/20 px-2 py-1 text-xs text-blue-200">+50 more</span>
            </div>
          </button>

          {/* Offer Your Skills - Worker */}
          <button
            onClick={() => handleRoleSelect('worker')}
            className="group w-full rounded-2xl border border-white/10 bg-gradient-to-r from-[#c9a227]/20 to-amber-500/20 p-5 text-left transition-all hover:border-[#c9a227]/50 hover:shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#c9a227]/30">
                <Briefcase className="h-7 w-7 text-[#c9a227]" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-amber-200 group-hover:text-amber-100">
                  Offer Your Skills
                </h3>
                <p className="text-sm text-white/60">
                  Share your talent and earn income
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-[#c9a227] transition-transform group-hover:translate-x-1" />
            </div>
            <div className="mt-3 flex gap-2">
              <span className="rounded-full bg-[#c9a227]/20 px-2 py-1 text-xs text-amber-200">Get Jobs</span>
              <span className="rounded-full bg-[#c9a227]/20 px-2 py-1 text-xs text-amber-200">Set Your Price</span>
              <span className="rounded-full bg-[#c9a227]/20 px-2 py-1 text-xs text-amber-200">Grow Business</span>
            </div>
          </button>

          {/* Admin Option - Hidden/Subtle */}
          <div className="pt-4 text-center">
            <button
              onClick={() => setShowAdminLogin(true)}
              className="inline-flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              <UserCog className="h-4 w-4" />
              Administrator Login
            </button>
          </div>
        </div>

        {/* Install App CTA */}
        <div className="mt-8 rounded-2xl bg-gradient-to-r from-[#1e3a5f]/50 to-[#2a4a73]/50 p-4 text-center">
          <p className="text-sm text-white/80">
            📱 Install Fannu Bazaar app for the best experience
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-xs text-white/40">
        <p>© 2024 Fannu Bazaar - Maldives Skills Marketplace</p>
        <p className="mt-1">Built with ❤️ in the Maldives</p>
      </div>
    </div>
  )
}
