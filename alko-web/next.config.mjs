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
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2678400,
    remotePatterns,
  },
};

export default nextConfig;
