/**
 * AvatarGroup — Molecule
 * Grupo de avatares apilados para mostrar múltiples asignados en una tarea Kanban.
 *
 * Uso:
 *   <AvatarGroup
 *     users={[
 *       { name: 'Ana López', src: '/avatars/ana.jpg' },
 *       { name: 'Carlos Ruiz' },
 *       { name: 'María Torres', color: 'violet' },
 *     ]}
 *     max={3}
 *   />
 *
 * Props:
 *   max       — cuántos avatares mostrar antes del "+N"
 *   size      — xs | sm | md | lg
 *   spacing   — separación entre avatares (tight | normal | loose)
 */

import { type HTMLAttributes } from 'react';
import { Avatar, type AvatarProps } from './Avatar';

// ── Tipos ──────────────────────────────────────────────────────────────────

export type AvatarUser = Pick<AvatarProps, 'src' | 'alt' | 'name' | 'color' | 'status'>;

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  users: AvatarUser[];
  /** Máximo de avatares visibles antes del conteo "+N" */
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  spacing?: 'tight' | 'normal' | 'loose';
  /** Tooltip del grupo (accesibilidad) */
  label?: string;
}

// ── Mapas ──────────────────────────────────────────────────────────────────

const spacingClasses: Record<NonNullable<AvatarGroupProps['spacing']>, string> = {
  tight:  '-space-x-3',
  normal: '-space-x-2',
  loose:  '-space-x-1',
};

/** Tamaño del badge "+N" acorde al tamaño de avatar */
const overflowSizeClasses: Record<NonNullable<AvatarGroupProps['size']>, string> = {
  xs: 'w-6 h-6 text-[9px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-sm',
};

// ── Componente ─────────────────────────────────────────────────────────────

export const AvatarGroup = ({
  users,
  max = 4,
  size = 'sm',
  spacing = 'normal',
  label,
  className = '',
  ...rest
}: AvatarGroupProps) => {
  const visible = users.slice(0, max);
  const overflow = users.length - max;

  const ariaLabel =
    label ??
    users.map((u) => u.name ?? u.alt ?? 'Usuario').join(', ');

  return (
    <div
      className={`flex items-center ${spacingClasses[spacing]} ${className}`}
      role="group"
      aria-label={ariaLabel}
      {...rest}
    >
      {visible.map((user, idx) => (
        <div
          key={idx}
          className="ring-2 ring-surface-950 rounded-full"
          style={{ zIndex: visible.length - idx }}
        >
          <Avatar
            src={user.src}
            alt={user.alt}
            name={user.name}
            size={size}
            color={user.color}
            status={user.status}
          />
        </div>
      ))}

      {overflow > 0 && (
        <div
          className={[
            'ring-2 ring-surface-950 rounded-full',
            'inline-flex items-center justify-center',
            'bg-surface-700 border border-surface-600 font-semibold text-surface-300',
            overflowSizeClasses[size],
          ].join(' ')}
          aria-label={`y ${overflow} más`}
          title={`y ${overflow} más`}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
};
