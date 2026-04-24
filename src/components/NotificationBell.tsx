import { useMemo, useState } from 'react'
import { useDBSnapshot } from '../lib/hooks'
import { markNotificationRead, markAllNotificationsRead } from '../lib/db'
import type { SessionUser } from '../lib/types'
import { Bell, Check, CheckCheck } from 'lucide-react'

type EffectiveRole = 'customer' | 'worker' | 'admin'

function formatIso(iso: string) {
  const date = new Date(iso)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function NotificationBell({ user }: { user: SessionUser }) {
  const db = useDBSnapshot()
  const [isOpen, setIsOpen] = useState(false)

  // Determine effective role (handle 'dual' role by using currentView)
  const effectiveRole: EffectiveRole =
    user.role === 'admin'
      ? 'admin'
      : user.role === 'worker'
        ? 'worker'
        : user.role === 'dual'
          ? (user.currentView === 'worker' ? 'worker' : 'customer')
          : 'customer'

  const notifications = useMemo(() => {
    const all = (db as any)?.notifications ?? []
    return all
      .filter((n: any) => n.userId === user.id && n.userRole === effectiveRole)
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [db, user.id, effectiveRole])

  const unreadCount = notifications.filter((n: any) => !n.read).length

  const handleMarkRead = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    markNotificationRead(id)
  }

  const handleMarkAllRead = (e: React.MouseEvent) => {
    e.stopPropagation()
    markAllNotificationsRead(user.id, effectiveRole)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 transition-colors border border-emerald-200"
        title="Notifications"
      >
        <Bell className="w-5 h-5 text-emerald-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
            <div className="flex items-center justify-between p-3 border-b border-gray-100 bg-gray-50">
              <h3 className="font-semibold text-gray-800">Notifications</h3>
              {notifications.length > 0 && (
                <button onClick={handleMarkAllRead} className="text-xs text-green-600 flex items-center gap-1">
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <Bell className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((n: any) => (
                    <div key={n.id} className={`p-3 hover:bg-gray-50 ${!n.read ? 'bg-green-50/30' : ''}`}>
                      <div className="flex items-start gap-2">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!n.read ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-800">{n.title}</p>
                          <p className="text-xs text-gray-600">{n.message}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-gray-400">{formatIso(n.createdAt)}</span>
                            {!n.read && (
                              <button onClick={(e) => handleMarkRead(e, n.id)} className="text-xs text-green-600 flex items-center gap-0.5">
                                <Check className="w-3 h-3" />
                                Read
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default NotificationBell
