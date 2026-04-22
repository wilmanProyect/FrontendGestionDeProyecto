# Quick Start - Guía Rápida

Comienza a desarrollar en 5 minutos.

## 🚀 Instalación Rápida

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar env
cp .env.example .env.local

# 3. Iniciar dev server
npm run dev
```

Accede a `http://localhost:5173`

## 🏗 Crear Nueva Página

```bash
# 1. Crear carpeta
mkdir -p src/features/myfeature/pages

# 2. Crear componente
cat > src/features/myfeature/pages/MyPage.tsx << 'EOF'
export const MyPage = () => {
  return <div>My Page</div>;
};
EOF

# 3. Agregar ruta en src/config/router.tsx
{
  path: '/my-page',
  element: <MyPage />,
}
```

## 🎣 Usar Hook de Auth

```typescript
import { useAuth } from '@/features/auth';

const MyComponent = () => {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) return <div>Not logged in</div>;
  
  return (
    <div>
      <p>Hello, {user?.firstName}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

## 🛡️ Proteger Ruta

```typescript
import { ProtectedRoute } from '@/shared/components/ProtectedRoute';

{
  path: '/dashboard',
  element: (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  ),
}
```

## 📝 Crear Formulario

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Min 6 chars'),
});

type FormData = z.infer<typeof schema>;

export const MyForm = () => {
  const { register, formState: { errors }, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} placeholder="Email" />
      {errors.email && <span>{errors.email.message}</span>}
      
      <input {...register('password')} type="password" placeholder="Password" />
      {errors.password && <span>{errors.password.message}</span>}
      
      <button type="submit">Submit</button>
    </form>
  );
};
```

## 🔄 Llamar API

```typescript
import { axiosInstance } from '@/shared/api/axiosInstance';

// GET
const response = await axiosInstance.get('/projects');

// POST
const response = await axiosInstance.post('/projects', {
  name: 'My Project'
});

// PATCH
const response = await axiosInstance.patch(`/projects/${id}`, {
  name: 'Updated'
});

// DELETE
await axiosInstance.delete(`/projects/${id}`);
```

## 💾 Usar Store

```typescript
import { useAuthStore } from '@/features/auth';

const MyComponent = () => {
  const { user, setUser, logout } = useAuthStore();
  
  const handleLogin = (newUser) => {
    setUser(newUser, 'token', 'refresh-token');
  };
  
  const handleLogout = () => {
    logout();
  };
  
  return <div>{user?.email}</div>;
};
```

## 🎨 Estilos Tailwind

```tsx
// Usar clases de Tailwind
<div className="min-h-screen flex items-center justify-center bg-gray-50">
  <div className="w-full max-w-md space-y-8">
    <h1 className="text-3xl font-bold text-gray-900">Title</h1>
    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
      Click me
    </button>
  </div>
</div>
```

## 🧪 Build y Deploy

```bash
# Build
npm run build

# Preview build localmente
npm run preview

# Resultado en dist/
```

## 📋 Estructura Básica

```
src/
├── features/auth/           # Feature módulo
│   ├── pages/              # Páginas
│   ├── components/         # Componentes
│   ├── hooks/              # Custom hooks
│   ├── store/              # Estado
│   ├── api/                # Servicios HTTP
│   └── index.ts            # Exportar público
├── shared/                 # Código compartido
│   ├── api/               # Axios instance
│   ├── components/        # Componentes reutilizables
│   └── types/             # Tipos globales
├── config/                # Configuración
│   └── router.tsx        # Rutas
└── App.tsx
```

## 🔧 Comandos Útiles

```bash
npm run dev           # Iniciar dev server
npm run build         # Build producción
npm run preview       # Preview del build
npm run lint          # Ejecutar ESLint
```

## 🐛 Debugging

```bash
# Console en navegador (F12)
console.log(variable);

# DevTools
- Redux DevTools para estado
- React DevTools para componentes
- Network tab para APIs

# Terminal
npm run lint  # Errores de código
```

## 📁 Path Alias

```typescript
// ✅ Usar esto
import { useAuth } from '@/features/auth';
import { axiosInstance } from '@/shared/api';

// ❌ No esto
import { useAuth } from '../../../features/auth';
import { axiosInstance } from '../../../shared/api';
```

## 🚀 Tips

1. **Componentes pequeños**: Divide en componentes reutilizables
2. **Tipos claros**: Usa TypeScript strict mode
3. **Valida todo**: Zod para schemas
4. **Maneja errores**: Try-catch en async
5. **Constantes**: No hardcodes en código
6. **Reutiliza hooks**: Extrae lógica a custom hooks

## ❓ Preguntas Frecuentes

**¿Cómo agregar nueva página?**
- Crear en `features/[feature]/pages/`
- Exportar en `index.ts`
- Agregar ruta en `router.tsx`

**¿Cómo proteger ruta?**
- Usar `<ProtectedRoute>` component

**¿Cómo llamar API?**
- Usar `axiosInstance` de `shared/api`
- Crear servicio en `features/[feature]/api/`

**¿Cómo validar formulario?**
- Usar Zod + React Hook Form

**¿Cómo acceder a estado global?**
- Importar y usar `useAuthStore()`

## 📚 Documentación Completa

- [README](./README.md) - Visión general
- [ARCHITECTURE](./ARCHITECTURE.md) - Arquitectura detallada
- [SETUP](./SETUP.md) - Configuración avanzada
- [API_INTEGRATION](./API_INTEGRATION.md) - Integración con backend
- [CONTRIBUTING](./CONTRIBUTING.md) - Guía de contribución

¡Listo para empezar! 🎉
