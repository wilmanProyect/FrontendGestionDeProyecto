/**
 * Instancia configurada de Axios para todas las peticiones HTTP
 *
 * Criterios de refresh token cubiertos:
 *  ✅ Envía refreshToken en el body de POST /auth/refresh
 *  ✅ Guarda el nuevo par accessToken + refreshToken (rotación)
 *  ✅ Invalida el token anterior sobrescribiéndolo en localStorage
 *  ✅ Reintenta la petición original con el nuevo accessToken
 *  ✅ En caso de fallo limpia localStorage Y el store de Zustand
 */

import axios, { type AxiosInstance, type AxiosError } from 'axios';
import { API_CONFIG } from '../constants/api.constants';
import { AUTH_STORAGE_KEYS } from '@/features/auth/constants/auth.constants';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers centralizados de storage (usan las mismas claves que tokenStorage)
// ─────────────────────────────────────────────────────────────────────────────
const storage = {
  getAccessToken: () => localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN),
  getRefreshToken: () => localStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN),
  setTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  },
  clearAll: () => {
    localStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
    localStorage.removeItem('temporaryToken');
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Instancia base
// ─────────────────────────────────────────────────────────────────────────────
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Interceptor de petición — agrega Bearer token
// ─────────────────────────────────────────────────────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    const token = storage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─────────────────────────────────────────────────────────────────────────────
// Interceptor de respuesta — maneja 401 con rotación de refresh token
// ─────────────────────────────────────────────────────────────────────────────

// Flag para evitar bucles de refresh simultáneos
let isRefreshing = false;
// Cola de peticiones que esperan el nuevo token
let pendingRequests: Array<(token: string) => void> = [];

const processPendingRequests = (newAccessToken: string) => {
  pendingRequests.forEach((resolve) => resolve(newAccessToken));
  pendingRequests = [];
};

const forceLogout = () => {
  storage.clearAll();
  // Limpia el store de Zustand de forma lazy para evitar imports circulares
  import('@/features/auth/store/authStore').then(({ useAuthStore }) => {
    useAuthStore.getState().logout();
  });
  window.location.href = '/login';
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as typeof error.config & { _retry?: boolean };

    // Solo actúa en errores 401 y evita reintentar el propio endpoint de refresh
    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      originalRequest.url?.includes('/auth/refresh')
    ) {
      return Promise.reject(error);
    }

    // Si ya hay un refresh en curso, encolar esta petición
    if (isRefreshing) {
      return new Promise<string>((resolve) => {
        pendingRequests.push(resolve);
      }).then((newToken) => {
        originalRequest.headers!.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const currentRefreshToken = storage.getRefreshToken();

      if (!currentRefreshToken) {
        forceLogout();
        return Promise.reject(error);
      }

      // ── Criterio 1: Enviar refreshToken en el body ──────────────────────
      const response = await axios.post(`${API_CONFIG.BASE_URL}/auth/refresh`, {
        refreshToken: currentRefreshToken,
      });

      // ── Criterio 3: Guardar nuevo par (rotación) ─────────────────────────
      // El token anterior queda inválido en el backend (Criterio 4)
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        response.data.data;

      storage.setTokens(newAccessToken, newRefreshToken);
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

      // Resolver peticiones en espera con el nuevo token
      processPendingRequests(newAccessToken);

      // Reintentar la petición original
      originalRequest.headers!.Authorization = `Bearer ${newAccessToken}`;
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      // Refresh falló — el token está invalidado o expirado
      pendingRequests = [];
      forceLogout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;
