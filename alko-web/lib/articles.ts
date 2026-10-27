import { decodeEntities, slugify, stripHtml } from "./utils";

export interface TocItem {
  id: string;
  label: string;
}

export interface PreparedArticle {
  /** Primer párrafo, en texto plano, para mostrarlo como entradilla. */
  lead: string;
  /** Resto del contenido, con un `id` en cada h2 para poder enlazarlos. */
  body: string;
  toc: TocItem[];
  /** Minutos de lectura (a unas 200 palabras por minuto, mínimo 1). */
  minutes: number;
}

/** Prepara el HTML del CMS para la página del artículo: entradilla, índice y tiempo de lectura. */
export function prepareArticle(html: string): PreparedArticle {
  const words = decodeEntities(stripHtml(html)).split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));

  // La entradilla es el primer párrafo, si el contenido empieza por él.
  let lead = "";
  let rest = html.trim();
  const first = rest.match(/^<p[^>]*>([\s\S]*?)<\/p>/i);
  if (first) {
    lead = decodeEntities(stripHtml(first[1]));
    rest = rest.slice(first[0].length).trim();
  }

  // Un id estable en cada h2 (sin repetir) y el índice con sus títulos.
  const toc: TocItem[] = [];
  const used = new Set<string>();
  const body = rest.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi, (match, attrs: string, inner: string) => {
    const label = decodeEntities(stripHtml(inner));
    const existing = attrs.match(/\sid=["']([^"']+)["']/i)?.[1];
    let id = existing || slugify(label) || `apartado-${toc.length + 1}`;
    while (used.has(id)) id = `${id}-${toc.length + 1}`;
    used.add(id);
    toc.push({ id, label });
    return existing ? match : `<h2${attrs} id="${id}">${inner}</h2>`;
  });

  return { lead, body, toc, minutes };
}
