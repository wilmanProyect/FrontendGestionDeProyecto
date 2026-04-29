/**
 * Toast — Molecule
 * Notificaciones temporales tipo "toast" para feedback inmediato.
 * Tipos: success | error | info | warning
 *
 * USO:
 *   // 1. Envuelve tu app con <ToastProvider>
 *   // 2. En cualquier componente:
 *   const { toast } = useToast();
 *   toast.success('Tarea creada');
 *   toast.error('Error al guardar', { duration: 5000 });
 *   toast.info('Arrastra para reordenar');
 *
 * El sistema es un contexto + portal que no necesita librería externa.
 */

import {
  createContext,
  useCallback,
  useContext,
  useId,
  useRef,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';

// ── Tipos ──────────────────────────────────────────────────────────────────

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastOptions {
  /** Duración en ms antes de auto-cerrar. 0 = no cierra solo. Default 4000 */
  duration?: number;
  /** Descripción adicional bajo el título */
  description?: string;
}

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
  duration: number;
  visible: boolean;
}

interface ToastAPI {
  success: (message: string, opts?: ToastOptions) => void;
  error:   (message: string, opts?: ToastOptions) => void;
  info:    (message: string, opts?: ToastOptions) => void;
  warning: (message: string, opts?: ToastOptions) => void;
  dismiss: (id: string) => void;
}

// ── Configuración visual ───────────────────────────────────────────────────

const toastConfig: Record<
  ToastType,
  { container: string; icon: string; iconEl: ReactNode }
> = {
  success: {
    container: 'border-cta-500/30 bg-surface-900',
    icon:      'text-cta-400',
    iconEl: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  error: {
    container: 'border-red-500/30 bg-surface-900',
    icon:      'text-red-400',
    iconEl: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  },
  info: {
    container: 'border-brand-500/30 bg-surface-900',
    icon:      'text-brand-400',
    iconEl: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  warning: {
    container: 'border-amber-500/30 bg-surface-900',
    icon:      'text-amber-400',
    iconEl: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
};

// ── Contexto ───────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastAPI | null>(null);

// ── Toast individual ───────────────────────────────────────────────────────

const ToastItem = ({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}) => {
  const cfg = toastConfig[toast.type];

  // Auto-dismiss
  useEffect(() => {
    if (toast.duration === 0) return;
    const t = setTimeout(() => onDismiss(toast.id), toast.duration);
    return () => clearTimeout(t);
  }, [toast.id, toast.duration, onDismiss]);

  return (
    <div
      role={toast.type === 'error' ? 'alert' : 'status'}
      aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
      className={[
        'flex items-start gap-3 w-80 rounded-2xl border px-4 py-3.5',
        'shadow-xl shadow-black/40 backdrop-blur-sm',
        'transition-all duration-300',
        toast.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
        cfg.container,
      ].join(' ')}
    >
      {/* Ícono */}
      <span className={`shrink-0 mt-0.5 ${cfg.icon}`} aria-hidden="true">
        {cfg.iconEl}
      </span>

      {/* Contenido */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white leading-snug">{toast.message}</p>
        {toast.description && (
          <p className="text-xs text-surface-400 mt-0.5 leading-relaxed">{toast.description}</p>
        )}
      </div>

      {/* Cerrar */}
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Cerrar notificación"
        className="shrink-0 -mt-0.5 -mr-1 p-1 rounded-lg text-surface-500 hover:text-white hover:bg-surface-800 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

// ── Provider ───────────────────────────────────────────────────────────────

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  // Necesitamos un id único por toast, sin useId (que es por render)
  const counterRef = useRef(0);

  const dismiss = useCallback((id: string) => {
    // Marca como invisible primero (para animación de salida)
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, visible: false } : t))
    );
    // Luego lo elimina del DOM
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  }, []);

  const add = useCallback(
    (type: ToastType, message: string, opts: ToastOptions = {}) => {
      const id = `toast-${++counterRef.current}`;
      const duration = opts.duration ?? 4000;

      setToasts((prev) => [
        ...prev,
        { id, type, message, description: opts.description, duration, visible: false },
      ]);

      // Trigger animación de entrada en el siguiente tick
      setTimeout(() => {
        setToasts((prev) =>
          prev.map((t) => (t.id === id ? { ...t, visible: true } : t))
        );
      }, 10);
    },
    []
  );

  const api: ToastAPI = {
    success: (msg, opts) => add('success', msg, opts),
    error:   (msg, opts) => add('error',   msg, opts),
    info:    (msg, opts) => add('info',    msg, opts),
    warning: (msg, opts) => add('warning', msg, opts),
    dismiss,
  };

  return (
    <ToastContext.Provider value={api}>
      {children}

      {/* Portal — esquina inferior derecha */}
      {createPortal(
        <div
          aria-label="Notificaciones"
          className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 items-end"
        >
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};

// ── Hook ───────────────────────────────────────────────────────────────────

export const useToast = (): { toast: ToastAPI } => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast debe usarse dentro de <ToastProvider>');
  return { toast: ctx };
};
