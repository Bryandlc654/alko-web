"use client";

import { usePathname } from "next/navigation";

interface SiteShellProps {
  nav: React.ReactNode;
  footer: React.ReactNode;
  whatsapp: React.ReactNode;
  chat: React.ReactNode;
  scripts: React.ReactNode;
  children: React.ReactNode;
}

export default function SiteShell({
  nav,
  footer,
  whatsapp,
  chat,
  scripts,
  children,
}: SiteShellProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <main className="admin-root min-h-screen bg-[#f8fafc] text-slate-900 font-poppins">{children}</main>;
  }

  return (
    <>
      {nav}
      {children}
      {footer}
      {whatsapp}
      {chat}
      {scripts}
    </>
  );
}
