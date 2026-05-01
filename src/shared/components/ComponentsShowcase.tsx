/**
 * ComponentsShowcase — Página de Design System
 * Muestra todas las variantes de cada componente con etiquetas descriptivas.
 * Ruta: /components
 *
 * Estructura:
 *   - Sidebar izquierda con navegación de secciones
 *   - Área derecha con demos interactivas de cada componente
 *   - Cada sección tiene: nombre, descripción de cuándo usarlo, y variantes etiquetadas
 */

import { useState, useRef } from 'react';

// ── Componentes del sistema ────────────────────────────────────────────────
import { Alert } from '@/shared/components/Alert';
import { Avatar, AvatarGroup } from '@/shared/components/Avatar';
import { Badge } from '@/shared/components/Badge';
import { Button } from '@/shared/components/Button';
import { Card, CardHeader, CardTitle, CardBody, CardFooter, StatCard, InfoRow } from '@/shared/components/Card';
import { Dropdown } from '@/shared/components/Dropdown';
import { DropdownMenu } from '@/shared/components/DropdownMenu';
import { EmptyState, EmptyIcons } from '@/shared/components/EmptyState';
import { Input, Textarea } from '@/shared/components/Input';
import { KanbanCard, KanbanColumn } from '@/shared/components/Kanban';
import { Modal, ModalFooter } from '@/shared/components/Modal';
import { Priority, TaskStatusBadge, DueDate } from '@/shared/components/Priority';
import { ProgressBar, ProgressCircle } from '@/shared/components/ProgressBar';
import { Select } from '@/shared/components/Select';
import { Spinner, Skeleton, SkeletonCard } from '@/shared/components/Spinner';
import { Tabs } from '@/shared/components/Tabs';
import { useToast } from '@/shared/components/Toast';
import { Toggle } from '@/shared/components/Toggle';
import { Tooltip } from '@/shared/components/Tooltip';

// ── Secciones de navegación ────────────────────────────────────────────────

const NAV_SECTIONS = [
  { id: 'button',       label: 'Button',        tag: 'atom'     },
  { id: 'input',        label: 'Input',         tag: 'atom'     },
  { id: 'badge',        label: 'Badge',         tag: 'atom'     },
  { id: 'avatar',       label: 'Avatar',        tag: 'atom'     },
  { id: 'avatar-group', label: 'AvatarGroup',   tag: 'molecule' },
  { id: 'spinner',      label: 'Spinner',       tag: 'atom'     },
  { id: 'card',         label: 'Card',          tag: 'molecule' },
  { id: 'alert',        label: 'Alert',         tag: 'molecule' },
  { id: 'modal',        label: 'Modal',         tag: 'molecule' },
  { id: 'dropdown',     label: 'Dropdown',      tag: 'molecule' },
  { id: 'select',       label: 'Select',        tag: 'atom'     },
  { id: 'toggle',       label: 'Toggle',        tag: 'atom'     },
  { id: 'tabs',         label: 'Tabs',          tag: 'molecule' },
  { id: 'toast',        label: 'Toast',         tag: 'molecule' },
  { id: 'tooltip',      label: 'Tooltip',       tag: 'atom'     },
  { id: 'progress',     label: 'ProgressBar',   tag: 'atom'     },
  { id: 'priority',     label: 'Priority',      tag: 'atom'     },
  { id: 'empty-state',  label: 'EmptyState',    tag: 'molecule' },
  { id: 'kanban',       label: 'Kanban',        tag: 'molecule' },
];

const TAG_COLORS: Record<string, string> = {
  atom:     'bg-brand-500/10 text-brand-400 border-brand-500/30',
  molecule: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
};

// ── Helper: bloque de variante etiquetado ─────────────────────────────────

const VariantBlock = ({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-2">
    <div>
      <p className="text-xs font-semibold text-surface-300 uppercase tracking-wide">{label}</p>
      {description && <p className="text-xs text-surface-500 mt-0.5">{description}</p>}
    </div>
    <div className="flex flex-wrap items-center gap-3">{children}</div>
  </div>
);

// ── Helper: sección de showcase ───────────────────────────────────────────

const ShowcaseSection = ({
  id,
  title,
  tag,
  when,
  children,
}: {
  id: string;
  title: string;
  tag: 'atom' | 'molecule';
  when: string;
  children: React.ReactNode;
}) => (
  <section id={id} className="scroll-mt-6 space-y-6">
    {/* Header de sección */}
    <div className="flex items-center gap-3 pb-4 border-b border-surface-800">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${TAG_COLORS[tag]}`}>
            {tag}
          </span>
        </div>
        <p className="text-xs text-surface-500">
          <span className="text-surface-400 font-medium">Usar cuando: </span>
          {when}
        </p>
      </div>
    </div>

    {/* Variantes */}
    <div className="space-y-6">{children}</div>
  </section>
);

// ═══════════════════════════════════════════════════════════════════════════
// Demos con estado local
// ═══════════════════════════════════════════════════════════════════════════

const ButtonSection = () => (
  <ShowcaseSection
    id="button"
    title="Button"
    tag="atom"
    when="Cualquier acción del usuario: guardar formulario, crear tarea, confirmar modal, navegación."
  >
    <VariantBlock label="Variantes" description="Usa primary para la acción principal. Máximo 1 primary por vista.">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </VariantBlock>

    <VariantBlock label="Tamaños" description="sm para toolbars y acciones inline. md es el default. lg para CTAs destacados.">
      <Button size="sm">Pequeño — sm</Button>
      <Button size="md">Mediano — md</Button>
      <Button size="lg">Grande — lg</Button>
    </VariantBlock>

    <VariantBlock label="Estados">
      <Button loading>Guardando...</Button>
      <Button disabled>Deshabilitado</Button>
      <Button
        variant="primary"
        leftIcon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>}
      >
        Con ícono izquierdo
      </Button>
      <Button
        variant="secondary"
        rightIcon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>}
      >
        Con ícono derecho
      </Button>
    </VariantBlock>
  </ShowcaseSection>
);

const InputSection = () => {
  const [showPwd, setShowPwd] = useState(false);
  const EyeIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d={showPwd ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21"
        : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"}
      />
    </svg>
  );
  const MailIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );

  return (
    <ShowcaseSection
      id="input"
      title="Input"
      tag="atom"
      when="Campos de texto en formularios: crear tarea, editar proyecto, login, búsqueda."
    >
      <VariantBlock
        label="Variante simple — sin ícono"
        description="Para campos donde el contexto ya es claro: nombre de tarea, descripción, sprint."
      >
        <div className="w-72">
          <Input label="Nombre del proyecto" placeholder="Ej: Rediseño Portal Cliente" hint="Máximo 80 caracteres" />
        </div>
        <div className="w-72">
          <Input label="Nombre de usuario" placeholder="johndoe" />
        </div>
      </VariantBlock>

      <VariantBlock
        label="Variante con ícono izquierdo"
        description="Cuando el tipo de dato necesita contexto visual: email, contraseña, búsqueda, URLs."
      >
        <div className="w-72">
          <Input
            label="Correo electrónico"
            type="email"
            placeholder="usuario@codeforge.com"
            leftIcon={<MailIcon />}
            hint="Igual que el campo de Login"
          />
        </div>
        <div className="w-72">
          <Input
            label="Contraseña"
            type={showPwd ? 'text' : 'password'}
            placeholder="••••••••"
            leftIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            }
            rightElement={
              <button type="button" onClick={() => setShowPwd(v => !v)} className="text-surface-500 hover:text-white transition-colors">
                <EyeIcon />
              </button>
            }
          />
        </div>
      </VariantBlock>

      <VariantBlock label="Estado de error" description="Activa cuando la validación falla. Muestra mensaje descriptivo bajo el campo.">
        <div className="w-72">
          <Input label="Email" type="email" placeholder="usuario@codeforge.com"
            leftIcon={<MailIcon />} error="Este email ya está registrado" />
        </div>
        <div className="w-72">
          <Input label="Nombre" placeholder="Obligatorio" error="El nombre es requerido" />
        </div>
      </VariantBlock>

      <VariantBlock label="Textarea" description="Para descripciones largas: detalle de tarea, notas de sprint, descripción de proyecto.">
        <div className="w-full max-w-lg">
          <Textarea label="Descripción de la tarea" placeholder="Describe qué hay que hacer, criterios de aceptación..." rows={4} hint="Soporta markdown (próximamente)" />
        </div>
      </VariantBlock>

      <VariantBlock label="Deshabilitado" description="Cuando el campo no es editable en el contexto actual (solo lectura).">
        <div className="w-72">
          <Input label="ID de proyecto" value="PRJ-2024-001" disabled readOnly />
        </div>
      </VariantBlock>
    </ShowcaseSection>
  );
};

const BadgeSection = () => (
  <ShowcaseSection
    id="badge"
    title="Badge"
    tag="atom"
    when="Etiquetas de estado en listas de proyectos, tipo de tarea (Bug, Feature, Historia), sprint activo, notificaciones en sidebar."
  >
    <VariantBlock label="Colores disponibles" description="Cada color tiene un significado semántico en el módulo Kanban.">
      <Badge color="brand">Brand · CTA principal</Badge>
      <Badge color="accent">Accent · Hover / Activo</Badge>
      <Badge color="cta">CTA · Éxito / Activo</Badge>
      <Badge color="violet">Violet · IA / Datos</Badge>
      <Badge color="red">Red · Error / Bloqueado</Badge>
      <Badge color="amber">Amber · Advertencia</Badge>
      <Badge color="surface">Surface · Neutro</Badge>
    </VariantBlock>

    <VariantBlock label="Con punto indicador" description="Dot es útil para estados de tarea en tableros y listas compactas.">
      <Badge color="cta" dot>En progreso</Badge>
      <Badge color="red" dot>Bloqueado</Badge>
      <Badge color="amber" dot dotPulse>Pendiente revisión</Badge>
      <Badge color="surface" dot>Backlog</Badge>
    </VariantBlock>

    <VariantBlock label="Tamaños" description="sm para espacios reducidos (dentro de una KanbanCard). md es el default.">
      <Badge color="brand" size="sm">sm · Bug</Badge>
      <Badge color="brand" size="md">md · Feature</Badge>
    </VariantBlock>

    <VariantBlock label="Casos de uso reales en el proyecto">
      <Badge color="cta" dot dotPulse>Sprint activo</Badge>
      <Badge color="violet">Feature</Badge>
      <Badge color="red" dot>Crítico</Badge>
      <Badge color="amber">En revisión</Badge>
      <Badge color="surface">Backlog</Badge>
    </VariantBlock>
  </ShowcaseSection>
);

const AvatarSection = () => (
  <ShowcaseSection
    id="avatar"
    title="Avatar"
    tag="atom"
    when="Foto de perfil del usuario en sidebar, asignado de una tarea, miembros de proyecto."
  >
    <VariantBlock
      label="Tamaños — con iniciales (sin foto)"
      description="El tamaño indica la jerarquía visual. xs en tarjetas compactas, xl en perfiles."
    >
      <div className="flex items-end gap-4">
        <div className="flex flex-col items-center gap-1.5">
          <Avatar name="Ana López" size="xs" />
          <span className="text-[10px] text-surface-500">xs · 24px</span>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <Avatar name="Ana López" size="sm" />
          <span className="text-[10px] text-surface-500">sm · 32px</span>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <Avatar name="Ana López" size="md" />
          <span className="text-[10px] text-surface-500">md · 40px (default)</span>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <Avatar name="Ana López" size="lg" />
          <span className="text-[10px] text-surface-500">lg · 48px</span>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <Avatar name="Ana López" size="xl" />
          <span className="text-[10px] text-surface-500">xl · 64px</span>
        </div>
      </div>
    </VariantBlock>

    <VariantBlock label="Colores de fondo" description="Cuando no hay foto, el color diferencia visualmente a los usuarios en el tablero.">
      <Avatar name="Ana López" color="brand"   size="md" />
      <Avatar name="Bob Ruiz"  color="accent"  size="md" />
      <Avatar name="Cris Vera" color="cta"     size="md" />
      <Avatar name="Dani Fox"  color="violet"  size="md" />
      <Avatar name="Eve Park"  color="surface" size="md" />
    </VariantBlock>

    <VariantBlock label="Indicadores de estado" description="Puntos de presencia online: útil en listas de miembros y asignación de tareas.">
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center gap-1.5">
          <Avatar name="Ana" size="md" color="brand" status="online" />
          <span className="text-[10px] text-cta-400">online</span>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <Avatar name="Bob" size="md" color="accent" status="away" />
          <span className="text-[10px] text-amber-400">away</span>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <Avatar name="Cal" size="md" color="violet" status="busy" />
          <span className="text-[10px] text-red-400">busy</span>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <Avatar name="Dan" size="md" status="offline" />
          <span className="text-[10px] text-surface-500">offline</span>
        </div>
      </div>
    </VariantBlock>
  </ShowcaseSection>
);

const AvatarGroupSection = () => {
  const USERS = [
    { name: 'Ana López',    color: 'brand'   as const },
    { name: 'Bob Ruiz',     color: 'accent'  as const },
    { name: 'Cris Vera',    color: 'cta'     as const },
    { name: 'Dani Fox',     color: 'violet'  as const },
    { name: 'Eve Park',     color: 'surface' as const },
    { name: 'Frank Torres', color: 'brand'   as const },
  ];

  return (
    <ShowcaseSection
      id="avatar-group"
      title="AvatarGroup"
      tag="molecule"
      when="Múltiples asignados en una KanbanCard, equipo de un proyecto, participantes de sprint."
    >
      <div className="bg-surface-800/30 rounded-xl p-4 border border-surface-700/30">
        <p className="text-xs text-surface-400 mb-3">
          💡 <strong className="text-surface-200">Import unificado:</strong>{' '}
          <code className="text-brand-400 bg-surface-900 px-1.5 py-0.5 rounded text-[11px]">
            import {'{ Avatar, AvatarGroup }'} from '@/shared/components/Avatar'
          </code>
        </p>
      </div>

      <VariantBlock
        label="Max configurable — cuántos mostrar antes del +N"
        description="Ajusta max según el espacio disponible. En KanbanCard se recomienda max=3."
      >
        <div className="space-y-3 w-full">
          {([2, 3, 4] as const).map((max) => (
            <div key={max} className="flex items-center gap-4">
              <span className="text-xs text-surface-500 w-16 shrink-0">max={max}</span>
              <AvatarGroup users={USERS} max={max} size="sm" />
              <span className="text-xs text-surface-500">
                {max} visibles + {USERS.length - max} más
              </span>
            </div>
          ))}
        </div>
      </VariantBlock>

      <VariantBlock
        label="Tamaños del grupo"
        description="Cambia el size y todos los avatares + el badge +N se ajustan."
      >
        <div className="space-y-4">
          {(['xs', 'sm', 'md', 'lg'] as const).map((size) => (
            <div key={size} className="flex items-center gap-4">
              <span className="text-xs text-surface-500 w-8 shrink-0">{size}</span>
              <AvatarGroup users={USERS.slice(0, 4)} max={3} size={size} />
            </div>
          ))}
        </div>
      </VariantBlock>

      <VariantBlock label="Separación (spacing)" description="Ajusta el solapamiento entre avatares.">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-xs text-surface-500 w-16 shrink-0">tight</span>
            <AvatarGroup users={USERS.slice(0, 4)} spacing="tight" size="sm" />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-surface-500 w-16 shrink-0">normal</span>
            <AvatarGroup users={USERS.slice(0, 4)} spacing="normal" size="sm" />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-surface-500 w-16 shrink-0">loose</span>
            <AvatarGroup users={USERS.slice(0, 4)} spacing="loose" size="sm" />
          </div>
        </div>
      </VariantBlock>
    </ShowcaseSection>
  );
};

const SpinnerSection = () => (
  <ShowcaseSection
    id="spinner"
    title="Spinner & Skeleton"
    tag="atom"
    when="Spinner durante fetch de datos. Skeleton como placeholder de layout mientras carga la página."
  >
    <VariantBlock label="Spinner — tamaños" description="xs/sm dentro de botones. md/lg para estados de carga de pantalla.">
      <div className="flex items-end gap-6">
        {(['xs', 'sm', 'md', 'lg'] as const).map((size) => (
          <div key={size} className="flex flex-col items-center gap-2">
            <Spinner size={size} />
            <span className="text-[10px] text-surface-500">{size}</span>
          </div>
        ))}
      </div>
    </VariantBlock>

    <VariantBlock label="Skeleton — líneas de texto" description="Para reemplazar párrafos y listas mientras cargan.">
      <div className="w-64 space-y-2">
        <Skeleton height="1rem" width="80%" />
        <Skeleton height="0.875rem" />
        <Skeleton height="0.875rem" width="60%" />
      </div>
    </VariantBlock>

    <VariantBlock label="SkeletonCard — preset de tarjeta" description="Reemplaza una KanbanCard o Card mientras carga.">
      <div className="w-72"><SkeletonCard /></div>
      <div className="w-72"><SkeletonCard /></div>
    </VariantBlock>
  </ShowcaseSection>
);

const CardSection = () => (
  <ShowcaseSection
    id="card"
    title="Card"
    tag="molecule"
    when="Contenedor de información: métricas del dashboard, detalles de proyecto, secciones de formulario."
  >
    <VariantBlock label="Variantes de superficie" description="default para contenido general. elevated para resaltar. glass para overlays y paneles flotantes.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <Card variant="default" padding="md">
          <CardHeader><CardTitle>Default</CardTitle></CardHeader>
          <CardBody><p className="text-sm text-surface-400">Fondo semi-transparente con blur sutil. El más usado.</p></CardBody>
        </Card>
        <Card variant="elevated" padding="md">
          <CardHeader><CardTitle>Elevated</CardTitle></CardHeader>
          <CardBody><p className="text-sm text-surface-400">Sombra pronunciada. Para modales y paneles importantes.</p></CardBody>
        </Card>
        <Card variant="bordered" padding="md">
          <CardHeader><CardTitle>Bordered</CardTitle></CardHeader>
          <CardBody><p className="text-sm text-surface-400">Borde doble. Para secciones con separación clara.</p></CardBody>
        </Card>
        <Card variant="glass" padding="md">
          <CardHeader><CardTitle>Glass</CardTitle></CardHeader>
          <CardBody><p className="text-sm text-surface-400">Fondo glass morphism. Para overlays y paneles laterales.</p></CardBody>
        </Card>
      </div>
    </VariantBlock>

    <VariantBlock label="StatCard — métricas del dashboard" description="Preset para KPIs: tareas completadas, proyectos activos, sprints.">
      <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
        <StatCard label="Proyectos activos" value="12" delta="+2 este mes" color="brand" />
        <StatCard label="Tareas completadas" value="87" delta="↑ 23% vs ayer" color="cta" />
      </div>
    </VariantBlock>

    <VariantBlock label="Con header, body, footer y hoverable" description="Usa los subcomponentes para estructurar el contenido.">
      <Card variant="elevated" padding="md" hoverable className="w-72">
        <CardHeader>
          <CardTitle>Tarea #PRJ-042</CardTitle>
          <Badge color="amber" dot>En revisión</Badge>
        </CardHeader>
        <CardBody>
          <InfoRow label="Asignado" value="Ana López" />
          <InfoRow label="Sprint" value="Sprint 4" />
          <InfoRow label="Prioridad" value={<Priority level="high" showLabel />} last />
        </CardBody>
        <CardFooter>
          <span className="text-xs text-surface-500">Creado hace 2 días</span>
          <Button size="sm" variant="ghost">Ver detalle</Button>
        </CardFooter>
      </Card>
    </VariantBlock>
  </ShowcaseSection>
);

const AlertSection = () => {
  const [alerts, setAlerts] = useState({ info: true, success: true, warning: true, error: true });
  return (
    <ShowcaseSection
      id="alert"
      title="Alert"
      tag="molecule"
      when="Feedback inline en formularios: error de validación de API, confirmación de guardado, advertencias de plan."
    >
      <VariantBlock label="Variantes con título y cierre" description="Usa onClose para que el usuario pueda descartar la alerta.">
        <div className="space-y-3 w-full max-w-xl">
          {alerts.info    && <Alert variant="info"    title="Información"  onClose={() => setAlerts(a => ({...a, info: false}))}>Tu token de API expira en 7 días.</Alert>}
          {alerts.success && <Alert variant="success" title="¡Guardado!"   onClose={() => setAlerts(a => ({...a, success: false}))}>La tarea se creó correctamente.</Alert>}
          {alerts.warning && <Alert variant="warning" title="Atención"     onClose={() => setAlerts(a => ({...a, warning: false}))}>El sprint supera el límite WIP.</Alert>}
          {alerts.error   && <Alert variant="error"   title="Sin acceso"   onClose={() => setAlerts(a => ({...a, error: false}))}>No tienes permisos para esta acción.</Alert>}
          {Object.values(alerts).every(v => !v) && (
            <Button size="sm" variant="ghost" onClick={() => setAlerts({info:true,success:true,warning:true,error:true})}>Restaurar alertas</Button>
          )}
        </div>
      </VariantBlock>

      <VariantBlock label="Sin título — solo mensaje" description="Para mensajes breves y directos sin necesidad de encabezado.">
        <div className="space-y-2 w-full max-w-xl">
          <Alert variant="info">Arrastra las tarjetas para reordenarlas.</Alert>
          <Alert variant="success">Cambios sincronizados.</Alert>
        </div>
      </VariantBlock>
    </ShowcaseSection>
  );
};

// ── Wizard interno — datos de cada paso ────────────────────────────────────

const WIZARD_STEPS = [
  { id: 1, label: 'Proyecto',   description: 'Datos generales' },
  { id: 2, label: 'Equipo',     description: 'Asignar miembros' },
  { id: 3, label: 'Tablero',    description: 'Configurar columnas' },
  { id: 4, label: 'Confirmar',  description: 'Revisa y crea' },
];

// Indicador de pasos del wizard
const WizardStepBar = ({
  steps,
  current,
}: {
  steps: typeof WIZARD_STEPS;
  current: number;
}) => (
  <div className="flex items-center gap-0 mb-6">
    {steps.map((step, idx) => {
      const isDone    = current > step.id;
      const isActive  = current === step.id;
      const isLast    = idx === steps.length - 1;

      return (
        <div key={step.id} className="flex items-center flex-1 min-w-0">
          {/* Círculo */}
          <div className="flex flex-col items-center shrink-0">
            <div
              className={[
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300',
                isDone
                  ? 'bg-brand-500 border-brand-500 text-white'
                  : isActive
                  ? 'bg-transparent border-brand-500 text-brand-400'
                  : 'bg-transparent border-surface-700 text-surface-600',
              ].join(' ')}
            >
              {isDone ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                step.id
              )}
            </div>
            {/* Etiqueta debajo del círculo */}
            <div className="mt-1.5 text-center">
              <p className={`text-[10px] font-semibold leading-none ${isActive ? 'text-white' : isDone ? 'text-brand-400' : 'text-surface-600'}`}>
                {step.label}
              </p>
              <p className="text-[9px] text-surface-600 mt-0.5 hidden sm:block">{step.description}</p>
            </div>
          </div>

          {/* Línea conectora */}
          {!isLast && (
            <div className="flex-1 h-px mx-2 mt-[-18px] transition-colors duration-300 relative top-[-9px]"
              style={{ backgroundColor: isDone ? 'var(--color-brand-500)' : 'var(--color-surface-700)' }}
            />
          )}
        </div>
      );
    })}
  </div>
);

// Contenido de cada paso
const WizardStepContent = ({ step }: { step: number }) => {
  if (step === 1) return (
    <div className="space-y-4">
      <Input label="Nombre del proyecto" placeholder="Ej: Rediseño Portal Cliente" />
      <Textarea label="Descripción" placeholder="¿Cuál es el objetivo principal?" rows={3} />
      <div className="grid grid-cols-2 gap-3">
        <Select label="Tipo" placeholder="Selecciona..."
          options={[{value:'dev',label:'Desarrollo'},{value:'design',label:'Diseño'},{value:'marketing',label:'Marketing'}]} />
        <Select label="Visibilidad" placeholder="Selecciona..."
          options={[{value:'private',label:'Privado'},{value:'team',label:'Equipo'},{value:'public',label:'Público'}]} />
      </div>
    </div>
  );

  if (step === 2) return (
    <div className="space-y-4">
      <p className="text-xs text-surface-500">Selecciona los miembros que participarán en este proyecto.</p>
      <div className="space-y-2">
        {[
          { name: 'Ana López',    role: 'Frontend Lead',   color: 'brand'   as const },
          { name: 'Bob Ruiz',     role: 'Backend Dev',     color: 'accent'  as const },
          { name: 'Cris Vera',    role: 'UX Designer',     color: 'cta'     as const },
          { name: 'Dani Fox',     role: 'DevOps',          color: 'violet'  as const },
          { name: 'Eve Park',     role: 'Product Manager', color: 'surface' as const },
        ].map((m, idx) => (
          <label key={m.name}
            className="flex items-center gap-3 p-2.5 rounded-xl border border-surface-700/40 hover:border-surface-600/60 hover:bg-surface-800/40 cursor-pointer transition-all duration-150 group"
          >
            <input type="checkbox" defaultChecked={idx < 3}
              className="w-4 h-4 rounded border-surface-600 bg-surface-800 accent-brand-500 cursor-pointer" />
            <Avatar name={m.name} size="sm" color={m.color} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white leading-none">{m.name}</p>
              <p className="text-xs text-surface-500 mt-0.5">{m.role}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );

  if (step === 3) return (
    <div className="space-y-4">
      <p className="text-xs text-surface-500">Estas serán las columnas iniciales de tu tablero Kanban. Puedes editarlas después.</p>
      <div className="space-y-2">
        {[
          { name: 'Backlog',      color: '#64748b', editable: false },
          { name: 'Por hacer',    color: '#0ea5e9', editable: true  },
          { name: 'En progreso',  color: '#0052FF', editable: true  },
          { name: 'En revisión',  color: '#8b5cf6', editable: true  },
          { name: 'Completado',   color: '#00C896', editable: false },
        ].map((col) => (
          <div key={col.name} className="flex items-center gap-3 p-2.5 rounded-xl border border-surface-700/30 bg-surface-800/30">
            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: col.color }} />
            <span className="text-sm text-white flex-1">{col.name}</span>
            {col.editable && (
              <span className="text-[10px] text-surface-600 border border-surface-700/40 rounded px-1.5 py-0.5">editable</span>
            )}
          </div>
        ))}
      </div>
      <Toggle label="Activar límite WIP por columna" description="Restringe el número máximo de tareas en progreso" checked={false} onChange={() => {}} size="sm" />
    </div>
  );

  // step === 4 — Resumen
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-surface-700/40 bg-surface-800/30 divide-y divide-surface-700/30">
        <div className="flex justify-between items-start px-4 py-3">
          <span className="text-xs text-surface-500">Proyecto</span>
          <span className="text-xs text-white font-medium text-right">Rediseño Portal Cliente</span>
        </div>
        <div className="flex justify-between items-start px-4 py-3">
          <span className="text-xs text-surface-500">Tipo</span>
          <span className="text-xs text-white font-medium">Diseño</span>
        </div>
        <div className="flex justify-between items-center px-4 py-3">
          <span className="text-xs text-surface-500">Equipo</span>
          <AvatarGroup
            users={[
              { name: 'Ana López', color: 'brand' },
              { name: 'Bob Ruiz',  color: 'accent' },
              { name: 'Cris Vera', color: 'cta' },
            ]}
            size="xs"
            max={3}
          />
        </div>
        <div className="flex justify-between items-start px-4 py-3">
          <span className="text-xs text-surface-500">Columnas</span>
          <span className="text-xs text-white font-medium">5 columnas Kanban</span>
        </div>
      </div>
      <Alert variant="info" icon>
        Una vez creado podrás invitar más miembros y personalizar el tablero.
      </Alert>
    </div>
  );
};

const ModalSection = () => {
  const [size, setSize]         = useState<'sm' | 'md' | 'lg' | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const { toast } = useToast();

  const handleWizardClose = () => {
    setWizardOpen(false);
    setTimeout(() => setWizardStep(1), 300);
  };

  const handleWizardFinish = () => {
    handleWizardClose();
    toast.success('¡Proyecto creado!', { description: 'Rediseño Portal Cliente se añadió al tablero.' });
  };

  const isFirst = wizardStep === 1;
  const isLast  = wizardStep === WIZARD_STEPS.length;

  return (
    <ShowcaseSection
      id="modal"
      title="Modal"
      tag="molecule"
      when="Crear/editar tarea, confirmar eliminación, ver detalle de proyecto sin salir de la vista."
    >
      {/* ── Tamaños ──────────────────────────────────────────────────── */}
      <VariantBlock
        label="Tamaños — pequeño, mediano, grande"
        description="sm para confirmaciones. md para formularios simples. lg para formularios completos de tarea."
      >
        <Button size="sm" variant="secondary" onClick={() => setSize('sm')}>Abrir sm — confirmación</Button>
        <Button size="md" variant="secondary" onClick={() => setSize('md')}>Abrir md — formulario</Button>
        <Button size="lg" variant="primary"   onClick={() => setSize('lg')}>Abrir lg — detalle tarea</Button>
      </VariantBlock>

      {/* Modal sm — confirmación */}
      <Modal open={size === 'sm'} onClose={() => setSize(null)} size="sm"
        title="¿Eliminar tarea?"
        description="Esta acción no se puede deshacer."
        footer={
          <ModalFooter>
            <Button variant="ghost" size="sm" onClick={() => setSize(null)}>Cancelar</Button>
            <Button variant="danger" size="sm" onClick={() => setSize(null)}>Eliminar</Button>
          </ModalFooter>
        }
      >
        <p className="text-sm text-surface-400">
          La tarea <strong className="text-white">Refactor Auth Module</strong> y todos sus comentarios
          serán eliminados permanentemente.
        </p>
      </Modal>

      {/* Modal md — formulario */}
      <Modal open={size === 'md'} onClose={() => setSize(null)} size="md"
        title="Nueva tarea"
        description="Añade una tarea al sprint actual"
        footer={
          <ModalFooter>
            <Button variant="ghost" size="sm" onClick={() => setSize(null)}>Cancelar</Button>
            <Button variant="primary" size="sm">Crear tarea</Button>
          </ModalFooter>
        }
      >
        <div className="space-y-4">
          <Input label="Título" placeholder="Ej: Implementar validaciones de formulario" />
          <Textarea label="Descripción" placeholder="Criterios de aceptación..." rows={3} />
          <Select label="Prioridad"
            options={[{value:'high',label:'Alta'},{value:'medium',label:'Media'},{value:'low',label:'Baja'}]}
            placeholder="Selecciona..." />
        </div>
      </Modal>

      {/* Modal lg — detalle */}
      <Modal open={size === 'lg'} onClose={() => setSize(null)} size="lg"
        title="Refactor Auth Module"
        description="PRJ-042 · Sprint 4"
      >
        <div className="space-y-5">
          <div className="flex gap-6">
            <div className="flex-1 space-y-4">
              <div>
                <p className="text-xs text-surface-500 mb-1">Descripción</p>
                <p className="text-sm text-surface-300">
                  Migrar el módulo de autenticación al nuevo sistema de tokens JWT con refresh automático.
                </p>
              </div>
              <Textarea label="Añadir comentario" placeholder="Escribe un comentario..." rows={2} />
            </div>
            <div className="w-48 space-y-3 shrink-0">
              <InfoRow label="Estado"    value={<TaskStatusBadge status="in_progress" />} />
              <InfoRow label="Prioridad" value={<Priority level="high" showLabel />} />
              <InfoRow label="Vence"     value={<DueDate date={new Date(Date.now() + 2 * 86400000)} />} last />
            </div>
          </div>
        </div>
      </Modal>

      {/* ── Wizard ───────────────────────────────────────────────────── */}
      <VariantBlock
        label="Wizard — modal multipaso"
        description="Para flujos que requieren varios pasos: crear proyecto, onboarding, configurar integración. Reutiliza el mismo componente Modal con estado interno de paso."
      >
        <Button variant="primary" onClick={() => { setWizardStep(1); setWizardOpen(true); }}>
          Abrir wizard — Nuevo proyecto
        </Button>
        <p className="text-xs text-surface-500 self-center">
          4 pasos: datos → equipo → tablero → confirmar
        </p>
      </VariantBlock>

      <Modal
        open={wizardOpen}
        onClose={handleWizardClose}
        size="md"
        closeOnBackdrop={false}
        title={`Nuevo proyecto — Paso ${wizardStep} de ${WIZARD_STEPS.length}`}
        description={WIZARD_STEPS[wizardStep - 1].description}
        footer={
          <ModalFooter>
            {/* Izquierda: cancelar o retroceder */}
            <div className="flex-1">
              {isFirst ? (
                <Button variant="ghost" size="sm" onClick={handleWizardClose}>Cancelar</Button>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => setWizardStep(s => s - 1)}>
                  ← Atrás
                </Button>
              )}
            </div>

            {/* Derecha: siguiente o finalizar */}
            {isLast ? (
              <Button variant="primary" size="sm" onClick={handleWizardFinish}>
                Crear proyecto ✓
              </Button>
            ) : (
              <Button variant="primary" size="sm" onClick={() => setWizardStep(s => s + 1)}>
                Siguiente →
              </Button>
            )}
          </ModalFooter>
        }
      >
        {/* Barra de progreso de pasos */}
        <WizardStepBar steps={WIZARD_STEPS} current={wizardStep} />

        {/* Contenido del paso actual */}
        <WizardStepContent step={wizardStep} />
      </Modal>
    </ShowcaseSection>
  );
};

const DropdownSection = () => {
  const [selected1, setSelected1] = useState('');
  const [selected2, setSelected2] = useState<string[]>([]);

  const MEMBERS = [
    { value: 'ana',   label: 'Ana López',    description: 'Frontend Lead',  prefix: <Avatar name="Ana López" size="xs" color="brand" /> },
    { value: 'bob',   label: 'Bob Ruiz',     description: 'Backend Dev',    prefix: <Avatar name="Bob Ruiz" size="xs" color="accent" /> },
    { value: 'cris',  label: 'Cris Vera',    description: 'UX Designer',    prefix: <Avatar name="Cris Vera" size="xs" color="cta" /> },
    { value: 'dani',  label: 'Dani Fox',     description: 'DevOps',         prefix: <Avatar name="Dani Fox" size="xs" color="violet" /> },
    { value: 'eve',   label: 'Eve Park',     description: 'Product Manager',prefix: <Avatar name="Eve Park" size="xs" /> },
    { value: 'frank', label: 'Frank Torres', description: 'QA Engineer',    prefix: <Avatar name="Frank Torres" size="xs" color="brand" /> },
  ];

  const TAGS = [
    { value: 'bug',      label: 'Bug',       prefix: <span className="w-2 h-2 rounded-full bg-red-400" /> },
    { value: 'feature',  label: 'Feature',   prefix: <span className="w-2 h-2 rounded-full bg-brand-400" /> },
    { value: 'docs',     label: 'Docs',      prefix: <span className="w-2 h-2 rounded-full bg-amber-400" /> },
    { value: 'refactor', label: 'Refactor',  prefix: <span className="w-2 h-2 rounded-full bg-violet-400" /> },
    { value: 'test',     label: 'Tests',     prefix: <span className="w-2 h-2 rounded-full bg-cta-400" /> },
  ];

  return (
    <ShowcaseSection
      id="dropdown"
      title="Dropdown (Searchable)"
      tag="molecule"
      when="Asignar miembro a tarea, seleccionar etiquetas, elegir proyecto — cuando hay muchas opciones y el usuario necesita filtrar."
    >
      <div className="bg-amber-500/8 border border-amber-500/25 rounded-xl px-4 py-3 text-xs text-amber-300">
        <strong>Diferencia con Select:</strong> Select es nativo (rápido, pocos ítems como prioridad o estado).
        Dropdown tiene búsqueda y soporta íconos/avatares — ideal para listas de usuarios o etiquetas.
      </div>

      <VariantBlock label="Single select con avatares — Asignar a" description="El usuario escribe para filtrar la lista de miembros.">
        <div className="w-72 relative">
          <Dropdown
            label="Asignar a"
            placeholder="Buscar miembro del equipo..."
            options={MEMBERS}
            value={selected1}
            onChange={(v) => setSelected1(v as string)}
          />
        </div>
      </VariantBlock>

      <VariantBlock label="Multi select — Etiquetas de tarea" description="Permite seleccionar varias etiquetas. Las selecciones aparecen como chips.">
        <div className="w-80 relative">
          <Dropdown
            label="Etiquetas"
            placeholder="Buscar o crear etiqueta..."
            options={TAGS}
            value={selected2}
            onChange={(v) => setSelected2(v as string[])}
            multiple
          />
        </div>
      </VariantBlock>

      <VariantBlock label="DropdownMenu — acciones contextuales" description="Para los 3 puntos ⋮ de tarjetas y filas. Diferente de Dropdown: no es un campo de formulario.">
        <DropdownMenu
          trigger={<Button variant="secondary" size="sm">Acciones ⋮</Button>}
          items={[
            { label: 'Editar tarea',    onClick: () => {} },
            { label: 'Duplicar',        onClick: () => {} },
            { label: 'Mover a columna', onClick: () => {} },
            { type: 'divider' },
            { label: 'Eliminar',        danger: true, onClick: () => {} },
          ]}
        />
        <DropdownMenu
          trigger={<Button variant="ghost" size="sm">Opciones de proyecto ⋮</Button>}
          items={[
            { type: 'label', text: 'Exportar como' },
            { label: 'CSV', onClick: () => {} },
            { label: 'PDF', onClick: () => {} },
            { type: 'divider' },
            { label: 'Archivar proyecto', danger: true },
          ]}
        />
      </VariantBlock>
    </ShowcaseSection>
  );
};

const SelectSection = () => (
  <ShowcaseSection
    id="select"
    title="Select"
    tag="atom"
    when="Campos de formulario con pocas opciones fijas: prioridad (4 opciones), estado (5 opciones), sprint, tipo de tarea."
  >
    <VariantBlock label="Uso básico — prioridad y estado" description="El select nativo es más rápido y accesible para opciones fijas y cortas.">
      <div className="w-48">
        <Select label="Prioridad" placeholder="Selecciona..."
          options={[{value:'critical',label:'🔴 Crítica'},{value:'high',label:'🟠 Alta'},{value:'medium',label:'🟡 Media'},{value:'low',label:'🟢 Baja'}]} />
      </div>
      <div className="w-52">
        <Select label="Estado" placeholder="Selecciona..."
          options={[{value:'todo',label:'Por hacer'},{value:'in_progress',label:'En progreso'},{value:'review',label:'En revisión'},{value:'done',label:'Completado'}]} />
      </div>
    </VariantBlock>

    <VariantBlock label="Con grupos" description="Agrupa opciones relacionadas. Útil para seleccionar sprint de un proyecto con múltiples fases.">
      <div className="w-56">
        <Select label="Sprint" placeholder="Elige sprint..."
          options={[
            { label: 'Activos', options: [{value:'s4',label:'Sprint 4 (actual)'},{value:'s3',label:'Sprint 3'}] },
            { label: 'Cerrados', options: [{value:'s2',label:'Sprint 2'},{value:'s1',label:'Sprint 1'}] },
          ]}
        />
      </div>
    </VariantBlock>

    <VariantBlock label="Estado de error">
      <div className="w-48">
        <Select label="Prioridad" error="Campo requerido"
          options={[{value:'high',label:'Alta'},{value:'low',label:'Baja'}]} />
      </div>
    </VariantBlock>
  </ShowcaseSection>
);

const ToggleSection = () => {
  const [states, setStates] = useState({ notifs: true, email: false, slack: true, darkMode: true });
  const set = (k: keyof typeof states, v: boolean) => setStates(s => ({...s, [k]: v}));

  return (
    <ShowcaseSection
      id="toggle"
      title="Toggle"
      tag="atom"
      when="Ajustes on/off: notificaciones, integraciones, visibilidad de proyecto, modo oscuro."
    >
      <VariantBlock label="Con label y descripción" description="El estilo preferido para páginas de configuración.">
        <div className="space-y-4 w-full max-w-sm">
          <Toggle checked={states.notifs}   onChange={v => set('notifs', v)}   label="Notificaciones push"   description="Alertas de nuevas tareas y menciones" />
          <Toggle checked={states.email}    onChange={v => set('email', v)}    label="Notificaciones email"  description="Resumen diario de actividad" />
          <Toggle checked={states.slack}    onChange={v => set('slack', v)}    label="Integración Slack"     description="Envía actualizaciones al canal #proyectos" />
        </div>
      </VariantBlock>

      <VariantBlock label="Colores" description="Cambia el color según el contexto semántico.">
        <Toggle checked={true} onChange={() => {}} color="brand"  label="Brand (default)" />
        <Toggle checked={true} onChange={() => {}} color="accent" label="Accent" />
        <Toggle checked={true} onChange={() => {}} color="cta"    label="CTA / Éxito" />
        <Toggle checked={true} onChange={() => {}} color="violet" label="Violet / IA" />
      </VariantBlock>

      <VariantBlock label="Tamaños" description="sm para configuraciones compactas en sidebar. lg para acciones importantes.">
        <Toggle checked={true} onChange={() => {}} size="sm" label="Pequeño — sm" />
        <Toggle checked={true} onChange={() => {}} size="md" label="Mediano — md (default)" />
        <Toggle checked={true} onChange={() => {}} size="lg" label="Grande — lg" />
      </VariantBlock>
    </ShowcaseSection>
  );
};

const TabsSection = () => {
  const [t1, setT1] = useState('board');
  const [t2, setT2] = useState('board');
  const [t3, setT3] = useState('list');

  const TABS = [
    { id: 'board',    label: 'Tablero',     badge: 3 },
    { id: 'list',     label: 'Lista'              },
    { id: 'timeline', label: 'Cronograma', disabled: true },
  ];

  return (
    <ShowcaseSection
      id="tabs"
      title="Tabs"
      tag="molecule"
      when="Cambiar entre vistas del tablero (Kanban/Lista/Calendario), secciones del detalle de tarea, filtros de sprint."
    >
      <VariantBlock label="Underline (default)" description="Para navegación principal dentro de una página. Usa border inferior.">
        <div className="w-full">
          <Tabs tabs={TABS} active={t1} onChange={setT1} variant="underline" />
        </div>
      </VariantBlock>

      <VariantBlock label="Pills" description="Para filtros y categorías secundarias dentro de una sección.">
        <Tabs tabs={TABS} active={t2} onChange={setT2} variant="pills" />
      </VariantBlock>

      <VariantBlock label="Segmented" description="Para toggles de vista (igual que un radio group). Ej: Kanban ↔ Lista.">
        <Tabs tabs={[{id:'list',label:'Lista'},{id:'board',label:'Tablero'},{id:'calendar',label:'Calendario'}]}
          active={t3} onChange={setT3} variant="segmented" />
      </VariantBlock>
    </ShowcaseSection>
  );
};

const ToastSection = () => {
  const { toast } = useToast();
  return (
    <ShowcaseSection
      id="toast"
      title="Toast"
      tag="molecule"
      when="Feedback inmediato post-acción: guardar tarea, error de API, mover tarjeta. No bloquea la UI."
    >
      <VariantBlock
        label="Tipos disponibles — haz click para probar"
        description="Los toasts se auto-descartan en 4 segundos. El error dura 5s. Usa duration:0 para persistentes."
      >
        <Button variant="primary" size="sm"
          onClick={() => toast.success('¡Tarea creada!', { description: 'Se añadió al Sprint 4.' })}>
          Success
        </Button>
        <Button variant="danger" size="sm"
          onClick={() => toast.error('Error de conexión', { duration: 5000, description: 'Verifica tu red e intenta de nuevo.' })}>
          Error (5s)
        </Button>
        <Button variant="secondary" size="sm"
          onClick={() => toast.info('Tarea movida a Revisión')}>
          Info
        </Button>
        <Button variant="secondary" size="sm"
          onClick={() => toast.warning('El sprint supera el límite WIP')}>
          Warning
        </Button>
        <Button variant="ghost" size="sm"
          onClick={() => toast.info('Sin tiempo de cierre — descárdalo manualmente', { duration: 0 })}>
          Persistente (duration: 0)
        </Button>
      </VariantBlock>

      <div className="bg-surface-800/30 rounded-xl p-4 border border-surface-700/30 text-xs text-surface-400 space-y-1">
        <p><strong className="text-surface-200">Setup requerido:</strong> envuelve tu App (o la ruta) con <code className="text-brand-400">&lt;ToastProvider&gt;</code></p>
        <p>En el componente: <code className="text-brand-400">const {'{ toast }'} = useToast()</code></p>
        <p>Luego: <code className="text-brand-400">toast.success('Mensaje')</code></p>
      </div>
    </ShowcaseSection>
  );
};

const TooltipSection = () => (
  <ShowcaseSection
    id="tooltip"
    title="Tooltip"
    tag="atom"
    when="Explicar íconos sin texto visible, mostrar atajos de teclado, datos truncados en tarjetas compactas."
  >
    <VariantBlock
      label="Posiciones — top, bottom, left, right"
      description="Elige la posición según el espacio disponible en pantalla."
    >
      <div className="flex items-center gap-8 py-8">
        <Tooltip content="Encima (top)" placement="top">
          <Button variant="secondary" size="sm">Top</Button>
        </Tooltip>
        <Tooltip content="Debajo (bottom)" placement="bottom">
          <Button variant="secondary" size="sm">Bottom</Button>
        </Tooltip>
        <Tooltip content="A la izquierda" placement="left">
          <Button variant="secondary" size="sm">Left</Button>
        </Tooltip>
        <Tooltip content="A la derecha" placement="right">
          <Button variant="secondary" size="sm">Right</Button>
        </Tooltip>
      </div>
    </VariantBlock>

    <VariantBlock label="Con íconos de acción — caso de uso real">
      <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-800/60 border border-surface-700/30">
        {[
          { tip: 'Editar tarea', path: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
          { tip: 'Mover columna', path: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
          { tip: 'Duplicar', path: 'M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z' },
          { tip: 'Eliminar tarea', path: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' },
        ].map(({ tip, path }) => (
          <Tooltip key={tip} content={tip} placement="top">
            <button className="p-1.5 rounded-lg text-surface-500 hover:text-white hover:bg-surface-700 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={path} />
              </svg>
            </button>
          </Tooltip>
        ))}
      </div>
    </VariantBlock>

    <VariantBlock label="Delay configurable">
      <Tooltip content="Aparece rápido (0ms)" placement="top" delayMs={0}>
        <Button variant="ghost" size="sm">Sin delay</Button>
      </Tooltip>
      <Tooltip content="Espera 300ms (default)" placement="top" delayMs={300}>
        <Button variant="ghost" size="sm">300ms (default)</Button>
      </Tooltip>
      <Tooltip content="Espera 800ms" placement="top" delayMs={800}>
        <Button variant="ghost" size="sm">800ms</Button>
      </Tooltip>
    </VariantBlock>
  </ShowcaseSection>
);

const ProgressSection = () => (
  <ShowcaseSection
    id="progress"
    title="ProgressBar & ProgressCircle"
    tag="atom"
    when="Progreso de proyecto en dashboard, subtareas completadas en KanbanCard, porcentaje de sprint."
  >
    <VariantBlock label="Colores semánticos" description="Usa brand para progreso general, cta para métricas positivas, red para sobrecarga.">
      <div className="space-y-3 w-full max-w-md">
        {([
          { color: 'brand', value: 72, label: 'Sprint 4 · 72% completado' },
          { color: 'cta',   value: 91, label: 'Proyecto Alpha · 91%' },
          { color: 'amber', value: 48, label: 'Presupuesto utilizado · 48%' },
          { color: 'red',   value: 88, label: 'Carga del equipo · 88%' },
        ] as const).map(({ color, value, label }) => (
          <ProgressBar key={color} color={color} value={value} label={label} showLabel size="sm" />
        ))}
      </div>
    </VariantBlock>

    <VariantBlock label="Tamaños de barra" description="xs en KanbanCard (sin label). md/lg en paneles de resumen.">
      <div className="space-y-4 w-full max-w-md">
        {(['xs', 'sm', 'md', 'lg'] as const).map((size) => (
          <div key={size} className="flex items-center gap-3">
            <span className="text-xs text-surface-500 w-6">{size}</span>
            <ProgressBar value={65} size={size} showLabel className="flex-1" />
          </div>
        ))}
      </div>
    </VariantBlock>

    <VariantBlock label="ProgressCircle — para stats del dashboard" description="Versión circular. Útil para el resumen de proyectos en la vista de tarjetas.">
      <div className="flex items-end gap-6">
        {([
          { value: 45, color: 'brand',  size: 48,  label: '45% · sm' },
          { value: 72, color: 'accent', size: 64,  label: '72% · md' },
          { value: 91, color: 'cta',    size: 80,  label: '91% · lg' },
          { value: 30, color: 'violet', size: 48,  label: '30%' },
        ] as const).map(({ value, color, size, label }) => (
          <div key={label} className="flex flex-col items-center gap-2">
            <ProgressCircle value={value} color={color} size={size} />
            <span className="text-[10px] text-surface-500">{label}</span>
          </div>
        ))}
      </div>
    </VariantBlock>
  </ShowcaseSection>
);

const PrioritySection = () => (
  <ShowcaseSection
    id="priority"
    title="Priority & Status"
    tag="atom"
    when="Esquina inferior izquierda de cada KanbanCard, columna de prioridad en vista lista, filtros de tablero."
  >
    <VariantBlock label="Niveles de prioridad" description="Los colores son consistentes en todo el módulo.">
      <div className="flex items-center gap-4 flex-wrap">
        {(['critical', 'high', 'medium', 'low', 'none'] as const).map((level) => (
          <Priority key={level} level={level} showLabel />
        ))}
      </div>
    </VariantBlock>

    <VariantBlock label="Estados de tarea (TaskStatusBadge)" description="El punto de 'in_progress' pulsa para indicar actividad.">
      <div className="flex items-center gap-4 flex-wrap">
        {(['backlog', 'todo', 'in_progress', 'review', 'done', 'blocked'] as const).map((s) => (
          <TaskStatusBadge key={s} status={s} />
        ))}
      </div>
    </VariantBlock>

    <VariantBlock label="DueDate — fecha con color semántico" description="Cambia de color según proximidad: gris → ámbar (3 días) → rojo (vencida).">
      <div className="flex items-center gap-6 flex-wrap">
        <div className="flex flex-col items-center gap-1">
          <DueDate date={new Date(Date.now() - 86400000 * 3)} />
          <span className="text-[10px] text-surface-600">vencida</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <DueDate date={new Date()} />
          <span className="text-[10px] text-surface-600">hoy</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <DueDate date={new Date(Date.now() + 86400000 * 2)} />
          <span className="text-[10px] text-surface-600">2 días</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <DueDate date={new Date(Date.now() + 86400000 * 14)} />
          <span className="text-[10px] text-surface-600">14 días</span>
        </div>
      </div>
    </VariantBlock>
  </ShowcaseSection>
);

const EmptyStateSection = () => (
  <ShowcaseSection
    id="empty-state"
    title="EmptyState"
    tag="molecule"
    when="Columna Kanban vacía, lista de proyectos sin resultados, búsqueda sin coincidencias, primer acceso al módulo."
  >
    <VariantBlock label="compact — dentro de columnas Kanban" description="La más usada en el tablero: columna sin tarjetas.">
      <div className="w-72 border border-dashed border-surface-700/40 rounded-xl bg-surface-900/30">
        <EmptyState variant="compact" icon={<EmptyIcons.Tasks />}
          title="Sin tareas" description="Arrastra o crea una nueva."
          action={<Button size="sm" variant="ghost">+ Agregar tarea</Button>} />
      </div>
    </VariantBlock>

    <VariantBlock label="card — sección con borde punteado" description="Para áreas grandes vacías: lista de proyectos, miembros del equipo.">
      <EmptyState variant="card" icon={<EmptyIcons.Projects />}
        title="No hay proyectos activos"
        description="Crea tu primer proyecto para comenzar a organizar el trabajo del equipo."
        action={<Button size="sm" variant="primary">Crear proyecto</Button>}
        secondaryAction="o importa desde Jira / Trello" />
    </VariantBlock>

    <VariantBlock label="default — página completa" description="Para rutas vacías o primer acceso. Centrado en la pantalla.">
      <EmptyState icon={<EmptyIcons.Search />}
        title="Sin resultados para &quot;kanban responsive&quot;"
        description="Intenta con otro término o ajusta los filtros de búsqueda."
        action={<Button size="sm" variant="secondary">Limpiar filtros</Button>} />
    </VariantBlock>
  </ShowcaseSection>
);

const KanbanSection = () => (
  <ShowcaseSection
    id="kanban"
    title="KanbanColumn & KanbanCard"
    tag="molecule"
    when="El tablero principal del módulo. KanbanColumn agrupa tarjetas por estado. KanbanCard representa una tarea."
  >
    <VariantBlock label="Tablero con columnas y tarjetas variadas" description="Combina todos los estados y prioridades. El drag-and-drop se agrega con @dnd-kit/core.">
      <div className="flex gap-4 overflow-x-auto pb-4 w-full">
        <KanbanColumn title="Backlog" count={1} color="var(--color-surface-500)" onAddCard={() => {}}>
          <KanbanCard
            title="Diseño de wireframes del tablero"
            priority="low"
            tags={[{ label: 'UX', color: 'violet' }]}
            assignees={[{ name: 'Cris Vera', color: 'cta' }]}
          />
        </KanbanColumn>

        <KanbanColumn title="En progreso" count={2} color="var(--color-brand-500)" wipLimit={3} onAddCard={() => {}}>
          <KanbanCard
            title="Refactor módulo de autenticación"
            description="Migrar a JWT con refresh automático y validación en backend."
            priority="high"
            dueDate={new Date()}
            assignees={[{ name: 'Ana López', color: 'brand' }, { name: 'Bob Ruiz', color: 'accent' }]}
            tags={[{ label: 'Backend', color: 'brand' }, { label: 'Seguridad', color: 'red' }]}
            subtasks={[4, 10]}
            commentCount={3}
            attachmentCount={2}
          />
          <KanbanCard
            title="Implementar KanbanCard component"
            priority="medium"
            dueDate={new Date(Date.now() + 2 * 86400000)}
            assignees={[{ name: 'Claudia', color: 'violet' }]}
            tags={[{ label: 'Frontend', color: 'accent' }]}
            subtasks={[7, 8]}
            commentCount={1}
          />
        </KanbanColumn>

        <KanbanColumn title="Revisión" count={1} color="var(--color-violet-500)" onAddCard={() => {}}>
          <KanbanCard
            title="Pruebas unitarias de componentes"
            priority="critical"
            dueDate={new Date(Date.now() - 86400000)}
            assignees={[{ name: 'Eve', color: 'surface' }, { name: 'Frank', color: 'brand' }, { name: 'Dani', color: 'cta' }, { name: 'Ana', color: 'accent' }]}
            tags={[{ label: 'QA', color: 'amber' }]}
            commentCount={5}
          />
        </KanbanColumn>

        <KanbanColumn title="Listo" count={0} color="var(--color-cta-500)" onAddCard={() => {}}>
          {/* Columna vacía — muestra el EmptyState integrado */}
        </KanbanColumn>

        <KanbanColumn title="Cargando..." count={3} loading color="var(--color-surface-600)">
          {/* Skeleton integrado */}
        </KanbanColumn>
      </div>
    </VariantBlock>
  </ShowcaseSection>
);

// ═══════════════════════════════════════════════════════════════════════════
// Página principal
// ═══════════════════════════════════════════════════════════════════════════

export const ComponentsShowcase = () => {
  const [activeSection, setActiveSection] = useState('button');
  const mainRef = useRef<HTMLDivElement>(null);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="flex h-full min-h-screen bg-surface-950">
      {/* ── Sidebar de navegación ───────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-52 shrink-0 border-r border-surface-800 bg-surface-950/80 sticky top-0 h-screen overflow-y-auto">
        <div className="px-4 pt-6 pb-3 border-b border-surface-800">
          <p className="text-xs font-bold text-white uppercase tracking-widest">Design System</p>
          <p className="text-[10px] text-surface-500 mt-0.5">Todos los componentes</p>
        </div>

        <div className="px-2 py-3 space-y-0.5 flex-1">
          {NAV_SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className={[
                'w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors duration-150',
                activeSection === s.id
                  ? 'bg-brand-500/15 text-white border border-brand-500/30'
                  : 'text-surface-400 hover:text-white hover:bg-surface-800',
              ].join(' ')}
            >
              <span>{s.label}</span>
              <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border ${TAG_COLORS[s.tag]}`}>
                {s.tag === 'atom' ? 'A' : 'M'}
              </span>
            </button>
          ))}
        </div>

        <div className="px-4 py-3 border-t border-surface-800 text-[10px] text-surface-600 space-y-0.5">
          <div className="flex items-center gap-1.5"><span className={`px-1.5 py-0.5 rounded-full border ${TAG_COLORS.atom}`}>A</span> Atom</div>
          <div className="flex items-center gap-1.5"><span className={`px-1.5 py-0.5 rounded-full border ${TAG_COLORS.molecule}`}>M</span> Molecule</div>
        </div>
      </aside>

      {/* ── Área de contenido ───────────────────────────────────────── */}
      <main ref={mainRef} className="flex-1 overflow-y-auto">
        {/* Hero */}
        <div className="sticky top-0 z-10 border-b border-surface-800 bg-surface-950/90 backdrop-blur-sm px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-base font-bold text-white">Componentes Reutilizables</h1>
              <p className="text-xs text-surface-500">Módulo de Gestión de Proyectos · CodeForge Design System</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge color="brand" dot dotPulse>{NAV_SECTIONS.filter(s=>s.tag==='atom').length} atoms</Badge>
              <Badge color="violet">{NAV_SECTIONS.filter(s=>s.tag==='molecule').length} molecules</Badge>
            </div>
          </div>
        </div>

        {/* Secciones */}
        <div className="px-8 py-8 space-y-16 max-w-4xl">
          <ButtonSection />
          <InputSection />
          <BadgeSection />
          <AvatarSection />
          <AvatarGroupSection />
          <SpinnerSection />
          <CardSection />
          <AlertSection />
          <ModalSection />
          <DropdownSection />
          <SelectSection />
          <ToggleSection />
          <TabsSection />
          <ToastSection />
          <TooltipSection />
          <ProgressSection />
          <PrioritySection />
          <EmptyStateSection />
          <KanbanSection />
        </div>
      </main>
    </div>
  );
};
