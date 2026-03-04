import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsVisible(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check if service worker is registered
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.error('Service Worker registration failed:', err);
      });
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible || isInstalled) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md">
      <div className="rounded-2xl border border-white/20 bg-gradient-to-r from-[#1e3a5f] to-[#2a4a73] p-4 shadow-2xl">
        <div className="flex items-center gap-4">
          {/* App Icon */}
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white overflow-hidden">
            <img src="/logo.png" alt="Fannu Bazaar" className="h-12 w-12 object-contain" />
          </div>
          
          {/* Text Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-white">
              Install Fannu Bazaar
            </h3>
            <p className="text-sm text-white/80">
              Add to your home screen for quick access
            </p>
          </div>
          
          {/* Actions */}
          <div className="flex shrink-0 gap-2">
            <button
              onClick={handleDismiss}
              className="rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-white"
              aria-label="Dismiss"
            >
              <X className="h-5 w-5" />
            </button>
            <button
              onClick={handleInstall}
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#1e3a5f] shadow-lg hover:bg-white/90 active:scale-95 transition-transform"
            >
              <Download className="h-4 w-4" />
              Install
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
