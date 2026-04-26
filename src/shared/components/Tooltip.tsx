/**
 * Tooltip — Atom
 * Muestra texto informativo al hacer hover sobre un elemento.
 * Útil para iconos de acción, texto truncado, atajos de teclado, etc.
 *
 * Uso:
 *   <Tooltip content="Editar tarea">
 *     <button>...</button>
 *   </Tooltip>
 *
 * Posiciones: top | bottom | left | right
 * Implementado en CSS puro (sin librerías) para cero dependencias.
 */

import { useState, useRef, type ReactNode } from 'react';

// ── Tipos ──────────────────────────────────────────────────────────────────

export interface TooltipProps {
  /** Contenido del tooltip */
  content: ReactNode;
  /** Posición relativa al trigger */
  placement?: 'top' | 'bottom' | 'left' | 'right';
  /** Delay en ms antes de mostrar (default 300) */
  delayMs?: number;
  /** Elemento que dispara el tooltip */
  children: ReactNode;
  /** Deshabilita el tooltip */
  disabled?: boolean;
  className?: string;
}

// ── Estilos por posición ───────────────────────────────────────────────────

const placementClasses: Record<NonNullable<TooltipProps['placement']>, string> = {
  top:    'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left:   'right-full top-1/2 -translate-y-1/2 mr-2',
  right:  'left-full top-1/2 -translate-y-1/2 ml-2',
};

// Flechita indicadora
const arrowClasses: Record<NonNullable<TooltipProps['placement']>, string> = {
  top:    'top-full left-1/2 -translate-x-1/2 border-t-surface-700 border-x-transparent border-b-transparent',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-surface-700 border-x-transparent border-t-transparent',
  left:   'left-full top-1/2 -translate-y-1/2 border-l-surface-700 border-y-transparent border-r-transparent',
  right:  'right-full top-1/2 -translate-y-1/2 border-r-surface-700 border-y-transparent border-l-transparent',
};

// ── Componente ─────────────────────────────────────────────────────────────

export const Tooltip = ({
  content,
  placement = 'top',
  delayMs = 300,
  children,
  disabled = false,
  className = '',
}: TooltipProps) => {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    if (disabled) return;
    timerRef.current = setTimeout(() => setVisible(true), delayMs);
  };

  const hide = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
  };

  return (
    <div
      className={`relative inline-flex ${className}`}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}

      {visible && content && (
        <div
          role="tooltip"
          className={[
            'absolute z-50 pointer-events-none',
            placementClasses[placement],
          ].join(' ')}
        >
          {/* Flecha */}
          <span
            aria-hidden="true"
            className={[
              'absolute w-0 h-0 border-4',
              arrowClasses[placement],
            ].join(' ')}
          />

          {/* Cuerpo */}
          <div
            className="rounded-lg border border-surface-700 bg-surface-800 px-2.5 py-1.5 text-xs text-surface-100 shadow-lg shadow-black/30 whitespace-nowrap"
          >
            {content}
          </div>
        </div>
      )}
    </div>
  );
};
