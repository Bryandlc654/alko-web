/** Preguntas frecuentes de la portada (copy de la propuesta 5, adaptado al «tú» del sitio). */
export const HOME_FAQ: { q: string; a: string }[] = [
  {
    q: "¿Cómo sé si ALKO es la empresa adecuada para mi proyecto?",
    a: "Empezamos con una conversación para conocer tus necesidades, la documentación existente y el inmueble. Con eso delimitamos el encargo y te decimos con claridad si encaja con lo que hacemos.",
  },
  {
    q: "¿Qué tipo de proyectos realizáis?",
    a: "Trabajamos en cuatro divisiones: viviendas y reformas integrales, oficinas y sedes, hoteles, restauración y locales, y naves e instalaciones técnicas.",
  },
  {
    q: "¿Cuánto dura una obra?",
    a: "Depende del alcance y del estado del inmueble. Definimos el calendario en la fase de planificación, antes de empezar la obra, y te informamos de cualquier cambio durante la ejecución.",
  },
  {
    q: "¿Podéis ajustaros a nuestra inversión?",
    a: "Definimos soluciones y partidas en función de la inversión prevista, y planteamos alternativas de materiales y acabados cuando es necesario.",
  },
  {
    q: "¿Gestionáis la obra de principio a fin?",
    a: "Sí. Un único interlocutor coordina oficios, técnicos y proveedores, hace el seguimiento del avance y te comunica las incidencias hasta la entrega.",
  },
  {
    q: "¿Cómo empezamos?",
    a: "Presenta tu proyecto con el formulario. Un técnico de la división correspondiente revisará tu solicitud y te llamará para concretar una visita.",
  },
];

/** Las mismas preguntas en inglés (portada /en). */
export const HOME_FAQ_EN: { q: string; a: string }[] = [
  {
    q: "How do I know whether ALKO is the right company for my project?",
    a: "We start with a conversation to understand your needs, any existing documentation and the property. From there we define the brief and tell you clearly whether it is a good fit for what we do.",
  },
  {
    q: "What kind of projects do you take on?",
    a: "We work across four divisions: homes and full renovations, offices and headquarters, hotels, restaurants and retail, and industrial buildings and technical installations.",
  },
  {
    q: "How long does a project take?",
    a: "It depends on the scope and the condition of the property. We set the schedule during the planning stage, before work starts, and keep you informed of any change during the build.",
  },
  {
    q: "Can you work within our budget?",
    a: "We define solutions and work packages around your planned budget, and propose alternative materials and finishes where needed.",
  },
  {
    q: "Do you manage the project from start to finish?",
    a: "Yes. A single point of contact coordinates trades, technical staff and suppliers, tracks progress and reports any issues to you until handover.",
  },
  {
    q: "How do we get started?",
    a: "Tell us about your project using the form. A specialist from the relevant division will review your request and call you to arrange a visit.",
  },
];

/** Preguntas frecuentes de la portada por idioma. */
export const HOME_FAQ_BY_LOCALE = { es: HOME_FAQ, en: HOME_FAQ_EN } as const;
