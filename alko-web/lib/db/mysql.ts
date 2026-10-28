import mysql, { Pool } from "mysql2/promise";
import fs from "fs";
import path from "path";
import { DEFAULT_HOME_CONTENT, DEFAULT_PROJECTS_PAGE_CONTENT, DEFAULT_NOSOTROS_PAGE_CONTENT } from "../content";
import type { HomeContent, ProjectsPageContent, NosotrosPageContent, Slide } from "../types";

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
  slides: Slide[];
  featuredProjectIds?: string[];
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
