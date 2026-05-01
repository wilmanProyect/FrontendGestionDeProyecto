import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/shared/components/Button';
import { Input, Textarea } from '@/shared/components/Input';
import { Select } from '@/shared/components/Select';
import type {
  BoardList,
  BoardMember,
  BoardPriority,
  BoardTask,
  CreateTaskPayload,
  UpdateTaskPayload,
} from '../types/board.types';

interface TaskFormModalProps {
  open: boolean;
  mode?: 'create' | 'edit';
  task?: BoardTask | null;
  lists: BoardList[];
  members: BoardMember[];
  priorities: BoardPriority[];
  defaultListId?: string;
  loading?: boolean;
  deleting?: boolean;
  onClose: () => void;
  onCreate: (payload: CreateTaskPayload) => Promise<unknown>;
  onUpdate?: (taskId: string, payload: UpdateTaskPayload) => Promise<unknown>;
  onDelete?: (taskId: string) => Promise<unknown>;
}

const getMemberName = (member: BoardMember) => {
  const fullName = `${member.user?.firstName ?? ''} ${member.user?.lastName ?? ''}`.trim();
  return fullName || member.user?.email || `Usuario ${member.userId.slice(0, 8)}`;
};

const getMemberInitials = (member?: BoardMember) => {
  if (!member) return '?';
  const first = member.user?.firstName?.[0] ?? '';
  const last = member.user?.lastName?.[0] ?? '';
  return `${first}${last}`.toUpperCase() || member.user?.email?.[0]?.toUpperCase() || '?';
};

const priorityTone = (priority?: BoardPriority) => {
  const name = priority?.name.toLowerCase() ?? '';
  if (name.includes('criti') || name.includes('alta')) return 'text-red-300 border-red-500/35 bg-red-500/10';
  if (name.includes('media')) return 'text-amber-300 border-amber-500/35 bg-amber-500/10';
  if (name.includes('baja')) return 'text-surface-300 border-surface-600/60 bg-surface-800/80';
  return 'text-brand-300 border-brand-500/35 bg-brand-500/10';
};

export const TaskFormModal = ({
  open,
  mode = 'create',
  task,
  lists,
  members,
  priorities,
  defaultListId,
  loading = false,
  deleting = false,
  onClose,
  onCreate,
  onUpdate,
  onDelete,
}: TaskFormModalProps) => {
  const initialListId = defaultListId || lists[0]?.id || '';
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [listId, setListId] = useState(initialListId);
  const [assigneeId, setAssigneeId] = useState('');
  const [priorityId, setPriorityId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [titleError, setTitleError] = useState('');
  const [draftChecklistItem, setDraftChecklistItem] = useState('');

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    setTitle(task?.title ?? '');
    setDescription(task?.description ?? '');
    setListId(task?.listId ?? initialListId);
    setAssigneeId(task?.assigneeId ?? '');
    setPriorityId(task?.priorityId ?? '');
    setDueDate(task?.dueDate ? task.dueDate.slice(0, 10) : '');
    setDraftChecklistItem('');
    setTitleError('');

    return () => {
      document.body.style.overflow = '';
    };
  }, [initialListId, open, task]);

  const listOptions = useMemo(
    () => lists.map((list) => ({ value: list.id, label: list.name })),
    [lists],
  );

  const memberOptions = useMemo(
    () => [
      { value: '', label: 'Sin asignar' },
      ...members.map((member) => ({ value: member.userId, label: getMemberName(member) })),
    ],
    [members],
  );

  const priorityOptions = useMemo(
    () => [
      { value: '', label: 'Sin prioridad' },
      ...priorities
        .slice()
        .sort((a, b) => b.level - a.level)
        .map((priority) => ({ value: priority.id, label: priority.name })),
    ],
    [priorities],
  );

  const selectedPriority = priorities.find((priority) => priority.id === priorityId);
  const selectedMember = members.find((member) => member.userId === assigneeId);
  const selectedList = lists.find((list) => list.id === listId);
  const checklistDone = task?.subtasks?.[0] ?? 0;
  const checklistTotal = task?.subtasks?.[1] ?? 0;
  const checklistPercent = checklistTotal ? Math.round((checklistDone / checklistTotal) * 100) : 0;

  const handleSubmit = async () => {
    if (!title.trim()) {
      setTitleError('Escribe un titulo para la tarea');
      return;
    }

    if (mode === 'edit' && task && onUpdate) {
      await onUpdate(task.id, {
        title,
        description,
        listId,
        assigneeId,
        priorityId,
        dueDate,
      });
    } else {
      await onCreate({
        title,
        description,
        listId,
        assigneeId,
        priorityId,
        dueDate,
      });
    }

    onClose();
  };

  const handleDelete = async () => {
    if (!task || !onDelete) return;
    const confirmed = window.confirm(`Eliminar la tarea "${task.title}"?`);
    if (!confirmed) return;
    await onDelete(task.id);
    onClose();
  };

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="Cerrar panel"
        className="absolute inset-0 cursor-default bg-black/55 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <aside className="relative z-10 flex h-full w-full max-w-[760px] flex-col border-l border-surface-700/60 bg-surface-950 shadow-2xl shadow-black/60">
        <header className="flex h-[74px] shrink-0 items-center justify-between border-b border-surface-700/50 px-6">
          <div className="flex min-w-0 items-center gap-2 text-sm text-surface-500">
            <span className="hidden sm:inline">ERP Kanban</span>
            <span className="hidden sm:inline">/</span>
            <span>Tablero</span>
            <span>/</span>
            <span className="truncate text-surface-300">
              {mode === 'edit' ? title || 'Tarea' : 'Nueva tarea'}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-surface-500 transition-colors hover:bg-surface-800 hover:text-white"
              aria-label="Mas opciones"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 7a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 7a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-surface-500 transition-colors hover:bg-surface-800 hover:text-white"
              aria-label="Cerrar"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-7">
          <div className="mx-auto max-w-[672px] space-y-7">
            <div className="space-y-3">
              <Input
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setTitleError('');
                }}
                error={titleError}
                placeholder="Nombre de la tarea"
                autoFocus
                className="border-transparent bg-transparent px-0 py-1 text-2xl font-bold text-white placeholder-surface-600 hover:border-transparent focus:border-transparent focus:ring-0"
              />

              <div className="grid gap-3 md:grid-cols-2">
                <Select
                  label="Lista"
                  value={listId}
                  onChange={(e) => setListId(e.target.value)}
                  options={listOptions}
                  disabled={!lists.length}
                  hint={!lists.length ? 'Crea una lista antes de crear tareas' : undefined}
                  className="bg-surface-900/80"
                />

                <Select
                  label="Prioridad"
                  value={priorityId}
                  onChange={(e) => setPriorityId(e.target.value)}
                  options={priorityOptions}
                  className="bg-surface-900/80"
                />

                <Input
                  label="Fecha limite"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="bg-surface-900/80"
                />

                <Select
                  label="Responsable"
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  options={memberOptions}
                  className="bg-surface-900/80"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                {selectedPriority && (
                  <span className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold ${priorityTone(selectedPriority)}`}>
                    <span className="h-2 w-2 rounded-full bg-current" />
                    {selectedPriority.name}
                  </span>
                )}
                {dueDate && (
                  <span className="inline-flex items-center gap-2 rounded-xl border border-surface-700 bg-surface-900/80 px-3 py-2 text-xs font-semibold text-surface-300">
                    <svg className="h-3.5 w-3.5 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(`${dueDate}T00:00:00`).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </span>
                )}
                {selectedList && (
                  <span className="inline-flex items-center rounded-xl border border-brand-500/30 bg-brand-500/10 px-3 py-2 text-xs font-semibold text-brand-300">
                    {selectedList.name}
                  </span>
                )}
                {selectedMember && (
                  <span className="inline-flex items-center gap-2 rounded-xl border border-surface-700 bg-surface-900/80 px-3 py-1.5 text-xs font-semibold text-surface-300">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cta-500 text-[10px] font-bold text-white">
                      {getMemberInitials(selectedMember)}
                    </span>
                    {getMemberName(selectedMember)}
                  </span>
                )}
              </div>
            </div>

            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-surface-200">Descripcion</h3>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Agrega contexto, alcance o notas para el equipo"
                rows={4}
                className="bg-surface-900/80 text-base leading-relaxed"
              />
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-surface-200">Etiquetas</h3>
                <button
                  type="button"
                  className="rounded-full border border-dashed border-surface-600 px-3 py-1 text-xs font-semibold text-surface-400 transition-colors hover:border-brand-500/50 hover:text-brand-300"
                >
                  + Agregar
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {task?.labels?.length ? (
                  task.labels.map((label) => (
                    <span
                      key={label.id}
                      className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold text-white"
                      style={{ backgroundColor: `${label.color}33`, borderColor: `${label.color}66` }}
                    >
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: label.color }} />
                      {label.name}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-surface-500">Sin etiquetas</span>
                )}
              </div>
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-surface-200">
                  <svg className="h-4 w-4 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                  </svg>
                  Checklist
                </h3>
                <span className="text-xs font-semibold text-surface-500">{checklistDone}/{checklistTotal}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-surface-800">
                <div className="h-full rounded-full bg-brand-500" style={{ width: `${checklistPercent}%` }} />
              </div>
              <div className="space-y-2">
                {checklistTotal > 0 ? (
                  Array.from({ length: checklistTotal }).map((_, index) => {
                    const checked = index < checklistDone;
                    return (
                      <label key={index} className="flex items-center gap-3 text-sm text-surface-300">
                        <input
                          type="checkbox"
                          checked={checked}
                          readOnly
                          className="h-4 w-4 rounded border-surface-600 bg-surface-900 accent-brand-500"
                        />
                        <span className={checked ? 'text-surface-500 line-through' : ''}>
                          Item {index + 1}
                        </span>
                      </label>
                    );
                  })
                ) : (
                  <p className="text-sm text-surface-500">Sin items</p>
                )}
              </div>
              <div className="flex gap-2">
                <Input
                  value={draftChecklistItem}
                  onChange={(e) => setDraftChecklistItem(e.target.value)}
                  placeholder="Agregar item..."
                  className="h-10 bg-surface-900/80 py-2"
                />
                <Button type="button" variant="secondary" size="md" disabled>
                  +
                </Button>
              </div>
            </section>

            <section className="grid gap-5 md:grid-cols-2">
              <div className="space-y-3">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-surface-200">
                  <svg className="h-4 w-4 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  Archivos adjuntos ({task?.attachmentCount ?? 0})
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {[0, 1].map((item) => (
                    <div key={item} className="flex aspect-[1.6] items-center justify-center rounded-xl border border-surface-700/60 bg-surface-900/80 text-surface-600">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                    </div>
                  ))}
                </div>
                <button type="button" className="text-xs font-semibold text-brand-400 hover:text-brand-300">
                  + Adjuntar archivo
                </button>
              </div>

              <div className="space-y-3">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-surface-200">
                  <svg className="h-4 w-4 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Comentarios ({task?.commentCount ?? 0})
                </h3>
                <div className="rounded-xl border border-surface-700/60 bg-surface-900/80 p-3 text-sm text-surface-500">
                  Sin comentarios recientes
                </div>
                <Input placeholder="Escribe un comentario..." className="h-10 bg-surface-900/80 py-2" />
              </div>
            </section>
          </div>
        </div>

        <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-surface-700/50 px-6 py-4">
          <div>
            {mode === 'edit' && onDelete && (
              <Button type="button" variant="danger" onClick={handleDelete} loading={deleting} disabled={loading}>
                Eliminar
              </Button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button type="button" variant="ghost" onClick={onClose} disabled={loading || deleting}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleSubmit} loading={loading} disabled={!lists.length || deleting}>
              {mode === 'edit' ? 'Guardar cambios' : 'Crear tarea'}
            </Button>
          </div>
        </footer>
      </aside>
    </div>,
    document.body,
  );
};
