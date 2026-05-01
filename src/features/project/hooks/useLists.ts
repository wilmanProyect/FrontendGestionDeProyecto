/**
 * useLists.ts
 * CRUD de listas (columnas) con actualizaciones optimistas.
 * Usado por: BoardColumn (rename inline), AddListButton.
 */

import { useState } from 'react';
import { boardApi } from '../api/boardApi';
import { useBoardStore } from '../store/boardStore';

export const useLists = (projectId: string) => {
  const { addList, updateList, removeList } = useBoardStore();
  const [isCreating, setIsCreating] = useState(false);

  // ── Crear lista ─────────────────────────────────────────────────────────

  const createList = async (name: string) => {
    if (!name.trim()) return;
    setIsCreating(true);
    try {
      const newList = await boardApi.createList(projectId, { name: name.trim() });
      addList(newList);
      return newList;
    } catch (err) {
      console.error('Error al crear lista:', err);
    } finally {
      setIsCreating(false);
    }
  };

  // ── Renombrar lista (doble click → blur) ────────────────────────────────

  const renameList = async (listId: string, name: string) => {
    if (!name.trim()) return;
    // Optimistic update
    updateList(listId, { name: name.trim() });
    try {
      await boardApi.updateList(projectId, listId, { name: name.trim() });
    } catch (err) {
      console.error('Error al renombrar lista:', err);
      // No rollback visible aquí, la recarga se puede hacer con useBoard.reload()
    }
  };

  // ── Eliminar lista ──────────────────────────────────────────────────────

  const deleteList = async (listId: string) => {
    // Optimistic
    removeList(listId);
    try {
      await boardApi.deleteList(projectId, listId);
    } catch (err) {
      console.error('Error al eliminar lista:', err);
    }
  };

  return { createList, renameList, deleteList, isCreating };
};
