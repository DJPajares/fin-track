'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { rehydrateAuth } from '../../lib/redux/feature/auth/authSlice';

export default function AuthRehydrator() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      const userStr = localStorage.getItem('user');

      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          dispatch(rehydrateAuth({ token, user }));
        } catch (error) {
          // If user data is corrupted, clear it
          console.error(error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        }
      }
    }
  }, [dispatch]);

  // This component doesn't render anything
  return null;
}
