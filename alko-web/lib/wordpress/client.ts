/**
 * Cliente HTTP de la REST API de WordPress (headless).
 *
 * La URL se resuelve con la variable de entorno WP_API_URL. Si no está definida
 * o el CMS no responde, las consultas devuelven `null` y la capa superior usa
 * el contenido por defecto.
 */

export const WP_API_URL = (process.env.WP_API_URL ?? "").replace(/\/+$/, "");

export const isWpConfigured = WP_API_URL.length > 0;

export interface WpRendered {
  rendered: string;
}

export interface WpMedia {
  source_url?: string;
  alt_text?: string;
}

export interface WpTerm {
  taxonomy?: string;
  name?: string;
}

export interface WpPost {
  id: number;
  slug?: string;
  date?: string;
  title?: WpRendered;
  excerpt?: WpRendered;
  content?: WpRendered;
  acf?: Record<string, unknown>;
  scf?: Record<string, unknown>;
  _embedded?: Record<string, unknown>;
}

/** Tiempo de revalidación (segundos) del contenido servido desde el CMS. */
export const WP_REVALIDATE_SECONDS = 60;

/** Realiza una petición GET a la REST API y devuelve el JSON o `null`. */
export async function wpGet<T>(path: string): Promise<T | null> {
  if (!isWpConfigured) return null;

  try {
    const res = await fetch(`${WP_API_URL}/wp-json/wp/v2/${path}`, {
      next: { revalidate: WP_REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}
