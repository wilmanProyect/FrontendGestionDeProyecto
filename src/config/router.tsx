/**
 * Configuración de rutas principales de la aplicación
 */

import { createBrowserRouter, type RouteObject, Navigate } from 'react-router-dom';
import { LoginPage, RegisterPage } from '@/features/auth';
import { ProtectedRoute } from '@/shared/components/ProtectedRoute';
import { VerifyEmailPage } from '@/features/auth/pages/VerifyEmailPage';
import { Verify2FAPage } from '@/features/auth/pages/Verify2FAPage';

// Páginas
const DashboardPage = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-4 text-gray-600">Bienvenido al sistema de gestión de proyectos</p>
    </div>
  </div>
);

const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900">404</h1>
      <p className="mt-4 text-gray-600">Página no encontrada</p>
      <a href="/" className="mt-6 inline-block text-blue-600 hover:text-blue-500">
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
