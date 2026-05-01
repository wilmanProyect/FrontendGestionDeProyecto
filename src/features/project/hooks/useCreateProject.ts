/**
 * useCreateProject.ts
 * Orquesta la creacion completa de un proyecto en el wizard:
 *   1. Crea el proyecto -> POST /projects
 *   2. Crea listas y labels iniciales
 *   3. Agrega miembros
 *   4. Asigna permisos seleccionados a cada miembro
 */

import { useState } from 'react';
import { useAuthStore } from '@/features/auth/store/authStore';
import { boardApi } from '../api/boardApi';
import type { WizardFormState } from '../types/board.types';

type ApiLikeError = {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
};

const getErrorMessage = (err: unknown) => {
  const apiError = err as ApiLikeError;
  return apiError.response?.data?.message ?? apiError.message ?? 'Error al crear el proyecto';
};

export const useCreateProject = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitWizard = async (form: WizardFormState): Promise<string | null> => {
    if (!form.name.trim()) {
      setError('El nombre del proyecto es obligatorio');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const project = await boardApi.createProject({
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
      });

      for (const list of form.lists) {
        await boardApi.createList(project.id, { name: list.name });
      }

      await Promise.all(
        form.labels.map((label) =>
          boardApi.createLabel(project.id, { name: label.name, color: label.color }),
        ),
      );

      const currentUserId = useAuthStore.getState().user?.id;
      const membersToAdd = form.members.filter((member) => member.user.id !== currentUserId);
      const selectedPermissionNames = Array.from(
        new Set(membersToAdd.flatMap((member) => member.permissionNames)),
      );
      const availablePermissions = selectedPermissionNames.length > 0
        ? await boardApi.getAvailablePermissions(project.id)
        : [];
      const permissionByName = new Map(
        availablePermissions.map((permission) => [permission.name, permission.id]),
      );

      for (const member of membersToAdd) {
        await boardApi.addMember(project.id, {
          userId: member.user.id,
          role: member.role,
        });

        for (const permissionName of member.permissionNames) {
          const permissionId = permissionByName.get(permissionName);
          if (permissionId) {
            await boardApi.assignMemberPermission(project.id, member.user.id, permissionId);
          }
        }
      }

      return project.id;
    } catch (err: unknown) {
      setError(getErrorMessage(err));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { submitWizard, isLoading, error };
};
