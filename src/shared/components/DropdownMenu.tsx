/**
 * DropdownMenu — Molecule
 * Menú contextual para acciones de tarjetas Kanban, proyectos y filas de tabla.
 * Se posiciona automáticamente relativo a su trigger.
 *
 * Uso:
 *   <DropdownMenu
 *     trigger={<Button variant="ghost" size="sm">⋮</Button>}
 *     items={[
 *       { label: 'Editar tarea',   icon: <EditIcon />,   onClick: handleEdit },
 *       { label: 'Mover columna', icon: <MoveIcon /> },
 *       { type: 'divider' },
 *       { label: 'Eliminar',      icon: <TrashIcon />,  danger: true, onClick: handleDelete },
 *     ]}
 *   />
 *
 * Cierra con: click fuera, Escape, o al seleccionar un item (configurable)
 */

import {
  useState,
  useRef,
  useEffect,
  type ReactNode,
} from 'react';

// ── Tipos ──────────────────────────────────────────────────────────────────

export type DropdownItem =
  | {
      type?: 'item';
      label: string;
      icon?: ReactNode;
      onClick?: () => void;
      disabled?: boolean;
      /** Estilo de acción destructiva (texto en rojo) */
      danger?: boolean;
    }
  | { type: 'divider' }
  | { type: 'label'; text: string };

export interface DropdownMenuProps {
  /** Elemento que abre el menú al hacer click */
  trigger: ReactNode;
  items: DropdownItem[];
  /** Alineación horizontal del menú */
  align?: 'left' | 'right';
  /** Alineación vertical */
  side?: 'bottom' | 'top';
  /** Cierra el menú al seleccionar un ítem */
  closeOnSelect?: boolean;
  /** Ancho mínimo del menú */
  minWidth?: string;
  className?: string;
}

// ── Componente ─────────────────────────────────────────────────────────────

export const DropdownMenu = ({
  trigger,
  items,
  align = 'right',
  side = 'bottom',
  closeOnSelect = true,
  minWidth = '12rem',
  className = '',
}: DropdownMenuProps) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Cierra al hacer click fuera
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Cierra con Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  const alignClass = align === 'right' ? 'right-0' : 'left-0';
  const sideClass  = side === 'top' ? 'bottom-full mb-2' : 'top-full mt-2';

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* Trigger */}
      <div onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        {trigger}
      </div>

      {/* Panel */}
      {open && (
        <div
          role="menu"
          aria-orientation="vertical"
          className={[
            'absolute z-40 overflow-hidden rounded-xl border border-surface-700/60',
            'bg-surface-900 shadow-xl shadow-black/30 backdrop-blur-sm',
            'py-1',
            alignClass,
            sideClass,
          ].join(' ')}
          style={{ minWidth }}
        >
          {items.map((item, idx) => {
            // Divider
            if (item.type === 'divider') {
              return (
                <div
                  key={idx}
                  className="my-1 border-t border-surface-800"
                  role="separator"
                  aria-hidden="true"
                />
              );
            }

            // Label de sección
            if (item.type === 'label') {
              return (
                <div
                  key={idx}
                  className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-surface-500"
                  role="presentation"
                >
                  {item.text}
                </div>
              );
            }

            // Ítem normal
            return (
              <button
                key={idx}
                role="menuitem"
                type="button"
                disabled={item.disabled}
                onClick={() => {
                  if (item.disabled) return;
                  item.onClick?.();
                  if (closeOnSelect) setOpen(false);
                }}
                className={[
                  'w-full flex items-center gap-2.5 px-3 py-2 text-sm',
                  'transition-colors duration-150 focus:outline-none',
                  item.danger
                    ? 'text-red-400 hover:bg-red-500/10 focus:bg-red-500/10'
                    : 'text-surface-300 hover:bg-surface-800 hover:text-white focus:bg-surface-800',
                  item.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {item.icon && (
                  <span className="shrink-0 w-4 h-4 flex items-center justify-center" aria-hidden="true">
                    {item.icon}
                  </span>
                )}
                <span className="flex-1 text-left">{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
