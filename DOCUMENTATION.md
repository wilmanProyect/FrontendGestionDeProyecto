# 📚 Documentación del Proyecto - Índice

Bienvenido al frontend del sistema ERP de gestión de proyectos. Aquí encontrarás toda la documentación del proyecto.

## 📖 Guías Disponibles

### 🚀 [Quick Start](./QUICK_START.md) - Comienza en 5 minutos
La guía más rápida para comenzar a desarrollar. Contiene:
- Instalación en 3 pasos
- Ejemplos de código común
- Comandos útiles
- Tips y tricks

**Lee esto primero si eres nuevo en el proyecto**

### 📕 [README](./README.md) - Visión General
Descripción completa del proyecto. Contiene:
- Descripción del proyecto
- Stack tecnológico
- Características principales
- Estructura del proyecto
- Inicio rápido

### 🏗 [Architecture](./ARCHITECTURE.md) - Screaming Architecture
Detalles técnicos profundos sobre la arquitectura. Contiene:
- Principios de screaming architecture
- Estructura de módulos (features)
- Patrones utilizados
- Flujos de datos
- Cómo agregar nuevas features
- Escalabilidad

**Lee esto para entender la arquitectura del proyecto**

### ⚙️ [Setup](./SETUP.md) - Configuración Detallada
Guía completa de configuración y troubleshooting. Contiene:
- Requisitos del sistema
- Instalación paso a paso
- Configuración del IDE (VS Code)
- Variables de entorno
- Debugging
- Solución de problemas
- Convenciones del proyecto

### 📡 [API Integration](./API_INTEGRATION.md) - Backend Integration
Guía completa de integración con el backend. Contiene:
- Configuración del cliente HTTP
- Todos los endpoints de autenticación
- Ejemplos de uso
- Manejo de tokens y refresh
- Integración con proyectos, tareas, etc.
- Manejo de errores
- Checklist de integración

**Lee esto si necesitas entender cómo conectar con el backend**

### 🤝 [Contributing](./CONTRIBUTING.md) - Guía para Contribuidores
Guía completa para contribuir al proyecto. Contiene:
- Pasos para fork y contribuir
- Convenciones de código
- Estructura para nuevas features
- Checklist antes de PR
- Código de conducta

**Lee esto si quieres contribuir al proyecto**

### 📎 [API Backend](./API_BACKEND.md) - Documentación del Backend
Documentación completa de los endpoints del backend. Contiene:
- Todos los endpoints disponibles
- Formatos de request/response
- Autenticación
- Enums y estados
- Ejemplos de uso
- Flujos recomendados

## 🎯 Rutas de Aprendizaje

### Si eres nuevo en el proyecto
1. Leer [Quick Start](./QUICK_START.md) (5 min)
2. Leer [README](./README.md) (10 min)
3. Revisar estructura en `src/`
4. Ejecutar `npm run dev`

### Si quieres contribuir
1. Leer [Quick Start](./QUICK_START.md)
2. Leer [Architecture](./ARCHITECTURE.md)
3. Leer [Contributing](./CONTRIBUTING.md)
4. Revisar código existente como ejemplo

### Si necesitas entender las APIs
1. Leer [API Integration](./API_INTEGRATION.md)
2. Revisar ejemplos en `src/features/auth/api/`
3. Consultar [API Backend](./API_BACKEND.md) para detalles

### Si tienes problemas
1. Revisar [Setup](./SETUP.md) - Sección "Solución de Problemas"
2. Revisar console del navegador (F12)
3. Revisar Network tab para llamadas API
4. Revisar [API Integration](./API_INTEGRATION.md)

## 📁 Estructura del Proyecto

```
project/
├── README.md                    # Visión general
├── QUICK_START.md              # Guía rápida (5 min)
├── ARCHITECTURE.md             # Arquitectura detallada
├── SETUP.md                    # Configuración
├── API_INTEGRATION.md          # Integración con backend
├── API_BACKEND.md              # API del backend
├── CONTRIBUTING.md             # Guía para contribuidores
├── .env.example               # Configuración de env
│
├── src/
│   ├── config/                # Configuración global
│   │   └── router.tsx        # Rutas
│   ├── features/             # Features (screaming arch)
│   │   └── auth/
│   │       ├── pages/
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── store/
│   │       ├── api/
│   │       ├── types/
│   │       ├── constants/
│   │       ├── utils/
│   │       └── index.ts
│   ├── shared/               # Código compartido
│   │   ├── api/
│   │   ├── components/
│   │   ├── types/
│   │   ├── constants/
│   │   ├── hooks/
│   │   └── utils/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 🔑 Conceptos Clave

### Screaming Architecture
La estructura "grita" el propósito de la aplicación. Organizada por **features**, no por tipos de archivo.

```
❌ Viejo (por tipo)
src/
├── components/
├── pages/
├── services/
└── utils/

✅ Nuevo (por feature)
src/
└── features/
    └── auth/
        ├── components/
        ├── pages/
        ├── services/
        └── utils/
```

### Zustand Store
Estado global simple y potente:
```typescript
const { user, logout } = useAuthStore();
```

### React Hook Form + Zod
Formularios validados type-safe:
```typescript
const schema = z.object({ email: z.string().email() });
const { register } = useForm({ resolver: zodResolver(schema) });
```

### Axios Interceptores
Manejo automático de tokens:
- Request: Agrega Bearer token
- Response: Refresh automático en 401

## 🚀 Próximos Pasos

Después de completar el módulo de autenticación, el siguiente paso sería:

1. **Módulo de Proyectos** - CRUD de proyectos
2. **Módulo de Tareas** - Gestión de tareas (Kanban)
3. **Módulo de Comentarios** - Sistema de comentarios
4. **Dashboard** - Visualización de datos
5. **Sistema de Notificaciones** - Notificaciones en tiempo real

## 📞 Soporte

- Revisar documentación correspondiente
- Abrir issue en GitHub
- Revisar console del navegador (F12)
- Revisar Network tab

## 🎓 Recursos Útiles

- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Docs](https://vitejs.dev)
- [React Router Docs](https://reactrouter.com)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [React Hook Form Docs](https://react-hook-form.com)
- [Zod Docs](https://zod.dev)
- [Tailwind Docs](https://tailwindcss.com/docs)

## ✅ Checklist de Inicio

- [ ] Leer [Quick Start](./QUICK_START.md)
- [ ] Ejecutar `npm install`
- [ ] Crear `.env.local` desde `.env.example`
- [ ] Ejecutar `npm run dev`
- [ ] Verificar que funciona en `http://localhost:5173`
- [ ] Explorar estructura en `src/`
- [ ] Revisar un componente existente
- [ ] Leer [Architecture](./ARCHITECTURE.md)

## 🎉 ¡Listo para Comenzar!

Si tienes dudas, consulta la documentación correspondiente o abre un issue en GitHub.

**Happy coding! 🚀**
