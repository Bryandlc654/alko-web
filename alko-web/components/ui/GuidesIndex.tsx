import Image from "@/components/ui/Image";
import Link from "next/link";
import { ROUTES } from "@/lib/site";
import type { Guide } from "@/lib/types";

/** Índice de guías del Journal: una fila por guía con tema, lectura e imagen. */
export default function GuidesIndex({ guides }: { guides: Guide[] }) {
  return (
    <div>
      {guides.map((guide) => (
        <article key={guide.id} className="reveal-item group border-b border-[#e1e1df]">
          <Link
            href={`${ROUTES.guides}/${guide.slug}`}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 py-10 sm:py-12 lg:items-center"
          >
            <span className="lg:col-span-2 font-mono text-xs sm:text-sm text-stone-400 group-hover:text-stone-900 tracking-wider transition-colors">
              {guide.numero} — GUÍA
            </span>

            <div className="lg:col-span-6">
              <span className="block font-mono text-[10px] sm:text-[11px] text-stone-500 uppercase tracking-widest mb-3">
                {guide.tema}
                {guide.lectura && ` · ${guide.lectura} de lectura`}
              </span>
              <h3 className="font-serif font-light text-3xl sm:text-4xl lg:text-5xl text-stone-900 leading-tight tracking-tight group-hover:text-amber-800 transition-colors duration-300">
                {guide.title}
              </h3>
              {guide.descripcion && (
                <p className="mt-4 max-w-xl text-base sm:text-lg text-stone-600 font-light leading-relaxed">
                  {guide.descripcion}
                </p>
              )}
              <span className="mt-6 inline-flex items-center gap-1.5 text-[11px] font-mono tracking-widest uppercase text-stone-900 group-hover:text-amber-800 transition-colors border-b border-stone-900 group-hover:border-amber-800 pb-0.5">
                Leer guía
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </div>

            <div className="lg:col-span-4">
              <div className="relative overflow-hidden aspect-[4/3] bg-stone-200">
                <Image
                  src={guide.imagen}
                  alt={guide.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
