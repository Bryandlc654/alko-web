"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";

/*
 * Avisos y confirmaciones del panel, en lugar de alert() y confirm() del navegador.
 * Se llaman desde cualquier componente: toast.error("…"), toast.success("…"), toast.info("…")
 * y `if (!(await confirmDialog({ … }))) return;`. <AdminFeedbackHost /> vive en el layout del panel.
 */

type ToastKind = "success" | "error" | "info";
interface ToastItem {
  id: number;
  kind: ToastKind;
  message: string;
}
interface ConfirmOptions {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Acción destructiva (eliminar): botón en rojo. */
  danger?: boolean;
}
interface ConfirmRequest extends ConfirmOptions {
  resolve: (ok: boolean) => void;
}

let nextId = 1;
let pushToast: ((item: ToastItem) => void) | null = null;
let openConfirm: ((request: ConfirmRequest) => void) | null = null;

function show(kind: ToastKind, message: string) {
  if (pushToast) pushToast({ id: nextId++, kind, message });
  else console.warn(message);
}

export const toast = {
  success: (message: string) => show("success", message),
  error: (message: string) => show("error", message),
  info: (message: string) => show("info", message),
};

export function confirmDialog(options: ConfirmOptions): Promise<boolean> {
  return new Promise((resolve) => {
    if (openConfirm) openConfirm({ ...options, resolve });
    else resolve(false);
  });
}

const TOAST_STYLES: Record<ToastKind, { icon: typeof Info; className: string }> = {
  success: { icon: CheckCircle2, className: "border-emerald-200 text-emerald-800 [&_svg]:text-emerald-600" },
  error: { icon: XCircle, className: "border-red-200 text-red-800 [&_svg]:text-red-600" },
  info: { icon: Info, className: "border-blue-200 text-slate-800 [&_svg]:text-blue-600" },
};

export function AdminFeedbackHost() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [request, setRequest] = useState<ConfirmRequest | null>(null);
  const confirmButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    pushToast = (item) => {
      setToasts((current) => [...current, item]);
      window.setTimeout(() => setToasts((current) => current.filter((t) => t.id !== item.id)), 5000);
    };
    openConfirm = setRequest;
    return () => {
      pushToast = null;
      openConfirm = null;
    };
  }, []);

  const answer = (ok: boolean) => {
    request?.resolve(ok);
    setRequest(null);
  };

  useEffect(() => {
    if (!request) return;
    confirmButton.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") answer(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request]);

  return (
    <>
      {/* Avisos */}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[200] flex w-[min(380px,calc(100vw-2.5rem))] flex-col gap-3" aria-live="polite">
        {toasts.map((item) => {
          const { icon: Icon, className } = TOAST_STYLES[item.kind];
          return (
            <div
              key={item.id}
              role={item.kind === "error" ? "alert" : "status"}
              className={`pointer-events-auto flex items-start gap-3 rounded-xl border bg-white px-4 py-3 text-sm font-medium shadow-lg ${className}`}
            >
              <Icon className="mt-0.5 h-4 w-4 shrink-0" />
              <p className="flex-1 leading-snug">{item.message}</p>
              <button
                type="button"
                onClick={() => setToasts((current) => current.filter((t) => t.id !== item.id))}
                aria-label="Cerrar aviso"
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4 !text-current" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Confirmación */}
      {request && (
        <div
          className="fixed inset-0 z-[210] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget) answer(false);
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="admin-confirm-title"
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start gap-4">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  request.danger ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
                }`}
              >
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h2 id="admin-confirm-title" className="text-base font-semibold text-slate-900">
                  {request.title}
                </h2>
                {request.message && <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{request.message}</p>}
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => answer(false)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                {request.cancelLabel ?? "Cancelar"}
              </button>
              <button
                ref={confirmButton}
                type="button"
                onClick={() => answer(true)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold text-white ${
                  request.danger ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {request.confirmLabel ?? (request.danger ? "Eliminar" : "Aceptar")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
