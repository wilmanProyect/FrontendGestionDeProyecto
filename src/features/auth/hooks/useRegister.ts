/**
 * Hook para manejar el registro de nuevo usuario
 */

import { useState } from 'react';
import { authApi } from '../api/authApi';
import { type RegisterRequest } from '../types/auth.types';
import { useAuthStore } from '../store/authStore';
import { AUTH_MESSAGES } from '../constants/auth.constants';

interface RegisterState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

export const useRegister = () => {
  const [state, setState] = useState<RegisterState>({
    isLoading: false,
    error: null,
    success: false,
  });

  const { setLoading, setError } = useAuthStore();

  const register = async (data: RegisterRequest) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    setLoading(true);

    try {
      await authApi.register(data);

      setState((prev) => ({
        ...prev,
        isLoading: false,
        success: true,
      }));
      setLoading(false);

      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : AUTH_MESSAGES.REGISTER_ERROR;

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
    register,
  };
};
