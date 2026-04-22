# Configuración y Setup del Proyecto

## 🚀 Requisitos

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0  
- **Backend**: Corriendo en `http://localhost:3001/api`

## 📦 Instalación

### 1. Clonar Repositorio
```bash
git clone <repository-url>
cd FrontendGestionDeProyecto
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno

Copiar archivo de ejemplo:
```bash
cp .env.example .env.local
```

Editar `.env.local`:
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3001/api

# Feature Flags
VITE_ENABLE_2FA=true
VITE_ENABLE_EMAIL_VERIFICATION=true
```

## 🔧 Configuración de IDE

### VS Code

Instalar extensiones recomendadas:
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "golang.go"
  ]
}
```

Crear `.vscode/settings.json`:
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "(?:'|\"|`|{)([^']*)(?:'|\"|`|})"]
  ]
}
```

## 🏃 Ejecutar Proyecto

### Desarrollo
```bash
npm run dev
```

Acceder a: `http://localhost:5173`

### Build Producción
```bash
npm run build
```

### Preview de Build
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

## 📁 Estructura de Carpetas Explicada

```
project/
├── src/
│   ├── config/              # Configuración global (router, API)
│   ├── features/            # Módulos de features (screaming arch)
│   │   └── auth/           # Feature de autenticación
│   ├── shared/             # Código compartido
│   │   ├── api/           # Instancia axios configurada
│   │   ├── components/    # Componentes reutilizables
│   │   ├── types/         # Tipos globales
│   │   └── constants/     # Constantes globales
│   ├── App.tsx            # Componente raíz
│   ├── main.tsx           # Entry point
│   └── index.css          # Estilos globales
│
├── public/                 # Assets estáticos
├── .env.example           # Variables de entorno
├── vite.config.ts         # Configuración Vite
├── tsconfig.json          # Configuración TypeScript
├── package.json           # Dependencias
└── README.md             # Este archivo
```

## 🔐 Gestión de Tokens

### Almacenamiento
Los tokens se guardan en `localStorage`:

```javascript
localStorage.getItem('accessToken')   // Token de acceso
localStorage.getItem('refreshToken')  // Token de refresco
localStorage.getItem('authUser')      // Datos del usuario
```

### Refresh Automático
Si el `accessToken` expira:

1. `axiosInstance` intercepta error 401
2. Utiliza `refreshToken` para obtener nuevo `accessToken`
3. Reintenta automáticamente la solicitud original
4. Si falla, redirige a `/login`

## 🌐 Variables de Entorno

### Desarrollo
```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_ENABLE_2FA=true
VITE_ENABLE_EMAIL_VERIFICATION=true
```

### Producción
```env
VITE_API_BASE_URL=https://api.example.com/api
VITE_ENABLE_2FA=true
VITE_ENABLE_EMAIL_VERIFICATION=true
```

## 🐛 Debugging

### Console Logs
```typescript
// En desarrollo, los logs de Redux Thunk están habilitados
console.log('Estado:', state);
console.log('Error:', error);
```

### DevTools
Instalar React DevTools extension en Chrome/Firefox

### Network
- Abrir DevTools (F12) → Network tab
- Filtrar por XHR para ver llamadas HTTP
- Ver Headers, Payload y Response

## 🚨 Solución de Problemas

### Error: "Cannot find module '@/...'"
**Solución**: Verificar path aliases en `tsconfig.json` y `vite.config.ts`

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### Error: CORS
**Solución**: Verificar que el backend tiene CORS habilitado para `http://localhost:5173`

### Error: 401 Unauthorized
**Solución**: 
1. Verificar que `accessToken` está guardado en localStorage
2. Verificar que el token no está expirado
3. Probar login nuevamente

### Error: "Blank page after login"
**Solución**:
1. Abrir DevTools Console
2. Verificar que no hay errores
3. Verificar que `ProtectedRoute` está siendo usado correctamente
4. Verificar que `useAuthStore` tiene datos del usuario

## 📊 Dependencias Principales

```json
{
  "react": "^19.2.5",              // UI Framework
  "react-dom": "^19.2.5",          // React DOM
  "react-router-dom": "^6.x",      // Routing
  "zustand": "^latest",            // State Management
  "react-hook-form": "^latest",    // Form Handling
  "zod": "^latest",                // Validation
  "axios": "^latest",              // HTTP Client
  "tailwindcss": "^4.2.4",        // CSS Framework
  "@tailwindcss/vite": "^4.2.4"   // Tailwind Plugin
}
```

## 🔄 Flujos de Trabajo

### Agregar Nueva Página
1. Crear archivo en `features/[feature]/pages/`
2. Exportar en `features/[feature]/index.ts`
3. Agregar ruta en `config/router.tsx`

### Agregar Custom Hook
1. Crear archivo en `features/[feature]/hooks/` o `shared/hooks/`
2. Exportar en archivo `index.ts` correspondiente
3. Usar en componentes

### Agregar Store
1. Crear en `features/[feature]/store/` con Zustand
2. Exportar en `features/[feature]/index.ts`
3. Usar con `useStore()` en componentes

### Agregar Servicio HTTP
1. Crear en `features/[feature]/api/`
2. Usar `axiosInstance` de `shared/api`
3. Exportar métodos públicos

## 📝 Convenciones

### Naming
- **Componentes**: PascalCase (`LoginForm.tsx`)
- **Hooks**: camelCase con prefijo `use` (`useLogin.ts`)
- **Stores**: camelCase con sufijo `Store` (`authStore.ts`)
- **Archivos**: match con función principal

### Estructura de Carpetas
- Una feature = una carpeta
- Una página = un archivo
- Un hook = un archivo
- Un componente = un archivo

### Imports
```typescript
// Usar path alias @
import { LoginForm } from '@/features/auth/components';
import { useAuth } from '@/features/auth/hooks';
import { axiosInstance } from '@/shared/api';
```

## 🎯 Checklist de Deploy

- [ ] Verificar `.env.local` está configurado
- [ ] Ejecutar `npm run build` sin errores
- [ ] Revisar console para warnings
- [ ] Probar login en producción
- [ ] Probar refresh token
- [ ] Probar logout
- [ ] Verificar CORS configurado en backend

## 📚 Recursos Útiles

- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [React Router Docs](https://reactrouter.com)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [React Hook Form Docs](https://react-hook-form.com)
- [Zod Docs](https://zod.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## 🤝 Soporte

Para problemas o preguntas:
1. Revisar documentación (ARCHITECTURE.md, API_INTEGRATION.md)
2. Revisar console del navegador
3. Revisar Network tab
4. Crear issue en repositorio
