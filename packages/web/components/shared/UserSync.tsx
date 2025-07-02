'use client';

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useUser } from '../../lib/hooks/use-user';

export function UserSync() {
  const { data: session, status } = useSession();
  const { user, setUser, logout } = useUser();
  const lastUserId = useRef<string>('');

  useEffect(() => {
    if (
      status === 'authenticated' &&
      session?.user?.id &&
      session.user.id !== lastUserId.current
    ) {
      // Fetch user data from your API using the user ID
      const fetchUserData = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/auth/profile`,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${(session as any).accessToken || ''}`,
              },
            },
          );

          if (response.ok) {
            const data = await response.json();
            const userData = data.data.user;

            lastUserId.current = session.user?.id || '';
            setUser(userData);
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        }
      };

      fetchUserData();
    } else if (status === 'unauthenticated' && user) {
      lastUserId.current = '';
      logout();
    }
  }, [session?.user?.id, status, setUser, logout, user]);

  // This component doesn't render anything
  return null;
}
