import Image from "next/image";
import Link from "next/link";
import { FOOTER_NAV, FOOTER_NAV_SECONDARY, SITE } from "@/lib/site";
import type { SiteSettings } from "@/lib/types";

export default function Footer({ settings }: { settings: SiteSettings }) {
  const telHref = `tel:${settings.telefono.replace(/[^+\d]/g, "")}`;
  const socials = [
    { label: "LinkedIn", href: settings.linkedin },
    { label: "Instagram", href: settings.instagram },
    { label: "Facebook", href: settings.facebook },
  ].filter((social) => social.href && social.href !== "#");

  return (
    <footer className="w-full bg-[#242520] text-paper">
      <div className="site-wrap pb-7 pt-[clamp(56px,7vw,96px)]">
        <div className="grid grid-cols-1 gap-12 pb-[clamp(56px,7vw,100px)] md:grid-cols-12 md:gap-8">
          {/* Marca */}
          <div className="md:col-span-5">
            <Image
              src="/logo.webp"
              alt={SITE.legalName}
              width={500}
              height={130}
              sizes="220px"
              className="h-12 w-auto object-contain sm:h-14"
            />
            <p className="mt-8 max-w-[370px] text-[13px] leading-[1.85] text-[#B8B6AF]">
              Construcción integral y coordinación técnica para viviendas, espacios corporativos y
              proyectos singulares en Madrid.
            </p>
          </div>

          {/* Navegación */}
          <nav aria-label="Pie de página" className="grid grid-cols-2 gap-8 md:col-span-4">
            <div>
              <h2 className="mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#AFA99E]">
                Explorar
              </h2>
              {FOOTER_NAV.map((link) => (
                <Link key={link.href} href={link.href} className="mb-3 block text-[13px] hover:underline">
                  {link.label}
                </Link>
              ))}
            </div>
            <div>
              <h2 className="mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#AFA99E]">
                ALKO
              </h2>
              {FOOTER_NAV_SECONDARY.map((link) => (
                <Link key={link.href} href={link.href} className="mb-3 block text-[13px] hover:underline">
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Contacto */}
          <div className="md:col-span-3">
            <h2 className="mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#AFA99E]">
              Contacto
            </h2>
            <address className="space-y-3 text-[13px] not-italic leading-relaxed">
              <span className="block text-[#B8B6AF]">{settings.direccion}</span>
              <a href={telHref} className="block hover:underline">
                {settings.telefono}
              </a>
              <a href={`mailto:${settings.email}`} className="block break-all hover:underline">
                {settings.email}
              </a>
              {settings.horario && <span className="block text-[#B8B6AF]">{settings.horario}</span>}
            </address>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-[#51514C] pt-5 text-[11px] tracking-[0.06em] text-[#A8A69E] sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} {SITE.legalName} · Madrid, España
          </span>
          {socials.length > 0 && (
            <div className="flex items-center gap-6">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-white"
                >
                  {social.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
