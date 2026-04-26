/**
 * Dropdown — Molecule (Searchable Combobox)
 * Lista desplegable con búsqueda. Para casos donde hay muchas opciones
 * y el usuario necesita filtrar: asignar miembro, seleccionar proyecto,
 * elegir etiqueta, etc.
 *
 * DIFERENCIA CON Select:
 *   - Select  → nativo, pocos ítems, formulario simple (prioridad, estado)
 *   - Dropdown → buscable, muchos ítems, UI rica con íconos/avatares
 *
 * Uso:
 *   <Dropdown
 *     label="Asignar a"
 *     placeholder="Buscar miembro..."
 *     options={members}
 *     value={selected}
 *     onChange={setSelected}
 *   />
 *
 * Multi-select:
 *   <Dropdown multiple options={tags} value={selected} onChange={setSelected} />
 */

import {
  useState,
  useRef,
  useEffect,
  useId,
  type ReactNode,
} from 'react';

// ── Tipos ──────────────────────────────────────────────────────────────────

export interface DropdownOption {
  value: string;
  label: string;
  /** Ícono o avatar a la izquierda del label */
  prefix?: ReactNode;
  /** Texto secundario (email, rol, descripción) */
  description?: string;
  disabled?: boolean;
}

export interface DropdownProps {
  options: DropdownOption[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  /** Modo multi-selección */
  multiple?: boolean;
  label?: string;
  placeholder?: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  /** Texto vacío cuando no hay resultados */
  emptyText?: string;
  wrapperClassName?: string;
  id?: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────

const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const XIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// ── Componente ─────────────────────────────────────────────────────────────

export const Dropdown = ({
  options,
  value,
  onChange,
  multiple = false,
  label,
  placeholder = 'Buscar...',
  hint,
  error,
  disabled = false,
  emptyText = 'Sin resultados',
  wrapperClassName = '',
  id,
}: DropdownProps) => {
  const uid = useId();
  const inputId = id ?? uid;
  const hasError = Boolean(error);

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Normaliza el valor a array para uniformidad interna
  const selectedValues = value
    ? Array.isArray(value)
      ? value
      : [value]
    : [];

  const selectedOptions = options.filter((o) => selectedValues.includes(o.value));

  // Filtrado por búsqueda
  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase()) ||
    o.description?.toLowerCase().includes(search.toLowerCase())
  );

  // Cierra al hacer click fuera
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Focus en búsqueda al abrir
  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
  }, [open]);

  // Cierra con Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); setSearch(''); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  const select = (optValue: string) => {
    if (multiple) {
      const next = selectedValues.includes(optValue)
        ? selectedValues.filter((v) => v !== optValue)
        : [...selectedValues, optValue];
      onChange?.(next);
    } else {
      onChange?.(optValue);
      setOpen(false);
      setSearch('');
    }
  };

  const removeTag = (optValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = selectedValues.filter((v) => v !== optValue);
    onChange?.(next);
  };

  // ── Render del trigger ─────────────────────────────────────────────────

  const triggerContent =
    multiple ? (
      // Tags de las selecciones
      <div className="flex flex-wrap gap-1 flex-1 min-w-0">
        {selectedOptions.length === 0 && (
          <span className="text-surface-500 text-sm">{placeholder}</span>
        )}
        {selectedOptions.map((opt) => (
          <span
            key={opt.value}
            className="inline-flex items-center gap-1 rounded-lg bg-brand-500/15 border border-brand-500/30 px-2 py-0.5 text-xs text-brand-300 font-medium"
          >
            {opt.label}
            <button
              type="button"
              onClick={(e) => removeTag(opt.value, e)}
              className="hover:text-white transition-colors"
              aria-label={`Quitar ${opt.label}`}
            >
              <XIcon />
            </button>
          </span>
        ))}
      </div>
    ) : (
      // Single: muestra el seleccionado o placeholder
      <span
        className={`flex-1 text-sm truncate ${
          selectedOptions[0] ? 'text-white' : 'text-surface-500'
        }`}
      >
        {selectedOptions[0]?.label ?? placeholder}
      </span>
    );

  return (
    <div ref={containerRef} className={`space-y-1.5 ${wrapperClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-surface-300"
        >
          {label}
        </label>
      )}

      {/* Trigger */}
      <button
        id={inputId}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-invalid={hasError}
        onClick={() => !disabled && setOpen((v) => !v)}
        className={[
          'w-full flex items-center gap-2 rounded-xl border px-4 py-3',
          'bg-surface-900 transition-all duration-200',
          'focus:outline-none focus:ring-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          hasError
            ? 'border-red-500/60 focus:ring-red-500/30'
            : open
            ? 'border-brand-500 ring-2 ring-brand-500/50'
            : 'border-surface-600/40 hover:border-accent-500/40',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {triggerContent}
        <span className="shrink-0 text-surface-500">
          <ChevronIcon open={open} />
        </span>
      </button>

      {/* Panel desplegable */}
      {open && (
        <div
          role="listbox"
          aria-multiselectable={multiple}
          aria-label={label ?? 'Opciones'}
          className="absolute z-40 mt-1 w-full rounded-xl border border-surface-700/60 bg-surface-900 shadow-xl shadow-black/30 overflow-hidden"
          style={{ maxHeight: '260px' }}
        >
          {/* Búsqueda */}
          <div className="p-2 border-b border-surface-800">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-surface-500">
                <SearchIcon />
              </div>
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar..."
                className="w-full rounded-lg border border-surface-700/50 bg-surface-800 pl-9 pr-3 py-2 text-sm text-white placeholder-surface-500 focus:outline-none focus:ring-1 focus:ring-brand-500/50 focus:border-brand-500/60"
              />
            </div>
          </div>

          {/* Lista */}
          <div className="overflow-y-auto" style={{ maxHeight: '200px' }}>
            {filtered.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-surface-500">
                {emptyText}
              </div>
            ) : (
              filtered.map((opt) => {
                const isSelected = selectedValues.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    disabled={opt.disabled}
                    onClick={() => !opt.disabled && select(opt.value)}
                    className={[
                      'w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors duration-100',
                      isSelected
                        ? 'bg-brand-500/10 text-white'
                        : 'text-surface-300 hover:bg-surface-800 hover:text-white',
                      opt.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {/* Prefix (avatar, ícono) */}
                    {opt.prefix && (
                      <span className="shrink-0" aria-hidden="true">
                        {opt.prefix}
                      </span>
                    )}

                    {/* Texto */}
                    <div className="flex-1 min-w-0 text-left">
                      <p className="truncate font-medium">{opt.label}</p>
                      {opt.description && (
                        <p className="truncate text-xs text-surface-500">{opt.description}</p>
                      )}
                    </div>

                    {/* Check */}
                    {isSelected && (
                      <span className="shrink-0 text-brand-400" aria-hidden="true">
                        <CheckIcon />
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Error */}
      {hasError && (
        <p role="alert" className="text-xs text-red-400 flex items-center gap-1">
          <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}

      {hint && !hasError && (
        <p className="text-xs text-surface-500">{hint}</p>
      )}
    </div>
  );
};
