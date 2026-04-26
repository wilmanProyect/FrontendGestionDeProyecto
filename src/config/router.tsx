/**
 * Configuración de rutas principales de la aplicación
 */

import { useState } from 'react';
import { createBrowserRouter, type RouteObject, Navigate } from 'react-router-dom';
import { LoginPage, RegisterPage } from '@/features/auth';
import { ProtectedRoute } from '@/shared/components/ProtectedRoute';
import { VerifyEmailPage } from '@/features/auth/pages/VerifyEmailPage';
import { Verify2FAPage } from '@/features/auth/pages/Verify2FAPage';
import { DashboardPage } from '@/features/auth/pages/DashboardPage';
import { AppLayout } from '@/shared/components/AppLayout';
import { Alert } from '@/shared/components/Alert';
import { Avatar } from '@/shared/components/Avatar';
import { AvatarGroup } from '@/shared/components/AvatarGroup';
import { Badge } from '@/shared/components/Badge';
import { Button } from '@/shared/components/Button';
import { Card, CardBody, CardHeader, CardTitle, StatCard } from '@/shared/components/Card';
import { DropdownMenu } from '@/shared/components/DropdownMenu';
import { EmptyState, EmptyIcons } from '@/shared/components/EmptyState';
import { FormSection, FormGrid } from '@/shared/components/FormField';
import { Input } from '@/shared/components/Input';
import { KanbanColumn, KanbanCard } from '@/shared/components/Kanban';
import { Modal } from '@/shared/components/Modal';
import { Priority, TaskStatusBadge } from '@/shared/components/Priority';
import { ProgressBar, ProgressCircle } from '@/shared/components/ProgressBar';
import { Select } from '@/shared/components/Select';
import { Spinner, Skeleton, SkeletonCard } from '@/shared/components/Spinner';
import { Tabs, TabPanel } from '@/shared/components/Tabs';
import { ToastProvider, useToast } from '@/shared/components/Toast';
import { Toggle } from '@/shared/components/Toggle';
import { Tooltip } from '@/shared/components/Tooltip';

// ── Demos para componentes con estado ───────────────────────────────────

const ModalDemo = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-4">
      <Button onClick={() => setOpen(true)}>Abrir Modal de Ejemplo</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Tarea: Refactor de Auth">
        <p className="text-surface-300 text-sm">Este es un modal real usando React Portals.</p>
      </Modal>
    </div>
  );
};

const TabsDemo = () => {
  const [active, setActive] = useState('board');
  return (
    <Tabs
      tabs={[
        { id: 'board', label: 'Tablero' },
        { id: 'list', label: 'Lista' },
        { id: 'timeline', label: 'Cronograma', disabled: true },
      ]}
      active={active}
      onChange={setActive}
    />
  );
};

const ToggleDemo = () => {
  const [enabled, setEnabled] = useState(true);
  return <Toggle checked={enabled} onChange={setEnabled} label="Habilitar notificaciones" description="Recibe alertas de IA" />;
};

const ToastDemo = () => {
  const { toast } = useToast();
  return (
    <div className="flex flex-wrap gap-4">
      <Button variant="primary" onClick={() => toast.success('¡Tarea guardada!', { description: 'Se ha sincronizado con el servidor.' })}>Lanzar Éxito</Button>
      <Button variant="danger" onClick={() => toast.error('Error de conexión', { duration: 5000 })}>Lanzar Error</Button>
      <Button variant="secondary" onClick={() => toast.info('Nueva actualización disponible')}>Lanzar Info</Button>
      <Button variant="secondary" onClick={() => toast.warning('Tu sesión expirará pronto')}>Lanzar Warning</Button>
    </div>
  );
};

// Página 404
const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-surface-950">
    <div className="text-center">
      <h1 className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-300">
        404
      </h1>
      <p className="mt-4 text-surface-400 text-lg">Página no encontrada</p>
      <a
        href="/"
        className="mt-6 inline-flex items-center gap-2 text-sm text-brand-400 hover:text-brand-300 transition-colors duration-200"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Volver al inicio
      </a>
    </div>
  </div>
);

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/verify-email',
    element: <VerifyEmailPage />,
  },
  {
    path: '/verify-2fa',
    element: <Verify2FAPage />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },

  // ── Rutas de Componentes Reutilizables ──────────────────────────────────
  {
    path: '/components/alert',
    element: (
      <AppLayout>
        <div className="p-8 space-y-4 max-w-2xl">
          <h2 className="text-xl font-bold text-white mb-6">Alert Samples</h2>
          <Alert variant="info" title="Info">Mensaje informativo.</Alert>
          <Alert variant="success" title="Éxito">Operación completada.</Alert>
          <Alert variant="warning" title="Atención">Revisa tu conexión.</Alert>
          <Alert variant="error" title="Error">Acceso denegado.</Alert>
        </div>
      </AppLayout>
    ),
  },
  {
    path: '/components/avatar',
    element: (
      <AppLayout>
        <div className="p-8">
          <h2 className="text-xl font-bold text-white mb-6">Avatar Samples</h2>
          <div className="flex items-end gap-6">
            <Avatar name="John Doe" size="xs" status="online" />
            <Avatar name="Jane Smith" size="sm" color="brand" status="away" />
            <Avatar name="Robert Fox" size="md" color="accent" status="busy" />
            <Avatar name="Albert Flores" size="lg" color="cta" status="offline" />
            <Avatar name="Kathryn Murphy" size="xl" color="violet" />
          </div>
        </div>
      </AppLayout>
    ),
  },
  {
    path: '/components/avatar-group',
    element: (
      <AppLayout>
        <div className="p-8">
          <h2 className="text-xl font-bold text-white mb-6">AvatarGroup Samples</h2>
          <div className="space-y-8">
            <AvatarGroup
              users={[
                { name: 'Ana', color: 'brand' },
                { name: 'Bob', color: 'accent' },
                { name: 'Cris', color: 'cta' },
                { name: 'Dani', color: 'violet' },
                { name: 'Eve', color: 'surface' },
              ]}
              max={3}
              size="md"
            />
          </div>
        </div>
      </AppLayout>
    ),
  },
  {
    path: '/components/badge',
    element: (
      <AppLayout>
        <div className="p-8">
          <h2 className="text-xl font-bold text-white mb-6">Badge Samples</h2>
          <div className="flex flex-wrap gap-3">
            <Badge color="brand" dot>Brand</Badge>
            <Badge color="accent" dot dotPulse>Accent</Badge>
            <Badge color="cta">CTA</Badge>
            <Badge color="violet">Violet</Badge>
            <Badge color="red">Red</Badge>
            <Badge color="amber">Amber</Badge>
            <Badge color="surface">Surface</Badge>
          </div>
        </div>
      </AppLayout>
    ),
  },
  {
    path: '/components/button',
    element: (
      <AppLayout>
        <div className="p-8 space-y-8">
          <h2 className="text-xl font-bold text-white">Button Samples</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary Action</Button>
            <Button variant="secondary">Secondary Action</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="danger">Danger Action</Button>
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button loading>Processing</Button>
            <Button disabled>Disabled</Button>
          </div>
        </div>
      </AppLayout>
    ),
  },
  {
    path: '/components/card',
    element: (
      <AppLayout>
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Default Card</CardTitle>
            </CardHeader>
            <CardBody>
              <p className="text-surface-400 text-sm">Este es el cuerpo de una tarjeta estándar con el tema CodeForge.</p>
            </CardBody>
          </Card>
          <StatCard label="Proyectos Activos" value="12" delta="+2 hoy" color="accent" />
          <Card variant="glass" hoverable>
            <CardTitle className="mb-2">Glass Card</CardTitle>
            <p className="text-surface-300 text-xs">Tarjeta con efecto blur y borde sutil.</p>
          </Card>
        </div>
      </AppLayout>
    ),
  },
  {
    path: '/components/dropdown',
    element: (
      <AppLayout>
        <div className="p-8">
          <h2 className="text-xl font-bold text-white mb-6">Dropdown Samples</h2>
          <DropdownMenu
            trigger={<Button variant="secondary">Acciones ⋮</Button>}
            items={[
              { label: 'Editar', onClick: () => console.log('edit') },
              { type: 'divider' },
              { label: 'Eliminar', danger: true },
            ]}
          />
        </div>
      </AppLayout>
    ),
  },
  {
    path: '/components/empty-state',
    element: (
      <AppLayout>
        <div className="p-8">
          <EmptyState icon={<EmptyIcons.Kanban />} title="No hay tareas" description="Crea una para comenzar." />
        </div>
      </AppLayout>
    ),
  },
  {
    path: '/components/form-field',
    element: (
      <AppLayout>
        <div className="p-8 max-w-2xl">
          <FormSection title="Sección de Formulario" description="Ejemplo de organización de campos.">
            <FormGrid>
              <Input label="Nombre" placeholder="Juan" />
              <Input label="Apellido" placeholder="Pérez" />
            </FormGrid>
          </FormSection>
        </div>
      </AppLayout>
    ),
  },
  {
    path: '/components/input',
    element: (
      <AppLayout>
        <div className="p-8 max-w-md space-y-6">
          <Input label="Email" type="email" placeholder="usuario@codeforge.com" hint="Nunca compartiremos tu correo." />
          <Input label="Contraseña" type="password" placeholder="••••••••" error="La contraseña es demasiado corta" />
        </div>
      </AppLayout>
    ),
  },
  {
    path: '/components/kanban',
    element: (
      <AppLayout>
        <div className="p-8">
          <h2 className="text-xl font-bold text-white mb-6">Kanban Molecules</h2>
          <div className="flex gap-6 overflow-x-auto pb-4">
            <KanbanColumn title="En Progreso" count={1} color="var(--color-brand-500)">
              <KanbanCard 
                title="Refactor de Rutas" 
                description="Implementar las nuevas rutas de componentes compartidos."
                priority="high"
                dueDate={new Date()}
                assignees={[{ name: 'Claudia', color: 'brand' }]}
                tags={[{ label: 'Frontend', color: 'accent' }]}
                subtasks={[4, 10]}
                commentCount={3}
              />
            </KanbanColumn>
            <KanbanColumn title="Hecho" count={0} color="var(--color-cta-500)">
              {/* Columna vacía */}
            </KanbanColumn>
          </div>
        </div>
      </AppLayout>
    ),
  },
  {
    path: '/components/modal',
    element: (
      <AppLayout>
        <div className="p-8">
          <h2 className="text-xl font-bold text-white mb-6">Modal Demo</h2>
          <ModalDemo />
        </div>
      </AppLayout>
    ),
  },
  {
    path: '/components/priority',
    element: (
      <AppLayout>
        <div className="p-8 space-y-6">
          <h2 className="text-xl font-bold text-white mb-6">Priority & Status</h2>
          <div className="flex gap-4"><Priority level="critical" showLabel /><Priority level="high" showLabel /></div>
          <div className="flex gap-4"><TaskStatusBadge status="in_progress" /><TaskStatusBadge status="done" /></div>
        </div>
      </AppLayout>
    ),
  },
  {
    path: '/components/progress-bar',
    element: (
      <AppLayout>
        <div className="p-8 space-y-8 max-w-md">
          <h2 className="text-xl font-bold text-white">Progress Samples</h2>
          <ProgressBar value={65} label="Sprint Progress" showLabel />
          <ProgressCircle value={40} color="accent" />
        </div>
      </AppLayout>
    ),
  },
  {
    path: '/components/select',
    element: (
      <AppLayout>
        <div className="p-8 max-w-xs">
          <Select
            label="Prioridad"
            options={[
              { label: 'Baja', value: 'low' },
              { label: 'Media', value: 'med' },
              { label: 'Alta', value: 'high' },
            ]}
          />
        </div>
      </AppLayout>
    ),
  },
  {
    path: '/components/skeleton',
    element: (
      <AppLayout>
        <div className="p-8 max-w-4xl space-y-10">
          <h2 className="text-xl font-bold text-white">Skeleton Atoms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <SkeletonCard />
            <div className="space-y-4">
              <Skeleton height="2.5rem" width="70%" rounded="lg" />
              <Skeleton lines={4} gap="1rem" />
            </div>
          </div>
        </div>
      </AppLayout>
    ),
  },
  {
    path: '/components/spinner',
    element: (
      <AppLayout>
        <div className="p-8 flex items-center gap-8">
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </div>
      </AppLayout>
    ),
  },
  {
    path: '/components/tabs',
    element: (
      <AppLayout>
        <div className="p-8">
          <h2 className="text-xl font-bold text-white mb-6">Tabs Demo</h2>
          <TabsDemo />
        </div>
      </AppLayout>
    ),
  },
  {
    path: '/components/toast',
    element: (
      <ToastProvider>
        <AppLayout>
          <div className="p-8">
            <h2 className="text-xl font-bold text-white mb-6">Toast Molecule</h2>
            <ToastDemo />
          </div>
        </AppLayout>
      </ToastProvider>
    ),
  },
  {
    path: '/components/toggle',
    element: (
      <AppLayout>
        <div className="p-8">
          <h2 className="text-xl font-bold text-white mb-6">Toggle Demo</h2>
          <ToggleDemo />
        </div>
      </AppLayout>
    ),
  },
  {
    path: '/components/tooltip',
    element: (
      <AppLayout>
        <div className="p-8">
          <Tooltip content="Información útil">
            <Button variant="ghost">Hover me</Button>
          </Tooltip>
        </div>
      </AppLayout>
    ),
  },

  {
    path: '*',
    element: <NotFoundPage />,
  },
];

export const router = createBrowserRouter(routes);
