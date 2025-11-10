'use client';

import { useState, useEffect, useCallback } from 'react';

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

export function usePWA() {
  const [pwaState, setPwaState] = useState<PWAState>({
    isInstallable: false,
    isInstalled: false,
    isOffline: false,
    isUpdateAvailable: false,
    deferredPrompt: null,
    isIOS: false,
  });

  const checkInstallable = useCallback(() => {
    const isStandalone = window.matchMedia(
      '(display-mode: standalone)',
    ).matches;
    const isIOSDevice = /iphone|ipad|ipod/.test(
      navigator.userAgent.toLowerCase(),
    );
    const isAndroid = /android/.test(navigator.userAgent.toLowerCase());
    const isInStandaloneMode =
      ('standalone' in window.navigator &&
        (window.navigator as Window['navigator'] & { standalone?: boolean })
          .standalone) ||
      isStandalone;

    console.log('[PWA] Detection:', {
      isStandalone,
      isIOSDevice,
      isAndroid,
      isInStandaloneMode,
      userAgent: navigator.userAgent,
    });

    setPwaState((prev) => ({
      ...prev,
      isInstalled: isInStandaloneMode,
      isIOS: isIOSDevice,
      // For iOS, we show installable if not in standalone mode
      // For Android, show if has deferred prompt or is Android device not in standalone
      isInstallable:
        !isInStandaloneMode &&
        (isIOSDevice || isAndroid || prev.deferredPrompt !== null),
    }));
  }, []);

  const checkOnlineStatus = useCallback(() => {
    setPwaState((prev) => ({
      ...prev,
      isOffline: !navigator.onLine,
    }));
  }, []);

  const handleBeforeInstallPrompt = useCallback((e: Event) => {
    // Prevent the default browser install prompt on Android
    e.preventDefault();

    // Store the event for later use
    const promptEvent = e as BeforeInstallPromptEvent;

    console.log('[PWA] Install prompt event captured:', {
      platforms: promptEvent.platforms,
    });

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
      console.log('[PWA] Install attempt:', {
        isIOS: pwaState.isIOS,
        hasDeferredPrompt: !!pwaState.deferredPrompt,
      });

      // iOS doesn't support programmatic installation
      if (pwaState.isIOS) {
        // Show instructions for manual installation
        const instructions = getIOSInstructions
          ? getIOSInstructions()
          : 'To install this app on your iPhone/iPad:\n\n' +
            '1. Tap the Share button (square with arrow up)\n' +
            '2. Scroll down and tap "Add to Home Screen"\n' +
            '3. Tap "Add" to confirm';

        alert(instructions);
        return;
      }

      if (!pwaState.deferredPrompt) {
        console.warn('[PWA] Install prompt not available');
        throw new Error('Install prompt not available');
      }

      try {
        // Call prompt() to show the native install dialog
        await pwaState.deferredPrompt.prompt();
        const { outcome } = await pwaState.deferredPrompt.userChoice;

        console.log('[PWA] User choice:', outcome);

        if (outcome === 'accepted') {
          console.log('[PWA] User accepted the install prompt');
        } else {
          console.log('[PWA] User dismissed the install prompt');
        }

        setPwaState((prev) => ({
          ...prev,
          deferredPrompt: null,
          isInstallable: false,
        }));
      } catch (error) {
        console.error('[PWA] Install error:', error);
        throw error;
      }
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
    checkInstallable();
    checkOnlineStatus();

    // Listen for install prompt (not supported on iOS)
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for app installed
    window.addEventListener('appinstalled', handleAppInstalled);

    // Listen for online/offline status
    window.addEventListener('online', checkOnlineStatus);
    window.addEventListener('offline', checkOnlineStatus);

    // Listen for service worker updates
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

      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener(
          'updatefound',
          handleUpdateFound,
        );
      }
    };
  }, [
    checkInstallable,
    checkOnlineStatus,
    handleBeforeInstallPrompt,
    handleAppInstalled,
    handleUpdateFound,
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
  return window.matchMedia('(display-mode: standalone)').matches;
}
