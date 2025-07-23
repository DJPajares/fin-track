'use client';

import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { RefreshCw } from 'lucide-react';
import { cn } from '../../lib/utils';
import { isPWA } from '../../lib/hooks/use-pwa';

export default function PWARefreshButton() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 }); // Will be set to lower right

  useEffect(() => {
    // Set initial position to lower right
    const setInitialPosition = () => {
      const buttonSize = 40; // 40px for button width/height
      const margin = 16; // 16px margin from edges
      setPosition({
        x: window.innerWidth - buttonSize - margin,
        y: window.innerHeight - buttonSize - margin,
      });
    };

    setInitialPosition();

    window.addEventListener('resize', setInitialPosition);

    return () => {
      window.removeEventListener('resize', setInitialPosition);
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
  if (!isPWA()) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleRefresh}
      disabled={isRefreshing}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 50,
      }}
      className={cn(
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
