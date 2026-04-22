/**
 * Hook para manejar el login de usuario
 */

import { useState } from 'react';
import { authApi } from '../api/authApi';
import { type LoginRequest, type LoginResponse, type Login2FAResponse } from '../types/auth.types';
import { useAuthStore } from '../store/authStore';
import { AUTH_MESSAGES } from '../constants/auth.constants';

interface LoginState {
  isLoading: boolean;
  error: string | null;
  requiresTwoFA: boolean;
  temporaryToken: string | null;
}

export const useLogin = () => {
  const [state, setState] = useState<LoginState>({
    isLoading: false,
    error: null,
    requiresTwoFA: false,
    temporaryToken: null,
  });

  const { setUser, setLoading, setError } = useAuthStore();

  const login = async (credentials: LoginRequest) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    setLoading(true);

    try {
      const response = await authApi.login(credentials);

      // Verificar si requiere 2FA
      if ('temporaryToken' in response) {
        const login2FAResponse = response as Login2FAResponse;
        setState((prev) => ({
          ...prev,
          requiresTwoFA: true,
          temporaryToken: login2FAResponse.temporaryToken,
          isLoading: false,
        }));
        return { success: true, requiresTwoFA: true };
      }

      // Login exitoso sin 2FA
      const loginResponse = response as LoginResponse;
      setUser(
        loginResponse.user,
        loginResponse.accessToken,
        loginResponse.refreshToken
      );

      setState((prev) => ({ ...prev, isLoading: false }));
      return { success: true, requiresTwoFA: false };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : AUTH_MESSAGES.LOGIN_ERROR;

      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      setError(errorMessage);
      setLoading(false);

      return { success: false, error: errorMessage };
    }
  };

  return {
    ...state,
    login,
  };
};
