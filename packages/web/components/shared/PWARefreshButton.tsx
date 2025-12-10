'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { RefreshCw } from 'lucide-react';
import { cn } from '../../lib/utils';

const isPWA = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(display-mode: standalone)').matches;
};

export default function PWARefreshButton() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Add a small delay to show the loading state
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };

  // Only show in standalone mode
  if (!isPWA()) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleRefresh}
      disabled={isRefreshing}
      className={cn(
        'fixed right-2 bottom-16 z-50',
        'size-10 rounded-full p-0 shadow-lg',
        'bg-background/80 border backdrop-blur-sm',
        'hover:bg-background/90 transition-all duration-200',
      )}
      title="Refresh page"
    >
      <RefreshCw
        className={cn(
          'size-5 transition-transform duration-300',
          isRefreshing && 'animate-spin',
        )}
      />
    </Button>
  );
}
