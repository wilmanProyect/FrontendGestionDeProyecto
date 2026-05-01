/**
 * useCreateTask.ts
 * Crea una tarea inline (sin modal) dentro de una columna.
 */

import { useState } from 'react';
import { boardApi } from '../api/boardApi';
import { useBoardStore } from '../store/boardStore';
import type { CreateTaskPayload } from '../types/board.types';

export const useCreateTask = (projectId: string) => {
  const { addTask } = useBoardStore();
  const [isCreating, setIsCreating] = useState(false);

  const createTask = async (payload: CreateTaskPayload) => {
    if (!payload.title.trim()) return;
    setIsCreating(true);
    try {
      const task = await boardApi.createTask(projectId, {
        ...payload,
        title: payload.title.trim(),
      });
      addTask(task);
      return task;
    } catch (err) {
      console.error('Error al crear tarea:', err);
    } finally {
      setIsCreating(false);
    }
  };

  return { createTask, isCreating };
};
