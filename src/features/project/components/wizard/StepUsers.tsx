/**
 * StepUsers.tsx
 * Paso 2 del wizard: busqueda de usuarios, rol y permisos por miembro.
 */

import { useState, useEffect, useMemo, useRef } from 'react';
import { useAuthStore } from '@/features/auth/store/authStore';
import { boardApi } from '../../api/boardApi';
import { ProjectRole } from '../../types/board.types';
import type { WizardFormState, WizardMember, BoardUser } from '../../types/board.types';

const ROLE_OPTIONS: { value: ProjectRole; label: string }[] = [
  { value: ProjectRole.ADMIN, label: 'Admin' },
  { value: ProjectRole.MEMBER, label: 'Editor' },
  { value: ProjectRole.VIEWER, label: 'Viewer' },
];

const PERMISSION_OPTIONS = [
  { name: 'projects.read', label: 'Ver proyectos y tareas' },
  { name: 'projects.write', label: 'Crear/editar proyectos y tareas' },
  { name: 'projects.delete', label: 'Eliminar proyectos y tareas' },
  { name: 'reports.generate', label: 'Generar reportes' },
  { name: 'permissions.read', label: 'Ver permisos disponibles' },
  { name: 'permissions.write', label: 'Asignar/revocar permisos' },
];

const DEFAULT_PERMISSIONS_BY_ROLE: Record<ProjectRole, string[]> = {
  [ProjectRole.OWNER]: PERMISSION_OPTIONS.map((permission) => permission.name),
  [ProjectRole.ADMIN]: [
    'projects.read',
    'projects.write',
    'projects.delete',
    'reports.generate',
    'permissions.read',
  ],
  [ProjectRole.MEMBER]: ['projects.read', 'projects.write', 'reports.generate'],
  [ProjectRole.VIEWER]: ['projects.read'],
};

interface StepUsersProps {
  form: WizardFormState;
  onChange: (patch: Partial<WizardFormState>) => void;
}

export const StepUsers = ({ form, onChange }: StepUsersProps) => {
  const currentUser = useAuthStore((state) => state.user);
  const [search, setSearch] = useState('');
  const [allUsers, setAllUsers] = useState<BoardUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [activePermUserId, setActivePermUserId] = useState<string | null>(null);
  const didLoadUsers = useRef(false);

  useEffect(() => {
    if (didLoadUsers.current) return;
    didLoadUsers.current = true;

    setLoadingUsers(true);
    setUsersError(null);
    boardApi.getAllUsers()
      .then((users) => setAllUsers(users.filter((user) => user.id !== currentUser?.id)))
      .catch(() => {
        setAllUsers([]);
        setUsersError('No pude cargar usuarios. Revisa que el backend este activo y que tu usuario tenga permiso users.read.');
      })
      .finally(() => setLoadingUsers(false));
  }, [currentUser?.id]);

  const addedIds = useMemo(
    () => new Set([currentUser?.id, ...form.members.map((member) => member.user.id)].filter(Boolean)),
    [currentUser?.id, form.members],
  );

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase();
    const availableUsers = allUsers.filter((user) => !addedIds.has(user.id));

    if (!search.trim()) return availableUsers.slice(0, 6);

    return availableUsers
      .filter((user) =>
        user.firstName.toLowerCase().includes(q) ||
        user.lastName.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q),
      )
      .slice(0, 6);
  }, [search, allUsers, addedIds]);

  const patchMember = (userId: string, patch: Partial<WizardMember>) =>
    onChange({
      members: form.members.map((member) =>
        member.user.id === userId ? { ...member, ...patch } : member,
      ),
    });

  const addMember = (user: BoardUser) => {
    const role = ProjectRole.MEMBER;
    onChange({
      members: [
        ...form.members,
        { user, role, permissionNames: DEFAULT_PERMISSIONS_BY_ROLE[role] },
      ],
    });
    setSearch('');
  };

  const removeMember = (userId: string) => {
    onChange({ members: form.members.filter((member) => member.user.id !== userId) });
    if (activePermUserId === userId) setActivePermUserId(null);
  };

  const updateRole = (userId: string, role: ProjectRole) => {
    patchMember(userId, {
      role,
      permissionNames: DEFAULT_PERMISSIONS_BY_ROLE[role],
    });
  };

  const togglePermission = (userId: string, permissionName: string, checked: boolean) => {
    const member = form.members.find((item) => item.user.id === userId);
    if (!member) return;

    const nextPermissions = checked
      ? Array.from(new Set([...member.permissionNames, permissionName]))
      : member.permissionNames.filter((name) => name !== permissionName);

    patchMember(userId, { permissionNames: nextPermissions });
  };

  const getInitials = (user: BoardUser) =>
    `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase() || '?';

  const activeMember = form.members.find((member) => member.user.id === activePermUserId);

  return (
    <div className="flex gap-5">
      <div className="flex-1 min-w-0 space-y-4">
        <p className="text-sm font-semibold text-white">Agregar usuarios</p>

        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1 0 5 5a7.5 7.5 0 0 0 11.65 11.65z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar o seleccionar usuario..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-surface-600/40 bg-surface-900 pl-9 pr-4 py-2.5 text-sm text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
          />

          {filteredUsers.length > 0 && (
            <div className="absolute top-full mt-1 left-0 right-0 z-20 rounded-xl border border-surface-700/50 bg-surface-900 shadow-xl overflow-hidden">
              {filteredUsers.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => addMember(user)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-surface-800 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-xs font-bold text-brand-300 shrink-0">
                    {getInitials(user)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-white font-medium truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-surface-400 truncate">{user.email}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {search.trim() && filteredUsers.length === 0 && !loadingUsers && (
            <div className="absolute top-full mt-1 left-0 right-0 z-20 rounded-xl border border-surface-700/50 bg-surface-900 px-4 py-3 text-sm text-surface-400">
              {usersError ?? 'No se encontraron usuarios'}
            </div>
          )}
        </div>

        {loadingUsers && (
          <p className="text-xs text-surface-500">Cargando usuarios...</p>
        )}

        {usersError && !search.trim() && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
            {usersError}
          </div>
        )}

        <div className="space-y-2">
          {form.members.length === 0 && (
            <p className="text-xs text-surface-500 py-2">
              Aun no has agregado ningun miembro. Puedes hacerlo despues.
            </p>
          )}

          {form.members.map((member) => (
            <div
              key={member.user.id}
              className="flex items-center gap-3 rounded-xl border border-surface-700/30 bg-surface-800/40 px-3 py-2.5"
            >
              <div className="w-8 h-8 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-xs font-bold text-brand-300 shrink-0">
                {getInitials(member.user)}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium truncate">
                  {member.user.firstName} {member.user.lastName}
                </p>
                <p className="text-xs text-surface-400 truncate">{member.user.email}</p>
              </div>

              <select
                value={member.role}
                onChange={(e) => updateRole(member.user.id, e.target.value as ProjectRole)}
                className="rounded-lg border border-surface-600/40 bg-surface-900 px-2 py-1.5 text-xs text-surface-200 focus:outline-none focus:ring-1 focus:ring-brand-500/50 transition-all"
              >
                {ROLE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>

              <button
                type="button"
                title="Editar permisos"
                onClick={() =>
                  setActivePermUserId(activePermUserId === member.user.id ? null : member.user.id)
                }
                className={[
                  'flex items-center justify-center w-8 h-8 rounded-lg border transition-all',
                  activePermUserId === member.user.id
                    ? 'border-brand-500 bg-brand-500 text-white'
                    : 'border-surface-600/40 bg-surface-900 text-surface-400 hover:text-white hover:border-brand-500/50',
                ].join(' ')}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => removeMember(member.user.id)}
                className="flex items-center justify-center w-8 h-8 rounded-lg border border-surface-600/40 bg-surface-900 text-surface-400 hover:text-red-400 hover:border-red-500/30 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {activeMember && (
        <div className="w-64 shrink-0 rounded-xl border border-surface-700/30 bg-surface-800/40 p-3 space-y-2">
          <p className="text-xs font-semibold text-surface-300 mb-3">
            Permisos de {activeMember.user.firstName}
          </p>
          {PERMISSION_OPTIONS.map((permission) => (
            <label key={permission.name} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={activeMember.permissionNames.includes(permission.name)}
                onChange={(e) =>
                  togglePermission(activeMember.user.id, permission.name, e.target.checked)
                }
                className="w-3.5 h-3.5 rounded border-surface-600 bg-surface-900 text-brand-500 focus:ring-brand-500/30"
              />
              <span className="text-[11px] text-surface-400 group-hover:text-surface-200 transition-colors leading-tight">
                {permission.label}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};
