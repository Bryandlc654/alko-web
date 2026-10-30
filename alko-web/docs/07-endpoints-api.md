# 07. Catálogo Completo de Endpoints de la API

La aplicación expone una serie de rutas HTTP internas y públicas bajo `/api/*`. Todas las respuestas JSON siguen el formato estándar:

```json
{
  "success": true,
  "data": { ... },
  "error": "Mensaje de error (opcional)"
}
```

---

## 1. Endpoints Públicos

### Contacto y Presupuesto
* **`POST /api/contacto`**
  - **Función:** Recibe formularios de contacto general y cálculos de presupuesto interactivo.
  - **Payload:**
    ```json
    {
      "tipo": "contacto" | "presupuesto",
      "nombre": "Juan Pérez",
      "email": "juan@example.com",
      "telefono": "+34 600 000 000",
      "mensaje": "Mensaje opcional",
      "datos": { ... } // Desglose si es presupuesto
    }
    ```
  - **Acciones:**
    1. Registra el lead en `alko_leads` (y en `site_content.json`).
    2. Si SMTP está configurado en Ajustes, despacha notificación automática por email al destinatario configurado.
  - **Respuesta:** `{ "success": true, "id": "lead_..." }`

### Empleo y CVs
* **`POST /api/empleo/postulacion`**
  - **Función:** Envío de candidaturas y subida de currículum vitae.
  - **Seguridad:** Validación de origen (`isSameOrigin`) y Rate Limit por IP (máx. 5 envíos / 15 min).
  - **Formato:** `multipart/form-data` con campos de texto y archivo en el campo `cv` (PDF/DOCX, máx. 10MB).
  - **Respuesta:** `{ "success": true, "id": "cand_..." }`

---

## 2. Endpoints Administrativos y de Autenticación (`/api/admin/*`)

### Autenticación
* **`POST /api/admin/auth/login`**
  - **Seguridad:** Rate Limiting por IP (10 intentos / 15 min).
  - **Body:** `{ "username": "admin", "password": "..." }`
  - **Respuesta:** Setea cookie HTTP-only `alko_admin_token` con el JWT firmado HMAC.
* **`POST /api/admin/auth/logout`**
  - **Función:** Invalida y elimina la cookie de sesión.

---

### Módulos de Contenido y Catálogo (Exigen Sesión y Permiso RBAC)

| Endpoint | Métodos | Permiso Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `/api/admin/content/home` | GET, POST | `editor` | Lee y actualiza el contenido de la Home (Hero slides, citas, cifras). |
| `/api/admin/content/nosotros` | GET, POST | `editor` | Contenido de página Nosotros y Método ALKO. |
| `/api/admin/content/contacto` | GET, POST | `editor` | Datos de contacto, teléfonos, emails y mapa. |
| `/api/admin/content/oficinas` | GET, POST | `editor` | Listado y horarios de sedes físicas. |
| `/api/admin/projects` | GET, POST, PUT, DELETE | `proyectos` | CRUD de obras y proyectos. |
| `/api/admin/projects/featured` | GET, POST | `proyectos` | Selección de proyectos visibles en la Home. |
| `/api/admin/servicios` | GET, POST, PUT, DELETE | `servicios` | CRUD de especialidades y servicios. |
| `/api/admin/articulos` | GET, POST, PUT, DELETE | `articulos` | CRUD de entradas de blog con contenido HTML enriquecido. |
| `/api/admin/articulos/categorias` | GET, POST, DELETE | `articulos` | Gestión de categorías para artículos. |
| `/api/admin/guias` | GET, POST, PUT, DELETE | `guias` | CRUD de guías técnicas descargables. |
| `/api/admin/empleo/vacantes` | GET, POST, PUT, DELETE | `empleo` | Publicación de vacantes laborales. |
| `/api/admin/empleo/postulaciones`| GET, PATCH, DELETE | `empleo` | Bandeja de CVs recibidos y cambio de estado. |
| `/api/admin/equipo` | GET, POST, PUT, DELETE | `equipo` | Miembros del equipo directivo y técnico. |
| `/api/admin/equipo/reorder` | POST | `equipo` | Actualiza la posición de los miembros. |
| `/api/admin/leads` | GET, PATCH, DELETE | `leads` | CRM de leads y presupuestos recibidos. |
| `/api/admin/ajustes` | GET, POST | `ajustes` | Ajustes globales de la web y parámetros SMTP. |
| `/api/admin/ajustes/test-smtp` | POST | `ajustes` | Envío de correo de prueba para verificar credenciales SMTP. |
| `/api/admin/usuarios` | GET, POST, PUT, DELETE | `usuarios` | Gestión de cuentas de usuario y permisos RBAC. |
| `/api/admin/upload` | POST | Sesión activa | Subida de imágenes (`.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`). |
