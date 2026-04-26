/**
 * Button — Atom
 * Variants: primary | secondary | ghost | danger
 * Sizes: sm | md | lg
 */

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Spinner } from './Spinner';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: [
    'text-white shadow-lg shadow-brand-500/30',
    'hover:shadow-brand-500/50 hover:-translate-y-0.5',
    'focus:ring-brand-500 focus:ring-offset-surface-950',
    'disabled:shadow-none',
  ].join(' '),
  secondary: [
    'bg-surface-800 text-surface-200 border border-surface-700',
    'hover:bg-surface-700 hover:border-surface-600 hover:text-white',
    'focus:ring-surface-500 focus:ring-offset-surface-950',
  ].join(' '),
  ghost: [
    'bg-transparent text-surface-400 border border-transparent',
    'hover:bg-surface-800/60 hover:text-white hover:border-surface-700/50',
    'focus:ring-surface-600 focus:ring-offset-surface-950',
  ].join(' '),
  danger: [
    'bg-red-600 text-white shadow-lg shadow-red-500/25',
    'hover:bg-red-500 hover:shadow-red-500/40 hover:-translate-y-0.5',
    'focus:ring-red-500 focus:ring-offset-surface-950',
    'disabled:shadow-none',
  ].join(' '),
};

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-lg',
  md: 'h-10 px-4 text-sm gap-2 rounded-xl',
  lg: 'h-12 px-5 text-base gap-2.5 rounded-xl',
};

const spinnerSize: Record<NonNullable<ButtonProps['size']>, 'xs' | 'sm' | 'md'> = {
  sm: 'xs',
  md: 'sm',
  lg: 'md',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className = '',
      children,
      style,
      ...rest
    },
    ref
  ) => {
    const isPrimary = variant === 'primary';

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        style={isPrimary ? { background: 'var(--gradient-brand-glow)', ...style } : style}
        className={[
          'relative inline-flex items-center justify-center font-semibold',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth ? 'w-full' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...rest}
      >
        {loading ? (
          <>
            <Spinner size={spinnerSize[size]} className="text-current" />
            {children}
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
