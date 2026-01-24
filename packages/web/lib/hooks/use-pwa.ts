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
    // iPadOS 13+ can present itself as "Mac" in userAgent.
    // Detect iOS broadly: classic iOS UA or iPadOS via MacIntel + touch.
    const ua = navigator.userAgent.toLowerCase();
    const isClassicIOS = /iphone|ipad|ipod/.test(ua);
    const isIPadOS =
      navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
    const isIOS = isClassicIOS || isIPadOS;
    const isAndroid = /android/.test(navigator.userAgent.toLowerCase());
    const isMobile = isIOS || isAndroid;

    setPwaState((prev) => ({
      ...prev,
      isInstalled: isStandalone,
      isIOS,
      // Show installable if:
      // 1. Not already installed (not in standalone mode)
      // 2. On mobile (iOS or Android) - PWA criteria are typically met
      // Note: beforeinstallprompt is unreliable, so we rely on platform detection
      isInstallable: !isStandalone && isMobile,
    }));
  }, []);

  const checkOnlineStatus = useCallback(() => {
    setPwaState((prev) => ({
      ...prev,
      isOffline: !navigator.onLine,
    }));
  }, []);

  const handleBeforeInstallPrompt = useCallback((e: Event) => {
    // Store the event for later use without preventing default
    // This allows the browser to show its native prompt if it wants to
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

      // If deferred prompt is available, use it
      if (pwaState.deferredPrompt) {
        // Call prompt() to show the native install dialog
        pwaState.deferredPrompt.prompt();

        setPwaState((prev) => ({
          ...prev,
          deferredPrompt: null,
          isInstallable: false,
        }));
      } else {
        // Deferred prompt not available - browser should show its own prompt
        alert(
          'The app installation prompt will appear shortly, or you can try again in a moment.',
        );
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
  // Include iOS Safari's standalone detection
  // Some iOS versions don't report display-mode; navigator.standalone is reliable there.
  const mmStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const iosStandalone =
    'standalone' in navigator &&
    (navigator as Navigator & { standalone?: boolean }).standalone === true;
  return mmStandalone || iosStandalone;
}
