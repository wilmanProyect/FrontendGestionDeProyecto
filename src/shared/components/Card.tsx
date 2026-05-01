/**
 * Card — Molecule
 * Variants: default | elevated | bordered | glass | stat
 * Extraído y consistente con DashboardPage.tsx
 */

import type { ElementType, HTMLAttributes, ReactNode } from 'react';

/* ── Card base ──────────────────────────────────────────────────────── */

export interface CardProps extends HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'elevated' | 'bordered' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  as?: 'div' | 'article' | 'section' | 'li';
}

const variantClasses: Record<NonNullable<CardProps['variant']>, string> = {
  default:  'bg-surface-900/60 border border-surface-600/20 backdrop-blur-sm',
  elevated: 'bg-surface-900 border border-surface-700/40 shadow-xl shadow-black/30',
  bordered: 'bg-surface-900/40 border-2 border-surface-700/60',
  glass:    'bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-2xl shadow-black/20',
};

const paddingClasses: Record<NonNullable<CardProps['padding']>, string> = {
  none: '',
  sm:   'p-4',
  md:   'p-5',
  lg:   'p-6',
};

export const Card = ({
  variant = 'default',
  padding = 'md',
  hoverable = false,
  as = 'div',
  className = '',
  children,
  ...rest
}: CardProps) => {
  const Tag = as as ElementType;

  return (
    <Tag
    className={[
      'rounded-2xl',
      variantClasses[variant],
      paddingClasses[padding],
      hoverable
        ? 'cursor-pointer hover:border-surface-600/40 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 transition-all duration-200'
        : 'transition-colors duration-200',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
    {...rest}
  >
    {children}
  </Tag>
  );
};

/* ── Card sub-components ────────────────────────────────────────────── */

export const CardHeader = ({
  className = '',
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={`flex items-center justify-between mb-4 ${className}`} {...rest}>
    {children}
  </div>
);

export const CardTitle = ({
  className = '',
  children,
  ...rest
}: HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={`text-sm font-semibold text-white ${className}`} {...rest}>
    {children}
  </h3>
);

export const CardBody = ({
  className = '',
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={className} {...rest}>
    {children}
  </div>
);

export const CardFooter = ({
  className = '',
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`mt-4 pt-4 border-t border-surface-800 flex items-center justify-between ${className}`}
    {...rest}
  >
    {children}
  </div>
);

export const CardDivider = () => (
  <div className="my-4 -mx-5 border-t border-surface-800" aria-hidden="true" />
);

/* ── StatCard — preset para métricas del dashboard ─────────────────── */

export interface StatCardProps {
  label: string;
  value: string | number;
  delta?: string;
  color?: 'brand' | 'accent' | 'cta' | 'violet' | 'red' | 'amber';
  icon?: ReactNode;
  hoverable?: boolean;
}

const statValueColor: Record<NonNullable<StatCardProps['color']>, string> = {
  brand:  'text-brand-400',
  accent: 'text-accent-400',
  cta:    'text-cta-400',
  violet: 'text-violet-400',
  red:    'text-red-400',
  amber:  'text-amber-400',
};

export const StatCard = ({
  label,
  value,
  delta,
  color = 'brand',
  icon,
  hoverable = false,
}: StatCardProps) => (
  <Card hoverable={hoverable}>
    <div className="flex items-start justify-between mb-2">
      <p className="text-xs font-medium text-surface-400">{label}</p>
      {icon && (
        <span className={`${statValueColor[color]} opacity-60`} aria-hidden="true">
          {icon}
        </span>
      )}
    </div>
    <p className={`text-3xl font-bold mb-1 ${statValueColor[color]}`}>{value}</p>
    {delta && <p className="text-xs text-surface-500">{delta}</p>}
  </Card>
);

/* ── InfoRow — fila clave-valor para cards de detalle ───────────────── */

export interface InfoRowProps {
  label: string;
  value: ReactNode;
  valueClassName?: string;
  last?: boolean;
}

export const InfoRow = ({ label, value, valueClassName = 'text-white', last = false }: InfoRowProps) => (
  <div
    className={`flex items-center justify-between py-2 ${last ? '' : 'border-b border-surface-800'}`}
  >
    <span className="text-sm text-surface-400">{label}</span>
    <span className={`text-sm font-medium ${valueClassName}`}>{value}</span>
  </div>
);
