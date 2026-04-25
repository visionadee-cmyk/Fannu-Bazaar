import { useState, useEffect } from 'react'
import type { SessionUser } from '../lib/types'
import { useDBSnapshot } from '../lib/hooks'
import { createAdmin, createCustomer, createWorker, seedIfEmpty } from '../lib/db'
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from 'firebase/auth'
import { firebaseAuth } from '../lib/firebase'
import { useLanguage } from '../lib/LanguageContext'
import AboutPage from './AboutPage'
import ContactPage from './ContactPage'
import DisclaimerPage from './DisclaimerPage'
import { 
  Mail, Lock, ArrowLeft, UserCog, 
  Chrome, Search, Briefcase, Globe,
  Info, Phone, FileText
} from 'lucide-react'

// Mint Green color scheme matching Figma design
const THEME = {
  primary: '#10B981',      // Mint green
  primaryHover: '#059669', // Darker green
  primaryLight: '#D1FAE5', // Light mint background
  bg: '#F0FDF4',          // Very light mint page bg
  coral: '#F87171',       // For "Forgot Password"
}

const publicImageUrl = (filename: string) => {
  const base = (import.meta as any).env?.BASE_URL ?? '/'
  const normalizedBase = base.endsWith('/') ? base : `${base}/`
  return `${normalizedBase}images/${filename}`
}

const publicAssetUrl = (filename: string) => {
  const base = (import.meta as any).env?.BASE_URL ?? '/'
  const normalizedBase = base.endsWith('/') ? base : `${base}/`
  return `${normalizedBase}${filename}`
}

const imageFallbackUrl = (filename: string) => `https://fannu-bazaar.vercel.app/images/${filename}`
const assetFallbackUrl = (filename: string) => `https://fannu-bazaar.vercel.app/${filename}`

// Simple illustration component - now uses Storyset images
const LoginIllustration = () => (
  <div className="w-full h-40 mb-4">
    <img 
      src={publicImageUrl('Job%20hunt-bro.svg')}
      alt="Login illustration" 
      className="w-full h-full object-contain"
      loading="eager"
      onError={(e) => {
        const img = e.currentTarget
        if (img.dataset.fallbackApplied === '1') return
        img.dataset.fallbackApplied = '1'
        const fallback = imageFallbackUrl('Job%20hunt-bro.svg')
        console.error('Failed to load image:', img.src, 'Falling back to:', fallback)
        img.src = fallback
      }}
    />
  </div>
)

const WelcomeIllustration = () => (
  <div className="w-full h-32 mb-4">
    <img 
      src={publicImageUrl('New%20team%20members-amico.svg')}
      alt="Welcome illustration" 
      className="w-full h-full object-contain"
      loading="eager"
      onError={(e) => {
        const img = e.currentTarget
        if (img.dataset.fallbackApplied === '1') return
        img.dataset.fallbackApplied = '1'
        const fallback = imageFallbackUrl('New%20team%20members-amico.svg')
        console.error('Failed to load image:', img.src, 'Falling back to:', fallback)
        img.src = fallback
      }}
    />
  </div>
)

export default function Auth({ onLogin }: { onLogin: (u: SessionUser) => void }) {
  const { t, language, setLanguage, fontClass } = useLanguage()
  const db = useDBSnapshot()
  const isAdminPath = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')
  const [activeTab, setActiveTab] = useState<'welcome' | 'login' | 'signup' | 'signup_form' | 'oauth_role'>('welcome')
  const [showPage, setShowPage] = useState<'about' | 'contact' | 'disclaimer' | null>(null)
  const [role, setRole] = useState<'customer' | 'worker'>('customer')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showAdminLogin, setShowAdminLogin] = useState(isAdminPath)
  const [loginError, setLoginError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [oauthEmail, setOauthEmail] = useState<string | null>(null)
  const [oauthName, setOauthName] = useState<string | null>(null)

  useEffect(() => {
    seedIfEmpty().then(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    if (isAdminPath) {
      setShowAdminLogin(true)
    }
  }, [isAdminPath])

  useEffect(() => {
    const unsub = onAuthStateChanged(firebaseAuth, (user) => {
      if (!user?.email) return

      const normalizedEmail = user.email.toLowerCase().trim()
      const alreadyCustomer = db.customers.find((c) => c.active && c.email?.toLowerCase() === normalizedEmail)
      const alreadyWorker = db.workers.find((w) => w.active && w.email?.toLowerCase() === normalizedEmail)

      // Dual role: user has both customer and worker accounts
      if (alreadyCustomer && alreadyWorker) {
        onLogin({ 
          id: alreadyCustomer.id, 
          role: 'dual', 
          name: alreadyCustomer.name,
          customerId: alreadyCustomer.id,
          workerId: alreadyWorker.id,
          currentView: 'customer'
        })
        return
      }

      if (alreadyCustomer) {
        onLogin({ id: alreadyCustomer.id, role: 'customer', name: alreadyCustomer.name })
        return
      }

      if (alreadyWorker) {
        onLogin({ id: alreadyWorker.id, role: 'worker', name: alreadyWorker.name })
        return
      }

      setOauthEmail(normalizedEmail)
      setOauthName(user.displayName?.trim() || null)
      setActiveTab('oauth_role')
    })

    return () => unsub()
  }, [db.customers, db.workers, onLogin])

  const handleRoleSelect = (selectedRole: 'customer' | 'worker') => {
    setRole(selectedRole)
    setLoginError('')
    setPassword('')
    setActiveTab('signup_form')
  }

  const handleOAuthStart = async () => {
    setLoginError('')
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(firebaseAuth, provider)
    } catch (e: any) {
      setLoginError(e?.message ?? 'Google sign-in failed')
    }
  }

  const handleOAuthRoleSelect = (selectedRole: 'customer' | 'worker') => {
    setLoginError('')

    if (!oauthEmail) {
      setLoginError('Please try again')
      return
    }

    const displayName = (oauthName || '').trim() || oauthEmail.split('@')[0]

    if (selectedRole === 'customer') {
      const existing = db.customers.find((c) => c.active && c.email?.toLowerCase() === oauthEmail)
      const c = existing || createCustomer({ name: displayName, email: oauthEmail })
      onLogin({ id: c.id, role: 'customer', name: c.name })
      return
    }

    const existingActive = db.workers.find((w) => w.active && w.email?.toLowerCase() === oauthEmail)
    if (existingActive) {
      onLogin({ id: existingActive.id, role: 'worker', name: existingActive.name })
      return
    }

    const existingPending = db.workers.find((w) => !w.active && w.email?.toLowerCase() === oauthEmail)
    if (existingPending) {
      setLoginError('Your worker account is pending admin approval')
      return
    }

    createWorker({ name: displayName, email: oauthEmail, active: false })
    setLoginError('Your worker account is created and pending admin approval')
  }

  const handleCreateAccount = () => {
    setLoginError('')

    if (isLoading) {
      setLoginError('Please wait, loading...')
      return
    }

    if (!name.trim()) {
      setLoginError('Please enter your name')
      return
    }

    if (!email.trim()) {
      setLoginError('Please enter email')
      return
    }

    if (!password.trim()) {
      setLoginError('Please enter password')
      return
    }

    const normalizedEmail = email.toLowerCase().trim()

    const adminExists = db.admins.some((a) => a.active && a.email?.toLowerCase() === normalizedEmail)
    const customerExists = db.customers.some((c) => c.active && c.email?.toLowerCase() === normalizedEmail)
    const workerExists = db.workers.some((w) => w.active && w.email?.toLowerCase() === normalizedEmail)

    if (adminExists || customerExists || workerExists) {
      setLoginError('Email already exists')
      return
    }

    if (role === 'customer') {
      const c = createCustomer({
        name: name.trim(),
        email: normalizedEmail,
        password: password.trim(),
        phone: phone.trim() || undefined,
      })
      onLogin({ id: c.id, role: 'customer', name: c.name })
      return
    }

    createWorker({
      name: name.trim(),
      email: normalizedEmail,
      password: password.trim(),
      phone: phone.trim() || undefined,
      active: false,
    })
    setLoginError('Your worker account is created and pending admin approval')
    setActiveTab('login')
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

    const normalizedEmail = email.toLowerCase().trim()

    // Fallback: create seeded admin if missing (ensures admin always works)
    let admin = db.admins.find((a) => a.active && a.email?.toLowerCase() === normalizedEmail)
    if (!admin && normalizedEmail === 'retey.ay@hotmail.com') {
      admin = createAdmin({ name: 'Rettey', email: 'retey.ay@hotmail.com' })
    }
    if (!admin && normalizedEmail === 'admin@demo.com') {
      admin = createAdmin({ name: 'Admin', email: 'admin@demo.com' })
    }
    
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

    const customer = db.customers.find((c) => c.active && c.email?.toLowerCase() === normalizedEmail)
    const worker = db.workers.find((w) => w.active && w.email?.toLowerCase() === normalizedEmail)
    
    // Dual role: user has both customer and worker accounts
    if (customer && worker) {
      if (customer.password && customer.password !== password) {
        setLoginError('Invalid password')
        return
      }
      onLogin({ 
        id: customer.id, 
        role: 'dual', 
        name: customer.name,
        customerId: customer.id,
        workerId: worker.id,
        currentView: 'customer'
      })
      return
    }
    
    if (customer) {
      if (customer.password && customer.password !== password) {
        setLoginError('Invalid password')
        return
      }
      onLogin({ id: customer.id, role: 'customer', name: customer.name })
      return
    }

    if (worker) {
      if (worker.password && worker.password !== password) {
        setLoginError('Invalid password')
        return
      }
      onLogin({ id: worker.id, role: 'worker', name: worker.name })
      return
    }

    const pendingWorker = db.workers.find((w) => !w.active && w.email?.toLowerCase() === normalizedEmail)
    if (pendingWorker) {
      setLoginError('Your worker account is pending admin approval')
      return
    }

    setLoginError('Invalid email or password')
  }

  // Admin Login Screen
  if (showAdminLogin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: `linear-gradient(135deg, ${THEME.bg} 0%, #ffffff 100%)` }}>
        <div className="w-full max-w-sm">
          <button
            onClick={() => {
              if (isAdminPath) {
                window.location.href = '/'
                return
              }
              setShowAdminLogin(false)
            }}
            className="mb-4 flex items-center gap-2 text-gray-500 hover:text-gray-700"
          >
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

  // Render Info Pages (About, Contact, Disclaimer)
  if (showPage === 'about') {
    return <AboutPage onBack={() => setShowPage(null)} />
  }
  if (showPage === 'contact') {
    return <ContactPage onBack={() => setShowPage(null)} />
  }
  if (showPage === 'disclaimer') {
    return <DisclaimerPage onBack={() => setShowPage(null)} />
  }

  // Welcome Screen with Hero Section
  if (activeTab === 'welcome') {
    return (
      <div className={`min-h-screen ${fontClass}`} style={{ background: `linear-gradient(135deg, ${THEME.bg} 0%, #ffffff 100%)` }}>
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
          {/* Top Bar: Logo + Language Toggle + Sign In / Sign Up */}
          <div className="flex justify-between items-center mb-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img 
                src={publicAssetUrl('logo.png')}
                alt="Fannu Bazaar"
                className="w-16 h-16 object-contain"
                loading="eager"
                onError={(e) => {
                  const img = e.currentTarget
                  if (img.dataset.fallbackApplied === '1') return
                  img.dataset.fallbackApplied = '1'
                  img.src = assetFallbackUrl('logo.png')
                }}
              />
              <span className="font-bold text-xl text-gray-900 hidden sm:block">Fannu Bazaar</span>
            </div>

            <div className="flex items-center gap-3">
              {/* Language Toggle */}
              <button
                onClick={() => setLanguage(language === 'en' ? 'dv' : 'en')}
                className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-all"
              >
                <Globe className="w-4 h-4" />
                <span>{language === 'en' ? 'English' : 'ދިވެހި'}</span>
              </button>

              {/* Sign In / Sign Up Buttons */}
              <div className="flex gap-3">
              <button
                onClick={() => setActiveTab('login')}
                className="px-4 py-2 rounded-lg font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-all"
              >
                {language === 'en' ? 'Sign In' : 'ސައިން އިން'}
              </button>
              <button
                onClick={() => setActiveTab('signup')}
                className="px-4 py-2 rounded-lg font-medium text-white transition-all"
                style={{ background: THEME.primary }}
              >
                {language === 'en' ? 'Sign Up' : 'ރެޖިސްޓާ'}
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mb-12">
          {/* Hero Image - Storyset illustration */}
          <div className="mb-8">
            <img 
              src={publicImageUrl('Marketplace-amico.svg')}
              alt={language === 'en' ? 'Fannu Bazaar' : 'ފަންނު ބާޒާރު'}
              className="w-full max-w-md mx-auto h-auto"
              loading="eager"
              onError={(e) => {
                const img = e.currentTarget
                if (img.dataset.fallbackApplied === '1') return
                img.dataset.fallbackApplied = '1'
                const fallback = imageFallbackUrl('Marketplace-amico.svg')
                console.error('Failed to load image:', img.src, 'Falling back to:', fallback)
                img.src = fallback
              }}
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {language === 'en' ? (
                <>Find Skilled Workers.<br /><span style={{ color: THEME.primary }}>Offer Your Services.</span></>
              ) : (
                <>ހުނަރެއްވާ މުވައްޒަފުން ހޯދާ<br /><span style={{ color: THEME.primary }}>އަމަލުތައް ދައްކާ</span></>
              )}
            </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {language === 'en' 
              ? "The Maldives' premier marketplace connecting customers with verified skilled professionals. Get quality work done or grow your service business."
              : "ދިވެހިރާއްޖޭގެ އެންމެ މަތީ މާރުކޭޓުގައި ފާސްކުރެވިފަ ހުނަރެއްވާ މުވައްޒަފުންނާ ގުޅުވާ. މަސްތައް ފުރިހަމަކުރު ނުވަތަ ތިބާ ހިދުމަތް ވިޔަފާރި ދަށުކޮށް."
            }
          </p>
        </div>

        {/* How It Works */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-md text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: THEME.primaryLight }}>
              <span className="text-2xl font-bold" style={{ color: THEME.primary }}>1</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              {language === 'en' ? 'Post or Find' : 'ހޯދު ނުވަތަ ގުޅުވުށޭ'}
            </h3>
              <p className="text-sm text-gray-500">
                {language === 'en' 
                  ? 'Customers post service needs. Workers browse and accept jobs matching their skills.'
                  : 'ކަސްޓަމަރުން ހިދުމަތްތަކުގެ ބޭނުންތައް ޕޯސްޓްކުރުން. މުވައްޒަފުން ބަލާ އަދި މިންނުވާ މަސްތައް ޤަބޫލުކުރުން.'
                }
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-md text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: '#FEF3C7' }}>
                <span className="text-2xl font-bold text-amber-600">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {language === 'en' ? 'Connect & Quote' : 'ގުޅުވާ & ގޮތްވަކިވުން'}
              </h3>
              <p className="text-sm text-gray-500">
                {language === 'en'
                  ? 'Get matched, schedule inspections, receive quotes, and agree on terms.'
                  : 'ގުޅުވާށޭ، އިންސްޕެކްޝަން ޝެޑިއިއުލްކުރާށޭ، ގޮތްވަކިވުން ދޫކުރާށޭ، އަދި ޝަރުތުތައް މަސްދަކުރާށޭ.'
                }
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-md text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: '#D1FAE5' }}>
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {language === 'en' ? 'Complete & Review' : 'ނިމުމްއާއި ރިވިއު'}
              </h3>
              <p className="text-sm text-gray-500">
                {language === 'en'
                  ? 'Work gets done, payment is processed, and both parties leave reviews.'
                  : 'މަސް ފުރިހަމަކުރުން، ފައިސާ ކުރުން، އަދި ދެ ފަރުދަވެސް ރިވިއުދޫކުރުން.'
                }
              </p>
            </div>
          </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: THEME.primaryLight }}>
                <Search className="w-6 h-6" style={{ color: THEME.primary }} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {language === 'en' ? 'For Customers' : 'ކަސްޓަމަރުންގެ މަންފަވެގެން'}
              </h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2"><span style={{ color: THEME.primary }}>✓</span> 
                {language === 'en' ? 'Find verified skilled workers quickly' : 'ފާސްކުރެވިފަ ހުނަރެއްވާ މުވައްޒަފުން އަވަސްކަމަށް ހޯދާ'}
              </li>
              <li className="flex items-center gap-2"><span style={{ color: THEME.primary }}>✓</span> 
                {language === 'en' ? 'Compare quotes and reviews' : 'ގޮތްވަކިވުން އަދި ރިވިއުސް ބަލާ'}
              </li>
              <li className="flex items-center gap-2"><span style={{ color: THEME.primary }}>✓</span> 
                {language === 'en' ? 'Track job progress in real-time' : 'މަސްތަކުގެ ދަށްކަން ރީލް-ޓައިމްގައި ދަށްކުރާ'}
              </li>
              <li className="flex items-center gap-2"><span style={{ color: THEME.primary }}>✓</span> 
                {language === 'en' ? 'Secure payment handling' : 'އަމާން ފައިސާގެ ބަރުދަން'}
              </li>
            </ul>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-amber-50">
                <Briefcase className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {language === 'en' ? 'For Workers' : 'މުވައްޒަފުންގެ މަންފަވެގެން'}
              </h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2"><span style={{ color: THEME.primary }}>✓</span> 
                {language === 'en' ? 'Access to more job opportunities' : 'ގިނަ މަސްފުޅުތަކަށް ފުރުސަން ލިބޭ'}
              </li>
              <li className="flex items-center gap-2"><span style={{ color: THEME.primary }}>✓</span> 
                {language === 'en' ? 'Build your reputation with reviews' : 'ރިވިއުސް ފެރުން މަގުފަހިކުރުން'}
              </li>
              <li className="flex items-center gap-2"><span style={{ color: THEME.primary }}>✓</span> 
                {language === 'en' ? 'Manage jobs and schedule easily' : 'މަސްތައް އަދި ޝެޑިއިއުލް އަވަސްކޮށް މެނޭޖްކުރުން'}
              </li>
              <li className="flex items-center gap-2"><span style={{ color: THEME.primary }}>✓</span> 
                {language === 'en' ? 'Get paid securely and on time' : 'އަމާނުކަމަށް އަދި ވަގުތުން ފައިސާ ނަގާ'}
              </li>
            </ul>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={() => setActiveTab('signup')}
            className="px-8 py-4 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all text-lg"
            style={{ background: THEME.primary }}
          >
            {language === 'en' ? 'Get Started Free' : 'މިހާރު ފަށާ (މަސާނަ)'}
          </button>
          <button
            onClick={() => setActiveTab('login')}
            className="px-8 py-4 rounded-xl font-semibold bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50 transition-all text-lg"
          >
            {language === 'en' ? 'I already have an account' : 'މަގަމް އައްކައުންޓެއް ހުރީ'}
          </button>
        </div>

        {/* Footer Links */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-wrap justify-center gap-6 mb-4">
            <button
              onClick={() => setShowPage('about')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Info className="w-4 h-4" />
              <span>{language === 'en' ? 'About App' : 'އެޕް މަޢުލޫމާތު'}</span>
            </button>
            <button
              onClick={() => setShowPage('contact')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>{language === 'en' ? 'Contact Us' : 'ގުޅުން'}</span>
            </button>
            <button
              onClick={() => setShowPage('disclaimer')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>{language === 'en' ? 'Terms & Disclaimer' : 'ޝަރުތުތައް'}</span>
            </button>
          </div>
          <p className="text-center text-sm text-gray-500">
            © 2026 Fannu Bazaar. All rights reserved.
          </p>
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
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <img 
                src={publicAssetUrl('logo.png')}
                alt="Fannu Bazaar"
                className="w-24 h-24 object-contain"
                loading="eager"
                onError={(e) => {
                  const img = e.currentTarget
                  if (img.dataset.fallbackApplied === '1') return
                  img.dataset.fallbackApplied = '1'
                  img.src = assetFallbackUrl('logo.png')
                }}
              />
            </div>
            
            {/* Title */}
            <h2 className="text-xl font-bold text-gray-800 text-center mb-1">{t('auth.gettingStarted')}</h2>
            <p className="text-gray-500 text-center text-sm mb-6">{t('auth.loginToExplore')}</p>

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
                <label className="text-xs text-gray-600 mb-1.5 block">{t('auth.emailOrPhone')}</label>
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
                <label className="text-xs text-gray-600 mb-1.5 block">{t('auth.password')}</label>
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
                    {showPassword ? t('auth.hide') : t('auth.view')}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <button className="text-xs" style={{ color: THEME.coral }}>
                  {t('auth.forgotPassword')}
                </button>
              </div>

              {/* Sign In Button */}
              <button 
                onClick={handleLogin} 
                className="w-full py-3.5 rounded-xl font-semibold text-white shadow-md transition-all active:scale-95"
                style={{ background: THEME.primary }}
              >
                {t('auth.signIn')}
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
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => void handleOAuthStart()}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"
              >
                <Chrome className="w-4 h-4" />
                <span className="text-xs font-medium text-gray-700">Sign in with Google</span>
              </button>
            </div>

            {/* Footer Links */}
            <div className="border-t border-gray-200 mt-6 pt-4">
              <div className="flex flex-wrap justify-center gap-4 text-xs">
                <button
                  onClick={() => setShowPage('about')}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {language === 'en' ? 'About' : 'މަޢުލޫމާތު'}
                </button>
                <button
                  onClick={() => setShowPage('contact')}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {language === 'en' ? 'Contact' : 'ގުޅުން'}
                </button>
                <button
                  onClick={() => setShowPage('disclaimer')}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {language === 'en' ? 'Terms' : 'ޝަރުތުތައް'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (activeTab === 'oauth_role') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: `linear-gradient(135deg, ${THEME.bg} 0%, #ffffff 100%)` }}>
        <div className="w-full max-w-sm">
          <button onClick={() => setActiveTab('welcome')} className="mb-4 flex items-center gap-2 text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">{t('auth.back')}</span>
          </button>

          <div className="bg-white rounded-3xl shadow-lg p-6">
            <WelcomeIllustration />

            <h2 className="text-xl font-bold text-gray-800 text-center mb-1">{t('auth.chooseAccountType')}</h2>
            <p className="text-gray-500 text-center text-sm mb-6">
              {t('auth.continueAs')}
            </p>

            {loginError && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <p className="text-red-600 text-sm">{loginError}</p>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={() => handleOAuthRoleSelect('customer')}
                className="w-full bg-white rounded-2xl border border-gray-200 p-4 hover:border-green-300 hover:shadow-sm transition-all text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: THEME.primaryLight }}>
                    <Search className="w-6 h-6" style={{ color: THEME.primary }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{t('auth.role.customer')}</h3>
                    <p className="text-xs text-gray-500">{t('auth.needSkilledWorkers')}</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleOAuthRoleSelect('worker')}
                className="w-full bg-white rounded-2xl border border-gray-200 p-4 hover:border-green-300 hover:shadow-sm transition-all text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-amber-50">
                    <Briefcase className="w-6 h-6 text-amber-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{t('auth.role.worker')}</h3>
                    <p className="text-xs text-gray-500">{t('auth.provideServices')}</p>
                  </div>
                </div>
              </button>
            </div>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">{t('auth.or')}</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => void handleOAuthStart()}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"
              >
                <Chrome className="w-4 h-4" />
                <span className="text-xs font-medium text-gray-700">{t('auth.continueWithGoogle')}</span>
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
            
            <h2 className="text-xl font-bold text-gray-800 text-center mb-1">{t('auth.createAccount')}</h2>
            <p className="text-gray-500 text-center text-sm mb-6">{t('auth.chooseHowToUse')}</p>

            <div className="space-y-3">
              <button
                onClick={() => handleRoleSelect('customer')}
                className="w-full bg-white rounded-2xl border border-gray-200 p-4 hover:border-green-300 hover:shadow-sm transition-all text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: THEME.primaryLight }}>
                    <Search className="w-6 h-6" style={{ color: THEME.primary }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{t('auth.findSkills')}</h3>
                    <p className="text-xs text-gray-500">{t('auth.needSkilledWorkers')}</p>
                  </div>
                  <div className="text-xs font-semibold" style={{ color: THEME.primary }}>
                    {t('auth.continue')}
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleRoleSelect('worker')}
                className="w-full bg-white rounded-2xl border border-gray-200 p-4 hover:border-green-300 hover:shadow-sm transition-all text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-amber-50">
                    <Briefcase className="w-6 h-6 text-amber-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{t('auth.offerSkills')}</h3>
                    <p className="text-xs text-gray-500">{t('auth.provideServices')}</p>
                  </div>
                  <div className="text-xs font-semibold" style={{ color: THEME.primary }}>
                    {t('auth.continue')}
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

  if (activeTab === 'signup_form') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: `linear-gradient(135deg, ${THEME.bg} 0%, #ffffff 100%)` }}>
        <div className="w-full max-w-sm">
          <button onClick={() => setActiveTab('signup')} className="mb-4 flex items-center gap-2 text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">{t('auth.back')}</span>
          </button>

          <div className="bg-white rounded-3xl shadow-lg p-6">
            <div className="text-center mb-6">
              <div className="mx-auto w-14 h-14 rounded-2xl flex items-center justify-center mb-3" style={{ background: role === 'customer' ? THEME.primaryLight : '#FEF3C7' }}>
                {role === 'customer' ? (
                  <Search className="w-7 h-7" style={{ color: THEME.primary }} />
                ) : (
                  <Briefcase className="w-7 h-7 text-amber-500" />
                )}
              </div>
              <h2 className="text-xl font-bold text-gray-800">{t('auth.createAccount')}</h2>
              <p className="text-gray-500 text-sm">{t('auth.signingUpAs').replace('{role}', role === 'customer' ? t('auth.role.customer') : t('auth.role.worker'))}</p>
            </div>

            {loginError && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <p className="text-red-600 text-sm">{loginError}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-600 mb-1.5 block">{t('auth.fullName')}</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('auth.name')}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:border-green-400 text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-gray-600 mb-1.5 block">{t('auth.email')}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:border-green-400 text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-gray-600 mb-1.5 block">{t('auth.password')}</label>
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
                    style={{
                      color: showPassword ? THEME.coral : '#9CA3AF',
                      background: showPassword ? '#FEE2E2' : 'transparent',
                    }}
                  >
                    {showPassword ? t('auth.hide') : t('auth.view')}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-600 mb-1.5 block">{t('auth.phoneOptional')}</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+960..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:border-green-400 text-sm"
                />
              </div>

              <button
                onClick={handleCreateAccount}
                className="w-full py-3.5 rounded-xl font-semibold text-white shadow-md transition-all active:scale-95"
                style={{ background: THEME.primary }}
              >
                {t('auth.createAccount')}
              </button>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                {t('auth.alreadyHaveAccount')}{' '}
                <button onClick={() => setActiveTab('login')} className="font-medium" style={{ color: THEME.primary }}>
                  {t('auth.logIn')}
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
