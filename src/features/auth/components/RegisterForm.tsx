/**
 * Formulario de registro — diseño premium dark
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../hooks/useRegister';
import { AUTH_VALIDATION_RULES, AUTH_MESSAGES } from '../constants/auth.constants';

const registerSchema = z
  .object({
    email: z
      .string()
      .email('Correo electrónico inválido')
      .min(1, 'El correo es requerido'),
    password: z
      .string()
      .min(AUTH_VALIDATION_RULES.PASSWORD_MIN_LENGTH, 'La contraseña debe tener al menos 6 caracteres')
      .regex(AUTH_VALIDATION_RULES.PASSWORD_PATTERN, AUTH_MESSAGES.PASSWORD_REQUIREMENTS),
    confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
    firstName: z
      .string()
      .min(2, 'El nombre debe tener al menos 2 caracteres'),
    lastName: z
      .string()
      .min(2, 'El apellido debe tener al menos 2 caracteres'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

// Clase de input reutilizable
const inputClass = (hasError: boolean) =>
  `block w-full rounded-xl border bg-surface-900 px-4 py-3 text-sm text-white placeholder-surface-500 transition-all duration-200 focus:outline-none focus:ring-2 ${
    hasError
      ? 'border-red-500/60 focus:ring-red-500/30'
      : 'border-surface-700 hover:border-surface-600 focus:ring-brand-500/60 focus:border-brand-500'
  }`;

const inputWithIconClass = (hasError: boolean) =>
  `block w-full rounded-xl border bg-surface-900 pl-10 pr-11 py-3 text-sm text-white placeholder-surface-500 transition-all duration-200 focus:outline-none focus:ring-2 ${
    hasError
      ? 'border-red-500/60 focus:ring-red-500/30'
      : 'border-surface-700 hover:border-surface-600 focus:ring-brand-500/60 focus:border-brand-500'
  }`;

const FieldError = ({ message }: { message?: string }) =>
  message ? (
    <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
      <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      {message}
    </p>
  ) : null;

export const RegisterForm = () => {
  const navigate = useNavigate();
  const { register, isLoading, error } = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    const result = await register({
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
    });

    if (result.success) {
      navigate('/verify-email');
    }
  };

  const EyeIcon = ({ open }: { open: boolean }) =>
    open ? (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
      </svg>
    ) : (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    );

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      {/* Error global */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3">
          <svg className="w-4 h-4 text-red-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Nombre y Apellido */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label htmlFor="firstName" className="block text-sm font-medium text-surface-300">
            Nombre
          </label>
          <input
            {...registerField('firstName')}
            id="firstName"
            type="text"
            placeholder="Juan"
            className={inputClass(!!errors.firstName)}
          />
          <FieldError message={errors.firstName?.message} />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="lastName" className="block text-sm font-medium text-surface-300">
            Apellido
          </label>
          <input
            {...registerField('lastName')}
            id="lastName"
            type="text"
            placeholder="Pérez"
            className={inputClass(!!errors.lastName)}
          />
          <FieldError message={errors.lastName?.message} />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label htmlFor="email" className="block text-sm font-medium text-surface-300">
          Correo electrónico
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <svg className="h-4 w-4 text-surface-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          </div>
          <input
            {...registerField('email')}
            id="email"
            type="email"
            autoComplete="email"
            placeholder="correo@example.com"
            className={inputWithIconClass(!!errors.email)}
          />
        </div>
        <FieldError message={errors.email?.message} />
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label htmlFor="password" className="block text-sm font-medium text-surface-300">
          Contraseña
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <svg className="h-4 w-4 text-surface-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <input
            {...registerField('password')}
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="••••••••"
            className={inputWithIconClass(!!errors.password)}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-surface-500 hover:text-surface-300 transition-colors duration-200"
          >
            <EyeIcon open={showPassword} />
          </button>
        </div>
        <FieldError message={errors.password?.message} />
      </div>

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-surface-300">
          Confirmar contraseña
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <svg className="h-4 w-4 text-surface-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <input
            {...registerField('confirmPassword')}
            id="confirmPassword"
            type={showConfirm ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Repite tu contraseña"
            className={inputWithIconClass(!!errors.confirmPassword)}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-surface-500 hover:text-surface-300 transition-colors duration-200"
          >
            <EyeIcon open={showConfirm} />
          </button>
        </div>
        <FieldError message={errors.confirmPassword?.message} />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="mt-2 relative w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 py-3 px-4 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition-all duration-200 hover:from-brand-500 hover:to-accent-500 hover:shadow-brand-500/40 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-surface-950 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Creando cuenta...
          </>
        ) : (
          'Crear cuenta'
        )}
      </button>

      <p className="text-center text-xs text-surface-500 mt-3">
        Al registrarte aceptas nuestros{' '}
        <a href="#" className="text-brand-400 hover:text-brand-300 transition-colors">términos y condiciones</a>
      </p>
    </form>
  );
};
