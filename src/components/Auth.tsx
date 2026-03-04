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

    // Check admin login with specific passwords
    const admin = db.admins.find((a) => a.active && a.email?.toLowerCase() === email.toLowerCase().trim())
    
    if (admin) {
      // Default admin password
      let expectedPassword = 'admin123'
      
      // Specific password for retey.ay@hotmail.com
      if (admin.email?.toLowerCase() === 'retey.ay@hotmail.com') {
        expectedPassword = 'Adhu1447'
      }
      
      if (password === expectedPassword) {
        onLogin({ id: admin.id, role: 'admin', name: admin.name })
        return
      } else {
        setLoginError('Invalid password')
        return
      }
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
