/**
 * Configuración de rutas principales de la aplicación
 */

import { createBrowserRouter, type RouteObject, Navigate } from 'react-router-dom';
import { LoginPage, RegisterPage } from '@/features/auth';
import { ProtectedRoute } from '@/shared/components/ProtectedRoute';
import { VerifyEmailPage } from '@/features/auth/pages/VerifyEmailPage';
import { Verify2FAPage } from '@/features/auth/pages/Verify2FAPage';
import { DashboardPage } from '@/features/auth/pages/DashboardPage';

// Página 404
const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-surface-950">
    <div className="text-center">
      <h1 className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-300">
        404
      </h1>
      <p className="mt-4 text-surface-400 text-lg">Página no encontrada</p>
      <a
        href="/"
        className="mt-6 inline-flex items-center gap-2 text-sm text-brand-400 hover:text-brand-300 transition-colors duration-200"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Volver al inicio
      </a>
    </div>
  </div>
);

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/verify-email',
    element: <VerifyEmailPage />,
  },
  {
    path: '/verify-2fa',
    element: <Verify2FAPage />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

export const router = createBrowserRouter(routes);
