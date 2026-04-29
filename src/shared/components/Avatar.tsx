/**
 * Avatar — Atom
 * Fallback a iniciales cuando no hay imagen
 * Sizes: xs | sm | md | lg | xl
 *
 * También exporta AvatarGroup desde este mismo archivo.
 * Importación recomendada:
 *   import { Avatar, AvatarGroup } from '@/shared/components/Avatar';
 */

import { type HTMLAttributes, useState } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// Avatar
// ═══════════════════════════════════════════════════════════════════════════

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'brand' | 'accent' | 'cta' | 'violet' | 'surface';
  /** Muestra un indicador de estado online */
  status?: 'online' | 'away' | 'busy' | 'offline';
}

const sizeClasses: Record<NonNullable<AvatarProps['size']>, string> = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
};

const statusSizeClasses: Record<NonNullable<AvatarProps['size']>, string> = {
  xs: 'w-1.5 h-1.5 border',
  sm: 'w-2 h-2 border',
  md: 'w-2.5 h-2.5 border-2',
  lg: 'w-3 h-3 border-2',
  xl: 'w-3.5 h-3.5 border-2',
};

const colorClasses: Record<NonNullable<AvatarProps['color']>, string> = {
  brand:   'bg-brand-500/20 text-brand-300 border-brand-500/30',
  accent:  'bg-accent-500/20 text-accent-300 border-accent-500/30',
  cta:     'bg-cta-500/20 text-cta-300 border-cta-500/30',
  violet:  'bg-violet-500/20 text-violet-300 border-violet-500/30',
  surface: 'bg-surface-700 text-surface-300 border-surface-600',
};

const statusColors: Record<NonNullable<AvatarProps['status']>, string> = {
  online:  'bg-cta-400',
  away:    'bg-amber-400',
  busy:    'bg-red-400',
  offline: 'bg-surface-500',
};

function getInitials(name?: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const Avatar = ({
  src,
  alt,
  name,
  size = 'md',
  color = 'surface',
  status,
  className = '',
  ...rest
}: AvatarProps) => {
  const [imgError, setImgError] = useState(false);
  const showImg = src && !imgError;

  return (
    <div className={`relative inline-flex shrink-0 ${className}`} {...rest}>
      <div
        className={[
          'rounded-full overflow-hidden flex items-center justify-center font-semibold border',
          sizeClasses[size],
          showImg ? 'border-surface-700/50' : colorClasses[color],
        ]
          .filter(Boolean)
          .join(' ')}
        aria-label={name ?? alt ?? 'Avatar'}
        role="img"
      >
        {showImg ? (
          <img
            src={src}
            alt={alt ?? name ?? ''}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span aria-hidden="true">{getInitials(name)}</span>
        )}
      </div>

      {status && (
        <span
          className={[
            'absolute bottom-0 right-0 rounded-full border-surface-950',
            statusSizeClasses[size],
            statusColors[status],
          ].join(' ')}
          aria-label={`Estado: ${status}`}
        />
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// AvatarGroup — Molecule (co-ubicado con Avatar para un solo import)
//
// Uso:
//   import { Avatar, AvatarGroup } from '@/shared/components/Avatar';
//
//   <AvatarGroup
//     users={[
//       { name: 'Ana López',    color: 'brand'  },
//       { name: 'Carlos Ruiz',  color: 'accent' },
//       { name: 'María Torres', color: 'violet' },
//     ]}
//     max={3}
//     size="sm"
//     spacing="normal"
//   />
// ═══════════════════════════════════════════════════════════════════════════

export type AvatarUser = Pick<AvatarProps, 'src' | 'alt' | 'name' | 'color' | 'status'>;

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  users: AvatarUser[];
  /** Máximo de avatares visibles antes del conteo "+N" */
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  spacing?: 'tight' | 'normal' | 'loose';
  /** Label accesible del grupo */
  label?: string;
}

const spacingClasses: Record<NonNullable<AvatarGroupProps['spacing']>, string> = {
  tight:  '-space-x-3',
  normal: '-space-x-2',
  loose:  '-space-x-1',
};

const overflowSizeClasses: Record<NonNullable<AvatarGroupProps['size']>, string> = {
  xs: 'w-6 h-6 text-[9px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-sm',
};

export const AvatarGroup = ({
  users,
  max = 4,
  size = 'sm',
  spacing = 'normal',
  label,
  className = '',
  ...rest
}: AvatarGroupProps) => {
  const visible  = users.slice(0, max);
  const overflow = users.length - max;

  const ariaLabel =
    label ?? users.map((u) => u.name ?? u.alt ?? 'Usuario').join(', ');

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