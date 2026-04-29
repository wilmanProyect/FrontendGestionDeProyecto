/**
 * EmptyState — Molecule
 * Estado vacío para columnas Kanban, listas de proyectos, búsquedas sin resultados, etc.
 *
 * Uso:
 *   <EmptyState
 *     icon={<KanbanIcon />}
 *     title="No hay tareas"
 *     description="Esta columna está vacía. Arrastra una tarea o crea una nueva."
 *     action={<Button size="sm">+ Nueva tarea</Button>}
 *   />
 *
 * Variantes: default | compact | illustration
 */

import type { ReactNode } from 'react';

// ── Tipos ──────────────────────────────────────────────────────────────────

export interface EmptyStateProps {
  /** Ícono grande o ilustración SVG */
  icon?: ReactNode;
  title: string;
  description?: string;
  /** Botón o link de acción principal */
  action?: ReactNode;
  /** Acción secundaria (link, texto) */
  secondaryAction?: ReactNode;
  variant?: 'default' | 'compact' | 'card';
  className?: string;
}

// ── Íconos predefinidos para los casos más comunes del módulo ──────────────

export const EmptyIcons = {
  Kanban: () => (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2}
        d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
    </svg>
  ),
  Tasks: () => (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  Projects: () => (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2}
        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  ),
  Search: () => (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Members: () => (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Notifications: () => (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2}
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
};

// ── Componente ─────────────────────────────────────────────────────────────

export const EmptyState = ({
  icon,
  title,
  description,
  action,
  secondaryAction,
  variant = 'default',
  className = '',
}: EmptyStateProps) => {
  if (variant === 'compact') {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 py-6 text-center ${className}`}
      >
        {icon && (
          <span className="text-surface-600" aria-hidden="true">
            {icon}
          </span>
        )}
        <p className="text-sm font-medium text-surface-400">{title}</p>
        {description && <p className="text-xs text-surface-500">{description}</p>}
        {action && <div className="mt-2">{action}</div>}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div
        className={[
          'flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed',
          'border-surface-700/50 bg-surface-900/30 p-10 text-center',
          className,
        ].join(' ')}
      >
        {icon && (
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl border border-surface-700/50 bg-surface-800/60 text-surface-500"
            aria-hidden="true"
          >
            {icon}
          </div>
        )}
        <div className="space-y-1.5 max-w-xs">
          <p className="text-sm font-semibold text-white">{title}</p>
          {description && (
            <p className="text-xs text-surface-400 leading-relaxed">{description}</p>
          )}
        </div>
        {(action || secondaryAction) && (
          <div className="flex flex-col items-center gap-2 mt-1">
            {action}
            {secondaryAction && (
              <div className="text-xs text-surface-500">{secondaryAction}</div>
            )}
          </div>
        )}
      </div>
    );
  }

  // default
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 text-center ${className}`}
    >
      {icon && (
        <div
          className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-surface-800/60 border border-surface-700/50 text-surface-500"
          aria-hidden="true"
        >
          {icon}
        </div>
      )}

      <p className="text-base font-semibold text-white mb-1">{title}</p>

      {description && (
        <p className="max-w-sm text-sm text-surface-400 leading-relaxed mb-6">
          {description}
        </p>
      )}

      {(action || secondaryAction) && (
        <div className="flex flex-col items-center gap-3">
          {action}
          {secondaryAction && (
            <div className="text-xs text-surface-500">{secondaryAction}</div>
          )}
        </div>
      )}
    </div>
  );
};
