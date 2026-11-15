"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, ImageIcon, Loader2, Search, Trash2, Upload, X } from "lucide-react";
import { confirmDialog, toast } from "@/components/admin/feedback";
import type { MediaItem } from "@/lib/media";

/*
 * Biblioteca de medios del panel.
 * - `openMediaPicker()` abre el modal para elegir una imagen ya subida o subir una nueva y
 *   devuelve su URL (o null si se cancela). <MediaPickerHost /> vive en el layout del panel.
 * - <MediaLibrary /> es la rejilla con subida, búsqueda y borrado; la usan el modal y la página Medios.
 */

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Error al subir la imagen");
  return data.url as string;
}

function formatSize(bytes: number) {
  return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

type Filter = "todas" | "subida" | "web";

export function MediaLibrary({
  onSelect,
  onConfirm,
  selectedUrl,
}: {
  /** Si se pasa, al pulsar una imagen se marca (modo selector); si no, es la página de gestión. */
  onSelect?: (url: string) => void;
  /** Doble clic en una imagen: usarla directamente. */
  onConfirm?: (url: string) => void;
  selectedUrl?: string;
}) {
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("todas");
  const [uploading, setUploading] = useState(0);
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setError("");
    try {
      const res = await fetch("/api/admin/media", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo cargar la biblioteca");
      setItems(data.items);
    } catch (err: any) {
      setError(err.message);
      setItems([]);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleFiles = async (files: FileList | File[]) => {
    const list = Array.from(files).filter((file) => file.type.startsWith("image/"));
    if (list.length === 0) return;
    setUploading((n) => n + list.length);
    let lastUrl = "";
    for (const file of list) {
      try {
        lastUrl = await uploadImage(file);
      } catch (err: any) {
        toast.error(`${file.name}: ${err.message}`);
      } finally {
        setUploading((n) => n - 1);
      }
    }
    await load();
    if (lastUrl) {
      toast.success(list.length > 1 ? "Imágenes subidas" : "Imagen subida");
      // En el selector, subir una sola imagen la elige directamente.
      if (onSelect && list.length === 1) onSelect(lastUrl);
    }
  };

  const handleDelete = async (item: MediaItem) => {
    const ok = await confirmDialog({
      title: `¿Eliminar «${item.name}»?`,
      message: "Si la imagen se usa en algún bloque de la web, dejará de verse allí.",
      danger: true,
    });
    if (!ok) return;
    const res = await fetch(`/api/admin/media?name=${encodeURIComponent(item.id)}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      toast.error(data.error || "No se pudo eliminar la imagen");
      return;
    }
    setItems((current) => current?.filter((i) => i.id !== item.id || i.source !== item.source) ?? null);
    toast.success("Imagen eliminada");
  };

  const copyUrl = async (url: string) => {
    const absolute = url.startsWith("/") ? `${window.location.origin}${url}` : url;
    try {
      await navigator.clipboard.writeText(absolute);
      toast.success("Enlace copiado");
    } catch {
      toast.error("No se pudo copiar el enlace");
    }
  };

  const visible = (items ?? []).filter(
    (item) => (filter === "todas" || item.source === filter) && item.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <div
      className="flex min-h-0 flex-1 flex-col"
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
    >
      {/* Barra de herramientas */}
      <div className="flex flex-wrap items-center gap-3 pb-4">
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          {uploading > 0 ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          <span>{uploading > 0 ? `Subiendo ${uploading}…` : "Subir imágenes"}</span>
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files);
            e.target.value = "";
          }}
        />

        <div className="flex rounded-xl border border-slate-200 bg-white p-0.5 text-xs font-semibold">
          {(["todas", "subida", "web"] as Filter[]).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={`rounded-lg px-3 py-1.5 transition ${filter === value ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"}`}
            >
              {value === "todas" ? "Todas" : value === "subida" ? "Subidas" : "De la web"}
            </button>
          ))}
        </div>

        <label className="relative ml-auto w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre"
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-700 focus:border-blue-600 focus:outline-none"
          />
        </label>
      </div>

      {/* Rejilla */}
      <div
        className={`relative min-h-[240px] flex-1 overflow-y-auto rounded-2xl border-2 border-dashed p-3 transition ${
          dragging ? "border-blue-500 bg-blue-50/60" : "border-transparent"
        }`}
      >
        {items === null ? (
          <div className="flex h-60 items-center justify-center text-sm text-slate-500">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Cargando imágenes…
          </div>
        ) : error ? (
          <div className="flex h-60 flex-col items-center justify-center gap-3 text-sm text-red-600">
            <span>{error}</span>
            <button type="button" onClick={load} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold hover:bg-red-50">
              Reintentar
            </button>
          </div>
        ) : visible.length === 0 ? (
          <div className="flex h-60 flex-col items-center justify-center gap-2 text-center text-sm text-slate-500">
            <ImageIcon className="h-8 w-8 text-slate-300" />
            <span>{query || filter !== "todas" ? "No hay imágenes con ese filtro." : "Todavía no hay imágenes. Arrastra fotos aquí o pulsa «Subir imágenes»."}</span>
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {visible.map((item) => {
              const selected = selectedUrl === item.url;
              return (
                <li key={`${item.source}-${item.id}`} className="group relative">
                  <button
                    type="button"
                    onClick={() => (onSelect ? onSelect(item.url) : copyUrl(item.url))}
                    onDoubleClick={onConfirm ? () => onConfirm(item.url) : undefined}
                    title={onSelect ? "Ver vista previa (doble clic para usarla)" : "Copiar enlace"}
                    className={`relative block aspect-square w-full overflow-hidden rounded-xl border bg-slate-100 transition ${
                      selected ? "border-blue-600 ring-2 ring-blue-600" : "border-slate-200 hover:border-blue-400"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.url} alt={item.name} loading="lazy" className="h-full w-full object-cover" />
                    {selected && (
                      <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white shadow">
                        <Check className="h-4 w-4" />
                      </span>
                    )}
                  </button>
                  <div className="mt-1.5 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-medium text-slate-700" title={item.name}>
                        {item.name}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {item.source === "web" ? "Imagen de la web" : formatSize(item.size)}
                      </p>
                    </div>
                    {item.source === "subida" && (
                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        aria-label={`Eliminar ${item.name}`}
                        className="shrink-0 rounded-lg p-1 text-slate-400 opacity-100 transition hover:bg-red-50 hover:text-red-600 sm:opacity-0 sm:group-hover:opacity-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ----------------------------- Selector modal ----------------------------- */

interface PickerRequest {
  current?: string;
  title?: string;
  resolve: (url: string | null) => void;
}

let openPicker: ((request: PickerRequest) => void) | null = null;

/** Abre la biblioteca para elegir o subir una imagen. Devuelve la URL elegida o null. */
export function openMediaPicker(options: { current?: string; title?: string } = {}): Promise<string | null> {
  return new Promise((resolve) => {
    if (openPicker) openPicker({ ...options, resolve });
    else resolve(null);
  });
}

export function MediaPickerHost() {
  const [request, setRequest] = useState<PickerRequest | null>(null);

  useEffect(() => {
    openPicker = setRequest;
    return () => {
      openPicker = null;
    };
  }, []);

  const finish = useCallback(
    (url: string | null) => {
      request?.resolve(url);
      setRequest(null);
    },
    [request],
  );

  useEffect(() => {
    if (!request) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") finish(null);
    };
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [request, finish]);

  if (!request) return null;

  return <PickerDialog request={request} finish={finish} />;
}

function fileNameFromUrl(url: string) {
  return decodeURIComponent(url.split("?")[0].split("/").pop() || url);
}

function PickerDialog({ request, finish }: { request: PickerRequest; finish: (url: string | null) => void }) {
  // Imagen marcada en la rejilla: se ve en grande antes de confirmarla.
  const [pending, setPending] = useState<string | undefined>(request.current);
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);
  const isCurrent = !!pending && pending === request.current;

  useEffect(() => {
    setDims(null);
  }, [pending]);

  return (
    <div
      className="fixed inset-0 z-[190] flex items-center justify-center bg-slate-900/50 p-3 backdrop-blur-sm sm:p-6"
      onClick={(event) => {
        if (event.target === event.currentTarget) finish(null);
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="media-picker-title"
        className="flex h-[90vh] w-full max-w-6xl flex-col rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-2xl font-poppins"
      >
        <div className="flex items-start justify-between gap-4 pb-4">
          <div>
            <h2 id="media-picker-title" className="text-base font-semibold text-slate-900">
              {request.title ?? "Elegir imagen"}
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Pulsa una imagen para verla en grande y confirma con «Usar esta imagen». También puedes subir una nueva.
            </p>
          </div>
          <button
            type="button"
            onClick={() => finish(null)}
            aria-label="Cerrar"
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-200 hover:text-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-4 lg:flex-row">
          <div className="flex min-h-0 flex-1 flex-col">
            <MediaLibrary onSelect={setPending} onConfirm={(url) => finish(url)} selectedUrl={pending} />
          </div>

          {/* Vista previa */}
          <aside className="flex shrink-0 flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 lg:w-80">
            <div className="relative flex h-36 items-center justify-center overflow-hidden rounded-xl bg-slate-900 sm:h-44 lg:h-auto lg:flex-1">
              {pending ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  key={pending}
                  src={pending}
                  alt="Vista previa"
                  onLoad={(e) => setDims({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-center text-xs text-slate-400">
                  <ImageIcon className="h-8 w-8 text-slate-500" />
                  <span>Pulsa una imagen para verla aquí</span>
                </div>
              )}
              {isCurrent && (
                <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-slate-700">
                  Imagen actual
                </span>
              )}
            </div>
            {pending && (
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-slate-800" title={fileNameFromUrl(pending)}>
                  {fileNameFromUrl(pending)}
                </p>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  {dims ? `${dims.w} × ${dims.h} px · ${dims.w >= dims.h ? "horizontal" : "vertical"}` : "Cargando…"}
                  {" · "}
                  <a href={pending} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                    Ver a tamaño real
                  </a>
                </p>
              </div>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => finish(null)}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={!pending}
                onClick={() => pending && finish(pending)}
                className="flex-[2] rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Usar esta imagen
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
