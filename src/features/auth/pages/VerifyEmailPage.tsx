/**
 * Página de verificación de email — diseño premium dark
 */

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authApi } from '../api/authApi';

const verifyEmailSchema = z.object({
  token: z.string().min(1, 'El token es requerido'),
});

type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>;

export const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<VerifyEmailFormData>({
    resolver: zodResolver(verifyEmailSchema),
  });

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setValue('token', token);
      handleAutoVerify(token);
    }
  }, [searchParams, setValue]);

  const handleAutoVerify = async (token: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await authApi.verifyEmail({ token });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch {
      setError('Token inválido o expirado. Por favor solicita uno nuevo.');
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: VerifyEmailFormData) => {
    await handleAutoVerify(data.token);
  };

  /* ——— Estado éxito —————————————————————————————————————— */
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-6">
        <div className="w-full max-w-md text-center">
          {/* Círculo animado de éxito */}
          <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/40 flex items-center justify-center">
            <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">¡Email verificado!</h2>
          <p className="text-slate-400 mb-6">
            Tu cuenta ha sido verificada exitosamente. Redirigiendo al login...
          </p>
          <div className="w-full bg-slate-800 rounded-full h-1.5">
            <div className="bg-emerald-500 h-1.5 rounded-full animate-[grow_3s_linear_forwards]" style={{ width: '100%', animation: 'grow 3s linear forwards' }} />
          </div>
        </div>
      </div>
    );
  }

  /* ——— Formulario ————————————————————————————————————————— */
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-6 py-12">
      {/* Orbes de fondo */}
      <div className="fixed top-[-100px] left-[-100px] w-96 h-96 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />
      <div className="fixed bottom-[-80px] right-[-80px] w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl shadow-black/40 p-8">
          {/* Ícono */}
          <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-600/20 border border-violet-500/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
            </svg>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Verifica tu correo
            </h2>
            <p className="text-slate-400 mt-2 text-sm">
              Ingresa el token que recibiste por correo electrónico
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3">
                <svg className="w-4 h-4 text-red-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Token */}
            <div className="space-y-1.5">
              <label htmlFor="token" className="block text-sm font-medium text-slate-300">
                Token de verificación
              </label>
              <textarea
                {...register('token')}
                id="token"
                rows={3}
                placeholder="Pega aquí el token recibido por correo..."
                className={`block w-full rounded-xl border bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-600 resize-none transition-all duration-200 focus:outline-none focus:ring-2 ${
                  errors.token
                    ? 'border-red-500/60 focus:ring-red-500/30'
                    : 'border-slate-700 hover:border-slate-600 focus:ring-violet-500/60 focus:border-violet-500'
                }`}
              />
              {errors.token && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.token.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 px-4 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all duration-200 hover:from-violet-500 hover:to-indigo-500 hover:shadow-violet-500/40 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Verificando...
                </>
              ) : (
                'Verificar email'
              )}
            </button>

            {/* Reenviar */}
            <p className="text-center text-sm text-slate-500">
              ¿No recibiste el correo?{' '}
              <button
                type="button"
                className="text-violet-400 hover:text-violet-300 font-medium transition-colors duration-200"
              >
                Reenviar email
              </button>
            </p>

            {/* Volver */}
            <div className="pt-2 border-t border-slate-800">
              <a
                href="/login"
                className="flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver al login
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
