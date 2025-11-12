# Plan de Pruebas - Aplicación Medidor de Agua Quito

## Resumen Ejecutivo

Este documento define los casos de prueba para validar la funcionalidad de la aplicación de registro de lecturas de medidores.

## Áreas de Prueba

### 1. Autenticación

#### TC-001: Registro de nuevo usuario (Medidor)
**Pasos**:
1. Abrir aplicación
2. Hacer clic en "Crear una"
3. Ingresa: email, contraseña, nombre completo
4. Seleccionar rol "Medidor"
5. Hacer clic en "Registrarse"

**Resultado esperado**: 
- Usuario registrado
- Mostrar mensaje "Registro exitoso"
- Redirigir a login

#### TC-002: Registro de nuevo usuario (Administrador)
**Pasos**:
1. Repetir TC-001
2. Seleccionar rol "Administrador"

**Resultado esperado**: 
- Usuario registrado como admin
- Verificar en Firestore que role == 'admin'

#### TC-003: Login correcto
**Pasos**:
1. Usuario registrado ingresa email y contraseña correctos
2. Hacer clic en "Iniciar Sesión"

**Resultado esperado**:
- Sesión iniciada
- Redirigir a dashboard
- Mostrar información del usuario

#### TC-004: Login con email incorrecto
**Pasos**:
1. Ingresar email no registrado
2. Ingresar contraseña cualquiera

**Resultado esperado**:
- Mostrar error "El usuario no existe"

#### TC-005: Login con contraseña incorrecta
**Pasos**:
1. Ingresar email registrado
2. Ingresar contraseña incorrecta

**Resultado esperado**:
- Mostrar error "Contraseña incorrecta"

#### TC-006: Logout
**Pasos**:
1. Usuario logged in
2. Hacer clic en botón de logout (esquina superior derecha)

**Resultado esperado**:
- Sesión cerrada
- Redirigir a login

#### TC-007: Persistencia de sesión
**Pasos**:
1. Usuario inicia sesión
2. Cerrar navegador/app
3. Reabrir aplicación

**Resultado esperado**:
- Usuario sigue autenticado
- Mostrar dashboard sin necesidad de login

### 2. Registro de Lecturas (Medidor)

#### TC-008: Capturar foto del medidor
**Pasos**:
1. Usuario medidor en dashboard
2. Hacer clic en "+" (FAB)
3. Hacer clic en "Capturar Foto del Medidor"
4. Tomar foto
5. Confirmar captura

**Resultado esperado**:
- Foto aparece en previsualizacion
- Mostrar mensaje "Foto del medidor capturada"

#### TC-009: Capturar foto de la fachada
**Pasos**:
1. Repito TC-008 para "Capturar Foto de la Fachada"

**Resultado esperado**:
- Foto aparece en previsualizacion
- Mostrar mensaje "Foto de la fachada capturada"

#### TC-010: Obtener ubicación GPS
**Pasos**:
1. En nueva lectura
2. Hacer clic en "Obtener Ubicación"
3. Permitir acceso a ubicación en popup

**Resultado esperado**:
- Mostrar latitud y longitud
- Botón "Ver en Google Maps" aparece
- Mensaje "Ubicación obtenida exitosamente"

#### TC-011: Ver en Google Maps
**Pasos**:
1. Con ubicación obtenida
2. Hacer clic en "Ver en Google Maps"

**Resultado esperado**:
- Abre Google Maps en navegador
- Muestra marcador en coordenadas correctas

#### TC-012: Ingresar valor del medidor válido
**Pasos**:
1. En campo "Valor del Medidor"
2. Ingresar: 123.45

**Resultado esperado**:
- Valor aceptado
- Sin mensajes de error

#### TC-013: Ingresar valor del medidor inválido
**Pasos**:
1. Ingresar: "abc" o "123.456"

**Resultado esperado**:
- Mostrar error "Ingresa un valor numérico válido"
- Botón submit deshabilitado

#### TC-014: Guardar lectura completa
**Pasos**:
1. Llenar todos los campos:
   - Foto del medidor: capturada
   - Foto de fachada: capturada
   - Ubicación: obtenida
   - Valor: 125.50
   - Observaciones: "Medidor funciona correctamente"
   - Zona: "Centro Histórico"
2. Hacer clic en "Guardar Lectura"

**Resultado esperado**:
- Mostrar loader "Guardando lectura..."
- Guardar en Firestore
- Redirigir a dashboard
- Mostrar mensaje "Lectura guardada exitosamente"
- Lectura aparece en lista

#### TC-015: Guardar lectura incompleta
**Pasos**:
1. Faltar foto del medidor
2. Intentar guardar

**Resultado esperado**:
- Botón "Guardar Lectura" deshabilitado
- Mostrar mensaje "Por favor, completa todos los campos"

#### TC-016: Cancelar registro de lectura
**Pasos**:
1. Ingresar datos parciales
2. Hacer back (Android) o usar botón atrás
3. Confirmar que no hay cambios guardados

**Resultado esperado**:
- Datos no se guardan
- Regresar a dashboard

### 3. Dashboard (Medidor)

#### TC-017: Ver mis lecturas
**Pasos**:
1. Usuario medidor en dashboard
2. Ver lista de lecturas

**Resultado esperado**:
- Mostrar solo lecturas del usuario actual
- Ordenadas por fecha descendente (más recientes primero)
- Mostrar: fecha, valor, zona, estado

#### TC-018: Ver detalles de lectura
**Pasos**:
1. En lista de lecturas
2. Hacer clic en "Ver Detalles"

**Resultado esperado**:
- Abrir página de detalles
- Mostrar todas las fotos
- Mostrar coordenadas GPS
- Mostrar botón "Ver en Google Maps"

#### TC-019: Eliminar lectura propia
**Pasos**:
1. En lista de lecturas del usuario
2. Hacer clic en "Eliminar"
3. Confirmar eliminación

**Resultado esperado**:
- Mostrar diálogo de confirmación
- Eliminar de Firestore
- Quitar de lista
- Mostrar mensaje "Lectura eliminada exitosamente"

#### TC-020: No poder eliminar lectura de otro usuario
**Pasos**:
1. Medidor intenta eliminar lectura de otro usuario
2. (Verificar en código/Firestore)

**Resultado esperado**:
- Botón eliminar no visible
- Firestore rechaza eliminación

### 4. Dashboard (Administrador)

#### TC-021: Ver todas las lecturas
**Pasos**:
1. Usuario admin en dashboard
2. Ver lista de lecturas

**Resultado esperado**:
- Mostrar todas las lecturas del sistema
- De todos los medidores
- Mostrar nombre del medidor para cada lectura

#### TC-022: Ver información del medidor
**Pasos**:
1. En lista de lecturas (admin)
2. Ver información en cada tarjeta

**Resultado esperado**:
- Mostrar: "Medidor: nombre (email)"
- Información visible para validación

#### TC-023: No poder eliminar como admin
**Pasos**:
1. Admin ve lecturas
2. Verificar botón eliminar

**Resultado esperado**:
- Botón eliminar NO visible para admin
- Solo visible para propietario

#### TC-024: Ver detalles de lectura de otro usuario
**Pasos**:
1. Admin hace clic en lectura de otro medidor

**Resultado esperado**:
- Abrir detalles completos
- Mostrar todas las fotos
- Mostrar ubicación GPS exacta

### 5. Datos y Firestore

#### TC-025: Verificar estructura de usuario
**Pasos**:
1. Ir a Firestore Console
2. Ver documento en `users/{uid}`

**Resultado esperado**:
```
{
  uid: "xxxxx",
  email: "user@example.com",
  displayName: "Nombre Usuario",
  role: "meter-reader",
  createdAt: timestamp,
  photoUrl: ""
}
```

#### TC-026: Verificar estructura de lectura
**Pasos**:
1. Ir a Firestore Console
2. Ver documento en `readings/{readingId}`

**Resultado esperado**:
```
{
  userId: "xxxxx",
  meterValue: 125.50,
  observations: "...",
  meterPhotoUrl: "data:image/...",
  facadePhotoUrl: "data:image/...",
  latitude: -0.2126,
  longitude: -78.5055,
  mapsLink: "https://www.google.com/maps?q=...",
  createdAt: timestamp,
  userName: "Nombre",
  userEmail: "email@example.com",
  zone: "Centro Histórico"
}
```

#### TC-027: Validar reglas de Firestore
**Pasos**:
1. Usuario A intenta leer lectura de Usuario B
2. Usuario A intenta eliminar lectura de Usuario B
3. Usuario admin intenta leer cualquier lectura

**Resultado esperado**:
- Usuario A puede leer su lectura
- Usuario A NO puede leer de Usuario B
- Usuario A NO puede eliminar de Usuario B
- Admin puede leer todas
- Admin NO puede eliminar (no en reglas)

### 6. Permisos de Dispositivo

#### TC-028: Solicitar permiso de cámara
**Pasos**:
1. En dispositivo real
2. Hacer clic en "Capturar Foto"
3. Otorgar permiso

**Resultado esperado**:
- Dialog de permiso aparece
- Al permitir, abre cámara
- Foto capturada correctamente

#### TC-029: Rechazar permiso de cámara
**Pasos**:
1. En dispositivo real
2. Hacer clic en "Capturar Foto"
3. Rechazar permiso

**Resultado esperado**:
- Dialog de permiso aparece
- Al rechazar, mostrar error
- No abre cámara

#### TC-030: Solicitar permiso de ubicación
**Pasos**:
1. Hacer clic en "Obtener Ubicación"
2. Otorgar permiso

**Resultado esperado**:
- Dialog de permiso aparece
- Ubicación obtenida correctamente

### 7. Rendimiento

#### TC-031: Cargar lista con muchas lecturas
**Pasos**:
1. Sistema con 100+ lecturas
2. Abrir dashboard

**Resultado esperado**:
- Mostrar scroll fluido
- Cargar en < 3 segundos
- Interfaz responsive

#### TC-032: Guardar lectura con fotos grandes
**Pasos**:
1. Fotos de alta resolución
2. Guardar lectura

**Resultado esperado**:
- Guardar sin errores
- Tamaño documento < 1MB (Firestore limit)
- No tomar más de 10 segundos

### 8. Navegación

#### TC-033: Navegación entre páginas
**Pasos**:
1. Login → Dashboard → Nueva Lectura → Dashboard → Detalles

**Resultado esperado**:
- Transiciones suaves
- Back button funciona en todas partes
- URLs correctas

#### TC-034: Usar back button
**Pasos**:
1. De Nueva Lectura hacer back
2. Confirmar que no se guardan cambios

**Resultado esperado**:
- Regresar a Dashboard
- Datos no guardados

## Criterios de Aceptación

### Funcionalidad
- [ ] Todos los casos de prueba pasan
- [ ] No hay errores en consola
- [ ] Firestore está actualizado correctamente

### Rendimiento
- [ ] Carga < 3 segundos
- [ ] Login < 2 segundos
- [ ] Guardado de lectura < 5 segundos

### Seguridad
- [ ] No se exponen credenciales
- [ ] Reglas de Firestore se aplican correctamente
- [ ] Usuarios solo ven sus datos (excepto admin)

### UI/UX
- [ ] Interfaz responsive
- [ ] Mensajes claros al usuario
- [ ] Botones deshabilitados cuando corresponde
- [ ] Loaders visibles en operaciones largas

## Reporte de Defectos

Template para reportar bugs encontrados durante testing:

```
Defecto ID: BUG-001
Título: Descripción corta
Severidad: Alta/Media/Baja
Pasos para reproducir:
1. 
2. 
3. 
Resultado esperado: 
Resultado obtenido: 
Screenshots/Videos: 
Ambiente: Dispositivo/Navegador, versión SO
```

## Checklist Final

- [ ] Todas las pruebas ejecutadas
- [ ] Defectos críticos resueltos
- [ ] Defectos menores documentados
- [ ] Performance aceptable
- [ ] Seguridad validada
- [ ] Documentación actualizada
- [ ] Ready para producción
