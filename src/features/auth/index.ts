/**
 * Exportaciones públicas del módulo de autenticación
 */

// Pages
export { LoginPage } from './pages/LoginPage';
export { RegisterPage } from './pages/RegisterPage';
export { VerifyEmailPage } from './pages/VerifyEmailPage';
export { Verify2FAPage } from './pages/Verify2FAPage';

// Components
export { LoginForm } from './components/LoginForm';
export { RegisterForm } from './components/RegisterForm';

// Hooks
export { useAuth } from './hooks/useAuth';
export { useLogin } from './hooks/useLogin';
export { useRegister } from './hooks/useRegister';

// Store
export { useAuthStore } from './store/authStore';
export type { AuthStoreState } from './store/authStore';

// API
export { authApi } from './api/authApi';

// Types
export type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  UserData,
  AuthState,
  VerifyEmailFormValues,
  Verify2FAFormValues,
} from './types/auth.types';

// Utils
export { tokenStorage } from './utils/tokenStorage';

// Constants
export { AUTH_MESSAGES, AUTH_VALIDATION_RULES, AUTH_ROUTES } from './constants/auth.constants';
