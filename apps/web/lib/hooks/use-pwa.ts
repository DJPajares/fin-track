'use client';

import { useCallback, useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isOffline: boolean;
  isUpdateAvailable: boolean;
  deferredPrompt: BeforeInstallPromptEvent | null;
  isIOS: boolean;
}

const createInitialPWAState = (): PWAState => ({
  isInstallable: false,
  isInstalled: false,
  isOffline: false,
  isUpdateAvailable: false,
  deferredPrompt: null,
  isIOS: false,
});

const getBrowserInstallState = () => {
  if (typeof window === 'undefined') {
    return {
      isInstallable: false,
      isInstalled: false,
      isOffline: false,
      isIOS: false,
    };
  }

  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const ua = navigator.userAgent.toLowerCase();
  const isClassicIOS = /iphone|ipad|ipod/.test(ua);
  const isIPadOS =
    navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  const isIOS = isClassicIOS || isIPadOS;
  const isAndroid = /android/.test(ua);
  const isMobile = isIOS || isAndroid;

  return {
    isInstallable: !isStandalone && isMobile,
    isInstalled: isStandalone,
    isOffline: !navigator.onLine,
    isIOS,
  };
};

export function usePWA() {
  const [pwaState, setPwaState] = useState<PWAState>(() => ({
    ...createInitialPWAState(),
    ...getBrowserInstallState(),
  }));

  const refreshInstallState = useCallback(() => {
    setPwaState((prev) => ({
      ...prev,
      ...getBrowserInstallState(),
    }));
  }, []);

  const checkOnlineStatus = useCallback(() => {
    setPwaState((prev) => ({
      ...prev,
      isOffline: !navigator.onLine,
    }));
  }, []);

  const handleBeforeInstallPrompt = useCallback((e: Event) => {
    const promptEvent = e as BeforeInstallPromptEvent;
    setPwaState((prev) => ({
      ...prev,
      deferredPrompt: promptEvent,
      isInstallable: true,
    }));
  }, []);

  const handleAppInstalled = useCallback(() => {
    setPwaState((prev) => ({
      ...prev,
      isInstalled: true,
      isInstallable: false,
      deferredPrompt: null,
    }));
  }, []);

  const handleUpdateFound = useCallback(() => {
    setPwaState((prev) => ({
      ...prev,
      isUpdateAvailable: true,
    }));
  }, []);

  const installApp = useCallback(
    async (getIOSInstructions?: () => string) => {
      if (pwaState.isIOS) {
        const instructions = getIOSInstructions
          ? getIOSInstructions()
          : 'To install this app on your iPhone/iPad:\n\n' +
            '1. Tap the Share button (square with arrow up)\n' +
            '2. Scroll down and tap "Add to Home Screen"\n' +
            '3. Tap "Add" to confirm';

        alert(instructions);
        return;
      }

      if (pwaState.deferredPrompt) {
        pwaState.deferredPrompt.prompt();

        setPwaState((prev) => ({
          ...prev,
          deferredPrompt: null,
          isInstallable: false,
        }));
        return;
      }

      alert(
        'The app installation prompt will appear shortly, or you can try again in a moment.',
      );
    },
    [pwaState.deferredPrompt, pwaState.isIOS],
  );

  const updateApp = useCallback(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.update();
        });
      });
    }

    setPwaState((prev) => ({
      ...prev,
      isUpdateAvailable: false,
    }));
  }, []);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', checkOnlineStatus);
    window.addEventListener('offline', checkOnlineStatus);
    window.addEventListener('resize', refreshInstallState);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener(
        'updatefound',
        handleUpdateFound,
      );
    }

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt,
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', checkOnlineStatus);
      window.removeEventListener('offline', checkOnlineStatus);
      window.removeEventListener('resize', refreshInstallState);

      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener(
          'updatefound',
          handleUpdateFound,
        );
      }
    };
  }, [
    checkOnlineStatus,
    handleAppInstalled,
    handleBeforeInstallPrompt,
    handleUpdateFound,
    refreshInstallState,
  ]);

  return {
    ...pwaState,
    installApp,
    updateApp,
  };
}

// Convenience function to check if app is running as PWA
export function isPWA(): boolean {
  if (typeof window === 'undefined') return false;
  // Include iOS Safari's standalone detection
  // Some iOS versions don't report display-mode; navigator.standalone is reliable there.
  const mmStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const iosStandalone =
    'standalone' in navigator &&
    (navigator as Navigator & { standalone?: boolean }).standalone === true;
  return mmStandalone || iosStandalone;
}
