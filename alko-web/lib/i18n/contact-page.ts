import type { Locale } from "@/lib/i18n";

/**
 * Textos de la página de contacto (/contacto y /en/contact). Los del formulario están en
 * lib/i18n/contact.ts.
 *
 * En castellano mandan los textos del panel (estos son los de respaldo). En inglés no hay panel:
 * se usan estos. Teléfono, email, dirección y horario salen de los ajustes del panel.
 */
const es = {
  meta: {
    title: "Pide presupuesto para tu reforma en Madrid | Contacto ALKO",
    description:
      "Cuéntanos tu reforma y un arquitecto técnico visitará la obra para darte un presupuesto cerrado por partidas y un plazo por escrito. Madrid y alrededores.",
  },
  breadcrumb: "Contacto",
  header: {
    eyebrow: "Contacto",
    title: "Hablemos de tu próxima obra.",
    description: "Cuéntanos qué tienes entre manos. Te responde directamente el equipo técnico que llevará tu obra.",
    quote: "Solicitar presupuesto",
    call: "Llamar",
  },
  form: {
    tag: "Solicitud de presupuesto",
    title: "Cuéntanos tu proyecto",
    intro: "Solo necesitamos tu nombre y un correo o teléfono. Con eso te llamamos para concretar.",
    source: "Página de contacto",
  },
  channels: {
    tag: "ALKO Madrid",
    title: "Un único interlocutor, desde la primera llamada.",
    intro: "Elige el canal que prefieras. Te atenderá directamente el equipo técnico que llevará tu obra.",
    phone: "Teléfono",
    email: "Email",
    whatsapp: "WhatsApp",
    whatsappValue: "Escríbenos al momento",
    hours: "Horario",
  },
  steps: {
    tag: "Después de escribirnos",
    title: "Qué pasa a continuación",
    step: "Paso",
    items: [
      { title: "Revisamos tu consulta", text: "El equipo técnico estudia el alcance y te contacta para concretar necesidades." },
      { title: "Visita técnica", text: "Vemos el espacio, tomamos medidas y detectamos condicionantes de obra e instalaciones." },
      { title: "Propuesta cerrada", text: "Presupuesto por partidas, calidades definidas y calendario de ejecución." },
    ],
  },
  office: {
    tag: "Visítanos",
    title: "Nuestra oficina",
    alt: "Oficina de ALKO en Madrid",
    address: "Dirección",
    hours: "Horario",
    directions: "Cómo llegar",
  },
};

export type ContactPageCopy = typeof es;

const en: ContactPageCopy = {
  meta: {
    title: "Get a quote for your renovation in Madrid | Contact ALKO",
    description:
      "Tell us about your renovation and a building engineer will visit the property to give you a fixed, itemised quote and a written schedule. Madrid area.",
  },
  breadcrumb: "Contact",
  header: {
    eyebrow: "Contact",
    title: "Let’s talk about your next project.",
    description: "Tell us what you have in mind. You’ll hear directly from the technical team that will run your project.",
    quote: "Request a quote",
    call: "Call",
  },
  form: {
    tag: "Quote request",
    title: "Tell us about your project",
    intro: "All we need is your name and an email or phone number. We’ll call you to go over the details.",
    source: "Página de contacto · EN",
  },
  channels: {
    tag: "ALKO Madrid",
    title: "One point of contact, from the very first call.",
    intro: "Choose whichever channel suits you. You’ll speak directly with the technical team that will run your project.",
    phone: "Phone",
    email: "Email",
    whatsapp: "WhatsApp",
    whatsappValue: "Message us now",
    hours: "Opening hours",
  },
  steps: {
    tag: "After you get in touch",
    title: "What happens next",
    step: "Step",
    items: [
      { title: "We review your enquiry", text: "Our technical team studies the scope and gets back to you to pin down what you need." },
      { title: "Technical visit", text: "We see the space, take measurements and identify any constraints on the works and building services." },
      { title: "Fixed proposal", text: "An itemised quote, specified finishes and a build schedule." },
    ],
  },
  office: {
    tag: "Visit us",
    title: "Our office",
    alt: "ALKO office in Madrid",
    address: "Address",
    hours: "Opening hours",
    directions: "Get directions",
  },
};

export const CONTACT_PAGE_COPY: Record<Locale, ContactPageCopy> = { es, en };
