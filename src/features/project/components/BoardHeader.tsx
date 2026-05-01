/**
 * BoardHeader.tsx
 * Header del tablero Kanban.
 * Contiene: nombre del proyecto, breadcrumb, búsqueda, filtros (Prioridad, Etiqueta, Miembro),
 * y botones Miembros + Configuración.
 */

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/shared/components/Input';
import { Button } from '@/shared/components/Button';
import { useBoardStore } from '../store/boardStore';
import type { BoardLabel, BoardMember } from '../types/board.types';

interface BoardHeaderProps {
  projectName: string;
  labels: BoardLabel[];
  members: BoardMember[];
  onCreateTaskClick?: () => void;
  onMembersClick?: () => void;
  onSettingsClick?: () => void;
}

// ── FilterBadge: pill de filtro activo ───────────────────────────────────────

const FilterBadge = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-500/30 bg-accent-500/10 px-3 py-1.5 text-xs font-semibold text-accent-300">
    {label}
    <button
      type="button"
      onClick={onRemove}
      className="rounded-full p-0.5 text-accent-300/70 hover:bg-accent-400/10 hover:text-accent-200 transition-colors"
      aria-label={`Eliminar filtro ${label}`}
    >
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </span>
);

// ── Dropdown genérico ────────────────────────────────────────────────────────

interface FilterDropdownProps {
  label: string;
  isActive: boolean;
  children: React.ReactNode;
}

const FilterDropdown = ({ label, isActive, children }: FilterDropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={[
          'inline-flex h-10 items-center gap-2 rounded-xl border px-3.5 text-sm font-semibold transition-all duration-200',
          isActive
            ? 'border-accent-500/50 bg-accent-500/10 text-accent-300 shadow-sm shadow-accent-500/10'
            : 'border-surface-700/50 bg-surface-900/80 text-surface-300 hover:border-surface-600 hover:bg-surface-800 hover:text-white',
        ].join(' ')}
      >
        {label}
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full mt-2 left-0 z-30 min-w-[220px] overflow-hidden rounded-2xl border border-surface-700/60 bg-surface-900 shadow-2xl shadow-black/40">
          <div onClick={() => setOpen(false)}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

const getMemberName = (member: BoardMember) => {
  const fullName = `${member.user?.firstName ?? ''} ${member.user?.lastName ?? ''}`.trim();
  return fullName || member.user?.email || `Usuario ${member.userId.slice(0, 8)}`;
};

const getMemberInitials = (member: BoardMember) => {
  const first = member.user?.firstName?.[0] ?? '';
  const last = member.user?.lastName?.[0] ?? '';
  const initials = `${first}${last}`.toUpperCase();
  return initials || member.user?.email?.[0]?.toUpperCase() || '?';
};

// ── BoardHeader ───────────────────────────────────────────────────────────────

export const BoardHeader = ({
  projectName,
  labels,
  members,
  onCreateTaskClick,
  onMembersClick,
  onSettingsClick,
}: BoardHeaderProps) => {
  const { filters, setFilter, resetFilters } = useBoardStore();

  const hasActiveFilters =
    filters.search || filters.labelId || filters.assigneeId || filters.priority;
  const activeMember = filters.assigneeId
    ? members.find((member) => member.userId === filters.assigneeId)
    : undefined;

  return (
    <div className="space-y-3 mb-6">
      {/* ── Fila 1: Nombre + acciones ────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">{projectName}</h1>
          <nav className="flex items-center gap-1.5 mt-0.5 text-xs text-surface-500">
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-surface-400">Tablero Kanban</span>
          </nav>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            onClick={onCreateTaskClick}
            leftIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            Nueva tarea
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={onMembersClick}
            leftIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          >
            Miembros
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onSettingsClick}
            leftIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          >
            Configuración
          </Button>
        </div>
      </div>

      {/* ── Fila 2: Búsqueda + Filtros ───────────────────────────────── */}
      <div className="rounded-2xl border border-surface-700/40 bg-surface-900/60 p-3 shadow-lg shadow-black/10">
        <div className="flex flex-wrap items-center gap-2.5">
        {/* Búsqueda */}
        <div className="w-full sm:w-72">
          <Input
            placeholder="Buscar tareas..."
            value={filters.search}
            onChange={(e) => setFilter('search', e.target.value)}
            className="h-10 border-surface-700/60 bg-surface-950/70 py-2 text-sm"
            leftIcon={
              <svg className="w-4 h-4 text-surface-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1 0 5 5a7.5 7.5 0 0 0 11.65 11.65z" />
              </svg>
            }
          />
        </div>

        {/* Filtro: Etiquetas */}
        <FilterDropdown
          label="Etiquetas"
          isActive={!!filters.labelId}
        >
          <div className="py-1">
            <button
              className="w-full px-3 py-2.5 text-left text-sm text-surface-400 hover:bg-surface-800 hover:text-white transition-colors"
              onClick={() => setFilter('labelId', null)}
            >
              Todas las etiquetas
            </button>
            {labels.map((label) => (
              <button
                key={label.id}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-surface-800 transition-colors"
                onClick={() => setFilter('labelId', label.id)}
              >
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: label.color }}
                />
                <span className="text-surface-200">{label.name}</span>
              </button>
            ))}
            {labels.length === 0 && (
              <p className="px-3 py-2 text-xs text-surface-500">Sin etiquetas</p>
            )}
          </div>
        </FilterDropdown>

        {/* Filtro: Miembro */}
        <FilterDropdown
          label="Miembro"
          isActive={!!filters.assigneeId}
        >
          <div className="py-1">
            <button
              className="w-full px-3 py-2.5 text-left text-sm text-surface-400 hover:bg-surface-800 hover:text-white transition-colors"
              onClick={() => setFilter('assigneeId', null)}
            >
              Todos los miembros
            </button>
            {members.map((member) => (
              <button
                key={member.userId}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-surface-800 transition-colors"
                onClick={() => setFilter('assigneeId', member.userId)}
              >
                <div className="w-6 h-6 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-[9px] font-bold text-brand-300 shrink-0">
                  {getMemberInitials(member)}
                </div>
                <span className="text-sm text-surface-200 truncate">
                  {getMemberName(member)}
                </span>
              </button>
            ))}
          </div>
        </FilterDropdown>

        {/* Limpiar filtros */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="ml-auto rounded-lg px-2.5 py-2 text-xs font-semibold text-surface-500 hover:bg-surface-800 hover:text-surface-300 transition-colors"
          >
            Limpiar filtros
          </button>
        )}
        </div>
      </div>

      {/* ── Fila 3: Chips de filtros activos ─────────────────────────── */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 px-1">
          {filters.assigneeId && (
            <FilterBadge
              label={
                activeMember ? getMemberName(activeMember) : filters.assigneeId
              }
              onRemove={() => setFilter('assigneeId', null)}
            />
          )}
          {filters.labelId && (
            <FilterBadge
              label={
                labels.find((l) => l.id === filters.labelId)?.name ?? 'Etiqueta'
              }
              onRemove={() => setFilter('labelId', null)}
            />
          )}
        </div>
      )}
    </div>
  );
};
