# Decisiones de Arquitectura: Studio Kitty Owen (Sprint 1)

Este documento registra la justificación técnica y las decisiones de diseño adoptadas durante la construcción del Sprint 1.

---

## 1. Prioridad Absoluta del Editor ("Hoja Blanca")
- **Decisión**: La interfaz principal no presenta formularios complejos de administración estilo WordPress o CMS tradicional. Al presionar "Nueva Publicación", el usuario accede inmediatamente a un lienzo blanco que imita la estética de *Microsoft Word, Notion y Apple Notes*.
- **Razón**: Reducir la fricción cognitiva al escribir y maximizar la concentración del autor.

---

## 2. Capa de Servicios Totalmente Desacoplada
- **Decisión**: Los componentes visuales y los contextos de React nunca invocan directamente al SDK de Firebase ni a `localStorage`.
- **Lógica**: Toda la interacción de datos pasa por `AuthService`, `PublicationService` y `StorageService`.
- **Beneficio**: Permite cambiar la infraestructura o alternar entre el **Modo Demo (Offline)** y **Firebase Live** cambiando únicamente un conjunto de variables en `.env`, sin modificar ni una sola línea de código en la aplicación.

---

## 3. Fuente Primaria de Verdad: TipTap JSON vs HTML
- **Decisión**: El contenido del documento se almacena principalmente como **TipTap JSON** (`contentJson`) en la entidad `Publication`. El HTML (`contentHtml`) se compila automáticamente durante el guardado.
- **Razón**: El formato JSON preserva el árbol sintáctico estructurado (AST) de ProseMirror. Esto facilitará en Sprints futuros la transformación a PDF, la integración con la IA Editorial y el formateo para newsletters o aplicaciones móviles.

---

## 4. Separación entre Tipo (`type`) y Categoría (`category`)
- **Decisión**: Se dividió la antigua propiedad genérica `category` en dos ejes independientes:
  - `type`: Define la naturaleza editorial ("Nota Estratégica", "Ensayo", "Artículo", "Conferencia", "Documento", "Recurso").
  - `category`: Define el dominio de conocimiento ("Comunicación", "Liderazgo", "Tecnología", "Ciencia de Datos", "Estrategia").
- **Razón**: Permite filtrados multidimensionales refinados en el Knowledge Hub de `www.kittyowen.com`.

---

## 5. Autoguardado Silencioso (AutoSave) & Banner de Recuperación
- **Decisión**: Se implementó un temporizador de 30 segundos que evalúa la bandera `isDirty`. Si existen cambios sin guardar, persiste silenciosamente un borrador temporal en `publicationService`. Si el navegador se cierra inesperadamente, al reabrir la app se muestra un banner explícito que permite recuperar o descartar dicho borrador.
