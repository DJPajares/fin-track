'use client';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import {
  setUser,
  updateUser,
  clearUser,
} from '../redux/feature/main/mainSlice';

export function useUser() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.main.user);

  const setUserData = (userData: any) => {
    dispatch(setUser(userData));
  };

  const updateUserData = (userData: Partial<any>) => {
    dispatch(updateUser(userData));
  };

  const logout = () => {
    dispatch(clearUser());
  };

  return {
    user,
    setUser: setUserData,
    updateUser: updateUserData,
    logout,
    isAuthenticated: !!user,
  };
}
