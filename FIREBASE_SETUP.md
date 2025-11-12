# Configuración de Firebase - Paso a Paso

## 1. Crear Proyecto en Firebase Console

### Acceso
1. Ir a: https://console.firebase.google.com
2. Hacer clic en "Crear proyecto"
3. Nombre: **medidor-quito**
4. Seguir el asistente de configuración

## 2. Registrar la Aplicación Web

1. En Firebase Console, hacer clic en la aplicación web (icono: `</>`
2. Nombre de la aplicación: **Medidor Quito Web**
3. Copiar las credenciales (apiKey, authDomain, projectId, etc.)

## 3. Actualizar firebase.config.ts

Abrir: `src/environments/firebase.config.ts`

Reemplazar con las credenciales de tu proyecto:

```typescript
export const firebaseConfig = {
  apiKey: "AIzaSyD...",              // de Firebase Console
  authDomain: "medidor-quito.firebaseapp.com",
  projectId: "medidor-quito",
  storageBucket: "medidor-quito.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123...",
  measurementId: "G-ABC123..."
};
```

## 4. Habilitar Authentication

En Firebase Console:

1. Ir a: **Authentication** → **Sign-in method**
2. Habilitar: **Email/Password**
3. Hacer clic en "Guardar"

Opcional:
- Google Sign-In
- Facebook Sign-In

## 5. Crear Firestore Database

En Firebase Console:

1. Ir a: **Firestore Database**
2. Hacer clic en "Crear base de datos"
3. Ubicación: **América del Sur (São Paulo)** o **América del Sur (Colombia)**
4. Modo: **Comenzar en modo de prueba** (luego actualizar reglas)

### Crear Colecciones

La app creará automáticamente:
- **users** - Cuando se registre el primer usuario
- **readings** - Cuando se guarde la primera lectura

## 6. Configurar Reglas de Seguridad

En Firebase Console:

1. Ir a: **Firestore Database** → **Reglas**
2. Reemplazar con:

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
      // Medidor lee sus propias lecturas
      // Admin lee todas las lecturas
      allow read: if 
        request.auth.uid == resource.data.userId || 
        (request.auth != null && 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      
      // Crear lectura
      allow create: if request.auth.uid == request.resource.data.userId;
      
      // Medidor actualiza sus lecturas
      allow update: if request.auth.uid == resource.data.userId;
      
      // Eliminar: Solo el dueño o admin (en este caso, solo dueño)
      allow delete: if 
        request.auth.uid == resource.data.userId ||
        (request.auth != null && 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
  }
}
```

3. Hacer clic en "Publicar"

## 7. Habilitar Realtime Database (Opcional)

En Firebase Console:

1. Ir a: **Realtime Database**
2. Hacer clic en "Crear base de datos"
3. Ubicación: **América del Sur (São Paulo)**
4. Modo: **Comenzar en modo de prueba**

## 8. Configurar Variables de Entorno

Crear archivo: `src/environments/.env` (para desarrollo)

```
FIREBASE_API_KEY=AIzaSyD...
FIREBASE_AUTH_DOMAIN=medidor-quito.firebaseapp.com
FIREBASE_PROJECT_ID=medidor-quito
FIREBASE_STORAGE_BUCKET=medidor-quito.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789012
FIREBASE_APP_ID=1:123456789012:web:abc123...
```

## 9. Verificar Configuración

Ejecutar la aplicación:

```bash
npm start
```

1. Ir a: http://localhost:4200
2. Hacer clic en "Crear una aquí" para registrarse
3. Verificar que el usuario aparece en Firestore Console

## 10. Crear Usuarios de Prueba

### Usuario 1: Medidor
- Email: `medidor1@example.com`
- Contraseña: `123456`
- Nombre: `Juan Pérez`
- Rol: Medidor

### Usuario 2: Admin
- Email: `admin@example.com`
- Contraseña: `123456`
- Nombre: `Administrador`
- Rol: Administrador

## 11. Probar Funcionalidad

### Como Medidor:
1. Iniciar sesión
2. Hacer clic en "+"
3. Capturar fotos
4. Obtener ubicación
5. Guardar lectura

### Como Admin:
1. Iniciar sesión
2. Verificar que ve todas las lecturas

## Checklist de Configuración

- [ ] Proyecto creado en Firebase
- [ ] Web app registrada
- [ ] firebase.config.ts actualizado
- [ ] Authentication habilitado (Email/Password)
- [ ] Firestore Database creado
- [ ] Reglas de Firestore configuradas
- [ ] Realtime Database creado (opcional)
- [ ] Variables de entorno configuradas
- [ ] App compila sin errores
- [ ] Registro de usuario funciona
- [ ] Login funciona
- [ ] Dashboard visible
- [ ] Puedo registrar lectura
- [ ] Admin ve todas las lecturas

## Solucionar Problemas

### "Firebase not initialized"
**Causa**: firebase.config.ts no está actualizado
**Solución**: Copiar credenciales reales de Firebase Console

### "Permission denied" al guardar lectura
**Causa**: Reglas de Firestore no están correctas
**Solución**: Verificar que el userId coincida en los datos guardados

### "User not found" al iniciar sesión
**Causa**: Usuario no registrado
**Solución**: Crear cuenta primero en "Crear una aquí"

### No puedo capturar fotos
**Causa**: Permiso de cámara denegado
**Solución**: En navegador permitir cámara; en dispositivo habilitar permisos

### No obtengo ubicación
**Causa**: Permiso de ubicación denegado
**Solución**: En navegador permitir ubicación; en dispositivo habilitar permisos

## Recursos Útiles

- [Firebase Console](https://console.firebase.google.com)
- [Firebase Docs](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security)

## Próximos Pasos

1. Completar configuración de Firebase
2. Ejecutar `npm start` para probar
3. Crear cuentas de prueba
4. Realizar pruebas funcionales
5. Ver `TEST_PLAN.md` para casos de prueba
6. Cuando esté listo, ver `DEPLOYMENT_GUIDE.md` para publicar
