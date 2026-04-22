# Frontend Gestión de Proyectos - ERP

Sistema de frontend para la gestión de proyectos empresarial, construido con React, TypeScript y arquitectura Screaming Architecture.

## 📋 Descripción

Este es el frontend del sistema ERP de gestión de proyectos. Incluye módulos completos para autenticación, gestión de proyectos, tareas, comentarios y más.

## 🎯 Características

- ✅ Autenticación segura con JWT y refresh tokens
- ✅ Autenticación de dos factores (2FA)
- ✅ Gestión de usuarios y roles
- ✅ Tablero Kanban interactivo
- ✅ Gestión de tareas con prioridades
- ✅ Sistema de comentarios y archivos
- ✅ Reportes y análisis
- ✅ Arquitectura escalable y mantenible

## 🛠 Stack Tecnológico

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **React Router v6** - Routing
- **Zustand** - State management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **ShadcN/UI** - Component library
- **Vite** - Build tool

### Herramientas
- **ESLint** - Code linting
- **TypeScript** - Static type checking

## 🚀 Inicio Rápido

### Requisitos Previos
- Node.js >= 18.0.0
- npm >= 9.0.0

### Instalación

1. Clonar el repositorio
```bash
git clone <repo-url>
cd FrontendGestionDeProyecto
```

2. Instalar dependencias
```bash
npm install
```

3. Configurar variables de entorno
```bash
cp .env.example .env.local
```

4. Iniciar servidor de desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📁 Estructura del Proyecto

```
src/
├── config/              # Configuración global
│   └── router.tsx      # Definición de rutas
├── features/           # Módulos de features (screaming architecture)
│   └── auth/          # Módulo de autenticación
│       ├── pages/
│       ├── components/
│       ├── hooks/
│       ├── store/
│       ├── api/
│       ├── types/
│       ├── constants/
│       ├── utils/
│       └── index.ts
├── shared/            # Código compartido
│   ├── api/          # Configuración HTTP
│   ├── components/   # Componentes reutilizables
│   ├── types/        # Tipos globales
│   ├── constants/    # Constantes globales
│   ├── hooks/        # Custom hooks
│   └── utils/        # Utilidades
├── App.tsx
├── main.tsx
└── index.css
```

## 🔐 Autenticación

### Flujo de Login
1. Usuario ingresa credenciales en `/login`
2. Backend valida y responde con tokens o temporaryToken (si requiere 2FA)
3. Si no requiere 2FA → Store guarda tokens → Redirige a `/dashboard`
4. Si requiere 2FA → Guarda temporaryToken → Redirige a `/verify-2fa`

### Flujo de Registro
1. Usuario completa formulario en `/register`
2. Backend crea usuario y envía email de verificación
3. Usuario completa verificación en `/verify-email`
4. Redirige a `/login`

### Protección de Rutas
- Las rutas protegidas usan el componente `ProtectedRoute`
- Solo usuarios autenticados pueden acceder a `/dashboard`
- Los tokens se guardan en localStorage
- Refrescamiento automático en caso de expiración

## 🔄 Manejo de Estado

### Zustand Store (Auth)
```typescript
const { user, isAuthenticated, accessToken } = useAuthStore();
```

### Hooks Personalizados
```typescript
// Hook principal de autenticación
const { user, logout, isAuthenticated } = useAuth();

// Hook para login
const { login, isLoading, error } = useLogin();

// Hook para registro
const { register, isLoading, error } = useRegister();
```

## 📡 Integración con APIs

Todos los servicios HTTP están centralizados en `src/features/auth/api/authApi.ts`

### Configuración Automática
- **Base URL**: Desde variable de entorno `VITE_API_BASE_URL`
- **Timeout**: 30 segundos
- **Interceptores**: Manejo automático de tokens y refresh
- **Error Handling**: Errores 401 disparan refresh automático

## 🎨 Estilos

El proyecto usa **Tailwind CSS** para estilos. Todos los componentes incluyen:
- Responsive design
- Dark mode ready
- Accesibilidad (a11y)
- Utilidades de Tailwind

## 📝 Formularios

Usamos **React Hook Form** con **Zod** para validación:

```typescript
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const { register, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
});
```

## 🧪 Testing

```bash
npm run test        # Ejecutar tests
npm run test:watch  # Watch mode
```

## 🔨 Build

```bash
npm run build       # Producción
npm run preview     # Preview del build
```

## 📚 Documentación Adicional

- [Arquitectura](./ARCHITECTURE.md) - Detalles sobre screaming architecture
- [Configuración](./SETUP.md) - Configuración avanzada
- [API Integration](./API_INTEGRATION.md) - Guía de integración con backend
- [Backend API](./API_BACKEND.md) - Documentación del backend

## 🤝 Contribución

1. Crear rama feature: `git checkout -b feature/AmazingFeature`
2. Commit cambios: `git commit -m 'Add some AmazingFeature'`
3. Push a rama: `git push origin feature/AmazingFeature`
4. Abrir Pull Request

## 📝 Licencia

Este proyecto está licenciado bajo MIT License - ver archivo LICENSE.

## 👨‍💻 Autor

Proyecto ERP - Semestre 7

## 📞 Soporte

Para reportar bugs o solicitar features, crear un issue en el repositorio.
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
