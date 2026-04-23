/**
 * Página de Login — CodeForge Technical Branding
 */

import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { LoginForm } from '../components/LoginForm';
import { useAuth } from '../hooks/useAuth';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex bg-surface-950">

      {/* ── Panel izquierdo — Forge Gradient ──────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12"
        style={{ background: 'var(--gradient-forge)' }}
      >
        {/* Orbes de profundidad */}
        <div className="absolute top-[-80px] left-[-80px] w-96 h-96 rounded-full bg-accent-500/20 blur-3xl" />
        <div className="absolute bottom-[-60px] right-[-60px] w-80 h-80 rounded-full bg-violet-500/25 blur-3xl" />
        <div className="absolute top-1/3 right-[-40px] w-64 h-64 rounded-full bg-brand-400/15 blur-2xl" />

        <div className="relative z-10 text-center">
          {/* Logo */}
          <div className="mx-auto mb-8 w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-2xl shadow-brand-500/30">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
          </div>

          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
            Gestión de<br />
            <span className="text-accent-300">Proyectos ERP</span>
          </h1>
          <p className="text-white/60 text-base leading-relaxed max-w-sm mx-auto">
            Centraliza tus proyectos, tareas y equipos con precisión técnica.
          </p>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-3">
            {[
              { label: 'Proyectos', value: '120+' },
              { label: 'Usuarios', value: '1.4k' },
              { label: 'Tareas', value: '8.2k' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-3">
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-white/50 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Indicadores tech */}
          <div className="mt-8 flex justify-center gap-3">
            {['WCAG AA', 'JWT', '2FA'].map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-accent-500/20 border border-accent-500/30 px-2.5 py-1 text-xs text-accent-300 font-mono">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Panel derecho — formulario ────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-16">
        <div className="w-full max-w-md">

          {/* Logo mobile */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/30"
              style={{ background: 'var(--gradient-forge)' }}
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
            </div>
            <span className="text-white font-semibold text-lg">CodeForge ERP</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Bienvenido de vuelta
            </h2>
            <p className="text-surface-400 mt-2">
              ¿No tienes cuenta?{' '}
              <a href="/register" className="text-accent-400 hover:text-accent-300 font-medium transition-colors duration-200">
                Regístrate gratis
              </a>
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
};
