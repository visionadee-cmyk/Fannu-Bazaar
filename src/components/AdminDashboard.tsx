import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  createCustomer,
  createWorker,
  deleteWorker,
  deleteCustomer,
  deleteAllRequests,
  setWorkerActive,
  setCustomerActive,
  updateWorker,
  updateCustomer,
  getVisitorStats,
  importWorkersFromJSON,
  clearAllData,
} from '../lib/db'
import { useDBSnapshot } from '../lib/hooks'
import WorkerProfileModal from './WorkerProfileModal'
import NotificationBell from './NotificationBell'
import Illustration from './Illustration'
import QRCodeInstall from './QRCodeInstall'
import type { CustomerProfile, SessionUser, ServiceRequest, WorkerProfile } from '../lib/types'
import type { AdminTab } from './BottomNav'
import {
  Users, Briefcase, Wrench, Settings, Search, Plus,
  Edit2, Trash2, Power, PowerOff, User, Star,
  Clock, DollarSign, MapPin,
  TrendingUp, Activity, Calendar, Check, QrCode, Eye
} from 'lucide-react'

const THEME = {
  primary: '#10B981',
  primaryDark: '#059669',
  primaryLight: '#D1FAE5',
  bg: '#F0FDF4',
  white: '#FFFFFF',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray400: '#9CA3AF',
  gray600: '#4B5563',
  gray800: '#1F2937',
  gray900: '#111827',
  red: '#EF4444',
  redLight: '#FEE2E2',
  green: '#10B981',
  greenLight: '#D1FAE5',
  amber: '#F59E0B',
  amberLight: '#FEF3C7',
  blue: '#3B82F6',
  blueLight: '#DBEAFE',
}

function statusLabel(s: string) {
  return s.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
}

function formatIso(iso?: string) {
  if (!iso) return '-'
  const d = new Date(iso)
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

interface AdminDashboardProps {
  user: SessionUser;
  activeTab?: AdminTab;
  onTabChange?: (tab: AdminTab) => void;
  onImpersonate?: (u: SessionUser) => void;
}

// Map external tab names to internal tab names
const tabMapping: Record<string, 'overview' | 'statistics' | 'customers' | 'workers' | 'works' | 'settings'> = {
  dashboard: 'overview',
  statistics: 'statistics',
  users: 'customers',
  workers: 'workers',
  jobs: 'works',
  profile: 'settings',
};

const reverseTabMapping: Record<'overview' | 'statistics' | 'customers' | 'workers' | 'works' | 'settings', AdminTab> = {
  overview: 'dashboard' as AdminTab,
  statistics: 'statistics' as AdminTab,
  customers: 'users' as AdminTab,
  workers: 'workers' as AdminTab,
  works: 'jobs' as AdminTab,
  settings: 'profile' as AdminTab,
};

export default function AdminDashboard({
  user,
  activeTab: externalTab,
  onTabChange,
  onImpersonate,
}: AdminDashboardProps) {
  const db = useDBSnapshot()
  const [internalTab, setInternalTab] = useState<'overview' | 'customers' | 'workers' | 'works' | 'settings'>('overview')
  const tab = externalTab ? tabMapping[externalTab] : internalTab
  const setTab = (t: 'overview' | 'customers' | 'workers' | 'works' | 'settings') => {
    setInternalTab(t)
    onTabChange?.(reverseTabMapping[t])
  }
  const [profileModalWorkerId, setProfileModalWorkerId] = useState<string | null>(null)

  const adminProfile = useMemo(() => db.admins.find((a) => a.id === user.id), [db.admins, user.id])
  const canImpersonate =
    !!onImpersonate &&
    user.role === 'admin' &&
    (adminProfile?.email ?? '').toLowerCase().trim() === 'retey.ay@hotmail.com'

  const stats = useMemo(() => {
    const totalCustomers = db.customers.length
    const activeCustomers = db.customers.filter(c => c.active).length
    const totalWorkers = db.workers.length
    const activeWorkers = db.workers.filter(w => w.active).length
    const totalRequests = db.requests.length
    const completedRequests = db.requests.filter(r => r.status === 'completed').length
    const pendingRequests = totalRequests - completedRequests

    return {
      totalCustomers,
      activeCustomers,
      totalWorkers,
      activeWorkers,
      totalRequests,
      completedRequests,
      pendingRequests,
    }
  }, [db])

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'statistics', label: 'Statistics', icon: Eye, count: db.visitors.length },
    { id: 'customers', label: 'Customers', icon: Users, count: db.customers.length },
    { id: 'workers', label: 'Workers', icon: Wrench, count: db.workers.length },
    { id: 'works', label: 'Jobs', icon: Briefcase, count: db.requests.length },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen" style={{ background: THEME.bg }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-10 backdrop-blur-xl border-b border-gray-200/50"
        style={{ background: 'rgba(255,255,255,0.95)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 sm:py-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: THEME.primary }}>
                <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-xl font-bold text-gray-900 truncate">Admin Dashboard</h1>
                <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Welcome back, {user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden md:block">
                <Illustration
                  filename="Logistics-cuate.svg"
                  alt="Admin dashboard illustration"
                  className="w-28 h-16 object-contain"
                  loading="eager"
                />
              </div>
              <span className="hidden sm:inline-block px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium bg-green-100 text-green-700">
                {stats.activeWorkers} Active
              </span>
              <span className="hidden sm:inline-block px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium bg-blue-100 text-blue-700">
                {stats.pendingRequests} Pending
              </span>
              <NotificationBell user={user} />
            </div>
          </div>

          <div className="flex gap-1 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
            {tabs.map((t) => {
              const Icon = t.icon
              const isActive = tab === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id as any)}
                  className={`snap-start flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-medium transition-all whitespace-nowrap text-xs sm:text-sm ${
                    isActive
                      ? 'text-white shadow-lg shadow-green-500/25'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  style={isActive ? { background: THEME.primary } : {}}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">{t.label}</span>
                  <span className="sm:hidden">{t.label.split(' ')[0]}</span>
                  {t.count !== undefined && (
                    <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-xs ${isActive ? 'bg-white/20' : 'bg-gray-200 text-gray-600'}`}>
                      {t.count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {tab === 'overview' && <OverviewTab stats={stats} db={db} />}
          {tab === 'statistics' && <StatisticsTab db={db} />}
          {tab === 'customers' && (
            <CustomersTab
              canImpersonate={canImpersonate}
              onImpersonate={onImpersonate}
            />
          )}
          {tab === 'workers' && (
            <WorkersTab
              onShowProfile={setProfileModalWorkerId}
              canImpersonate={canImpersonate}
              onImpersonate={onImpersonate}
            />
          )}
          {tab === 'works' && <WorksTab onShowProfile={setProfileModalWorkerId} />}
          {tab === 'settings' && <SettingsTab />}
        </motion.div>
      </div>

      {profileModalWorkerId && (
        <WorkerProfileModal
          workerId={profileModalWorkerId}
          onClose={() => setProfileModalWorkerId(null)}
        />
      )}
    </div>
  )
}

function OverviewTab({ stats, db }: { stats: any; db: any }) {
  const recentJobs = useMemo(() => {
    return [...db.requests].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5)
  }, [db.requests])

  const topWorkers = useMemo(() => {
    return [...db.workers]
      .filter(w => w.active)
      .sort((a, b) => (b.ratingAvg || 0) - (a.ratingAvg || 0))
      .slice(0, 4)
  }, [db.workers])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          subtitle={`${stats.activeCustomers} active`}
          icon={Users}
          color={THEME.blue}
          bgColor={THEME.blueLight}
        />
        <StatCard
          title="Total Workers"
          value={stats.totalWorkers}
          subtitle={`${stats.activeWorkers} active`}
          icon={Wrench}
          color={THEME.primary}
          bgColor={THEME.primaryLight}
        />
        <StatCard
          title="Total Jobs"
          value={stats.totalRequests}
          subtitle={`${stats.completedRequests} completed`}
          icon={Briefcase}
          color={THEME.amber}
          bgColor={THEME.amberLight}
        />
        <StatCard
          title="Completion Rate"
          value={stats.totalRequests > 0 ? Math.round((stats.completedRequests / stats.totalRequests) * 100) : 0}
          subtitle="% success rate"
          icon={TrendingUp}
          color={THEME.green}
          bgColor={THEME.greenLight}
          suffix="%"
        />
      </div>

      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: THEME.primaryLight }}>
              <QrCode className="w-5 h-5" style={{ color: THEME.primary }} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">App QR Code (Poster)</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="flex justify-center">
            <QRCodeInstall />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: THEME.amberLight }}>
                <Clock className="w-5 h-5" style={{ color: THEME.amber }} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Jobs</h3>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {recentJobs.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No jobs yet</div>
            ) : (
              recentJobs.map((job) => (
                <div key={job.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{job.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">{job.category} • {formatIso(job.createdAt)}</p>
                    </div>
                    <StatusBadge status={job.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: THEME.greenLight }}>
                <Star className="w-5 h-5" style={{ color: THEME.green }} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Top Rated Workers</h3>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {topWorkers.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No workers yet</div>
            ) : (
              topWorkers.map((worker) => (
                <div key={worker.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: THEME.primaryLight }}>
                      <User className="w-5 h-5" style={{ color: THEME.primary }} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{worker.name}</h4>
                      <p className="text-sm text-gray-500">{worker.jobsDone} jobs completed</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400 fill-current" />
                    <span className="font-medium text-gray-900">{worker.ratingAvg.toFixed(1)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, subtitle, icon: Icon, color, bgColor, suffix = '' }: any) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">
            {value}{suffix}
          </p>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5 sm:mt-1">{subtitle}</p>
        </div>
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bgColor }}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color }} />
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    'open': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Open' },
    'completed': { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed' },
    'pending_customer_confirmation': { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pending' },
  }
  const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-700', label: statusLabel(status) }
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  )
}

function StatisticsTab({ db }: { db: any }) {
  const visitorStats = getVisitorStats()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Total Visitors"
          value={visitorStats.totalVisitors}
          subtitle={`${visitorStats.registeredVisitors} registered`}
          icon={Eye}
          color={THEME.primary}
          bgColor={THEME.primaryLight}
        />
        <StatCard
          title="Anonymous Visitors"
          value={visitorStats.anonymousVisitors}
          subtitle="Not registered"
          icon={Users}
          color={THEME.gray600}
          bgColor={THEME.gray100}
        />
        <StatCard
          title="Yesterday"
          value={visitorStats.yesterdayVisitors}
          subtitle="Last 24 hours"
          icon={Calendar}
          color={THEME.amber}
          bgColor={THEME.amberLight}
        />
        <StatCard
          title="Total Page Views"
          value={visitorStats.totalPageViews}
          subtitle="All sessions"
          icon={Activity}
          color={THEME.blue}
          bgColor={THEME.blueLight}
        />
      </div>

      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Visitors by Role</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-blue-600">{visitorStats.byRole.customer}</div>
              <div className="text-sm text-gray-600">Customers</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-green-600">{visitorStats.byRole.worker}</div>
              <div className="text-sm text-gray-600">Workers</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-purple-600">{visitorStats.byRole.admin}</div>
              <div className="text-sm text-gray-600">Admins</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Device Type</h3>
          </div>
          <div className="p-6 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Desktop</span>
              <span className="font-semibold text-gray-900">{visitorStats.byDeviceType.desktop}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Mobile</span>
              <span className="font-semibold text-gray-900">{visitorStats.byDeviceType.mobile}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tablet</span>
              <span className="font-semibold text-gray-900">{visitorStats.byDeviceType.tablet}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Browser</h3>
          </div>
          <div className="p-6 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Chrome</span>
              <span className="font-semibold text-gray-900">{visitorStats.byBrowser.Chrome}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Safari</span>
              <span className="font-semibold text-gray-900">{visitorStats.byBrowser.Safari}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Firefox</span>
              <span className="font-semibold text-gray-900">{visitorStats.byBrowser.Firefox}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Edge</span>
              <span className="font-semibold text-gray-900">{visitorStats.byBrowser.Edge}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Other</span>
              <span className="font-semibold text-gray-900">{visitorStats.byBrowser.Other}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Operating System</h3>
          </div>
          <div className="p-6 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Windows</span>
              <span className="font-semibold text-gray-900">{visitorStats.byOS.Windows}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">macOS</span>
              <span className="font-semibold text-gray-900">{visitorStats.byOS.macOS}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Android</span>
              <span className="font-semibold text-gray-900">{visitorStats.byOS.Android}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">iOS</span>
              <span className="font-semibold text-gray-900">{visitorStats.byOS.iOS}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Linux</span>
              <span className="font-semibold text-gray-900">{visitorStats.byOS.Linux}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Other</span>
              <span className="font-semibold text-gray-900">{visitorStats.byOS.Other}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Recent Visitors</h3>
        </div>
        <div className="p-6">
          {db.visitors.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No visitors tracked yet. Visit the app to start tracking visitors.
            </div>
          ) : (
            <div className="space-y-3">
              {db.visitors.slice(-10).reverse().map((visitor: any) => (
                <div key={visitor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {visitor.isRegistered ? 'Registered User' : 'Anonymous'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {visitor.device || 'Unknown'} • {visitor.browser || 'Unknown'} • {visitor.os || 'Unknown'}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(visitor.visitedAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{visitor.pageViews} views</div>
                    <div className="text-xs text-gray-500">
                      {visitor.userRole || 'Guest'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CustomersTab({
  canImpersonate,
  onImpersonate,
}: {
  canImpersonate: boolean
  onImpersonate?: (u: SessionUser) => void
}) {
  const db = useDBSnapshot()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [query, setQuery] = useState('')
  const [showCreate, setShowCreate] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return db.customers
    return db.customers.filter((c: CustomerProfile) => {
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.phone ?? '').toLowerCase().includes(q)
      )
    })
  }, [db.customers, query])

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Customers</h2>
            <p className="text-sm text-gray-500 mt-1">Manage your customer base</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-full sm:w-64"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search customers..."
              />
            </div>
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-white shadow-lg hover:shadow-xl transition-all"
              style={{ background: THEME.primary }}
            >
              <Plus className="w-4 h-4" />
              Add Customer
            </button>
          </div>
        </div>
      </div>

      {showCreate && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
          <h3 className="font-semibold text-gray-900 mb-4">Create New Customer</h3>
          <form
            className="grid gap-4 md:grid-cols-4"
            onSubmit={(e) => {
              e.preventDefault()
              createCustomer({ name: name.trim() || 'New Customer', email: email.trim() || 'customer@example.com', phone: phone.trim() || undefined })
              setName('')
              setEmail('')
              setPhone('')
              setShowCreate(false)
            }}
          >
            <input
              className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
            />
            <input
              className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
            />
            <input
              className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl font-semibold text-white shadow-md hover:shadow-lg transition-all"
              style={{ background: THEME.primary }}
            >
              Create Customer
            </button>
          </form>
        </motion.div>
      )}

      <div className="grid gap-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
            <Illustration
              filename="New%20team%20members-amico.svg"
              alt="No customers found"
              className="w-56 h-40 object-contain mx-auto mb-6"
            />
            <h3 className="text-lg font-semibold text-gray-800">No customers found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search or create a new customer</p>
          </div>
        ) : (
          filtered.map((customer: CustomerProfile) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              canImpersonate={canImpersonate}
              onImpersonate={onImpersonate}
            />
          ))
        )}
      </div>
    </div>
  )
}

function CustomerCard({
  customer,
  canImpersonate,
  onImpersonate,
}: {
  customer: CustomerProfile
  canImpersonate: boolean
  onImpersonate?: (u: SessionUser) => void
}) {
  const [name, setName] = useState(customer.name)
  const [email, setEmail] = useState(customer.email)
  const [phone, setPhone] = useState(customer.phone ?? '')
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: customer.active ? THEME.primaryLight : THEME.gray100 }}>
            <User className="w-6 h-6" style={{ color: customer.active ? THEME.primary : THEME.gray400 }} />
          </div>
          <div className="flex-1">
            {isEditing ? (
              <div className="grid gap-3 md:grid-cols-3">
                <input
                  className="px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                />
                <input
                  className="px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                />
                <input
                  className="px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone"
                />
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${customer.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {customer.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                  <span>{customer.email}</span>
                  {customer.phone && (
                    <>
                      <span>•</span>
                      <span>{customer.phone}</span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  updateCustomer({ customerId: customer.id, patch: { name: name.trim() || customer.name, email: email.trim() || customer.email, phone: phone.trim() || undefined } })
                  setIsEditing(false)
                }}
                className="px-4 py-2 rounded-xl font-medium text-white text-sm shadow-md hover:shadow-lg transition-all"
                style={{ background: THEME.primary }}
              >
                Save
              </button>
              <button
                onClick={() => {
                  setName(customer.name)
                  setEmail(customer.email)
                  setPhone(customer.phone ?? '')
                  setIsEditing(false)
                }}
                className="px-4 py-2 rounded-xl font-medium text-gray-600 text-sm hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              {canImpersonate && onImpersonate && (
                <button
                  onClick={() => onImpersonate({ id: customer.id, role: 'customer', name: customer.name })}
                  className="px-4 py-2 rounded-xl font-medium text-sm border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  View as
                </button>
              )}
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCustomerActive({ customerId: customer.id, active: !customer.active })}
                className={`p-2 rounded-xl transition-colors ${customer.active ? 'text-green-500 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
              >
                {customer.active ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
              </button>
              <button
                onClick={() => deleteCustomer({ customerId: customer.id })}
                className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function WorkersTab({
  onShowProfile,
  canImpersonate,
  onImpersonate,
}: {
  onShowProfile: (id: string) => void
  canImpersonate: boolean
  onImpersonate?: (u: SessionUser) => void
}) {
  const db = useDBSnapshot()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [query, setQuery] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [importStatus, setImportStatus] = useState<string | null>(null)
  const [clearStatus, setClearStatus] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return db.workers
    return db.workers.filter((w: WorkerProfile) => {
      return (
        w.name.toLowerCase().includes(q) ||
        (w.email ?? '').toLowerCase().includes(q) ||
        (w.phone ?? '').toLowerCase().includes(q) ||
        w.categories.some(c => c.toLowerCase().includes(q))
      )
    })
  }, [db.workers, query])

  const handleImportWorkers = async () => {
    try {
      const response = await fetch('/workers-database.json')
      const data = await response.json()
      const result = await importWorkersFromJSON(data.workers)
      setImportStatus(`Imported ${result.added} new workers, updated ${result.updated}. Total: ${result.total}`)
      setTimeout(() => setImportStatus(null), 5000)
    } catch (error) {
      setImportStatus('Error importing workers. Make sure the JSON file exists.')
      setTimeout(() => setImportStatus(null), 5000)
    }
  }

  const handleClearAllData = async () => {
    if (confirm('Are you sure you want to clear ALL workers, customers, and requests? This cannot be undone.')) {
      const result = await clearAllData()
      setClearStatus(`Cleared ${result.workerCount} workers, ${result.customerCount} customers, ${result.requestCount} requests`)
      setTimeout(() => setClearStatus(null), 5000)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Workers</h2>
            <p className="text-sm text-gray-500 mt-1">Manage your worker network</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-full sm:w-64"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search workers..."
              />
            </div>
            <button
              onClick={handleClearAllData}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-white shadow-lg hover:shadow-xl transition-all bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
            <button
              onClick={handleImportWorkers}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-white shadow-lg hover:shadow-xl transition-all bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Import JSON
            </button>
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-white shadow-lg hover:shadow-xl transition-all"
              style={{ background: THEME.primary }}
            >
              <Plus className="w-4 h-4" />
              Add Worker
            </button>
          </div>
        </div>
        {importStatus && (
          <div className="mt-4 px-4 py-2 rounded-lg bg-green-50 border border-green-200 text-sm text-green-800">
            {importStatus}
          </div>
        )}
        {clearStatus && (
          <div className="mt-4 px-4 py-2 rounded-lg bg-red-50 border border-red-200 text-sm text-red-800">
            {clearStatus}
          </div>
        )}
      </div>

      {showCreate && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
          <h3 className="font-semibold text-gray-900 mb-4">Create New Worker</h3>
          <form
            className="grid gap-4 md:grid-cols-4"
            onSubmit={(e) => {
              e.preventDefault()
              createWorker({ name: name.trim() || 'New Worker', email: email.trim() || undefined, phone: phone.trim() || undefined })
              setName('')
              setEmail('')
              setPhone('')
              setShowCreate(false)
            }}
          >
            <input
              className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
            />
            <input
              className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
            />
            <input
              className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl font-semibold text-white shadow-md hover:shadow-lg transition-all"
              style={{ background: THEME.primary }}
            >
              Create Worker
            </button>
          </form>
        </motion.div>
      )}

      <div className="grid gap-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
            <Illustration
              filename="Construction%20worker-cuate.svg"
              alt="No workers found"
              className="w-56 h-40 object-contain mx-auto mb-6"
            />
            <h3 className="text-lg font-semibold text-gray-800">No workers found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search or create a new worker</p>
          </div>
        ) : (
          filtered.map((worker: WorkerProfile) => (
            <WorkerCard
              key={worker.id}
              worker={worker}
              onShowProfile={onShowProfile}
              canImpersonate={canImpersonate}
              onImpersonate={onImpersonate}
            />
          ))
        )}
      </div>
    </div>
  )
}

function WorkerCard({
  worker,
  onShowProfile,
  canImpersonate,
  onImpersonate,
}: {
  worker: WorkerProfile
  onShowProfile: (id: string) => void
  canImpersonate: boolean
  onImpersonate?: (u: SessionUser) => void
}) {
  const [name, setName] = useState(worker.name)
  const [email, setEmail] = useState(worker.email ?? '')
  const [phone, setPhone] = useState(worker.phone ?? '')
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-shadow">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex items-center gap-3 sm:gap-4 flex-1">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: worker.active ? THEME.primaryLight : THEME.gray100 }}>
            <Wrench className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: worker.active ? THEME.primary : THEME.gray400 }} />
          </div>
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="grid gap-3 md:grid-cols-3">
                <input
                  className="px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                />
                <input
                  className="px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                />
                <input
                  className="px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone"
                />
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{worker.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${worker.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {worker.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 mt-1 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-current" />
                    {worker.ratingAvg.toFixed(1)} ({worker.ratingCount} reviews)
                  </span>
                  <span>•</span>
                  <span>{worker.jobsDone} jobs</span>
                  <span>•</span>
                  <span className="truncate">{worker.email || 'No email'}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  updateWorker({ workerId: worker.id, patch: { name: name.trim() || worker.name, email: email.trim() || undefined, phone: phone.trim() || undefined } })
                  setIsEditing(false)
                }}
                className="px-4 py-2 rounded-xl font-medium text-white text-sm shadow-md hover:shadow-lg transition-all"
                style={{ background: THEME.primary }}
              >
                Save
              </button>
              <button
                onClick={() => {
                  setName(worker.name)
                  setEmail(worker.email ?? '')
                  setPhone(worker.phone ?? '')
                  setIsEditing(false)
                }}
                className="px-4 py-2 rounded-xl font-medium text-gray-600 text-sm hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onShowProfile(worker.id)}
                className="px-3 py-2 sm:px-4 sm:py-2 rounded-xl font-medium text-xs sm:text-sm border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                View Profile
              </button>
              {canImpersonate && onImpersonate && (
                <button
                  onClick={() => onImpersonate({ id: worker.id, role: 'worker', name: worker.name })}
                  className="px-3 py-2 sm:px-4 sm:py-2 rounded-xl font-medium text-xs sm:text-sm border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  View as
                </button>
              )}
              {!worker.active && (
                <button
                  onClick={() => setWorkerActive({ workerId: worker.id, active: true })}
                  className="px-3 py-2 rounded-xl font-medium text-xs sm:text-sm text-white shadow-md hover:shadow-lg transition-all"
                  style={{ background: THEME.primary }}
                >
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                  Approve
                </button>
              )}
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setWorkerActive({ workerId: worker.id, active: !worker.active })}
                className={`p-2 rounded-xl transition-colors ${worker.active ? 'text-green-500 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
                title={worker.active ? 'Deactivate' : 'Activate'}
              >
                {worker.active ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
              </button>
              <button
                onClick={() => deleteWorker({ workerId: worker.id })}
                className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function WorksTab({ onShowProfile }: { onShowProfile: (id: string) => void }) {
  const db = useDBSnapshot()
  const [subTab, setSubTab] = useState<'pending' | 'completed'>('pending')
  const [query, setQuery] = useState('')

  const customerById = useMemo(() => {
    return new Map(db.customers.map((c: CustomerProfile) => [c.id, c]))
  }, [db.customers])

  const workerById = useMemo(() => {
    return new Map(db.workers.map((w: WorkerProfile) => [w.id, w]))
  }, [db.workers])

  const pending = useMemo(() => {
    return db.requests.filter((r: ServiceRequest) => r.status !== 'completed')
  }, [db.requests])

  const completed = useMemo(() => {
    return db.requests.filter((r: ServiceRequest) => r.status === 'completed')
  }, [db.requests])

  const items = subTab === 'pending' ? pending : completed

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((r: ServiceRequest) => {
      const customer = customerById.get(r.customerId)
      const worker = r.acceptedWorkerId ? workerById.get(r.acceptedWorkerId) : undefined
      return (
        r.title.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        (customer?.name ?? '').toLowerCase().includes(q) ||
        (worker?.name ?? '').toLowerCase().includes(q)
      )
    })
  }, [customerById, items, query, workerById])

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Jobs</h2>
            <p className="text-sm text-gray-500 mt-1">Track all service requests</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-full sm:w-64"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search jobs..."
              />
            </div>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to delete ALL jobs? This action cannot be undone.')) {
                  deleteAllRequests()
                }
              }}
              className="px-4 py-2 rounded-xl font-medium text-sm text-red-600 border border-red-200 hover:bg-red-50 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete All
            </button>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setSubTab('pending')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              subTab === 'pending'
                ? 'text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            style={subTab === 'pending' ? { background: THEME.amber } : {}}
          >
            Pending ({pending.length})
          </button>
          <button
            onClick={() => setSubTab('completed')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              subTab === 'completed'
                ? 'text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            style={subTab === 'completed' ? { background: THEME.green } : {}}
          >
            Completed ({completed.length})
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
            <Illustration
              filename="Work%20in%20progress-pana.svg"
              alt="No jobs found"
              className="w-56 h-40 object-contain mx-auto mb-6"
            />
            <h3 className="text-lg font-semibold text-gray-800">No jobs found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search</p>
          </div>
        ) : (
          filtered.map((job: ServiceRequest) => (
            <JobCard key={job.id} job={job} customer={customerById.get(job.customerId)} worker={job.acceptedWorkerId ? workerById.get(job.acceptedWorkerId) : undefined} onShowProfile={onShowProfile} />
          ))
        )}
      </div>
    </div>
  )
}

function JobCard({ job, customer, worker, onShowProfile }: { job: ServiceRequest; customer?: CustomerProfile; worker?: WorkerProfile; onShowProfile: (id: string) => void }) {
  const interestedCount = Array.isArray(job.interestedWorkerIds) ? job.interestedWorkerIds.length : 0

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-gray-900">{job.title}</h3>
            <StatusBadge status={job.status} />
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
            <span className="flex items-center gap-1">
              <Wrench className="w-4 h-4" style={{ color: THEME.primary }} />
              {job.category}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-gray-400" />
              {job.location}
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-4 h-4 text-gray-400" />
              MVR {job.budget}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-gray-400" />
              {formatIso(job.createdAt)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {interestedCount > 0 && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
              {interestedCount} interested
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: THEME.blueLight }}>
            <User className="w-5 h-5" style={{ color: THEME.blue }} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{customer?.name || 'Unknown'}</p>
            <p className="text-xs text-gray-500">{customer?.email || job.customerId}</p>
          </div>
        </div>

        {worker ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: THEME.greenLight }}>
              <Wrench className="w-5 h-5" style={{ color: THEME.green }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{worker.name}</p>
              <p className="text-xs text-gray-500">Assigned Worker</p>
            </div>
            <button
              onClick={() => onShowProfile(worker.id)}
              className="text-sm font-medium text-green-600 hover:text-green-700"
            >
              View
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-100">
              <User className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500">No worker assigned yet</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function SettingsTab() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const ADMIN_PASSWORD_KEY = 'fannu_admin_password'

  const handleChangePassword = () => {
    setMessage('')
    setError('')

    const storedPassword = localStorage.getItem(ADMIN_PASSWORD_KEY) || 'admin123'

    if (currentPassword !== storedPassword) {
      setError('Current password is incorrect')
      return
    }

    if (newPassword.length < 4) {
      setError('New password must be at least 4 characters')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      return
    }

    localStorage.setItem(ADMIN_PASSWORD_KEY, newPassword)
    setMessage('Password changed successfully!')
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: THEME.primaryLight }}>
            <Settings className="w-6 h-6" style={{ color: THEME.primary }} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Admin Settings</h2>
            <p className="text-sm text-gray-500">Manage your account settings</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-gray-50">
            <h3 className="font-semibold text-gray-900 mb-4">Change Password</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {message && (
              <div className="mt-4 p-3 rounded-lg bg-green-50 border border-green-200">
                <p className="text-sm text-green-600">{message}</p>
              </div>
            )}

            <button
              onClick={handleChangePassword}
              className="mt-4 w-full py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all"
              style={{ background: THEME.primary }}
            >
              Change Password
            </button>
          </div>

          <div className="p-4 rounded-xl bg-gray-50">
            <h3 className="font-medium text-gray-900 mb-2">Account Information</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><span className="font-medium">Admin Email:</span> retey.ay@hotmail.com</p>
              <p className="mt-1"><span className="font-medium">Default Password:</span> admin123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
