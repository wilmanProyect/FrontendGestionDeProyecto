/**
 * Página de verificación 2FA — diseño premium dark
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../store/authStore';

const verify2FASchema = z.object({
  totpCode: z
    .string()
    .length(6, 'El código debe tener exactamente 6 dígitos')
    .regex(/^\d+$/, 'Solo se permiten números'),
});

type Verify2FAFormData = z.infer<typeof verify2FASchema>;

export const Verify2FAPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useAuthStore();

  const temporaryToken = localStorage.getItem('temporaryToken');

  useEffect(() => {
    if (!temporaryToken) navigate('/login');
  }, [temporaryToken, navigate]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Verify2FAFormData>({
    resolver: zodResolver(verify2FASchema),
  });

  const codeValue = watch('totpCode') ?? '';

  const onSubmit = async (data: Verify2FAFormData) => {
    if (!temporaryToken) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.verify2FA(temporaryToken, data.totpCode);
      setUser(response.user, response.accessToken, response.refreshToken);
      localStorage.removeItem('temporaryToken');
      navigate('/dashboard');
    } catch {
      setError('Código 2FA inválido. Verifica tu aplicación de autenticación.');
      setIsLoading(false);
    }
  };

  if (!temporaryToken) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-950 px-6 py-12">
      {/* Orbes de fondo */}
      <div className="fixed top-[-80px] right-[-80px] w-96 h-96 rounded-full bg-brand-600/10 blur-3xl pointer-events-none" />
      <div className="fixed bottom-[-80px] left-[-80px] w-80 h-80 rounded-full bg-accent-500/10 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-sm">
        {/* Card */}
        <div className="bg-surface-900/80 backdrop-blur-xl border border-surface-800 rounded-2xl shadow-2xl shadow-black/40 p-8">
          {/* Ícono */}
          <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500/20 to-accent-600/20 border border-brand-500/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Autenticación de dos factores
            </h2>
            <p className="text-surface-400 mt-2 text-sm">
              Ingresa el código de 6 dígitos de tu aplicación autenticadora
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

            {/* Input de código grande */}
            <div className="space-y-2">
              <label htmlFor="totpCode" className="block text-sm font-medium text-surface-300 text-center">
                Código de verificación
              </label>
              <input
                {...register('totpCode')}
                id="totpCode"
                type="text"
                inputMode="numeric"
                maxLength={6}
                autoComplete="one-time-code"
                placeholder="000000"
                className={`block w-full rounded-xl border bg-surface-950 px-4 py-4 text-center text-3xl font-bold tracking-[0.5em] text-white placeholder-surface-700 transition-all duration-200 focus:outline-none focus:ring-2 ${
                  errors.totpCode
                    ? 'border-red-500/60 focus:ring-red-500/30'
                    : 'border-surface-700 hover:border-surface-600 focus:ring-brand-500/60 focus:border-brand-500'
                }`}
              />

              {/* Barra de progreso de dígitos */}
              <div className="flex gap-1.5 justify-center mt-2">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`h-1 w-8 rounded-full transition-all duration-300 ${
                      (codeValue?.length ?? 0) > i
                        ? 'bg-brand-500'
                        : 'bg-surface-700'
                    }`}
                  />
                ))}
              </div>

              {errors.totpCode && (
                <p className="text-xs text-red-400 flex items-center justify-center gap-1 mt-1">
                  <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.totpCode.message}
                </p>
              )}
            </div>

            {/* Tip */}
            <div className="flex items-start gap-2 rounded-xl bg-surface-800/60 border border-surface-700/50 px-3 py-2.5">
              <svg className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-surface-400">
                Abre tu aplicación de autenticación (Google Authenticator, Authy, etc.) para ver el código actual.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || (codeValue?.length ?? 0) < 6}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 py-3 px-4 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition-all duration-200 hover:from-brand-500 hover:to-accent-500 hover:shadow-brand-500/40 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-surface-900 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
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
                'Verificar código'
              )}
            </button>

            {/* Volver */}
            <div className="pt-2 border-t border-surface-800">
              <a
                href="/login"
                className="flex items-center justify-center gap-2 text-sm text-surface-500 hover:text-surface-300 transition-colors duration-200"
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
