import { useCallback, useState } from 'react';
import { useToast } from '@/shared/components/Toast';
import { boardApi } from '../api/boardApi';
import { useBoardStore } from '../store/boardStore';
import type { BoardPriority, BoardTask, CreateTaskPayload, UpdateTaskPayload } from '../types/board.types';

export const useTaskCrud = (projectId: string) => {
  const { toast } = useToast();
  const { tasks, addTask, updateTask: updateTaskInStore, removeTask, setTasks } = useBoardStore();
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [priorities, setPriorities] = useState<BoardPriority[]>([]);
  const [isLoadingPriorities, setIsLoadingPriorities] = useState(false);

  const loadPriorities = useCallback(async () => {
    if (!projectId) return;
    setIsLoadingPriorities(true);
    try {
      const fetchedPriorities = await boardApi.getPriorities(projectId);
      setPriorities(fetchedPriorities);
    } catch {
      setPriorities([]);
    } finally {
      setIsLoadingPriorities(false);
    }
  }, [projectId]);

  const createTask = async (payload: CreateTaskPayload) => {
    const title = payload.title.trim();
    if (!title) {
      toast.warning('La tarea necesita un titulo');
      return undefined;
    }

    setIsSaving(true);
    try {
      const task = await boardApi.createTask(projectId, {
        ...payload,
        title,
        description: payload.description?.trim() || undefined,
        assigneeId: payload.assigneeId || undefined,
        priorityId: payload.priorityId || undefined,
        dueDate: payload.dueDate || undefined,
      });
      addTask(task);
      toast.success('Tarea creada');
      return task;
    } catch (err) {
      toast.error('No se pudo crear la tarea');
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const updateTask = async (taskId: string, payload: UpdateTaskPayload) => {
    const previousTasks = tasks;
    const patch: UpdateTaskPayload = {
      ...payload,
      title: payload.title?.trim(),
      description: payload.description?.trim() || null,
      assigneeId: payload.assigneeId || null,
      priorityId: payload.priorityId || null,
      dueDate: payload.dueDate || null,
    };

    setIsSaving(true);
    updateTaskInStore(taskId, patch as Partial<BoardTask>);
    try {
      const task = await boardApi.updateTask(projectId, taskId, patch);
      updateTaskInStore(taskId, task);
      toast.success('Tarea actualizada');
      return task;
    } catch (err) {
      setTasks(previousTasks);
      toast.error('No se pudo actualizar la tarea');
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const deleteTask = async (taskId: string) => {
    const previousTasks = tasks;
    setIsDeleting(true);
    removeTask(taskId);
    try {
      await boardApi.deleteTask(projectId, taskId);
      toast.success('Tarea eliminada');
    } catch (err) {
      setTasks(previousTasks);
      toast.error('No se pudo eliminar la tarea');
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    createTask,
    updateTask,
    deleteTask,
    priorities,
    loadPriorities,
    isLoadingPriorities,
    isSaving,
    isDeleting,
  };
};
