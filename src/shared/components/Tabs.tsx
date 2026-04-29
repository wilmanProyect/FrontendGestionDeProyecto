/**
 * Tabs — Molecule
 * Navegación por pestañas. Ideal para cambiar entre vistas del Kanban:
 * Tablero / Lista / Calendario / Línea de tiempo.
 *
 * Uso:
 *   const [active, setActive] = useState('board');
 *
 *   <Tabs
 *     tabs={[
 *       { id: 'board',    label: 'Tablero',   icon: <KanbanIcon /> },
 *       { id: 'list',     label: 'Lista' },
 *       { id: 'calendar', label: 'Calendario', badge: 3 },
 *     ]}
 *     active={active}
 *     onChange={setActive}
 *   />
 *
 * Variantes: underline | pills | segmented
 */

import type { ReactNode } from 'react';

// ── Tipos ──────────────────────────────────────────────────────────────────

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: number;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  active: string;
  onChange: (id: string) => void;
  variant?: 'underline' | 'pills' | 'segmented';
  size?: 'sm' | 'md';
  className?: string;
  /** Slot de contenido opcional al lado derecho */
  rightSlot?: ReactNode;
}

// ── Variante: Underline (default) ──────────────────────────────────────────

const UnderlineTabs = ({ tabs, active, onChange, size, rightSlot, className }: TabsProps) => {
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';
  const py = size === 'sm' ? 'py-2' : 'py-2.5';

  return (
    <div className={`flex items-center border-b border-surface-700/50 ${className ?? ''}`}>
      <nav className="flex flex-1 gap-0" role="tablist" aria-orientation="horizontal">
        {tabs.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              disabled={tab.disabled}
              onClick={() => !tab.disabled && onChange(tab.id)}
              className={[
                `relative inline-flex items-center gap-2 px-4 ${py} ${textSize} font-medium`,
                'transition-colors duration-200 focus:outline-none',
                'border-b-2 -mb-px',
                isActive
                  ? 'border-brand-500 text-white'
                  : 'border-transparent text-surface-400 hover:text-surface-200 hover:border-surface-600',
                tab.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {tab.icon && (
                <span
                  className={`shrink-0 ${isActive ? 'text-brand-400' : 'text-surface-500'}`}
                  aria-hidden="true"
                >
                  {tab.icon}
                </span>
              )}
              {tab.label}
              {tab.badge !== undefined && (
                <span
                  className={[
                    'inline-flex items-center justify-center rounded-full text-[10px] font-bold w-4 h-4',
                    isActive
                      ? 'bg-brand-500 text-white'
                      : 'bg-surface-700 text-surface-300',
                  ].join(' ')}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {rightSlot && (
        <div className="ml-auto pl-4 shrink-0">{rightSlot}</div>
      )}
    </div>
  );
};

// ── Variante: Pills ────────────────────────────────────────────────────────

const PillsTabs = ({ tabs, active, onChange, size, rightSlot, className }: TabsProps) => {
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';
  const px = size === 'sm' ? 'px-3 py-1' : 'px-4 py-1.5';

  return (
    <div className={`flex items-center gap-4 ${className ?? ''}`}>
      <nav className="flex flex-1 gap-1.5 flex-wrap" role="tablist">
        {tabs.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              disabled={tab.disabled}
              onClick={() => !tab.disabled && onChange(tab.id)}
              className={[
                `inline-flex items-center gap-2 rounded-xl ${px} ${textSize} font-medium`,
                'border transition-all duration-200 focus:outline-none',
                isActive
                  ? 'bg-brand-500/20 border-brand-500/40 text-white'
                  : 'border-transparent text-surface-400 hover:bg-surface-800 hover:text-white',
                tab.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {tab.icon && (
                <span
                  className={`shrink-0 ${isActive ? 'text-brand-400' : 'text-surface-500'}`}
                  aria-hidden="true"
                >
                  {tab.icon}
                </span>
              )}
              {tab.label}
              {tab.badge !== undefined && (
                <span
                  className={[
                    'inline-flex items-center justify-center rounded-full text-[10px] font-bold w-4 h-4',
                    isActive ? 'bg-brand-500 text-white' : 'bg-surface-700 text-surface-300',
                  ].join(' ')}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {rightSlot && <div className="ml-auto shrink-0">{rightSlot}</div>}
    </div>
  );
};

// ── Variante: Segmented (tipo toggle group) ────────────────────────────────

const SegmentedTabs = ({ tabs, active, onChange, size, rightSlot, className }: TabsProps) => {
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';
  const py = size === 'sm' ? 'py-1 px-2.5' : 'py-1.5 px-3';

  return (
    <div className={`flex items-center gap-4 ${className ?? ''}`}>
      <div
        role="tablist"
        className="inline-flex rounded-xl border border-surface-700/50 bg-surface-900/80 p-1 gap-0.5"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              disabled={tab.disabled}
              onClick={() => !tab.disabled && onChange(tab.id)}
              className={[
                `inline-flex items-center gap-1.5 rounded-lg ${py} ${textSize} font-medium`,
                'transition-all duration-200 focus:outline-none',
                isActive
                  ? 'bg-surface-700 text-white shadow-sm'
                  : 'text-surface-400 hover:text-white',
                tab.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {tab.icon && (
                <span
                  className={`shrink-0 ${isActive ? 'text-accent-400' : 'text-surface-500'}`}
                  aria-hidden="true"
                >
                  {tab.icon}
                </span>
              )}
              {tab.label}
            </button>
          );
        })}
      </div>

      {rightSlot && <div className="ml-auto shrink-0">{rightSlot}</div>}
    </div>
  );
};

// ── TabPanel — contenedor del contenido de cada pestaña ───────────────────

export interface TabPanelProps {
  id: string;
  active: string;
  children: ReactNode;
  className?: string;
}

export const TabPanel = ({ id, active, children, className = '' }: TabPanelProps) => {
  if (id !== active) return null;
  return (
    <div
      role="tabpanel"
      id={`tabpanel-${id}`}
      aria-labelledby={id}
      className={className}
    >
      {children}
    </div>
  );
};

// ── Componente principal ───────────────────────────────────────────────────

export const Tabs = (props: TabsProps) => {
  const { variant = 'underline' } = props;

  if (variant === 'pills') return <PillsTabs {...props} />;
  if (variant === 'segmented') return <SegmentedTabs {...props} />;
  return <UnderlineTabs {...props} />;
};
