/**
 * board.types.ts
 * Tipos TypeScript para el feature de Gestión de Proyectos.
 * Refleja exactamente los modelos del backend (NestJS + TypeORM).
 */

// ── Enums (espejo del backend) ──────────────────────────────────────────────

export const TaskStatus = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  IN_REVIEW: 'in_review',
  DONE: 'done',
  CANCELLED: 'cancelled',
} as const;

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

export const ProjectRole = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MEMBER: 'member',
  VIEWER: 'viewer',
} as const;

export type ProjectRole = (typeof ProjectRole)[keyof typeof ProjectRole];

// ── Entidades del dominio ───────────────────────────────────────────────────

export interface Project {
  id: string;
  name: string;
  description?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  status?: 'active' | 'archived' | 'on_hold';
  isArchived: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface BoardList {
  id: string;
  projectId: string;
  name: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface BoardTask {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  projectId: string;
  listId?: string | null;
  position: number;
  assigneeId?: string | null;
  priorityId?: string | null;
  dueDate?: string | null;
  createdAt: string;
  updatedAt: string;
  // Relaciones opcionales que el backend puede poblar
  assignee?: BoardUser | null;
  priority?: BoardPriority | null;
  labels?: BoardLabel[];
  commentCount?: number;
  attachmentCount?: number;
  subtasks?: [number, number]; // [completadas, total]
}

export interface BoardLabel {
  id: string;
  name: string;
  color: string;
  projectId: string;
}

export interface BoardUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface BoardMember {
  id?: string;
  projectId?: string;
  userId: string;
  role: ProjectRole;
  joinedAt?: string;
  user?: BoardUser | null;
}

export interface BoardPriority {
  id: string;
  name: string;
  level: number;
}

export interface BoardPermission {
  id: string;
  name: string;
  description?: string;
  module?: string;
}

// ── DTOs de creación / actualización ───────────────────────────────────────

export interface CreateProjectPayload {
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export interface UpdateProjectPayload {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export interface CreateListPayload {
  name: string;
}

export interface UpdateListPayload {
  name?: string;
  position?: number;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  listId?: string;
  assigneeId?: string;
  priorityId?: string;
  dueDate?: string;
}

export interface MoveTaskPayload {
  listId: string;
  position: number;
}

export interface AddMemberPayload {
  userId: string;
  role: ProjectRole;
}

export interface CreateLabelPayload {
  name: string;
  color: string;
}

export interface UpdateLabelPayload {
  name?: string;
  color?: string;
}

// ── Estado del filtro del tablero ───────────────────────────────────────────

export interface BoardFilters {
  search: string;
  priority: string | null;
  labelId: string | null;
  assigneeId: string | null;
}

// ── Wizard de creación de proyecto ─────────────────────────────────────────

/** Usuario pendiente de agregar en el wizard (Step 2) */
export interface WizardMember {
  user: BoardUser;
  role: ProjectRole;
  permissionNames: string[];
}

/** Labels pendientes de crear en el wizard (Step 1) */
export interface WizardLabel {
  name: string;
  color: string;
  /** ID temporal para UI */
  tempId: string;
}

/** Listas iniciales a crear en el wizard (Step 1) */
export interface WizardList {
  name: string;
  /** ID temporal para UI */
  tempId: string;
}

export interface WizardFormState {
  // Step 1
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  labels: WizardLabel[];
  lists: WizardList[];
  // Step 2
  members: WizardMember[];
}
