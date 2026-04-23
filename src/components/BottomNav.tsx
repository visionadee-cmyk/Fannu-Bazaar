import { Home, Users, Briefcase, UserCircle, LogOut } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

interface BottomNavProps {
  userRole: 'admin' | 'customer' | 'worker';
  onSignOut: () => void;
}

export default function BottomNav({ userRole, onSignOut }: BottomNavProps) {
  const { t } = useLanguage();

  const navItems: Record<string, Array<{ icon: typeof Home; label: string; active: boolean; onClick?: () => void }>> = {
    admin: [
      { icon: Home, label: t('nav.dashboard'), active: true },
      { icon: Users, label: t('nav.users'), active: false },
      { icon: Briefcase, label: t('nav.jobs'), active: false },
      { icon: UserCircle, label: t('nav.profile'), active: false },
    ],
    customer: [
      { icon: Home, label: t('nav.home'), active: true },
      { icon: Briefcase, label: t('nav.myJobs'), active: false },
      { icon: Users, label: t('nav.workers'), active: false },
      { icon: UserCircle, label: t('nav.profile'), active: false },
    ],
    worker: [
      { icon: Home, label: t('nav.jobs'), active: true },
      { icon: Briefcase, label: t('nav.myWork'), active: false },
      { icon: UserCircle, label: t('nav.profile'), active: false },
      { icon: LogOut, label: t('auth.signOut'), active: false, onClick: onSignOut },
    ],
  };

  const items = navItems[userRole];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#1e3a5f]/95 backdrop-blur-lg md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="mx-auto flex max-w-md items-center justify-around px-2 pb-safe">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className={`flex flex-col items-center gap-1 py-3 px-4 transition-colors ${
              item.active 
                ? 'text-[#c9a227]' 
                : 'text-white/60 hover:text-white'
            }`}
          >
            <item.icon className="h-5 w-5" strokeWidth={item.active ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
      {/* Safe area spacer for iPhone home indicator */}
      <div className="h-[env(safe-area-inset-bottom,8px)]" />
    </nav>
  );
}
