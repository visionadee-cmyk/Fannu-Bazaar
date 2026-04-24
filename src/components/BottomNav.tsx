import { Home, Users, Briefcase, UserCircle, LogOut } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

export type CustomerTab = 'my' | 'create' | 'confirm' | 'workers' | 'completed';
export type WorkerTab = 'jobs' | 'myWork' | 'completed' | 'profile';
export type AdminTab = 'dashboard' | 'users' | 'jobs' | 'profile';

interface BottomNavProps {
  userRole: 'admin' | 'customer' | 'worker';
  activeTab?: CustomerTab | WorkerTab | AdminTab;
  onTabChange?: (tab: CustomerTab | WorkerTab | AdminTab) => void;
  onSignOut: () => void;
}

export default function BottomNav({ userRole, activeTab, onTabChange, onSignOut }: BottomNavProps) {
  const { t } = useLanguage();

  // Customer tabs mapping
  const customerTabs: Array<{ id: CustomerTab; icon: typeof Home; label: string }> = [
    { id: 'my', icon: Home, label: t('nav.home') },
    { id: 'my', icon: Briefcase, label: t('nav.myJobs') },
    { id: 'workers', icon: Users, label: t('nav.workers') },
    { id: 'my', icon: UserCircle, label: t('nav.profile') },
  ];

  // Worker tabs mapping
  const workerTabs: Array<{ id: WorkerTab; icon: typeof Home; label: string }> = [
    { id: 'jobs', icon: Home, label: t('nav.jobs') },
    { id: 'myWork', icon: Briefcase, label: t('nav.myWork') },
    { id: 'profile', icon: UserCircle, label: t('nav.profile') },
    { id: 'profile', icon: LogOut, label: t('auth.signOut') },
  ];

  // Admin tabs mapping
  const adminTabs: Array<{ id: AdminTab; icon: typeof Home; label: string }> = [
    { id: 'dashboard', icon: Home, label: t('nav.dashboard') },
    { id: 'users', icon: Users, label: t('nav.users') },
    { id: 'jobs', icon: Briefcase, label: t('nav.jobs') },
    { id: 'profile', icon: UserCircle, label: t('nav.profile') },
  ];

  const tabs = userRole === 'customer' ? customerTabs : userRole === 'worker' ? workerTabs : adminTabs;
  const currentActive = activeTab || (userRole === 'customer' ? 'my' : userRole === 'worker' ? 'jobs' : 'dashboard');

  const handleClick = (tabId: CustomerTab | WorkerTab | AdminTab, index: number) => {
    // Last item is sign out for worker
    if (userRole === 'worker' && index === 3) {
      onSignOut();
      return;
    }
    onTabChange?.(tabId);
  };

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#1e3a5f]/95 backdrop-blur-lg md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="mx-auto flex max-w-md items-center justify-around px-2 pb-safe">
        {tabs.map((item, index) => {
          const isActive = item.id === currentActive;
          return (
            <button
              key={index}
              onClick={() => handleClick(item.id, index)}
              className={`flex flex-col items-center gap-1 py-3 px-4 transition-colors ${
                isActive 
                  ? 'text-[#c9a227]' 
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
      {/* Safe area spacer for iPhone home indicator */}
      <div className="h-[env(safe-area-inset-bottom,8px)]" />
    </nav>
  );
}
