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
    <div className={`site-wrap ${className}`}>
      {children}
    </div>
  );
}
