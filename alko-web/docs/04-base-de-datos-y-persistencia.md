# 04. Base de Datos y Persistencia

## 1. Conexión a Base de Datos (MySQL)

La comunicación con la base de datos se gestiona a través del archivo `lib/db/mysql.ts`, empleando un pool de conexiones optimizado mediante la librería `mysql2/promise`.

```typescript
pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 5000,
});
```

---

## 2. Esquema de Tablas en Base de Datos

Las tablas se crean automáticamente o se inicializan bajo demanda al ejecutar las operaciones del panel:

### A. Tabla `alko_users`
Almacena los usuarios administrativos y sus perfiles de acceso.
- `id` (VARCHAR / INT, PK): Identificador único.
- `username` (VARCHAR(100), UNIQUE): Nombre de usuario para el inicio de sesión.
- `password_hash` (VARCHAR(255)): Hash de contraseña generado con `bcryptjs`.
- `name` (VARCHAR(150)): Nombre completo para mostrar en la interfaz.
- `email` (VARCHAR(200)): Correo de contacto del usuario.
- `role` (ENUM / VARCHAR(50)): Rol asignado (`admin`, `editor`, `crm`, `personalizado`).
- `permissions` (TEXT / JSON): Lista de permisos asignados en formato JSON.
- `created_at` (TIMESTAMP): Fecha de creación del registro.

### B. Tabla `alko_leads`
Gestiona los contactos comerciales recibidos desde los formularios de la web (contacto general y solicitud de presupuestos interactivos).
- `id` (VARCHAR(64), PK): Código del lead (ej. `lead_1730000000000`).
- `tipo` (VARCHAR(30)): Tipo de contacto (`contacto` o `presupuesto`).
- `nombre` (VARCHAR(150)): Nombre del cliente potencial.
- `email` (VARCHAR(200)): Correo electrónico del cliente.
- `telefono` (VARCHAR(50)): Teléfono o WhatsApp de contacto.
- `estado` (VARCHAR(30)): Estado en el pipeline CRM (`nuevo`, `contactado`, `presupuestado`, `ganado`, `perdido`).
- `notas` (TEXT): Notas internas de seguimiento registradas por el equipo comercial.
- `datos` (LONGTEXT / JSON): Objeto JSON con el desglose detallado (superficie, partidas estimadas, acabados, mensaje libre).
- `created_at` (TIMESTAMP): Fecha y hora de recepción del formulario.

### C. Tabla `alko_candidaturas`
Almacena las solicitudes de empleo enviadas a través de la sección "Trabaja con nosotros".
- `id` (VARCHAR(64), PK): Identificador de la candidatura.
- `nombre`, `apellidos`, `email`, `telefono`: Datos del postulante.
- `posicion_id` (VARCHAR(100)): ID de la vacante a la que aplica.
- `posicion_nombre` (VARCHAR(150)): Título descriptivo del puesto.
- `cv_url` (VARCHAR(255)): Ruta del archivo PDF subido en `public/uploads/cvs/`.
- `estado` (VARCHAR(30)): Estado del proceso (`pendiente`, `revisado`, `entrevista`, `descartado`, `contratado`).
- `created_at` (TIMESTAMP): Fecha de postulación.

### D. Tabla `alko_site_content`
Almacena en formato JSON estructurado el contenido editable de las páginas informativas del sitio web:
- `page_key` (VARCHAR(50), PK): Clave identificadora de la página (`home`, `nosotros`, `contacto`, `oficinas`, `servicios`, `equipo`, `empleo`, `articulos`, `guias`).
- `content` (LONGTEXT): Estructura serializada de la página que coincide con las interfaces tipadas de `lib/types.ts`.
- `updated_at` (TIMESTAMP): Última fecha de edición.

---

## 3. Tolerancia a Fallos y Modo de Respaldo (`site_content.json`)

Para garantizar que el sitio web no interrumpa su funcionamiento ante tareas de mantenimiento o cortes temporales de la base de datos remota, el sistema cuenta con un gestor de persistencia en disco:

- **Archivo de respaldo:** `data/site_content.json`.
- **Estrategia de guardado:** Cada vez que un usuario administrativo realiza una modificación desde el panel, el sistema intenta actualizar la base de datos MySQL y, en paralelo, sincroniza el archivo local de respaldo.
- **Estrategia de lectura:** Si la conexión a la base de datos arroja un timeout o error de conexión, se lee el archivo local de forma transparente para el visitante, logrando un tiempo de actividad (uptime) del 100%.
