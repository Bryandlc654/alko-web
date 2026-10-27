import type { Metadata } from "next";
import { EB_Garamond } from "next/font/google";
import "./globals.css";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat";
import ChatWidget from "@/components/chat/ChatWidget";
import ContactModalProvider from "@/components/contact/ContactModalProvider";
import SiteScripts from "@/components/SiteScripts";
import RouteLoader from "@/components/RouteLoader";
import { getSectors, getSettings } from "@/lib/wordpress";
import { SITE } from "@/lib/site";

// Una única tipografía para todo el sitio.
const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  // Solo estilo normal: la web no usa cursiva (tampoco mezclada dentro de los títulos).
  style: ["normal"],
  variable: "--font-eb-garamond",
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
        className={`${ebGaramond.variable} bg-stone-950 text-white font-sans antialiased overflow-x-hidden selection:bg-white/20`}
      >
        <ContactModalProvider
          projectTypes={[...sectors.map((sector) => sector.title), "Otro"]}
          email={settings.email}
          whatsappHref={`https://wa.me/${settings.whatsapp.replace(/[^\d]/g, "")}`}
        >
          <Nav
            settings={settings}
            services={sectors.map(({ slug, title }) => ({ slug, title }))}
          />
          {children}
          {process.env.NODE_ENV === "production" && (
            <script dangerouslySetInnerHTML={{ __html: REVEAL_IN_VIEW_SCRIPT }} />
          )}
          <Footer settings={settings} />
          <WhatsAppFloat settings={settings} />
          <ChatWidget />
          <RouteLoader />
          <SiteScripts />
        </ContactModalProvider>
      </body>
    </html>
  );
}
