# Guía de Contribución al Proyecto

¡Gracias por tu interés en contribuir al proyecto Frontend Gestión de Proyectos!

## 📋 Requisitos Previos

- Conocimiento de React y TypeScript
- Familiaridad con Git y GitHub
- Entendimiento de la arquitectura Screaming Architecture
- Leer la documentación del proyecto (ARCHITECTURE.md, SETUP.md)

## 🚀 Pasos para Contribuir

### 1. Fork y Clone

```bash
# Fork el repositorio en GitHub
# Clone tu fork
git clone https://github.com/tu-usuario/FrontendGestionDeProyecto.git
cd FrontendGestionDeProyecto

# Agregar upstream
git remote add upstream <repo-original>
```

### 2. Crear Rama Feature

```bash
# Actualizar main
git fetch upstream
git checkout main
git merge upstream/main

# Crear rama feature
git checkout -b feature/descripcion-corta
```

**Convención de nombres:**
- `feature/nombre-feature` - Nueva característica
- `fix/descripcion-bug` - Corrección de bug
- `docs/descripcion` - Documentación
- `refactor/descripcion` - Refactorización

### 3. Hacer Cambios

#### Agregar Página Nueva

```typescript
// src/features/[feature]/pages/NewPage.tsx
export const NewPage = () => {
  return <div>Content</div>;
};
```

Exportar en `index.ts`:
```typescript
// src/features/[feature]/index.ts
export { NewPage } from './pages/NewPage';
```

#### Agregar Hook Personalizado

```typescript
// src/features/[feature]/hooks/useNewHook.ts
export const useNewHook = () => {
  // lógica
};
```

#### Agregar Servicio HTTP

```typescript
// src/features/[feature]/api/featureApi.ts
class FeatureApi {
  async getItems() {
    return axiosInstance.get('/endpoint');
  }
}

export const featureApi = new FeatureApi();
```

### 4. Código Limpio

#### Reglas Importantes

1. **TypeScript Strict Mode**
   - Todos los tipos deben ser explícitos
   - Evitar `any`
   - Usar generics cuando sea necesario

2. **Componentes Funcionales**
   - Usar hooks, no class components
   - Memoizar si es necesario (React.memo)
   - Usar TypeScript para props

3. **Validación**
   - Usar Zod para validación de datos
   - Validar en formularios y APIs
   - Mensajes de error claros

4. **Naming**
   - Componentes: PascalCase
   - Hooks: camelCase con `use` prefix
   - Variables: camelCase
   - Constantes: UPPER_SNAKE_CASE

5. **Imports**
   - Usar path alias `@/`
   - Organizar por: React → librerías → imports locales
   - Un import por línea

```typescript
// ✅ Correcto
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '@/features/auth/components';
import { useAuth } from '@/features/auth/hooks';
import { API_CONFIG } from '@/shared/constants';

// ❌ Incorrecto
import React, { useState } from 'react'; // separados
import { LoginForm, RegisterForm } from '@/features/auth/components'; // múltiples
import * as anything from '@/features'; // wildcard
```

### 5. Formato y Linting

```bash
# Ejecutar eslint
npm run lint

# (Opcional) Usar Prettier
npx prettier --write "src/**/*.{ts,tsx}"
```

Reglas ESLint se encuentran en `eslint.config.js`

### 6. Testing

```bash
# Agregar tests para cambios significativos
npm run test

# Watch mode durante desarrollo
npm run test:watch
```

**Nomenclatura de tests:**
```typescript
// src/features/auth/hooks/__tests__/useLogin.test.ts
describe('useLogin', () => {
  it('should login successfully', () => {
    // test
  });
});
```

### 7. Commit

```bash
# Commits atómicos y descriptivos
git add .
git commit -m "type(scope): descripción breve"

# Ejemplos:
# feat(auth): agregar login page
# fix(auth): corregir validación de email
# docs(setup): actualizar instrucciones
# refactor(shared): mejorar axiosInstance
# style(components): formatear código
```

**Formato Conventional Commits:**
- `feat`: Nueva característica
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Formateo, cambios cosméticos
- `refactor`: Refactorización sin cambios funcionales
- `perf`: Mejoras de performance
- `test`: Agregar o actualizar tests

### 8. Push y Pull Request

```bash
# Push a tu fork
git push origin feature/descripcion

# Crear PR en GitHub
# - Título descriptivo
# - Descripción detallada
# - Referenciar issues (#123)
# - Agregar labels (enhancement, bugfix, etc)
```

**Plantilla de PR:**

```markdown
## Descripción
Breve descripción de los cambios

## Tipo de Cambio
- [ ] Bug fix
- [ ] Nueva característica
- [ ] Cambio breaking
- [ ] Documentación

## Cambios Realizados
- Cambio 1
- Cambio 2

## Cómo Probar
1. Paso 1
2. Paso 2

## Checklist
- [ ] Código sigue las convenciones del proyecto
- [ ] Tests agregados/actualizados
- [ ] Documentación actualizada
- [ ] No hay warnings en console
- [ ] Probado en desarrollo
```

## 🏗 Estructura para Nuevas Features

Si agregas un nuevo feature module:

```
src/features/newfeature/
├── pages/
│   ├── NewFeaturePage.tsx
│   └── __tests__/
│       └── NewFeaturePage.test.tsx
├── components/
│   ├── NewFeatureComponent.tsx
│   └── __tests__/
│       └── NewFeatureComponent.test.tsx
├── hooks/
│   ├── useNewFeature.ts
│   └── __tests__/
│       └── useNewFeature.test.ts
├── store/
│   └── newFeatureStore.ts
├── api/
│   └── newFeatureApi.ts
├── types/
│   └── newfeature.types.ts
├── constants/
│   └── newfeature.constants.ts
├── utils/
│   └── newfeature.utils.ts
└── index.ts
```

## 🔍 Checklist Antes de Enviar PR

- [ ] Código sigue convenciones (naming, estructura)
- [ ] TypeScript sin errores (strict mode)
- [ ] ESLint pasando (`npm run lint`)
- [ ] Componentes tienen tipos explícitos
- [ ] Validaciones con Zod donde aplique
- [ ] Manejo de errores implementado
- [ ] Importes usando path alias `@/`
- [ ] No hay `console.log()` en producción
- [ ] No hay valores hardcodeados
- [ ] Constantes en `constants/`
- [ ] Documentación actualizada
- [ ] Probado en navegador
- [ ] Sin warnings en console

## 📚 Recursos de Aprendizaje

- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Router Docs](https://reactrouter.com)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [React Hook Form Docs](https://react-hook-form.com)
- [Zod Docs](https://zod.dev)
- [Tailwind Docs](https://tailwindcss.com)
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitectura del proyecto

## 🆘 Necesitas Ayuda?

- Abre una discussion en GitHub
- Revisa issues existentes
- Lee la documentación del proyecto
- Pregunta en los comentarios del PR

## 📝 Código de Conducta

- Sé respetuoso con otros contribuidores
- Acepta feedback constructivo
- Ayuda a otros cuando puedas
- Reporta bugs de forma clara

¡Gracias por contribuir! 🎉
