import type { Locale } from "@/lib/i18n";
import { SERVICES_EN } from "@/lib/i18n/services";
import { sectorKeyword, sectorSlug } from "@/lib/content";
import type { Sector, SectorLandingData } from "@/lib/types";

/**
 * Contenido en inglés de cada página de servicio (/en/services/[slug]).
 *
 * Los textos de los servicios se editan en el panel (MySQL) y solo existen en castellano. Esta es su
 * traducción, copiada de lo que había en el panel el 2026-11-19. Si se cambia un texto en el panel,
 * hay que actualizar aquí su versión inglesa: la página inglesa NO lee los textos del panel (solo sus
 * imágenes), para no mezclar idiomas.
 *
 * - `keyword`: lo que se busca en Google en inglés; da forma al H1 y a los H2 («Office renovations in Madrid»).
 * - `content`: el texto corto del servicio (el campo «contenido» del panel), en HTML.
 * - `landing`: los textos de la landing. Los servicios que no tienen landing en el panel no la tienen
 *   aquí y usan los textos por defecto de la plantilla.
 */
export interface ServiceContentEn {
  keyword: string;
  content: string;
  landing?: Omit<SectorLandingData, "includesImage" | "supportImage" | "ctaImage" | "resultsImages">;
}

export const SERVICE_CONTENT_EN: Record<string, ServiceContentEn> = {
  oficinas: {
    keyword: "office renovations",
    content:
      "<p>Turnkey corporate fit-outs. We keep downtime to a minimum with demanding schedules, while delivering the acoustic insulation and flexible building services that leading companies require.</p>",
  },

  residencial: {
    keyword: "home renovations",
    content:
      "<p>We support architects and owners from the foundations or the strip-out to the last detail of joinery and home automation. Space reconfiguration, structural reinforcement and restoration of protected features, with a dedicated building surveyor and a fixed price at every stage.</p>",
    landing: {
      heroHeadline: "Residential",
      lead: "Detached houses, flats and penthouses: new builds and full renovations with exacting finishes and efficiency.",
      statsTitle: "Projects delivered",
      commitments: [
        { title: "Fixed price", text: "Itemised and agreed before work starts" },
        { title: "Written schedule", text: "With control milestones throughout the build" },
        { title: "One single team", text: "From design to handover, with no middlemen" },
      ],
      problemsHeadline: "A build with no surprises.",
      problems: [
        { avoid: "Uncoordinated trades", promise: "One single team coordinates the whole build" },
        { avoid: "Cost overruns and delays", promise: "Price and schedule fixed in writing" },
        { avoid: "Nobody takes responsibility for the whole", promise: "A technical lead on site" },
      ],
      includesHeadline: "Everything in one team.",
      includesSubtitle: "What's included",
      includes: [
        "Reconfiguration of partitions and spaces",
        "Complete renewal of plumbing and drainage",
        "Electrical installation and main distribution board to regulations",
        "Ducted air conditioning or underfloor heating",
        "Thermally broken external windows and doors",
        "Made-to-measure joinery: doors, wardrobes and panelling",
      ],
      capacidadesHeadline: "Technical capabilities",
      capacidadesSubtitle: "Technical disciplines & methodology",
      capacidades: [
        {
          codigo: "01",
          titulo: "Architecture & detailed design",
          metrica: "BIM modelling · Drawings",
          resumen: "Meticulous technical development, space optimisation and selection of fine materials before work starts.",
          puntos: ["1:1 construction details", "Ongoing interior design advice"],
        },
        {
          codigo: "02",
          titulo: "Full permit management",
          metrica: "City Council · ECLU Madrid",
          resumen: "Complete technical processing of major and minor works permits and activity projects, without red-tape delays.",
          puntos: ["Legal certainty guaranteed", "Direct contact with council officers"],
        },
        {
          codigo: "03",
          titulo: "Building services & efficiency",
          metrica: "Heat pumps · Underfloor heating · Climate",
          resumen: "Design and installation of thermal envelopes, mechanical ventilation with heat recovery and state-of-the-art home automation.",
          puntos: ["Energy savings of up to 70%", "Even acoustic and thermal comfort"],
        },
        {
          codigo: "04",
          titulo: "Finishes & made-to-measure joinery",
          metrica: "Millimetre tolerance",
          resumen: "In-house manufacture of panelling, built-in wardrobes, flush metalwork and bespoke designer kitchens.",
          puntos: ["Fine materials: wood, stone and metal", "Flush junctions with no visible mouldings"],
        },
        {
          codigo: "05",
          titulo: "Daily site supervision",
          metrica: "On-site supervision",
          resumen: "A building surveyor on site at all times to guarantee installation quality and that milestones are met.",
          puntos: ["Inspections before each stage is closed", "Strict coordination of specialist trades"],
        },
        {
          codigo: "06",
          titulo: "Turnkey handover & guarantee",
          metrica: "As-built dossier · Certificates",
          resumen: "Handover after thorough watertightness tests, final drawings and a direct after-sales guarantee.",
          puntos: ["Property maintenance manual", "Priority after-sales response"],
        },
      ],
      processHeadline: "6 stages, one single team.",
      supportTitle: "Technical rigour at every stage",
      supportContent:
        "We closely supervise every work package with a building surveyor assigned to your project, ensuring compliance with regulations and the highest construction standards.",
      faqHeadline: "What people usually ask us before starting.",
      faqs: [
        {
          q: "How does the process start?",
          a: "You tell us what you need, using the form, by phone or on WhatsApp. A specialist studies the brief and replies with an assessment of the scope, the schedule and the price.",
        },
        {
          q: "What do I need to request an assessment?",
          a: "Just your name and a phone number or email address. If you have drawings, photos or a list of what you want to do, you can send them later to refine the assessment.",
        },
        {
          q: "How is the price set?",
          a: "The quote is itemised and agreed before work starts. If anything changes during the build, it is priced and approved before it is carried out.",
        },
      ],
      ctaHeadline: "Let's talk about your residential project.",
      ctaText: "Tell us what you need and the technical team will reply with an assessment of the scope, the schedule and the price.",
    },
  },

  retail: {
    keyword: "retail fit-outs",
    content:
      "<p>Fast delivery of commercial projects with strict control of costs and opening dates. Full compliance with accessibility, safety and activity licence regulations in Madrid.</p>",
  },

  hospitality: {
    keyword: "hotel and restaurant renovations",
    content:
      "<p>Phased works to keep the business running when needed, building services sized for intensive use and hard-wearing finishes that preserve the look of the space. We coordinate activity licences, fire protection and accessibility in Madrid.</p>",
  },

  "viviendas-unifamiliares": {
    keyword: "detached house construction",
    content:
      "<p>We deliver the complete detached house, from design and permit to turnkey handover: foundations, structure, efficient envelope, building services, interiors and outdoor areas. One technical team and a fixed price per stage.</p>",
    landing: {
      lead: "Design and construction of detached houses in Madrid: new builds, extensions and full refurbishments with one technical team, a fixed price and a phased schedule, from permit to handover.",
      supportContent:
        "We coordinate architecture, structure, building services and interiors as one project. The house is designed around how it will be lived in and what it will cost to run: a well-insulated envelope, heat pumps, solar panels and home automation built in from the start.",
      commitments: [
        { title: "Complete design", text: "Architecture, structure and services defined before work starts." },
        { title: "Price per stage", text: "Itemised, fixed and certified as work progresses." },
        { title: "Efficient home", text: "Envelope, heat pump and solar panels designed together." },
      ],
      problems: [
        {
          avoid: "Designs that reach the site without services or finishes defined.",
          promise: "Complete detailed design with a fixed specification before the permit.",
        },
        {
          avoid: "Several contractors passing responsibility between them.",
          promise: "One single party responsible from the foundations to the last piece of joinery.",
        },
        {
          avoid: "Houses with high heating, cooling and maintenance costs.",
          promise: "Envelope and systems designed for low consumption throughout the life of the house.",
        },
      ],
      includes: [
        "Plot study, outline design, and basic and detailed design",
        "Building permit and coordination with the council",
        "Earthworks, foundations and structure",
        "High-performance façades, roofs, windows and doors",
        "Heat pump, underfloor heating, ventilation and solar panels",
        "Electrics, home automation and data network",
        "Interiors, kitchens, bathrooms and made-to-measure joinery",
        "Landscaping of the plot, swimming pool and garden",
      ],
      capacidades: [
        {
          codigo: "01",
          titulo: "Design and permit",
          metrica: "Basic · Detailed",
          resumen: "Design tailored to the plot and to the local planning rules.",
          puntos: ["Buildability study", "Full permit processing"],
        },
        {
          codigo: "02",
          titulo: "Structure and envelope",
          metrica: "Concrete · Steel · Timber",
          resumen: "Engineered foundations and structure, and a continuous envelope with no thermal bridges.",
          puntos: ["External insulation", "Thermally broken windows and doors"],
        },
        {
          codigo: "03",
          titulo: "Efficient building services",
          metrica: "Heat pump · Solar",
          resumen: "Heating, cooling, hot water and energy sized for how the house is really used.",
          puntos: ["Underfloor heating and cooling", "Ventilation with heat recovery"],
        },
        {
          codigo: "04",
          titulo: "Interiors and exteriors",
          metrica: "Turnkey",
          resumen: "Finishes, made-to-measure joinery, swimming pool and garden within the same project.",
          puntos: ["One single schedule", "Handover with final documentation"],
        },
      ],
      processHeadline: "How we build a detached house",
      faqs: [
        {
          q: "How long does it take to build a detached house?",
          a: "It depends on the size and the construction system, but a medium-sized house usually needs between twelve and eighteen months on site, plus the time to prepare the design and obtain the permit.",
        },
        {
          q: "Do you handle the design, or do I need a separate architect?",
          a: "Our technical team can take on the complete design, or we can work with the architect of your choice, coordinating their design with the build.",
        },
        {
          q: "Do you carry out extensions and refurbishments of existing houses?",
          a: "Yes. We extend, reinforce structures and refurbish complete houses, including improving the energy performance of the envelope and the building services.",
        },
        {
          q: "Is the price fixed?",
          a: "Yes. It is itemised on the detailed design and certified by stage. Any changes are priced and approved in writing before they are made.",
        },
      ],
    },
  },

  "naves-industriales": {
    keyword: "industrial building fit-outs",
    content:
      "<p>We turn shell or old industrial buildings into spaces ready to operate: adaptation to the activity, fire protection, industrial building services, floor slabs, offices and changing rooms, with the activity licence included.</p>",
    landing: {
      lead: "Industrial building fit-outs in Madrid: we adapt industrial units, warehouses and workshops to the activity, with the licence, fire protection, building services, floor slabs and interior offices, on the timeline the operation needs.",
      supportContent:
        "We start from the activity that will take place: flows of goods, machinery, staff and regulations. From there we define the layout, the building services and the fire safety measures, and we obtain the licence so the building can open on the planned date.",
      commitments: [
        { title: "Licence included", text: "Activity project and processing with the council." },
        { title: "Opening date", text: "Fixed schedule aligned with the start of operations." },
        { title: "Phased works", text: "Without stopping operations if the building is already in use." },
      ],
      problems: [
        {
          avoid: "Buildings that fail the fire protection inspection.",
          promise: "Fire safety design in line with the regulations for industrial premises.",
        },
        {
          avoid: "Electrical or air installations that fall short for the machinery.",
          promise: "Power, compressed air, lighting and climate control calculated for the process.",
        },
        {
          avoid: "Opening delays caused by badly planned licences.",
          promise: "Activity licence processed alongside the works from day one.",
        },
      ],
      includes: [
        "Activity project and opening licence",
        "Fire protection: compartmentation, detection and extinguishing",
        "Industrial floor slabs, paint and signage",
        "Low-voltage electrical installation and LED lighting",
        "Air conditioning, ventilation and extraction",
        "Interior offices, changing rooms and toilets",
        "Loading docks, sectional doors and dock shelters",
        "Repair of roofs and skylights",
      ],
      capacidades: [
        {
          codigo: "01",
          titulo: "Licences and regulations",
          metrica: "Activity · Fire",
          resumen: "Technical design and processing of the activity licence and the installation permits.",
          puntos: ["Fire safety regulations", "Accessibility and environment"],
        },
        {
          codigo: "02",
          titulo: "Industrial civil works",
          metrica: "Slabs · Structure",
          resumen: "High-strength floor slabs, structural reinforcement, pits and mezzanines.",
          puntos: ["Floors for forklift traffic", "Steel mezzanines"],
        },
        {
          codigo: "03",
          titulo: "Building services",
          metrica: "Electrical · Climate · Air",
          resumen: "Installations sized for the machinery and the number of workers.",
          puntos: ["Power boards and lines", "Zoned climate control"],
        },
        {
          codigo: "04",
          titulo: "Staff areas",
          metrica: "Offices · Changing rooms",
          resumen: "Offices, meeting rooms, changing rooms and toilets integrated into the building.",
          puntos: ["Acoustic insulation from the production area", "Hard-wearing finishes"],
        },
      ],
      processHeadline: "How we fit out an industrial building",
      faqs: [
        {
          q: "Do you obtain the activity licence for the building?",
          a: "Yes. We prepare the activity and installations project and submit it to the council, coordinated with the works so the opening is not delayed.",
        },
        {
          q: "Can you work while the building is in operation?",
          a: "Yes. We plan the works by zones and time slots so that operations continue, separating the work areas and keeping access open.",
        },
        {
          q: "What do fire regulations require in an industrial building?",
          a: "It depends on the floor area, the activity and the fire load. It may require compartmentation, detection, extinguishers, fire hydrants, sprinklers or smoke extraction. We determine this in the design.",
        },
        {
          q: "Do you also build the offices inside the building?",
          a: "Yes. We build offices, changing rooms and toilets, on the ground floor or on a mezzanine, with their services and insulation from the industrial area.",
        },
      ],
    },
  },

  "restauracion-de-locales": {
    keyword: "commercial premises restoration",
    content:
      "<p>We bring old, closed or run-down commercial premises back to life: condition survey, structural reinforcement, damp treatment, new building services, façade and shopfront, and adaptation to accessibility and activity regulations.</p>",
    landing: {
      lead: "Commercial premises restoration in Madrid: we bring old, closed or run-down ground-floor premises back to life with structural reinforcement, damp treatment, new building services, façade work and code compliance, ready for a new activity.",
      supportContent:
        "Old premises almost always hide surprises: damaged floors, damp, non-compliant installations or a protected façade. We start with a technical survey of the real condition so the quote reflects what actually needs doing and there are no surprises halfway through the works.",
      commitments: [
        { title: "Survey first", text: "Technical inspection of the condition before quoting." },
        { title: "Up-to-date compliance", text: "Accessibility, fire safety and activity licence." },
        { title: "Heritage respected", text: "Façades and protected features restored with care." },
      ],
      problems: [
        {
          avoid: "Quotes that soar once floors and ceilings are opened up.",
          promise: "Survey with test openings and a structural review before the price is fixed.",
        },
        {
          avoid: "Damp that comes back a few months later.",
          promise: "We treat the cause (rising damp, leaks or condensation), not just the finish.",
        },
        {
          avoid: "Premises that fail to get the licence for the new activity.",
          promise: "Adaptation to accessibility, fire safety and ventilation for the intended use.",
        },
      ],
      includes: [
        "Technical survey, test openings and condition report",
        "Reinforcement of floors, beams and walls",
        "Damp treatment and waterproofing",
        "Complete renewal of electrics, plumbing and drainage",
        "Ventilation, extraction and air conditioning",
        "Restoration of the façade, shopfront and shutters",
        "Adaptation to accessibility and fire protection",
        "Building permit and activity licence",
      ],
      capacidades: [
        {
          codigo: "01",
          titulo: "Survey and structure",
          metrica: "Test openings · Reinforcement",
          resumen: "Assessment of the real condition and reinforcement of floors, beams and load-bearing walls.",
          puntos: ["Technical report up front", "Solutions compatible with the building"],
        },
        {
          codigo: "02",
          titulo: "Damp and drainage",
          metrica: "Cause · Treatment",
          resumen: "Removal of damp caused by capillary action, leaks or condensation.",
          puntos: ["Barriers and drainage", "Breathable finishes"],
        },
        {
          codigo: "03",
          titulo: "Façades and heritage",
          metrica: "Restoration",
          resumen: "Restoration of façades, joinery and protected features in line with municipal regulations.",
          puntos: ["Coordination with heritage authorities", "Traditional materials"],
        },
        {
          codigo: "04",
          titulo: "Adaptation to the activity",
          metrica: "Licence · Accessibility",
          resumen: "The premises are left ready for the new activity, with the licence obtained.",
          puntos: ["Accessibility and adapted toilets", "Ventilation and extraction"],
        },
      ],
      processHeadline: "How we restore commercial premises",
      faqs: [
        {
          q: "What does the initial survey include?",
          a: "A technical visit with test openings in floors, ceilings and walls, a review of the structure, damp and installations, and a report with the work required and its cost.",
        },
        {
          q: "Can you work on premises with a protected façade?",
          a: "Yes. We restore façades and protected features following the conditions set by municipal and heritage regulations, and we obtain the necessary permits.",
        },
        {
          q: "Are the premises left ready to open?",
          a: "Yes. We adapt them to the intended activity in terms of accessibility, fire protection and ventilation, and we obtain the activity licence.",
        },
        {
          q: "How long does it take to restore commercial premises?",
          a: "It depends on the condition and the floor area. After the survey we provide a phased schedule with a fixed timeline.",
        },
      ],
    },
  },

  "carpinteria-metalica": {
    keyword: "metalwork and aluminium joinery",
    content:
      "<p>We design, manufacture and install made-to-measure metalwork: thermally broken aluminium windows and sliding doors, terrace enclosures, doors, railings, screens and light steel structures.</p>",
    landing: {
      lead: "Metalwork in Madrid: aluminium windows and sliding doors, enclosures, doors, railings, screens and steel structures made to measure and installed by our team, measured on site and neatly finished.",
      supportContent:
        "We work with aluminium systems from recognised manufacturers and with trusted metalwork shops. We measure on site, choose profiles, glazing and hardware according to use and orientation, and coordinate installation with the building work and finishes so every junction is clean.",
      commitments: [
        { title: "Measured on site", text: "Every opening measured and set out before manufacture." },
        { title: "Quality systems", text: "Thermally broken profiles and the right glazing." },
        { title: "Our own installers", text: "Fitting, sealing and finishing by the same team." },
      ],
      problems: [
        {
          avoid: "Windows that let in air, water or noise.",
          promise: "Systems tested for air permeability, watertightness and wind, with a sealed installation.",
        },
        {
          avoid: "Profiles and glazing chosen on price alone.",
          promise: "Chosen according to orientation, building height and thermal and acoustic requirements.",
        },
        {
          avoid: "Junctions with the building work left badly finished.",
          promise: "Coordination with the building work, sub-frames and interior finishes.",
        },
      ],
      includes: [
        "Thermally broken aluminium windows and French windows",
        "Lift-and-slide and large-format sliding doors",
        "Terrace and porch enclosures",
        "Entrance doors, gates and garage doors",
        "Steel, glass and aluminium railings",
        "Screens, louvres and solar shading",
        "Staircases and light steel structures",
        "Window replacement in occupied buildings",
      ],
      capacidades: [
        {
          codigo: "01",
          titulo: "Aluminium",
          metrica: "Thermal break",
          resumen: "Windows, sliding doors and enclosures with high-performance systems.",
          puntos: ["Concealed sashes and slim profiles", "Powder-coated and anodised finishes"],
        },
        {
          codigo: "02",
          titulo: "Steel and metalwork",
          metrica: "Made to measure",
          resumen: "Railings, staircases, doors, gates and light structures.",
          puntos: ["Welding and galvanising", "Designed with the interiors"],
        },
        {
          codigo: "03",
          titulo: "Glass",
          metrica: "Thermal · Acoustic · Safety",
          resumen: "Low-emissivity, solar control, laminated and acoustic glass to suit each opening.",
          puntos: ["Double and triple glazing", "Safety glass"],
        },
        {
          codigo: "04",
          titulo: "Installation",
          metrica: "Sealing and finishing",
          resumen: "Fitting with sub-frame, perimeter sealing and interior and exterior finishing.",
          puntos: ["Coordination with the building work", "Final adjustment and check"],
        },
      ],
      processHeadline: "How we handle metalwork",
      faqs: [
        {
          q: "Aluminium or PVC?",
          a: "Both insulate well if the system is good quality. Thermally broken aluminium allows slimmer profiles and larger sizes; we recommend one or the other according to the opening, the design and the budget.",
        },
        {
          q: "Can you replace the windows while the home is occupied?",
          a: "Yes. We replace the windows room by room, usually one day per opening, protecting the interior and removing the old units.",
        },
        {
          q: "Do you make bespoke steel pieces?",
          a: "Yes. Railings, staircases, doors, screens and light structures designed with the project and made in the workshop.",
        },
        {
          q: "Do I need a permit to replace my windows?",
          a: "In many cases a notification to the council is enough, but on protected façades or if the external appearance changes you may need approval from the residents' association and a permit. We check this before starting.",
        },
      ],
    },
  },

  "ventanas-acusticas": {
    keyword: "acoustic windows",
    content:
      "<p>We install acoustic windows that noticeably reduce outside noise: high-performance profiles, acoustic laminated glass with asymmetric cavities, insulated shutter boxes and a fully sealed installation.</p>",
    landing: {
      lead: "Acoustic windows in Madrid: high-insulation window systems with acoustic laminated glass, asymmetric cavities, insulated shutter boxes and a sealed installation, for homes, offices and hotels exposed to noise.",
      supportContent:
        "A window's sound insulation depends on the whole assembly: profile, glass, seals, shutter box and, above all, the installation. We measure the noise, analyse where it comes from and propose the combination that achieves the improvement you need, without over-specifying.",
      commitments: [
        { title: "Noise study", text: "Analysis of the source and level before proposing a solution." },
        { title: "Complete system", text: "Profile, glass, shutter box and seals designed together." },
        { title: "Sealed installation", text: "No weak points for noise to get through." },
      ],
      problems: [
        {
          avoid: "Replacing the windows and still hearing the street.",
          promise: "Acoustic laminated glass and asymmetric cavities chosen for the type of noise.",
        },
        {
          avoid: "The shutter box as the main way noise gets in.",
          promise: "Insulated shutter boxes or box-free solutions built into the window.",
        },
        {
          avoid: "Installations with gaps around the frame.",
          promise: "Perimeter sealing with acoustic foams and tapes, and a final check.",
        },
      ],
      includes: [
        "Study of outside noise and façade exposure",
        "Aluminium or PVC windows with high acoustic performance",
        "Acoustic laminated glass with asymmetric cavities",
        "Insulated shutter boxes or box-free systems",
        "Secondary glazing for very high requirements",
        "Acoustic trickle vents to meet ventilation rules",
        "Installation with acoustic perimeter sealing",
        "Removal and disposal of the old windows",
      ],
      capacidades: [
        {
          codigo: "01",
          titulo: "Acoustic diagnosis",
          metrica: "Noise source",
          resumen: "We identify whether the noise comes from traffic, nightlife or aircraft, because each is insulated differently.",
          puntos: ["Review of the façade and openings", "Defined improvement target"],
        },
        {
          codigo: "02",
          titulo: "Acoustic glass",
          metrica: "Laminated · Asymmetric cavities",
          resumen: "Glass with acoustic interlayers and different thicknesses to avoid resonance.",
          puntos: ["Can be combined with solar control", "Safety included"],
        },
        {
          codigo: "03",
          titulo: "Window frames",
          metrica: "Seals · Locking",
          resumen: "Profiles with several seals and perimeter locking that guarantee airtightness.",
          puntos: ["Aluminium or PVC", "Casement or tilt-and-turn sashes"],
        },
        {
          codigo: "04",
          titulo: "Installation",
          metrica: "Acoustic sealing",
          resumen: "Fitting with no sound bridges around the perimeter, the shutter box or the sill.",
          puntos: ["Specialist tapes and foams", "Final test"],
        },
      ],
      processHeadline: "How we install acoustic windows",
      faqs: [
        {
          q: "How much noise does an acoustic window cut out?",
          a: "It depends on the glass, the frame and the installation. A good acoustic window can reduce perceived noise to less than half compared with an old window; we set the target after analysing the noise on your façade.",
        },
        {
          q: "Is replacing just the glass enough?",
          a: "Sometimes it helps, but if the frame does not close properly or the shutter box is not insulated, noise will keep getting in that way. We review the whole assembly before making a recommendation.",
        },
        {
          q: "What about ventilation if the windows seal so well?",
          a: "It can be solved with acoustic trickle vents or mechanical ventilation, so the home is ventilated without opening the windows.",
        },
        {
          q: "Are they suitable for hotels and offices?",
          a: "Yes. We install them in hotel rooms, offices and meeting rooms on busy streets or in nightlife areas.",
        },
      ],
    },
  },

  "cabinas-acusticas-oficinas": {
    keyword: "office acoustic pods",
    content:
      "<p>We design and install acoustic pods for offices: single-person pods for calls, two-to-four-person pods for meetings and bespoke rooms, with insulation, ventilation, lighting and power built in.</p>",
    landing: {
      lead: "Office acoustic pods in Madrid: pods for calls and video calls, small meeting rooms and focus spaces in open-plan offices, with insulation, ventilation, lighting and power built in, installed with no building work.",
      supportContent:
        "In an open-plan office, calls and impromptu meetings are the main source of noise. We look at how the team works to decide how many pods are needed, what size and where, and integrate them with the office's air conditioning, power and look.",
      commitments: [
        { title: "No building work", text: "Quick installation without stopping work in the office." },
        { title: "Fully integrated", text: "Power, ventilation and data connected." },
        { title: "Made to measure", text: "Sizes, finishes and colours to suit the office." },
      ],
      problems: [
        {
          avoid: "Calls and video calls that interrupt the rest of the team.",
          promise: "Single-person pods with enough insulation to talk normally.",
        },
        {
          avoid: "Stuffy pods that nobody wants to use.",
          promise: "Quiet forced ventilation that continuously renews the air.",
        },
        {
          avoid: "Too few meeting rooms, always booked.",
          promise: "Two-to-four-person pods and modular rooms for short meetings.",
        },
      ],
      includes: [
        "Needs study and location on the floor plan",
        "Single-person pods for calls and video calls",
        "Two-to-four-person pods for meetings",
        "Bespoke modular acoustic rooms",
        "Quiet ventilation and dimmable lighting",
        "Power, USB and data network",
        "Finishes, upholstery and corporate colours",
        "Installation, moving and relocation",
      ],
      capacidades: [
        {
          codigo: "01",
          titulo: "Acoustic insulation",
          metrica: "Panels · Laminated glass",
          resumen: "Enclosures and doors designed to keep conversations private.",
          puntos: ["Interior absorption that prevents echo", "Doors with airtight closing"],
        },
        {
          codigo: "02",
          titulo: "Interior comfort",
          metrica: "Ventilation · Light",
          resumen: "Quiet air renewal, dimmable lighting and presence detection.",
          puntos: ["Comfortable temperature", "Automatic switch-on"],
        },
        {
          codigo: "03",
          titulo: "Integration",
          metrica: "Power · Data",
          resumen: "Connection to the office's power and data networks, and adaptation to fire protection.",
          puntos: ["Built-in sockets and USB", "Coordination with the building"],
        },
        {
          codigo: "04",
          titulo: "Design",
          metrica: "Bespoke finishes",
          resumen: "Sizes, materials and colours that match the company's image.",
          puntos: ["Interior furniture included", "Accessible options"],
        },
      ],
      processHeadline: "How we install acoustic pods in offices",
      faqs: [
        {
          q: "Do they need building work or a permit?",
          a: "Usually not. They are modular units that are assembled in a few hours and plug into a socket. We check how they fit with the building's fire protection and air conditioning.",
        },
        {
          q: "How many pods does my office need?",
          a: "It depends on the number of people, how many calls and video calls they make and the number of meeting rooms available. We work it out with the team before making a proposal.",
        },
        {
          q: "Can they be moved if we change offices?",
          a: "Yes. They can be taken apart and reassembled in the new location without losing performance.",
        },
        {
          q: "Do you build bespoke acoustic rooms as well as pods?",
          a: "Yes. We design bespoke acoustic meeting rooms and offices as part of complete office renovations.",
        },
      ],
    },
  },

  "concierge-familias-extranjeras": {
    keyword: "property concierge for international families",
    content:
      "<p>A single point of contact for families who want to live in Madrid without being here during the process: finding the home, support with the purchase through partner lawyers and agents, design, permits, renovation, interiors and handover ready to move in, with online tracking of every stage.</p>",
    landing: {
      lead: "Property concierge for international families in Madrid: we support you from finding and buying the home to its renovation, interior design and handover ready to move in, with a single point of contact and online tracking of the whole process.",
      supportContent:
        "Moving to another country is hard enough. We make sure the house is not one more thing to worry about: we view properties for you, assess their technical condition before you buy, coordinate the purchase with partner lawyers and agents, and design and carry out the renovation while you follow progress through video calls, photos and weekly reports.",
      statsTitle: "International families with ALKO",
      problemsHeadline: "Your home in Madrid, managed from wherever you are",
      capacidadesHeadline: "What we do for your family",
      commitments: [
        { title: "One point of contact", text: "From the search to handing over the keys." },
        { title: "Fully remote", text: "Video viewings, digital signatures and weekly reports." },
        { title: "Ready to move in", text: "Renovation, furniture and utilities connected." },
      ],
      problems: [
        {
          avoid: "Buying a home without knowing what work it needs or what it will cost.",
          promise: "Technical report and an indicative renovation quote before you sign the purchase.",
        },
        {
          avoid: "Managing agents, notaries, trades and suppliers separately from another country.",
          promise: "A single coordinator in Madrid, in your language, with a network of partner lawyers and agents.",
        },
        {
          avoid: "Arriving in Madrid to find the house unfinished.",
          promise: "Fixed schedule for purchase, works and handover, with online tracking of every milestone.",
        },
      ],
      includesSubtitle: "What the concierge service includes",
      includes: [
        "Home search by area, schools, budget and lifestyle",
        "Video viewings and a technical report on the property's condition",
        "Coordination of the purchase with partner lawyers, agents and notary",
        "Renovation and interior design project presented online",
        "Building permits and council procedures",
        "Renovation works with weekly progress reports",
        "Furniture, equipment and utility connections",
        "Handover ready to move in and after-sales service",
      ],
      capacidades: [
        {
          codigo: "01",
          titulo: "Search and assessment",
          metrica: "Before you buy",
          resumen: "We shortlist properties and check their technical condition, structure and services before you decide.",
          puntos: ["Technical report for each home", "Renovation cost estimate"],
        },
        {
          codigo: "02",
          titulo: "Supported purchase",
          metrica: "Partner network",
          resumen: "We coordinate the transaction with partner lawyers, agents and notary, who handle the legal and tax side.",
          puntos: ["Tracking of deadlines and signatures", "Communication in your language"],
        },
        {
          codigo: "03",
          titulo: "Design and renovation",
          metrica: "Managed remotely",
          resumen: "Design, permits and works led by a building surveyor, with online tracking.",
          puntos: ["Presentations and approvals by video", "Weekly reports with photos"],
        },
        {
          codigo: "04",
          titulo: "Arrival",
          metrica: "Turnkey",
          resumen: "Furniture, equipment, utilities and a final clean so you can move in from day one.",
          puntos: ["Home automation and connectivity ready", "After-sales support"],
        },
      ],
      processHeadline: "How we support a family moving to Madrid",
      faqs: [
        {
          q: "Can I do the whole process without travelling to Madrid?",
          a: "Yes. Viewings are done by video call, documents are signed digitally or through a power of attorney, and you follow the works through weekly reports, photos and online meetings.",
        },
        {
          q: "Do you handle the legal and tax side of the purchase?",
          a: "We coordinate it with partner lawyers, agents and notary, who are the ones who advise on legal and tax matters. We make sure everything moves forward on time and that the property is technically sound.",
        },
        {
          q: "Which languages do you work in?",
          a: "We work in Spanish and English, and arrange translation with our partners when another language is needed.",
        },
        {
          q: "How long is it from the search to moving in?",
          a: "It depends on the market and on the work the home needs. After the purchase we provide a fixed renovation schedule with the handover date.",
        },
      ],
    },
  },

  "implantacion-de-empresas": {
    keyword: "international company set-up",
    content:
      "<p>We support international companies opening a base in Madrid: finding and technically assessing the premises or office, opening and activity licence, design, renovation and turnkey set-up, and coordination with partner tax and legal advisers.</p>",
    landing: {
      lead: "Set-up of international company offices in Madrid: finding the premises or office, technical assessment, activity licence, design, renovation and turnkey set-up, with a single point of contact and coordination with tax and legal advisers.",
      supportContent:
        "Opening an office in another country means property, technical, administrative and tax decisions all at once. We act as the company's local team: we find the right space, check the activity is viable before you sign, obtain the licence and carry out the set-up, while our partners take care of incorporation, tax and contracts.",
      statsTitle: "International companies with ALKO",
      problemsHeadline: "Your Madrid office, ready to operate",
      capacidadesHeadline: "What we do for your company",
      commitments: [
        { title: "Viability before signing", text: "We check permitted use, licence and works before the contract." },
        { title: "Licence included", text: "Activity project and opening licence handled by us." },
        { title: "Opening date", text: "Fixed schedule for works and set-up." },
      ],
      problems: [
        {
          avoid: "Signing a lease on premises where the activity is not viable.",
          promise: "Report on planning compatibility, licence and required works before signing.",
        },
        {
          avoid: "Coordinating agents, engineers, contractors and advisers from abroad.",
          promise: "A single local point of contact with a network of partner tax and legal advisers.",
        },
        {
          avoid: "Opening delays caused by badly planned licences and works.",
          promise: "Licence, works and set-up planned in parallel with a fixed opening date.",
        },
      ],
      includesSubtitle: "What setting up your office includes",
      includes: [
        "Search for offices, premises or industrial units according to the activity and headcount",
        "Planning and technical viability report before signing",
        "Opening and activity licence",
        "Fit-out design and corporate branding",
        "Renovation, building services and fire protection",
        "Furniture, technology, cabling and workstations",
        "Coordination with partner tax, legal and employment advisers",
        "Maintenance and after-sales service after opening",
      ],
      capacidades: [
        {
          codigo: "01",
          titulo: "Search and viability",
          metrica: "Before signing",
          resumen: "We shortlist spaces and check the permitted use, the licence and the works required.",
          puntos: ["Report for each property", "Timeline and cost estimate"],
        },
        {
          codigo: "02",
          titulo: "Licences",
          metrica: "Opening · Activity",
          resumen: "Technical design and licence processing with the council or accredited bodies.",
          puntos: ["Accessibility and fire safety", "Tracking of the application"],
        },
        {
          codigo: "03",
          titulo: "Turnkey set-up",
          metrica: "Design · Works · Equipment",
          resumen: "Workplace design, works, building services, furniture and technology.",
          puntos: ["The company's corporate standards", "Fixed opening date"],
        },
        {
          codigo: "04",
          titulo: "Local coordination",
          metrica: "Partner network",
          resumen: "Liaison with tax, legal and employment advisers for incorporation and operations in Spain.",
          puntos: ["A single point of contact", "Communication in English"],
        },
      ],
      processHeadline: "How we set up a company's office in Madrid",
      faqs: [
        {
          q: "Do you help us find the office or premises?",
          a: "Yes. We search for spaces according to the activity, the headcount and the preferred location, and assess each option technically before you sign.",
        },
        {
          q: "Do you handle tax matters and the incorporation of the company?",
          a: "We coordinate them with partner tax, legal and employment advisers, who provide that advice. We build their timelines into the set-up schedule.",
        },
        {
          q: "Can you apply our corporate standards?",
          a: "Yes. We adapt the group's brand guidelines and technical standards to Spanish regulations and local suppliers.",
        },
        {
          q: "How long does it take to open the office?",
          a: "It depends on the property, the licence and the works. After the viability report we provide a schedule with the opening date.",
        },
      ],
    },
  },
};

/** Campos de imagen de la landing: se conservan del panel en los dos idiomas. */
const IMAGE_FIELDS = ["includesImage", "supportImage", "ctaImage", "resultsImages"] as const;

/**
 * El servicio en el idioma de la página, con su frase de búsqueda (`keyword`). En inglés, los textos
 * salen de SERVICE_CONTENT_EN y de SERVICES_EN, y del panel solo se toman las imágenes.
 */
export function localizeSector(sector: Sector, locale: Locale): Sector & { keyword: string } {
  if (locale === "es") return { ...sector, keyword: sectorKeyword(sector) };
  const slug = sectorSlug(sector.slug);
  const names = SERVICES_EN[slug];
  const content = SERVICE_CONTENT_EN[slug];
  const images = Object.fromEntries(
    IMAGE_FIELDS.filter((key) => sector.landing?.[key] !== undefined).map((key) => [key, sector.landing?.[key]]),
  ) as Pick<SectorLandingData, (typeof IMAGE_FIELDS)[number]>;
  return {
    ...sector,
    title: names?.title ?? sector.title,
    descripcion: names?.description ?? sector.descripcion,
    content: content?.content ?? sector.content,
    landing: { ...images, ...content?.landing },
    keyword: content?.keyword ?? (names?.title ?? sector.title).toLowerCase(),
  };
}
