"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import ContactModal from "./ContactModal";

export type ContactMode = "rapido" | "avanzado";

interface OpenOptions {
  /** Qué botón y qué página lo abren, p. ej. «Cabecera · /servicios». Llega en el campo «Origen» del correo. */
  source?: string;
  /** Tipo de proyecto que se marca de entrada en el formulario completo. */
  tipo?: string;
}

interface ContactModalApi {
  open: (mode: ContactMode, options?: OpenOptions) => void;
}

const ContactModalContext = createContext<ContactModalApi | null>(null);

/** Devuelve null fuera del proveedor: los disparadores entonces siguen siendo enlaces normales. */
export function useContactModal() {
  return useContext(ContactModalContext);
}

interface State extends OpenOptions {
  mode: ContactMode;
}

/**
 * Gestiona el modal de contacto de toda la web. Hay dos formularios:
 * - «rapido»: nombre, correo y teléfono (llamadas a la acción de conversación).
 * - «avanzado»: la ficha completa del proyecto, con planos (llamadas a la acción de presupuesto).
 */
export default function ContactModalProvider({
  projectTypes,
  email,
  whatsappHref,
  children,
}: {
  projectTypes: string[];
  email: string;
  whatsappHref: string;
  children: ReactNode;
}) {
  const [state, setState] = useState<State | null>(null);

  const open = useCallback((mode: ContactMode, options: OpenOptions = {}) => {
    setState({ mode, ...options });
  }, []);
  const api = useMemo(() => ({ open }), [open]);

  return (
    <ContactModalContext.Provider value={api}>
      {children}
      {state && (
        <ContactModal
          mode={state.mode}
          source={state.source}
          tipo={state.tipo}
          projectTypes={projectTypes}
          email={email}
          whatsappHref={whatsappHref}
          onClose={() => setState(null)}
          onSwitch={(mode) => setState((prev) => (prev ? { ...prev, mode } : prev))}
        />
      )}
    </ContactModalContext.Provider>
  );
}
