/**
 * Renderiza contenido HTML procedente del CMS con los estilos tipográficos del
 * sistema de diseño (sin depender de plugins de tipografía).
 */
export default function Prose({ html, className = "" }: { html: string; className?: string }) {
  if (!html) return null;

  return (
    <div
      className={`text-base sm:text-lg text-stone-600 font-light leading-relaxed font-sans space-y-5 [&_a]:text-amber-700 [&_a]:underline [&_h2]:font-serif [&_h2]:font-light [&_h2]:text-2xl sm:[&_h2]:text-3xl [&_h2]:text-stone-900 [&_h2]:leading-snug [&_h2]:mt-10 [&_h3]:font-serif [&_h3]:font-light [&_h3]:text-xl sm:[&_h3]:text-2xl [&_h3]:text-stone-900 [&_h3]:mt-8 [&_strong]:font-medium [&_strong]:text-stone-900 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
