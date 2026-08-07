# Guía de Configuración `.env` y Conexión con Firebase Real

Paso a paso para conectar **Studio Kitty Owen** con tu proyecto real de Firebase sin modificar el código de la aplicación.

---

## 1. Dónde crear el archivo `.env`

Crea un archivo llamado `.env` en la raíz del proyecto:
`C:\Users\USER\.gemini\antigravity\scratch\studio-kitty-owen\.env`

Puedes copiar como base el archivo `.env.example`:
```bash
cp .env.example .env
```

---

## 2. Variables de entorno a completar

Llena el archivo `.env` con la siguiente estructura:

```env
VITE_FIREBASE_API_KEY=tu_api_key_real
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id_real
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_id
VITE_FIREBASE_APP_ID=tu_app_id
```

---

## 3. Dónde obtener cada dato en la consola de Firebase

1. Ingresa a la [Consola de Firebase](https://console.firebase.google.com/).
2. Selecciona tu proyecto existente.
3. Haz clic en el ícono de **Configuración del proyecto (Project Settings ⚙️)** en el menú lateral izquierdo.
4. En la pestaña **General**, desplázate hacia abajo hasta la sección **Tus aplicaciones (Your apps)**.
5. Si no has registrado una aplicación web, haz clic en **Web (</>)** y asígnale un nombre (ej. `Studio Kitty Owen`).
6. Copia los valores del objeto `firebaseConfig` proporcionado por la consola e insértalos en tu archivo `.env`.

---

## 4. Configuración adicional requerida en Firebase Console

### A. Autenticación por Google:
- En Firebase Console, ve a **Authentication** -> **Sign-in method**.
- Activa el proveedor **Google** y guarda los cambios.
- Asegúrate de agregar `localhost` a los **Authorized domains**.

### B. Base de Datos Firestore:
- En Firebase Console, ve a **Firestore Database** -> **Crear base de datos**.
- Selecciona el modo de producción o prueba y crea la colección `publications`.

### C. Almacenamiento de Imágenes (Storage):
- En Firebase Console, ve a **Storage** -> **Empezar**.
- Permite la creación de la carpeta `covers/`.

---

## 5. Verificación de la Conexión

Al iniciar la aplicación (`npm run dev`), abre la consola del navegador o revisa el indicador en la barra superior:
- Si el banner indica **"Firebase Live"** y ves en consola `✅ Firebase conectado exitosamente`, las credenciales están activas.
- Si eliminas el archivo `.env`, la aplicación regresará automáticamente al **Modo Demo (Offline)**.
