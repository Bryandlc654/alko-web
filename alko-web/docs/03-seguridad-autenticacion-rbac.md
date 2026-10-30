# 03. Seguridad, Autenticación y Control de Acceso (RBAC)

## 1. Modelo de Autenticación

El sistema implementa una arquitectura de autenticación **stateless (sin estado)** basada en tokens JWT firmados criptográficamente:

- **Librería Criptográfica:** `jose` (compatible con entornos Edge Runtime y Node.js).
- **Algoritmo de Firma:** `HS256` (HMAC SHA-256) utilizando el secreto configurado en `JWT_SECRET` (o fallback aleatorio controlado).
- **Almacenamiento de Sesión:** Cookie HTTP-only, `SameSite=Lax`, con flag `Secure` habilitado en entornos de producción.
- **Caducidad:** 7 días desde el momento de autenticación.

---

## 2. Control de Acceso Basado en Roles (RBAC)

El acceso a los recursos y funciones administrativas está gobernado por roles y permisos granulares por módulo.

### Matriz de Permisos por Módulo

| Módulo | Clave de Permiso | Descripción |
| :--- | :--- | :--- |
| **Editor Visual** | `editor` | Edición del contenido de páginas principales (Home, Nosotros, Contacto, Oficinas). |
| **Proyectos** | `proyectos` | Creación, modificación y categorización del portafolio de obras. |
| **Servicios** | `servicios` | Administración de la oferta de servicios y soluciones de construcción. |
| **Artículos** | `articulos` | Redacción, edición y publicación de posts en el blog. |
| **Guías** | `guias` | Gestión de guías técnicas y documentos de consulta. |
| **Empleo** | `empleo` | Publicación de vacantes y revisión de candidaturas/CVs. |
| **Equipo** | `equipo` | Gestión de miembros del equipo directivo y técnico. |
| **Leads / CRM** | `leads` | Visualización y cambio de estado de contactos y presupuestos recibidos. |
| **Ajustes** | `ajustes` | Configuración técnica de la web y parámetros de correo SMTP. |
| **Usuarios** | `usuarios` | Creación de cuentas de usuario, asignación de roles y permisos. |

### Roles Predefinidos

1. **`admin` (Super Administrador):** Tiene acceso irrestricto a todos los módulos (`*`).
2. **`editor`:** Acceso a la gestión editorial de contenidos (Editor visual, Proyectos, Servicios, Artículos, Guías, Empleo, Equipo). Sin acceso a Ajustes ni Usuarios.
3. **`crm`:** Acceso enfocado a la captación comercial (Leads / Presupuestos).
4. **`personalizado`:** Permite asignar una combinación libre de permisos según las responsabilidades del usuario.

---

## 3. Mecanismos de Defensa Implementados

### A. Doble Verificación de Acceso (Perímetro y Endpoints)
1. **Nivel Perimetral (`middleware.ts`):** Todo intento de navegación a `/admin/*` es evaluado antes de renderizar la página. Si no hay sesión, se redirige a `/admin/login`. Si el usuario no cuenta con el permiso requerido para ese submódulo, se le redirige al dashboard con notificación.
2. **Nivel Endpoint (`/api/admin/*`):** Cada handler de API invoca `getSession()` y `hasPermission(session, 'modulo')`. Si la verificación falla, se bloquea la operación con `401 Unauthorized` o `403 Forbidden`.

### B. Prevención de Ataques de Fuerza Bruta (Rate Limiting)
- Se encuentra activo un limitador de tasa deslizante en memoria (`lib/rate-limit.ts`) aplicado al endpoint de login (`/api/admin/auth/login`).
- **Límite:** Máximo 10 intentos por cada 15 minutos por dirección IP. Superado el límite, se rechaza la petición con código `429 Too Many Requests`.

### C. Seguridad en Subida de Archivos
- El endpoint `/api/admin/upload` restringe estrictamente los tipos de archivo admitidos a imágenes rasterizadas seguras: `.jpg`, `.jpeg`, `.png`, `.webp` y `.avif`.
- **Se prohíben archivos `.svg`** para mitigar riesgos de Stored XSS y vulnerabilidades de renderizado de imágenes XML.
- Los nombres de archivo son sanitizados con expresiones regulares para impedir ataques de cruce de directorios (*Directory Traversal*).

### D. Cabeceras HTTP de Seguridad (OWASP)
Configuradas en `next.config.mjs` para todas las respuestas del servidor:
```javascript
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
X-XSS-Protection: 1; mode=block
```
