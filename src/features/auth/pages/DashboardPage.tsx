/**
 * Página de bienvenida temporal — se mostrará tras login exitoso
 * (Con o sin 2FA)
 */

import { useAuthStore } from '@/features/auth/store/authStore';
import { useNavigate } from 'react-router-dom';

export const DashboardPage = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center px-6">
      {/* Orbes decorativos */}
      <div className="fixed top-[-100px] left-[-100px] w-96 h-96 rounded-full bg-brand-600/10 blur-3xl pointer-events-none" />
      <div className="fixed bottom-[-80px] right-[-80px] w-80 h-80 rounded-full bg-accent-500/10 blur-3xl pointer-events-none" />

      <div className="relative text-center max-w-md w-full">
        {/* Ícono de éxito animado */}
        <div className="mx-auto mb-6 w-24 h-24 rounded-full bg-emerald-500/10 border-2 border-emerald-500/40 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-emerald-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Mensaje principal */}
        <h1 className="text-3xl font-bold text-white tracking-tight mb-3">
          ¡Login exitoso!
        </h1>

        <p className="text-surface-400 mb-2">
          Bienvenido de nuevo,{' '}
          <span className="text-brand-400 font-semibold">
            {user ? `${user.firstName} ${user.lastName}` : 'Usuario'}
          </span>
        </p>

        <p className="text-surface-500 text-sm mb-10">
          {user?.email}
        </p>

        {/* Badges de info */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-medium text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Autenticado
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 px-3 py-1 text-xs font-medium text-brand-400">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Sesión segura
          </span>
        </div>

        {/* Card de información */}
        <div className="bg-surface-900/60 backdrop-blur-xl border border-surface-800 rounded-2xl p-6 mb-8 text-left">
          <h3 className="text-xs font-semibold text-surface-500 uppercase tracking-widest mb-4">
            Información de sesión
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-surface-400">Nombre</span>
              <span className="text-sm font-medium text-white">
                {user ? `${user.firstName} ${user.lastName}` : '—'}
              </span>
            </div>
            <div className="h-px bg-surface-800" />
            <div className="flex justify-between items-center">
              <span className="text-sm text-surface-400">Correo</span>
              <span className="text-sm font-medium text-white">{user?.email ?? '—'}</span>
            </div>
            <div className="h-px bg-surface-800" />
            <div className="flex justify-between items-center">
              <span className="text-sm text-surface-400">Email verificado</span>
              <span className={`text-sm font-medium ${user?.emailVerified ? 'text-emerald-400' : 'text-amber-400'}`}>
                {user?.emailVerified ? 'Sí' : 'Pendiente'}
              </span>
            </div>
          </div>
        </div>

        {/* Aviso placeholder */}
        <div className="flex items-start gap-2 rounded-xl bg-surface-800/60 border border-surface-700/50 px-4 py-3 mb-8 text-left">
          <svg className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-surface-400">
            El Dashboard completo está en desarrollo. Esta pantalla confirma que el flujo de autenticación (Login → 2FA → Dashboard) funciona correctamente.
          </p>
        </div>

        {/* Botón logout */}
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 mx-auto text-sm text-surface-500 hover:text-surface-300 transition-colors duration-200 group"
        >
          <svg className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};
