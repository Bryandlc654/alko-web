/**
 * Nombres y descripciones en inglés de los servicios. Los servicios vienen del panel (MySQL) solo en
 * castellano; en las páginas inglesas (menú, portada) se muestran con estos textos, buscados por slug.
 * Si se crea un servicio nuevo en el panel y no está aquí, se muestra en castellano.
 */
export const SERVICES_EN: Record<string, { title: string; description: string }> = {
  oficinas: {
    title: "Offices",
    description: "Workplace fit-outs that strengthen company culture and meet the highest technical standards.",
  },
  residencial: {
    title: "Residential",
    description: "Detached houses, flats and penthouses: new builds and full renovations with exacting finishes and efficiency.",
  },
  retail: {
    title: "Retail",
    description: "Shops, boutiques and showrooms where brand image and opening dates are non-negotiable.",
  },
  hospitality: {
    title: "Hospitality",
    description: "Hotels, restaurants and leisure venues where the guest experience and the opening date drive every decision.",
  },
  "viviendas-unifamiliares": {
    title: "Detached houses",
    description: "Design and construction of complete detached houses: new builds, extensions and full refurbishments with a single point of responsibility.",
  },
  "naves-industriales": {
    title: "Industrial buildings",
    description: "Fit-out of warehouses, industrial units and workshops: activity licence, building services, interior offices and fire protection.",
  },
  "restauracion-de-locales": {
    title: "Commercial premises restoration",
    description: "Bringing old or disused premises back to life: structure, façade, building services and code compliance for a new use.",
  },
  "carpinteria-metalica": {
    title: "Metalwork",
    description: "Windows, enclosures, doors, railings and light structures in aluminium and steel, made to measure and installed by our team.",
  },
  "ventanas-acusticas": {
    title: "Acoustic windows",
    description: "High sound-insulation windows for homes, offices and hotels next to busy streets, nightlife or airports.",
  },
  "cabinas-acusticas-oficinas": {
    title: "Office acoustic pods",
    description: "Acoustic pods and rooms for calls, video calls and meetings in open-plan offices, installed and connected with no building work.",
  },
  "concierge-familias-extranjeras": {
    title: "Concierge for international families",
    description: "We support families moving to Madrid from abroad: finding and buying the home, design, renovation and interiors, all managed remotely.",
  },
  "implantacion-de-empresas": {
    title: "International company set-up",
    description: "For international companies that need a base in Madrid: finding the premises or office, activity licence, renovation and turnkey set-up.",
  },
};
