import mysql, { Pool } from "mysql2/promise";
import fs from "fs";
import path from "path";
import { DEFAULT_HOME_CONTENT, DEFAULT_PROJECTS_PAGE_CONTENT, DEFAULT_NOSOTROS_PAGE_CONTENT, DEFAULT_CONTACTO_PAGE_CONTENT, DEFAULT_SERVICIOS_PAGE_CONTENT, DEFAULT_PROJECTS } from "../content";
import type { Project, HomeContent, ProjectsPageContent, NosotrosPageContent, ContactoPageContent, ServiciosPageContent, Slide } from "../types";

let pool: Pool | null = null;

export function getDbPool(): Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || "193.203.175.226",
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER || "u560058480_adminalko",
      password: process.env.DB_PASSWORD || "^6A+7Gu3",
      database: process.env.DB_NAME || "u560058480_alkoeditor",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 5000,
    });
  }
  return pool;
}

// Persistencia local de respaldo
const LOCAL_STORAGE_DIR = path.join(process.cwd(), "data");
const LOCAL_STORAGE_FILE = path.join(LOCAL_STORAGE_DIR, "site_content.json");


interface LocalStoreData {
  home: HomeContent;
  projectsPage?: ProjectsPageContent;
  nosotrosPage?: NosotrosPageContent;
  contactoPage?: ContactoPageContent;
  serviciosPage?: ServiciosPageContent;
  slides: Slide[];
  featuredProjectIds?: string[];
  customProjects?: Project[];
}

function getLocalContent(): LocalStoreData {
  try {
    if (fs.existsSync(LOCAL_STORAGE_FILE)) {
      const raw = fs.readFileSync(LOCAL_STORAGE_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn("Error leyendo almacenamiento local:", e);
  }
  return {
    home: DEFAULT_HOME_CONTENT,
    projectsPage: DEFAULT_PROJECTS_PAGE_CONTENT,
    nosotrosPage: DEFAULT_NOSOTROS_PAGE_CONTENT,
    contactoPage: DEFAULT_CONTACTO_PAGE_CONTENT,
    serviciosPage: DEFAULT_SERVICIOS_PAGE_CONTENT,
    slides: [],
    featuredProjectIds: [],
  };
}

function saveLocalContent(data: Partial<LocalStoreData>) {
  try {
    if (!fs.existsSync(LOCAL_STORAGE_DIR)) {
      fs.mkdirSync(LOCAL_STORAGE_DIR, { recursive: true });
    }
    const current = getLocalContent();
    const merged = {
      ...current,
      ...data,
      home: data.home ? { ...current.home, ...data.home } : current.home,
      projectsPage: data.projectsPage ? { ...(current.projectsPage || DEFAULT_PROJECTS_PAGE_CONTENT), ...data.projectsPage } : current.projectsPage,
      nosotrosPage: data.nosotrosPage ? { ...(current.nosotrosPage || DEFAULT_NOSOTROS_PAGE_CONTENT), ...data.nosotrosPage } : current.nosotrosPage,
      contactoPage: data.contactoPage ? { ...(current.contactoPage || DEFAULT_CONTACTO_PAGE_CONTENT), ...data.contactoPage } : current.contactoPage,
      serviciosPage: data.serviciosPage ? { ...(current.serviciosPage || DEFAULT_SERVICIOS_PAGE_CONTENT), ...data.serviciosPage } : current.serviciosPage,
    };
    fs.writeFileSync(LOCAL_STORAGE_FILE, JSON.stringify(merged, null, 2), "utf-8");
  } catch (e) {
    console.warn("Error guardando en almacenamiento local:", e);
  }
}

/**
 * Obtiene el contenido de la Página de Inicio desde MySQL (con fallback resiliente).
 */
export async function getDbHomeContent(): Promise<HomeContent> {
  try {
    const db = getDbPool();
    const [rows] = await db.execute<any[]>(
      "SELECT data FROM alko_site_content WHERE id = 'home' LIMIT 1"
    );
    if (rows && rows.length > 0) {
      const data = typeof rows[0].data === "string" ? JSON.parse(rows[0].data) : rows[0].data;
      return { ...DEFAULT_HOME_CONTENT, ...data };
    }
  } catch (err: any) {
    console.warn("Aviso: No se pudo consultar MySQL, usando almacén local:", err.message);
  }

  const local = getLocalContent();
  return { ...DEFAULT_HOME_CONTENT, ...local.home };
}

/**
 * Guarda el contenido de la Página de Inicio en MySQL y en el almacén local.
 */
export async function saveDbHomeContent(content: Partial<HomeContent>): Promise<HomeContent> {
  const current = await getDbHomeContent();
  const updated: HomeContent = { ...current, ...content };

  saveLocalContent({ home: updated });

  try {
    const db = getDbPool();
    await db.execute(
      `INSERT INTO alko_site_content (id, data) 
       VALUES ('home', ?) 
       ON DUPLICATE KEY UPDATE data = VALUES(data)`,
      [JSON.stringify(updated)]
    );
  } catch (err: any) {
    console.warn("Aviso: Fallo al guardar en MySQL remoto, guardado en local:", err.message);
  }

  return updated;
}

/**
 * Obtiene el contenido de la Página de Proyectos (/proyectos) desde MySQL.
 */
export async function getDbProjectsPageContent(): Promise<ProjectsPageContent> {
  try {
    const db = getDbPool();
    const [rows] = await db.execute<any[]>(
      "SELECT data FROM alko_site_content WHERE id = 'projects_page' LIMIT 1"
    );
    if (rows && rows.length > 0) {
      const data = typeof rows[0].data === "string" ? JSON.parse(rows[0].data) : rows[0].data;
      return { ...DEFAULT_PROJECTS_PAGE_CONTENT, ...data };
    }
  } catch (err: any) {
    console.warn("Aviso: Error obteniendo contenido de página de proyectos:", err.message);
  }

  const local = getLocalContent();
  return { ...DEFAULT_PROJECTS_PAGE_CONTENT, ...(local.projectsPage || {}) };
}

/**
 * Guarda el contenido de la Página de Proyectos (/proyectos) en MySQL.
 */
export async function saveDbProjectsPageContent(content: Partial<ProjectsPageContent>): Promise<ProjectsPageContent> {
  const current = await getDbProjectsPageContent();
  const updated: ProjectsPageContent = { ...current, ...content };

  saveLocalContent({ projectsPage: updated });

  try {
    const db = getDbPool();
    await db.execute(
      `INSERT INTO alko_site_content (id, data) 
       VALUES ('projects_page', ?) 
       ON DUPLICATE KEY UPDATE data = VALUES(data)`,
      [JSON.stringify(updated)]
    );
  } catch (err: any) {
    console.warn("Aviso: Fallo al guardar página de proyectos en MySQL:", err.message);
  }

  return updated;
}

/**
 * Obtiene los IDs de los proyectos destacados en la página de inicio (máx 3).
 */
export async function getFeaturedProjectIds(): Promise<string[]> {
  try {
    const db = getDbPool();
    const [rows] = await db.execute<any[]>(
      "SELECT data FROM alko_site_content WHERE id = 'featured_projects' LIMIT 1"
    );
    if (rows && rows.length > 0) {
      const parsed = typeof rows[0].data === "string" ? JSON.parse(rows[0].data) : rows[0].data;
      if (Array.isArray(parsed)) return parsed.map(String).slice(0, 3);
    }
  } catch (err: any) {
    console.warn("Aviso: Error obteniendo proyectos destacados de MySQL:", err.message);
  }

  const local = getLocalContent();
  return local.featuredProjectIds && local.featuredProjectIds.length > 0
    ? local.featuredProjectIds.slice(0, 3)
    : [];
}

/**
 * Guarda los IDs de los proyectos destacados para la página de inicio (máx 3).
 */
export async function saveFeaturedProjectIds(ids: string[]): Promise<string[]> {
  const limited = ids.slice(0, 3);
  saveLocalContent({ featuredProjectIds: limited });

  try {
    const db = getDbPool();
    await db.execute(
      `INSERT INTO alko_site_content (id, data) 
       VALUES ('featured_projects', ?) 
       ON DUPLICATE KEY UPDATE data = VALUES(data)`,
      [JSON.stringify(limited)]
    );
  } catch (err: any) {
    console.warn("Aviso: Fallo al guardar destacados en MySQL:", err.message);
  }

  return limited;
}

/**
 * Obtiene el contenido de la Página Nosotros (/nosotros) desde MySQL.
 */
export async function getDbNosotrosPageContent(): Promise<NosotrosPageContent> {
  try {
    const db = getDbPool();
    const [rows] = await db.execute<any[]>(
      "SELECT data FROM alko_site_content WHERE id = 'nosotros_page' LIMIT 1"
    );
    if (rows && rows.length > 0) {
      const data = typeof rows[0].data === "string" ? JSON.parse(rows[0].data) : rows[0].data;
      return { ...DEFAULT_NOSOTROS_PAGE_CONTENT, ...data };
    }
  } catch (err: any) {
    console.warn("Aviso: Error obteniendo contenido de página nosotros:", err.message);
  }

  const local = getLocalContent();
  return { ...DEFAULT_NOSOTROS_PAGE_CONTENT, ...(local.nosotrosPage || {}) };
}

/**
 * Guarda el contenido de la Página Nosotros (/nosotros) en MySQL.
 */
export async function saveDbNosotrosPageContent(content: Partial<NosotrosPageContent>): Promise<NosotrosPageContent> {
  const current = await getDbNosotrosPageContent();
  const updated: NosotrosPageContent = { ...current, ...content };

  saveLocalContent({ nosotrosPage: updated });

  try {
    const db = getDbPool();
    await db.execute(
      `INSERT INTO alko_site_content (id, data) 
       VALUES ('nosotros_page', ?) 
       ON DUPLICATE KEY UPDATE data = VALUES(data)`,
      [JSON.stringify(updated)]
    );
  } catch (err: any) {
    console.warn("Aviso: Fallo al guardar página nosotros en MySQL:", err.message);
  }

  return updated;
}

/**
 * Obtiene la lista completa de proyectos gestionados por base de datos.
 */
/**
 * Obtiene el contenido de la Página de Contacto (/contacto) desde MySQL.
 */
export async function getDbContactoPageContent(): Promise<ContactoPageContent> {
  try {
    const db = getDbPool();
    const [rows] = await db.execute<any[]>(
      "SELECT data FROM alko_site_content WHERE id = 'contacto_page' LIMIT 1"
    );
    if (rows && rows.length > 0) {
      const data = typeof rows[0].data === "string" ? JSON.parse(rows[0].data) : rows[0].data;
      return { ...DEFAULT_CONTACTO_PAGE_CONTENT, ...data };
    }
  } catch (err: any) {
    console.warn("Aviso: Error obteniendo contenido de página contacto:", err.message);
  }

  const local = getLocalContent();
  return { ...DEFAULT_CONTACTO_PAGE_CONTENT, ...(local.contactoPage || {}) };
}

/**
 * Guarda el contenido de la Página de Contacto (/contacto) en MySQL.
 */
export async function saveDbContactoPageContent(content: Partial<ContactoPageContent>): Promise<ContactoPageContent> {
  const current = await getDbContactoPageContent();
  const updated: ContactoPageContent = { ...current, ...content };

  saveLocalContent({ contactoPage: updated });

  try {
    const db = getDbPool();
    await db.execute(
      `INSERT INTO alko_site_content (id, data) 
       VALUES ('contacto_page', ?) 
       ON DUPLICATE KEY UPDATE data = VALUES(data)`,
      [JSON.stringify(updated)]
    );
  } catch (err: any) {
    console.warn("Aviso: Fallo al guardar página contacto en MySQL:", err.message);
  }

  return updated;
}

export async function getDbProjects(): Promise<Project[]> {
  try {
    const db = getDbPool();
    const [rows] = await db.execute<any[]>(
      "SELECT data FROM alko_site_content WHERE id = 'projects_list' LIMIT 1"
    );
    if (rows && rows.length > 0) {
      const data = typeof rows[0].data === "string" ? JSON.parse(rows[0].data) : rows[0].data;
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (err: any) {
    console.warn("Aviso: Error obteniendo proyectos de MySQL:", err.message);
  }

  const local = getLocalContent();
  if (local.customProjects && local.customProjects.length > 0) {
    return local.customProjects;
  }

  return DEFAULT_PROJECTS;
}

/**
 * Guarda o actualiza un proyecto en MySQL.
 */
export async function saveDbProject(projectData: Partial<Project> & { id?: string; title: string }): Promise<Project> {
  const currentProjects = await getDbProjects();
  let updatedList = [...currentProjects];

  const projectId = projectData.id && projectData.id.trim() !== "" ? projectData.id : "project-" + Date.now();
  const slug = projectData.slug || projectData.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const existingIndex = updatedList.findIndex(p => String(p.id) === String(projectId) || p.slug === slug);

  const baseProject = existingIndex >= 0 ? updatedList[existingIndex] : null;

  const fullProject: Project = {
    id: projectId,
    slug: slug,
    title: projectData.title,
    indice: projectData.indice || baseProject?.indice || String(existingIndex >= 0 ? existingIndex + 1 : updatedList.length + 1).padStart(2, "0"),
    anio: projectData.anio || baseProject?.anio || new Date().getFullYear().toString(),
    ubicacion: projectData.ubicacion || baseProject?.ubicacion || "Madrid",
    tipologia: projectData.tipologia || baseProject?.tipologia || "Residencial",
    cliente: projectData.cliente ?? baseProject?.cliente ?? "",
    servicio: projectData.servicio || baseProject?.servicio || "reformas-integrales",
    superficie: projectData.superficie ?? baseProject?.superficie ?? "",
    plazo: projectData.plazo ?? baseProject?.plazo ?? "",
    imagen: projectData.imagen || baseProject?.imagen || "/start-research-1.jpg",
    fotoAntes: projectData.fotoAntes || baseProject?.fotoAntes || "/start-research-1.jpg",
    fotoDespues: projectData.fotoDespues || baseProject?.fotoDespues || projectData.imagen || "/start-research-2.jpg",
    galeria: Array.isArray(projectData.galeria) ? projectData.galeria : (baseProject?.galeria || []),
    enlace: projectData.enlace || baseProject?.enlace || ("/proyectos/" + slug),
    content: projectData.content ?? baseProject?.content ?? "",
    reto: projectData.reto ?? baseProject?.reto ?? "",
    solucion: projectData.solucion ?? baseProject?.solucion ?? "",
    alcance: Array.isArray(projectData.alcance) ? projectData.alcance : (baseProject?.alcance || []),
    cifras: Array.isArray(projectData.cifras) ? projectData.cifras : (baseProject?.cifras || []),
    cronograma: Array.isArray(projectData.cronograma) ? projectData.cronograma : (baseProject?.cronograma || []),
    materiales: Array.isArray(projectData.materiales) ? projectData.materiales : (baseProject?.materiales || []),
    resultado: projectData.resultado ?? baseProject?.resultado ?? "",
  };

  if (existingIndex >= 0) {
    updatedList[existingIndex] = fullProject;
  } else {
    updatedList.push(fullProject);
  }

  saveLocalContent({ customProjects: updatedList });

  try {
    const db = getDbPool();
    await db.execute(
      `INSERT INTO alko_site_content (id, data) 
       VALUES ('projects_list', ?) 
       ON DUPLICATE KEY UPDATE data = VALUES(data)`,
      [JSON.stringify(updatedList)]
    );
  } catch (err: any) {
    console.warn("Aviso: Fallo al guardar lista de proyectos en MySQL:", err.message);
  }

  return fullProject;
}

/**
 * Elimina un proyecto por ID en MySQL.
 */
export async function deleteDbProject(id: string): Promise<boolean> {
  const currentProjects = await getDbProjects();
  const updatedList = currentProjects.filter(p => String(p.id) !== String(id) && p.slug !== id);

  saveLocalContent({ customProjects: updatedList });

  try {
    const db = getDbPool();
    await db.execute(
      `INSERT INTO alko_site_content (id, data) 
       VALUES ('projects_list', ?) 
       ON DUPLICATE KEY UPDATE data = VALUES(data)`,
      [JSON.stringify(updatedList)]
    );
    return true;
  } catch (err: any) {
    console.warn("Aviso: Fallo al eliminar proyecto en MySQL:", err.message);
    return false;
  }
}

/**
 * Obtiene el contenido de la Página de Servicios (/servicios) desde MySQL.
 */
export async function getDbServiciosPageContent(): Promise<ServiciosPageContent> {
  try {
    const db = getDbPool();
    const [rows] = await db.execute<any[]>(
      "SELECT data FROM alko_site_content WHERE id = 'servicios_page' LIMIT 1"
    );
    if (rows && rows.length > 0) {
      const data = typeof rows[0].data === "string" ? JSON.parse(rows[0].data) : rows[0].data;
      return { ...DEFAULT_SERVICIOS_PAGE_CONTENT, ...data };
    }
  } catch (err: any) {
    console.warn("Aviso: Error obteniendo contenido de página servicios:", err.message);
  }

  const local = getLocalContent();
  return { ...DEFAULT_SERVICIOS_PAGE_CONTENT, ...(local.serviciosPage || {}) };
}

/**
 * Guarda el contenido de la Página de Servicios (/servicios) en MySQL.
 */
export async function saveDbServiciosPageContent(content: Partial<ServiciosPageContent>): Promise<ServiciosPageContent> {
  const current = await getDbServiciosPageContent();
  const updated: ServiciosPageContent = { ...current, ...content };

  saveLocalContent({ serviciosPage: updated });

  try {
    const db = getDbPool();
    await db.execute(
      `INSERT INTO alko_site_content (id, data) 
       VALUES ('servicios_page', ?) 
       ON DUPLICATE KEY UPDATE data = VALUES(data)`,
      [JSON.stringify(updated)]
    );
  } catch (err: any) {
    console.warn("Aviso: Fallo al guardar página servicios en MySQL:", err.message);
  }

  return updated;
}
