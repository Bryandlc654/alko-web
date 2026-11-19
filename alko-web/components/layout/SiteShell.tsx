"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { LOCALE_META, localeFromPath } from "@/lib/i18n";

interface SiteShellProps {
  nav: React.ReactNode;
  footer: React.ReactNode;
  /** Pie y botón de WhatsApp en inglés (para /en): se elige uno u otro según la ruta. */
  footerEn: React.ReactNode;
  whatsapp: React.ReactNode;
  whatsappEn: React.ReactNode;
  chat: React.ReactNode;
  scripts: React.ReactNode;
  children: React.ReactNode;
}

export default function SiteShell({
  nav,
  footer,
  footerEn,
  whatsapp,
  whatsappEn,
  chat,
  scripts,
  children,
}: SiteShellProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const locale = localeFromPath(pathname);

  // El layout raíz es común a los dos idiomas y sirve lang="es": al navegar se ajusta el
  // atributo para lectores de pantalla y traductores. /en lo fija antes de hidratar.
  useEffect(() => {
    document.documentElement.lang = LOCALE_META[locale].htmlLang;
  }, [locale]);

  if (isAdmin) {
    return <main className="admin-root min-h-screen bg-[#f8fafc] text-slate-900 font-poppins">{children}</main>;
  }

  return (
    <>
      {nav}
      {children}
      {locale === "en" ? footerEn : footer}
      {locale === "en" ? whatsappEn : whatsapp}
      {chat}
      {scripts}
    </>
  );
}
