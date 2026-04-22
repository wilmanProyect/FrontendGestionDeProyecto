/**
 * Constantes globales de la API
 */

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
} as const;

export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    VERIFY_EMAIL: '/auth/verify-email',
    RESEND_VERIFICATION: '/auth/resend-verification',
    VERIFY_2FA: '/auth/verify-2fa',
    CHECK_STATUS: '/auth/check-status',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },
  PROJECTS: {
    LIST: '/projects',
    CREATE: '/projects',
    GET: (id: string) => `/projects/${id}`,
    UPDATE: (id: string) => `/projects/${id}`,
  },
  TASKS: {
    LIST: (projectId: string) => `/projects/${projectId}/tasks`,
    CREATE: (projectId: string) => `/projects/${projectId}/tasks`,
  },
} as const;
