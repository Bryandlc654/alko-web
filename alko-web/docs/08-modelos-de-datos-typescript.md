# 08. Modelos de Dominio y Tipos TypeScript

Los contratos de interfaz y tipos globales residen en `lib/types.ts`. Estos modelos aseguran la coherencia entre la base de datos MySQL, el respaldo local y los componentes de UI.

---

## 1. Modelo de Proyectos (`Project`)

Representa una obra ejecutada por ALKO:

```typescript
export interface Project {
  id: string;               // Identificador único (p. ej. "p-1" o "proj_1730000000")
  slug: string;             // URL amigable (p. ej. "start-research")
  title: string;            // Título de la obra
  indice: string;           // Número correlativo para maquetación (p. ej. "01")
  anio: string;             // Año de ejecución (p. ej. "2024")
  ubicacion: string;        // Localidad (p. ej. "Pozuelo de Alarcón, Madrid")
  tipologia: string;        // Tipo de edificación (p. ej. "Vivienda Unifamiliar")
  cliente: string;          // Tipo de cliente ("Cliente particular", "Corporativo")
  servicio: string;         // Slug del servicio vinculado ("viviendas", "reformas-integrales")
  superficie: string;       // Metros cuadrados (p. ej. "520 m²")
  plazo: string;            // Duración de la obra (p. ej. "14 meses")
  imagen: string;           // Portada principal
  fotoAntes?: string;       // Fotografía del estado previo (comparador interactivo)
  fotoDespues?: string;     // Fotografía del estado final (comparador interactivo)
  galeria: string[];        // Array de URLs de fotografías en alta resolución
  enlace?: string;          // Ruta interna (/proyectos/slug)
  content?: string;         // Descripción técnica detallada (HTML / texto)
  reto?: string;            // Desafío arquitectónico o constructivo
  solucion?: string;        // Solución técnica implementada por ALKO
  alcance?: string[];       // Partidas clave ejecutadas
  cifras?: ProjectCifra[];  // Métricas destacadas ({ valor: "A", etiqueta: "Calificación energética" })
  cronograma?: ProjectEtapa[]; // Hitos temporales ({ periodo: "Meses 1-4", titulo: "...", texto: "..." })
  materiales?: ProjectMaterial[]; // Ficha técnica ({ elemento: "Carpinterías", detalle: "..." })
  resultado?: string;       // Conclusión del proyecto
}
```

---

## 2. Modelo de Artículos de Blog (`Article`)

```typescript
export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;          // Resumen para tarjetas y meta description
  content: string;          // Contenido HTML generado por el editor visual
  date: string;             // Fecha legible (p. ej. "24 Octubre 2026")
  readTime: string;         // Tiempo de lectura estimado (p. ej. "5 min")
  category: string;         // Categoría temática
  image: string;            // Portada principal
  author?: {
    name: string;
    role: string;
    avatar?: string;
  };
}
```

---

## 3. Modelo de Leads y Presupuestos CRM (`Lead`)

```typescript
export type LeadEstado = "nuevo" | "contactado" | "presupuestado" | "ganado" | "perdido";

export interface Lead {
  id: string;
  tipo: "contacto" | "presupuesto";
  nombre: string;
  email: string;
  telefono: string;
  mensaje?: string;
  estado: LeadEstado;
  notas?: string;
  datos?: {
    servicio?: string;
    superficie?: number | string;
    calidad?: string;
    partidas?: string[];
    costeEstimadoMin?: number;
    costeEstimadoMax?: number;
    [key: string]: any;
  };
  created_at: string;
}
```

---

## 4. Modelo de Usuarios y RBAC (`UserSession`, `AdminUser`)

```typescript
export type Permission =
  | "editor"
  | "proyectos"
  | "servicios"
  | "articulos"
  | "guias"
  | "empleo"
  | "equipo"
  | "leads"
  | "ajustes"
  | "usuarios";

export type Role = "admin" | "editor" | "crm" | "personalizado";

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: Role;
  permissions: Permission[];
  created_at?: string;
}
```
