/**
 * Página de registro — diseño premium dark
 */

import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { RegisterForm } from '../components/RegisterForm';
import { useAuth } from '../hooks/useAuth';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex bg-surface-950">
      {/* Panel izquierdo decorativo */}
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden bg-gradient-to-br from-accent-950 via-brand-900 to-surface-900 items-center justify-center p-12">
        <div className="absolute top-[-60px] right-[-60px] w-72 h-72 rounded-full bg-brand-600/25 blur-3xl" />
        <div className="absolute bottom-[-80px] left-[-40px] w-80 h-80 rounded-full bg-accent-500/20 blur-3xl" />

        <div className="relative z-10 text-center">
          <div className="mx-auto mb-8 w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center shadow-2xl shadow-brand-500/30">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4 tracking-tight leading-snug">
            Únete al equipo<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-300">
              hoy mismo
            </span>
          </h1>
          <p className="text-surface-400 leading-relaxed max-w-xs mx-auto">
            Crea tu cuenta y empieza a colaborar con tu equipo en segundos.
          </p>

          {/* Features */}
          <ul className="mt-10 space-y-3 text-left">
            {[
              'Tablero Kanban interactivo',
              'Gestión de tareas y prioridades',
              'Colaboración en tiempo real',
              'Reportes y análisis integrados',
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-sm text-surface-300">
                <div className="w-5 h-5 rounded-full bg-brand-500/20 border border-brand-500/40 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-brand-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 lg:px-16 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center shadow-lg shadow-brand-500/30">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
            </div>
            <span className="text-white font-semibold text-lg">Gestión ERP</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Crear una cuenta
            </h2>
            <p className="text-surface-400 mt-2">
              ¿Ya tienes cuenta?{' '}
              <a href="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors duration-200">
                Inicia sesión
              </a>
            </p>
          </div>

          <RegisterForm />
        </div>
      </div>
    </div>
  );
};
