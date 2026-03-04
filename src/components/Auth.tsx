import { useState } from 'react'
import type { SessionUser } from '../lib/types'
import { useDBSnapshot } from '../lib/hooks'
import { 
  Wrench, Paintbrush, Zap, Droplets, Hammer, Truck, Camera, Music, Laptop, ChefHat,
  Search, Briefcase, UserCog, ArrowRight, Shield, Eye, EyeOff
} from 'lucide-react'

const skillIcons = [
  { icon: Wrench, color: '#3B82F6', bg: '#EFF6FF' },
  { icon: Paintbrush, color: '#8B5CF6', bg: '#F5F3FF' },
  { icon: Zap, color: '#EAB308', bg: '#FEFCE8' },
  { icon: Droplets, color: '#06B6D4', bg: '#ECFEFF' },
  { icon: Hammer, color: '#F97316', bg: '#FFF7ED' },
  { icon: Truck, color: '#22C55E', bg: '#F0FDF4' },
  { icon: Camera, color: '#EC4899', bg: '#FDF2F8' },
  { icon: Music, color: '#6366F1', bg: '#EEF2FF' },
  { icon: Laptop, color: '#64748B', bg: '#F8FAFC' },
  { icon: ChefHat, color: '#EF4444', bg: '#FEF2F2' },
]

export default function Auth({ onLogin }: { onLogin: (u: SessionUser) => void }) {
  const db = useDBSnapshot()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [loginError, setLoginError] = useState('')

  const ADMIN_EMAIL = 'rettey.ay@hotmail.com'
  const ADMIN_PASSWORD = 'admin123'

  const handleRoleSelect = (role: 'customer' | 'worker') => {
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
    setLoginError('')
    
    if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      setLoginError('Invalid email address')
      return
    }
    
    if (password !== ADMIN_PASSWORD) {
      setLoginError('Invalid password')
      return
    }
    
    const admin = db.admins.find((a) => a.active && a.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase())
    if (admin) {
      onLogin({
        id: admin.id,
        role: 'admin',
        name: admin.name,
      })
    } else {
      setLoginError('Admin account not found')
    }
  }

  if (showAdminLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <button 
            onClick={() => setShowAdminLogin(false)}
            className="mb-4 flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            <span className="text-sm">Back</span>
          </button>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
            <div className="text-center mb-8">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#1e3a5f] to-[#2a4a73] rounded-2xl flex items-center justify-center shadow-lg mb-4">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-800">Admin Login</h1>
              <p className="text-slate-500 text-sm mt-1">Secure administrator access</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={ADMIN_EMAIL}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                  <p className="text-red-600 text-sm">{loginError}</p>
                </div>
              )}

              <button
                onClick={handleAdminLogin}
                className="w-full bg-gradient-to-r from-[#1e3a5f] to-[#2a4a73] text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              >
                Sign In as Admin
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-slate-400">
                Default password: <span className="font-mono bg-slate-100 px-2 py-1 rounded">admin123</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-60" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="relative min-h-screen flex flex-col justify-center px-4 py-8">
        <div className="max-w-4xl mx-auto w-full">
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-3xl shadow-lg mb-6">
              <img src="/logo.png" alt="Fannu Bazaar" className="w-20 h-20 object-contain" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-3">
              Fannu Bazaar
            </h1>
            <p className="text-lg text-slate-600 mb-2">Maldives Skills Marketplace</p>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#1e3a5f]/10 to-[#c9a227]/10 px-4 py-2 rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-slate-700">Empowering Dreams</span>
            </div>
          </div>

          <div className="flex justify-center flex-wrap gap-3 mb-10 max-w-2xl mx-auto">
            {skillIcons.map((skill, index) => (
              <div
                key={index}
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform hover:scale-110 hover:-translate-y-1"
                style={{ backgroundColor: skill.bg }}
              >
                <skill.icon className="w-6 h-6" style={{ color: skill.color }} />
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            
            <button
              onClick={() => handleRoleSelect('customer')}
              className="group bg-white rounded-3xl p-8 shadow-lg border border-slate-100 hover:shadow-xl hover:border-blue-200 transition-all text-left"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Search className="w-8 h-8 text-blue-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                Find Skills
              </h2>
              <p className="text-slate-600 mb-6">
                Discover talented professionals for any task you need done.
              </p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full font-medium">Plumbing</span>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full font-medium">Electrical</span>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full font-medium">+50 more</span>
              </div>
              
              <div className="flex items-center gap-2 text-blue-600 font-semibold">
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <button
              onClick={() => handleRoleSelect('worker')}
              className="group bg-white rounded-3xl p-8 shadow-lg border border-slate-100 hover:shadow-xl hover:border-amber-200 transition-all text-left"
            >
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Briefcase className="w-8 h-8 text-amber-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-amber-600 transition-colors">
                Offer Skills
              </h2>
              <p className="text-slate-600 mb-6">
                Share your expertise and grow your business with new clients.
              </p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 bg-amber-50 text-amber-700 text-sm rounded-full font-medium">Get Jobs</span>
                <span className="px-3 py-1 bg-amber-50 text-amber-700 text-sm rounded-full font-medium">Set Price</span>
                <span className="px-3 py-1 bg-amber-50 text-amber-700 text-sm rounded-full font-medium">Grow</span>
              </div>
              
              <div className="flex items-center gap-2 text-amber-600 font-semibold">
                <span>Start Earning</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

          </div>

          <div className="mt-10 text-center">
            <button
              onClick={() => setShowAdminLogin(true)}
              className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors text-sm"
            >
              <UserCog className="w-4 h-4" />
              <span>Administrator Access</span>
            </button>
          </div>

          <div className="mt-8 max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2a4a73] rounded-2xl p-4 flex items-center justify-between text-white shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="text-xl">📱</span>
                </div>
                <div>
                  <p className="font-semibold">Install Fannu Bazaar App</p>
                  <p className="text-sm text-white/80">Get the best mobile experience</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 text-center text-slate-400 text-sm">
            <p>© 2024 Fannu Bazaar — Maldives Skills Marketplace</p>
            <p className="mt-1">Built with ❤️ in the Maldives</p>
          </div>

        </div>
      </div>
    </div>
  )
}
