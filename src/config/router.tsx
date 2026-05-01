/**
 * router.tsx
 * Configuración de rutas principales.
 * Agregada la ruta /projects/:id/board para el tablero Kanban.
 */

import { createBrowserRouter, type RouteObject, Navigate } from 'react-router-dom';
import { LoginPage, RegisterPage } from '@/features/auth';
import { ProtectedRoute } from '@/shared/components/ProtectedRoute';
import { VerifyEmailPage } from '@/features/auth/pages/VerifyEmailPage';
import { Verify2FAPage } from '@/features/auth/pages/Verify2FAPage';
import { DashboardPage } from '@/features/auth/pages/DashboardPage';
import { AppLayout } from '@/shared/components/AppLayout';
import { ComponentsShowcase } from '@/shared/components/ComponentsShowcase';

// ── Feature: projects ─────────────────────────────────────────────────────
import { BoardPage } from '@/features/project/components/BoardPage';
import { ProjectSettingsPage } from '@/features/project/components/ProjectSettingsPage';

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

  // ── Tablero Kanban ────────────────────────────────────────────────────
  // Ruta: /projects/:id/board
  // NOTA: AppLayout ya está incluido dentro de BoardPage para mantener
  //       la arquitectura consistente con DashboardPage.
  {
    path: '/projects/:id/board',
    element: (
      <ProtectedRoute>
        <BoardPage />
      </ProtectedRoute>
    ),
  },

  {
    path: '/projects/:id/settings',
    element: (
      <ProtectedRoute>
        <ProjectSettingsPage />
      </ProtectedRoute>
    ),
  },

  // ── Design System — Showcase ──────────────────────────────────────────
  {
    path: '/components',
    element: (
      <AppLayout>
        <ComponentsShowcase />
      </AppLayout>
    ),
  },

  // Redirects de rutas antiguas
  { path: '/components/alert',        element: <Navigate to="/components#alert"        replace /> },
  { path: '/components/avatar',       element: <Navigate to="/components#avatar"       replace /> },
  { path: '/components/avatar-group', element: <Navigate to="/components#avatar-group" replace /> },
  { path: '/components/badge',        element: <Navigate to="/components#badge"        replace /> },
  { path: '/components/button',       element: <Navigate to="/components#button"       replace /> },
  { path: '/components/card',         element: <Navigate to="/components#card"         replace /> },
  { path: '/components/dropdown',     element: <Navigate to="/components#dropdown"     replace /> },
  { path: '/components/empty-state',  element: <Navigate to="/components#empty-state"  replace /> },
  { path: '/components/input',        element: <Navigate to="/components#input"        replace /> },
  { path: '/components/kanban',       element: <Navigate to="/components#kanban"       replace /> },
  { path: '/components/modal',        element: <Navigate to="/components#modal"        replace /> },
  { path: '/components/priority',     element: <Navigate to="/components#priority"     replace /> },
  { path: '/components/progress-bar', element: <Navigate to="/components#progress"     replace /> },
  { path: '/components/select',       element: <Navigate to="/components#select"       replace /> },
  { path: '/components/spinner',      element: <Navigate to="/components#spinner"      replace /> },
  { path: '/components/tabs',         element: <Navigate to="/components#tabs"         replace /> },
  { path: '/components/toast',        element: <Navigate to="/components#toast"        replace /> },
  { path: '/components/toggle',       element: <Navigate to="/components#toggle"       replace /> },
  { path: '/components/tooltip',      element: <Navigate to="/components#tooltip"      replace /> },

  {
    path: '*',
    element: <NotFoundPage />,
  },
];

export const router = createBrowserRouter(routes);
