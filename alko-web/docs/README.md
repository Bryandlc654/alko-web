# Documentación Técnica del Proyecto — ALKO Web

Bienvenido a la documentación técnica oficial de **ALKO Web**, la plataforma digital de **ALKO Construcción y Reformas Integrales**.

Este directorio contiene las especificaciones arquitectónicas, operativas y de desarrollo del proyecto. Se mantendrá actualizado de forma continua a medida que evolucione el sistema.

---

## 📚 Índice de la Documentación

1. **[01. Arquitectura General y Stack](01-arquitectura-y-stack.md)**
   - Resumen del stack tecnológico (Next.js 15, React 19, TypeScript, Tailwind CSS, MySQL).
   - Diagrama de arquitectura física y lógica.
   - Flujo de datos y resiliencia entre MySQL y respaldo local JSON.

2. **[02. Estructura de Directorios y Organización de Código](02-estructura-directorios.md)**
   - Convenciones de carpetas (`app/`, `components/`, `lib/`, `data/`, `public/`).
   - Jerarquía de componentes UI y separación por dominios.

3. **[03. Seguridad, Autenticación y RBAC](03-seguridad-autenticacion-rbac.md)**
   - Sesiones seguras mediante tokens JWT firmados con HMAC.
   - Modelo de permisos por roles (RBAC) y matriz de accesos.
   - Protección de rutas perimetral (`middleware.ts`) y a nivel de API.
   - Rate limiting, sanitización de uploads y cabeceras HTTP de seguridad.

4. **[04. Base de Datos y Persistencia](04-base-de-datos-y-persistencia.md)**
   - Tablas MySQL y esquemas de datos (`alko_users`, `alko_leads`, `alko_candidaturas`, etc.).
   - Capa de acceso a datos (`lib/db/mysql.ts`).
   - Mecanismo de persistencia local en `data/site_content.json` para tolerancia a fallos.

5. **[05. Panel de Administración y Módulos CMS](05-panel-administracion.md)**
   - Editor visual de páginas principales (Home, Nosotros, Contacto).
   - Gestor de Proyectos, Servicios, Empleo, Equipo y Guías.
   - Editor de texto enriquecido (Rich Text) para Artículos de Blog.
   - Gestión de Usuarios y Roles.
   - Configuración global y soporte de notificaciones SMTP.

6. **[06. Guía de Despliegue y Variables de Entorno](06-despliegue-y-entorno.md)**
   - Requisitos de ejecución y variables en `.env.local`.
   - Comandos de desarrollo, compilación y puesta en producción.
   - Buenas prácticas de mantenimiento continuo.

7. **[07. Catálogo Completo de Endpoints de la API](07-endpoints-api.md)**
   - Especificación detallada de endpoints públicos y administrativos (`/api/*`).
   - Métodos HTTP, payloads de entrada, respuestas JSON y permisos RBAC requeridos.

8. **[08. Modelos de Dominio y Tipos TypeScript](08-modelos-de-datos-typescript.md)**
   - Interfaces globales de `lib/types.ts`: `Project`, `Article`, `Lead`, `AdminUser`, `SiteSettings`.
   - Estructuras de datos garantizadas entre backend y frontend.

---

## 📌 Historial de Actualizaciones

| Fecha | Versión | Cambios Principales |
| :--- | :--- | :--- |
| **Octubre 2026** | `v1.2.0` | Auditoría y remediación de seguridad (RBAC granular, Rate Limiting, restricción SVG, cabeceras HTTP). |
| **Octubre 2026** | `v1.1.0` | Implementación de RBAC multiusuario, editor de texto visual (TipTap/Tiptap-like) para blog, y módulo CRM para leads/presupuestos con notificaciones SMTP. |
| **Octubre 2026** | `v1.0.0` | Lanzamiento base con catálogo de proyectos, servicios, empleo, equipo y persistencia híbrida. |
