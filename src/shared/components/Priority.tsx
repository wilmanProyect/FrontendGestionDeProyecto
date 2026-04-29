/**
 * Priority — Atom
 * Indicador de prioridad de tareas en el tablero Kanban.
 * Variants: critical | high | medium | low | none
 *
 * StatusDot — Atom
 * Punto de estado para tareas y proyectos.
 *
 * PrioritySelect — Molecule
 * Select de prioridad con íconos coloreados.
 *
 * Uso:
 *   <Priority level="high" />
 *   <Priority level="critical" showLabel />
 *   <StatusDot status="in_progress" />
 */

// ── Priority ───────────────────────────────────────────────────────────────

export type PriorityLevel = 'critical' | 'high' | 'medium' | 'low' | 'none';

export interface PriorityProps {
  level: PriorityLevel;
  showLabel?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

const priorityConfig: Record<
  PriorityLevel,
  { label: string; color: string; icon: string; dot: string }
> = {
  critical: {
    label: 'Crítica',
    color: 'text-red-400',
    dot:   'bg-red-400',
    icon:  '↑↑',
  },
  high: {
    label: 'Alta',
    color: 'text-amber-400',
    dot:   'bg-amber-400',
    icon:  '↑',
  },
  medium: {
    label: 'Media',
    color: 'text-brand-400',
    dot:   'bg-brand-400',
    icon:  '→',
  },
  low: {
    label: 'Baja',
    color: 'text-surface-400',
    dot:   'bg-surface-500',
    icon:  '↓',
  },
  none: {
    label: 'Sin prioridad',
    color: 'text-surface-500',
    dot:   'bg-surface-600',
    icon:  '—',
  },
};

export const Priority = ({
  level,
  showLabel = false,
  size = 'sm',
  className = '',
}: PriorityProps) => {
  const cfg = priorityConfig[level];
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${textSize} font-medium ${cfg.color} ${className}`}
      title={cfg.label}
    >
      <span aria-hidden="true" className="font-bold text-[10px]">{cfg.icon}</span>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} aria-hidden="true" />
      {showLabel && <span>{cfg.label}</span>}
      {!showLabel && <span className="sr-only">{cfg.label}</span>}
    </span>
  );
};

// ── TaskStatus — estado de las tareas en el Kanban ─────────────────────────

export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done' | 'blocked';

export interface TaskStatusBadgeProps {
  status: TaskStatus;
  showLabel?: boolean;
  className?: string;
}

const statusConfig: Record<
  TaskStatus,
  { label: string; color: string; dot: string; ring: string }
> = {
  backlog:     { label: 'Backlog',      color: 'text-surface-400',  dot: 'bg-surface-500',  ring: 'ring-surface-500/20'  },
  todo:        { label: 'Por hacer',    color: 'text-accent-400',   dot: 'bg-accent-400',   ring: 'ring-accent-400/20'   },
  in_progress: { label: 'En progreso',  color: 'text-brand-400',    dot: 'bg-brand-400',    ring: 'ring-brand-400/20'    },
  review:      { label: 'En revisión',  color: 'text-violet-400',   dot: 'bg-violet-400',   ring: 'ring-violet-400/20'   },
  done:        { label: 'Completada',   color: 'text-cta-400',      dot: 'bg-cta-400',      ring: 'ring-cta-400/20'      },
  blocked:     { label: 'Bloqueada',    color: 'text-red-400',      dot: 'bg-red-400',      ring: 'ring-red-400/20'      },
};

export const TaskStatusBadge = ({
  status,
  showLabel = true,
  className = '',
}: TaskStatusBadgeProps) => {
  const cfg = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium ${cfg.color} ${className}`}
    >
      <span
        className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot} ${
          status === 'in_progress' ? 'animate-pulse' : ''
        }`}
        aria-hidden="true"
      />
      {showLabel ? cfg.label : <span className="sr-only">{cfg.label}</span>}
    </span>
  );
};

// ── StatusDot — indicador mínimo para listas compactas ────────────────────

export interface StatusDotProps {
  status: TaskStatus;
  className?: string;
}

export const StatusDot = ({ status, className = '' }: StatusDotProps) => {
  const cfg = statusConfig[status];
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full ${cfg.dot} ${className}`}
      title={cfg.label}
      aria-label={cfg.label}
    />
  );
};

// ── DueDate — fecha de vencimiento con color semántico ────────────────────

export interface DueDateProps {
  date: Date | string;
  className?: string;
}

export const DueDate = ({ date, className = '' }: DueDateProps) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  const isOverdue = diffDays < 0;
  const isDueToday = diffDays === 0;
  const isDueSoon = diffDays > 0 && diffDays <= 3;

  const colorClass = isOverdue
    ? 'text-red-400'
    : isDueToday
    ? 'text-amber-400'
    : isDueSoon
    ? 'text-amber-300'
    : 'text-surface-400';

  const label = isOverdue
    ? `Vencida hace ${Math.abs(diffDays)}d`
    : isDueToday
    ? 'Hoy'
    : diffDays === 1
    ? 'Mañana'
    : d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium ${colorClass} ${className}`}
      title={d.toLocaleDateString('es-ES', { dateStyle: 'long' })}
    >
      <svg
        className="w-3 h-3 shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      {label}
    </span>
  );
};
