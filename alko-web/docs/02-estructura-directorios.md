# 02. Estructura de Directorios y Organización de Código

El proyecto sigue una arquitectura limpia basada en las convenciones del **Next.js App Router**, promoviendo la cohesión alta y el acoplamiento bajo.

```
alko-web/
├── app/                  # Rutas, páginas y API handlers (App Router)
│   ├── (public)/         # Rutas públicas (Home, Proyectos, Servicios, etc.)
│   ├── admin/            # Panel administrativo protegido por RBAC
│   ├── api/              # Endpoints REST (Backend interno)
│   │   ├── admin/        # Endpoints protegidos para el panel de gestión
│   │   ├── contacto/     # Recepción de leads públicos y formularios
│   │   └── empleo/       # Postulaciones de candidatos y CVs
│   ├── layout.tsx        # Layout principal global
│   ├── globals.css       # Estilos globales y utilidades de Tailwind
│   ├── sitemap.ts        # Generador dinámico de sitemap XML para SEO
│   └── robots.ts         # Reglas de indexación para motores de búsqueda
├── components/           # Componentes modulares y reutilizables
│   ├── admin/            # Componentes específicos del panel de control
│   ├── article/          # Tarjetas y visores de artículos/blog
│   ├── contact/          # Formularios de contacto y cálculo de presupuestos
│   ├── empleo/           # Formularios de vacantes y postulaciones
│   ├── layout/           # Cabecera (Header), Pie (Footer) y Navegación
│   ├── sections/         # Secciones temáticas (Hero, Servicios, Proceso, etc.)
│   └── ui/               # Componentes atómicos (Botones, Inputs, Modales, Badges)
├── data/                 # Almacenamiento local persistente
│   └── site_content.json # Copia de seguridad y persistencia de respaldo
├── docs/                 # Documentación técnica del proyecto
├── lib/                  # Lógica de dominio, servicios e integraciones
│   ├── auth/             # Módulos de autenticación, sesión y RBAC
│   │   ├── session.ts    # Creación y verificación de tokens JWT HMAC
│   │   └── rbac.ts       # Definición de roles, permisos y utilidades
│   ├── db/               # Conexión a base de datos y métodos de consulta
│   │   └── mysql.ts      # Pool MySQL y capa de abstracción con fallback
│   ├── email/            # Servicio de envío de correos y plantillas SMTP
│   ├── content.ts        # Estructuras de contenido predeterminadas
│   ├── site.ts           # Configuración global del sitio (URLs, Metadatos)
│   ├── types.ts          # Tipos e interfaces globales de TypeScript
│   └── utils.ts          # Funciones de apoyo comunes (formato, slugs, etc.)
├── public/               # Archivos estáticos servidos directamente
│   ├── uploads/          # Imágenes y documentos subidos desde el panel
│   │   └── cvs/          # Almacenamiento de currículums de candidatos
│   └── descargas/        # PDFs y recursos descargables públicos
├── middleware.ts         # Middleware perimetral de seguridad y RBAC
├── next.config.mjs       # Configuración del servidor y cabeceras de seguridad
├── tailwind.config.ts    # Configuración de diseño y paleta de colores
└── tsconfig.json         # Configuración de compilación de TypeScript
```

---

## Convenciones de Desarrollo

1. **Tipado Obligatorio:** Todo nuevo componente o endpoint debe definir y respetar las interfaces descritas en `lib/types.ts`.
2. **Server vs. Client Components:**
   - Por defecto, las páginas en `app/` son **Server Components** para optimizar el rendimiento y el SEO.
   - Las directivas `"use client"` se reservan estrictamente para componentes interactivos (formularios, modales, editores de texto enriquecido, tabs).
3. **Manejo de Rutas en APIs:**
   - Toda respuesta de API devuelve un objeto JSON estructurado: `{ success: boolean, data?: any, error?: string }`.
   - Las peticiones erróneas retornan códigos HTTP estándar (`400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `429 Too Many Requests`).
