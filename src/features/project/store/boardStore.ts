/**
 * boardStore.ts
 * Estado global del tablero Kanban con Zustand.
 *
 * Principios:
 * - Normalizado: listas y tareas en arrays planos
 * - Optimistic updates: mutación local inmediata, rollback en error
 * - Filtros reactivos: cualquier componente puede suscribirse a filtros
 */

import { create } from 'zustand';
import type { BoardList, BoardTask, BoardLabel, BoardMember, BoardFilters } from '../types/board.types';

interface BoardState {
  // ── Data ─────────────────────────────────────────────────────────────────
  lists:   BoardList[];
  tasks:   BoardTask[];
  labels:  BoardLabel[];
  members: BoardMember[];

  // ── UI state ──────────────────────────────────────────────────────────────
  isLoading: boolean;
  error:     string | null;
  filters:   BoardFilters;

  // ── Derived (getters) ─────────────────────────────────────────────────────
  getTasksByList: (listId: string) => BoardTask[];
  getFilteredTasks: () => BoardTask[];

  // ── Setters ───────────────────────────────────────────────────────────────
  setLists:   (lists: BoardList[]) => void;
  setTasks:   (tasks: BoardTask[]) => void;
  setLabels:  (labels: BoardLabel[]) => void;
  setMembers: (members: BoardMember[]) => void;
  setLoading: (loading: boolean) => void;
  setError:   (error: string | null) => void;
  setFilter:  (key: keyof BoardFilters, value: string | null) => void;
  resetFilters: () => void;

  // ── Optimistic mutations ──────────────────────────────────────────────────

  // Lists
  addList:    (list: BoardList) => void;
  updateList: (listId: string, patch: Partial<BoardList>) => void;
  removeList: (listId: string) => void;

  // Tasks
  addTask:    (task: BoardTask) => void;
  updateTask: (taskId: string, patch: Partial<BoardTask>) => void;
  removeTask: (taskId: string) => void;
  moveTask:   (taskId: string, newListId: string, newPosition: number) => void;

  // Labels
  addLabel:    (label: BoardLabel) => void;
  removeLabel: (labelId: string) => void;

  // Reset
  resetBoard: () => void;
}

const DEFAULT_FILTERS: BoardFilters = {
  search:     '',
  priority:   null,
  labelId:    null,
  assigneeId: null,
};

const sortLists = (lists: BoardList[]) =>
  [...lists].sort((a, b) => {
    const byPosition = a.position - b.position;
    if (byPosition !== 0) return byPosition;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

export const useBoardStore = create<BoardState>((set, get) => ({
  // ── Initial state ──────────────────────────────────────────────────────────
  lists:     [],
  tasks:     [],
  labels:    [],
  members:   [],
  isLoading: false,
  error:     null,
  filters:   DEFAULT_FILTERS,

  // ── Derived ───────────────────────────────────────────────────────────────

  getTasksByList: (listId) =>
    get().tasks
      .filter((t) => t.listId === listId)
      .sort((a, b) => a.position - b.position),

  getFilteredTasks: () => {
    const { tasks, filters } = get();
    return tasks.filter((task) => {
      if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      if (filters.assigneeId && task.assigneeId !== filters.assigneeId) {
        return false;
      }
      if (filters.labelId && !task.labels?.some((l) => l.id === filters.labelId)) {
        return false;
      }
      return true;
    });
  },

  // ── Setters ───────────────────────────────────────────────────────────────

  setLists:   (lists)   => set({ lists: sortLists(lists) }),
  setTasks:   (tasks)   => set({ tasks }),
  setLabels:  (labels)  => set({ labels }),
  setMembers: (members) => set({ members }),
  setLoading: (isLoading) => set({ isLoading }),
  setError:   (error)   => set({ error }),

  setFilter: (key, value) =>
    set((s) => ({ filters: { ...s.filters, [key]: value } })),

  resetFilters: () => set({ filters: DEFAULT_FILTERS }),

  // ── Lists mutations ───────────────────────────────────────────────────────

  addList: (list) =>
    set((s) => ({ lists: sortLists([...s.lists, list]) })),

  updateList: (listId, patch) =>
    set((s) => ({
      lists: sortLists(s.lists.map((l) => (l.id === listId ? { ...l, ...patch } : l))),
    })),

  removeList: (listId) =>
    set((s) => ({
      lists: s.lists.filter((l) => l.id !== listId),
      tasks: s.tasks.filter((t) => t.listId !== listId),
    })),

  // ── Tasks mutations ───────────────────────────────────────────────────────

  addTask: (task) =>
    set((s) => ({ tasks: [...s.tasks, task] })),

  updateTask: (taskId, patch) =>
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === taskId ? { ...t, ...patch } : t)),
    })),

  removeTask: (taskId) =>
    set((s) => ({ tasks: s.tasks.filter((t) => t.id !== taskId) })),

  moveTask: (taskId, newListId, newPosition) =>
    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === taskId ? { ...t, listId: newListId, position: newPosition } : t,
      ),
    })),

  // ── Labels mutations ──────────────────────────────────────────────────────

  addLabel: (label) =>
    set((s) => ({ labels: [...s.labels, label] })),

  removeLabel: (labelId) =>
    set((s) => ({
      labels: s.labels.filter((l) => l.id !== labelId),
      tasks: s.tasks.map((t) => ({
        ...t,
        labels: t.labels?.filter((l) => l.id !== labelId),
      })),
    })),

  // ── Reset ─────────────────────────────────────────────────────────────────

  resetBoard: () =>
    set({ lists: [], tasks: [], labels: [], members: [], filters: DEFAULT_FILTERS, error: null }),
}));
