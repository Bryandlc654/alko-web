# 05. Panel de Administración y Módulos CMS

El panel de administración se ubica bajo la ruta `/admin` y está compuesto por interfaces especializadas por módulo.

---

## 1. Módulos del Panel Administrativo

### A. Editor de Páginas (`/admin/editor`)
Permite editar en tiempo real los textos, subtítulos, banners, llamadas a la acción (CTAs) y metadatos de las páginas estáticas del sitio web:
- **Página de Inicio (Home):** Carrusel de proyectos destacados, cifras clave, texto de presentación y citas.
- **Nosotros:** Filosofía, manifiesto, etapas del método ALKO y garantías.
- **Contacto:** Datos de sede, números de teléfono, correos y configuración de formularios.
- **Oficinas:** Horarios, direcciones e información de sedes físicas.

### B. Proyectos (`/admin/proyectos`)
Gestor del portafolio de obras residenciales y comerciales:
- Creador y editor con generación automática de *slug*.
- Subida y selección de fotografía de portada, imágenes "Antes / Después" para comparación interactiva y galería de alta resolución.
- Especificación de fichas técnicas (superficie, plazo de ejecución, reto constructivo, solución técnica, materiales y cronograma).
- Selector de proyectos destacados para la página de inicio (`/admin/projects/featured`).

### C. Servicios (`/admin/servicios`)
Administración de las tipologías de servicio ofrecidas (Reformas Integrales, Arquitectura y Construcción, Espacios Corporativos, etc.):
- Configuración de alcances, beneficios, preguntas frecuentes (FAQ) y galerías asociadas.

### D. Artículos y Blog (`/admin/articulos`)
Módulo de divulgación técnica y artículos de actualidad:
- **Editor Visual Enriquecido (Rich Text):** Formato wysiwyg para redactar párrafos, títulos, listas con viñetas, enlaces, citas y bloques de código sin necesidad de manipular etiquetas HTML.
- **Gestión de Categorías:** Asignación y creación dinámica de categorías de contenido.
- **Metadatos:** Tiempo estimado de lectura, autor, fecha y fotografía principal optimizada.

### E. Guías Descargables (`/admin/guias`)
Gestor de recursos técnicos y documentos descargables (Checklists de reforma, fichas de calidades, plantillas comparativas de presupuestos):
- Vinculación con archivos PDF locales o remotos.
- Registro de descargas y contenidos asociados.

### F. Empleo y Vacantes (`/admin/empleo`)
- Publicación de ofertas de trabajo con requisitos, beneficios y modalidad.
- Visualización de candidaturas recibidas con descarga directa de currículums en formato PDF.
- Marcado de estados de postulación (`pendiente`, `revisado`, `entrevista`, `descartado`, `contratado`).

### G. Equipo (`/admin/equipo`)
- Catálogo de profesionales y cargos dentro de la firma constructora.
- Soporte para reordenamiento interactivo mediante arrastre (*drag-and-drop*).

### H. CRM de Leads y Presupuestos (`/admin/leads`)
Bandeja centralizada de captación comercial:
- Registro automático de cada formulario enviado por usuarios en la web.
- Desglose de presupuestos calculados mediante la herramienta interactiva de estimación.
- Cambio de estado en el embudo comercial (`nuevo`, `contactado`, `presupuestado`, `ganado`, `perdido`).
- Campo para añadir notas internas de seguimiento entre el equipo.

### I. Ajustes y Configuración SMTP (`/admin/ajustes`)
- Configuración de la identidad del sitio y canales de soporte.
- **Parámetros SMTP para notificaciones por correo:**
  - Servidor Host (ej. `smtp.hostinger.com` o `smtp.gmail.com`).
  - Puerto (465 para SSL o 587 para TLS).
  - Usuario y Contraseña de autenticación.
  - Dirección remitente y correo de destino para alertas de nuevos contactos.
  - Botón de prueba de conexión SMTP en un clic (`/api/admin/ajustes/test-smtp`).

### J. Usuarios y Roles (`/admin/usuarios`)
- Creación de nuevas cuentas de acceso.
- Asignación de contraseñas seguras con encriptación `bcryptjs`.
- Configuración de perfiles y permisos por módulo con control RBAC.
