/**
 * Renderiza contenido HTML procedente del CMS con los estilos tipográficos del
 * sistema de diseño (sin depender de plugins de tipografía).
 *
 * `variant="article"` es la versión de lectura larga de los artículos: cuerpo más grande,
 * interlineado amplio, apartados separados por una línea y listas con marcador de color.
 */
export default function Prose({
  html,
  className = "",
  variant = "default",
}: {
  html: string;
  className?: string;
  variant?: "default" | "article";
}) {
  if (!html) return null;

  const shared =
    "font-sans [&_a]:text-amber-700 [&_a]:underline [&_a]:underline-offset-4 [&_h2]:font-serif [&_h2]:font-light [&_h2]:text-stone-900 [&_h3]:font-serif [&_h3]:font-light [&_h3]:text-stone-900 [&_strong]:font-medium [&_strong]:text-stone-900 [&_em]:not-italic [&_i]:not-italic [&_cite]:not-italic [&_ul]:list-disc [&_ol]:list-decimal";

  const variants = {
    default:
      "text-base sm:text-lg text-stone-600 font-light leading-relaxed space-y-5 [&_h2]:text-2xl sm:[&_h2]:text-3xl [&_h2]:leading-snug [&_h2]:mt-10 [&_h3]:text-xl sm:[&_h3]:text-2xl [&_h3]:mt-8 [&_ul]:pl-5 [&_ul]:space-y-2 [&_ol]:pl-5 [&_ol]:space-y-2",
    article:
      "text-[1.0625rem] sm:text-[1.1875rem] text-stone-700 font-normal leading-[1.85] space-y-6 [&_h2]:scroll-mt-28 [&_h2]:mt-16 [&_h2]:border-t [&_h2]:border-stone-200 [&_h2]:pt-8 [&_h2]:text-3xl sm:[&_h2]:text-4xl [&_h2]:leading-tight [&_h2]:tracking-tight [&_h2:first-child]:mt-0 [&_h2:first-child]:border-t-0 [&_h2:first-child]:pt-0 [&_h3]:mt-10 [&_h3]:text-2xl [&_h3]:leading-snug [&_ul]:space-y-3 [&_ul]:pl-6 [&_ul>li]:marker:text-amber-700 [&_ol]:space-y-3 [&_ol]:pl-6 [&_ol>li]:marker:font-mono [&_ol>li]:marker:text-amber-700",
  };

  return (
    <div
      className={`${variants[variant]} ${shared} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
