# Comandos Principales - Ionic y Angular

## 📦 Instalación

### Instalar todas las dependencias
```bash
npm install
```

### Instalar Ionic CLI globalmente (si no está instalado)
```bash
npm install -g @ionic/cli
```

---

## 🏗️ Compilación y Build

### Compilar para desarrollo
```bash
ionic build
```

### Compilar con optimizaciones de producción
```bash
ionic build --prod
```

### Compilar con configuración de liberación
```bash
ionic build --configuration production
```

### Compilar y ver progreso detallado
```bash
ionic build --verbose
```

---

## 🚀 Desarrollo Local

### Servir la aplicación en el navegador
```bash
ionic serve
```

### Servir en puerto específico
```bash
ionic serve -p 8100
```

### Servir en interfaz de red (acceso desde otros dispositivos)
```bash
ionic serve --external
```

### Servir con live reload
```bash
ionic serve --live-reload
```

---

## 📱 Desarrollo en Dispositivo

### Agregar plataforma Android
```bash
ionic capacitor add android
```

### Agregar plataforma iOS (requiere macOS)
```bash
ionic capacitor add ios
```

### Sincronizar cambios con plataforma
```bash
ionic capacitor copy
```

### Copiar cambios web a plataforma
```bash
ionic capacitor sync android
```

### Abrir proyecto Android en Android Studio
```bash
ionic capacitor open android
```

### Abrir proyecto iOS en Xcode
```bash
ionic capacitor open ios
```

### Actualizar Capacitor y plugins
```bash
ionic capacitor update
```

---

## 🔍 Linting y Validación

### Ejecutar linter
```bash
ng lint
```

### Validar sintaxis TypeScript
```bash
tsc --noEmit
```

---

## 🧪 Testing

### Ejecutar pruebas unitarias
```bash
ng test
```

### Ejecutar pruebas con coverage
```bash
ng test --code-coverage
```

### Ejecutar pruebas en navegador específico
```bash
ng test --browsers=Chrome
```

---

## 🎯 Servir Aplicación

### Servir aplicación de producción compilada
```bash
npm start
```

### Servir con hot reload en desarrollo
```bash
ionic serve --live-reload
```

---

## 🧹 Limpieza

### Limpiar caché de npm
```bash
npm cache clean --force
```

### Limpiar carpetas de build
```bash
ionic capacitor copy
ionic capacitor sync
```

### Reinstalar dependencias (en caso de problemas)
```bash
rm -r node_modules package-lock.json
npm install
```

---

## 🔌 Gestión de Plugins

### Instalar plugin de Capacitor
```bash
npm install @capacitor/plugin-name
ionic capacitor sync
```

### Ejemplo: Instalar plugin de Storage
```bash
npm install @capacitor/storage
ionic capacitor sync
```

### Lista de plugins instalados
```bash
npm list | grep @capacitor
```

---

## 📊 Información del Proyecto

### Ver versión de Ionic
```bash
ionic info
```

### Ver versión de Angular
```bash
ng version
```

### Ver versión de Node y npm
```bash
node --version
npm --version
```

---

## 🚢 Despliegue

### Para Android (APK)
```bash
cd android
./gradlew assembleRelease
```

### Para iOS (IPA) - requiere macOS y Xcode
```bash
En Xcode: Product → Archive
```

---

## 🐛 Debugging

### Inspeccionar logs de dispositivo Android
```bash
adb logcat | grep ionic
```

### Abrir Chrome DevTools para Ionic Serve
```
En el navegador: http://localhost:4200
Presionar F12 o Ctrl+Shift+I
```

### Ver logs en tiempo real (Android)
```bash
adb logcat
```

---

## ⚙️ Configuración

### Ver configuración actual
```bash
ionic config get
```

### Establecer configuración
```bash
ionic config set key value
```

### Limpiar configuración
```bash
ionic config unset key
```

---

## 📈 Optimización y Performance

### Compilar con análisis de bundle
```bash
ionic build --prod
ng build --stats-json
```

### Ver tamaño de bundle
```bash
npm run build -- --stats-json
```

---

## 🔄 Flujo Típico de Desarrollo

### 1. Preparación inicial
```bash
npm install
ionic build
```

### 2. Desarrollo local
```bash
ionic serve
```

### 3. Testing en dispositivo simulado
```bash
ionic capacitor add android
ionic capacitor open android
# (Ejecutar desde Android Studio)
```

### 4. Build de producción
```bash
ionic build --prod
ionic capacitor sync
```

### 5. Crear APK (Android)
```bash
cd android
./gradlew assembleRelease
```

---

## 🚨 Troubleshooting

### Error: "Module not found"
```bash
npm install
rm -r node_modules package-lock.json
npm install
```

### Error: "ionic command not found"
```bash
npm install -g @ionic/cli
```

### Error: "Port already in use"
```bash
ionic serve -p 8101  # Usar puerto diferente
```

### Error de compilación TypeScript
```bash
npm run lint
ng lint
```

### Limpiar cache de Angular
```bash
ng cache clean
```

---

## 📚 Recursos Útiles

- [Documentación Ionic](https://ionicframework.com/docs)
- [Documentación Angular](https://angular.io)
- [Documentación Capacitor](https://capacitorjs.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)

---

## 💡 Tips y Trucos

### Ejecutar múltiples comandos
```bash
ionic build && ionic capacitor sync && ionic capacitor open android
```

### Actualizar todas las dependencias
```bash
npm update
```

### Ver diferencias en package.json
```bash
npm outdated
```

### Generar nueva página/componente
```bash
ng generate page pages/new-page
ng generate component components/my-component
```

### Analizar dependencias
```bash
npm list
npm list --depth=0
```

---

## ✅ Checklist Pre-Despliegue

- [ ] `npm install` ejecutado
- [ ] `ionic build --prod` sin errores
- [ ] Tests ejecutados correctamente
- [ ] `ionic capacitor sync` ejecutado
- [ ] APK/IPA generado
- [ ] Firebase configurado
- [ ] Permisos en AndroidManifest.xml
- [ ] Versión actualizada en capacitor.config.ts
- [ ] Environment variables configuradas
- [ ] Testing en dispositivo real completado

