/**
 * Alert — Molecule
 * Banners de retroalimentación: info, éxito, advertencia, error.
 * Reemplaza los banners inline dispersos en LoginForm, RegisterForm, etc.
 *
 * Uso:
 *   <Alert variant="success" title="Tarea creada">Se añadió al sprint actual.</Alert>
 *   <Alert variant="error" onClose={() => setError(null)}>Algo salió mal.</Alert>
 *   <Alert variant="warning" icon={false}>Tu plan vence pronto.</Alert>
 *
 * Variantes: info | success | warning | error
 * Tamaños: sm | md
 */

import type { HTMLAttributes, ReactNode } from 'react';

// ── Tipos ──────────────────────────────────────────────────────────────────

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
  title?: string;
  /** Muestra el ícono por defecto del variant */
  icon?: boolean | ReactNode;
  /** Callback al cerrar (muestra el botón X si se pasa) */
  onClose?: () => void;
  children?: ReactNode;
}

// ── Configuración de variantes ─────────────────────────────────────────────

const variantConfig = {
  info: {
    container: 'bg-brand-500/8 border-brand-500/25',
    title:     'text-brand-300',
    body:      'text-brand-200/80',
    icon:      'text-brand-400',
    closeHover:'hover:bg-brand-500/20 hover:text-brand-200',
    defaultIcon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  success: {
    container: 'bg-cta-500/8 border-cta-500/25',
    title:     'text-cta-300',
    body:      'text-cta-200/80',
    icon:      'text-cta-400',
    closeHover:'hover:bg-cta-500/20 hover:text-cta-200',
    defaultIcon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  warning: {
    container: 'bg-amber-500/8 border-amber-500/25',
    title:     'text-amber-300',
    body:      'text-amber-200/80',
    icon:      'text-amber-400',
    closeHover:'hover:bg-amber-500/20 hover:text-amber-200',
    defaultIcon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
  error: {
    container: 'bg-red-500/8 border-red-500/25',
    title:     'text-red-300',
    body:      'text-red-200/80',
    icon:      'text-red-400',
    closeHover:'hover:bg-red-500/20 hover:text-red-200',
    defaultIcon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" />
      </svg>
    ),
  },
};

const sizeClasses = {
  sm: 'px-3 py-2.5 rounded-xl text-xs',
  md: 'px-4 py-3.5 rounded-xl text-sm',
};

// ── Componente ─────────────────────────────────────────────────────────────

export const Alert = ({
  variant = 'info',
  size = 'md',
  title,
  icon = true,
  onClose,
  children,
  className = '',
  ...rest
}: AlertProps) => {
  const cfg = variantConfig[variant];

  const resolvedIcon =
    icon === true
      ? cfg.defaultIcon
      : icon === false
      ? null
      : icon;

  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
      className={[
        'flex items-start gap-3 border',
        cfg.container,
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {/* Ícono */}
      {resolvedIcon && (
        <span className={`shrink-0 mt-0.5 ${cfg.icon}`} aria-hidden="true">
          {resolvedIcon}
        </span>
      )}

      {/* Contenido */}
      <div className="flex-1 min-w-0">
        {title && (
          <p className={`font-semibold leading-snug mb-0.5 ${cfg.title}`}>
            {title}
          </p>
        )}
        {children && (
          <p className={`leading-relaxed ${cfg.body} ${title ? '' : cfg.title}`}>
            {children}
          </p>
        )}
      </div>

      {/* Botón cerrar */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar alerta"
          className={[
            'shrink-0 -mt-0.5 -mr-1 rounded-lg p-1 transition-colors duration-150 focus:outline-none',
            cfg.icon,
            cfg.closeHover,
          ].join(' ')}
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};
