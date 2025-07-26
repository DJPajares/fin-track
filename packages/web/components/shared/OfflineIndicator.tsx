'use client';

import { usePWA } from '../../lib/hooks/use-pwa';
import { Badge } from '../ui/badge';
import { WifiOff } from 'lucide-react';

export default function OfflineIndicator() {
  const { isOffline } = usePWA();

  if (!isOffline) {
    return null;
  }

  return (
    <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 transform">
      <Badge variant="destructive" className="flex items-center gap-2">
        <WifiOff className="h-3 w-3" />
        <span>Offline</span>
      </Badge>
    </div>
  );
}
