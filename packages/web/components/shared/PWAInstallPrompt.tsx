'use client';

import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { X, Download, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { usePWA } from '../../lib/hooks/use-pwa';

const PWA_PROMPT_DISMISSED_KEY = 'pwa-prompt-dismissed';
const PWA_PROMPT_DELAY = 3000; // 3 seconds delay before showing
const PWA_PROMPT_AUTO_DISMISS = 10000; // 10 seconds auto-dismiss

export default function PWAInstallPrompt() {
  const [isDismissed, setIsDismissed] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);
  const {
    isInstallable,
    isInstalled,
    isOffline,
    isUpdateAvailable,
    isIOS,
    installApp,
    updateApp,
  } = usePWA();

  // Check localStorage on mount
  useEffect(() => {
    const dismissed = localStorage.getItem(PWA_PROMPT_DISMISSED_KEY);
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  // Show prompt after delay
  useEffect(() => {
    if (!isDismissed && (isInstallable || isOffline || isUpdateAvailable)) {
      const timer = setTimeout(() => {
        setShouldShow(true);
      }, PWA_PROMPT_DELAY);

      return () => clearTimeout(timer);
    }
  }, [isDismissed, isInstallable, isOffline, isUpdateAvailable]);

  // Auto-dismiss after certain time
  useEffect(() => {
    if (shouldShow && !isUpdateAvailable) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, PWA_PROMPT_AUTO_DISMISS);

      return () => clearTimeout(timer);
    }
  }, [shouldShow, isUpdateAvailable]);

  const handleInstallClick = async () => {
    try {
      await installApp();
    } catch (error) {
      console.error('Failed to install app:', error);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    setShouldShow(false);
    // Store dismiss state in localStorage
    localStorage.setItem(PWA_PROMPT_DISMISSED_KEY, 'true');
  };

  const handleUpdate = () => {
    updateApp();
  };

  // Don't show if app is already installed, dismissed, or no prompt available
  if (
    isInstalled ||
    isDismissed ||
    !shouldShow ||
    (!isInstallable && !isOffline && !isUpdateAvailable)
  ) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 px-4">
      <Card className="border-2 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              {isUpdateAvailable && <RefreshCw className="h-5 w-5" />}
              {isOffline && <WifiOff className="h-5 w-5" />}
              {isInstallable && !isOffline && !isUpdateAvailable && (
                <Download className="h-5 w-5" />
              )}
              {isUpdateAvailable
                ? 'Update Available'
                : isOffline
                  ? 'Offline Mode'
                  : 'Install Fin-Track'}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="size-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            {isUpdateAvailable
              ? 'A new version of Fin-Track is available'
              : isOffline
                ? 'You are currently offline. Some features may be limited.'
                : 'Install Fin-Track as a PWA for a better experience'}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {isUpdateAvailable ? (
            <div className="space-y-3">
              <p className="text-muted-foreground text-sm">
                Update to get the latest features and improvements.
              </p>
              <div className="flex gap-2">
                <Button onClick={handleUpdate} className="flex-1">
                  Update Now
                </Button>
                <Button variant="outline" onClick={handleDismiss}>
                  Later
                </Button>
              </div>
            </div>
          ) : isOffline ? (
            <div className="space-y-3">
              <p className="text-muted-foreground text-sm">
                You can still view cached data while offline.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Wifi className="h-4 w-4" />
                <span>Check your internet connection</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-muted-foreground text-sm">
                {isIOS
                  ? 'Install Fin-Track for quick access and offline functionality. Tap "Show Instructions" to learn how.'
                  : 'Install Fin-Track for quick access and offline functionality.'}
              </p>
              <div className="flex gap-2">
                <Button onClick={handleInstallClick} className="flex-1">
                  {isIOS ? 'Show Instructions' : 'Install App'}
                </Button>
                <Button variant="outline" onClick={handleDismiss}>
                  Maybe Later
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
