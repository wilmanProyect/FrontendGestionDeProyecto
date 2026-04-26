/**
 * FormField — Molecule
 * Combina Label + Input + FieldError en una unidad reutilizable.
 * También exporta FieldError, FormSection, FormGrid y GlobalFormError.
 */

import type { ReactNode } from 'react';

/* ── FieldError ─────────────────────────────────────────────────────── */

export interface FieldErrorProps {
  message?: string;
  id?: string;
}

export const FieldError = ({ message, id }: FieldErrorProps) => {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="text-xs text-red-400 flex items-center gap-1 mt-1">
      <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
      {message}
    </p>
  );
};

/* ── GlobalFormError — banner de error global ───────────────────────── */

export interface GlobalFormErrorProps {
  error?: string | null;
}

export const GlobalFormError = ({ error }: GlobalFormErrorProps) => {
  if (!error) return null;
  return (
    <div
      role="alert"
      className="flex items-center gap-3 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3"
    >
      <svg className="w-4 h-4 text-red-400 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
      <p className="text-sm text-red-400">{error}</p>
    </div>
  );
};

/* ── GlobalFormSuccess — banner de éxito ────────────────────────────── */

export interface GlobalFormSuccessProps {
  message?: string | null;
}

export const GlobalFormSuccess = ({ message }: GlobalFormSuccessProps) => {
  if (!message) return null;
  return (
    <div
      role="status"
      className="flex items-center gap-3 rounded-xl bg-cta-500/10 border border-cta-500/30 px-4 py-3"
    >
      <svg className="w-4 h-4 text-cta-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      <p className="text-sm text-cta-400">{message}</p>
    </div>
  );
};

/* ── FormSection — sección con título opcional ──────────────────────── */

export interface FormSectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export const FormSection = ({ title, description, children, className = '' }: FormSectionProps) => (
  <fieldset className={`space-y-4 ${className}`}>
    {(title || description) && (
      <legend className="mb-2">
        {title && <p className="text-sm font-semibold text-white">{title}</p>}
        {description && <p className="text-xs text-surface-500 mt-0.5">{description}</p>}
      </legend>
    )}
    {children}
  </fieldset>
);

/* ── FormGrid — grid de 2 columnas para grupos de inputs ────────────── */

export interface FormGridProps {
  children: ReactNode;
  cols?: 2 | 3;
  className?: string;
}

export const FormGrid = ({ children, cols = 2, className = '' }: FormGridProps) => (
  <div
    className={[
      'grid gap-3',
      cols === 2 ? 'grid-cols-2' : 'grid-cols-3',
      className,
    ].join(' ')}
  >
    {children}
  </div>
);

/* ── PasswordToggleIcon — ícono reutilizable para campos password ────── */

export const PasswordToggleIcon = ({
  visible,
  onClick,
}: {
  visible: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
    className="text-surface-500 hover:text-accent-400 transition-colors duration-200 focus:outline-none focus:text-accent-400"
  >
    {visible ? (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
      </svg>
    ) : (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    )}
  </button>
);

/* ── TermsNote — nota de TyC al final de formularios de registro ─────── */

export const TermsNote = () => (
  <p className="text-center text-xs text-surface-500">
    Al continuar aceptas nuestros{' '}
    <a href="/terms" className="text-brand-400 hover:text-brand-300 transition-colors">
      términos y condiciones
    </a>{' '}
    y{' '}
    <a href="/privacy" className="text-brand-400 hover:text-brand-300 transition-colors">
      política de privacidad
    </a>
  </p>
);
