import { useEffect, useRef, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { KanbanColumn } from '@/shared/components/Kanban';
import { AddTaskInline } from './AddTaskInline';
import { TaskCard } from './TaskCard';
import type { BoardList, BoardTask } from '../types/board.types';

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
  lists: BoardList[];
  tasks: BoardTask[];
  colorIndex: number;
  onRename: (listId: string, name: string) => void;
  onDelete: (listId: string) => void;
  onAddTask: (title: string) => Promise<unknown>;
  onTaskClick?: (task: BoardTask) => void;
  onMoveTaskMobile?: (taskId: string, listId: string) => void;
}

export const BoardColumn = ({
  list,
  lists,
  tasks,
  colorIndex,
  onRename,
  onDelete,
  onAddTask,
  onTaskClick,
  onMoveTaskMobile,
}: BoardColumnProps) => {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(list.name);
  const [menuOpen, setMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const { setNodeRef, isOver } = useDroppable({
    id: list.id,
    data: {
      type: 'list',
      listId: list.id,
    },
  });

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') inputRef.current?.blur();
    if (event.key === 'Escape') {
      setEditValue(list.name);
      setEditing(false);
    }
  };

  const editableTitle = editing ? (
    <input
      ref={inputRef}
      value={editValue}
      onChange={(event) => setEditValue(event.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className="w-full max-w-[160px] border-b border-brand-500/60 bg-transparent text-sm font-semibold text-white outline-none"
      aria-label="Editar nombre de columna"
    />
  ) : (
    <span onDoubleClick={() => setEditing(true)} title="Doble click para editar" className="cursor-default select-none">
      {list.name}
    </span>
  );

  const headerActions = (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex h-7 w-7 items-center justify-center rounded-lg text-surface-500 transition-colors hover:bg-surface-800 hover:text-white"
        aria-label="Opciones de columna"
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 7a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 7a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
        </svg>
      </button>

      {menuOpen && (
        <div className="absolute right-0 top-full z-20 mt-1 min-w-[140px] overflow-hidden rounded-xl border border-surface-700/50 bg-surface-900 shadow-xl">
          <button
            type="button"
            onClick={() => {
              setEditing(true);
              setMenuOpen(false);
            }}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-surface-300 transition-colors hover:bg-surface-800 hover:text-white"
          >
            Renombrar
          </button>
          <button
            type="button"
            onClick={() => {
              onDelete(list.id);
              setMenuOpen(false);
            }}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/10"
          >
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
      dropRef={setNodeRef}
      isDragOver={isOver}
    >
      <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            lists={lists}
            onClick={onTaskClick}
            onMoveMobile={onMoveTaskMobile}
          />
        ))}
      </SortableContext>

      <AddTaskInline listId={list.id} onAdd={onAddTask} />
    </KanbanColumn>
  );
};
