/**
 * Modal — Molecule
 * Overlay dialog para crear/editar tareas, proyectos y acciones del Kanban.
 *
 * Uso básico:
 *   <Modal open={open} onClose={() => setOpen(false)} title="Nueva tarea">
 *     <p>contenido...</p>
 *   </Modal>
 *
 * Tamaños: sm | md | lg | xl | full
 * El cierre se puede disparar con: botón X, click en backdrop, tecla Escape
 */

import {
  useEffect,
  useRef,
  type ReactNode,
  type HTMLAttributes,
} from 'react';
import { createPortal } from 'react-dom';

// ── Tipos ──────────────────────────────────────────────────────────────────

export interface ModalProps {
  /** Controla visibilidad del modal */
  open: boolean;
  /** Callback al cerrar (X, backdrop, Escape) */
  onClose: () => void;
  /** Título en el header */
  title?: ReactNode;
  /** Descripción / subtítulo opcional */
  description?: string;
  /** Ancho del panel */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Cierra al hacer click en el backdrop */
  closeOnBackdrop?: boolean;
  /** Cierra con la tecla Escape */
  closeOnEscape?: boolean;
  children: ReactNode;
  /** Slot para botones de acción en el footer */
  footer?: ReactNode;
  className?: string;
}

const sizeClasses: Record<NonNullable<ModalProps['size']>, string> = {
  sm:   'max-w-sm',
  md:   'max-w-md',
  lg:   'max-w-lg',
  xl:   'max-w-2xl',
  full: 'max-w-[95vw] w-full',
};

// ── Subcomponentes exportados ──────────────────────────────────────────────

export const ModalHeader = ({
  className = '',
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`flex items-start justify-between border-b border-surface-700/50 px-6 py-4 ${className}`}
    {...rest}
  >
    {children}
  </div>
);

export const ModalBody = ({
  className = '',
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={`px-6 py-5 overflow-y-auto flex-1 ${className}`} {...rest}>
    {children}
  </div>
);

export const ModalFooter = ({
  className = '',
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`flex items-center justify-end gap-3 border-t border-surface-700/50 px-6 py-4 ${className}`}
    {...rest}
  >
    {children}
  </div>
);

// ── Componente principal ───────────────────────────────────────────────────

export const Modal = ({
  open,
  onClose,
  title,
  description,
  size = 'md',
  closeOnBackdrop = true,
  closeOnEscape = true,
  children,
  footer,
  className = '',
}: ModalProps) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Bloquea scroll del body cuando está abierto
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Cierre con Escape
  useEffect(() => {
    if (!closeOnEscape) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose, closeOnEscape]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-hidden="true"
        onClick={closeOnBackdrop ? onClose : undefined}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className={[
          'relative z-10 flex flex-col w-full rounded-2xl border border-surface-700/50',
          'bg-surface-900 shadow-2xl shadow-black/50',
          'max-h-[90vh]',
          sizeClasses[size],
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <ModalHeader>
            <div className="flex-1 min-w-0">
              <h2
                id="modal-title"
                className="text-base font-semibold text-white leading-tight"
              >
                {title}
              </h2>
              {description && (
                <p className="mt-0.5 text-xs text-surface-400 leading-relaxed">
                  {description}
                </p>
              )}
            </div>

            {/* Botón cerrar */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar modal"
              className="ml-4 shrink-0 rounded-lg p-1.5 text-surface-500 hover:bg-surface-800 hover:text-white transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </ModalHeader>
        )}

        {/* Body */}
        <ModalBody>{children}</ModalBody>

        {/* Footer */}
        {footer && <ModalFooter>{footer}</ModalFooter>}
      </div>
    </div>,
    document.body
  );
};
