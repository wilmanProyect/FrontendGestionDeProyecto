/**
 * Página de verificación de email
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

  // Si viene el token en la URL, usarlo automáticamente
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setValue('token', token);
      // Auto-submit si viene token en URL
      handleAutoVerify(token);
    }
  }, [searchParams, setValue]);

  const handleAutoVerify = async (token: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await authApi.verifyEmail({ token });
      setSuccess(true);

      // Redirigir a login después de 2 segundos
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError('Token inválido o expirado');
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: VerifyEmailFormData) => {
    await handleAutoVerify(data.token);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md text-center">
          <div className="rounded-md bg-green-50 p-4">
            <h2 className="text-lg font-medium text-green-800">Email verificado exitosamente</h2>
            <p className="mt-2 text-sm text-green-700">
              Redirigiendo a la página de login...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Verifica tu correo electrónico
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ingresa el token que recibiste por correo
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="token" className="block text-sm font-medium text-gray-700">
              Token de verificación
            </label>
            <input
              {...register('token')}
              id="token"
              type="text"
              className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              placeholder="Pega el token aquí"
            />
            {errors.token && (
              <p className="mt-1 text-sm text-red-600">{errors.token.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Verificando...' : 'Verificar email'}
          </button>

          <div className="text-center text-sm">
            <p className="text-gray-600">
              ¿No recibiste el correo?{' '}
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Reenviar email
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
