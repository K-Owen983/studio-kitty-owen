# Manual del Sprint 1: Studio Kitty Owen (MVP)

Manual de usuario y desarrollador para ejecutar y operar el MVP de **Studio Kitty Owen**.

---

## 1. Resumen de Funcionalidades Implementadas

- **Google Authentication / Mock Auth**: Inicio de sesión seguro con Google o prueba en Modo Demo.
- **Dashboard de Entrada**: Listado de publicaciones, búsqueda en tiempo real, filtros por estado (*Borradores* / *Publicados*) y por categoría.
- **Editor "Hoja Blanca"**:
  - Lienzo limpio inspirado en Microsoft Word, Notion y Apple Notes.
  - Barra superior de herramientas: Negrita, Cursiva, Subrayado, H1, H2, H3, Listas, Citas, Tablas, Bloques de Código, Enlaces, Imágenes, Deshacer/Rehacer.
  - **Pegado Inteligente**: Conservación de formato al copiar desde Word, Google Docs y ChatGPT.
- **Subida de Imagen de Portada**: Arrastrar y soltar o explorar archivos.
- **AutoSave cada 30 segundos**: Almacenamiento automático silencioso del borrador.
- **Banner de Recuperación de Borrador**: Permite restaurar borradores no confirmados tras reabrir la app.
- **Vista Previa en Tiempo Real**: Modal que renderiza exactamente el resultado final con firma de autor y tiempo de lectura.
- **Guardar Borrador & Publicar**: Persistencia completa de la entidad `Publication`.

---

## 2. Instrucciones para Ejecutar el Proyecto

### Requisitos Previos
- Node.js versión 18 o superior.

### Pasos para iniciar localmente:
1. Abre tu terminal en la carpeta del proyecto:
   ```bash
   cd C:\Users\USER\.gemini\antigravity\scratch\studio-kitty-owen
   ```
2. Instala las dependencias (si no se han instalado):
   ```bash
   npm install
   ```
3. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Abre tu navegador en la URL indicada (por defecto `http://localhost:3000`).

---

## 3. Demostración Paso a Paso del Flujo del Sprint 1

1. **Iniciar Sesión**: Presiona "Iniciar sesión con Google". (En Modo Demo ingresará automáticamente con la cuenta de Kitty Owen).
2. **Crear Publicación**: En el Dashboard, haz clic en **"+ Nueva Publicación"**.
3. **Escribir / Pegar**:
   - Ingresa un Título y Subtítulo.
   - Escribe en la hoja blanca o copia un fragmento formateado desde **Microsoft Word, Google Docs o ChatGPT**. Observa cómo se conserva la negrita, cursiva, encabezados y listas.
4. **Subir Portada**: Haz clic o arrastra una imagen al recuadro de portada.
5. **Verificar AutoSave**: Modifica el texto y observa la esquina inferior derecha. Al cabo de 30s verás la actualización a *"Guardado HH:MM:SS"*.
6. **Vista Previa**: Presiona **"Vista Previa"** en la barra superior para confirmar la apariencia del documento.
7. **Guardar Borrador / Publicar**: Presiona **"Publicar"** para enviar la publicación al estado activo. Se agregará a la lista del Dashboard.
