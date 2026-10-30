# ALKO Web — Plataforma Digital

Sitio web corporativo y panel de gestión de contenidos de **ALKO Construcción y Reformas Integrales**, desarrollado con **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, y persistencia híbrida con **MySQL** y respaldo local.

---

## 🚀 Inicio Rápido

### 1. Requisitos
- Node.js 18.18+ (o Node 20 LTS)
- npm / pnpm / yarn
- Base de datos MySQL

### 2. Instalación y configuración
```bash
# Clonar e instalar dependencias
cd alko-web
npm install

# Configurar variables de entorno
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales de base de datos y un secreto `JWT_SECRET` seguro.

### 3. Ejecución
```bash
# Servidor de desarrollo
npm run dev

# Compilación de producción
npm run build

# Iniciar servidor de producción
npm run start
```

---

## 📖 Documentación Técnica Completa

La documentación detallada del proyecto se encuentra organizada en el directorio [`/docs`](docs/README.md):

1. [Arquitectura General y Stack](docs/01-arquitectura-y-stack.md)
2. [Estructura de Directorios y Organización de Código](docs/02-estructura-directorios.md)
3. [Seguridad, Autenticación y Control de Acceso (RBAC)](docs/03-seguridad-autenticacion-rbac.md)
4. [Base de Datos y Persistencia Híbrida](docs/04-base-de-datos-y-persistencia.md)
5. [Panel de Administración y Módulos CMS](docs/05-panel-administracion.md)
6. [Guía de Despliegue y Variables de Entorno](docs/06-despliegue-y-entorno.md)
7. [Catálogo Completo de Endpoints de la API](docs/07-endpoints-api.md)
8. [Modelos de Dominio y Tipos TypeScript](docs/08-modelos-de-datos-typescript.md)

---

## 🔒 Seguridad y Acceso
El panel de administración en `/admin` está protegido mediante sesiones HMAC y control de acceso por roles (RBAC). Las rutas críticas cuentan con limitación de tasa por IP (*Rate Limiting*) y cabeceras HTTP de protección OWASP configuradas.
