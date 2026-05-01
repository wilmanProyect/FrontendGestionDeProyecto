/**
 * Constantes globales de la API
 * Actualizado para incluir todas las rutas del módulo gestion-proyectos.
 */

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
} as const;

export const API_ROUTES = {
  // ── Auth ─────────────────────────────────────────────────────────────────
  AUTH: {
    LOGIN:               '/auth/login',
    REGISTER:            '/auth/register',
    LOGOUT:              '/auth/logout',
    VERIFY_EMAIL:        '/auth/verify-email',
    RESEND_VERIFICATION: '/auth/resend-verification',
    VERIFY_2FA:          '/auth/verify-2fa',
    CHECK_STATUS:        '/auth/check-status',
    REFRESH:             '/auth/refresh',
    PROFILE:             '/auth/profile',
  },

  // ── Projects ─────────────────────────────────────────────────────────────
  PROJECTS: {
    LIST:      '/projects',
    CREATE:    '/projects',
    GET:       (id: string) => `/projects/${id}`,
    UPDATE:    (id: string) => `/projects/${id}`,
    DELETE:    (id: string) => `/projects/${id}`,
    ARCHIVE:   (id: string) => `/projects/${id}/archive`,
    UNARCHIVE: (id: string) => `/projects/${id}/unarchive`,
  },

  // ── Lists (columnas Kanban) ───────────────────────────────────────────────
  LISTS: {
    BY_PROJECT: (projectId: string) => `/projects/${projectId}/lists`,
    UPDATE:     (projectId: string, listId: string) => `/projects/${projectId}/lists/${listId}`,
    DELETE:     (projectId: string, listId: string) => `/projects/${projectId}/lists/${listId}`,
  },

  // ── Tasks ─────────────────────────────────────────────────────────────────
  TASKS: {
    LIST:        (projectId: string) => `/projects/${projectId}/tasks`,
    CREATE:      (projectId: string) => `/projects/${projectId}/tasks`,
    GET:         (projectId: string, taskId: string) => `/projects/${projectId}/tasks/${taskId}`,
    MOVE:        (projectId: string, taskId: string) => `/projects/${projectId}/tasks/${taskId}/move`,
    STATUS:      (projectId: string, taskId: string) => `/projects/${projectId}/tasks/${taskId}/status`,
    SET_PRIORITY:(projectId: string, taskId: string, priorityId: string) =>
                   `/projects/${projectId}/tasks/${taskId}/priority/${priorityId}`,
    ASSIGN:      (projectId: string, taskId: string, assigneeId: string) =>
                   `/projects/${projectId}/tasks/${taskId}/assign/${assigneeId}`,
    PRIORITIES:  (projectId: string) => `/projects/${projectId}/tasks/priorities`,
  },

  // ── Labels ────────────────────────────────────────────────────────────────
  LABELS: {
    BY_PROJECT: (projectId: string) => `/projects/${projectId}/labels`,
    UPDATE:     (projectId: string, labelId: string) => `/projects/${projectId}/labels/${labelId}`,
    DELETE:     (projectId: string, labelId: string) => `/projects/${projectId}/labels/${labelId}`,
  },

  // ── Members ───────────────────────────────────────────────────────────────
  MEMBERS: {
    BY_PROJECT:             (projectId: string) => `/projects/${projectId}/members`,
    REMOVE:                 (projectId: string, userId: string) => `/projects/${projectId}/members/${userId}`,
    AVAILABLE_PERMISSIONS:  (projectId: string) => `/projects/${projectId}/available-permissions`,
    MEMBER_PERMISSIONS:     (projectId: string, userId: string) =>
                              `/projects/${projectId}/members/${userId}/permissions`,
  },

  // ── Users (admin / búsqueda) ──────────────────────────────────────────────
  USERS: {
    LIST:   '/users',
    GET:    (id: string) => `/users/${id}`,
    ROLES:  '/users/roles',
  },
} as const;
