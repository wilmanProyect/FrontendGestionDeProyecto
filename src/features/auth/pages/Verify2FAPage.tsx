/**
 * Página de verificación 2FA
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
    .length(6, 'El código debe tener 6 dígitos')
    .regex(/^\d+$/, 'Solo se permiten números'),
});

type Verify2FAFormData = z.infer<typeof verify2FASchema>;

export const Verify2FAPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useAuthStore();

  // Obtener temporaryToken del estado o redirigir a login
  const temporaryToken = localStorage.getItem('temporaryToken');

  useEffect(() => {
    if (!temporaryToken) {
      navigate('/login');
    }
  }, [temporaryToken, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Verify2FAFormData>({
    resolver: zodResolver(verify2FASchema),
  });

  const onSubmit = async (data: Verify2FAFormData) => {
    if (!temporaryToken) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.verify2FA(temporaryToken, data.totpCode);

      setUser(response.user, response.accessToken, response.refreshToken);

      // Limpiar temporaryToken
      localStorage.removeItem('temporaryToken');

      navigate('/dashboard');
    } catch (err) {
      setError('Código 2FA inválido');
      setIsLoading(false);
    }
  };

  if (!temporaryToken) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Verificación de dos factores
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ingresa el código de 6 dígitos de tu aplicación de autenticación
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="totpCode" className="block text-sm font-medium text-gray-700">
              Código de autenticación
            </label>
            <input
              {...register('totpCode')}
              id="totpCode"
              type="text"
              inputMode="numeric"
              maxLength={6}
              className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-center text-2xl tracking-widest text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              placeholder="000000"
              autoComplete="off"
            />
            {errors.totpCode && (
              <p className="mt-1 text-sm text-red-600">{errors.totpCode.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Verificando...' : 'Verificar'}
          </button>

          <div className="text-center">
            <a
              href="/login"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Volver al login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};
