/**
 * Store de Zustand para estado global de autenticación
 */

import { create } from 'zustand';
import { AuthState, UserData } from '../types/auth.types';
import { tokenStorage } from '../utils/tokenStorage';

interface AuthActions {
  setUser: (user: UserData, accessToken: string, refreshToken: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  initializeAuth: () => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
}

export type AuthStoreState = AuthState & AuthActions;

export const useAuthStore = create<AuthStoreState>((set) => ({
  // Estado inicial
  isAuthenticated: false,
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  error: null,

  // Acciones
  setUser: (user, accessToken, refreshToken) => {
    tokenStorage.setTokens(accessToken, refreshToken);
    tokenStorage.setUser(user);
    set({
      user,
      accessToken,
      refreshToken,
      isAuthenticated: true,
      error: null,
    });
  },

  setLoading: (isLoading) => {
    set({ isLoading });
  },

  setError: (error) => {
    set({ error });
  },

  logout: () => {
    tokenStorage.clearAll();
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      error: null,
    });
  },

  initializeAuth: () => {
    const accessToken = tokenStorage.getAccessToken();
    const refreshToken = tokenStorage.getRefreshToken();
    const user = tokenStorage.getUser();

    if (accessToken && user) {
      set({
        user,
        accessToken,
        refreshToken,
        isAuthenticated: true,
      });
    }
  },

  setAuthenticated: (isAuthenticated) => {
    set({ isAuthenticated });
  },
}));
