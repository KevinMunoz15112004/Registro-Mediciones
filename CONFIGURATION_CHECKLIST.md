# ✅ Checklist de Configuración Final

## 1️⃣ Configuración de Firebase

- [ ] Crear proyecto en [Firebase Console](https://console.firebase.google.com)
- [ ] Copiar credenciales Firebase
- [ ] Actualizar `src/environments/firebase.config.ts` con:
  - apiKey
  - authDomain
  - projectId
  - storageBucket
  - messagingSenderId
  - appId
  - measurementId

## 2️⃣ Servicios de Firebase

### Authentication
- [ ] Habilitar "Correo electrónico/Contraseña"
- [ ] Verificar que usuarios puedan registrarse

### Firestore Database
- [ ] Crear base de datos en modo prueba
- [ ] Región: Sudamérica (Colombia/São Paulo)
- [ ] Colecciones automáticas:
  - [ ] `users` (se crea al registrar usuario)
  - [ ] `readings` (se crea al guardar lectura)

### Realtime Database
- [ ] Crear instancia (opcional, para futuras extensiones)

## 3️⃣ Reglas de Seguridad Firestore

- [ ] Actualizar reglas en Firestore Console
- [ ] Validar que:
  - [ ] Usuarios solo leen sus propios datos
  - [ ] Admin puede leer todas las lecturas
  - [ ] Solo propietario puede eliminar
  - [ ] Se valida el rol correctamente

Reglas a copiar:
```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth.uid == userId;
      allow create: if request.auth.uid == resource.data.uid;
      allow update, delete: if request.auth.uid == userId;
    }
    
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

## 4️⃣ Dependencias NPM

- [ ] `npm install` ejecutado exitosamente
- [ ] Verificar que no hay vulnerabilidades: `npm audit`
- [ ] Dependencias instaladas:
  - [ ] firebase
  - [ ] @angular/fire
  - [ ] @capacitor/camera
  - [ ] @capacitor/geolocation
  - [ ] @ionic/angular
  - [ ] ionicons

## 5️⃣ Compilación

- [ ] `ionic build` sin errores
- [ ] `ionic build --prod` compilado correctamente
- [ ] Carpeta `www/` creada exitosamente
- [ ] No hay warnings críticos

## 6️⃣ Configuración de Capacitor

- [ ] `capacitor.config.ts` actualizado con:
  - [ ] appId: `com.quito.medidor`
  - [ ] appName: `Medidor Quito`
  - [ ] Permisos de cámara configurados
  - [ ] Permisos de geolocalización configurados

## 7️⃣ Plataformas Nativas (Opcional)

### Android
- [ ] Android Studio instalado
- [ ] `ionic capacitor add android` ejecutado
- [ ] Java SDK configurado
- [ ] ANDROID_HOME variable configurada
- [ ] `ionic capacitor open android` abre el proyecto

### iOS (requiere macOS)
- [ ] Xcode instalado
- [ ] `ionic capacitor add ios` ejecutado
- [ ] `ionic capacitor open ios` abre el proyecto

## 8️⃣ Pruebas Locales

- [ ] `ionic serve` funciona correctamente
- [ ] Aplicación accesible en `http://localhost:4200`
- [ ] Login/Registro funciona
- [ ] Puede crear usuario nuevo
- [ ] Puede iniciar sesión
- [ ] Dashboard se carga correctamente
- [ ] Pueda navegar entre páginas

## 9️⃣ Funcionalidad Principal

- [ ] Registrar usuario (medidor)
- [ ] Registrar usuario (admin)
- [ ] Login con email y contraseña
- [ ] Ver dashboard (medidor vs admin diferente)
- [ ] Crear nueva lectura:
  - [ ] Capturar foto del medidor
  - [ ] Capturar foto de la fachada
  - [ ] Obtener ubicación GPS
  - [ ] Ingresar valor del medidor
  - [ ] Guardar lectura exitosamente
- [ ] Ver lista de lecturas
- [ ] Ver detalles de lectura
- [ ] Ver ubicación en Google Maps
- [ ] Eliminar lectura propia (medidor)
- [ ] Logout funciona

## 🔟 Datos en Firestore

- [ ] Usuarios guardados correctamente en `users/{uid}`
- [ ] Lecturas guardadas correctamente en `readings/{readingId}`
- [ ] Fotos almacenadas como base64
- [ ] Coordenadas GPS correctas
- [ ] Enlaces Google Maps generados correctamente
- [ ] Timestamps automáticos

## 1️⃣1️⃣ Documentación

- [ ] README_APP.md completo
- [ ] QUICK_START.md con instrucciones claras
- [ ] DEPLOYMENT_GUIDE.md paso a paso
- [ ] TEST_PLAN.md con 34 casos de prueba
- [ ] IONIC_COMMANDS.md con comandos útiles
- [ ] SUMMARY.md con resumen del proyecto

## 1️⃣2️⃣ Seguridad

- [ ] Credenciales de Firebase no están en repositorio
- [ ] `.gitignore` incluye `environments/firebase.config.ts`
- [ ] Usar variables de entorno en producción
- [ ] HTTPS habilitado
- [ ] Validación de datos en cliente
- [ ] Validación de datos en servidor (Firestore rules)

## 1️⃣3️⃣ Performance

- [ ] Aplicación carga en < 3 segundos
- [ ] Login completa en < 2 segundos
- [ ] Guardado de lectura en < 5 segundos
- [ ] No hay memory leaks
- [ ] Bundle size optimizado

## 1️⃣4️⃣ Accesibilidad

- [ ] Colores con suficiente contraste
- [ ] Textos legibles
- [ ] Botones grandes y fáciles de tocar
- [ ] Mensajes claros al usuario
- [ ] Funciona en dispositivos de diferentes tamaños

## 1️⃣5️⃣ Testing

- [ ] Plan de pruebas completado (TEST_PLAN.md)
- [ ] 34 casos de prueba pasados
- [ ] Pruebas en navegador
- [ ] Pruebas en dispositivo real (si es posible)
- [ ] No hay errores en consola

## 1️⃣6️⃣ Despliegue (Preparación)

### Android
- [ ] APK generado exitosamente
- [ ] APK testado en dispositivo
- [ ] Versión actualizada en `build.gradle`
- [ ] Screenshots 1080x1920px preparados
- [ ] Descripción y política privacidad listos

### iOS (Requiere macOS)
- [ ] IPA generado exitosamente
- [ ] IPA testado en dispositivo
- [ ] Versión actualizada en Info.plist
- [ ] Screenshots 1242x2208px preparados
- [ ] Descripción y política privacidad listos

## 1️⃣7️⃣ Publicación (Opcional)

### Google Play Store
- [ ] Crear cuenta developer
- [ ] APK firmado
- [ ] Información de app completa
- [ ] Screenshots y descripciones
- [ ] Política privacidad

### Apple App Store (Requiere macOS)
- [ ] Crear cuenta developer
- [ ] IPA firmado
- [ ] Información de app completa
- [ ] Screenshots y descripciones
- [ ] Política privacidad

## 1️⃣8️⃣ Monitoreo Post-Despliegue

- [ ] Error reporting configurado
- [ ] Analytics habilitado (opcional)
- [ ] Firestore usage monitoreado
- [ ] Database backups configurados
- [ ] Contacto de soporte definido

## ✨ Antes de Ir a Producción

- [ ] Todas las secciones anteriores completadas
- [ ] Testing exhaustivo realizado
- [ ] Documentación actualizada
- [ ] Equipo capacitado en el uso
- [ ] Plan de soporte definido
- [ ] Procedimiento de backup establecido
- [ ] Plan de recuperación ante desastres

---

## 📞 Notas Importantes

### Credenciales Firebase
No comprometer en repositorio. Usar:
- `.env` files
- Variables de entorno
- Secrets en CI/CD
- Firebase config dinámico en producción

### Permisos de Dispositivo
El usuario debe otorgar permisos cuando se soliciten:
- Cámara
- Ubicación GPS
- Internet

### Límites de Firestore
- Máximo 1MB por documento
- Máximo 500 operaciones/segundo (free tier)
- Si almacena fotos grandes, considere comprimir

### Soporte
Para problemas, consultar:
1. README_APP.md (Troubleshooting)
2. DEPLOYMENT_GUIDE.md (Despliegue)
3. Documentación oficial de Ionic/Firebase

---

## 🎯 Estado del Proyecto

| Sección | Estado | Notas |
|---------|--------|-------|
| Desarrollo | ✅ Completo | Todas las características implementadas |
| Testing | ✅ Listo | Plan de pruebas disponible |
| Documentación | ✅ Completa | 5 documentos detallados |
| Despliegue | ✅ Guía completa | Paso a paso para Android/iOS |
| Producción | ⏳ Pendiente | Completar checklist de configuración |

---

**Última actualización**: 11 de noviembre de 2025
**Versión**: 1.0.0
**Próximo paso**: Completar configuración de Firebase y realizar testing
