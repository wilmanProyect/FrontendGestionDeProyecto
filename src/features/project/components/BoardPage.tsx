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

import { useMemo, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { AppLayout } from '@/shared/components/AppLayout';
import { Spinner } from '@/shared/components/Spinner';
import { EmptyState } from '@/shared/components/EmptyState';
import { useToast } from '@/shared/components/Toast';
import { BoardHeader } from '../components/BoardHeader';
import { BoardColumn } from '../components/BoardColumn';
import { AddListButton } from '../components/AddListButton';
import { TaskFormModal } from '../components/TaskFormModal';
import { TaskCardView } from '../components/TaskCard';
import { useBoard } from '../hooks/useBoard';
import { useLists } from '../hooks/useLists';
import { useTaskCrud } from '../hooks/useTaskCrud';
import { useBoardStore } from '../store/boardStore';
import { boardApi } from '../api/boardApi';
import type { BoardList, BoardTask } from '../types/board.types';

type ViewMode = 'kanban' | 'list';

const sortLists = (lists: BoardList[]) =>
  [...lists].sort((a, b) => {
    const byPosition = a.position - b.position;
    if (byPosition !== 0) return byPosition;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

const sortTasks = (tasks: BoardTask[]) =>
  [...tasks].sort((a, b) => {
    const byPosition = a.position - b.position;
    if (byPosition !== 0) return byPosition;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

export const BoardPage = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [projectName, setProjectName] = useState('Cargando...');
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<BoardTask | null>(null);
  const [defaultTaskListId, setDefaultTaskListId] = useState<string | undefined>();
  const [activeTask, setActiveTask] = useState<BoardTask | null>(null);

  const { lists, tasks, labels, members, isLoading, error, getFilteredTasks } = useBoard(projectId!);
  const { setTasks, updateTask: updateTaskInStore } = useBoardStore();
  const { createList, renameList, deleteList } = useLists(projectId!);
  const {
    createTask,
    updateTask,
    deleteTask,
    priorities,
    loadPriorities,
    isSaving,
    isDeleting,
  } = useTaskCrud(projectId!);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Cargar nombre del proyecto
  useEffect(() => {
    if (!projectId) return;
    boardApi.getProject(projectId)
      .then((p) => setProjectName(p.name))
      .catch(() => setProjectName('Proyecto'));
  }, [projectId]);

  useEffect(() => {
    loadPriorities();
  }, [loadPriorities]);

  const orderedLists = useMemo(() => sortLists(lists), [lists]);
  const filteredTasks = getFilteredTasks();

  // Tareas de una lista que pasan los filtros
  const getColumnTasks = (listId: string) =>
    sortTasks(filteredTasks.filter((t) => t.listId === listId));

  const handleAddTask = (listId: string) => async (title: string) => {
    await createTask({ title, listId });
  };

  const moveTaskOptimistically = async (taskId: string, targetListId: string, targetIndex?: number) => {
    if (!projectId) return;

    const movingTask = tasks.find((task) => task.id === taskId);
    if (!movingTask || movingTask.listId === targetListId && targetIndex === undefined) return;

    const previousTasks = tasks;
    const tasksByList = new Map<string, BoardTask[]>();

    lists.forEach((list) => {
      tasksByList.set(list.id, sortTasks(tasks.filter((task) => task.listId === list.id && task.id !== taskId)));
    });

    const destinationTasks = tasksByList.get(targetListId) ?? [];
    const boundedIndex = Math.max(0, Math.min(targetIndex ?? destinationTasks.length, destinationTasks.length));
    destinationTasks.splice(boundedIndex, 0, { ...movingTask, listId: targetListId });
    tasksByList.set(targetListId, destinationTasks);

    const nextTasks = tasks.map((task) => {
      const taskListId = task.id === taskId ? targetListId : task.listId;
      const ordered = taskListId ? tasksByList.get(taskListId) : undefined;
      const index = ordered?.findIndex((item) => item.id === task.id) ?? -1;

      if (index === -1) return task;
      return {
        ...task,
        listId: taskListId,
        position: index,
      };
    });

    setTasks(nextTasks);

    try {
      const updatedTask = await boardApi.moveTask(projectId, taskId, {
        listId: targetListId,
        position: boundedIndex,
      });
      updateTaskInStore(taskId, updatedTask);
    } catch (err) {
      setTasks(previousTasks);
      toast.error('No se pudo mover la tarea', {
        description: 'El tablero volvio al estado anterior.',
      });
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((item) => item.id === event.active.id);
    setActiveTask(task ?? null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over || active.id === over.id) return;

    const activeTaskId = String(active.id);
    const overId = String(over.id);
    const overTask = tasks.find((task) => task.id === overId);
    const overList = lists.find((list) => list.id === overId);
    const targetListId = overTask?.listId ?? overList?.id;

    if (!targetListId) return;

    const targetTasks = sortTasks(tasks.filter((task) => task.listId === targetListId && task.id !== activeTaskId));
    const targetIndex = overTask
      ? Math.max(0, targetTasks.findIndex((task) => task.id === overTask.id))
      : targetTasks.length;

    await moveTaskOptimistically(activeTaskId, targetListId, targetIndex);
  };

  const handleDragCancel = () => {
    setActiveTask(null);
  };

  const openCreateTask = (listId?: string) => {
    setEditingTask(null);
    setDefaultTaskListId(listId);
    setTaskModalOpen(true);
  };

  const openEditTask = (task: BoardTask) => {
    setEditingTask(task);
    setDefaultTaskListId(task.listId ?? undefined);
    setTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setTaskModalOpen(false);
    setEditingTask(null);
    setDefaultTaskListId(undefined);
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
          onCreateTaskClick={() => openCreateTask()}
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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext items={orderedLists.map((list) => list.id)} strategy={horizontalListSortingStrategy}>
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
                {orderedLists.length === 0 && (
                  <div className="flex items-center justify-center w-full min-h-[300px]">
                    <div className="text-center space-y-2">
                      <p className="text-surface-400 text-sm">Este tablero no tiene listas aun.</p>
                      <p className="text-surface-600 text-xs">Crea la primera lista con el boton de la derecha.</p>
                    </div>
                  </div>
                )}

                {orderedLists.map((list, idx) => (
                  <div key={list.id} style={{ width: 300, flexShrink: 0 }}>
                    <BoardColumn
                      list={list}
                      lists={orderedLists}
                      tasks={getColumnTasks(list.id)}
                      colorIndex={idx}
                      onRename={renameList}
                      onDelete={deleteList}
                      onAddTask={handleAddTask(list.id)}
                      onTaskClick={openEditTask}
                      onMoveTaskMobile={(taskId, listId) => moveTaskOptimistically(taskId, listId)}
                    />
                  </div>
                ))}

                <div style={{ flexShrink: 0 }}>
                  <AddListButton onAdd={(name) => createList(name) as Promise<unknown>} />
                </div>
              </div>
            </div>
          </SortableContext>

          <DragOverlay>
            {activeTask ? (
              <TaskCardView
                task={activeTask}
                lists={orderedLists}
                onClick={openEditTask}
                onMoveMobile={(taskId, listId) => moveTaskOptimistically(taskId, listId)}
                isOverlay
              />
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* ── Vista Lista (mobile vertical) ────────────────────────── */}
        <div
          className={[
            'flex-1 min-h-0 overflow-y-auto space-y-6',
            viewMode === 'list' ? 'block md:hidden' : 'hidden',
          ].join(' ')}
        >
          {orderedLists.map((list) => {
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
                      role="button"
                      tabIndex={0}
                      onClick={() => openEditTask(task)}
                      onKeyDown={(e) => e.key === 'Enter' && openEditTask(task)}
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
                      <select
                        value={task.listId ?? ''}
                        aria-label={`Mover ${task.title} a otra lista`}
                        onClick={(event) => event.stopPropagation()}
                        onChange={(event) => {
                          event.stopPropagation();
                          moveTaskOptimistically(task.id, event.target.value);
                        }}
                        className="ml-2 rounded-lg border border-surface-700 bg-surface-900 px-2 py-1 text-[10px] text-surface-300"
                      >
                        {orderedLists.map((targetList) => (
                          <option key={targetList.id} value={targetList.id}>
                            Mover a {targetList.name}
                          </option>
                        ))}
                      </select>
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

        <TaskFormModal
          open={taskModalOpen}
          mode={editingTask ? 'edit' : 'create'}
          task={editingTask}
          lists={lists}
          members={members}
          priorities={priorities}
          defaultListId={defaultTaskListId}
          loading={isSaving}
          deleting={isDeleting}
          onClose={closeTaskModal}
          onCreate={createTask}
          onUpdate={updateTask}
          onDelete={deleteTask}
        />
      </div>
    </AppLayout>
  );
};
