/**
 * BoardPage.tsx
 * Vista principal del tablero Kanban en /projects/:id/board.
 *
 * Responsabilidades:
 *   - Cargar proyecto + listas + tareas + labels + miembros con useBoard()
 *   - Scroll horizontal con columnas de 300px (overflow-x: auto)
 *   - Toggle mobile: kanban (horizontal) ↔ lista (vertical agrupada)
 *   - Conectar BoardColumn, BoardHeader, AddListButton
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from '@/shared/components/AppLayout';
import { Spinner } from '@/shared/components/Spinner';
import { EmptyState } from '@/shared/components/EmptyState';
import { BoardHeader } from '../components/BoardHeader';
import { BoardColumn } from '../components/BoardColumn';
import { AddListButton } from '../components/AddListButton';
import { useBoard } from '../hooks/useBoard';
import { useLists } from '../hooks/useLists';
import { useCreateTask } from '../hooks/useCreateTask';
import { boardApi } from '../api/boardApi';

type ViewMode = 'kanban' | 'list';

export const BoardPage = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [projectName, setProjectName] = useState('Cargando...');

  const { lists, labels, members, isLoading, error, getFilteredTasks } = useBoard(projectId!);
  const { createList, renameList, deleteList } = useLists(projectId!);
  const { createTask } = useCreateTask(projectId!);

  // Cargar nombre del proyecto
  useEffect(() => {
    if (!projectId) return;
    boardApi.getProject(projectId)
      .then((p) => setProjectName(p.name))
      .catch(() => setProjectName('Proyecto'));
  }, [projectId]);

  const filteredTasks = getFilteredTasks();

  // Tareas de una lista que pasan los filtros
  const getColumnTasks = (listId: string) =>
    filteredTasks.filter((t) => t.listId === listId);

  const handleAddTask = (listId: string) => async (title: string) => {
    await createTask({ title, listId });
  };

  // ── Loading / Error ──────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Spinner size="lg" />
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <EmptyState
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
          title="Error al cargar el tablero"
          description={error}
        />
      </AppLayout>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <AppLayout>
      <div className="flex flex-col h-full min-h-0 px-6 py-5">

        {/* Header */}
        <BoardHeader
          projectName={projectName}
          labels={labels}
          members={members}
          onSettingsClick={() => projectId && navigate(`/projects/${projectId}/settings`)}
        />

        {/* Toggle mobile */}
        <div className="flex items-center gap-2 mb-4 md:hidden">
          <button
            type="button"
            onClick={() => setViewMode('kanban')}
            className={[
              'flex-1 py-2 text-sm rounded-xl border transition-all',
              viewMode === 'kanban'
                ? 'border-brand-500 bg-brand-500/10 text-brand-300 font-medium'
                : 'border-surface-700/50 bg-surface-800 text-surface-400',
            ].join(' ')}
          >
            Tablero
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={[
              'flex-1 py-2 text-sm rounded-xl border transition-all',
              viewMode === 'list'
                ? 'border-brand-500 bg-brand-500/10 text-brand-300 font-medium'
                : 'border-surface-700/50 bg-surface-800 text-surface-400',
            ].join(' ')}
          >
            Lista
          </button>
        </div>

        {/* ── Vista Kanban (horizontal) ─────────────────────────────── */}
        <div
          className={[
            'flex-1 min-h-0',
            viewMode === 'list' ? 'hidden md:flex' : 'flex',
          ].join(' ')}
        >
          <div
            className="flex gap-4 overflow-x-auto pb-4"
            style={{ scrollbarWidth: 'thin' }}
          >
            {lists.length === 0 && (
              <div className="flex items-center justify-center w-full min-h-[300px]">
                <div className="text-center space-y-2">
                  <p className="text-surface-400 text-sm">Este tablero no tiene listas aún.</p>
                  <p className="text-surface-600 text-xs">Crea la primera lista con el botón de la derecha.</p>
                </div>
              </div>
            )}

            {lists
              .slice()
              .sort((a, b) => a.position - b.position)
              .map((list, idx) => (
                <div key={list.id} style={{ width: 300, flexShrink: 0 }}>
                  <BoardColumn
                    list={list}
                    tasks={getColumnTasks(list.id)}
                    colorIndex={idx}
                    onRename={renameList}
                    onDelete={deleteList}
                    onAddTask={handleAddTask(list.id)}
                  />
                </div>
              ))}

            {/* Botón agregar lista */}
            <div style={{ flexShrink: 0 }}>
              <AddListButton onAdd={(name) => createList(name) as Promise<unknown>} />
            </div>
          </div>
        </div>

        {/* ── Vista Lista (mobile vertical) ────────────────────────── */}
        <div
          className={[
            'flex-1 min-h-0 overflow-y-auto space-y-6',
            viewMode === 'list' ? 'block md:hidden' : 'hidden',
          ].join(' ')}
        >
          {lists.map((list) => {
            const columnTasks = getColumnTasks(list.id);
            return (
              <div key={list.id} className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-white">{list.name}</h3>
                  <span className="inline-flex items-center justify-center min-w-[20px] h-5 rounded-full px-1.5 text-[10px] font-bold bg-surface-800 text-surface-400 border border-surface-700/50">
                    {columnTasks.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {columnTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between rounded-xl border border-surface-700/30 bg-surface-800/50 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm text-white">{task.title}</p>
                        {task.labels && task.labels.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {task.labels.map((l) => (
                              <span
                                key={l.id}
                                className="inline-block rounded-full px-2 py-0.5 text-[10px] text-white"
                                style={{ backgroundColor: l.color + '40', border: `1px solid ${l.color}60` }}
                              >
                                {l.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      {task.dueDate && (
                        <span className="text-[10px] text-surface-500 shrink-0 ml-2">
                          {new Date(task.dueDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                        </span>
                      )}
                    </div>
                  ))}
                  {columnTasks.length === 0 && (
                    <p className="text-xs text-surface-600 pl-2">Sin tareas</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </AppLayout>
  );
};
