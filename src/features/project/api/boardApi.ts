/**
 * boardApi.ts
 * Capa de acceso HTTP para el módulo de Gestión de Proyectos.
 * Sigue el mismo patrón de clase que authApi.ts.
 *
 * Endpoints cubiertos:
 *   Projects : GET /projects  |  POST /projects  |  GET /projects/:id
 *   Lists    : GET | POST /projects/:id/lists  |  PATCH | DELETE /projects/:id/lists/:listId
 *   Tasks    : GET | POST /projects/:id/tasks  |  PATCH move/status/priority/assign
 *   Labels   : GET | POST /projects/:id/labels  |  PATCH | DELETE /:labelId
 *   Members  : GET | POST /projects/:id/members  |  DELETE /:userId
 *   Users    : GET /users  (para búsqueda en wizard)
 *   Permisos : GET /projects/:id/available-permissions
 */

import { axiosInstance } from '@/shared/api/axiosInstance';
import { API_ROUTES } from '@/shared/constants/api.constants';
import type {
  Project,
  BoardList,
  BoardTask,
  BoardLabel,
  BoardMember,
  BoardUser,
  BoardPriority,
  BoardPermission,
  CreateProjectPayload,
  UpdateProjectPayload,
  CreateListPayload,
  UpdateListPayload,
  CreateTaskPayload,
  UpdateTaskPayload,
  MoveTaskPayload,
  AddMemberPayload,
  CreateLabelPayload,
  UpdateLabelPayload,
} from '../types/board.types';

/** Wrapper genérico de la respuesta paginada / envuelta del backend */
type ApiResponse<T> = { data: T };

const unwrap = <T>(res: { data: ApiResponse<T> }): T => res.data.data ?? res.data as unknown as T;

const normalizeProject = (project: Project): Project => ({
  ...project,
  isArchived: project.isArchived ?? project.status === 'archived',
});

const fallbackUser = (userId: string): BoardUser => ({
  id: userId,
  firstName: 'Usuario',
  lastName: userId.slice(0, 8),
  email: '',
});

class BoardApi {
  // ── Projects ───────────────────────────────────────────────────────────

  async listProjects(): Promise<Project[]> {
    const res = await axiosInstance.get<ApiResponse<Project[]>>(API_ROUTES.PROJECTS.LIST);
    return unwrap(res).map(normalizeProject);
  }

  async getProject(id: string): Promise<Project> {
    const res = await axiosInstance.get<ApiResponse<Project>>(API_ROUTES.PROJECTS.GET(id));
    return normalizeProject(unwrap(res));
  }

  async createProject(payload: CreateProjectPayload): Promise<Project> {
    const res = await axiosInstance.post<ApiResponse<Project>>(API_ROUTES.PROJECTS.CREATE, payload);
    return normalizeProject(unwrap(res));
  }

  async updateProject(id: string, payload: UpdateProjectPayload): Promise<Project> {
    const res = await axiosInstance.patch<ApiResponse<Project>>(
      API_ROUTES.PROJECTS.UPDATE(id),
      payload,
    );
    return normalizeProject(unwrap(res));
  }

  async archiveProject(id: string): Promise<Project> {
    const res = await axiosInstance.patch<ApiResponse<Project>>(API_ROUTES.PROJECTS.ARCHIVE(id));
    return normalizeProject(unwrap(res));
  }

  async unarchiveProject(id: string): Promise<Project> {
    const res = await axiosInstance.patch<ApiResponse<Project>>(API_ROUTES.PROJECTS.UNARCHIVE(id));
    return normalizeProject(unwrap(res));
  }

  async deleteProject(id: string): Promise<void> {
    await axiosInstance.delete(API_ROUTES.PROJECTS.DELETE(id));
  }

  // ── Lists (columnas Kanban) ─────────────────────────────────────────────

  async getLists(projectId: string): Promise<BoardList[]> {
    const res = await axiosInstance.get<ApiResponse<BoardList[]>>(
      API_ROUTES.LISTS.BY_PROJECT(projectId),
    );
    return unwrap(res);
  }

  async createList(projectId: string, payload: CreateListPayload): Promise<BoardList> {
    const res = await axiosInstance.post<ApiResponse<BoardList>>(
      API_ROUTES.LISTS.BY_PROJECT(projectId),
      payload,
    );
    return unwrap(res);
  }

  async updateList(projectId: string, listId: string, payload: UpdateListPayload): Promise<BoardList> {
    const res = await axiosInstance.patch<ApiResponse<BoardList>>(
      API_ROUTES.LISTS.UPDATE(projectId, listId),
      payload,
    );
    return unwrap(res);
  }

  async deleteList(projectId: string, listId: string): Promise<void> {
    await axiosInstance.delete(API_ROUTES.LISTS.DELETE(projectId, listId));
  }

  // ── Tasks ───────────────────────────────────────────────────────────────

  async getTasks(projectId: string): Promise<BoardTask[]> {
    const res = await axiosInstance.get<ApiResponse<BoardTask[]>>(
      API_ROUTES.TASKS.LIST(projectId),
    );
    return unwrap(res);
  }

  async createTask(projectId: string, payload: CreateTaskPayload): Promise<BoardTask> {
    const res = await axiosInstance.post<ApiResponse<BoardTask>>(
      API_ROUTES.TASKS.CREATE(projectId),
      payload,
    );
    return unwrap(res);
  }

  async updateTask(
    projectId: string,
    taskId: string,
    payload: UpdateTaskPayload,
  ): Promise<BoardTask> {
    const res = await axiosInstance.patch<ApiResponse<BoardTask>>(
      API_ROUTES.TASKS.UPDATE(projectId, taskId),
      payload,
    );
    return unwrap(res);
  }

  async deleteTask(projectId: string, taskId: string): Promise<void> {
    await axiosInstance.delete(API_ROUTES.TASKS.DELETE(projectId, taskId));
  }

  async getPriorities(projectId: string): Promise<BoardPriority[]> {
    const res = await axiosInstance.get<ApiResponse<BoardPriority[]>>(
      API_ROUTES.TASKS.PRIORITIES(projectId),
    );
    return unwrap(res);
  }

  async moveTask(projectId: string, taskId: string, payload: MoveTaskPayload): Promise<BoardTask> {
    const res = await axiosInstance.patch<ApiResponse<BoardTask>>(
      API_ROUTES.TASKS.MOVE(projectId, taskId),
      payload,
    );
    return unwrap(res);
  }

  // ── Labels ──────────────────────────────────────────────────────────────

  async getLabels(projectId: string): Promise<BoardLabel[]> {
    const res = await axiosInstance.get<ApiResponse<BoardLabel[]>>(
      API_ROUTES.LABELS.BY_PROJECT(projectId),
    );
    return unwrap(res);
  }

  async createLabel(projectId: string, payload: CreateLabelPayload): Promise<BoardLabel> {
    const res = await axiosInstance.post<ApiResponse<BoardLabel>>(
      API_ROUTES.LABELS.BY_PROJECT(projectId),
      payload,
    );
    return unwrap(res);
  }

  async updateLabel(projectId: string, labelId: string, payload: UpdateLabelPayload): Promise<BoardLabel> {
    const res = await axiosInstance.patch<ApiResponse<BoardLabel>>(
      API_ROUTES.LABELS.UPDATE(projectId, labelId),
      payload,
    );
    return unwrap(res);
  }

  async deleteLabel(projectId: string, labelId: string): Promise<void> {
    await axiosInstance.delete(API_ROUTES.LABELS.DELETE(projectId, labelId));
  }

  // ── Members ─────────────────────────────────────────────────────────────

  async getMembers(projectId: string): Promise<BoardMember[]> {
    const res = await axiosInstance.get<ApiResponse<BoardMember[]>>(
      API_ROUTES.MEMBERS.BY_PROJECT(projectId),
    );
    const members = unwrap(res);

    let users: BoardUser[] = [];
    try {
      users = await this.getAllUsers();
    } catch {
      users = [];
    }

    return members.map((member) => ({
      ...member,
      user:
        member.user ??
        users.find((user) => user.id === member.userId) ??
        fallbackUser(member.userId),
    }));
  }

  async addMember(projectId: string, payload: AddMemberPayload): Promise<BoardMember> {
    const res = await axiosInstance.post<ApiResponse<BoardMember>>(
      API_ROUTES.MEMBERS.BY_PROJECT(projectId),
      payload,
    );
    return unwrap(res);
  }

  async getAvailablePermissions(projectId: string): Promise<BoardPermission[]> {
    const res = await axiosInstance.get<ApiResponse<BoardPermission[]>>(
      API_ROUTES.MEMBERS.AVAILABLE_PERMISSIONS(projectId),
    );
    return unwrap(res);
  }

  async assignMemberPermission(
    projectId: string,
    userId: string,
    permissionId: string,
  ): Promise<void> {
    await axiosInstance.post(API_ROUTES.MEMBERS.MEMBER_PERMISSIONS(projectId, userId), {
      permissionId,
    });
  }

  // ── Users (búsqueda para el wizard) ────────────────────────────────────

  async getAllUsers(): Promise<BoardUser[]> {
    const res = await axiosInstance.get<ApiResponse<BoardUser[]>>(API_ROUTES.USERS.LIST);
    return unwrap(res);
  }
}

export const boardApi = new BoardApi();
