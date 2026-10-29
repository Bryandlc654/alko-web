import mysql, { Pool } from "mysql2/promise";
import fs from "fs";
import path from "path";
import { DEFAULT_HOME_CONTENT, DEFAULT_PROJECTS_PAGE_CONTENT, DEFAULT_NOSOTROS_PAGE_CONTENT, DEFAULT_CONTACTO_PAGE_CONTENT, DEFAULT_SERVICIOS_PAGE_CONTENT, DEFAULT_EQUIPO_PAGE_CONTENT, DEFAULT_EMPLEO_PAGE_CONTENT, DEFAULT_OFICINAS_PAGE_CONTENT, DEFAULT_ARTICULOS_PAGE_CONTENT, DEFAULT_GUIAS_PAGE_CONTENT, DEFAULT_PROJECTS, DEFAULT_SECTORS, DEFAULT_ARTICLES, DEFAULT_GUIDES } from "../content";
import type { Project, Sector, Article, Guide, HomeContent, ProjectsPageContent, NosotrosPageContent, ContactoPageContent, ServiciosPageContent, EquipoPageContent, EmpleoPageContent, OficinasPageContent, ArticulosPageContent, GuiasPageContent, Slide } from "../types";

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
  equipoPage?: EquipoPageContent;
  empleoPage?: EmpleoPageContent;
  oficinasPage?: OficinasPageContent;
  articulosPage?: ArticulosPageContent;
  guiasPage?: GuiasPageContent;
  slides: Slide[];
  featuredProjectIds?: string[];
  customProjects?: Project[];
  customSectors?: Sector[];
  customArticles?: Article[];
  customCategories?: string[];
  customGuides?: Guide[];
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
    equipoPage: DEFAULT_EQUIPO_PAGE_CONTENT,
    empleoPage: DEFAULT_EMPLEO_PAGE_CONTENT,
    oficinasPage: DEFAULT_OFICINAS_PAGE_CONTENT,
    articulosPage: DEFAULT_ARTICULOS_PAGE_CONTENT,
    guiasPage: DEFAULT_GUIAS_PAGE_CONTENT,
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
      customSectors: data.customSectors ? data.customSectors : current.customSectors,
      nosotrosPage: data.nosotrosPage ? { ...(current.nosotrosPage || DEFAULT_NOSOTROS_PAGE_CONTENT), ...data.nosotrosPage } : current.nosotrosPage,
      contactoPage: data.contactoPage ? { ...(current.contactoPage || DEFAULT_CONTACTO_PAGE_CONTENT), ...data.contactoPage } : current.contactoPage,
      serviciosPage: data.serviciosPage ? { ...(current.serviciosPage || DEFAULT_SERVICIOS_PAGE_CONTENT), ...data.serviciosPage } : current.serviciosPage,
      equipoPage: data.equipoPage ? { ...(current.equipoPage || DEFAULT_EQUIPO_PAGE_CONTENT), ...data.equipoPage } : current.equipoPage,
      empleoPage: data.empleoPage ? { ...(current.empleoPage || DEFAULT_EMPLEO_PAGE_CONTENT), ...data.empleoPage } : current.empleoPage,
      oficinasPage: data.oficinasPage ? { ...(current.oficinasPage || DEFAULT_OFICINAS_PAGE_CONTENT), ...data.oficinasPage } : current.oficinasPage,
      articulosPage: data.articulosPage ? { ...(current.articulosPage || DEFAULT_ARTICULOS_PAGE_CONTENT), ...data.articulosPage } : current.articulosPage,
      guiasPage: data.guiasPage ? { ...(current.guiasPage || DEFAULT_GUIAS_PAGE_CONTENT), ...data.guiasPage } : current.guiasPage,
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

/**
 * Obtiene el contenido de la Página de Equipo (/equipo) desde MySQL.
 */
export async function getDbEquipoPageContent(): Promise<EquipoPageContent> {
  try {
    const db = getDbPool();
    const [rows] = await db.execute<any[]>(
      "SELECT data FROM alko_site_content WHERE id = 'equipo_page' LIMIT 1"
    );
    if (rows && rows.length > 0) {
      const data = typeof rows[0].data === "string" ? JSON.parse(rows[0].data) : rows[0].data;
      return { ...DEFAULT_EQUIPO_PAGE_CONTENT, ...data };
    }
  } catch (err: any) {
    console.warn("Aviso: Error obteniendo contenido de página equipo:", err.message);
  }

  const local = getLocalContent();
  return { ...DEFAULT_EQUIPO_PAGE_CONTENT, ...(local.equipoPage || {}) };
}

/**
 * Guarda el contenido de la Página de Equipo (/equipo) en MySQL.
 */
export async function saveDbEquipoPageContent(content: Partial<EquipoPageContent>): Promise<EquipoPageContent> {
  const current = await getDbEquipoPageContent();
  const updated: EquipoPageContent = { ...current, ...content };

  saveLocalContent({ equipoPage: updated });

  try {
    const db = getDbPool();
    await db.execute(
      `INSERT INTO alko_site_content (id, data) 
       VALUES ('equipo_page', ?) 
       ON DUPLICATE KEY UPDATE data = VALUES(data)`,
      [JSON.stringify(updated)]
    );
  } catch (err: any) {
    console.warn("Aviso: Fallo al guardar página equipo en MySQL:", err.message);
  }

  return updated;
}

/**
 * Obtiene el contenido de la Página Trabaja con Nosotros (/trabaja-con-nosotros) desde MySQL.
 */
export async function getDbEmpleoPageContent(): Promise<EmpleoPageContent> {
  try {
    const db = getDbPool();
    const [rows] = await db.execute<any[]>(
      "SELECT data FROM alko_site_content WHERE id = 'empleo_page' LIMIT 1"
    );
    if (rows && rows.length > 0) {
      const data = typeof rows[0].data === "string" ? JSON.parse(rows[0].data) : rows[0].data;
      return { ...DEFAULT_EMPLEO_PAGE_CONTENT, ...data };
    }
  } catch (err: any) {
    console.warn("Aviso: Error obteniendo contenido de página empleo:", err.message);
  }

  const local = getLocalContent();
  return { ...DEFAULT_EMPLEO_PAGE_CONTENT, ...(local.empleoPage || {}) };
}

/**
 * Guarda el contenido de la Página Trabaja con Nosotros (/trabaja-con-nosotros) en MySQL.
 */
export async function saveDbEmpleoPageContent(content: Partial<EmpleoPageContent>): Promise<EmpleoPageContent> {
  const current = await getDbEmpleoPageContent();
  const updated: EmpleoPageContent = { ...current, ...content };

  saveLocalContent({ empleoPage: updated });

  try {
    const db = getDbPool();
    await db.execute(
      `INSERT INTO alko_site_content (id, data) 
       VALUES ('empleo_page', ?) 
       ON DUPLICATE KEY UPDATE data = VALUES(data)`,
      [JSON.stringify(updated)]
    );
  } catch (err: any) {
    console.warn("Aviso: Fallo al guardar página empleo en MySQL:", err.message);
  }

  return updated;
}

/**
 * Obtiene el contenido de la Página de Oficinas (/oficinas) desde MySQL.
 */
export async function getDbOficinasPageContent(): Promise<OficinasPageContent> {
  try {
    const db = getDbPool();
    const [rows] = await db.execute<any[]>(
      "SELECT data FROM alko_site_content WHERE id = 'oficinas_page' LIMIT 1"
    );
    if (rows && rows.length > 0) {
      const data = typeof rows[0].data === "string" ? JSON.parse(rows[0].data) : rows[0].data;
      return { ...DEFAULT_OFICINAS_PAGE_CONTENT, ...data };
    }
  } catch (err: any) {
    console.warn("Aviso: Error obteniendo contenido de página oficinas:", err.message);
  }

  const local = getLocalContent();
  return { ...DEFAULT_OFICINAS_PAGE_CONTENT, ...(local.oficinasPage || {}) };
}

/**
 * Guarda el contenido de la Página de Oficinas (/oficinas) en MySQL.
 */
export async function saveDbOficinasPageContent(content: Partial<OficinasPageContent>): Promise<OficinasPageContent> {
  const current = await getDbOficinasPageContent();
  const updated: OficinasPageContent = { ...current, ...content };

  saveLocalContent({ oficinasPage: updated });

  try {
    const db = getDbPool();
    await db.execute(
      `INSERT INTO alko_site_content (id, data) 
       VALUES ('oficinas_page', ?) 
       ON DUPLICATE KEY UPDATE data = VALUES(data)`,
      [JSON.stringify(updated)]
    );
  } catch (err: any) {
    console.warn("Aviso: Fallo al guardar página oficinas en MySQL:", err.message);
  }

  return updated;
}

/**
 * Obtiene el contenido de la Página de Artículos (/conocimiento/articulos) desde MySQL.
 */
export async function getDbArticulosPageContent(): Promise<ArticulosPageContent> {
  try {
    const db = getDbPool();
    const [rows] = await db.execute<any[]>(
      "SELECT data FROM alko_site_content WHERE id = 'articulos_page' LIMIT 1"
    );
    if (rows && rows.length > 0) {
      const data = typeof rows[0].data === "string" ? JSON.parse(rows[0].data) : rows[0].data;
      return { ...DEFAULT_ARTICULOS_PAGE_CONTENT, ...data };
    }
  } catch (err: any) {
    console.warn("Aviso: Error obteniendo contenido de página artículos:", err.message);
  }

  const local = getLocalContent();
  return { ...DEFAULT_ARTICULOS_PAGE_CONTENT, ...(local.articulosPage || {}) };
}

/**
 * Guarda el contenido de la Página de Artículos (/conocimiento/articulos) en MySQL.
 */
export async function saveDbArticulosPageContent(content: Partial<ArticulosPageContent>): Promise<ArticulosPageContent> {
  const current = await getDbArticulosPageContent();
  const updated: ArticulosPageContent = { ...current, ...content };

  saveLocalContent({ articulosPage: updated });

  try {
    const db = getDbPool();
    await db.execute(
      `INSERT INTO alko_site_content (id, data) 
       VALUES ('articulos_page', ?) 
       ON DUPLICATE KEY UPDATE data = VALUES(data)`,
      [JSON.stringify(updated)]
    );
  } catch (err: any) {
    console.warn("Aviso: Fallo al guardar página artículos en MySQL:", err.message);
  }

  return updated;
}

/**
 * Obtiene el contenido de la Página de Guías (/conocimiento/guias) desde MySQL.
 */
export async function getDbGuiasPageContent(): Promise<GuiasPageContent> {
  try {
    const db = getDbPool();
    const [rows] = await db.execute<any[]>(
      "SELECT data FROM alko_site_content WHERE id = 'guias_page' LIMIT 1"
    );
    if (rows && rows.length > 0) {
      const data = typeof rows[0].data === "string" ? JSON.parse(rows[0].data) : rows[0].data;
      return { ...DEFAULT_GUIAS_PAGE_CONTENT, ...data };
    }
  } catch (err: any) {
    console.warn("Aviso: Error obteniendo contenido de página guías:", err.message);
  }

  const local = getLocalContent();
  return { ...DEFAULT_GUIAS_PAGE_CONTENT, ...(local.guiasPage || {}) };
}

/**
 * Guarda el contenido de la Página de Guías (/conocimiento/guias) en MySQL.
 */
export async function saveDbGuiasPageContent(content: Partial<GuiasPageContent>): Promise<GuiasPageContent> {
  const current = await getDbGuiasPageContent();
  const updated: GuiasPageContent = { ...current, ...content };

  saveLocalContent({ guiasPage: updated });

  try {
    const db = getDbPool();
    await db.execute(
      `INSERT INTO alko_site_content (id, data) 
       VALUES ('guias_page', ?) 
       ON DUPLICATE KEY UPDATE data = VALUES(data)`,
      [JSON.stringify(updated)]
    );
  } catch (err: any) {
    console.warn("Aviso: Fallo al guardar página guías en MySQL:", err.message);
  }

  return updated;
}

/**
 * Obtiene la lista completa de sectores/servicios desde MySQL.
 */
export async function getDbSectors(): Promise<Sector[]> {
  try {
    const db = getDbPool();
    const [rows] = await db.execute<any[]>(
      "SELECT data FROM alko_site_content WHERE id = 'sectors_list' LIMIT 1"
    );
    if (rows && rows.length > 0) {
      const data = typeof rows[0].data === "string" ? JSON.parse(rows[0].data) : rows[0].data;
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (err: any) {
    console.warn("Aviso: Error obteniendo sectores de MySQL:", err.message);
  }

  const local = getLocalContent();
  if (local.customSectors && local.customSectors.length > 0) {
    return local.customSectors;
  }

  return DEFAULT_SECTORS;
}

/**
 * Guarda o actualiza un servicio en MySQL.
 */
export async function saveDbSector(sectorData: Partial<Sector>): Promise<Sector> {
  const currentSectors = await getDbSectors();
  const slug = sectorData.slug || ("servicio-" + Date.now());
  const existingIndex = currentSectors.findIndex(s => s.id === sectorData.id || s.slug === slug);

  let updatedList = [...currentSectors];
  const baseSector = existingIndex >= 0 ? currentSectors[existingIndex] : null;

  const fullSector: Sector = {
    id: sectorData.id || baseSector?.id || ("sec-" + Date.now()),
    slug: slug,
    numero: sectorData.numero || baseSector?.numero || String(currentSectors.length + 1).padStart(2, "0"),
    title: sectorData.title || baseSector?.title || "Nuevo Servicio",
    descripcion: sectorData.descripcion || baseSector?.descripcion || "",
    imagen: sectorData.imagen || baseSector?.imagen || "/p1.jpg",
    enlace: sectorData.enlace || baseSector?.enlace || ("/servicios/" + slug),
    content: sectorData.content ?? baseSector?.content ?? "",
    landing: sectorData.landing ?? baseSector?.landing,
  };

  if (existingIndex >= 0) {
    updatedList[existingIndex] = fullSector;
  } else {
    updatedList.push(fullSector);
  }

  saveLocalContent({ customSectors: updatedList });

  try {
    const db = getDbPool();
    await db.execute(
      `INSERT INTO alko_site_content (id, data) 
       VALUES ('sectors_list', ?) 
       ON DUPLICATE KEY UPDATE data = VALUES(data)`,
      [JSON.stringify(updatedList)]
    );
  } catch (err: any) {
    console.warn("Aviso: Fallo al guardar lista de servicios en MySQL:", err.message);
  }

  return fullSector;
}

/**
 * Elimina un servicio por ID en MySQL.
 */
export async function deleteDbSector(id: string): Promise<boolean> {
  const currentSectors = await getDbSectors();
  const updatedList = currentSectors.filter(s => String(s.id) !== String(id) && s.slug !== id);

  saveLocalContent({ customSectors: updatedList });

  try {
    const db = getDbPool();
    await db.execute(
      `INSERT INTO alko_site_content (id, data) 
       VALUES ('sectors_list', ?) 
       ON DUPLICATE KEY UPDATE data = VALUES(data)`,
      [JSON.stringify(updatedList)]
    );
    return true;
  } catch (err: any) {
    console.warn("Aviso: Fallo al eliminar servicio en MySQL:", err.message);
    return false;
  }
}

/**
 * Obtiene la lista completa de artículos desde MySQL con respaldo local/defaults.
 */
export async function getDbArticles(): Promise<Article[]> {
  try {
    const db = getDbPool();
    const [rows] = await db.execute<any[]>(
      "SELECT data FROM alko_site_content WHERE id = 'articles_list' LIMIT 1"
    );
    if (rows && rows.length > 0) {
      const data = typeof rows[0].data === "string" ? JSON.parse(rows[0].data) : rows[0].data;
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (err: any) {
    console.warn("Aviso: Error obteniendo artículos de MySQL:", err.message);
  }

  const local = getLocalContent();
  if (local.customArticles && local.customArticles.length > 0) {
    return local.customArticles;
  }

  return DEFAULT_ARTICLES;
}

/**
 * Guarda o actualiza un artículo en MySQL y respaldo local.
 */
export async function saveDbArticle(articleData: Partial<Article>): Promise<Article> {
  const currentArticles = await getDbArticles();
  const slug = articleData.slug || ("articulo-" + Date.now());
  const existingIndex = currentArticles.findIndex(a => a.id === articleData.id || a.slug === slug);

  let updatedList = [...currentArticles];
  const baseArticle = existingIndex >= 0 ? currentArticles[existingIndex] : null;

  const fullArticle: Article = {
    id: articleData.id || baseArticle?.id || ("art-" + Date.now()),
    slug: slug,
    title: articleData.title || baseArticle?.title || "Nuevo Artículo Técnico",
    category: articleData.category || baseArticle?.category || "Metodología",
    excerpt: articleData.excerpt || baseArticle?.excerpt || "",
    content: articleData.content ?? baseArticle?.content ?? "",
    image: articleData.image || baseArticle?.image || "/art1.jpg",
    date: articleData.date || baseArticle?.date || new Date().toISOString().split("T")[0],
  };

  if (existingIndex >= 0) {
    updatedList[existingIndex] = fullArticle;
  } else {
    updatedList.unshift(fullArticle);
  }

  saveLocalContent({ customArticles: updatedList });

  try {
    const db = getDbPool();
    await db.execute(
      `INSERT INTO alko_site_content (id, data) 
       VALUES ('articles_list', ?) 
       ON DUPLICATE KEY UPDATE data = VALUES(data)`,
      [JSON.stringify(updatedList)]
    );
  } catch (err: any) {
    console.warn("Aviso: Fallo al guardar lista de artículos en MySQL:", err.message);
  }

  return fullArticle;
}

/**
 * Elimina un artículo por ID o Slug en MySQL.
 */
export async function deleteDbArticle(id: string): Promise<boolean> {
  const currentArticles = await getDbArticles();
  const updatedList = currentArticles.filter(a => String(a.id) !== String(id) && a.slug !== id);

  saveLocalContent({ customArticles: updatedList });

  try {
    const db = getDbPool();
    await db.execute(
      `INSERT INTO alko_site_content (id, data) 
       VALUES ('articles_list', ?) 
       ON DUPLICATE KEY UPDATE data = VALUES(data)`,
      [JSON.stringify(updatedList)]
    );
    return true;
  } catch (err: any) {
    console.warn("Aviso: Fallo al eliminar artículo en MySQL:", err.message);
    return false;
  }
}

const DEFAULT_ARTICLE_CATEGORIES = [
  "Metodología",
  "Instalaciones",
  "Materiales",
  "Normativa",
  "Estructuras",
  "General",
];

/**
 * Obtiene las categorías de artículos desde MySQL con respaldo local.
 */
export async function getDbArticleCategories(): Promise<string[]> {
  try {
    const db = getDbPool();
    const [rows] = await db.execute<any[]>(
      "SELECT data FROM alko_site_content WHERE id = 'article_categories' LIMIT 1"
    );
    if (rows && rows.length > 0) {
      const data = typeof rows[0].data === "string" ? JSON.parse(rows[0].data) : rows[0].data;
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (err: any) {
    console.warn("Aviso: Error obteniendo categorías de MySQL:", err.message);
  }

  const local = getLocalContent();
  if (local.customCategories && local.customCategories.length > 0) {
    return local.customCategories;
  }

  return DEFAULT_ARTICLE_CATEGORIES;
}

/**
 * Guarda la lista de categorías en MySQL y local.
 */
export async function saveDbArticleCategories(categories: string[]): Promise<string[]> {
  const cleaned = Array.from(new Set(categories.map(c => c.trim()).filter(Boolean)));
  saveLocalContent({ customCategories: cleaned });

  try {
    const db = getDbPool();
    await db.execute(
      `INSERT INTO alko_site_content (id, data) 
       VALUES ('article_categories', ?) 
       ON DUPLICATE KEY UPDATE data = VALUES(data)`,
      [JSON.stringify(cleaned)]
    );
  } catch (err: any) {
    console.warn("Aviso: Fallo al guardar categorías en MySQL:", err.message);
  }

  return cleaned;
}

/**
 * Obtiene la lista completa de guías desde MySQL con respaldo local/defaults.
 */
export async function getDbGuides(): Promise<Guide[]> {
  try {
    const db = getDbPool();
    const [rows] = await db.execute<any[]>(
      "SELECT data FROM alko_site_content WHERE id = 'guides_list' LIMIT 1"
    );
    if (rows && rows.length > 0) {
      const data = typeof rows[0].data === "string" ? JSON.parse(rows[0].data) : rows[0].data;
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (err: any) {
    console.warn("Aviso: Error obteniendo guías de MySQL:", err.message);
  }

  const local = getLocalContent();
  if (local.customGuides && local.customGuides.length > 0) {
    return local.customGuides;
  }

  return DEFAULT_GUIDES;
}

/**
 * Guarda o actualiza una guía técnica en MySQL y respaldo local.
 */
export async function saveDbGuide(guideData: Partial<Guide>): Promise<Guide> {
  const currentGuides = await getDbGuides();
  const slug = guideData.slug || ("guia-" + Date.now());
  const existingIndex = currentGuides.findIndex(g => g.id === guideData.id || g.slug === slug);

  let updatedList = [...currentGuides];
  const baseGuide = existingIndex >= 0 ? currentGuides[existingIndex] : null;

  const fullGuide: Guide = {
    id: guideData.id || baseGuide?.id || ("gui-" + Date.now()),
    slug: slug,
    numero: guideData.numero || baseGuide?.numero || String(currentGuides.length + 1).padStart(2, "0"),
    title: guideData.title || baseGuide?.title || "Nueva Guía Técnica",
    tema: (guideData.tema || baseGuide?.tema || "PLANIFICACIÓN").toUpperCase(),
    descripcion: guideData.descripcion || baseGuide?.descripcion || "",
    lectura: guideData.lectura || baseGuide?.lectura || "8 min",
    imagen: guideData.imagen || baseGuide?.imagen || "/p2.jpg",
    content: guideData.content ?? baseGuide?.content ?? "",
  };

  if (existingIndex >= 0) {
    updatedList[existingIndex] = fullGuide;
  } else {
    updatedList.push(fullGuide);
  }

  saveLocalContent({ customGuides: updatedList });

  try {
    const db = getDbPool();
    await db.execute(
      `INSERT INTO alko_site_content (id, data) 
       VALUES ('guides_list', ?) 
       ON DUPLICATE KEY UPDATE data = VALUES(data)`,
      [JSON.stringify(updatedList)]
    );
  } catch (err: any) {
    console.warn("Aviso: Fallo al guardar lista de guías en MySQL:", err.message);
  }

  return fullGuide;
}

/**
 * Elimina una guía técnica por ID o Slug en MySQL.
 */
export async function deleteDbGuide(id: string): Promise<boolean> {
  const currentGuides = await getDbGuides();
  const updatedList = currentGuides.filter(g => String(g.id) !== String(id) && g.slug !== id);

  saveLocalContent({ customGuides: updatedList });

  try {
    const db = getDbPool();
    await db.execute(
      `INSERT INTO alko_site_content (id, data) 
       VALUES ('guides_list', ?) 
       ON DUPLICATE KEY UPDATE data = VALUES(data)`,
      [JSON.stringify(updatedList)]
    );
    return true;
  } catch (err: any) {
    console.warn("Aviso: Fallo al eliminar guía en MySQL:", err.message);
    return false;
  }
}
