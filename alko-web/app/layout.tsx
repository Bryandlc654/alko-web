import type { Metadata } from "next";
import { DM_Sans, Manrope } from "next/font/google";
import "./globals.css";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat";
import ChatWidget from "@/components/chat/ChatWidget";
import ContactModalProvider from "@/components/contact/ContactModalProvider";
import SiteScripts from "@/components/SiteScripts";
import RouteLoader from "@/components/RouteLoader";
import SiteShell from "@/components/layout/SiteShell";
import { getSectors, getSettings } from "@/lib/wordpress";
import { OG_IMAGE, SITE } from "@/lib/site";
import { DIVISION_OPTIONS } from "@/lib/divisions";

// Dirección V3: Manrope (titulares, peso Light) + DM Sans (cuerpo).
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  // Base de las URL relativas (canonical, imágenes de Open Graph).
  metadataBase: new URL(SITE.url),
  title: SITE.title,
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [...SITE.keywords],
  authors: [{ name: SITE.legalName, url: SITE.url }],
  creator: SITE.legalName,
  publisher: SITE.legalName,
  // Valores por defecto: cada página puede sustituirlos.
  openGraph: {
    title: SITE.title,
    description: SITE.description,
    type: "website",
    locale: SITE.locale,
    siteName: SITE.name,
    images: [OG_IMAGE],
  },
  // Sin imagen propia: X usa la de Open Graph de cada página.
  twitter: { card: "summary_large_image" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
};

export const revalidate = 60;

// Se ejecuta en cuanto se ha parseado el contenido, antes de hidratar. Solo en producción:
// en desarrollo React avisa del atributo añadido como diferencia de hidratación (en
// producción no se comprueba) y allí ya basta con SiteScripts.
const REVEAL_IN_VIEW_SCRIPT = `(function(){var h=innerHeight;document.querySelectorAll(".reveal-item,.reveal-scale").forEach(function(e){if(e.getBoundingClientRect().top<h)e.setAttribute("data-inview","")})})()`;

// Tras un despliegue, una pestaña abierta con la versión anterior pide archivos JS que ya no
// existen (ChunkLoadError) o los recibe cortados mientras Render cambia de instancia. Se recarga
// la página una vez (como mucho cada 30 s) para que tome la versión nueva.
const CHUNK_RELOAD_SCRIPT = `(function(){function r(){try{var k="alko-chunk-reload",t=+sessionStorage.getItem(k)||0;if(Date.now()-t<3e4)return;sessionStorage.setItem(k,String(Date.now()))}catch(e){return}location.reload()}addEventListener("unhandledrejection",function(e){var x=e.reason;if(x&&(x.name==="ChunkLoadError"||/Loading (CSS )?chunk/.test(x.message||"")))r()});addEventListener("error",function(e){if(e.filename&&e.filename.indexOf("/_next/static/")>-1&&e.error instanceof SyntaxError)r()})})()`;

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [settings, sectors] = await Promise.all([getSettings(), getSectors()]);

  return (
    // lang lo ajusta /en (script) y SiteShell al navegar: es la única diferencia esperada.
    <html lang="es" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${manrope.variable} ${dmSans.variable} bg-stone-950 text-white font-sans antialiased overflow-x-hidden selection:bg-piedra selection:text-ink`}
      >
        <ContactModalProvider
          projectTypes={DIVISION_OPTIONS}
          email={settings.email}
          whatsappHref={`https://wa.me/${settings.whatsapp.replace(/[^\d]/g, "")}`}
        >
          <SiteShell
            nav={
              <Nav
                settings={settings}
                services={sectors.map(({ slug, title, descripcion }) => ({ slug, title, descripcion }))}
              />
            }
            footer={<Footer settings={settings} />}
            footerEn={<Footer settings={settings} locale="en" />}
            whatsapp={<WhatsAppFloat settings={settings} />}
            whatsappEn={<WhatsAppFloat settings={settings} locale="en" />}
            chat={<ChatWidget />}
            scripts={
              <>
                {process.env.NODE_ENV === "production" && (
                  <>
                    <script dangerouslySetInnerHTML={{ __html: CHUNK_RELOAD_SCRIPT }} />
                    <script dangerouslySetInnerHTML={{ __html: REVEAL_IN_VIEW_SCRIPT }} />
                  </>
                )}
                <RouteLoader />
                <SiteScripts />
              </>
            }
          >
            {children}
          </SiteShell>
        </ContactModalProvider>
      </body>
    </html>
  );
}
