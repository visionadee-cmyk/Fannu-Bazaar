import { useState, useEffect } from 'react'
import type { SessionUser } from '../lib/types'
import { useDBSnapshot } from '../lib/hooks'
import { refreshDB } from '../lib/db'
import { 
  Mail, Lock, Eye, EyeOff, ArrowLeft, UserCog, 
  Chrome, Facebook, Search, Briefcase
} from 'lucide-react'

// Mint Green color scheme matching Figma design
const THEME = {
  primary: '#10B981',      // Mint green
  primaryHover: '#059669', // Darker green
  primaryLight: '#D1FAE5', // Light mint background
  bg: '#F0FDF4',          // Very light mint page bg
  coral: '#F87171',       // For "Forgot Password"
}

// Simple illustration component
const LoginIllustration = () => (
  <svg viewBox="0 0 200 160" className="w-full h-40">
    <circle cx="100" cy="80" r="60" fill={THEME.primaryLight} opacity="0.5" />
    <rect x="70" y="50" width="60" height="80" rx="8" fill="white" stroke="#E5E7EB" strokeWidth="2" />
    <rect x="80" y="65" width="40" height="8" rx="2" fill={THEME.primary} opacity="0.3" />
    <rect x="80" y="80" width="30" height="6" rx="2" fill="#9CA3AF" />
    <rect x="80" y="92" width="35" height="6" rx="2" fill="#9CA3AF" />
    <circle cx="100" cy="115" r="12" fill={THEME.primary} opacity="0.2" />
    <path d="M95 115 L98 118 L105 111" stroke={THEME.primary} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="145" cy="55" r="15" fill={THEME.primaryLight} />
    <path d="M140 55 L143 58 L150 51" stroke={THEME.primary} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const WelcomeIllustration = () => (
  <svg viewBox="0 0 200 120" className="w-full h-32">
    <circle cx="60" cy="60" r="40" fill="#FEF3C7" />
    <circle cx="100" cy="60" r="40" fill={THEME.primaryLight} />
    <circle cx="140" cy="60" r="40" fill="#E0E7FF" />
    <rect x="45" y="50" width="30" height="20" rx="4" fill="#F59E0B" opacity="0.6" />
    <rect x="85" y="45" width="30" height="30" rx="4" fill={THEME.primary} opacity="0.6" />
    <rect x="125" y="50" width="30" height="20" rx="4" fill="#6366F1" opacity="0.6" />
  </svg>
)

export default function Auth({ onLogin }: { onLogin: (u: SessionUser) => void }) {
  const db = useDBSnapshot()
  const [activeTab, setActiveTab] = useState<'welcome' | 'login' | 'signup'>('welcome')
  const [_role, _setRole] = useState<'customer' | 'worker'>('customer')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    refreshDB().then(() => setIsLoading(false))
  }, [])

  const handleRoleSelect = (selectedRole: 'customer' | 'worker') => {
    _setRole(selectedRole)
    setActiveTab('signup')
  }

  const handleLogin = () => {
    setLoginError('')
    
    if (isLoading) {
      setLoginError('Please wait, loading...')
      return
    }
    
    if (!email || !password) {
      setLoginError('Please enter email and password')
      return
    }

    const admin = db.admins.find((a) => a.active && a.email?.toLowerCase() === email.toLowerCase().trim())
    
    if (admin) {
      let expectedPassword = 'admin123'
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

  // Welcome Screen
  if (activeTab === 'welcome') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: `linear-gradient(135deg, ${THEME.bg} 0%, #ffffff 100%)` }}>
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-md mb-3">
              <img src="/logo.png" alt="Fannu Bazaar" className="w-12 h-12 object-contain" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Fannu Bazaar</h1>
            <p className="text-gray-500 text-sm">Maldives Skills Marketplace</p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-3xl shadow-lg p-6 mb-4">
            <WelcomeIllustration />
            
            <h2 className="text-xl font-bold text-gray-800 text-center mb-2">Welcome</h2>
            <p className="text-gray-500 text-center text-sm mb-6">Connect with skilled professionals or offer your services</p>

            <div className="space-y-3">
              <button
                onClick={() => setActiveTab('signup')}
                className="w-full py-3.5 rounded-xl font-semibold text-white shadow-md transition-all active:scale-95"
                style={{ background: THEME.primary }}
              >
                Get Started
              </button>
              <button
                onClick={() => setActiveTab('login')}
                className="w-full py-3.5 rounded-xl font-semibold bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 transition-all"
              >
                I already have an account
              </button>
            </div>
          </div>

          {/* Admin Link */}
          <div className="text-center">
            <button onClick={() => setShowAdminLogin(true)} className="text-xs text-gray-400 hover:text-gray-600 flex items-center justify-center gap-1">
              <UserCog className="w-3 h-3" /> Admin Access
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Login Screen - Matching Figma Design
  if (activeTab === 'login') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: `linear-gradient(135deg, ${THEME.bg} 0%, #ffffff 100%)` }}>
        <div className="w-full max-w-sm">
          {/* Back Button */}
          <button onClick={() => setActiveTab('welcome')} className="mb-4 flex items-center gap-2 text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>

          {/* Main Card */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            {/* Illustration */}
            <LoginIllustration />
            
            {/* Title */}
            <h2 className="text-xl font-bold text-gray-800 text-center mb-1">Getting Started</h2>
            <p className="text-gray-500 text-center text-sm mb-6">Let's login for explore continues</p>

            {/* Error Message */}
            {loginError && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <p className="text-red-600 text-sm">{loginError}</p>
              </div>
            )}

            {/* Form */}
            <div className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="text-xs text-gray-600 mb-1.5 block">Email or Phone Number</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <div className="w-px h-4 bg-gray-300" />
                  </div>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="example@gmail.com" 
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:border-green-400 text-sm"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="text-xs text-gray-600 mb-1.5 block">Password</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-gray-400" />
                    <div className="w-px h-4 bg-gray-300" />
                  </div>
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="••••••" 
                    className="w-full pl-12 pr-16 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:border-green-400 text-sm"
                  />
                  <button 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-medium rounded"
                    style={{ color: showPassword ? THEME.coral : '#9CA3AF', background: showPassword ? '#FEE2E2' : 'transparent' }}
                  >
                    {showPassword ? 'Hide' : 'View'}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <button className="text-xs" style={{ color: THEME.coral }}>
                  Forgot Password?
                </button>
              </div>

              {/* Sign In Button */}
              <button 
                onClick={handleLogin} 
                className="w-full py-3.5 rounded-xl font-semibold text-white shadow-md transition-all active:scale-95"
                style={{ background: THEME.primary }}
              >
                Sign In
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                Don't have an account?{' '}
                <button onClick={() => setActiveTab('signup')} className="font-medium" style={{ color: THEME.primary }}>
                  Sign up here
                </button>
              </p>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">Or Sign-in with</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all">
                <Chrome className="w-4 h-4" />
                <span className="text-xs font-medium text-gray-700">Sign in with Google</span>
              </button>
              <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 bg-blue-500 text-white hover:bg-blue-600 transition-all">
                <Facebook className="w-4 h-4" />
                <span className="text-xs font-medium">Sign in with Facebook</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Admin Login Screen
  if (showAdminLogin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: `linear-gradient(135deg, ${THEME.bg} 0%, #ffffff 100%)` }}>
        <div className="w-full max-w-sm">
          <button onClick={() => setShowAdminLogin(false)} className="mb-4 flex items-center gap-2 text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>

          <div className="bg-white rounded-3xl shadow-lg p-6">
            <div className="text-center mb-6">
              <div className="mx-auto w-14 h-14 rounded-2xl flex items-center justify-center mb-3" style={{ background: THEME.primaryLight }}>
                <UserCog className="w-7 h-7" style={{ color: THEME.primary }} />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Admin Login</h2>
            </div>

            {loginError && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <p className="text-red-600 text-sm">{loginError}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-600 mb-1.5 block">Admin Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="admin@example.com" 
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:border-green-400 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-600 mb-1.5 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="••••••" 
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:border-green-400 text-sm"
                  />
                </div>
              </div>

              <button 
                onClick={handleLogin} 
                className="w-full py-3.5 rounded-xl font-semibold text-white shadow-md transition-all active:scale-95"
                style={{ background: THEME.primary }}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Sign Up - Role Selection
  if (activeTab === 'signup') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: `linear-gradient(135deg, ${THEME.bg} 0%, #ffffff 100%)` }}>
        <div className="w-full max-w-sm">
          <button onClick={() => setActiveTab('welcome')} className="mb-4 flex items-center gap-2 text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>

          <div className="bg-white rounded-3xl shadow-lg p-6">
            <WelcomeIllustration />
            
            <h2 className="text-xl font-bold text-gray-800 text-center mb-1">Create Account</h2>
            <p className="text-gray-500 text-center text-sm mb-6">Choose how you want to use Fannu Bazaar</p>

            <div className="space-y-3">
              <button 
                onClick={() => handleRoleSelect('customer')} 
                className="w-full bg-white rounded-2xl border-2 border-gray-100 p-4 hover:border-green-200 transition-all text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: THEME.primaryLight }}>
                    <Search className="w-6 h-6" style={{ color: THEME.primary }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">Find Skills</h3>
                    <p className="text-xs text-gray-500">I need skilled workers</p>
                  </div>
                </div>
              </button>

              <button 
                onClick={() => handleRoleSelect('worker')} 
                className="w-full bg-white rounded-2xl border-2 border-gray-100 p-4 hover:border-amber-200 transition-all text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-amber-50">
                    <Briefcase className="w-6 h-6 text-amber-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">Offer Skills</h3>
                    <p className="text-xs text-gray-500">I want to provide services</p>
                  </div>
                </div>
              </button>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                Already have an account?{' '}
                <button onClick={() => setActiveTab('login')} className="font-medium" style={{ color: THEME.primary }}>
                  Log In
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
