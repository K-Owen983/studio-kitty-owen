# Estructura del Proyecto: Studio Kitty Owen

Descripción detallada de carpetas, módulos y responsabilidades en la aplicación.

```
studio-kitty-owen/
├── .env.example                  # Plantilla de variables de entorno de Firebase
├── index.html                    # HTML base con fuentes (Inter, Plus Jakarta Sans, Marck Script)
├── package.json                  # Lista de dependencias (React 18, Vite, TipTap, Firebase, Lucide)
├── vite.config.js                # Configuración de empaquetado Vite
├── DECISIONES_ARQUITECTURA.md    # Registro de decisiones técnicas del Sprint 1
├── ESTRUCTURA_PROYECTO.md        # Guía de módulos y responsabilidades (este archivo)
├── MANUAL_SPRINT_1.md            # Manual de uso y ejecución
├── GUIA_CONFIGURACION_ENV.md     # Guía para conectar Firebase real
├── PENDIENTES_SPRINT_2.md        # Funcionalidades programadas para el Sprint 2
└── src/
    ├── main.jsx                  # Punto de entrada de React 18
    ├── App.jsx                   # Coordinador general de vistas (Login vs Dashboard/Editor)
    ├── index.css                 # Sistema de diseño minimalista "Hoja Blanca"
    ├── firebase/
    │   └── config.js             # Detección de credenciales e inicializador condicional
    ├── services/                 # CAPA DE SERVICIOS DESACOPLADA
    │   ├── authService.js        # Manejo de Google Login & Mock Auth
    │   ├── publicationService.js # Persistencia CRUD de publicaciones y borrador autoguardado
    │   └── storageService.js     # Subida de imágenes a Firebase Storage o DataURL local
    ├── context/                  # GESTIÓN DE ESTADO REACT
    │   ├── AuthContext.jsx       # Proveedor de sesión de usuario
    │   └── PublicationContext.jsx# Estado global del editor, publicaciones y autoguardado
    ├── utils/                    # FUNCIONES AUXILIARES
    │   ├── textHelpers.js        # Cálculo de lectura, slugifier, extracto y fechas
    │   └── sampleData.js         # Publicaciones iniciales y usuario mock para Modo Demo
    └── components/               # COMPONENTES DE INTERFAZ DE USUARIO
        ├── Auth/
        │   └── LoginView.jsx     # Tarjeta elegante de inicio de sesión con Google / Demo
        ├── Dashboard/
        │   ├── DashboardView.jsx # Vista de entrada con listado, buscador y filtros
        │   └── PublicationCard.jsx # Tarjeta individual de publicación en el listado
        ├── Editor/
        │   ├── EditorView.jsx        # El lienzo principal de la Hoja Blanca
        │   ├── FixedToolbar.jsx      # Barra superior de formato (Bold, Italic, H1, Tablas, etc.)
        │   ├── CoverUploader.jsx     # Componente drag & drop para subir imagen de portada
        │   ├── AutoSaveIndicator.jsx # Indicador de estado del autoguardado (Guardado/Guardando)
        │   └── DraftRecoveryBanner.jsx# Notificación de borrador autoguardado restaurable
        └── Preview/
            └── LivePreviewModal.jsx  # Modal de vista previa fiel al Knowledge Hub
```
