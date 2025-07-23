'use client';

import { useState } from 'react';
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

export default function PWAInstallPrompt() {
  const [isDismissed, setIsDismissed] = useState(false);
  const {
    isInstallable,
    isInstalled,
    isOffline,
    isUpdateAvailable,
    installApp,
    updateApp,
  } = usePWA();

  const handleInstallClick = async () => {
    try {
      await installApp();
    } catch (error) {
      console.error('Failed to install app:', error);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  const handleUpdate = () => {
    updateApp();
  };

  // Don't show if app is already installed, dismissed, or no prompt available
  if (
    isInstalled ||
    isDismissed ||
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
                Install Fin-Track for quick access and offline functionality.
              </p>
              <div className="flex gap-2">
                <Button onClick={handleInstallClick} className="flex-1">
                  Install App
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
