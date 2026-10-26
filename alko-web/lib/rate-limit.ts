/**
 * Limitador de peticiones en memoria (ventana deslizante) para las rutas públicas de la API.
 *
 * Es por instancia del servidor: en Render, con una sola instancia, basta; si la web
 * escalara a varias habría que moverlo a un almacén compartido (Redis, etc.).
 * Cada ruta crea su propio limitador con `createRateLimiter()`, así los contadores no se mezclan.
 */

export interface RateResult {
  ok: boolean;
  /** Segundos hasta que se pueda volver a intentar (solo si !ok). */
  retryAfter: number;
}

export interface RateOptions {
  /** Peticiones permitidas por clave (IP) en cada ventana. */
  limit: number;
  windowMs: number;
  /** Tope global diario (por instancia) como red de seguridad ante IP rotatorias. */
  dailyLimit: number;
}

/** Evita que el mapa crezca sin límite si llegan muchas IP distintas. */
const MAX_KEYS = 5000;

export function createRateLimiter() {
  const hits = new Map<string, number[]>();
  let day = "";
  let dayCount = 0;

  return function check(key: string, { limit, windowMs, dailyLimit }: RateOptions, now = Date.now()): RateResult {
    // Tope global diario.
    const today = new Date(now).toISOString().slice(0, 10);
    if (today !== day) {
      day = today;
      dayCount = 0;
    }
    if (dayCount >= dailyLimit) {
      const tomorrow = Date.parse(`${today}T00:00:00Z`) + 24 * 60 * 60 * 1000;
      return { ok: false, retryAfter: Math.max(1, Math.ceil((tomorrow - now) / 1000)) };
    }

    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    if (recent.length >= limit) {
      hits.set(key, recent);
      return { ok: false, retryAfter: Math.max(1, Math.ceil((recent[0] + windowMs - now) / 1000)) };
    }

    recent.push(now);
    hits.set(key, recent);
    dayCount += 1;

    if (hits.size > MAX_KEYS) {
      for (const [k, times] of hits) {
        if (times.every((t) => now - t >= windowMs)) hits.delete(k);
      }
      // Si sigue lleno (todas activas), se descartan las más antiguas.
      while (hits.size > MAX_KEYS) {
        const oldest = hits.keys().next().value;
        if (oldest === undefined) break;
        hits.delete(oldest);
      }
    }

    return { ok: true, retryAfter: 0 };
  };
}
