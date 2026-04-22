/**
 * Servicios de API para autenticación
 * Contiene todas las llamadas HTTP relacionadas con auth
 */

import axiosInstance from '@/shared/api/axiosInstance';
import { API_ROUTES } from '@/shared/constants/api.constants';
import { ApiResponse } from '@/shared/types/api.types';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyEmailRequest,
  UserData,
  Login2FAResponse,
} from '../types/auth.types';

class AuthApi {
  /**
   * Login del usuario
   */
  async login(credentials: LoginRequest): Promise<LoginResponse | Login2FAResponse> {
    const response = await axiosInstance.post<ApiResponse<LoginResponse | Login2FAResponse>>(
      API_ROUTES.AUTH.LOGIN,
      credentials
    );
    return response.data.data;
  }

  /**
   * Registro de nuevo usuario
   */
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await axiosInstance.post<ApiResponse<RegisterResponse>>(
      API_ROUTES.AUTH.REGISTER,
      data
    );
    return response.data.data;
  }

  /**
   * Verificar email del usuario
   */
  async verifyEmail(data: VerifyEmailRequest): Promise<{ message: string }> {
    const response = await axiosInstance.post<ApiResponse<{ message: string }>>(
      API_ROUTES.AUTH.VERIFY_EMAIL,
      data
    );
    return response.data.data;
  }

  /**
   * Reenviar email de verificación
   */
  async resendVerificationEmail(email: string): Promise<{ message: string }> {
    const response = await axiosInstance.post<ApiResponse<{ message: string }>>(
      API_ROUTES.AUTH.RESEND_VERIFICATION,
      { email }
    );
    return response.data.data;
  }

  /**
   * Verificar 2FA
   */
  async verify2FA(
    temporaryToken: string,
    totpCode: string
  ): Promise<LoginResponse> {
    const response = await axiosInstance.post<ApiResponse<LoginResponse>>(
      API_ROUTES.AUTH.VERIFY_2FA,
      {
        temporaryToken,
        totpCode,
      }
    );
    return response.data.data;
  }

  /**
   * Obtener perfil del usuario autenticado
   */
  async getProfile(): Promise<UserData> {
    const response = await axiosInstance.get<ApiResponse<UserData>>(
      API_ROUTES.AUTH.PROFILE
    );
    return response.data.data;
  }

  /**
   * Verificar estado de autenticación
   */
  async checkAuthStatus(): Promise<{ isAuthenticated: boolean; user?: UserData }> {
    const response = await axiosInstance.get<
      ApiResponse<{ isAuthenticated: boolean; user?: UserData }>
    >(API_ROUTES.AUTH.CHECK_STATUS);
    return response.data.data;
  }

  /**
   * Renovar access token
   */
  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const response = await axiosInstance.post<ApiResponse<LoginResponse>>(
      API_ROUTES.AUTH.REFRESH,
      { refreshToken }
    );
    return response.data.data;
  }

  /**
   * Logout del usuario
   */
  async logout(refreshToken?: string): Promise<{ message: string }> {
    const response = await axiosInstance.post<ApiResponse<{ message: string }>>(
      API_ROUTES.AUTH.LOGOUT,
      refreshToken ? { refreshToken } : {}
    );
    return response.data.data;
  }
}

export const authApi = new AuthApi();
