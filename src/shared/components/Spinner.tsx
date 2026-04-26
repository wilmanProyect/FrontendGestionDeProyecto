/**
 * Spinner + Skeleton — Atoms
 */

import type { HTMLAttributes } from 'react';

/* ── Spinner ────────────────────────────────────────────────────────── */

export interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const spinnerSizeClasses: Record<NonNullable<SpinnerProps['size']>, string> = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

export const Spinner = ({ size = 'md', className = '' }: SpinnerProps) => (
  <svg
    className={`animate-spin text-brand-400 ${spinnerSizeClasses[size]} ${className}`}
    fill="none"
    viewBox="0 0 24 24"
    aria-label="Cargando"
    role="status"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
);

/* ── Skeleton ───────────────────────────────────────────────────────── */

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  lines?: number;
  gap?: string;
}

const skeletonRounded: Record<NonNullable<SkeletonProps['rounded']>, string> = {
  sm: 'rounded',
  md: 'rounded-lg',
  lg: 'rounded-xl',
  full: 'rounded-full',
};

export const Skeleton = ({
  width,
  height = '1rem',
  rounded = 'md',
  lines = 1,
  gap = '0.5rem',
  className = '',
  style,
  ...rest
}: SkeletonProps) => {
  if (lines > 1) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap }} {...rest}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`animate-pulse bg-surface-800 ${skeletonRounded[rounded]} ${className}`}
            style={{
              width: i === lines - 1 ? '65%' : width ?? '100%',
              height,
              ...style,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`animate-pulse bg-surface-800 ${skeletonRounded[rounded]} ${className}`}
      style={{ width: width ?? '100%', height, ...style }}
      {...rest}
    />
  );
};

/* ── SkeletonCard — convenience preset ─────────────────────────────── */

export const SkeletonCard = () => (
  <div className="rounded-2xl border border-surface-600/20 bg-surface-900/60 p-5 space-y-3">
    <div className="flex items-center gap-3">
      <Skeleton width="2.5rem" height="2.5rem" rounded="full" />
      <div className="flex-1">
        <Skeleton height="0.875rem" width="60%" className="mb-2" />
        <Skeleton height="0.75rem" width="40%" />
      </div>
    </div>
    <Skeleton height="0.75rem" lines={3} />
  </div>
);
