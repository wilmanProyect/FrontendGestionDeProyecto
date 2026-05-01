import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import type { BoardList, BoardTask } from '../types/board.types';

interface TaskCardProps {
  task: BoardTask;
  lists: BoardList[];
  onClick?: (task: BoardTask) => void;
  onMoveMobile?: (taskId: string, listId: string) => void;
}

interface TaskCardViewProps extends TaskCardProps {
  isOverlay?: boolean;
  isPlaceholder?: boolean;
}

const priorityConfig = (name?: string | null) => {
  const value = name?.toLowerCase() ?? '';
  if (value.includes('criti') || value.includes('alta') || value.includes('high')) {
    return { label: name ?? 'Alta', dot: 'bg-red-500', text: 'text-red-400' };
  }
  if (value.includes('media') || value.includes('medium')) {
    return { label: name ?? 'Media', dot: 'bg-amber-500', text: 'text-amber-400' };
  }
  if (value.includes('baja') || value.includes('low')) {
    return { label: name ?? 'Baja', dot: 'bg-surface-500', text: 'text-surface-400' };
  }
  return { label: name ?? 'Sin prioridad', dot: 'bg-surface-600', text: 'text-surface-500' };
};

const getDueDateState = (date?: string | null) => {
  if (!date) return null;

  const due = new Date(date);
  const today = new Date();
  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diff = due.getTime() - today.getTime();
  const label = due.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });

  if (diff < 0) return { label, className: 'text-red-400' };
  if (diff === 0) return { label: 'Hoy', className: 'text-amber-400' };
  return { label, className: 'text-surface-500' };
};

const initials = (task: BoardTask) => {
  if (!task.assignee) return '?';
  const first = task.assignee.firstName?.[0] ?? '';
  const last = task.assignee.lastName?.[0] ?? '';
  return `${first}${last}`.toUpperCase() || '?';
};

export const TaskCardView = ({
  task,
  lists,
  onClick,
  onMoveMobile,
  isOverlay = false,
  isPlaceholder = false,
}: TaskCardViewProps) => {
  const dueDate = getDueDateState(task.dueDate);
  const priority = priorityConfig(task.priority?.name);
  const checklistDone = task.subtasks?.[0] ?? 0;
  const checklistTotal = task.subtasks?.[1] ?? 0;

  if (isPlaceholder) {
    return (
      <div className="min-h-[138px] rounded-xl border-2 border-dashed border-brand-500/45 bg-brand-500/5" />
    );
  }

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onClick?.(task)}
      onKeyDown={(event) => event.key === 'Enter' && onClick?.(task)}
      className={[
        'group rounded-xl border border-surface-700/40 bg-surface-800/80 p-3.5',
        'transition-all duration-200',
        isOverlay
          ? 'scale-[1.03] border-brand-500/50 shadow-xl shadow-black/40'
          : 'hover:border-surface-600/70 hover:shadow-lg hover:shadow-black/20',
      ].join(' ')}
      aria-label={`Tarea: ${task.title}`}
    >
      <div className="space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {task.labels?.length ? (
            task.labels.map((label) => (
              <span
                key={label.id}
                className="inline-flex max-w-full items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold text-white"
                style={{ backgroundColor: `${label.color}30`, borderColor: `${label.color}66` }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: label.color }} />
                <span className="truncate">{label.name}</span>
              </span>
            ))
          ) : (
            <span className="h-1.5 w-10 rounded-full bg-surface-700" aria-hidden="true" />
          )}
        </div>

        <h3 className="text-sm font-semibold leading-snug text-white line-clamp-2">
          {task.title}
        </h3>

        <div className="flex flex-wrap items-center gap-3 text-[11px] text-surface-500">
          <span className="inline-flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {task.commentCount ?? 0}
          </span>
          <span className="inline-flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            {task.attachmentCount ?? 0}
          </span>
          <span className="inline-flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
            {checklistDone}/{checklistTotal}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-surface-700/30 pt-3">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-surface-950 bg-cta-600 text-[10px] font-bold text-white">
              {task.assignee ? initials(task) : '?'}
            </div>
            <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${priority.text}`}>
              <span className={`h-2 w-2 rounded-full ${priority.dot}`} />
              <span className="truncate">{priority.label}</span>
            </span>
          </div>

          {dueDate && (
            <span className={`inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold ${dueDate.className}`}>
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {dueDate.label}
            </span>
          )}
        </div>

        <div className="md:hidden">
          <label className="block text-[10px] font-semibold uppercase tracking-wide text-surface-500">
            Mover a...
          </label>
          <select
            value={task.listId ?? ''}
            onClick={(event) => event.stopPropagation()}
            onChange={(event) => {
              event.stopPropagation();
              onMoveMobile?.(task.id, event.target.value);
            }}
            className="mt-1 block w-full rounded-lg border border-surface-700 bg-surface-900 px-3 py-2 text-xs text-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
          >
            {lists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </article>
  );
};

export const TaskCard = ({ task, lists, onClick, onMoveMobile }: TaskCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'task',
      task,
      listId: task.listId,
    },
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      {...attributes}
      {...listeners}
    >
      <TaskCardView
        task={task}
        lists={lists}
        onClick={onClick}
        onMoveMobile={onMoveMobile}
        isPlaceholder={isDragging}
      />
    </div>
  );
};
