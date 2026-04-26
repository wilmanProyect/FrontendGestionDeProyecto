/**
 * Select — Atom
 * Dropdown nativo estilizado — consistente con Input.tsx
 * Para opciones simples: prioridad, estado, tipo de tarea, sprint…
 *
 * Uso:
 *   <Select label="Prioridad" options={[{ value: 'high', label: 'Alta' }]} />
 *
 * Para múltiple o búsqueda usa SelectCombobox (componente separado si se requiere)
 */

import {
  forwardRef,
  useId,
  type SelectHTMLAttributes,
} from 'react';

// ── Tipos ──────────────────────────────────────────────────────────────────

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectGroup {
  label: string;
  options: SelectOption[];
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  placeholder?: string;
  options: (SelectOption | SelectGroup)[];
  wrapperClassName?: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function isGroup(item: SelectOption | SelectGroup): item is SelectGroup {
  return 'options' in item;
}

// ── Componente ─────────────────────────────────────────────────────────────

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      hint,
      error,
      placeholder,
      options,
      id,
      className = '',
      wrapperClassName = '',
      disabled,
      ...rest
    },
    ref
  ) => {
    const uid = useId();
    const selectId = id ?? uid;
    const hasError = Boolean(error);

    const baseSelect = [
      'block w-full appearance-none rounded-xl border bg-surface-900 text-sm text-white',
      'pl-4 pr-10 py-3',
      'transition-all duration-200',
      'focus:outline-none focus:ring-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'cursor-pointer',
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
            htmlFor={selectId}
            className="block text-sm font-medium text-surface-300"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={
              hasError
                ? `${selectId}-error`
                : hint
                ? `${selectId}-hint`
                : undefined
            }
            className={baseSelect}
            {...rest}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}

            {options.map((item, idx) =>
              isGroup(item) ? (
                <optgroup key={idx} label={item.label}>
                  {item.options.map((opt) => (
                    <option
                      key={opt.value}
                      value={opt.value}
                      disabled={opt.disabled}
                    >
                      {opt.label}
                    </option>
                  ))}
                </optgroup>
              ) : (
                <option
                  key={item.value}
                  value={item.value}
                  disabled={item.disabled}
                >
                  {item.label}
                </option>
              )
            )}
          </select>

          {/* Flecha personalizada */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
            <svg
              className={`w-4 h-4 ${hasError ? 'text-red-400' : 'text-surface-500'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {/* Error */}
        {hasError && (
          <p
            id={`${selectId}-error`}
            role="alert"
            className="text-xs text-red-400 flex items-center gap-1"
          >
            <svg
              className="w-3 h-3 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}

        {/* Hint */}
        {hint && !hasError && (
          <p id={`${selectId}-hint`} className="text-xs text-surface-500">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
