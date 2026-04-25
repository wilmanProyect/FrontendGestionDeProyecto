/**
 * DashboardPage — Pantalla de bienvenida con AppLayout + Sidebar
 */

import { useAuthStore } from '@/features/auth/store/authStore';
import { AppLayout } from '@/shared/components/AppLayout';

export const DashboardPage = () => {
  const { user } = useAuthStore();

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <AppLayout>
      <div className="p-8">

        {/* ── Header ────────────────────────────────────────────────── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-cta-500/10 border border-cta-500/30 px-2.5 py-0.5 text-xs text-cta-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-cta-400 animate-pulse" />
              Sistema activo
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white">
            {greeting},{' '}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'var(--gradient-brand-glow)' }}
            >
              {user?.firstName ?? 'Usuario'}
            </span>{' '}
            👋
          </h1>
          <p className="text-surface-400 mt-1 text-sm">
            Aquí tienes un resumen de tus proyectos y tareas pendientes.
          </p>
        </div>

        {/* ── Stats cards ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Proyectos activos',  value: '3',   delta: '+1 este mes', color: 'brand'  },
            { label: 'Tareas pendientes',  value: '12',  delta: '3 vencidas',  color: 'accent' },
            { label: 'Completadas hoy',    value: '5',   delta: '+5 hoy',      color: 'cta'    },
            { label: 'Miembros del equipo',value: '8',   delta: '2 nuevos',    color: 'violet' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-surface-600/20 bg-surface-900/60 backdrop-blur-sm p-5 hover:border-surface-600/40 transition-all duration-200"
            >
              <p className="text-xs font-medium text-surface-400 mb-2">{stat.label}</p>
              <p className={`text-3xl font-bold text-${stat.color}-400 mb-1`}>{stat.value}</p>
              <p className="text-xs text-surface-500">{stat.delta}</p>
            </div>
          ))}
        </div>

        {/* ── Actividad reciente ────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Proyectos */}
          <div className="rounded-2xl border border-surface-600/20 bg-surface-900/60 backdrop-blur-sm p-6">
            <h2 className="text-sm font-semibold text-white mb-4">Proyectos recientes</h2>
            <div className="space-y-3">
              {[
                { name: 'ERP Frontend',  progress: 72, color: '#0052FF' },
                { name: 'API Gateway',   progress: 45, color: '#00C2FF' },
                { name: 'Auth Module',   progress: 91, color: '#6366F1' },
              ].map((p) => (
                <div key={p.name}>
                  <div className="flex justify-between items-center mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                      <span className="text-sm text-surface-300">{p.name}</span>
                    </div>
                    <span className="text-xs text-surface-400">{p.progress}%</span>
                  </div>
                  <div className="w-full bg-surface-800 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full transition-all duration-700"
                      style={{ width: `${p.progress}%`, backgroundColor: p.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info de sesión */}
          <div className="rounded-2xl border border-surface-600/20 bg-surface-900/60 backdrop-blur-sm p-6">
            <h2 className="text-sm font-semibold text-white mb-4">Sesión actual</h2>
            <div className="space-y-3">
              {[
                { label: 'Nombre',          value: user ? `${user.firstName} ${user.lastName}` : '—' },
                { label: 'Correo',          value: user?.email ?? '—' },
                { label: 'Email verificado',value: user?.emailVerified ? '✓ Verificado' : '⚠ Pendiente',
                  valueClass: user?.emailVerified ? 'text-cta-400' : 'text-amber-400' },
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-center py-2 border-b border-surface-800 last:border-0">
                  <span className="text-sm text-surface-400">{row.label}</span>
                  <span className={`text-sm font-medium ${row.valueClass ?? 'text-white'}`}>{row.value}</span>
                </div>
              ))}
            </div>

            {/* Aviso */}
            <div className="mt-4 flex items-start gap-2 rounded-xl bg-brand-500/5 border border-brand-500/20 px-3 py-2.5">
              <svg className="w-3.5 h-3.5 text-accent-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-surface-400">
                Dashboard en desarrollo. El flujo de autenticación (Login → 2FA → Dashboard) está completo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
