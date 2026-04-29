/**
 * KanbanColumn + KanbanCard — Molecules (núcleo del tablero)
 * Los bloques fundamentales del módulo de Gestión de Proyectos.
 *
 * KanbanColumn — columna del tablero (Backlog / En Progreso / Revisión / Listo)
 * KanbanCard   — tarjeta de tarea dentro de una columna
 *
 * Uso básico:
 *   <KanbanColumn
 *     title="En progreso"
 *     count={3}
 *     color="#0052FF"
 *     onAddCard={() => setModalOpen(true)}
 *   >
 *     <KanbanCard
 *       title="Implementar login"
 *       priority="high"
 *       dueDate={new Date('2025-05-10')}
 *       assignees={[{ name: 'Ana López' }]}
 *       tags={[{ label: 'Feature', color: 'brand' }]}
 *       onClick={() => openDetail(card)}
 *       onMenuAction={(action) => handleAction(action, card)}
 *     />
 *   </KanbanColumn>
 *
 * NOTA: El drag-and-drop se agrega encima usando @dnd-kit/core.
 * Estos componentes son solo la UI — no asumen ninguna librería de DnD.
 */

import { type ReactNode } from 'react';

// ── Tipos compartidos ──────────────────────────────────────────────────────

export type KanbanPriority = 'critical' | 'high' | 'medium' | 'low' | 'none';
export type KanbanStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done' | 'blocked';

export interface KanbanTag {
  label: string;
  color?: 'brand' | 'accent' | 'cta' | 'violet' | 'red' | 'amber' | 'surface';
}

export interface KanbanAssignee {
  name?: string;
  src?: string;
  color?: 'brand' | 'accent' | 'cta' | 'violet' | 'surface';
}

// ── Paleta de colores de tags ──────────────────────────────────────────────

const tagColors: Record<NonNullable<KanbanTag['color']>, string> = {
  brand:   'bg-brand-500/10 border-brand-500/30 text-brand-400',
  accent:  'bg-accent-500/10 border-accent-500/30 text-accent-400',
  cta:     'bg-cta-500/10 border-cta-500/30 text-cta-400',
  violet:  'bg-violet-500/10 border-violet-500/30 text-violet-400',
  red:     'bg-red-500/10 border-red-500/30 text-red-400',
  amber:   'bg-amber-500/10 border-amber-500/30 text-amber-400',
  surface: 'bg-surface-800 border-surface-700 text-surface-300',
};

// ── Configuración de prioridad ─────────────────────────────────────────────

const priorityConfig: Record<KanbanPriority, { label: string; color: string; icon: string }> = {
  critical: { label: 'Crítica',       color: 'text-red-400',     icon: '↑↑' },
  high:     { label: 'Alta',          color: 'text-amber-400',   icon: '↑'  },
  medium:   { label: 'Media',         color: 'text-brand-400',   icon: '→'  },
  low:      { label: 'Baja',          color: 'text-surface-400', icon: '↓'  },
  none:     { label: 'Sin prioridad', color: 'text-surface-600', icon: '—'  },
};

// ── Miniavatar inline (sin importar Avatar para evitar dependencia circular) ─

const MiniAvatar = ({ name, src, color = 'surface' }: KanbanAssignee) => {
  const gradients: Record<string, string> = {
    brand:  'var(--gradient-forge)',
    accent: 'linear-gradient(135deg, #00c2ff, #0052ff)',
    cta:    'linear-gradient(135deg, #00d1b2, #00c2ff)',
    violet: 'linear-gradient(135deg, #6366f1, #8d91f5)',
    surface: '',
  };

  const initials = name
    ? name.trim().split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <div
      className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white border-2 border-surface-950 overflow-hidden shrink-0"
      style={
        src
          ? { backgroundImage: `url(${src})`, backgroundSize: 'cover' }
          : color !== 'surface'
          ? { background: gradients[color] }
          : { backgroundColor: 'var(--color-surface-700)' }
      }
      title={name}
      aria-label={name ?? 'Miembro'}
    >
      {!src && initials}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// KanbanCard
// ═══════════════════════════════════════════════════════════════════════════

export interface KanbanCardProps {
  id?: string;
  title: string;
  description?: string;
  priority?: KanbanPriority;
  dueDate?: Date | string;
  assignees?: KanbanAssignee[];
  /** Máximo de avatares visibles antes del +N */
  maxAssignees?: number;
  tags?: KanbanTag[];
  /** Conteo de subtareas: [completadas, total] */
  subtasks?: [number, number];
  /** Conteo de comentarios */
  commentCount?: number;
  /** Conteo de archivos adjuntos */
  attachmentCount?: number;
  /** Callback al hacer click en la tarjeta (abre detalle) */
  onClick?: () => void;
  /** Acciones del menú contextual */
  onMenuAction?: (action: 'edit' | 'move' | 'duplicate' | 'delete') => void;
  /** Resalta la tarjeta (por ejemplo, al arrastrar encima) */
  highlighted?: boolean;
  className?: string;
}

export const KanbanCard = ({
  title,
  description,
  priority = 'none',
  dueDate,
  assignees = [],
  maxAssignees = 3,
  tags = [],
  subtasks,
  commentCount,
  attachmentCount,
  onClick,
  onMenuAction,
  highlighted = false,
  className = '',
}: KanbanCardProps) => {
  // Due date formatting
  let dueDateEl: ReactNode = null;
  if (dueDate) {
    const d = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
    const now = new Date();
    const diffDays = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const isOverdue = diffDays < 0;
    const isDueToday = diffDays === 0;
    const isDueSoon = diffDays > 0 && diffDays <= 3;

    const color = isOverdue ? 'text-red-400' : isDueToday || isDueSoon ? 'text-amber-400' : 'text-surface-500';
    const label = isOverdue
      ? `Venció hace ${Math.abs(diffDays)}d`
      : isDueToday
      ? 'Hoy'
      : diffDays === 1
      ? 'Mañana'
      : d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });

    dueDateEl = (
      <span className={`inline-flex items-center gap-1 text-[10px] font-medium ${color}`}>
        <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {label}
      </span>
    );
  }

  const pCfg = priorityConfig[priority];
  const visibleAssignees = assignees.slice(0, maxAssignees);
  const extraAssignees = assignees.length - maxAssignees;

  return (
    <article
      className={[
        'group relative rounded-xl border bg-surface-800/80 p-3.5',
        'transition-all duration-200 cursor-pointer',
        highlighted
          ? 'border-brand-500/60 shadow-md shadow-brand-500/10 bg-surface-800'
          : 'border-surface-700/40 hover:border-surface-600/60 hover:shadow-md hover:shadow-black/20 hover:-translate-y-0.5',
        className,
      ].join(' ')}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
      aria-label={`Tarea: ${title}`}
    >
      {/* ── Tags ──────────────────────────────────────────────────── */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${tagColors[tag.color ?? 'surface']}`}
            >
              {tag.label}
            </span>
          ))}
        </div>
      )}

      {/* ── Título ────────────────────────────────────────────────── */}
      <p className="text-sm font-medium text-white leading-snug mb-1.5 line-clamp-2">
        {title}
      </p>

      {/* ── Descripción ───────────────────────────────────────────── */}
      {description && (
        <p className="text-xs text-surface-400 leading-relaxed mb-2.5 line-clamp-2">
          {description}
        </p>
      )}

      {/* ── Subtareas progress bar ─────────────────────────────────── */}
      {subtasks && (
        <div className="mb-2.5">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-surface-500">
              {subtasks[0]}/{subtasks[1]} subtareas
            </span>
            <span className="text-[10px] text-surface-500">
              {Math.round((subtasks[0] / subtasks[1]) * 100)}%
            </span>
          </div>
          <div className="w-full h-1 bg-surface-700 rounded-full overflow-hidden">
            <div
              className="h-1 rounded-full bg-brand-500 transition-all duration-500"
              style={{ width: `${(subtasks[0] / subtasks[1]) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* ── Footer: prioridad + fecha + asignados + meta ──────────── */}
      <div className="flex items-center justify-between gap-2 mt-2.5 pt-2.5 border-t border-surface-700/30">
        {/* Izquierda: prioridad + fecha */}
        <div className="flex items-center gap-2 min-w-0 flex-wrap">
          {priority !== 'none' && (
            <span
              className={`text-[10px] font-bold ${pCfg.color}`}
              title={pCfg.label}
              aria-label={`Prioridad: ${pCfg.label}`}
            >
              {pCfg.icon}
            </span>
          )}
          {dueDateEl}
        </div>

        {/* Derecha: meta (comentarios, adjuntos) + avatares */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Comentarios */}
          {commentCount !== undefined && commentCount > 0 && (
            <span className="inline-flex items-center gap-0.5 text-[10px] text-surface-500">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {commentCount}
            </span>
          )}

          {/* Adjuntos */}
          {attachmentCount !== undefined && attachmentCount > 0 && (
            <span className="inline-flex items-center gap-0.5 text-[10px] text-surface-500">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              {attachmentCount}
            </span>
          )}

          {/* Avatares */}
          {assignees.length > 0 && (
            <div className="flex -space-x-1.5">
              {visibleAssignees.map((a, idx) => (
                <MiniAvatar key={idx} {...a} />
              ))}
              {extraAssignees > 0 && (
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-surface-300 border-2 border-surface-950 bg-surface-700"
                  aria-label={`y ${extraAssignees} más`}
                >
                  +{extraAssignees}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Menú contextual — tres puntos, visible en hover */}
      {onMenuAction && (
        <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                // El consumidor maneja el menú — aquí solo dispatcha
                // Puedes integrar con <DropdownMenu> si prefieres
              }}
              className="flex items-center justify-center w-6 h-6 rounded-lg text-surface-500 hover:text-white hover:bg-surface-700 transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-brand-500/50"
              aria-label="Acciones de tarea"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 7a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 7a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </article>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// KanbanColumn
// ═══════════════════════════════════════════════════════════════════════════

export interface KanbanColumnProps {
  title: string;
  /** Total de tarjetas en la columna */
  count?: number;
  /** Color del acento superior de la columna (usa las variables del design system) */
  color?: string;
  /** Límite WIP (Work In Progress) — muestra advertencia si se supera */
  wipLimit?: number;
  /** Slot para botón u acciones adicionales en el header */
  headerActions?: ReactNode;
  /** Callback del botón "+ Agregar tarea" */
  onAddCard?: () => void;
  /** Texto del botón de agregar */
  addLabel?: string;
  /** Estado de carga (muestra skeletons) */
  loading?: boolean;
  children?: ReactNode;
  className?: string;
  /** Para drag-and-drop: ref o props adicionales del contenedor */
  dropRef?: React.Ref<HTMLDivElement>;
  /** Resaltar la columna cuando se arrastra una tarjeta encima */
  isDragOver?: boolean;
}

const ColumnSkeleton = () => (
  <div className="animate-pulse space-y-2.5 px-2">
    {[80, 60, 90].map((w, i) => (
      <div key={i} className="rounded-xl border border-surface-700/30 bg-surface-800/60 p-3.5 space-y-2">
        <div className="h-3 bg-surface-700 rounded" style={{ width: `${w}%` }} />
        <div className="h-2.5 bg-surface-700 rounded w-full" />
        <div className="h-2.5 bg-surface-700 rounded" style={{ width: '60%' }} />
        <div className="flex justify-between pt-1">
          <div className="h-2 bg-surface-700 rounded w-16" />
          <div className="flex -space-x-1.5">
            {[0,1].map((j) => <div key={j} className="w-5 h-5 rounded-full bg-surface-700" />)}
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const KanbanColumn = ({
  title,
  count = 0,
  color = 'var(--color-brand-500)',
  wipLimit,
  headerActions,
  onAddCard,
  addLabel = 'Agregar tarea',
  loading = false,
  children,
  className = '',
  dropRef,
  isDragOver = false,
}: KanbanColumnProps) => {
  const isOverWip = wipLimit !== undefined && count > wipLimit;

  return (
    <section
      className={[
        'flex flex-col rounded-2xl border border-surface-700/30',
        'bg-surface-900/50 min-w-[280px] w-72 shrink-0',
        'transition-all duration-200',
        isDragOver
          ? 'border-brand-500/50 bg-surface-800/60 shadow-lg shadow-brand-500/5'
          : '',
        className,
      ].join(' ')}
      aria-label={`Columna: ${title}`}
    >
      {/* ── Línea de color superior ───────────────────────────────── */}
      <div
        className="h-1 rounded-t-2xl"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />

      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-700/30">
        <div className="flex items-center gap-2 min-w-0">
          <h2 className="text-sm font-semibold text-white truncate">{title}</h2>

          {/* Conteo */}
          <span
            className={[
              'inline-flex items-center justify-center min-w-[20px] h-5 rounded-full px-1.5 text-[10px] font-bold',
              isOverWip
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-surface-800 text-surface-400 border border-surface-700/50',
            ].join(' ')}
            title={wipLimit ? `${count}/${wipLimit} límite WIP` : `${count} tarjetas`}
          >
            {count}
          </span>

          {/* Indicador WIP */}
          {isOverWip && (
            <span
              className="text-[10px] text-red-400 font-medium"
              aria-label={`Límite WIP superado: ${count}/${wipLimit}`}
            >
              WIP
            </span>
          )}
        </div>

        {/* Acciones del header */}
        <div className="flex items-center gap-1">
          {headerActions}
          {onAddCard && (
            <button
              type="button"
              onClick={onAddCard}
              aria-label={`${addLabel} en ${title}`}
              className="flex items-center justify-center w-7 h-7 rounded-lg text-surface-500 hover:text-white hover:bg-surface-800 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* ── Área de tarjetas ──────────────────────────────────────── */}
      <div
        ref={dropRef}
        className={[
          'flex-1 overflow-y-auto px-2 py-2 space-y-2.5',
          'scrollbar-thin scrollbar-thumb-surface-700 scrollbar-track-transparent',
          isDragOver ? 'bg-brand-500/3' : '',
        ].join(' ')}
        style={{ minHeight: '120px', maxHeight: 'calc(100vh - 220px)' }}
      >
        {loading ? (
          <ColumnSkeleton />
        ) : count === 0 && !loading ? (
          /* Estado vacío */
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
            <div className="w-10 h-10 rounded-xl border border-dashed border-surface-700/60 flex items-center justify-center">
              <svg className="w-5 h-5 text-surface-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-xs text-surface-500">Sin tarjetas</p>
            {onAddCard && (
              <button
                type="button"
                onClick={onAddCard}
                className="text-xs text-brand-400 hover:text-brand-300 transition-colors duration-150"
              >
                + {addLabel}
              </button>
            )}
          </div>
        ) : (
          children
        )}
      </div>

      {/* ── Footer: botón agregar ──────────────────────────────────── */}
      {onAddCard && count > 0 && (
        <div className="px-2 pb-3 pt-1 border-t border-surface-700/20">
          <button
            type="button"
            onClick={onAddCard}
            className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-surface-500 hover:text-white hover:bg-surface-800/60 border border-transparent hover:border-surface-700/40 transition-all duration-150 group"
          >
            <svg className="w-3.5 h-3.5 group-hover:text-brand-400 transition-colors duration-150" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {addLabel}
          </button>
        </div>
      )}
    </section>
  );
};
