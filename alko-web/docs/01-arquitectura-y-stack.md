# 01. Arquitectura General y Stack Tecnológico

## 1. Stack Tecnológico

El proyecto está construido sobre el ecosistema moderno de React y Next.js con tipado estático estricto:

| Componente | Tecnología | Versión / Detalle |
| :--- | :--- | :--- |
| **Framework Web** | [Next.js](https://nextjs.org/) | `^15.1.6` (App Router) |
| **Biblioteca UI** | [React](https://react.dev/) | `^19.0.0` |
| **Lenguaje** | [TypeScript](https://www.typescriptlang.org/) | `^5.0.0` (Modo estricto) |
| **Estilos** | [Tailwind CSS](https://tailwindcss.com/) | `^3.4.1` con `@tailwindcss/typography` |
| **Base de Datos** | [MySQL](https://www.mysql.com/) | Conector `mysql2` con pooling de conexiones |
| **Autenticación** | `jose` | Criptografía HMAC-SHA256 para JWTs seguros en Edge & Node |
| **Cifrado de Claves** | `bcryptjs` | Hash de contraseñas con salt adaptativo |
| **Mailing / Notificaciones**| `nodemailer` | Conexión SMTP configurable desde el panel de control |
| **Íconos** | `lucide-react` | Conjunto consistente de iconografía vectorial |

---

## 2. Diagrama de Arquitectura del Sistema

```mermaid
flowchart TD
    subgraph Client["Navegadores & Clientes"]
        User["Visitante Público"]
        Admin["Administrador / Editor"]
    end

    subgraph Edge["Perímetro & Edge Network"]
        MW["Middleware (middleware.ts)\n• Sesión HMAC\n• Control RBAC por Módulo"]
        RateLimit["Rate Limiter (En memoria)\n• /api/admin/auth/login\n• /api/empleo/postulacion"]
    end

    subgraph App["Next.js App Router (Servidor)"]
        PublicPages["Páginas Públicas (SSR/ISR)\n• / (Home)\n• /proyectos\n• /servicios\n• /conocimiento\n• /contacto\n• /trabaja-con-nosotros"]
        AdminPages["Panel /admin/*\n• Dashboard\n• Editor de Contenidos\n• CRM Leads\n• Usuarios & Roles\n• Ajustes SMTP"]
        ApiRoutes["Route Handlers (/api/*)\n• CRUD Proyectos, Artículos, Guías\n• Subida de Archivos\n• Login/Logout"]
    end

    subgraph DataLayer["Capa de Persistencia Híbrida"]
        DBHandler["lib/db/mysql.ts"]
        MySQL[(Base de Datos MySQL)]
        LocalBackup[(data/site_content.json)]
        StaticDefaults["lib/content.ts (Fallbacks estáticos)"]
    end

    User --> PublicPages
    Admin --> MW --> AdminPages
    AdminPages --> ApiRoutes
    PublicPages --> DBHandler
    ApiRoutes --> DBHandler

    DBHandler -->|1. Intento primario| MySQL
    DBHandler -.->|2. Fallback por desconexión| LocalBackup
    LocalBackup -.->|3. Fallback inicial| StaticDefaults
```

---

## 3. Resiliencia de la Capa de Datos (Fallback Híbrido)

Uno de los pilares de diseño del proyecto es la **alta disponibilidad del contenido**:
1. **Conexión Primaria:** El sistema utiliza un pool de conexiones MySQL configurado con un límite de espera (`connectTimeout: 5000ms`).
2. **Respaldo Local JSON:** Si la base de datos MySQL no responde o no está disponible, el sistema consulta de forma transparente el archivo `data/site_content.json`.
3. **Valores por Defecto:** En caso de que no exista contenido previo en la base de datos o en el archivo local, la aplicación carga los datos base definidos en `lib/content.ts`.

Esto garantiza que el sitio web público **nunca experimente caídas de tipo HTTP 500** por interrupciones puntuales en la base de datos remota.
