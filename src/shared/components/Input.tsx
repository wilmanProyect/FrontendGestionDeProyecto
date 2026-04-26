/**
 * Input — Atom
 * Soporta: icono izquierdo, icono derecho/acción, error state, label, hint, readonly
 */

import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  useId,
} from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightElement?: ReactNode;
  /** Wrapper className */
  wrapperClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      hint,
      error,
      leftIcon,
      rightElement,
      id,
      className = '',
      wrapperClassName = '',
      disabled,
      ...rest
    },
    ref
  ) => {
    const uid = useId();
    const inputId = id ?? uid;
    const hasError = Boolean(error);

    const baseInput = [
      'block w-full rounded-xl border bg-surface-900 text-sm text-white',
      'placeholder-surface-500 transition-all duration-200',
      'focus:outline-none focus:ring-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      leftIcon ? 'pl-10' : 'pl-4',
      rightElement ? 'pr-11' : 'pr-4',
      'py-3',
      hasError
        ? 'border-red-500/60 focus:ring-red-500/30'
        : 'border-surface-600/40 hover:border-accent-500/40 focus:ring-brand-500/50 focus:border-brand-500',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={`space-y-1.5 ${wrapperClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-surface-300"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <span className={`h-4 w-4 ${hasError ? 'text-red-400' : 'text-accent-500'}`}>
                {leftIcon}
              </span>
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            className={baseInput}
            {...rest}
          />

          {/* Right element (e.g. toggle password, clear, etc.) */}
          {rightElement && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3.5">
              {rightElement}
            </div>
          )}
        </div>

        {/* Error */}
        {hasError && (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="text-xs text-red-400 flex items-center gap-1"
          >
            <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}

        {/* Hint (only when no error) */}
        {hint && !hasError && (
          <p id={`${inputId}-hint`} className="text-xs text-surface-500">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

/* ── Textarea variant ───────────────────────────────────────────────── */

import type { TextareaHTMLAttributes } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  wrapperClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, id, className = '', wrapperClassName = '', ...rest }, ref) => {
    const uid = useId();
    const inputId = id ?? uid;
    const hasError = Boolean(error);

    return (
      <div className={`space-y-1.5 ${wrapperClassName}`}>
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-surface-300">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          className={[
            'block w-full rounded-xl border bg-surface-900 px-4 py-3 text-sm text-white',
            'placeholder-surface-500 resize-none transition-all duration-200',
            'focus:outline-none focus:ring-2',
            hasError
              ? 'border-red-500/60 focus:ring-red-500/30'
              : 'border-surface-600/40 hover:border-accent-500/40 focus:ring-brand-500/50 focus:border-brand-500',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...rest}
        />
        {hasError && (
          <p id={`${inputId}-error`} role="alert" className="text-xs text-red-400 flex items-center gap-1">
            <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        {hint && !hasError && (
          <p id={`${inputId}-hint`} className="text-xs text-surface-500">{hint}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
