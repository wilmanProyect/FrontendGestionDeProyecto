# Guía de Integración con APIs del Backend

Esta guía explica cómo el frontend se integra con las APIs del backend ERP.

## 🔗 Configuración Base

### Endpoint Base
```typescript
// En src/shared/constants/api.constants.ts
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3001/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
};
```

### Configuración en .env.local
```env
VITE_API_BASE_URL=http://localhost:3001/api
```

## 📡 Cliente HTTP (Axios)

### Configuración Automática
```typescript
// src/shared/api/axiosInstance.ts
- Timeout: 30 segundos
- Headers: Content-Type: application/json
- Autenticación: Bearer token automático
- Interceptores: Refresh token en 401
```

### Ejemplo de Uso
```typescript
import { axiosInstance } from '@/shared/api/axiosInstance';

// Con interceptores automáticos
const response = await axiosInstance.get('/projects');
```

## 🔐 Autenticación

### 1. Login
**Endpoint**: `POST /auth/login`

```typescript
// src/features/auth/api/authApi.ts
async login(credentials: LoginRequest) {
  const response = await axiosInstance.post('/auth/login', {
    email: 'user@example.com',
    password: 'Password123'
  });
  return response.data.data;
}
```

**Respuesta Exitosa** (sin 2FA):
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "Juan",
      "lastName": "Pérez"
    }
  }
}
```

**Respuesta con 2FA Requerido**:
```json
{
  "success": true,
  "data": {
    "temporaryToken": "temp_token_here"
  }
}
```

### 2. Registro
**Endpoint**: `POST /auth/register`

```typescript
async register(data: RegisterRequest) {
  const response = await axiosInstance.post('/auth/register', {
    email: 'newuser@example.com',
    password: 'Password123',
    firstName: 'Juan',
    lastName: 'Pérez'
  });
  return response.data.data;
}
```

### 3. Verificar Email
**Endpoint**: `POST /auth/verify-email`

```typescript
async verifyEmail(data: VerifyEmailRequest) {
  const response = await axiosInstance.post('/auth/verify-email', {
    token: 'verification_token_from_email'
  });
  return response.data.data;
}
```

### 4. Verificar 2FA
**Endpoint**: `POST /auth/verify-2fa`

```typescript
async verify2FA(temporaryToken: string, totpCode: string) {
  const response = await axiosInstance.post('/auth/verify-2fa', {
    temporaryToken,
    totpCode: '123456'
  });
  return response.data.data;
}
```

### 5. Refresh Token
**Endpoint**: `POST /auth/refresh`

```typescript
// Automático en interceptores
async refreshToken(refreshToken: string) {
  const response = await axiosInstance.post('/auth/refresh', {
    refreshToken
  });
  return response.data.data;
}
```

### 6. Check Status
**Endpoint**: `GET /auth/check-status`

```typescript
async checkAuthStatus() {
  const response = await axiosInstance.get('/auth/check-status');
  return response.data.data;
}
```

### 7. Logout
**Endpoint**: `POST /auth/logout`

```typescript
async logout(refreshToken?: string) {
  const response = await axiosInstance.post('/auth/logout', 
    refreshToken ? { refreshToken } : {}
  );
  return response.data.data;
}
```

## 🔄 Manejo de Tokens

### Almacenamiento Automático
```typescript
// src/features/auth/utils/tokenStorage.ts
tokenStorage.setTokens(accessToken, refreshToken);
tokenStorage.setUser(user);

// Obtener
const token = tokenStorage.getAccessToken();
const user = tokenStorage.getUser();

// Limpiar
tokenStorage.clearAll();
```

### Interceptor de Request
```typescript
// Automático en axiosInstance
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);
```

### Interceptor de Response (Refresh)
```typescript
// Automático en axiosInstance
// Si error 401:
// 1. Usa refreshToken para obtener nuevo accessToken
// 2. Actualiza localStorage
// 3. Reintenta request original
// 4. Si falla, redirige a /login
```

## 📁 Proyectos

### Listar Proyectos
**Endpoint**: `GET /projects`

```typescript
// Crear servicio similar en features/projects/api/projectsApi.ts
const response = await axiosInstance.get('/projects');
```

### Crear Proyecto
**Endpoint**: `POST /projects`

```typescript
const response = await axiosInstance.post('/projects', {
  name: 'ERP Backend',
  description: 'Sistema de gestion empresarial',
  startDate: '2026-04-01',
  endDate: '2026-12-31'
});
```

### Obtener Proyecto
**Endpoint**: `GET /projects/:id`

```typescript
const response = await axiosInstance.get(`/projects/${projectId}`);
```

### Actualizar Proyecto
**Endpoint**: `PATCH /projects/:id`

```typescript
const response = await axiosInstance.patch(`/projects/${projectId}`, {
  name: 'Nuevo Nombre',
  description: 'Nueva descripción'
});
```

## 📋 Tareas

### Listar Tareas
**Endpoint**: `GET /projects/:projectId/tasks`

```typescript
const response = await axiosInstance.get(
  `/projects/${projectId}/tasks`
);
```

### Crear Tarea
**Endpoint**: `POST /projects/:projectId/tasks`

```typescript
const response = await axiosInstance.post(
  `/projects/${projectId}/tasks`,
  {
    title: 'Implementar login',
    description: 'Agregar autenticacion JWT',
    assigneeId: 'user-uuid',
    listId: 'list-uuid',
    priorityId: 'priority-uuid',
    dueDate: '2026-05-01'
  }
);
```

### Cambiar Estado de Tarea
**Endpoint**: `PATCH /projects/:projectId/tasks/:taskId/status`

```typescript
const response = await axiosInstance.patch(
  `/projects/${projectId}/tasks/${taskId}/status`,
  { status: 'in_progress' }
);
```

Estados disponibles: `todo`, `in_progress`, `in_review`, `done`, `cancelled`

## 💬 Comentarios

### Crear Comentario
**Endpoint**: `POST /tasks/:taskId/comments`

```typescript
// multipart/form-data
const formData = new FormData();
formData.append('content', 'Mi comentario');
formData.append('files', file1);
formData.append('files', file2);

const response = await axiosInstance.post(
  `/tasks/${taskId}/comments`,
  formData,
  {
    headers: { 'Content-Type': 'multipart/form-data' }
  }
);
```

### Obtener Comentarios
**Endpoint**: `GET /tasks/:taskId/comments`

```typescript
const response = await axiosInstance.get(
  `/tasks/${taskId}/comments`
);
```

## 📁 Archivos

### Subir Archivo
**Endpoint**: `POST /files/upload`

```typescript
const formData = new FormData();
formData.append('file', file);

// Para archivo de tarea
const response = await axiosInstance.post(
  `/files/upload?taskId=${taskId}`,
  formData,
  { headers: { 'Content-Type': 'multipart/form-data' } }
);

// Para archivo de proyecto
const response = await axiosInstance.post(
  `/files/upload?projectId=${projectId}`,
  formData,
  { headers: { 'Content-Type': 'multipart/form-data' } }
);
```

### Obtener Archivos de Tarea
**Endpoint**: `GET /files/task/:taskId`

```typescript
const response = await axiosInstance.get(
  `/files/task/${taskId}`
);
```

### Eliminar Archivo
**Endpoint**: `DELETE /files/:fileId`

```typescript
const response = await axiosInstance.delete(
  `/files/${fileId}`
);
```

## 🔔 Notificaciones

### Obtener Notificaciones
**Endpoint**: `GET /notifications`

```typescript
const response = await axiosInstance.get(
  '/notifications?limit=20&offset=0'
);
```

### Marcar Como Leída
**Endpoint**: `PATCH /notifications/:id/read`

```typescript
const response = await axiosInstance.patch(
  `/notifications/${notificationId}/read`
);
```

### Marcar Todas Como Leídas
**Endpoint**: `PATCH /notifications/read-all`

```typescript
const response = await axiosInstance.patch(
  '/notifications/read-all'
);
```

## 📊 Reportes

### Obtener Reporte JSON
**Endpoint**: `GET /reports/projects`

```typescript
const response = await axiosInstance.get(
  '/reports/projects'
);
```

### Descargar Reporte PDF
**Endpoint**: `GET /reports/projects/pdf`

```typescript
// Descarga directa
window.location.href = `${API_BASE_URL}/reports/projects/pdf`;
```

### Descargar Reporte Excel
**Endpoint**: `GET /reports/projects/excel`

```typescript
// Descarga directa
window.location.href = `${API_BASE_URL}/reports/projects/excel`;
```

## 🚨 Manejo de Errores

### Estructura de Error
```json
{
  "success": false,
  "message": "Error message",
  "statusCode": 400,
  "errors": {
    "email": ["Email already exists"],
    "password": ["Password too weak"]
  }
}
```

### Capturar Errores
```typescript
try {
  const response = await authApi.login(credentials);
} catch (error) {
  if (error.response?.status === 401) {
    console.log('Credenciales inválidas');
  } else if (error.response?.status === 400) {
    const errors = error.response.data.errors;
    console.log('Errores de validación:', errors);
  }
}
```

## ✅ Checklist de Integración

- [ ] `.env.local` configurado con `VITE_API_BASE_URL`
- [ ] Backend corriendo en puerto 3001
- [ ] CORS habilitado en backend
- [ ] axiosInstance interceptores funcionando
- [ ] Tokens guardándose en localStorage
- [ ] Refresh automático de tokens funcionando
- [ ] Login/Logout/Register probado
- [ ] 2FA integrado si aplica
- [ ] Llamadas HTTP con error handling
- [ ] Validaciones Zod en formularios

## 📚 Recursos

- Ver [API_BACKEND.md](./API_BACKEND.md) para detalles completos de endpoints
- Ver [ARCHITECTURE.md](./ARCHITECTURE.md) para detalles de estructura
- Ver [SETUP.md](./SETUP.md) para configuración del proyecto

## 🆘 Solución de Problemas

### Error CORS
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**Solución**: Configurar CORS en backend

```typescript
// Backend (NestJS)
@EnableCors({
  origin: 'http://localhost:5173',
  credentials: true
})
```

### Error 401 Infinite Loop
```
Token refresh infinito
```
**Solución**: Revisar que refreshToken es válido, si no, logout

### Error Network
```
Cannot reach API
```
**Solución**: 
1. Verificar backend está corriendo
2. Verificar URL en `.env.local`
3. Revisar console para detalles

### Error 422 Validation
```
Field validation failed
```
**Solución**: Revisar estructura del payload, usar Zod schema
