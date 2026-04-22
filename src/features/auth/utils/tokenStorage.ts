/**
 * Utilidades para manejar el almacenamiento de tokens
 */

import { AUTH_STORAGE_KEYS } from '../constants/auth.constants';
import { type UserData } from '../types/auth.types';

export const tokenStorage = {
  /**
   * Guarda los tokens en localStorage
   */
  setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  },

  /**
   * Obtiene el access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
  },

  /**
   * Obtiene el refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
  },

  /**
   * Elimina los tokens
   */
  clearTokens() {
    localStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
  },

  /**
   * Guarda los datos del usuario
   */
  setUser(user: UserData) {
    localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(user));
  },

  /**
   * Obtiene los datos del usuario
   */
  getUser(): UserData | null {
    const user = localStorage.getItem(AUTH_STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  },

  /**
   * Elimina los datos del usuario
   */
  clearUser() {
    localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
  },

  /**
   * Limpia toda la información de autenticación
   */
  clearAll() {
    this.clearTokens();
    this.clearUser();
  },

  /**
   * Verifica si hay un token activo
   */
  hasToken(): boolean {
    return !!this.getAccessToken();
  },
};
