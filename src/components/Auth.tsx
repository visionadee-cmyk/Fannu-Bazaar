import { useState } from 'react'
import type { SessionUser } from '../lib/types'
import { useDBSnapshot } from '../lib/hooks'
import { 
  Wrench, Paintbrush, Zap, Droplets, Hammer, Truck, Camera, Music, Laptop, ChefHat,
  Search, Briefcase, UserCog, ArrowRight, Mail, Lock, Eye, EyeOff, User
} from 'lucide-react'

// Teal/Cyan color scheme matching ASANA style
const THEME = {
  primary: '#14b8a6',
  primaryDark: '#0d9488',
  primaryLight: '#5eead4',
  bg: '#f0fdfa',
}

const skillIcons = [
  { icon: Wrench, color: '#14b8a6', bg: '#f0fdfa' },
  { icon: Paintbrush, color: '#8b5cf6', bg: '#f5f3ff' },
  { icon: Zap, color: '#eab308', bg: '#fefce8' },
  { icon: Droplets, color: '#06b6d4', bg: '#ecfeff' },
  { icon: Hammer, color: '#f97316', bg: '#fff7ed' },
  { icon: Truck, color: '#22c55e', bg: '#f0fdf4' },
  { icon: Camera, color: '#ec4899', bg: '#fdf2f8' },
  { icon: Music, color: '#6366f1', bg: '#eef2ff' },
  { icon: Laptop, color: '#64748b', bg: '#f8fafc' },
  { icon: ChefHat, color: '#ef4444', bg: '#fef2f2' },
]

export default function Auth({ onLogin }: { onLogin: (u: SessionUser) => void }) {
  const db = useDBSnapshot()
  const [activeTab, setActiveTab] = useState<'welcome' | 'login' | 'signup'>('welcome')
  const [role, setRole] = useState<'customer' | 'worker'>('customer')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [loginError, setLoginError] = useState('')

  const handleRoleSelect = (selectedRole: 'customer' | 'worker') => {
    setRole(selectedRole)
    setActiveTab('signup')
  }

  const handleLogin = () => {
    setLoginError('')
    
    if (!email || !password) {
      setLoginError('Please enter email and password')
      return
    }

    const storedPassword = localStorage.getItem('fannu_admin_password') || 'admin123'
    const admin = db.admins.find((a) => a.active && a.email?.toLowerCase() === email.toLowerCase().trim())
    
    if (admin && password === storedPassword) {
      onLogin({ id: admin.id, role: 'admin', name: admin.name })
      return
    }

    const customer = db.customers.find((c) => c.active && c.email?.toLowerCase() === email.toLowerCase().trim())
    if (customer) {
      onLogin({ id: customer.id, role: 'customer', name: customer.name })
      return
    }

    const worker = db.workers.find((w) => w.active && w.email?.toLowerCase() === email.toLowerCase().trim())
    if (worker) {
      onLogin({ id: worker.id, role: 'worker', name: worker.name })
      return
    }

    setLoginError('Invalid email or password')
  }

  const handleSignup = () => {
    setLoginError('')
    
    if (!name || !email) {
      setLoginError('Please enter name and email')
      return
    }

    const options = role === 'customer' 
      ? db.customers.filter((c) => c.active)
      : db.workers.filter((w) => w.active)
    
    if (options[0]) {
      onLogin({ id: options[0].id, role, name: options[0].name })
    }
  }

  // Welcome Screen
  if (activeTab === 'welcome') {
    return (
      <div className="min-h-screen" style={{ background: `linear-gradient(135deg, ${THEME.bg} 0%, #ffffff 50%, #e0f2fe 100%)` }}>
        <div className="min-h-screen flex flex-col px-6 py-8">
          
          <div className="text-center mb-8 pt-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-lg mb-4">
              <img src="/logo.png" alt="Fannu Bazaar" className="w-16 h-16 object-contain" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Fannu Bazaar</h1>
            <p className="text-gray-500">Maldives Skills Marketplace</p>
          </div>

          <div className="flex-1 flex items-center justify-center mb-8">
            <div className="relative w-full max-w-sm">
              <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full opacity-20" style={{ background: THEME.primary }} />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full opacity-20" style={{ background: THEME.primaryLight }} />
              
              <div className="relative bg-white rounded-3xl shadow-xl p-6">
                <div className="grid grid-cols-5 gap-3 mb-6">
                  {skillIcons.map((skill, index) => (
                    <div key={index} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: skill.bg }}>
                      <skill.icon className="w-5 h-5" style={{ color: skill.color }} />
                    </div>
                  ))}
                </div>
                <p className="text-center text-gray-600 text-sm">Connect with skilled professionals or offer your services</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <button
              onClick={() => setActiveTab('signup')}
              className="w-full py-4 rounded-2xl font-semibold text-white shadow-lg transition-all hover:shadow-xl active:scale-95"
              style={{ background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.primaryDark} 100%)` }}
            >
              Get Started
            </button>
            <button
              onClick={() => setActiveTab('login')}
              className="w-full py-4 rounded-2xl font-semibold bg-white text-gray-700 border border-gray-200 shadow-sm hover:bg-gray-50 transition-all"
            >
              I already have an account
            </button>
          </div>

          <div className="text-center">
            <button onClick={() => setShowAdminLogin(true)} className="text-xs text-gray-400 hover:text-gray-600 flex items-center justify-center gap-1">
              <UserCog className="w-3 h-3" /> Admin Access
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Admin Login
  if (showAdminLogin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: `linear-gradient(135deg, ${THEME.bg} 0%, #ffffff 50%, #e0f2fe 100%)` }}>
        <div className="w-full max-w-md">
          <button onClick={() => setShowAdminLogin(false)} className="mb-4 flex items-center gap-2 text-gray-500 hover:text-gray-700">
            <ArrowRight className="w-4 h-4 rotate-180" />
            <span className="text-sm">Back</span>
          </button>

          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: THEME.primary }}>
                <UserCog className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Admin Login</h1>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Admin email" className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2" style={{ focusRingColor: THEME.primary }} />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2" />
              </div>
              {loginError && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3"><p className="text-red-600 text-sm">{loginError}</p></div>}
              <button onClick={handleLogin} className="w-full py-4 rounded-2xl font-semibold text-white" style={{ background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.primaryDark} 100%)` }}>
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Login Screen
  if (activeTab === 'login') {
    return (
      <div className="min-h-screen" style={{ background: `linear-gradient(135deg, ${THEME.bg} 0%, #ffffff 50%, #e0f2fe 100%)` }}>
        <div className="min-h-screen flex flex-col px-6 py-8">
          <button onClick={() => setActiveTab('welcome')} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6">
            <ArrowRight className="w-4 h-4 rotate-180" />
            <span className="text-sm">Back</span>
          </button>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back!</h1>
            <p className="text-gray-500 text-sm">Log in to continue</p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
            {loginError && <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3"><p className="text-red-600 text-sm">{loginError}</p></div>}

            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="w-full pl-12 pr-12 py-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <button onClick={handleLogin} className="w-full py-4 rounded-2xl font-semibold text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.primaryDark} 100%)` }}>
                Log In
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">Don't have an account? <button onClick={() => setActiveTab('signup')} className="font-semibold" style={{ color: THEME.primaryDark }}>Sign Up</button></p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Sign Up - Role Selection
  if (activeTab === 'signup') {
    return (
      <div className="min-h-screen" style={{ background: `linear-gradient(135deg, ${THEME.bg} 0%, #ffffff 50%, #e0f2fe 100%)` }}>
        <div className="min-h-screen flex flex-col px-6 py-8">
          <button onClick={() => setActiveTab('welcome')} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6">
            <ArrowRight className="w-4 h-4 rotate-180" />
            <span className="text-sm">Back</span>
          </button>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Create Account</h1>
            <p className="text-gray-500 text-sm">Choose your role</p>
          </div>

          <div className="space-y-4 flex-1">
            <button onClick={() => handleRoleSelect('customer')} className="w-full bg-white rounded-3xl shadow-lg p-6 border-2 border-transparent hover:border-teal-200 transition-all text-left">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: '#f0fdfa' }}>
                  <Search className="w-7 h-7" style={{ color: THEME.primary }} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Find Skills</h3>
                  <p className="text-sm text-gray-500">I need skilled workers</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 ml-auto" />
              </div>
            </button>

            <button onClick={() => handleRoleSelect('worker')} className="w-full bg-white rounded-3xl shadow-lg p-6 border-2 border-transparent hover:border-teal-200 transition-all text-left">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: '#fef3c7' }}>
                  <Briefcase className="w-7 h-7 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Offer Skills</h3>
                  <p className="text-sm text-gray-500">I want to provide services</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 ml-auto" />
              </div>
            </button>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">Already have an account? <button onClick={() => setActiveTab('login')} className="font-semibold" style={{ color: THEME.primaryDark }}>Log In</button></p>
          </div>
        </div>
      </div>
    )
  }

  return null
}

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

  const ADMIN_EMAIL = 'retey.ay@hotmail.com'

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
    
    // Get stored password (default is 'admin123')
    const storedPassword = localStorage.getItem('fannu_admin_password') || 'admin123'
    
    // Find first active admin (since there's only one admin)
    const admin = db.admins.find((a) => a.active)
    
    if (!admin) {
      setLoginError('No active admin account found')
      return
    }
    
    // Check if email matches (case insensitive)
    if (email.toLowerCase().trim() !== admin.email?.toLowerCase()) {
      setLoginError('Email does not match admin account')
      return
    }
    
    if (password !== storedPassword) {
      setLoginError('Invalid password')
      return
    }
    
    onLogin({
      id: admin.id,
      role: 'admin',
      name: admin.name,
    })
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
