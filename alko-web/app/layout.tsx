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
import { SITE } from "@/lib/site";
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
  title: SITE.title,
  description: SITE.description,
  keywords: SITE.keywords as unknown as string[],
  openGraph: {
    title: SITE.title,
    description: SITE.description,
    type: "website",
    locale: SITE.locale,
  },
};

export const revalidate = 60;

// Se ejecuta en cuanto se ha parseado el contenido, antes de hidratar. Solo en producción:
// en desarrollo React avisa del atributo añadido como diferencia de hidratación (en
// producción no se comprueba) y allí ya basta con SiteScripts.
const REVEAL_IN_VIEW_SCRIPT = `(function(){var h=innerHeight;document.querySelectorAll(".reveal-item,.reveal-scale").forEach(function(e){if(e.getBoundingClientRect().top<h)e.setAttribute("data-inview","")})})()`;

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [settings, sectors] = await Promise.all([getSettings(), getSectors()]);

  return (
    <html lang="es" className="scroll-smooth">
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
            whatsapp={<WhatsAppFloat settings={settings} />}
            chat={<ChatWidget />}
            scripts={
              <>
                {process.env.NODE_ENV === "production" && (
                  <script dangerouslySetInnerHTML={{ __html: REVEAL_IN_VIEW_SCRIPT }} />
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
