# Documentacion de APIs del ERP Backend

Esta guia documenta como consumir todas las APIs expuestas por el backend.

## Base URL

- Desarrollo local: `http://localhost:3001/api`
- Swagger UI: `http://localhost:3001/docs`

## Formato general de respuesta

La API usa un interceptor global que normalmente responde con esta estructura:

```json
{
  "success": true,
  "message": "Operacion exitosa",
  "data": {},
  "statusCode": 200
}
```

Si un handler ya retorna su propia estructura, esa respuesta puede variar.

## Autenticacion

Las rutas protegidas usan JWT Bearer:

```http
Authorization: Bearer TU_ACCESS_TOKEN
```

## Convenciones importantes

- Todos los IDs de recursos son UUID.
- Las fechas usan formato ISO 8601, por ejemplo: `2026-04-22` o `2026-04-22T15:30:00.000Z`.
- La validacion global elimina campos no permitidos y rechaza campos extra.
- Prefijo global de la API: todas las rutas reales comienzan con `/api`.

## Estados y enums usados en el sistema

### Estados de tarea

- `todo`
- `in_progress`
- `in_review`
- `done`
- `cancelled`

### Roles dentro de un proyecto

- `owner`
- `admin`
- `member`
- `viewer`

### Estado de proyecto

- `active`
- `archived`
- `on_hold`

---

## 1. Auth

Base: `/auth`

### POST `/auth/register`

Crea una cuenta nueva.

Body:

```json
{
  "email": "usuario@example.com",
  "password": "Password123",
  "firstName": "Juan",
  "lastName": "Perez"
}
```

Notas:

- `password` debe tener minimo 6 caracteres.
- Debe incluir mayuscula, minuscula y numero.

### POST `/auth/login`

Inicia sesion con email y password.

Body:

```json
{
  "email": "usuario@example.com",
  "password": "Password123"
}
```

Uso:

- Si el usuario no tiene 2FA, devuelve `accessToken` y `refreshToken`.
- Si el usuario tiene 2FA, puede devolver un `temporaryToken` para luego verificar con `/auth/verify-2fa`.

### POST `/auth/verify-email`

Verifica el correo usando el token enviado por email.

Body:

```json
{
  "token": "TOKEN_DE_VERIFICACION"
}
```

### POST `/auth/resend-verification`

Reenvia el email de verificacion.

Body:

```json
{
  "email": "usuario@example.com"
}
```

### POST `/auth/verify-2fa`

Completa el login cuando el usuario tiene autenticacion de dos factores.

Body:

```json
{
  "temporaryToken": "TOKEN_TEMPORAL",
  "totpCode": "123456"
}
```

### GET `/auth/check-status`

Valida que el `accessToken` siga vigente y devuelve el estado de autenticacion.

Requiere Bearer token.

### POST `/auth/refresh`

Renueva el `accessToken` usando un `refreshToken`.

Body:

```json
{
  "refreshToken": "TU_REFRESH_TOKEN"
}
```

### POST `/auth/logout`

Cierra sesion y revoca un refresh token concreto o todos los refresh tokens del usuario.

Requiere Bearer token.

Body opcional:

```json
{
  "refreshToken": "TU_REFRESH_TOKEN"
}
```

Si no envias `refreshToken`, el DTO indica que se revocan todos.

### GET `/auth/profile`

Devuelve el perfil del usuario autenticado.

Requiere Bearer token.

Ejemplo rapido:

```bash
curl -X GET http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer TU_ACCESS_TOKEN"
```

---

## 2. Usuarios

Base: `/users`

Estas rutas requieren autenticacion y permisos del sistema.

### GET `/users`

Lista todos los usuarios.

Permiso requerido: `users.read`

### GET `/users/roles`

Lista los roles del sistema.

Permiso requerido: `permissions.read`

### GET `/users/:id`

Obtiene un usuario por UUID.

Permiso requerido: `users.read`

### PATCH `/users/:id`

Actualiza datos de un usuario.

Permiso requerido: `users.write`

Body:

```json
{
  "firstName": "Juan",
  "lastName": "Perez",
  "systemRoleId": "9f8f0db8-3b27-49c6-82cf-fdcf0e6d7437",
  "isActive": true
}
```

Todos los campos son opcionales.

### PATCH `/users/:id/deactivate`

Desactiva un usuario.

Permiso requerido: `users.delete`

---

## 3. Permisos

Base: `/permissions`

### GET `/permissions`

Lista todos los permisos disponibles del sistema.

Permiso requerido: `permissions.read`

### GET `/permissions/roles/:roleId`

Lista los permisos asignados a un rol.

Permiso requerido: `permissions.read`

### POST `/permissions/roles/:roleId/assign`

Asigna un permiso a un rol.

Permiso requerido: `permissions.write`

Body:

```json
{
  "permissionId": "1ef138a5-4218-4902-9f4f-055ec6a8a8c4"
}
```

### DELETE `/permissions/roles/:roleId/revoke/:permissionId`

Revoca un permiso de un rol.

Permiso requerido: `permissions.write`

---

## 4. Proyectos

Base: `/projects`

### POST `/projects`

Crea un proyecto.

Requiere Bearer token.

Body:

```json
{
  "name": "ERP Backend",
  "description": "Sistema de gestion empresarial",
  "startDate": "2026-04-01",
  "endDate": "2026-12-31"
}
```

### GET `/projects`

Lista los proyectos accesibles para el usuario autenticado.

### GET `/projects/:id`

Obtiene el detalle de un proyecto.

### PATCH `/projects/:id`

Actualiza un proyecto.

Body:

```json
{
  "name": "ERP Backend v2",
  "description": "Nueva descripcion",
  "startDate": "2026-04-10",
  "endDate": "2026-12-20"
}
```

Todos los campos son opcionales.

### PATCH `/projects/:id/archive`

Archiva un proyecto.

### PATCH `/projects/:id/unarchive`

Desarchiva un proyecto.

### POST `/projects/:id/members`

Agrega un usuario como miembro del proyecto.

Body:

```json
{
  "userId": "8b8f6d6f-cd2b-4f79-bd35-a4ef35b9f28f",
  "role": "member"
}
```

`role` debe ser uno de: `owner`, `admin`, `member`, `viewer`.

### GET `/projects/:id/members`

Lista los miembros del proyecto.

### DELETE `/projects/:id/members/:userId`

Elimina un miembro del proyecto.

### POST `/projects/:id/members/:userId/permissions`

Asigna un permiso puntual a un miembro dentro del proyecto.

Body:

```json
{
  "permissionId": "1ef138a5-4218-4902-9f4f-055ec6a8a8c4"
}
```

### DELETE `/projects/:id/members/:userId/permissions/:permissionId`

Revoca un permiso puntual de un miembro.

### GET `/projects/:id/members/:userId/permissions`

Lista permisos efectivos o asignados a un miembro del proyecto.

### GET `/projects/:id/available-permissions`

Lista los permisos disponibles que pueden asignarse dentro del proyecto.

Ejemplo rapido:

```bash
curl -X POST http://localhost:3001/api/projects \
  -H "Authorization: Bearer TU_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"ERP Backend\",\"description\":\"Sistema Kanban\"}"
```

---

## 5. Listas Kanban

Base: `/projects/:projectId/lists`

### POST `/projects/:projectId/lists`

Crea una lista o columna Kanban.

Body:

```json
{
  "name": "Por hacer"
}
```

### GET `/projects/:projectId/lists`

Lista las columnas del proyecto.

### PATCH `/projects/:projectId/lists/:listId`

Actualiza una lista.

Body:

```json
{
  "name": "En progreso",
  "position": 1
}
```

Todos los campos son opcionales.

### DELETE `/projects/:projectId/lists/:listId`

Elimina una lista.

---

## 6. Tareas

Base: `/projects/:projectId/tasks`

### POST `/projects/:projectId/tasks`

Crea una tarea.

Body:

```json
{
  "title": "Implementar login",
  "description": "Agregar autenticacion JWT",
  "assigneeId": "8b8f6d6f-cd2b-4f79-bd35-a4ef35b9f28f",
  "listId": "d91a3fb4-a2c5-446e-b1b8-d24319f0571f",
  "priorityId": "19f06460-c8db-4f21-a474-4a3b308e4ba0",
  "dueDate": "2026-05-01"
}
```

Campos opcionales: `description`, `assigneeId`, `listId`, `priorityId`, `dueDate`.

### GET `/projects/:projectId/tasks`

Lista las tareas del proyecto.

### GET `/projects/:projectId/tasks/priorities`

Lista prioridades disponibles.

Util para obtener el `priorityId` antes de crear o actualizar tareas.

### GET `/projects/:projectId/tasks/:taskId`

Obtiene el detalle de una tarea.

### PATCH `/projects/:projectId/tasks/:taskId/status`

Cambia el estado de la tarea.

Body:

```json
{
  "status": "in_progress"
}
```

Valores permitidos:

- `todo`
- `in_progress`
- `in_review`
- `done`
- `cancelled`

### PATCH `/projects/:projectId/tasks/:taskId/move`

Mueve una tarea a otra lista o posicion.

Body:

```json
{
  "listId": "d91a3fb4-a2c5-446e-b1b8-d24319f0571f",
  "position": 0
}
```

### PATCH `/projects/:projectId/tasks/:taskId/priority/:priorityId`

Asigna o cambia la prioridad de la tarea.

### PATCH `/projects/:projectId/tasks/:taskId/assign/:assigneeId`

Asigna la tarea a un usuario.

---

## 7. Etiquetas

Base: `/projects/:projectId/labels`

### POST `/projects/:projectId/labels`

Crea una etiqueta del proyecto.

Body:

```json
{
  "name": "Bug",
  "color": "#ff0000"
}
```

### GET `/projects/:projectId/labels`

Lista todas las etiquetas del proyecto.

### PATCH `/projects/:projectId/labels/:labelId`

Actualiza una etiqueta.

Body:

```json
{
  "name": "Backend",
  "color": "#0057b8"
}
```

### DELETE `/projects/:projectId/labels/:labelId`

Elimina una etiqueta.

### POST `/projects/:projectId/labels/tasks/:taskId/labels/:labelId`

Asigna una etiqueta a una tarea.

### DELETE `/projects/:projectId/labels/tasks/:taskId/labels/:labelId`

Quita una etiqueta de una tarea.

### GET `/projects/:projectId/labels/tasks/:taskId/labels`

Lista las etiquetas de una tarea.

---

## 8. Comentarios

Base: `/tasks/:taskId/comments`

### POST `/tasks/:taskId/comments`

Crea un comentario en una tarea. Esta ruta acepta texto y hasta 5 archivos.

Tipo de contenido:

- `multipart/form-data`

Campos:

- `content`: texto del comentario
- `files`: uno o varios archivos adjuntos

Ejemplo con `curl`:

```bash
curl -X POST http://localhost:3001/api/tasks/TASK_ID/comments \
  -H "Authorization: Bearer TU_ACCESS_TOKEN" \
  -F "content=Adjunto el avance de hoy" \
  -F "files=@C:/ruta/archivo1.png" \
  -F "files=@C:/ruta/archivo2.pdf"
```

### GET `/tasks/:taskId/comments`

Lista los comentarios de una tarea.

### PATCH `/tasks/:taskId/comments/:commentId`

Actualiza el contenido de un comentario.

Body:

```json
{
  "content": "Contenido corregido"
}
```

### DELETE `/tasks/:taskId/comments/:commentId`

Elimina un comentario.

---

## 9. Checklists

Base: `/tasks/:taskId/checklists`

### POST `/tasks/:taskId/checklists`

Crea una checklist dentro de una tarea.

Body:

```json
{
  "title": "Subtareas"
}
```

### GET `/tasks/:taskId/checklists`

Lista las checklists de la tarea.

### DELETE `/tasks/:taskId/checklists/:checklistId`

Elimina una checklist.

### POST `/tasks/:taskId/checklists/:checklistId/items`

Agrega un item a una checklist.

Body:

```json
{
  "content": "Revisar codigo"
}
```

### PATCH `/tasks/:taskId/checklists/items/:itemId/toggle`

Alterna el estado completado/no completado de un item.

No requiere body.

---

## 10. Archivos

Base: `/files`

### POST `/files/upload`

Sube un archivo asociado a una tarea o a un proyecto.

Tipo de contenido:

- `multipart/form-data`

Campos:

- `file`: archivo a subir

Query params opcionales:

- `taskId`
- `projectId`

Ejemplo para subir a una tarea:

```bash
curl -X POST "http://localhost:3001/api/files/upload?taskId=TASK_ID" \
  -H "Authorization: Bearer TU_ACCESS_TOKEN" \
  -F "file=@C:/ruta/documento.pdf"
```

Ejemplo para subir a un proyecto:

```bash
curl -X POST "http://localhost:3001/api/files/upload?projectId=PROJECT_ID" \
  -H "Authorization: Bearer TU_ACCESS_TOKEN" \
  -F "file=@C:/ruta/mockup.png"
```

### GET `/files/task/:taskId`

Lista archivos asociados a una tarea.

### GET `/files/project/:projectId`

Lista archivos asociados a un proyecto.

### DELETE `/files/:fileId`

Elimina un archivo.

---

## 11. Notificaciones

Base: `/notifications`

### GET `/notifications`

Lista notificaciones del usuario autenticado.

Query params opcionales:

- `limit`
- `offset`

Ejemplo:

```bash
curl "http://localhost:3001/api/notifications?limit=20&offset=0" \
  -H "Authorization: Bearer TU_ACCESS_TOKEN"
```

### GET `/notifications/unread-count`

Devuelve el total de notificaciones no leidas.

### PATCH `/notifications/:id/read`

Marca una notificacion como leida.

### PATCH `/notifications/read-all`

Marca todas las notificaciones del usuario como leidas.

---

## 12. Reportes

Base: `/reports`

Estas rutas requieren el permiso `reports.generate`.

### GET `/reports/projects`

Devuelve un reporte JSON con metricas agregadas de proyectos y tareas.

Uso tipico:

- dashboards
- widgets de resumen
- analitica interna

### GET `/reports/projects/pdf`

Genera y descarga el reporte de proyectos en PDF.

Respuesta:

- `Content-Type: application/pdf`
- `Content-Disposition: attachment; filename=\"projects-report.pdf\"`

### GET `/reports/projects/excel`

Genera y descarga el reporte de proyectos en Excel.

Respuesta:

- `Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- `Content-Disposition: attachment; filename=\"projects-report.xlsx\"`

Ejemplo rapido:

```bash
curl -X GET http://localhost:3001/api/reports/projects/pdf \
  -H "Authorization: Bearer TU_ACCESS_TOKEN" \
  --output projects-report.pdf
```

---

## 13. Asistente de IA

Base: `/ai`

### POST `/ai/parse-document`

Analiza un documento en texto libre y crea tareas en un proyecto.

Body:

```json
{
  "projectId": "b50549e8-3818-4bc4-94c2-e67b22158f1d",
  "listId": "d91a3fb4-a2c5-446e-b1b8-d24319f0571f",
  "text": "De la reunion se definio implementar login, reporte mensual y panel de usuarios antes de fin de mes..."
}
```

Notas:

- `text` requiere minimo 20 caracteres.
- `listId` es opcional.

### POST `/ai/projects/:projectId/chat`

Permite consultar informacion del proyecto en lenguaje natural.

Body:

```json
{
  "message": "Que tareas estan atrasadas?"
}
```

Ejemplo:

```bash
curl -X POST http://localhost:3001/api/ai/projects/PROJECT_ID/chat \
  -H "Authorization: Bearer TU_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"message\":\"Que tareas tienen prioridad alta?\"}"
```

---

## 14. Logs

Base: `/logs`

Estas rutas estan documentadas como administrativas. En el controlador actual los guards estan comentados, asi que conviene revisar la seguridad antes de exponerlas en produccion.

### GET `/logs`

Lista los archivos de log disponibles.

### GET `/logs/:filename`

Lee las ultimas lineas de un archivo.

Query params:

- `lines`: entre 1 y 1000, por defecto `100`

Ejemplo:

```bash
curl "http://localhost:3001/api/logs/combined-2026-04-22.log?lines=200"
```

### GET `/logs/:filename/search`

Busca texto dentro de un archivo de logs.

Query params opcionales:

- `q`: texto a buscar
- `from`: fecha ISO, ejemplo `2026-01-01`
- `to`: fecha ISO, ejemplo `2026-12-31`
- `limit`: entre 1 y 500, por defecto `100`

Ejemplo:

```bash
curl "http://localhost:3001/api/logs/error-2026-04-22.log/search?q=timeout&limit=50"
```

---

## Flujo recomendado de uso

### Flujo basico de autenticacion

1. Registrar usuario con `POST /auth/register`
2. Verificar correo con `POST /auth/verify-email`
3. Iniciar sesion con `POST /auth/login`
4. Si aplica, completar 2FA con `POST /auth/verify-2fa`
5. Usar `accessToken` en rutas protegidas
6. Renovar sesion con `POST /auth/refresh`

### Flujo basico de proyecto

1. Crear proyecto con `POST /projects`
2. Crear columnas con `POST /projects/:projectId/lists`
3. Obtener prioridades con `GET /projects/:projectId/tasks/priorities`
4. Crear tareas con `POST /projects/:projectId/tasks`
5. Asignar miembros con `POST /projects/:projectId/members`
6. Agregar comentarios, archivos, etiquetas y checklists segun se necesite

## Errores esperables

Los errores pueden variar segun el handler, pero normalmente debes considerar:

- `400 Bad Request`: body invalido, UUID invalido, campos extra o formato incorrecto
- `401 Unauthorized`: token ausente o invalido
- `403 Forbidden`: falta de permisos
- `404 Not Found`: recurso no encontrado
- `409 Conflict`: conflictos de negocio

## Recomendacion final

Para explorar respuestas exactas y schemas completos, abre Swagger en:

`http://localhost:3001/docs`
