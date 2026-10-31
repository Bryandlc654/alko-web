import mysql, { Pool } from "mysql2/promise";
import fs from "fs";
import path from "path";
import { DEFAULT_HOME_CONTENT, DEFAULT_PROJECTS_PAGE_CONTENT, DEFAULT_NOSOTROS_PAGE_CONTENT, DEFAULT_CONTACTO_PAGE_CONTENT, DEFAULT_SERVICIOS_PAGE_CONTENT, DEFAULT_EQUIPO_PAGE_CONTENT, DEFAULT_EMPLEO_PAGE_CONTENT, DEFAULT_OFICINAS_PAGE_CONTENT, DEFAULT_ARTICULOS_PAGE_CONTENT, DEFAULT_GUIAS_PAGE_CONTENT, DEFAULT_PROJECTS, DEFAULT_SECTORS, DEFAULT_ARTICLES, DEFAULT_GUIDES, DEFAULT_SETTINGS, DEFAULT_POSICIONES_EMPLEO, DEFAULT_EQUIPO_MEMBERS } from "../content";
import type { Project, Sector, Article, Guide, HomeContent, ProjectsPageContent, NosotrosPageContent, ContactoPageContent, ServiciosPageContent, EquipoPageContent, EmpleoPageContent, OficinasPageContent, ArticulosPageContent, GuiasPageContent, Slide, SiteSettings, Candidatura, CandidaturaEstado, PosicionEmpleo, MiembroEquipo, Lead, LeadEstado } from "../types";

let pool: Pool | null = null;

export function getDbPool(): Pool {
  if (!pool) {
    const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
    if (!DB_HOST || !DB_USER || !DB_PASSWORD || !DB_NAME) {
      throw new Error("Faltan variables de entorno de la base de datos (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME).");
    }
    pool = mysql.createPool({
      host: DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
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
  customCandidaturas?: Candidatura[];
  customLeads?: Lead[];
  customUsers?: any[];
  settings?: SiteSettings;
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
      settings: data.settings ? { ...(current.settings || DEFAULT_SETTINGS), ...data.settings } : current.settings,
      customCandidaturas: data.customCandidaturas ? data.customCandidaturas : current.customCandidaturas,
      customLeads: data.customLeads ? data.customLeads : current.customLeads,
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
    // Opcionales: una cadena vacía significa que se han eliminado.
    fotoAntes: projectData.fotoAntes ?? baseProject?.fotoAntes ?? "",
    fotoDespues: projectData.fotoDespues ?? baseProject?.fotoDespues ?? "",
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

/**
 * Obtiene los Ajustes Globales de la Empresa (teléfono, email, redes, etc.) de MySQL.
 */
/** Ajustes completos, con la configuración SMTP. Solo para el panel y el servidor de correo. */
export async function getDbSettingsFull(): Promise<SiteSettings> {
  try {
    const db = getDbPool();
    const [rows] = await db.execute<any[]>(
      "SELECT data FROM alko_site_content WHERE id = 'site_settings' LIMIT 1"
    );
    if (rows && rows.length > 0) {
      const data = typeof rows[0].data === "string" ? JSON.parse(rows[0].data) : rows[0].data;
      return { ...DEFAULT_SETTINGS, ...data };
    }
  } catch (err: any) {
    console.warn("Aviso: Error obteniendo ajustes de MySQL:", err.message);
  }

  const local = getLocalContent();
  return { ...DEFAULT_SETTINGS, ...(local.settings || {}) };
}

/** Ajustes para las páginas públicas: sin la configuración SMTP, que nunca debe llegar al navegador. */
export async function getDbSettings(): Promise<SiteSettings> {
  const { smtp: _smtp, ...publicSettings } = await getDbSettingsFull();
  return publicSettings;
}

/**
 * Guarda los Ajustes Globales de la Empresa en MySQL.
 */
export async function saveDbSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  const current = await getDbSettingsFull();
  const updated: SiteSettings = { ...current, ...settings };

  saveLocalContent({ settings: updated });

  try {
    const db = getDbPool();
    await db.execute(
      `INSERT INTO alko_site_content (id, data) 
       VALUES ('site_settings', ?) 
       ON DUPLICATE KEY UPDATE data = VALUES(data)`,
      [JSON.stringify(updated)]
    );
  } catch (err: any) {
    console.warn("Aviso: Fallo al guardar ajustes en MySQL:", err.message);
  }

  return updated;
}

/* -------------------------------------------------------------------------- */
/*                 GESTIÓN DE EMPLEO Y POSTULACIONES (CANDIDATURAS)          */
/* -------------------------------------------------------------------------- */

/**
 * Obtiene la lista de vacantes activas y configuradas de la empresa.
 */
export async function getDbVacancies(): Promise<PosicionEmpleo[]> {
  const pageContent = await getDbEmpleoPageContent();
  if (pageContent.posiciones && pageContent.posiciones.length > 0) {
    return pageContent.posiciones.map((p, idx) => ({
      ...p,
      id: p.id || `vacante-${idx + 1}`,
      activa: p.activa !== false,
    }));
  }

  return DEFAULT_POSICIONES_EMPLEO.map((p, idx) => ({
    ...p,
    id: `vacante-${idx + 1}`,
    activa: true,
  }));
}

/**
 * Guarda o actualiza una vacante de empleo.
 */
export async function saveDbVacancy(vacancy: PosicionEmpleo): Promise<PosicionEmpleo[]> {
  const currentVacancies = await getDbVacancies();
  let updatedList: PosicionEmpleo[];

  if (vacancy.id) {
    const exists = currentVacancies.some((v) => v.id === vacancy.id);
    if (exists) {
      updatedList = currentVacancies.map((v) => (v.id === vacancy.id ? { ...v, ...vacancy } : v));
    } else {
      updatedList = [{ ...vacancy }, ...currentVacancies];
    }
  } else {
    const newId = `vacante-${Date.now()}`;
    updatedList = [{ ...vacancy, id: newId, activa: vacancy.activa !== false }, ...currentVacancies];
  }

  await saveDbEmpleoPageContent({ posiciones: updatedList });
  return updatedList;
}

/**
 * Elimina una vacante de empleo por ID o por título.
 */
export async function deleteDbVacancy(idOrTitulo: string): Promise<PosicionEmpleo[]> {
  const currentVacancies = await getDbVacancies();
  const updatedList = currentVacancies.filter(
    (v) => v.id !== idOrTitulo && v.titulo.toLowerCase() !== idOrTitulo.toLowerCase()
  );

  await saveDbEmpleoPageContent({ posiciones: updatedList });
  return updatedList;
}

/**
 * Obtiene todas las postulaciones / candidaturas recibidas.
 */
export async function getDbJobApplications(): Promise<Candidatura[]> {
  try {
    const db = getDbPool();
    const [rows] = await db.execute<any[]>(
      "SELECT data FROM alko_site_content WHERE id = 'job_applications' LIMIT 1"
    );
    if (rows && rows.length > 0) {
      const data = typeof rows[0].data === "string" ? JSON.parse(rows[0].data) : rows[0].data;
      if (Array.isArray(data)) {
        return data;
      }
    }
  } catch (err: any) {
    console.warn("Aviso: Error obteniendo candidaturas de MySQL:", err.message);
  }

  const local = getLocalContent();
  return local.customCandidaturas || [];
}

/**
 * Guarda una nueva postulación / candidatura enviada por un candidato.
 */
export async function saveDbJobApplication(
  candidatura: Omit<Candidatura, "id" | "fecha"> & { id?: string; fecha?: string }
): Promise<Candidatura> {
  const current = await getDbJobApplications();
  const newCandidatura: Candidatura = {
    ...candidatura,
    id: candidatura.id || `cand_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    fecha: candidatura.fecha || new Date().toISOString(),
    estado: candidatura.estado || "nueva",
  };

  const updatedList = [newCandidatura, ...current];
  saveLocalContent({ customCandidaturas: updatedList });

  try {
    const db = getDbPool();
    await db.execute(
      `INSERT INTO alko_site_content (id, data) 
       VALUES ('job_applications', ?) 
       ON DUPLICATE KEY UPDATE data = VALUES(data)`,
      [JSON.stringify(updatedList)]
    );
  } catch (err: any) {
    console.warn("Aviso: Fallo al guardar candidatura en MySQL:", err.message);
  }

  return newCandidatura;
}

/**
 * Actualiza el estado de una candidatura (nueva, en_revision, entrevista, descartada).
 */
export async function updateDbJobApplicationStatus(
  id: string,
  estado: CandidaturaEstado
): Promise<boolean> {
  const current = await getDbJobApplications();
  const index = current.findIndex((c) => c.id === id);
  if (index === -1) return false;

  current[index].estado = estado;
  saveLocalContent({ customCandidaturas: current });

  try {
    const db = getDbPool();
    await db.execute(
      `INSERT INTO alko_site_content (id, data) 
       VALUES ('job_applications', ?) 
       ON DUPLICATE KEY UPDATE data = VALUES(data)`,
      [JSON.stringify(current)]
    );
    return true;
  } catch (err: any) {
    console.warn("Aviso: Fallo al actualizar estado de candidatura en MySQL:", err.message);
    return false;
  }
}

/**
 * Elimina una candidatura por ID.
 */
export async function deleteDbJobApplication(id: string): Promise<boolean> {
  const current = await getDbJobApplications();
  const updatedList = current.filter((c) => c.id !== id);

  saveLocalContent({ customCandidaturas: updatedList });

  try {
    const db = getDbPool();
    await db.execute(
      `INSERT INTO alko_site_content (id, data) 
       VALUES ('job_applications', ?) 
       ON DUPLICATE KEY UPDATE data = VALUES(data)`,
      [JSON.stringify(updatedList)]
    );
    return true;
  } catch (err: any) {
    console.warn("Aviso: Fallo al eliminar candidatura en MySQL:", err.message);
    return false;
  }
}

/* -------------------------------------------------------------------------- */
/*                 GESTIÓN DE MIEMBROS DEL EQUIPO TÉCNICO                     */
/* -------------------------------------------------------------------------- */

/**
 * Obtiene la lista de miembros del equipo de la empresa.
 */
export async function getDbTeamMembers(): Promise<MiembroEquipo[]> {
  const pageContent = await getDbEquipoPageContent();
  if (pageContent.miembros && pageContent.miembros.length > 0) {
    return pageContent.miembros.map((m, idx) => ({
      ...m,
      id: m.id || `miembro-${idx + 1}`,
    }));
  }

  return DEFAULT_EQUIPO_MEMBERS.map((m, idx) => ({
    ...m,
    id: `miembro-${idx + 1}`,
  }));
}

/**
 * Guarda o actualiza un miembro del equipo.
 */
export async function saveDbTeamMember(member: MiembroEquipo): Promise<MiembroEquipo[]> {
  const currentMembers = await getDbTeamMembers();
  let updatedList: MiembroEquipo[];

  if (member.id) {
    const exists = currentMembers.some((m) => m.id === member.id);
    if (exists) {
      updatedList = currentMembers.map((m) => (m.id === member.id ? { ...m, ...member } : m));
    } else {
      updatedList = [{ ...member }, ...currentMembers];
    }
  } else {
    const newId = `miembro-${Date.now()}`;
    updatedList = [...currentMembers, { ...member, id: newId }];
  }

  await saveDbEquipoPageContent({ miembros: updatedList });
  return updatedList;
}

/**
 * Elimina un miembro del equipo por ID o nombre.
 */
export async function deleteDbTeamMember(idOrNombre: string): Promise<MiembroEquipo[]> {
  const currentMembers = await getDbTeamMembers();
  const updatedList = currentMembers.filter(
    (m) => m.id !== idOrNombre && m.nombre.toLowerCase() !== idOrNombre.toLowerCase()
  );

  await saveDbEquipoPageContent({ miembros: updatedList });
  return updatedList;
}

/**
 * Reordena la lista de miembros del equipo según el orden de IDs proporcionado.
 */
export async function reorderDbTeamMembers(ids: string[]): Promise<MiembroEquipo[]> {
  const currentMembers = await getDbTeamMembers();
  const memberMap = new Map(currentMembers.map((m) => [m.id, m]));
  const orderedList: MiembroEquipo[] = [];

  for (const id of ids) {
    const member = memberMap.get(id);
    if (member) {
      orderedList.push(member);
      memberMap.delete(id);
    }
  }

  // Agregar los que falten por si acaso
  for (const remaining of memberMap.values()) {
    orderedList.push(remaining);
  }

  await saveDbEquipoPageContent({ miembros: orderedList });
  return orderedList;
}

/* -------------------------------------------------------------------------- */
/*                     GESTIÓN DE CRM Y LEADS DE CONTACTO                    */
/* -------------------------------------------------------------------------- */

/**
 * Obtiene todos los leads y solicitudes de presupuesto recibidos.
 */
export async function getDbLeads(): Promise<Lead[]> {
  try {
    const db = getDbPool();
    const [rows] = await db.execute<any[]>(
      "SELECT data FROM alko_site_content WHERE id = 'crm_leads' LIMIT 1"
    );
    if (rows && rows.length > 0) {
      const data = typeof rows[0].data === "string" ? JSON.parse(rows[0].data) : rows[0].data;
      if (Array.isArray(data)) {
        return data;
      }
    }
  } catch (err: any) {
    console.warn("Aviso: Error obteniendo leads de MySQL:", err.message);
  }

  const local = getLocalContent();
  return local.customLeads || [];
}

/**
 * Guarda un nuevo lead recibido desde cualquier formulario web.
 */
export async function saveDbLead(
  lead: Omit<Lead, "id" | "creadoEn"> & { id?: string; creadoEn?: string }
): Promise<Lead> {
  const current = await getDbLeads();
  const newLead: Lead = {
    ...lead,
    id: lead.id || `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    creadoEn: lead.creadoEn || new Date().toISOString(),
    estado: lead.estado || "nuevo",
  };

  const updatedList = [newLead, ...current];
  saveLocalContent({ customLeads: updatedList });

  try {
    const db = getDbPool();
    await db.execute(
      `INSERT INTO alko_site_content (id, data) 
       VALUES ('crm_leads', ?) 
       ON DUPLICATE KEY UPDATE data = VALUES(data)`,
      [JSON.stringify(updatedList)]
    );
  } catch (err: any) {
    console.warn("Aviso: Fallo al guardar lead en MySQL:", err.message);
  }

  return newLead;
}

/**
 * Actualiza los datos o estado de un lead (notas, estado, etc.).
 */
export async function updateDbLead(id: string, updates: Partial<Lead>): Promise<boolean> {
  const current = await getDbLeads();
  const index = current.findIndex((l) => l.id === id);
  if (index === -1) return false;

  current[index] = { ...current[index], ...updates };
  saveLocalContent({ customLeads: current });

  try {
    const db = getDbPool();
    await db.execute(
      `INSERT INTO alko_site_content (id, data) 
       VALUES ('crm_leads', ?) 
       ON DUPLICATE KEY UPDATE data = VALUES(data)`,
      [JSON.stringify(current)]
    );
    return true;
  } catch (err: any) {
    console.warn("Aviso: Fallo al actualizar lead en MySQL:", err.message);
    return false;
  }
}

/**
 * Elimina un lead por ID.
 */
export async function deleteDbLead(id: string): Promise<boolean> {
  const current = await getDbLeads();
  const updatedList = current.filter((l) => l.id !== id);

  saveLocalContent({ customLeads: updatedList });

  try {
    const db = getDbPool();
    await db.execute(
      `INSERT INTO alko_site_content (id, data) 
       VALUES ('crm_leads', ?) 
       ON DUPLICATE KEY UPDATE data = VALUES(data)`,
      [JSON.stringify(updatedList)]
    );
    return true;
  } catch (err: any) {
    console.warn("Aviso: Fallo al eliminar lead en MySQL:", err.message);
    return false;
  }
}

/* ========================================================
   GESTIÓN DE USUARIOS Y ROLES (RBAC)
   ======================================================== */

export interface DbUserRecord {
  id: string | number;
  username: string;
  name: string;
  email: string;
  password_hash?: string;
  role: string;
  permissions?: string[];
  active?: boolean;
  created_at?: string;
  last_login?: string;
}

const DEFAULT_USERS: DbUserRecord[] = [
  {
    id: 1,
    username: "admin",
    name: "Administrador ALKO",
    email: "admin@alkoreformas.com",
    role: "superadmin",
    permissions: [
      "editor",
      "proyectos",
      "servicios",
      "articulos",
      "guias",
      "empleo",
      "equipo",
      "leads",
      "ajustes",
      "usuarios",
    ],
    active: true,
    created_at: "2026-01-01T00:00:00.000Z",
  },
];

/**
 * Obtiene la lista completa de usuarios del sistema (sin password_hash para seguridad).
 */
export async function getDbUsers(): Promise<DbUserRecord[]> {
  try {
    const db = getDbPool();
    const [rows] = await db.execute<any[]>(
      "SELECT data FROM alko_site_content WHERE id = 'admin_users' LIMIT 1"
    );
    if (rows && rows.length > 0) {
      const data = typeof rows[0].data === "string" ? JSON.parse(rows[0].data) : rows[0].data;
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (err: any) {
    console.warn("Aviso: Error obteniendo usuarios de MySQL:", err.message);
  }

  const local = getLocalContent();
  if (local.customUsers && local.customUsers.length > 0) {
    return local.customUsers;
  }

  return DEFAULT_USERS;
}

/**
 * Busca un usuario por username o email para el login (incluye password_hash).
 */
export async function getDbUserForAuth(identifier: string): Promise<DbUserRecord | null> {
  const users = await getDbUsers();
  const lower = identifier.toLowerCase();
  const found = users.find(
    (u) => u.username.toLowerCase() === lower || u.email.toLowerCase() === lower
  );
  return found || null;
}

/**
 * Guarda o actualiza un usuario en el sistema.
 */
export async function saveDbUser(userData: Partial<DbUserRecord>): Promise<DbUserRecord> {
  const current = await getDbUsers();
  const id = userData.id || ("user-" + Date.now());
  const index = current.findIndex((u) => String(u.id) === String(id) || u.username.toLowerCase() === (userData.username || "").toLowerCase());

  const fullRecord: DbUserRecord = {
    id: id,
    username: userData.username || (index >= 0 ? current[index].username : "usuario"),
    name: userData.name || (index >= 0 ? current[index].name : "Usuario ALKO"),
    email: userData.email || (index >= 0 ? current[index].email : "usuario@alkoreformas.com"),
    role: userData.role || (index >= 0 ? current[index].role : "editor"),
    permissions: userData.permissions || (index >= 0 ? current[index].permissions : ["editor"]),
    active: userData.active !== undefined ? userData.active : (index >= 0 && current[index].active !== undefined ? current[index].active : true),
    created_at: index >= 0 && current[index].created_at ? current[index].created_at : new Date().toISOString(),
    last_login: userData.last_login || (index >= 0 ? current[index].last_login : undefined),
    password_hash: userData.password_hash || (index >= 0 ? current[index].password_hash : undefined),
  };

  const updatedList = [...current];
  if (index >= 0) {
    updatedList[index] = fullRecord;
  } else {
    updatedList.push(fullRecord);
  }

  saveLocalContent({ customUsers: updatedList });

  try {
    const db = getDbPool();
    await db.execute(
      `INSERT INTO alko_site_content (id, data) 
       VALUES ('admin_users', ?) 
       ON DUPLICATE KEY UPDATE data = VALUES(data)`,
      [JSON.stringify(updatedList)]
    );
  } catch (err: any) {
    console.warn("Aviso: Fallo al guardar usuario en MySQL:", err.message);
  }

  return fullRecord;
}

/**
 * Elimina un usuario por ID. Impide eliminar al superadmin principal 'admin'.
 */
export async function deleteDbUser(id: string | number): Promise<boolean> {
  const current = await getDbUsers();
  const user = current.find((u) => String(u.id) === String(id));
  if (user && user.username === "admin") {
    throw new Error("No es posible eliminar el usuario administrador principal.");
  }

  const updatedList = current.filter((u) => String(u.id) !== String(id));
  saveLocalContent({ customUsers: updatedList });

  try {
    const db = getDbPool();
    await db.execute(
      `INSERT INTO alko_site_content (id, data) 
       VALUES ('admin_users', ?) 
       ON DUPLICATE KEY UPDATE data = VALUES(data)`,
      [JSON.stringify(updatedList)]
    );
    return true;
  } catch (err: any) {
    console.warn("Aviso: Fallo al eliminar usuario en MySQL:", err.message);
    return false;
  }
}

