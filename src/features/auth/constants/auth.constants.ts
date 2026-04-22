/**
 * Constantes específicas del módulo de autenticación
 */

export const AUTH_MESSAGES = {
  LOGIN_SUCCESS: 'Inicio de sesión exitoso',
  LOGIN_ERROR: 'Credenciales inválidas',
  REGISTER_SUCCESS: 'Registro completado. Verifica tu correo.',
  REGISTER_ERROR: 'Error al registrar el usuario',
  LOGOUT_SUCCESS: 'Sesión cerrada exitosamente',
  VERIFY_EMAIL_SUCCESS: 'Correo verificado exitosamente',
  VERIFY_EMAIL_ERROR: 'Token de verificación inválido o expirado',
  PASSWORD_REQUIREMENTS: 'La contraseña debe tener al menos 6 caracteres, incluir mayúscula, minúscula y número',
} as const;

export const AUTH_VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

export const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'authUser',
} as const;

export const AUTH_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_EMAIL: '/verify-email',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD: '/dashboard',
} as const;
