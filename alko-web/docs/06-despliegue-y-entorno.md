# 06. Guía de Despliegue y Variables de Entorno

## 1. Requisitos Previos

- **Node.js:** Versión 18.18.0 o superior (recomendado Node 20 LTS o 22 LTS).
- **Gestor de Paquetes:** `npm`, `pnpm` o `yarn`.
- **Servidor de Base de Datos:** Servidor MySQL 8.0+ o MariaDB 10.5+ con permisos de lectura/escritura.

---

## 2. Variables de Entorno (`.env.local`)

Crea un archivo `.env.local` en la raíz de `alko-web` tomando como plantilla el archivo `.env.example`:

```bash
# URL canónica del sitio web
NEXT_PUBLIC_SITE_URL="https://www.alko.es"

# Secreto para firma de tokens JWT (HS256)
# Recomendado generar una clave segura aleatoria de al menos 32 caracteres
JWT_SECRET="genera_una_clave_secreta_fuerte_de_32_o_mas_caracteres"

# Conexión a Base de Datos MySQL
DB_HOST="193.203.175.226"
DB_PORT="3306"
DB_USER="u560058480_adminalko"
DB_PASSWORD="TU_CONTRASENA_SEGURA"
DB_NAME="u560058480_alkoeditor"

# Usuario administrador de inicialización (Primer arranque)
ADMIN_USER="admin"
ADMIN_PASSWORD="TU_CONTRASENA_INICIAL"

# (Opcional) Configuración SMTP por entorno si no se gestiona desde el panel
# SMTP_HOST="smtp.hostinger.com"
# SMTP_PORT="465"
# SMTP_SECURE="true"
# SMTP_USER="notificaciones@alko.es"
# SMTP_PASS="tu_clave_smtp"
# SMTP_FROM="ALKO Web <notificaciones@alko.es>"
# SMTP_TO="info@alko.es"
```

---

## 3. Comandos de Operación

### Instalación de Dependencias
```bash
npm install
```

### Entorno de Desarrollo Local
Inicia el servidor de desarrollo local con recarga rápida (*Hot Module Replacement*):
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:3000`.

### Compilación para Producción (Build)
Verifica los tipos estáticos de TypeScript, empaqueta los assets optimizados y genera las rutas prerenderizadas:
```bash
npm run build
```

### Ejecución en Servidor de Producción
Inicia el proceso del servidor Next.js optimizado:
```bash
npm run start
```

---

## 4. Opciones Recomendadas de Despliegue

1. **VPS / Servidor Dedicado (Docker o Node.js con PM2):**
   - Ideal para mantener la base de datos MySQL en la misma red y garantizar que la carpeta `public/uploads` mantenga persistencia en disco de manera natural.
   - Ejemplo de comando con PM2:
     ```bash
     pm2 start npm --name "alko-web" -- start
     ```
2. **Plataformas Cloud / Serverless (Vercel / Cloudflare / AWS):**
   - Si se despliega en entornos de funciones serverless efímeras, se recomienda configurar un bucket S3 o Cloudflare R2 para el almacenamiento de archivos subidos (`public/uploads`), asegurando que no se pierdan entre despliegues.
