/**
 * Tipos globales para respuestas de la API
 */

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
}

export interface ApiError {
  success: false;
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
