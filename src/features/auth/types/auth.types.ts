/**
 * Tipos específicos del módulo de autenticación
 */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserData;
}

export interface Login2FAResponse {
  temporaryToken: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface RegisterResponse {
  user: UserData;
  message: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserData | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface VerifyEmailFormValues {
  token: string;
}

export interface Verify2FAFormValues {
  temporaryToken: string;
  totpCode: string;
}
