import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from '@/shared/components/AppLayout';
import { Button } from '@/shared/components/Button';
import { EmptyState } from '@/shared/components/EmptyState';
import { Input, Textarea } from '@/shared/components/Input';
import { Modal } from '@/shared/components/Modal';
import { Spinner } from '@/shared/components/Spinner';
import { boardApi } from '../api/boardApi';
import type { BoardLabel, Project } from '../types/board.types';

type BoardTheme = 'modern' | 'traditional';
type PendingAction = 'archive' | 'delete' | null;

type ProjectForm = {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
};

type ApiLikeError = {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
};

const BOARD_THEME_STORAGE_KEY = 'project-board-theme';
const PROJECT_COLOR_STORAGE_PREFIX = 'project-color';
const PROJECT_COLORS = [
  '#3B82F6',
  '#8B5CF6',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#EC4899',
  '#0EA5E9',
  '#14B8A6',
];

const LABEL_COLORS = [
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#06B6D4',
  '#EC4899',
  '#6B7280',
];

const getErrorMessage = (err: unknown, fallback: string) => {
  const apiError = err as ApiLikeError;
  return apiError.response?.data?.message ?? apiError.message ?? fallback;
};

const toDateInputValue = (value?: string | null) => {
  if (!value) return '';
  return value.slice(0, 10);
};

const buildProjectPayload = (form: ProjectForm) => ({
  name: form.name.trim(),
  description: form.description.trim() || undefined,
  startDate: form.startDate || undefined,
  endDate: form.endDate || undefined,
});

const getProjectColorStorageKey = (projectId: string) =>
  `${PROJECT_COLOR_STORAGE_PREFIX}:${projectId}`;

const SparkleIcon = () => (
  <svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4m2 14v2m-1-1h2m3-17l1.4 4.2L19 9l-4.6 1.8L13 15l-1.4-4.2L7 9l4.6-1.8L13 3z" />
  </svg>
);

const WarningIcon = () => (
  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M10.3 4.4 2.8 17.2A2 2 0 0 0 4.5 20h15a2 2 0 0 0 1.7-2.8L13.7 4.4a2 2 0 0 0-3.4 0z" />
  </svg>
);

const ArchiveIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M7 8v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V8M4 4h16v4H4zM10 12h4" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7 18.1 19.1A2 2 0 0 1 16.1 21H7.9a2 2 0 0 1-2-1.9L5 7m5 4v6m4-6v6M4 7h16m-6 0V5a2 2 0 0 0-2-2 2 2 0 0 0-2 2v2" />
  </svg>
);

const ThemePreview = ({
  theme,
  selected,
  onSelect,
}: {
  theme: BoardTheme;
  selected: boolean;
  onSelect: () => void;
}) => {
  const isModern = theme === 'modern';

  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        'text-left overflow-hidden rounded-2xl border bg-white transition-all duration-200',
        selected ? 'border-violet-500 ring-2 ring-violet-500/20' : 'border-slate-200 hover:border-slate-300',
      ].join(' ')}
    >
      <div className={isModern ? 'h-44 bg-slate-50 p-4' : 'h-44 bg-slate-100 p-4'}>
        {isModern ? (
          <div className="grid grid-cols-2 gap-2 h-28">
            {['Por Hacer', 'En Progreso'].map((title, idx) => (
              <div key={title} className="rounded-xl border border-slate-200 bg-white/80 p-2 shadow-sm">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-600">
                  <span className={`w-1.5 h-1.5 rounded-full ${idx === 0 ? 'bg-slate-400' : 'bg-blue-500'}`} />
                  {title}
                </div>
                <div className="mt-2 space-y-1.5">
                  <div className="rounded-lg bg-white px-2 py-1.5 text-[11px] text-slate-700 shadow-sm">Actualizar librería</div>
                  {idx === 0 && <div className="rounded-lg bg-white px-2 py-1.5 text-[11px] text-slate-700 shadow-sm">Revisar PR</div>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 border-b-2 border-blue-500 pb-1 text-[11px] italic text-blue-500">
              <span>To Do</span>
              <span>In Progress</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-amber-100 px-2 py-2 text-xs text-slate-700 shadow-md">
                Actualizar librería
              </div>
              <div className="rounded-lg bg-sky-100 px-2 py-2 text-xs text-slate-700 shadow-md">
                Refactorizar DB
              </div>
              <div className="rounded-lg bg-rose-100 px-2 py-2 text-xs text-slate-700 shadow-md">
                User testing
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 p-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{isModern ? 'Moderno' : 'Tradicional'}</h3>
          <p className="mt-1 text-sm font-semibold text-slate-400">
            {isModern
              ? 'Tarjetas limpias con sombras y colores de acento.'
              : 'Post-its coloridos con estilo de tablero físico.'}
          </p>
        </div>
        <span
          className={[
            'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border',
            selected ? 'border-violet-500 bg-violet-500 text-white' : 'border-slate-300',
          ].join(' ')}
        >
          {selected && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="m5 13 4 4L19 7" />
            </svg>
          )}
        </span>
      </div>
    </button>
  );
};

export const ProjectSettingsPage = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [labels, setLabels] = useState<BoardLabel[]>([]);
  const [form, setForm] = useState<ProjectForm>({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
  });
  const [theme, setTheme] = useState<BoardTheme>('modern');
  const [projectColor, setProjectColor] = useState(PROJECT_COLORS[0]);
  const [savedProjectColor, setSavedProjectColor] = useState(PROJECT_COLORS[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [isDangerLoading, setIsDangerLoading] = useState(false);
  const [nameError, setNameError] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [labelName, setLabelName] = useState('');
  const [labelColor, setLabelColor] = useState(LABEL_COLORS[0]);
  const [editingLabelId, setEditingLabelId] = useState<string | null>(null);
  const [labelError, setLabelError] = useState('');
  const [isLabelSaving, setIsLabelSaving] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem(BOARD_THEME_STORAGE_KEY);
    if (storedTheme === 'modern' || storedTheme === 'traditional') {
      setTheme(storedTheme);
      document.documentElement.dataset.boardTheme = storedTheme;
    }
  }, []);

  useEffect(() => {
    if (!projectId) return;
    let mounted = true;

    const loadProject = async () => {
      setIsLoading(true);
      setFeedback(null);

      try {
        const [projectResult, labelsResult] = await Promise.allSettled([
          boardApi.getProject(projectId),
          boardApi.getLabels(projectId),
        ]);
        if (!mounted) return;

        if (projectResult.status === 'rejected') {
          setFeedback({
            type: 'error',
            message: getErrorMessage(projectResult.reason, 'No se pudo cargar el proyecto'),
          });
          return;
        }

        const data = projectResult.value;
        setProject(data);
        setLabels(labelsResult.status === 'fulfilled' ? labelsResult.value : []);
        const storedColor = localStorage.getItem(getProjectColorStorageKey(data.id));
        const initialColor = storedColor && PROJECT_COLORS.includes(storedColor)
          ? storedColor
          : PROJECT_COLORS[0];
        setProjectColor(initialColor);
        setSavedProjectColor(initialColor);
        setForm({
          name: data.name,
          description: data.description ?? '',
          startDate: toDateInputValue(data.startDate),
          endDate: toDateInputValue(data.endDate),
        });
      } catch (err) {
        if (mounted) {
          setFeedback({
            type: 'error',
            message: getErrorMessage(err, 'No se pudo cargar el proyecto'),
          });
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadProject();

    return () => {
      mounted = false;
    };
  }, [projectId]);

  const hasProjectChanges = useMemo(() => {
    if (!project) return false;

    return (
      form.name.trim() !== project.name ||
      form.description.trim() !== (project.description ?? '') ||
      form.startDate !== toDateInputValue(project.startDate) ||
      form.endDate !== toDateInputValue(project.endDate) ||
      projectColor !== savedProjectColor
    );
  }, [form, project, projectColor, savedProjectColor]);

  const updateForm = (field: keyof ProjectForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === 'name') setNameError('');
  };

  const resetLabelForm = () => {
    setLabelName('');
    setLabelColor(LABEL_COLORS[0]);
    setEditingLabelId(null);
    setLabelError('');
  };

  const startEditingLabel = (label: BoardLabel) => {
    setEditingLabelId(label.id);
    setLabelName(label.name);
    setLabelColor(label.color);
    setLabelError('');
  };

  const handleSaveLabel = async () => {
    if (!projectId) return;
    if (!labelName.trim()) {
      setLabelError('El nombre de la etiqueta es obligatorio');
      return;
    }

    setIsLabelSaving(true);
    setLabelError('');
    setFeedback(null);

    try {
      if (editingLabelId) {
        const updated = await boardApi.updateLabel(projectId, editingLabelId, {
          name: labelName.trim(),
          color: labelColor,
        });
        setLabels((prev) => prev.map((label) => (label.id === updated.id ? updated : label)));
        setFeedback({ type: 'success', message: 'Etiqueta actualizada correctamente.' });
      } else {
        const created = await boardApi.createLabel(projectId, {
          name: labelName.trim(),
          color: labelColor,
        });
        setLabels((prev) => [...prev, created]);
        setFeedback({ type: 'success', message: 'Etiqueta creada correctamente.' });
      }
      resetLabelForm();
    } catch (err) {
      setLabelError(getErrorMessage(err, 'No se pudo guardar la etiqueta'));
    } finally {
      setIsLabelSaving(false);
    }
  };

  const handleDeleteLabel = async (labelId: string) => {
    if (!projectId) return;
    setFeedback(null);

    try {
      await boardApi.deleteLabel(projectId, labelId);
      setLabels((prev) => prev.filter((label) => label.id !== labelId));
      if (editingLabelId === labelId) resetLabelForm();
      setFeedback({ type: 'success', message: 'Etiqueta eliminada correctamente.' });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: getErrorMessage(err, 'No se pudo eliminar la etiqueta'),
      });
    }
  };

  const selectTheme = (nextTheme: BoardTheme) => {
    setTheme(nextTheme);
    localStorage.setItem(BOARD_THEME_STORAGE_KEY, nextTheme);
    document.documentElement.dataset.boardTheme = nextTheme;
    setFeedback({ type: 'success', message: 'Tema del tablero actualizado.' });
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!projectId) return;

    if (!form.name.trim()) {
      setNameError('El nombre del proyecto es obligatorio');
      return;
    }

    setIsSaving(true);
    setFeedback(null);

    try {
      const updated = await boardApi.updateProject(projectId, buildProjectPayload(form));
      localStorage.setItem(getProjectColorStorageKey(projectId), projectColor);
      window.dispatchEvent(new Event('project-color-changed'));
      setSavedProjectColor(projectColor);
      setProject(updated);
      setForm({
        name: updated.name,
        description: updated.description ?? '',
        startDate: toDateInputValue(updated.startDate),
        endDate: toDateInputValue(updated.endDate),
      });
      setFeedback({ type: 'success', message: 'Proyecto actualizado correctamente.' });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: getErrorMessage(err, 'No se pudo actualizar el proyecto'),
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleArchive = async () => {
    if (!projectId || !project) return;
    setIsDangerLoading(true);
    setFeedback(null);

    try {
      const updated = project.isArchived
        ? await boardApi.unarchiveProject(projectId)
        : await boardApi.archiveProject(projectId);
      setProject(updated);
      setPendingAction(null);
      setFeedback({
        type: 'success',
        message: updated.isArchived ? 'Proyecto archivado.' : 'Proyecto recuperado.',
      });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: getErrorMessage(err, 'No se pudo cambiar el estado del proyecto'),
      });
    } finally {
      setIsDangerLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!projectId) return;
    setIsDangerLoading(true);
    setFeedback(null);

    try {
      await boardApi.deleteProject(projectId);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: getErrorMessage(err, 'No se pudo eliminar el proyecto'),
      });
      setIsDangerLoading(false);
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Spinner size="lg" />
        </div>
      </AppLayout>
    );
  }

  if (!projectId || !project) {
    return (
      <AppLayout>
        <EmptyState
          title="No se pudo cargar la configuración"
          description={feedback?.message ?? 'Verifica que el proyecto exista e intenta nuevamente.'}
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-full bg-surface-950 px-6 py-6 text-white">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-surface-500">Proyecto</p>
              <h1 className="mt-1 text-2xl font-bold text-white">Configuración del proyecto</h1>
              <p className="mt-1 text-sm text-surface-400">{project.name}</p>
            </div>
            <Button variant="secondary" onClick={() => navigate(`/projects/${project.id}/board`)}>
              Volver al tablero
            </Button>
          </div>

          {feedback && (
            <div
              className={[
                'rounded-2xl border px-4 py-3 text-sm font-medium',
                feedback.type === 'success'
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                  : 'border-red-500/30 bg-red-500/10 text-red-300',
              ].join(' ')}
            >
              {feedback.message}
            </div>
          )}

          <form onSubmit={handleSave} className="rounded-2xl border border-surface-700/40 bg-surface-900/70 p-6 shadow-xl shadow-black/20">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white">Datos del proyecto</h2>
              <p className="mt-2 text-sm text-surface-400">
                El nombre es obligatorio. La descripción y las fechas se guardan solo si las completas.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Input
                label="Nombre"
                value={form.name}
                onChange={(event) => updateForm('name', event.target.value)}
                error={nameError}
                className="border-surface-700/60 bg-surface-950/70 text-white placeholder-surface-500 focus:border-accent-500"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Fecha inicio"
                  type="date"
                  value={form.startDate}
                  onChange={(event) => updateForm('startDate', event.target.value)}
                  className="border-surface-700/60 bg-surface-950/70 text-white focus:border-accent-500"
                />
                <Input
                  label="Fecha fin"
                  type="date"
                  value={form.endDate}
                  min={form.startDate || undefined}
                  onChange={(event) => updateForm('endDate', event.target.value)}
                  className="border-surface-700/60 bg-surface-950/70 text-white focus:border-accent-500"
                />
              </div>
              <Textarea
                label="Descripción"
                value={form.description}
                onChange={(event) => updateForm('description', event.target.value)}
                rows={4}
                wrapperClassName="md:col-span-2"
                className="border-surface-700/60 bg-surface-950/70 text-white placeholder-surface-500 focus:border-accent-500"
              />
            </div>

            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold text-surface-300">Color del proyecto</p>
              <div className="flex flex-wrap gap-3">
                {PROJECT_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setProjectColor(color)}
                    className={[
                      'h-9 w-9 rounded-full border-2 transition-all duration-150',
                      projectColor === color
                        ? 'border-white ring-2 ring-white/20'
                        : 'border-transparent hover:scale-105',
                    ].join(' ')}
                    style={{ backgroundColor: color }}
                    aria-label={`Seleccionar color ${color}`}
                  />
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setForm({
                    name: project.name,
                    description: project.description ?? '',
                    startDate: toDateInputValue(project.startDate),
                    endDate: toDateInputValue(project.endDate),
                  });
                  setProjectColor(savedProjectColor);
                  setNameError('');
                }}
                disabled={!hasProjectChanges || isSaving}
                className="text-surface-400 hover:bg-surface-800 hover:text-white"
              >
                Descartar
              </Button>
              <Button type="submit" loading={isSaving} disabled={!hasProjectChanges}>
                Guardar cambios
              </Button>
            </div>
          </form>

          <section className="rounded-2xl border border-surface-700/40 bg-surface-900/70 p-6 shadow-xl shadow-black/20">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white">Etiquetas del proyecto</h2>
              <p className="mt-2 text-sm text-surface-400">
                Crea, edita o elimina las etiquetas que se usan para clasificar las tareas de este proyecto.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
              <div className="space-y-3">
                {labels.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-surface-700/60 px-4 py-6 text-sm text-surface-500">
                    Este proyecto todavia no tiene etiquetas.
                  </div>
                )}

                {labels.map((label) => (
                  <div
                    key={label.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-surface-700/50 bg-surface-950/40 px-4 py-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: label.color }} />
                      <span className="truncate text-sm font-semibold text-surface-100">{label.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => startEditingLabel(label)}
                        className="rounded-lg px-3 py-1.5 text-xs font-semibold text-surface-400 hover:bg-surface-800 hover:text-white"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteLabel(label.id)}
                        className="rounded-lg px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/10"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-surface-700/50 bg-surface-950/50 p-4">
                <h3 className="text-sm font-bold text-white">
                  {editingLabelId ? 'Editar etiqueta' : 'Nueva etiqueta'}
                </h3>

                <div className="mt-4 space-y-4">
                  <Input
                    label="Nombre"
                    value={labelName}
                    onChange={(event) => {
                      setLabelName(event.target.value);
                      setLabelError('');
                    }}
                    error={labelError}
                    className="border-surface-700/60 bg-surface-950/70 text-white placeholder-surface-500 focus:border-accent-500"
                  />

                  <div>
                    <p className="mb-2 text-sm font-semibold text-surface-300">Color</p>
                    <div className="flex flex-wrap gap-2">
                      {LABEL_COLORS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setLabelColor(color)}
                          className={[
                            'h-7 w-7 rounded-full border-2 transition-all duration-150',
                            labelColor === color
                              ? 'border-white ring-2 ring-white/20'
                              : 'border-transparent hover:scale-105',
                          ].join(' ')}
                          style={{ backgroundColor: color }}
                          aria-label={`Seleccionar color de etiqueta ${color}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {editingLabelId && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={resetLabelForm}
                        className="text-surface-400 hover:bg-surface-800 hover:text-white"
                      >
                        Cancelar
                      </Button>
                    )}
                    <Button
                      type="button"
                      onClick={handleSaveLabel}
                      loading={isLabelSaving}
                      disabled={!labelName.trim()}
                    >
                      {editingLabelId ? 'Guardar' : 'Crear'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-surface-700/40 bg-surface-900/70 p-6 shadow-xl shadow-black/20">
            <div className="mb-6 flex items-start gap-3">
              <SparkleIcon />
              <div>
                <h2 className="text-xl font-bold text-white">Tema del tablero</h2>
                <p className="mt-2 text-sm text-surface-400">
                  Elige el estilo visual del tablero Kanban. El cambio se aplica globalmente a todos los tableros.
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <ThemePreview theme="modern" selected={theme === 'modern'} onSelect={() => selectTheme('modern')} />
              <ThemePreview theme="traditional" selected={theme === 'traditional'} onSelect={() => selectTheme('traditional')} />
            </div>
          </section>

          <section className="rounded-2xl border border-red-500/30 bg-red-950/10 p-6 shadow-xl shadow-black/20">
            <div className="mb-8 flex items-center gap-3">
              <WarningIcon />
              <h2 className="text-xl font-bold text-red-600">Zona de peligro</h2>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-red-100 pb-8">
              <div>
                <h3 className="text-base font-semibold text-white">
                  {project.isArchived ? 'Recuperar proyecto' : 'Archivar proyecto'}
                </h3>
                <p className="mt-1 max-w-2xl text-sm font-medium text-surface-400">
                  {project.isArchived
                    ? 'El proyecto volverá a aparecer en tus listados activos.'
                    : 'El proyecto se archivará y podrá recuperarse más tarde. Las tareas y miembros se conservarán.'}
                </p>
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setPendingAction('archive')}
                leftIcon={<ArchiveIcon />}
                className="border-amber-400/60 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 hover:text-amber-200"
              >
                {project.isArchived ? 'Recuperar' : 'Archivar'}
              </Button>
            </div>

            <div className="pt-8">
              <h3 className="text-base font-semibold text-white">Eliminar proyecto permanentemente</h3>
              <p className="mt-1 max-w-3xl text-sm font-medium text-surface-400">
                Esta acción no se puede deshacer. Se eliminarán todas las tareas, comentarios y archivos del proyecto.
              </p>
              <Button
                type="button"
                variant="danger"
                onClick={() => setPendingAction('delete')}
                leftIcon={<TrashIcon />}
                className="mt-6"
              >
                Eliminar proyecto
              </Button>
            </div>
          </section>
        </div>

        <Modal
          open={pendingAction !== null}
          onClose={() => {
            if (!isDangerLoading) setPendingAction(null);
          }}
          title={pendingAction === 'delete' ? 'Eliminar proyecto' : project.isArchived ? 'Recuperar proyecto' : 'Archivar proyecto'}
          description={
            pendingAction === 'delete'
              ? 'Esta acción eliminará el proyecto permanentemente.'
              : project.isArchived
                ? 'El proyecto volverá a tus proyectos activos.'
                : 'El proyecto se ocultará de tus proyectos activos, pero podrá recuperarse.'
          }
          size="sm"
          footer={
            <>
              <Button
                variant="ghost"
                onClick={() => setPendingAction(null)}
                disabled={isDangerLoading}
              >
                Cancelar
              </Button>
              <Button
                variant={pendingAction === 'delete' ? 'danger' : 'secondary'}
                loading={isDangerLoading}
                onClick={pendingAction === 'delete' ? handleDelete : handleArchive}
              >
                Confirmar
              </Button>
            </>
          }
        >
          <p className="text-sm text-surface-300">
            {pendingAction === 'delete'
              ? `Se eliminará "${project.name}" junto con su información asociada.`
              : `Se actualizará el estado de "${project.name}".`}
          </p>
        </Modal>
      </div>
    </AppLayout>
  );
};
