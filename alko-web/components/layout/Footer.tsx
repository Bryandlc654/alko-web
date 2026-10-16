import Image from "next/image";
import Link from "next/link";
import { FOOTER_NAV } from "@/lib/site";
import type { SiteSettings } from "@/lib/types";

export default function Footer({ settings }: { settings: SiteSettings }) {
  const telHref = `tel:${settings.telefono.replace(/[^+\d]/g, "")}`;

  return (
    <footer className="w-full bg-white text-stone-900 border-t border-stone-300/80">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-16 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 lg:gap-12">
          {/* Columna 1 */}
          <div className="md:col-span-5 lg:col-span-5 flex flex-col justify-between pr-0 md:pr-8 lg:pr-12 md:border-r md:border-stone-300/60">
            <div>
              <h3 className="text-xl sm:text-2xl font-serif font-light text-stone-900 tracking-tight leading-snug mb-4">
                Construcción y arquitectura técnica orientada a resultados en Madrid.
              </h3>
              <p className="text-base sm:text-lg font-sans text-stone-600 font-light leading-relaxed max-w-sm">
                Proyectos corporativos y residenciales con rigor técnico, cumplimiento de
                plazos cerrados y dirección facultativa unificada.
              </p>
            </div>

            <nav className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs font-light uppercase tracking-wider text-stone-500">
              {FOOTER_NAV.map((link) => (
                <Link key={link.href} href={link.href} className="hover:text-stone-900 transition-colors">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Columna 2 */}
          <div className="md:col-span-3 lg:col-span-3 flex flex-col justify-between space-y-8 pl-0 md:pl-4">
            <div>
              <Image
                src="/logo-alko-footer.webp"
                alt="ALKO Construcción"
                width={500}
                height={130}
                className="h-9 sm:h-10 w-auto object-contain"
              />
            </div>
            <div className="space-y-1">
              <span className="text-xs sm:text-[13px] font-medium text-stone-900 block">
                Opening hours:
              </span>
              <span className="text-xs sm:text-[13px] text-stone-600 font-light block">
                {settings.horario}
              </span>
            </div>
          </div>

          {/* Columna 3 */}
          <div className="md:col-span-2 lg:col-span-2 flex flex-col justify-between space-y-8">
            <div className="space-y-1">
              <span className="text-xs sm:text-[13px] font-medium text-stone-900 block">
                ALKO Madrid
              </span>
              <span className="text-xs sm:text-[13px] text-stone-600 font-light block leading-relaxed">
                {settings.direccion}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-xs sm:text-[13px] font-medium text-stone-900 block">
                Phone:
              </span>
              <a
                href={telHref}
                className="text-xs sm:text-[13px] text-stone-600 hover:text-stone-900 font-light transition-colors block"
              >
                {settings.telefono}
              </a>
            </div>
          </div>

          {/* Columna 4 */}
          <div className="md:col-span-2 lg:col-span-2 flex flex-col justify-start md:border-l md:border-stone-300/60 pl-0 md:pl-6 lg:pl-8">
            <div className="space-y-1">
              <span className="text-xs sm:text-[13px] font-medium text-stone-900 block">
                Consulta general
              </span>
              <a
                href={`mailto:${settings.email}`}
                className="text-xs sm:text-[13px] text-stone-600 hover:text-stone-900 font-light transition-colors block break-all"
              >
                {settings.email}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="w-full bg-[#000000] text-stone-400 border-t border-stone-800/80">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-5 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-light">
          <div className="flex flex-wrap items-center gap-6 text-center sm:text-left">
            <span>© All Rights Reserved ALKO {new Date().getFullYear()}.</span>
            <span className="text-stone-500">Madrid · España</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-stone-400">Social Sites:</span>
            <a href={settings.linkedin || "#"} className="hover:text-white transition-colors duration-200">
              Linkedin
            </a>
            <a href={settings.facebook || "#"} className="hover:text-white transition-colors duration-200">
              Facebook
            </a>
            <a href={settings.instagram || "#"} className="hover:text-white transition-colors duration-200">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
