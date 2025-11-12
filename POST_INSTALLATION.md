# 🚀 Instrucciones Post-Instalación

Después de haber completado la instalación, sigue estos pasos para que la aplicación funcione correctamente.

---

## 1️⃣ Configurar Firebase

### Paso 1: Crear Proyecto Firebase

1. Ir a [Firebase Console](https://console.firebase.google.com)
2. Hacer clic en "Crear un proyecto"
3. Nombre: `MedidorQuito`
4. Desabilitar Google Analytics (opcional)
5. Crear proyecto

### Paso 2: Registrar Aplicación Web

1. En el proyecto, hacer clic en `</>` (Web)
2. Nombre: `MedidorQuito`
3. Copiar el código de configuración
4. Hacer clic en "Continuar a la consola"

### Paso 3: Copiar Credenciales

Copiar los siguientes valores de la configuración:

```
apiKey: "..."
authDomain: "..."
projectId: "..."
storageBucket: "..."
messagingSenderId: "..."
appId: "..."
measurementId: "..."
```

### Paso 4: Actualizar Archivo de Configuración

Abrir: `src/environments/firebase.config.ts`

Reemplazar los valores:

```typescript
export const firebaseConfig = {
  apiKey: "COPIAR_AQUI",
  authDomain: "COPIAR_AQUI",
  projectId: "COPIAR_AQUI",
  storageBucket: "COPIAR_AQUI",
  messagingSenderId: "COPIAR_AQUI",
  appId: "COPIAR_AQUI",
  measurementId: "COPIAR_AQUI"
};
```

---

## 2️⃣ Habilitar Servicios Firebase

### Authentication

1. En Firebase Console, ir a **Authentication**
2. Hacer clic en "Empezar"
3. Seleccionar "Correo electrónico/Contraseña"
4. Habilitar "Correo electrónico/Contraseña"
5. Hacer clic en "Guardar"

### Firestore Database

1. En Firebase Console, ir a **Firestore Database**
2. Hacer clic en "Crear base de datos"
3. Seleccionar región: **South America (São Paulo)** o **South America (Bogotá)**
4. Seleccionar modo: **Start in test mode** (cambiar después para producción)
5. Crear base de datos

**Esperar 1-2 minutos a que se cree la base de datos**

### Realtime Database

1. En Firebase Console, ir a **Realtime Database**
2. Hacer clic en "Crear base de datos"
3. Seleccionar región
4. Seleccionar modo: **Start in test mode**
5. Crear base de datos

---

## 3️⃣ Configurar Reglas de Seguridad

### Firestore Rules

1. En Firestore Database, ir a **Reglas**
2. Reemplazar contenido con:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Colección de usuarios
    match /users/{userId} {
      allow read: if request.auth.uid == userId;
      allow create: if request.auth.uid == resource.data.uid;
      allow update, delete: if request.auth.uid == userId;
    }
    
    // Colección de lecturas
    match /readings/{readingId} {
      allow read: if 
        request.auth.uid == resource.data.userId || 
        (request.auth != null && 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow create: if request.auth.uid == request.resource.data.userId;
      allow update: if request.auth.uid == resource.data.userId;
      allow delete: if 
        request.auth.uid == resource.data.userId ||
        (request.auth != null && 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
  }
}
```

3. Hacer clic en "Publicar"

### Realtime Database Rules (Opcional)

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

---

## 4️⃣ Compilar la Aplicación

### Desde Terminal/PowerShell

```bash
cd c:\Users\kevin\Downloads\moviles\AppDeber
npm install
ionic build
```

**Resultado esperado:**
```
✅ Application bundle generation complete
Output location: ...\www
```

---

## 5️⃣ Servir en Navegador

### Para Desarrollo

```bash
ionic serve
```

La aplicación se abrirá en: `http://localhost:4200`

### Esperar a que cargue

Esperar a ver el mensaje:
```
✓ Compiled successfully
The application will automatically reload if you change any of the source files.
```

---

## 6️⃣ Crear Cuentas de Prueba

### Cuenta 1: Medidor

1. En la aplicación (http://localhost:4200), hacer clic en "Crear una"
2. Rellenar:
   - Email: `medidor1@example.com`
   - Contraseña: `123456`
   - Nombre: `Juan Medidor`
   - Rol: `Medidor`
3. Hacer clic en "Registrarse"
4. Esperar mensaje "Registro exitoso"
5. Iniciar sesión con email y contraseña

### Cuenta 2: Administrador

1. Abrir navegador en incógnito o nueva ventana
2. Ir a: `http://localhost:4200`
3. Hacer clic en "Crear una"
4. Rellenar:
   - Email: `admin@example.com`
   - Contraseña: `123456`
   - Nombre: `Admin Quito`
   - Rol: `Administrador`
5. Hacer clic en "Registrarse"
6. Esperar mensaje "Registro exitoso"
7. Iniciar sesión

---

## 7️⃣ Probar Funcionalidad

### Con Cuenta Medidor

1. Iniciar sesión como medidor
2. Hacer clic en el botón "+" (esquina inferior derecha)
3. Hacer clic en "Capturar Foto del Medidor"
   - Permitir acceso a cámara
   - Tomar una foto (o permitir que siga sin foto en navegador)
4. Hacer clic en "Capturar Foto de la Fachada"
   - Permitir acceso a cámara
5. Hacer clic en "Obtener Ubicación"
   - Permitir acceso a ubicación
6. Rellenar:
   - Valor del Medidor: `125.50`
   - Observaciones: `Medidor funcionando normalmente`
   - Zona: `Centro Histórico`
7. Hacer clic en "Guardar Lectura"
8. Esperar mensaje "Lectura guardada exitosamente"

### Con Cuenta Admin

1. Iniciar sesión como admin (en otra ventana/incógnito)
2. Ver dashboard con TODAS las lecturas
3. Ver información del medidor que registró
4. Hacer clic en "Ver Detalles"
5. Ver fotos y ubicación
6. Hacer clic en "Ver en Google Maps"

---

## 8️⃣ Validar en Firestore

### Ver Usuarios

1. En Firebase Console, ir a **Firestore Database**
2. Ver colección: `users`
3. Verificar que ambos usuarios existen:
   - `medidor1@example.com` con `role: "meter-reader"`
   - `admin@example.com` con `role: "admin"`

### Ver Lecturas

1. En Firestore Database, colección: `readings`
2. Verificar que la lectura se guardó con:
   - userId del medidor
   - meterValue: 125.50
   - latitude y longitude
   - mapsLink completo

---

## ⚠️ Solución de Problemas

### Problema: "Firebase not initialized"
**Solución**: Verificar que `firebase.config.ts` tiene los valores correctos (no deben ser "YOUR_...")

### Problema: "User not found" al iniciar sesión
**Solución**: Verificar que las credenciales son correctas y el usuario se registró exitosamente

### Problema: "Permission denied" al guardar lectura
**Solución**: Verificar reglas de Firestore, especialmente la colección `readings`

### Problema: Cámara no funciona en navegador
**Solución**: En Chrome, ir a Settings → Privacy → Site Settings → Camera → Permitir para localhost:4200

### Problema: Ubicación no se obtiene
**Solución**: 
- En Chrome: Settings → Privacy → Site Settings → Location → Permitir
- En dispositivo real: Permitir permisos en configuración del SO

### Problema: Las fotos no aparecen
**Solución**: En navegador, puede no capturar fotos reales. Las imágenes se guardan como base64 en Firestore.

---

## 🚀 Siguientes Pasos

### Para Desarrollo Local
1. ✅ Firebase configurado
2. ✅ Cuentas de prueba creadas
3. ✅ Funcionalidad validada
4. Hacer cambios en código
5. Refrescar navegador para verlos

### Para Testing Completo
1. ✅ Configuración inicial completa
2. Seguir [TEST_PLAN.md](TEST_PLAN.md)
3. Ejecutar los 34 casos de prueba
4. Documentar resultados

### Para Desplegar en Dispositivo
1. ✅ Validar en navegador
2. Seguir [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
3. Generar APK/IPA
4. Instalar en dispositivo

### Para Publicar en Stores
1. ✅ Testing completado
2. Seguir [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
3. Crear cuentas developer
4. Subir a Google Play Store / Apple App Store

---

## 📋 Checklist Rápido

- [ ] Firebase proyecto creado
- [ ] Credenciales copiadas en firebase.config.ts
- [ ] Authentication habilitado
- [ ] Firestore Database creado
- [ ] Reglas de Firestore actualizadas
- [ ] `ionic build` compiló sin errores
- [ ] `ionic serve` corriendo en http://localhost:4200
- [ ] Usuario medidor creado y testeado
- [ ] Usuario admin creado y testeado
- [ ] Primera lectura guardada exitosamente
- [ ] Datos visible en Firestore Console
- [ ] Funcionalidad validada

---

## 📞 Soporte

Si algo no funciona:

1. Verificar [README_APP.md - Troubleshooting](README_APP.md#troubleshooting)
2. Revisar [QUICK_START.md - Troubleshooting Común](QUICK_START.md#troubleshooting-común)
3. Validar en Firestore Console que datos se guardaron
4. Revisar logs en navegador (F12 → Console)

---

## 🎉 ¡Listo!

La aplicación está completamente configurada y lista para:
- 🧪 Testing
- 🚀 Despliegue
- 📱 Publicación en stores

Próximo paso: Lee [TEST_PLAN.md](TEST_PLAN.md) para pruebas exhaustivas.

---

**Última actualización**: 11 de noviembre de 2025
