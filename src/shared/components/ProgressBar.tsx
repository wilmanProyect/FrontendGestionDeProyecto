/**
 * ProgressBar — Atom
 * Barra de progreso visual para proyectos, tareas y sprints.
 *
 * Uso:
 *   <ProgressBar value={72} />
 *   <ProgressBar value={45} color="accent" showLabel />
 *   <ProgressBar value={91} size="lg" color="cta" showLabel labelPosition="inside" />
 *
 * Colores: brand | accent | cta | violet | red | amber
 * Tamaños: xs | sm | md | lg
 */

import type { HTMLAttributes } from 'react';

// ── Tipos ──────────────────────────────────────────────────────────────────

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  /** Valor actual (0–100) */
  value: number;
  /** Valor máximo (default 100) */
  max?: number;
  color?: 'brand' | 'accent' | 'cta' | 'violet' | 'red' | 'amber';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Muestra etiqueta de porcentaje */
  showLabel?: boolean;
  /** Dónde mostrar la etiqueta */
  labelPosition?: 'right' | 'inside';
  /** Animación al cargar */
  animated?: boolean;
  label?: string;
}

// ── Mapas de estilos ───────────────────────────────────────────────────────

const colorFill: Record<NonNullable<ProgressBarProps['color']>, string> = {
  brand:  'bg-brand-500',
  accent: 'bg-accent-500',
  cta:    'bg-cta-500',
  violet: 'bg-violet-500',
  red:    'bg-red-500',
  amber:  'bg-amber-500',
};

const colorLabel: Record<NonNullable<ProgressBarProps['color']>, string> = {
  brand:  'text-brand-400',
  accent: 'text-accent-400',
  cta:    'text-cta-400',
  violet: 'text-violet-400',
  red:    'text-red-400',
  amber:  'text-amber-400',
};

const sizeClasses: Record<NonNullable<ProgressBarProps['size']>, string> = {
  xs: 'h-1',
  sm: 'h-1.5',
  md: 'h-2',
  lg: 'h-3',
};

// ── Componente ─────────────────────────────────────────────────────────────

export const ProgressBar = ({
  value,
  max = 100,
  color = 'brand',
  size = 'sm',
  showLabel = false,
  labelPosition = 'right',
  animated = false,
  label,
  className = '',
  style,
  ...rest
}: ProgressBarProps) => {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const pctDisplay = Math.round(pct);

  return (
    <div className={`w-full ${className}`} {...rest}>
      {/* Label exterior superior */}
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-surface-400">{label}</span>
          {showLabel && labelPosition === 'right' && (
            <span className={`text-xs font-medium ${colorLabel[color]}`}>
              {pctDisplay}%
            </span>
          )}
        </div>
      )}

      <div className="flex items-center gap-2">
        {/* Track */}
        <div
          role="progressbar"
          aria-valuenow={pctDisplay}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label ?? `Progreso: ${pctDisplay}%`}
          className={[
            'relative w-full overflow-hidden rounded-full bg-surface-800',
            sizeClasses[size],
          ].join(' ')}
          style={style}
        >
          {/* Fill */}
          <div
            className={[
              'h-full rounded-full transition-all duration-700 ease-out',
              colorFill[color],
              animated ? 'animate-pulse' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            style={{ width: `${pct}%` }}
          />

          {/* Label inside (solo para size lg) */}
          {showLabel && labelPosition === 'inside' && size === 'lg' && pct > 20 && (
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
              {pctDisplay}%
            </span>
          )}
        </div>

        {/* Label a la derecha (sin label exterior) */}
        {showLabel && !label && labelPosition === 'right' && (
          <span className={`shrink-0 text-xs font-medium tabular-nums ${colorLabel[color]}`}>
            {pctDisplay}%
          </span>
        )}
      </div>
    </div>
  );
};

// ── ProgressCircle — variante circular (para stats de dashboard) ───────────

export interface ProgressCircleProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: 'brand' | 'accent' | 'cta' | 'violet';
  showLabel?: boolean;
  className?: string;
}

const strokeColor: Record<NonNullable<ProgressCircleProps['color']>, string> = {
  brand:  'text-brand-500',
  accent: 'text-accent-500',
  cta:    'text-cta-500',
  violet: 'text-violet-500',
};

export const ProgressCircle = ({
  value,
  max = 100,
  size = 48,
  strokeWidth = 4,
  color = 'brand',
  showLabel = true,
  className = '',
}: ProgressCircleProps) => {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-label={`Progreso: ${Math.round(pct)}%`}
        role="img"
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-surface-800"
        />
        {/* Fill */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`${strokeColor[color]} transition-all duration-700 ease-out -rotate-90 origin-center`}
          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        />
      </svg>

      {showLabel && (
        <span className="absolute text-[10px] font-bold text-white">
          {Math.round(pct)}%
        </span>
      )}
    </div>
  );
};
