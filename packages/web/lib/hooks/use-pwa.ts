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
}

export function usePWA() {
  const [pwaState, setPwaState] = useState<PWAState>({
    isInstallable: false,
    isInstalled: false,
    isOffline: false,
    isUpdateAvailable: false,
    deferredPrompt: null,
  });

  const checkInstallable = useCallback(() => {
    const isStandalone = window.matchMedia(
      '(display-mode: standalone)',
    ).matches;
    const isIOS = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
    const isAndroid = /android/.test(navigator.userAgent.toLowerCase());

    setPwaState((prev) => ({
      ...prev,
      isInstalled: isStandalone,
      isInstallable:
        !isStandalone && (isIOS || isAndroid || 'serviceWorker' in navigator),
    }));
  }, []);

  const checkOnlineStatus = useCallback(() => {
    setPwaState((prev) => ({
      ...prev,
      isOffline: !navigator.onLine,
    }));
  }, []);

  const handleBeforeInstallPrompt = useCallback((e: Event) => {
    e.preventDefault();
    setPwaState((prev) => ({
      ...prev,
      deferredPrompt: e as BeforeInstallPromptEvent,
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

  const installApp = useCallback(async () => {
    if (!pwaState.deferredPrompt) {
      throw new Error('Install prompt not available');
    }

    pwaState.deferredPrompt.prompt();
    const { outcome } = await pwaState.deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    setPwaState((prev) => ({
      ...prev,
      deferredPrompt: null,
      isInstallable: false,
    }));
  }, [pwaState.deferredPrompt]);

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

    // Listen for install prompt
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
