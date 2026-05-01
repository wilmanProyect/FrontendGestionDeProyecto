/**
 * useBoard.ts
 * Hook principal del tablero. Carga listas + tareas + labels en paralelo
 * y expone los métodos de mutación conectados al backend.
 */

import { useEffect, useCallback } from 'react';
import { boardApi } from '../api/boardApi';
import { useBoardStore } from '../store/boardStore';

export const useBoard = (projectId: string | undefined) => {
  const {
    lists, tasks, labels, members, isLoading, error, filters,
    setLists, setTasks, setLabels, setMembers,
    setLoading, setError,
    getTasksByList, getFilteredTasks,
    resetBoard,
  } = useBoardStore();

  // ── Carga inicial ───────────────────────────────────────────────────────

  const loadBoard = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    setError(null);

    try {
      const [fetchedLists, fetchedTasks, fetchedLabels, fetchedMembers] = await Promise.all([
        boardApi.getLists(projectId),
        boardApi.getTasks(projectId),
        boardApi.getLabels(projectId),
        boardApi.getMembers(projectId),
      ]);

      setLists(fetchedLists);
      setTasks(fetchedTasks);
      setLabels(fetchedLabels);
      setMembers(fetchedMembers);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al cargar el tablero';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [projectId, setLists, setTasks, setLabels, setMembers, setLoading, setError]);

  useEffect(() => {
    loadBoard();
    return () => { resetBoard(); };
  }, [loadBoard, resetBoard]);

  return {
    lists,
    tasks,
    labels,
    members,
    isLoading,
    error,
    filters,
    getTasksByList,
    getFilteredTasks,
    reload: loadBoard,
  };
};
