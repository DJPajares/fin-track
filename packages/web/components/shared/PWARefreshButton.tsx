'use client';

import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { RefreshCw } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function PWARefreshButton() {
  const [isStandalone, setIsStandalone] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Check if app is running in standalone mode (PWA)
    const checkStandalone = () => {
      const standalone = window.matchMedia(
        '(display-mode: standalone)',
      ).matches;
      setIsStandalone(standalone);
    };

    checkStandalone();
    window.addEventListener('resize', checkStandalone);

    return () => {
      window.removeEventListener('resize', checkStandalone);
    };
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Add a small delay to show the loading state
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };

  // Only show in standalone mode
  if (!isStandalone) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleRefresh}
      disabled={isRefreshing}
      className={cn(
        'fixed top-4 right-4 z-50 h-10 w-10 rounded-full p-0 shadow-lg',
        'bg-background/80 border backdrop-blur-sm',
        'hover:bg-background/90 transition-all duration-200',
      )}
      title="Refresh page"
    >
      <RefreshCw
        className={cn(
          'h-5 w-5 transition-transform duration-300',
          isRefreshing && 'animate-spin',
        )}
      />
    </Button>
  );
}
