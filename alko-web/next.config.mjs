import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Permite que next/image optimice también las imágenes servidas por el WordPress headless.
const wpUrl = (process.env.WP_API_URL || "").replace(/\/+$/, "");
const remotePatterns = [];

if (wpUrl) {
  try {
    const { protocol, hostname } = new URL(wpUrl);
    remotePatterns.push({ protocol: protocol.replace(":", ""), hostname });
    if (!hostname.startsWith("www.")) {
      remotePatterns.push({ protocol: protocol.replace(":", ""), hostname: `www.${hostname}` });
    }
  } catch {
    // WP_API_URL mal formada: se ignora y solo se optimizan las imágenes locales.
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: __dirname,
  serverExternalPackages: ["mysql2", "bcryptjs"],
  poweredByHeader: false,
  images: {
    // Solo WebP: AVIF pesa algo menos, pero codificarlo es varias veces más lento y la
    // primera petición de cada tamaño dejaba las imágenes varios segundos en cola.
    formats: ["image/webp"],
    // Menos variantes = menos trabajo del optimizador y más aciertos de caché.
    deviceSizes: [640, 828, 1080, 1440, 1920],
    imageSizes: [64, 128, 256, 384],
    minimumCacheTTL: 2678400,
    remotePatterns,
  },
  // «Biblioteca técnica» (/conocimiento) se eliminó: la sección arranca en Artículos.
  async redirects() {
    return [
      { source: "/conocimiento", destination: "/conocimiento/articulos", permanent: true },
      // El método ALKO es ahora una sección de Nosotros.
      { source: "/metodo", destination: "/nosotros#metodo", permanent: true },
    ];
  },
};

export default nextConfig;
