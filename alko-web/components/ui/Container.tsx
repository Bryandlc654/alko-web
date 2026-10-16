import type { ReactNode } from "react";

/** Contenedor centrado con los márgenes horizontales del sistema de diseño. */
export default function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-12 ${className}`}>
      {children}
    </div>
  );
}
