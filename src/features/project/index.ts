/**
 * index.ts
 * Exportaciones públicas del feature `projects`.
 * Solo lo que otros módulos necesitan importar.
 */

export { BoardPage } from './pages/BoardPage';
export { CreateProjectWizard } from './components/wizard/CreateProjectWizard';
export { useBoardStore } from './store/boardStore';
export { boardApi } from './api/boardApi';
export type * from './types/board.types';
