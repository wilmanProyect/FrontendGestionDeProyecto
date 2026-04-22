/**
 * Página de registro
 */

import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { RegisterForm } from '../components/RegisterForm';
import { useAuth } from '../hooks/useAuth';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Si el usuario ya está autenticado, redirigir al dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Crea una nueva cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            O{' '}
            <a
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              inicia sesión en tu cuenta
            </a>
          </p>
        </div>

        <RegisterForm />
      </div>
    </div>
  );
};
