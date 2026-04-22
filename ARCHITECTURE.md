# Arquitectura del Proyecto - Screaming Architecture

## 📐 Introducción a Screaming Architecture

**Screaming Architecture** es una filosofía arquitectónica donde la estructura de carpetas **grita** el propósito de la aplicación. En lugar de organizar por tipos de archivo (controllers, services, components), se organiza por **features** o **dominios** de negocio.

## 🏗 Estructura Implementada

### Niveles de Organización

#### 1. **Features** (`src/features/`)
Cada feature es autónoma y auto-contenida. Ejemplo: `auth/`

```
src/features/auth/
├── pages/           # Páginas de este módulo
├── components/      # Componentes específicos del módulo
├── hooks/          # Custom hooks
├── store/          # Estado (Zustand)
├── api/            # Servicios HTTP
├── types/          # TypeScript types
├── constants/      # Constantes locales
├── utils/          # Utilidades
└── index.ts        # Exportaciones públicas
```

**Ventajas:**
- ✅ Feature es completamente independiente
- ✅ Fácil de entender qué pertenece a qué módulo
- ✅ Facilita eliminación de features sin afectar otras
- ✅ Escalable para múltiples equipos

#### 2. **Shared** (`src/shared/`)
Código compartido entre múltiples features

```
src/shared/
├── api/            # Configuración HTTP global
├── components/     # Componentes reutilizables
├── types/         # Tipos globales
├── constants/     # Constantes globales
├── hooks/         # Custom hooks compartidos
└── utils/         # Utilidades comunes
```

#### 3. **Config** (`src/config/`)
Configuración centralizada de la aplicación

```
src/config/
├── router.tsx     # Definición de rutas
├── store.ts       # Setup de stores globales
└── api.ts         # Configuración de API global
```

## 📦 Módulo de Autenticación (Auth)

### Estructura Completa

```
src/features/auth/
│
├── 📄 index.ts
│   └── Exportaciones públicas del módulo
│
├── 📁 pages/
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── VerifyEmailPage.tsx
│   └── Verify2FAPage.tsx
│
├── 📁 components/
│   ├── LoginForm.tsx
│   └── RegisterForm.tsx
│
├── 📁 hooks/
│   ├── useAuth.ts        # Hook principal
│   ├── useLogin.ts       # Lógica de login
│   └── useRegister.ts    # Lógica de registro
│
├── 📁 store/
│   └── authStore.ts      # Estado global (Zustand)
│
├── 📁 api/
│   └── authApi.ts        # Servicios HTTP
│
├── 📁 types/
│   └── auth.types.ts     # Tipos TypeScript
│
├── 📁 constants/
│   └── auth.constants.ts # Constantes del módulo
│
└── 📁 utils/
    └── tokenStorage.ts   # Manejo de tokens
```

### Flujo de Datos en Auth

```
┌─────────────┐
│ LoginForm   │
│ (Component) │
└──────┬──────┘
       │
       ├─ useLogin() Hook
       │   ├─ Valida con Zod
       │   ├─ Llama authApi.login()
       │   └─ Actualiza useAuthStore()
       │
       ├─ authApi.login()
       │   ├─ POST /auth/login
       │   ├─ axiosInstance (interceptores)
       │   └─ Retorna respuesta
       │
       └─ useAuthStore() (Zustand)
           ├─ Guarda user
           ├─ Guarda tokens
           └─ Guarda accessToken
                │
                ├─ tokenStorage.setTokens()
                │   └─ localStorage
                │
                └─ ProtectedRoute
                    └─ Permite acceso a rutas
```

## 🔄 Flujos de Datos

### Login Flow
```
User Input (Form)
    ↓
useLogin Hook
    ↓ (valida con Zod)
authApi.login(credentials)
    ↓
axiosInstance (interceptor request)
    ↓
POST /auth/login (Backend)
    ↓
Response { accessToken, refreshToken, user }
    ↓
useAuthStore.setUser()
    ↓
tokenStorage.setTokens() (localStorage)
    ↓
ProtectedRoute permite acceso
    ↓
/dashboard
```

### Refresh Token Flow
```
Request a API Protegida
    ↓
axiosInstance (interceptor response)
    ↓ (si error 401)
POST /auth/refresh { refreshToken }
    ↓
Backend retorna nuevo accessToken
    ↓
localStorage.setItem('accessToken', newToken)
    ↓
Reintentar request original
```

## 🎯 Patrones Utilizados

### 1. **Custom Hooks Pattern**
```typescript
// Hook encapsula lógica de negocio
export const useLogin = () => {
  const [state, setState] = useState(...);
  const { setUser } = useAuthStore();
  
  const login = async (credentials) => {
    // Lógica aquí
  };
  
  return { login, isLoading, error };
};
```

### 2. **Zustand Store Pattern**
```typescript
// Estado global y acciones en un único lugar
export const useAuthStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```

### 3. **API Service Class Pattern**
```typescript
// Centraliza todas las llamadas HTTP
class AuthApi {
  async login(credentials) {
    return axiosInstance.post('/auth/login', credentials);
  }
}

export const authApi = new AuthApi();
```

### 4. **Protected Routes Pattern**
```typescript
// Protege rutas autenticadas
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>
```

### 5. **Validation with Zod + React Hook Form**
```typescript
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const { register } = useForm({
  resolver: zodResolver(schema),
});
```

## 📊 Dependencias Entre Módulos

```
App.tsx
  ↓
Router (config/router.tsx)
  ├─ ProtectedRoute (shared/components)
  │   ├─ useAuth (features/auth/hooks)
  │   │   └─ useAuthStore (features/auth/store)
  │   │       └─ tokenStorage (features/auth/utils)
  │   │
  │   └─ Dashboard (protected)
  │
  ├─ LoginPage (features/auth/pages)
  │   ├─ LoginForm (features/auth/components)
  │   │   └─ useLogin (features/auth/hooks)
  │   │       ├─ authApi (features/auth/api)
  │   │       │   └─ axiosInstance (shared/api)
  │   │       │       └─ API_CONFIG (shared/constants)
  │   │       └─ useAuthStore
  │   │
  │   └─ useAuth
  │
  └─ RegisterPage (features/auth/pages)
      ├─ RegisterForm (features/auth/components)
      │   └─ useRegister (features/auth/hooks)
      │       ├─ authApi
      │       └─ useAuthStore
      │
      └─ useAuth
```

## 🔌 Extensibilidad

### Agregar Nuevo Feature

1. **Crear carpeta de feature**
```
src/features/projects/
├── pages/
├── components/
├── hooks/
├── store/
├── api/
├── types/
├── constants/
├── utils/
└── index.ts
```

2. **Exportar públicamente**
```typescript
// projects/index.ts
export { ProjectsPage } from './pages/ProjectsPage';
export { useProjects } from './hooks/useProjects';
// ...
```

3. **Agregar rutas**
```typescript
// config/router.tsx
import { ProjectsPage } from '@/features/projects';

{
  path: '/projects',
  element: (
    <ProtectedRoute>
      <ProjectsPage />
    </ProtectedRoute>
  ),
}
```

## 🧩 Composición de Componentes

```typescript
// Nivel 1: Componente Base
const LoginForm = () => {
  const { login, isLoading } = useLogin();
  // renderizar form
};

// Nivel 2: Página
const LoginPage = () => {
  return (
    <Layout>
      <LoginForm />
    </Layout>
  );
};

// Nivel 3: Router
{
  path: '/login',
  element: <LoginPage />,
}
```

## 🔐 Seguridad

### Token Management
```typescript
// Automático en axiosInstance
- Request: Agrega Bearer token
- Response: Refresca automáticamente en 401
- Storage: localStorage con keys específicas
```

### Validación de Datos
```typescript
// Todos los formularios validados con Zod
- Email format
- Password requirements
- Campo requerido
- Custom validation rules
```

## 📈 Escalabilidad

Esta arquitectura soporta:

✅ Múltiples equipos trabajando en paralelo  
✅ Agregar nuevos features sin afectar otros  
✅ Remover features sin quebrar la app  
✅ Lazy loading de módulos  
✅ Code splitting automático con Vite  

## 🎓 Conclusión

**Screaming Architecture** con **Zustand** + **React Hook Form** + **Zod** crea una base sólida, escalable y mantenible para aplicaciones React grandes.

- **Screaming**: La estructura expresa el propósito
- **Zustand**: Estado simple y potente
- **React Hook Form**: Formularios eficientes
- **Zod**: Validación type-safe
