/**
 * Badge — Atom
 * Colors: brand | accent | cta | violet | red | amber | surface
 * Dot indicator opcional
 */

import type { HTMLAttributes } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  color?: 'brand' | 'accent' | 'cta' | 'violet' | 'red' | 'amber' | 'surface';
  size?: 'sm' | 'md';
  dot?: boolean;
  dotPulse?: boolean;
}

const colorClasses: Record<NonNullable<BadgeProps['color']>, string> = {
  brand:   'bg-brand-500/10 border-brand-500/30 text-brand-400',
  accent:  'bg-accent-500/10 border-accent-500/30 text-accent-400',
  cta:     'bg-cta-500/10 border-cta-500/30 text-cta-400',
  violet:  'bg-violet-500/10 border-violet-500/30 text-violet-400',
  red:     'bg-red-500/10 border-red-500/30 text-red-400',
  amber:   'bg-amber-500/10 border-amber-500/30 text-amber-400',
  surface: 'bg-surface-800 border-surface-700 text-surface-300',
};

const dotColorClasses: Record<NonNullable<BadgeProps['color']>, string> = {
  brand:   'bg-brand-400',
  accent:  'bg-accent-400',
  cta:     'bg-cta-400',
  violet:  'bg-violet-400',
  red:     'bg-red-400',
  amber:   'bg-amber-400',
  surface: 'bg-surface-400',
};

const sizeClasses: Record<NonNullable<BadgeProps['size']>, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
};

export const Badge = ({
  color = 'surface',
  size = 'md',
  dot = false,
  dotPulse = false,
  className = '',
  children,
  ...rest
}: BadgeProps) => (
  <span
    className={[
      'inline-flex items-center gap-1.5 rounded-full border font-medium',
      colorClasses[color],
      sizeClasses[size],
      className,
    ]
      .filter(Boolean)
      .join(' ')}
    {...rest}
  >
    {dot && (
      <span
        className={[
          'w-1.5 h-1.5 rounded-full shrink-0',
          dotColorClasses[color],
          dotPulse ? 'animate-pulse' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        aria-hidden="true"
      />
    )}
    {children}
  </span>
);
