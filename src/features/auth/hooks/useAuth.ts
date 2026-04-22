/**
 * Hook principal para acceder al estado y acciones de autenticación
 */

import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const {
    isAuthenticated,
    user,
    accessToken,
    isLoading,
    error,
    logout: logoutAction,
    initializeAuth,
  } = useAuthStore();

  // Inicializar auth al montar el componente
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const logout = async () => {
    logoutAction();
  };

  return {
    isAuthenticated,
    user,
    accessToken,
    isLoading,
    error,
    logout,
  };
};
