'use client';

import { Button } from '@web/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@web/components/ui/tooltip';
import { isPWA, usePWA } from '@web/lib/hooks/use-pwa';
import { cn } from '@web/lib/utils';
import { Loader2, RotateCcw } from 'lucide-react';
import { useState } from 'react';

export default function PWARefreshButton() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { isIOS } = usePWA();

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Add a small delay to show the loading state
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };

  // Only show in standalone mode on iOS
  if (!isPWA() || !isIOS) {
    return null;
  }

  return (
    <Tooltip>
      <TooltipTrigger>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={cn(
            'fixed right-2 bottom-16 z-50',
            'size-12 rounded-full p-0 shadow-lg',
            'bg-background/80 border backdrop-blur-sm',
            'hover:bg-background/90 transition-all duration-200',
            'focus-visible:ring-primary/40 focus-visible:ring-2 focus-visible:outline-none',
            'group active:scale-[0.98]',
          )}
          aria-label="Refresh app"
          aria-busy={isRefreshing}
        >
          {isRefreshing ? (
            <Loader2
              className={cn(
                'size-5 motion-safe:animate-spin motion-reduce:animate-none',
              )}
            />
          ) : (
            <RotateCcw
              className={cn(
                'size-5 transition-transform duration-200',
                'motion-safe:group-hover:rotate-12 motion-safe:group-active:rotate-45',
              )}
            />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="left" sideOffset={8}>
        Tap to refresh
      </TooltipContent>
    </Tooltip>
  );
}
