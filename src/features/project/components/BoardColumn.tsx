/**
 * BoardColumn.tsx
 * Columna del tablero conectada al backend.
 * Wrappea KanbanColumn agregando:
 *   - Título editable inline (doble click → edita → blur guarda → PATCH /lists/:id)
 *   - Footer con AddTaskInline (sin modal)
 *   - Menú contextual con "Eliminar lista"
 * Las tareas filtradas se reciben como prop.
 */

import { useState, useRef, useEffect } from 'react';
import { KanbanColumn, KanbanCard, type KanbanPriority } from '@/shared/components/Kanban';
import { AddTaskInline } from './AddTaskInline';
import type { BoardList, BoardTask } from '../types/board.types';

// Mapeo de prioridad backend → KanbanPriority del design system
const mapPriority = (name?: string | null): KanbanPriority => {
  if (!name) return 'none';
  const n = name.toLowerCase();
  if (n.includes('críti') || n.includes('criti')) return 'critical';
  if (n.includes('alta')  || n.includes('high'))  return 'high';
  if (n.includes('media') || n.includes('medium')) return 'medium';
  if (n.includes('baja')  || n.includes('low'))    return 'low';
  return 'none';
};

// Color de acento de columna (rota entre los del design system)
const COLUMN_COLORS = [
  'var(--color-brand-500)',
  'var(--color-accent-500)',
  'var(--color-cta-500)',
  '#8b5cf6',
  '#f59e0b',
  '#ef4444',
];

interface BoardColumnProps {
  list: BoardList;
  tasks: BoardTask[];
  colorIndex: number;
  onRename: (listId: string, name: string) => void;
  onDelete: (listId: string) => void;
  onAddTask: (title: string) => Promise<unknown>;
  onTaskClick?: (task: BoardTask) => void;
}

export const BoardColumn = ({
  list,
  tasks,
  colorIndex,
  onRename,
  onDelete,
  onAddTask,
  onTaskClick,
}: BoardColumnProps) => {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(list.name);
  const [menuOpen, setMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  // Cerrar menú al click fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleBlur = () => {
    setEditing(false);
    if (editValue.trim() && editValue.trim() !== list.name) {
      onRename(list.id, editValue.trim());
    } else {
      setEditValue(list.name);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') inputRef.current?.blur();
    if (e.key === 'Escape') { setEditValue(list.name); setEditing(false); }
  };

  // Título: editable inline
  const editableTitle = editing ? (
    <input
      ref={inputRef}
      value={editValue}
      onChange={(e) => setEditValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className="bg-transparent text-sm font-semibold text-white outline-none border-b border-brand-500/60 w-full max-w-[160px]"
      aria-label="Editar nombre de columna"
    />
  ) : (
    <span
      onDoubleClick={() => setEditing(true)}
      title="Doble click para editar"
      className="cursor-default select-none"
    >
      {list.name}
    </span>
  );

  // Menú de columna (⋯)
  const headerActions = (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center justify-center w-7 h-7 rounded-lg text-surface-500 hover:text-white hover:bg-surface-800 transition-colors"
        aria-label="Opciones de columna"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 7a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 7a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
        </svg>
      </button>

      {menuOpen && (
        <div className="absolute right-0 top-full mt-1 z-20 min-w-[140px] rounded-xl border border-surface-700/50 bg-surface-900 shadow-xl overflow-hidden">
          <button
            type="button"
            onClick={() => { setEditing(true); setMenuOpen(false); }}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-surface-300 hover:bg-surface-800 hover:text-white transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Renombrar
          </button>
          <button
            type="button"
            onClick={() => { onDelete(list.id); setMenuOpen(false); }}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Eliminar
          </button>
        </div>
      )}
    </div>
  );

  return (
    <KanbanColumn
      title={editableTitle as unknown as string}
      count={tasks.length}
      color={COLUMN_COLORS[colorIndex % COLUMN_COLORS.length]}
      headerActions={headerActions}
      addLabel="Agregar tarea"
      // onAddCard se reemplaza por AddTaskInline en el footer
    >
      {/* Tarjetas */}
      {tasks.map((task) => (
        <KanbanCard
          key={task.id}
          id={task.id}
          title={task.title}
          description={task.description ?? undefined}
          priority={mapPriority(task.priority?.name)}
          dueDate={task.dueDate ?? undefined}
          assignees={
            task.assignee
              ? [{ name: `${task.assignee.firstName} ${task.assignee.lastName}` }]
              : []
          }
          tags={
            task.labels?.map((l) => ({
              label: l.name,
              color: 'surface' as const,
            })) ?? []
          }
          commentCount={task.commentCount}
          subtasks={task.subtasks}
          onClick={() => onTaskClick?.(task)}
        />
      ))}

      {/* Footer inline add */}
      <AddTaskInline listId={list.id} onAdd={onAddTask} />
    </KanbanColumn>
  );
};
