/**
 * Sidebar — CodeForge Technical Branding
 * Basado en "Interface Gradient" (Deep Space → #1E293B)
 * Colapsable, con búsqueda, navegación y sección de proyectos
 */

import { useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { boardApi } from '@/features/project/api/boardApi';
import type { Project } from '@/features/project/types/board.types';

// ── Tipos ──────────────────────────────────────────────────────────────────
interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
  toggle?: boolean;
}

// ── Iconos inline ──────────────────────────────────────────────────────────
const Icon = {
  Dashboard: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  Tasks: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  Bell: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  Search: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Settings: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Help: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  ChevronLeft: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  ),
  ChevronRight: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  ChevronDown: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  ),
  Components: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  Folder: ({ color }: { color: string }) => (
    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
  ),
  Logout: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
};

// ── Datos de navegación ────────────────────────────────────────────────────
const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <Icon.Dashboard />, href: '/dashboard' },
  { id: 'tasks',     label: 'Mis Tareas', icon: <Icon.Tasks />,    href: '/tasks', badge: 3 },
  { id: 'notif',     label: 'Notificaciones', icon: <Icon.Bell />, href: '/notifications', toggle: true },
];

const PROJECT_COLORS = [
  '#0052FF',
  '#00C2FF',
  '#6366F1',
  '#14B8A6',
  '#F59E0B',
  '#EC4899',
];

const getProjectColor = (projectId: string) => {
  const savedColor = localStorage.getItem(`project-color:${projectId}`);
  if (savedColor) return savedColor;

  const hash = Array.from(projectId).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return PROJECT_COLORS[hash % PROJECT_COLORS.length];
};

// ── Componente principal ───────────────────────────────────────────────────
export const Sidebar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [openProjects, setOpenProjects] = useState<Record<string, boolean>>({});
  const [componentsOpen, setComponentsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState<string | null>(null);
  const [, setProjectColorVersion] = useState(0);

  const isActive = (href: string) => location.pathname === href;

  useEffect(() => {
    let mounted = true;

    const loadProjects = async () => {
      setProjectsLoading(true);
      setProjectsError(null);

      try {
        const data = await boardApi.listProjects();
        if (mounted) {
          setProjects(data.filter((project) => !project.isArchived));
        }
      } catch {
        if (mounted) {
          setProjectsError('No se pudieron cargar los proyectos');
        }
      } finally {
        if (mounted) {
          setProjectsLoading(false);
        }
      }
    };

    loadProjects();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const handleProjectColorChanged = () => {
      setProjectColorVersion((version) => version + 1);
    };

    window.addEventListener('project-color-changed', handleProjectColorChanged);
    return () => window.removeEventListener('project-color-changed', handleProjectColorChanged);
  }, []);

  const filteredProjects = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    if (!query) return projects;

    return projects.filter((project) =>
      project.name.toLowerCase().includes(query),
    );
  }, [projects, searchValue]);

  const toggleProject = (id: string) =>
    setOpenProjects((prev) => ({ ...prev, [id]: !prev[id] }));

  const goToProjectBoard = (projectId: string) => {
    navigate(`/projects/${projectId}/board`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : 'U';

  return (
    <aside
      className="flex flex-col h-screen shrink-0 transition-all duration-300 ease-in-out border-r border-surface-600/20"
      style={{
        width: collapsed ? '72px' : '256px',
        background: 'var(--gradient-interface)',
      }}
    >
      {/* ── Header: Logo + usuario ───────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-surface-600/20">
        {/* Logo */}
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-brand-500/20"
          style={{ background: 'var(--gradient-forge)' }}
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
          </svg>
        </div>

        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-white leading-tight truncate">CodeForge</p>
            <p className="text-xs text-surface-400 truncate">{user?.email ?? ''}</p>
          </div>
        )}
      </div>

      {/* ── Búsqueda ─────────────────────────────────────────────────── */}
      {!collapsed && (
        <div className="px-3 pt-4 pb-2">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-surface-500"><Icon.Search /></span>
            </div>
            <input
              type="text"
              placeholder="Buscar..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full rounded-xl border border-surface-600/30 bg-surface-800/60 pl-9 pr-3 py-2 text-sm text-white placeholder-surface-500 focus:outline-none focus:ring-1 focus:ring-accent-500/50 focus:border-accent-500/50 transition-all duration-200"
            />
          </div>
        </div>
      )}

      {collapsed && (
        <div className="px-3 pt-4 pb-2">
          <button className="w-full flex items-center justify-center rounded-xl border border-surface-600/30 bg-surface-800/60 p-2.5 text-surface-400 hover:text-accent-400 transition-colors duration-200">
            <Icon.Search />
          </button>
        </div>
      )}

      {/* ── Navegación principal ──────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1 scrollbar-none">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => item.href !== '#' && navigate(item.href)}
            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 group
              ${isActive(item.href)
                ? 'bg-brand-500/20 text-white border border-brand-500/30 shadow-sm shadow-brand-500/10'
                : 'text-surface-300 hover:bg-surface-700/50 hover:text-white border border-transparent'
              }
              ${collapsed ? 'justify-center' : ''}`}
          >
            {/* Icono — Steel Glint si activo */}
            <span className={`shrink-0 transition-colors duration-200 ${
              isActive(item.href) ? 'text-accent-400' : 'text-surface-400 group-hover:text-accent-400'
            }`}>
              {item.icon}
            </span>

            {!collapsed && (
              <>
                <span className="flex-1 text-left">{item.label}</span>

                {/* Badge */}
                {item.badge !== undefined && (
                  <span className="ml-auto inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-500 text-white text-[10px] font-bold">
                    {item.badge}
                  </span>
                )}

                {/* Toggle */}
                {item.toggle !== undefined && (
                  <span
                    role="switch"
                    tabIndex={0}
                    aria-checked={notifEnabled}
                    onClick={(e) => { e.stopPropagation(); setNotifEnabled((v) => !v); }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.stopPropagation();
                        setNotifEnabled((v) => !v);
                      }
                    }}
                    className={`ml-auto relative w-9 h-5 rounded-full transition-colors duration-200 shrink-0 ${
                      notifEnabled ? 'bg-brand-500' : 'bg-surface-600'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                        notifEnabled ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </span>
                )}
              </>
            )}
          </button>
        ))}

        {/* ── Sección Componentes Reutilizables ──────────────────────── */}
        {!collapsed && (
          <div className="pt-2">
            <button
              onClick={() => setComponentsOpen(!componentsOpen)}
              className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 border border-transparent
                ${componentsOpen ? 'bg-surface-700/30 text-white' : 'text-surface-300 hover:bg-surface-700/50 hover:text-white'}`}
            >
              <span className={`shrink-0 transition-colors duration-200 ${componentsOpen ? 'text-accent-400' : 'text-surface-400'}`}>
                <Icon.Components />
              </span>
              <span className="flex-1 text-left truncate">Componentes reutilizables</span>
              <span className={`text-surface-500 transition-transform duration-200 ${componentsOpen ? 'rotate-180' : ''}`}>
                <Icon.ChevronDown />
              </span>
            </button>

            {componentsOpen && (
              <div className="ml-5 mt-1 space-y-0.5 border-l border-surface-600/30 pl-3">
                {[
                  { name: 'Alert',        href: '/components/alert' },
                  { name: 'Avatar',       href: '/components/avatar' },
                  { name: 'AvatarGroup',  href: '/components/avatar-group' },
                  { name: 'Badge',        href: '/components/badge' },
                  { name: 'Button',       href: '/components/button' },
                  { name: 'Card',         href: '/components/card' },
                  { name: 'Dropdown',     href: '/components/dropdown' },
                  { name: 'EmptyState',   href: '/components/empty-state' },
                  { name: 'FormField',    href: '/components/form-field' },
                  { name: 'Input',        href: '/components/input' },
                  { name: 'Kanban',       href: '/components/kanban' },
                  { name: 'Modal',        href: '/components/modal' },
                  { name: 'Priority',     href: '/components/priority' },
                  { name: 'ProgressBar',  href: '/components/progress-bar' },
                  { name: 'Select',       href: '/components/select' },
                  { name: 'Skeleton',     href: '/components/skeleton' },
                  { name: 'Spinner',      href: '/components/spinner' },
                  { name: 'Tabs',         href: '/components/tabs' },
                  { name: 'Toast',        href: '/components/toast' },
                  { name: 'Toggle',       href: '/components/toggle' },
                  { name: 'Tooltip',      href: '/components/tooltip' },
                ].map((comp) => (
                  <button
                    key={comp.name}
                    onClick={() => navigate(comp.href)}
                    className="w-full text-left rounded-lg px-2 py-1.5 text-xs text-surface-400 hover:text-white hover:bg-surface-700/40 transition-all duration-150"
                  >
                    {comp.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Sección Proyectos ───────────────────────────────────────── */}
        {!collapsed && (
          <div className="pt-4">
            <p className="px-3 mb-2 text-[10px] font-semibold text-surface-500 uppercase tracking-widest">
              Proyectos
            </p>
            <div className="space-y-1">
              {projectsLoading && (
                <p className="px-3 py-2 text-xs text-surface-500">Cargando proyectos...</p>
              )}

              {!projectsLoading && projectsError && (
                <p className="px-3 py-2 text-xs text-red-300">{projectsError}</p>
              )}

              {!projectsLoading && !projectsError && filteredProjects.length === 0 && (
                <p className="px-3 py-2 text-xs text-surface-500">
                  {projects.length === 0 ? 'Aun no tienes proyectos' : 'Sin resultados'}
                </p>
              )}

              {!projectsLoading && !projectsError && filteredProjects.map((project) => (
                <div key={project.id}>
                  <button
                    onClick={() => toggleProject(project.id)}
                    className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-surface-300 hover:bg-surface-700/50 hover:text-white border border-transparent transition-all duration-200"
                  >
                    <Icon.Folder color={getProjectColor(project.id)} />
                    <span className="flex-1 text-left truncate">{project.name}</span>
                    <span className={`text-surface-500 transition-transform duration-200 ${openProjects[project.id] ? 'rotate-180' : ''}`}>
                      <Icon.ChevronDown />
                    </span>
                  </button>

                  {/* Subitems expandibles */}
                  {openProjects[project.id] && (
                    <div className="ml-5 mt-0.5 space-y-0.5 border-l border-surface-600/30 pl-3">
                      {[
                        { label: 'Tablero', href: `/projects/${project.id}/board` },
                        { label: 'Miembros', href: `/projects/${project.id}/board` },
                        { label: 'Configuración', href: `/projects/${project.id}/settings` },
                      ].map((sub) => (
                        <button
                          key={sub.label}
                          onClick={() => navigate(sub.href)}
                          className="w-full text-left rounded-lg px-2 py-1.5 text-xs text-surface-400 hover:text-white hover:bg-surface-700/40 transition-all duration-150"
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Proyectos colapsado — solo puntos de color */}
        {collapsed && (
          <div className="pt-4 space-y-2">
            {projectsLoading && (
              <div className="flex justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-surface-600 animate-pulse" />
              </div>
            )}

            {!projectsLoading && filteredProjects.map((p) => (
              <div key={p.id} className="flex justify-center">
                <button
                  onClick={() => goToProjectBoard(p.id)}
                  className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-surface-700/50 transition-colors duration-150"
                  aria-label={`Abrir ${p.name}`}
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getProjectColor(p.id) }} />
                </button>
              </div>
            ))}
          </div>
        )}
      </nav>

      {/* ── Footer: Avatar + acciones ────────────────────────────────── */}
      <div className="border-t border-surface-600/20 px-3 py-3 space-y-1">
        {/* Configuración */}
        <button
          onClick={() => navigate('/settings')}
          className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-surface-400 hover:text-white hover:bg-surface-700/50 border border-transparent transition-all duration-200 group ${collapsed ? 'justify-center' : ''}`}
        >
          <span className="shrink-0 group-hover:text-accent-400 transition-colors duration-200"><Icon.Settings /></span>
          {!collapsed && <span>Configuración</span>}
        </button>

        {/* Ayuda */}
        <button
          className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-surface-400 hover:text-white hover:bg-surface-700/50 border border-transparent transition-all duration-200 group ${collapsed ? 'justify-center' : ''}`}
        >
          <span className="shrink-0 group-hover:text-accent-400 transition-colors duration-200"><Icon.Help /></span>
          {!collapsed && <span>Ayuda</span>}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-surface-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent transition-all duration-200 group ${collapsed ? 'justify-center' : ''}`}
        >
          <span className="shrink-0"><Icon.Logout /></span>
          {!collapsed && <span>Cerrar sesión</span>}
        </button>

        {/* Colapsar */}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-surface-500 hover:text-surface-300 hover:bg-surface-700/40 border border-transparent transition-all duration-200 ${collapsed ? 'justify-center' : ''}`}
        >
          <span className="shrink-0">
            {collapsed ? <Icon.ChevronRight /> : <Icon.ChevronLeft />}
          </span>
          {!collapsed && <span>Colapsar</span>}
        </button>

        {/* Avatar usuario */}
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-2 mt-1 rounded-xl bg-surface-800/40 border border-surface-600/20">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm"
              style={{ background: 'var(--gradient-forge)' }}
            >
              {initials}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">
                {user ? `${user.firstName} ${user.lastName}` : 'Usuario'}
              </p>
              <p className="text-[10px] text-surface-400 truncate">{user?.email}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
