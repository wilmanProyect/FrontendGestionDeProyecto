/**
 * Toggle — Atom
 * Interruptor tipo switch para activar/desactivar opciones.
 * Extraído de la lógica de notificaciones del Sidebar, ahora como componente reutilizable.
 *
 * Uso:
 *   <Toggle checked={active} onChange={setActive} label="Notificaciones" />
 *   <Toggle checked={active} onChange={setActive} size="sm" color="cta" />
 *
 * Colores: brand | accent | cta | violet
 * Tamaños: sm | md | lg
 */

import { useId, type InputHTMLAttributes } from 'react';

// ── Tipos ──────────────────────────────────────────────────────────────────

export interface ToggleProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'onChange'> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  labelPosition?: 'left' | 'right';
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'brand' | 'accent' | 'cta' | 'violet';
}

// ── Mapas de estilos ───────────────────────────────────────────────────────

const trackSize = {
  sm: { track: 'w-8 h-4',  thumb: 'w-3 h-3',  translate: 'translate-x-4' },
  md: { track: 'w-10 h-5', thumb: 'w-4 h-4',  translate: 'translate-x-5' },
  lg: { track: 'w-12 h-6', thumb: 'w-5 h-5',  translate: 'translate-x-6' },
};

const trackColor: Record<NonNullable<ToggleProps['color']>, string> = {
  brand:  'bg-brand-500',
  accent: 'bg-accent-500',
  cta:    'bg-cta-500',
  violet: 'bg-violet-500',
};

// ── Componente ─────────────────────────────────────────────────────────────

export const Toggle = ({
  checked,
  onChange,
  label,
  labelPosition = 'right',
  description,
  size = 'md',
  color = 'brand',
  disabled,
  id,
  className = '',
  ...rest
}: ToggleProps) => {
  const uid = useId();
  const inputId = id ?? uid;
  const { track, thumb, translate } = trackSize[size];

  const switchEl = (
    <label
      htmlFor={inputId}
      className={[
        'relative inline-flex shrink-0 items-center cursor-pointer',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <input
        type="checkbox"
        id={inputId}
        role="switch"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
        aria-checked={checked}
        {...rest}
      />
      {/* Track */}
      <div
        className={[
          track,
          'rounded-full transition-colors duration-200',
          checked ? trackColor[color] : 'bg-surface-700',
        ].join(' ')}
      >
        {/* Thumb */}
        <span
          className={[
            thumb,
            'block rounded-full bg-white shadow-sm transition-transform duration-200',
            'absolute top-0.5 left-0.5',
            checked ? translate : 'translate-x-0',
          ].join(' ')}
        />
      </div>
    </label>
  );

  if (!label && !description) return switchEl;

  const labelEl = (
    <div className="flex flex-col">
      {label && (
        <label
          htmlFor={inputId}
          className={`text-sm font-medium text-surface-200 cursor-pointer ${disabled ? 'opacity-50' : ''}`}
        >
          {label}
        </label>
      )}
      {description && (
        <span className="text-xs text-surface-500 mt-0.5">{description}</span>
      )}
    </div>
  );

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {labelPosition === 'left' && labelEl}
      {switchEl}
      {labelPosition === 'right' && labelEl}
    </div>
  );
};
