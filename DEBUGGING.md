# Debugging y Solución de Problemas

## 🔍 Depuración en Desarrollo

### Activar Console Logs

Para ver logs de desarrollo, abrir la consola del navegador:

**Chrome/Brave:**
- F12 o Ctrl+Shift+I
- Tab: Console

**Firefox:**
- F12 o Ctrl+Shift+I
- Tab: Console

### Logs Principales en la Aplicación

La aplicación incluye logs en puntos clave:

1. **Auth Service**: login/logout
2. **Reading Service**: guardar/obtener lecturas
3. **Camera Service**: captura de fotos
4. **Location Service**: obtención de GPS

## 🛠️ Herramientas de Debugging

### Firebase Console

Para inspeccionar datos en tiempo real:

1. Ir a: https://console.firebase.google.com
2. Proyecto: Seleccionar "medidor-quito"
3. Firestore Database: Ver documentos en tiempo real

### Chrome DevTools

Útil para inspeccionar:
- Estado de la aplicación
- Network requests
- Local Storage (sesiones)
- Performance

### Angular DevTools

Para debugging de Angular:

1. Instalar extensión Chrome: "Angular DevTools"
2. Abre DevTools (F12)
3. Tab: "Angular"

## 📊 Monitoreo en Firestore Console

### Ver Usuarios Registrados

1. Firestore Database → Colección "users"
2. Ver documentos con estructura:
```
users/
  ├── uid1/
  │   ├── email: "user@example.com"
  │   ├── displayName: "Nombre"
  │   ├── role: "meter-reader"
  │   └── createdAt: timestamp
```

### Ver Lecturas Guardadas

1. Firestore Database → Colección "readings"
2. Ver documentos:
```
readings/
  ├── readingId1/
  │   ├── userId: "uid1"
  │   ├── meterValue: 125.50
  │   ├── meterPhotoUrl: "data:image/..."
  │   ├── latitude: -0.2126
  │   ├── longitude: -78.5055
  │   └── createdAt: timestamp
```

## 🐛 Problemas Comunes y Soluciones

### Problema 1: "Firebase not initialized"

**Síntomas:**
- Error en consola: "Firebase not initialized"
- La app no carga después de login
- Botones no responden

**Causas:**
- firebase.config.ts con valores por defecto
- Credenciales inválidas
- Firebase Console no accesible

**Soluciones:**
1. Verificar `src/environments/firebase.config.ts`
2. Copiar credenciales reales desde Firebase Console
3. Verificar conexión a internet
4. Borrar LocalStorage: 
   ```javascript
   // En consola del navegador
   localStorage.clear()
   location.reload()
   ```

### Problema 2: "Permission denied" al guardar lectura

**Síntomas:**
- Error al hacer clic en "Guardar Lectura"
- Toast: "Error al guardar la lectura"
- Lectura no aparece en Firestore

**Causas:**
- Reglas de Firestore no configuradas
- Usuario no autenticado
- userId no coincide

**Soluciones:**
1. Verificar reglas en Firestore Console:
   ```firestore
   match /readings/{readingId} {
     allow create: if request.auth.uid == request.resource.data.userId;
   }
   ```
2. Verificar que `userId` en el documento sea igual a `request.auth.uid`
3. Cambiar a "Modo de prueba" temporalmente para testing:
   ```firestore
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       allow read, write: if true;  // ⚠️ Solo para desarrollo!
     }
   }
   ```

### Problema 3: Permiso de cámara denegado

**Síntomas:**
- No abre la cámara al hacer clic
- "Camera permission denied"

**En navegador:**
1. Chrome → Configuración (⋮) → Privacidad y seguridad
2. Configuración de sitios → Cámara
3. Buscar: "localhost:4200"
4. Cambiar a "Permitir"
5. Recargar la página

**En Android:**
1. Configuración → Aplicaciones → Medidor Quito
2. Permisos → Cámara → Permitir

**En iOS:**
1. Configuración → Medidor Quito
2. Cámara → Permitir

### Problema 4: Permiso de ubicación denegado

**Síntomas:**
- No obtiene ubicación
- "Geolocation permission denied"
- Latitud/Longitud no aparecen

**En navegador:**
1. Chrome → Configuración (⋮) → Privacidad y seguridad
2. Configuración de sitios → Ubicación
3. Buscar: "localhost:4200"
4. Cambiar a "Permitir"
5. Recargar la página

**En Android:**
1. Configuración → Aplicaciones → Medidor Quito
2. Permisos → Ubicación → Permitir mientras uses la app

**En iOS:**
1. Configuración → Medidor Quito
2. Ubicación → Usar mientras usas la app

### Problema 5: Las fotos no se guardan

**Síntomas:**
- Las fotos aparecen pero no se guardan
- Error "Document exceeds 1MB"

**Causas:**
- Fotos muy grandes
- Base64 excede límite de Firestore (1MB/documento)

**Soluciones:**
1. Comprimir fotos antes de guardar:
   ```typescript
   // En CameraService
   const compressedPhoto = compressImage(photoBase64);
   ```
2. Usar resolución menor en cámara
3. Aumentar límite de Firestore (pagar)
4. Usar Storage de Firebase en lugar de Firestore

### Problema 6: Dashboard vacío aunque existen lecturas

**Síntomas:**
- Dashboard dice "No hay lecturas"
- Pero en Firestore sí existen documentos

**Causas:**
- Usuario no tiene permiso (reglas de Firestore)
- userId no coincide
- Query de Firestore falla

**Soluciones:**
1. Verificar en consola:
   ```javascript
   // En consola del navegador
   const user = firebase.auth().currentUser;
   console.log('UID actual:', user.uid);
   ```

2. En Firestore Console, verificar userId de una lectura:
   - Abrir documento
   - Comparar userId con UID del usuario actual

3. Si no coinciden, puede ser que:
   - Se registró con email diferente
   - Hay múltiples cuentas

### Problema 7: Logout no funciona

**Síntomas:**
- Hacer clic en logout pero sigue en dashboard
- No redirige a login

**Causas:**
- Error en AuthGuard
- Sesión aún activa en LocalStorage
- Error de red

**Soluciones:**
1. Limpiar LocalStorage:
   ```javascript
   localStorage.clear()
   ```
2. Borrar cookies de sesión
3. Verificar en consola:
   ```javascript
   firebase.auth().signOut().then(() => {
     console.log('Logout exitoso');
   })
   ```

## 🔧 Debugging de Firebase

### Activar Debug Logging

Agregar al `main.ts`:

```typescript
import { enableLogging } from 'firebase/firestore';

// Después de inicializar Firebase
enableLogging(true);
```

### Consultar Estado de Autenticación

En consola del navegador:

```javascript
// Ver usuario actual
firebase.auth().currentUser

// Ver token
firebase.auth().currentUser?.getIdToken().then(token => {
  console.log('Token:', token);
})

// Listar todas las sesiones
firebase.auth().getRedirectResult()
```

### Consultar Datos de Firestore

```javascript
// Importar en consola
const db = firebase.firestore();

// Obtener todas las lecturas del usuario actual
const uid = firebase.auth().currentUser.uid;
db.collection('readings')
  .where('userId', '==', uid)
  .get()
  .then(snap => {
    snap.forEach(doc => console.log(doc.data()));
  });
```

## 📝 Logs Útiles para Depuración

### Verificar usuario autenticado

```typescript
// En cualquier componente
const user = this.authService.getCurrentUser();
console.log('Usuario actual:', user?.email);
```

### Verificar rol del usuario

```typescript
const userData = await this.authService.getUserData(uid);
console.log('Rol:', userData?.role);
```

### Verificar que se guardó la lectura

```typescript
const reading = await this.readingService.getReadingById(readingId);
console.log('Lectura guardada:', reading);
```

## 🌐 Testing en Dispositivo Real

### Android Debug Bridge (ADB)

Para ver logs en dispositivo Android:

```bash
adb logcat | grep "chrome"
```

### Safari Remote Debugging (iOS)

1. Conectar iPhone por USB
2. Abrir Safari en Mac
3. Develop → Device → Seleccionar app
4. Abre Web Inspector

## 📊 Performance Monitoring

### Medir tiempo de operaciones

```typescript
console.time('reading-save');
await this.readingService.saveReading(reading);
console.timeEnd('reading-save');
```

### Medir tamaño de fotos

```typescript
console.log('Tamaño foto:', new Blob([photoBase64]).size, 'bytes');
```

## 🆘 Reporte de Bugs

Cuando encuentres un bug, incluir:

1. **Pasos para reproducir**
2. **Comportamiento esperado**
3. **Comportamiento actual**
4. **Dispositivo/Navegador**
5. **Versión del SO**
6. **Logs de consola** (captura de pantalla)
7. **Screenshots**

## 📚 Recursos de Debugging

- [Firebase Debugging Guide](https://firebase.google.com/docs/firestore/debug)
- [Angular DevTools](https://angular.io/guide/devtools)
- [Chrome DevTools Guide](https://developer.chrome.com/docs/devtools/)
- [Ionic Debugging](https://ionicframework.com/docs/angular/your-first-app/running)

## ✅ Checklist de Debugging

- [ ] Consola sin errores rojos
- [ ] Firebase inicializado correctamente
- [ ] Usuario autenticado al abrir dashboard
- [ ] Firestore tiene datos
- [ ] Reglas de seguridad funcionan
- [ ] Fotos se guardan correctamente
- [ ] Ubicación GPS funciona
- [ ] Performance aceptable
- [ ] Sin memory leaks

---

**Nota**: Siempre verificar la **consola del navegador (F12)** primero antes de asumir que no funciona nada.
