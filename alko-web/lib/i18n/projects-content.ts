import type { Locale } from "@/lib/i18n";
import { localizeProject } from "@/lib/i18n/project-text";
import type { Project } from "@/lib/types";

/**
 * Contenido en inglés de las fichas de proyecto (/en/projects/[slug]).
 *
 * Los proyectos se editan en el panel solo en castellano. Esta es la traducción de sus textos, copiada
 * de lo que había en el panel el 2026-11-19. Si se cambia un texto en el panel, hay que actualizar aquí
 * su versión inglesa: la ficha inglesa no muestra textos del panel que no estén traducidos aquí.
 */
export interface ProjectContentEn {
  reto?: string;
  solucion?: string;
  resultado?: string;
  /** Memoria en HTML (el campo «contenido» del panel), si el proyecto la tiene. */
  content?: string;
}

export const PROJECT_CONTENT_EN: Record<string, ProjectContentEn> = {
  "reforma-piso-plaza-de-castilla": {
    reto: "The main goal was to maximise natural light and remove the excessive compartmentalisation of the original home. The aim was to bring the living areas (living room, dining room and kitchen) together into one fluid space, keeping the functional identity of each area and achieving a minimalist, timeless look that still felt warm.",
    solucion:
      "The dividing partitions were taken down to create an open-plan layout. To mark out the spaces visually without physical barriers, the flooring changes: light oak in the living areas and large-format grey ceramic tiles in the kitchen. Made-to-measure furniture with plain white lacquered panels was installed, integrating the appliances and maximising floor-to-ceiling storage. The lighting combines technical spotlights, perimeter LED strips in recessed coves and decorative designer fittings, such as the black articulated lamp in the living room and the globe pendants over the island.",
    resultado:
      "The client received a versatile and very bright home, organised around an impressive solid-wood central island that acts as the social hub of the house. The transitions between the living room (furnished in a Nordic-inspired style), the dining room and the kitchen are completely fluid, striking a perfect balance between clean design, visual spaciousness and everyday comfort.",
  },
  "reforma-majadahonda": {
    reto: "The main goal of this project was to completely modernise an existing structure to suit a contemporary lifestyle, removing traditional visual and architectural barriers. The biggest challenge was to connect the living areas seamlessly with the outdoor pool area, ensuring spatial continuity. The project also called for cool, industrial materials such as exposed concrete, without sacrificing the warmth, brightness and comfort of a family home.",
    solucion:
      "The floor plan was completely reconfigured to create an open-plan layout. In the kitchen, large windows and a big central island with white worktops were installed, leading the eye out to the garden and the pool. In the living and dining area, exposed concrete walls bring a strong industrial character, set against light wooden floors and a modern glass-fronted gas fireplace. The bathrooms use microcement and seamless grey finishes, concealed taps and minimalist glass screens. Finally, the outside was fitted with treated timber decking, creating several relaxation areas and an outdoor dining space next to the geometric pool.",
    resultado:
      "The result is a luxury home that stands out for its spaciousness, light and contemporary design. The owners now have a home where the boundary between inside and outside practically disappears, making the most of the space for entertaining and relaxing. The careful choice of premium materials, from the high-gloss furniture finishes to the natural stone and concrete, ensures a timeless look and exceptional long-term durability.",
  },
  "reforma-columela": {
    reto: "A flat in a classic building on Calle Columela, in the Salamanca district, with a compartmentalised layout and worn-out installations. The client wanted an open, bright and up-to-date home, without giving up the original features of value, such as the wooden front door with its wrought-iron transom.",
    solucion:
      "The home was reorganised to bring the kitchen into the living area, with a white quartz island and a wall of grey tall units that conceals appliances and storage. Continuous oak flooring was laid throughout, with false ceilings, recessed lighting and linear light lines, and ducted air conditioning with integrated grilles. The internal doors were made flush with the walls, in white. The original front door was restored. The bathroom and the guest toilet combine large-format porcelain tiles with wall-hung sanitaryware, a glass shower screen and a countertop basin on a wooden vanity unit.",
    resultado:
      "An open, bright home with clean lines and warm materials, which keeps the building's original entrance as a nod to its history. The kitchen becomes the centre of the living area and the whole house gains in comfort, efficiency and order.",
  },
  "reforma-pt9": {
    reto: "A home in a residential building in Madrid with a layout and finishes from another era: worn floorboards, dark wooden wardrobes, an outdated bathroom and a kitchen that did not suit the way the client lives. The brief was to transform it completely into a warm, contemporary house with plenty of made-to-measure storage.",
    solucion:
      "The home was stripped out and rebuilt from the base, with a new acoustic underlay and herringbone wood flooring. The kitchen was opened up with a large island with a light worktop, an undermount sink, dark green and wood units, and pendant lights. In the living room, a made-to-measure unit was designed to integrate the fireplace, the television and floor-to-ceiling bookshelves. The main bathroom features large-format porcelain tiles, a double-basin worktop on a fluted wooden vanity, black taps and a spacious walk-in shower with a glass screen and a niche. The dressing room, wardrobes and shelving were all made to measure.",
    resultado:
      "A completely new home, with fine materials and warm tones, where wood, stone and deep green sit alongside clean lines. The made-to-measure storage brings order to every room and the open kitchen becomes the heart of the house.",
  },
  "reforma-castello": {
    reto: "A flat in a classic building on Calle Castelló, in the Salamanca district, with a compartmentalised layout that wasted the light from its large windows. The aim was to turn it into an open, bright home with clean lines, worthy of the building and its surroundings.",
    solucion:
      "The living area was opened up into one large open-plan space joining the living room, dining room and kitchen, with herringbone wood flooring throughout and false ceilings with recessed spotlights and indirect light lines. The kitchen was organised around a white island with an undermount hob and sink, and a wall of lacquered tall units integrating appliances and storage. The bedrooms have made-to-measure walk-in wardrobes, and the bathrooms combine light finishes, glass screens, wall-hung sanitaryware and thermostatic taps.",
    resultado:
      "An open home full of light, where the herringbone wood and white create a warm, timeless backdrop. A full renovation that makes the most of the natural light and the quality of the building.",
  },
  "reforma-piso-juan-montalvo": {
    reto: "The main challenge of this project was to transform a traditional home into a contemporary space that maximised visual spaciousness and natural light. The client wanted a complete upgrade of the installations and finishes, with integrated storage solutions that would not crowd the space. It was essential to create highly practical wet areas (bathrooms and kitchen) with a sophisticated, timeless design, adapting the layout to the comfort and efficiency needs of modern life.",
    solucion:
      "To boost the brightness, a palette of whites and soft tones was used on the walls and joinery, contrasted with warm wood-effect flooring in the bedrooms and hallways. Made-to-measure floor-to-ceiling fitted wardrobes with plain sliding fronts were built to provide storage invisibly.",
    resultado:
      "The result is a completely revitalised home that conveys elegance, spaciousness and visual clarity. The careful choice of materials strikes a perfect balance between the warmth of the laminate floors and the sophistication of the porcelain finishes. The client received a turnkey home, more energy-efficient, with impeccable finishes and a bright atmosphere ready to enjoy from day one.",
  },
  "reforma-cristobal-bordiu": {
    reto: "A classic home on Calle Cristóbal Bordiu, in Chamberí, that needed bringing up to date without losing its character. The aim was to renew the installations, floors and bathrooms while keeping the elegance of the mouldings and traditional joinery, and to solve the lack of light in the hallways.",
    solucion:
      "The ceiling mouldings were restored and completed, and panelled skirting was added in the main rooms. The hallway was lit with indirect light in the cornice and floor-level marker lights, over continuous natural wood flooring. The classic-style fitted wardrobes were restored and lacquered in ivory. The bathrooms feature textured large-format porcelain tiles, a square rain shower with concealed thermostatic taps, a wall-hung basin with wall-mounted taps and a backlit mirror.",
    resultado:
      "A bright, serene home that keeps the building's classic language with up-to-date installations and finishes. The indirect light gives depth to the hallway, the mouldings restore the presence of the rooms and the bathrooms gain in comfort with a clean, timeless design.",
  },
  "reforma-el-boalo": {
    reto: "A detached house in El Boalo, in the heart of the Madrid mountains, with a brick and stone façade and a slate roof, which needed a complete renovation inside and out: roof waterproofing, outdoor areas, windows and doors, and interiors that had become dated. The challenge was to update it while keeping its mountain-house character.",
    solucion:
      "Outside, the flat roof was waterproofed with a bituminous membrane, the surrounding terrace was rebuilt with new paving and a black security front door was fitted to match the new windows. Inside, the living area was opened up into one large space with large-format porcelain flooring and ceilings with indirect linear lighting. The kitchen combines wooden fronts, a tall unit with built-in ovens and a dark stone peninsula with a solid-wood breakfast bar. The bathrooms feature marble-effect porcelain, flush shower trays with glass screens, wooden vanity units, backlit mirrors and plain floor-to-ceiling wooden doors.",
    resultado:
      "A bright, warm house open to the mountain landscape, which keeps the stone and brick of its façade and adds contemporary interiors in wood and light tones. A home renovated from top to bottom, with a protected envelope and ready to enjoy all year round.",
  },
  "reforma-luchana": {
    reto: "A home on Calle Luchana, in Chamberí, with a closed kitchen, old installations and rooms that needed a complete renovation. The aim was to gain space and light, and to leave a practical, easy-to-maintain house that was ready to move into.",
    solucion:
      "The kitchen was opened up and organised around an island with an induction hob and a suspended steel extractor hood, with high-gloss white units, a black worktop and a tall unit of integrated appliances. The hallway was laid with natural wood flooring and the internal doors and fitted wardrobes were renewed in white. The bedrooms keep their column radiators, and the bathroom was completely rebuilt with porcelain tiling, a bath with a screen, a white vanity unit and a large mirror.",
    resultado:
      "A bright, orderly home, with a spacious kitchen that becomes the heart of the house, clean rooms in light tones and an up-to-date bathroom. A full renovation handed over ready to move into.",
  },
  "reforma-alicante": {
    reto: "The main goal of this project was to modernise and reconfigure a 90 m² home with an originally compartmentalised layout. The client wanted to maximise spaciousness and natural light, bringing the kitchen into the living area to encourage a more open and sociable lifestyle. The bathroom also had to be turned into a space for relaxation and luxury, overcoming its spatial limitations with innovative design solutions and a strategic use of lighting.",
    solucion:
      "To bring the spaces together, an open kitchen was designed around a multifunctional peninsula. Made-to-measure furniture with clean lines in matt white was installed, with handleless fronts to keep the minimalist look. The splashback and the worktop were unified in a highly durable porcelain material with an elegant Calacatta marble-effect finish. A strong visual contrast was created with matt black elements, such as the taps, the integrated appliances and the suspended technical lighting track.",
    resultado:
      "The result is a completely revitalised home that exudes modernity, spaciousness and understated luxury. The kitchen has become an aesthetically impeccable and highly functional meeting point, flowing naturally into the rest of the home. The bathroom, meanwhile, stands out as a cutting-edge design piece, offering a unique sensory experience. Meticulous execution, combined with premium finishes and carefully planned lighting, has given these 90 m² an exclusive and timeless character.",
  },
  "reforma-integral-de-cocina": {
    reto: "The main goal was to transform a tight kitchen into an open, bright space without losing the room's independence. The aim was to connect the kitchen visually with the adjoining living area to encourage interaction and improve the flow of natural light, while keeping an effective barrier against noise and cooking smells.",
    solucion:
      "To achieve this, a galley layout was designed with a glass partition above a peninsula facing the living area. The furniture design features clean, handleless lines, combining gloss white base units that reflect the light with wall units in a dark stone or oxide-textured finish for character and depth. A white marble-effect splashback and a continuous dark worktop were installed. To keep the view clear of hanging obstacles, a state-of-the-art hob with built-in downdraft extraction was fitted, along with a tall oven and fridge unit optimised along the side wall.",
    resultado:
      "The client received a cutting-edge kitchen that is highly functional and easy to maintain. The combination of glass, contrasting textures and indirect lighting, with LED strips under the wall units and decorative pendant lamps, created a sophisticated atmosphere that blends elegantly and seamlessly with the rest of the home.",
  },
  "reforma-hermosilla": {
    reto: "A home on Calle Hermosilla, in the Salamanca district, with dated and impractical bathrooms. The client wanted them completely renovated with a calm, up-to-date design that was easy to clean and designed for everyday use.",
    solucion:
      "Both bathrooms were tiled from floor to ceiling in light grey large-format porcelain, matching the floor. One has a flush shower tray with a glass screen and thermostatic taps, and the other a bath clad in the same material. Both were completed with wall-hung natural wood vanity units, white worktops, softly curved sanitaryware, a large mirror, a heated towel rail and recessed lighting.",
    resultado:
      "Two bright bathrooms with clean lines, where the light grey porcelain and the warmth of the wood create a timeless, comfortable and easy-to-maintain whole.",
  },
  "reforma-francisco-lozano": {
    reto: "A home on Calle Francisco Lozano, in Argüelles, with dated bathrooms and dark hallways. The client wanted to renovate the house with warm finishes and give each bathroom its own character, more comfortable and easier to maintain.",
    solucion:
      "The main bathroom was designed around a whirlpool bath and a feature wall in oxidised-stone-effect cladding, combined with light porcelain and wood-effect flooring. The second bathroom has a flush shower tray, a glass screen, a compact basin on a dark wood unit and a mirror with integrated lighting. The hallway was renovated with light wood flooring, white lacquered doors and recessed ceiling spotlights.",
    resultado:
      "A warm, bright home with two completely renovated bathrooms that gain in comfort and personality, and clean, well-lit hallways.",
  },
  "reforma-alicante-2": {},
  "reforma-pedro-teixeira": {
    reto: "A project on Calle Pedro Teixeira, in Tetuán, where the aim was to give the hallways an elegant, contemporary look, with carefully designed lighting and integrated storage that would not reduce the sense of space.",
    solucion:
      "The hallway features large framed panels backlit with perimeter LED strips, large mirrors that visually double the space, a built-in wooden bench and recessed ceiling spotlights over continuous light-toned flooring. The fitted wardrobes were clad in dark wood fronts with a horizontal grain, matching the internal doors.",
    resultado:
      "Understated, welcoming spaces where indirect light and the contrast between dark wood and light tones create a warm atmosphere with clean lines.",
  },
  "reforma-hilarion-eslava": {
    reto: "A bathroom in a home on Calle Hilarión Eslava, in Chamberí, which the client wanted to turn into a space with personality, without losing light or space and keeping continuity with the wooden floor in the rest of the house.",
    solucion:
      "The shower area was clad in petrol-green glazed tiles laid in a herringbone pattern, with a built-in niche under the window, a flush shower tray and a fixed glass screen. The brushed gold taps and shower head are repeated on the countertop basin, the wall spout and the round mirror. The rest of the bathroom was left white, with a floating worktop, softly curved wall-hung sanitaryware and herringbone wood flooring.",
    resultado:
      "A bathroom with its own character, where the intense green of the tiles, the gold of the taps and the light wood of the floor create an elegant, warm whole.",
  },
};

/** Tipologías del panel en inglés (la ficha muestra la tipología completa, no la categoría del filtro). */
const TYPOLOGIES_EN: Record<string, string> = {
  "vivienda unifamiliar": "Detached house",
  "residencial (vivienda unifamiliar)": "Residential (detached house)",
  "reforma integral residencial": "Full residential renovation",
  "reforma integral de vivienda unifamiliar": "Full renovation of a detached house",
  "reforma integral de cocina": "Full kitchen renovation",
  "reforma de baños": "Bathroom renovation",
  "reforma de baño": "Bathroom renovation",
  "reforma residencial": "Residential renovation",
  residencial: "Residential",
};

/** Clientes del panel en inglés. */
const CLIENTS_EN: Record<string, string> = {
  "cliente particular": "Private client",
  "privado / residencial": "Private / Residential",
};

const key = (text: string) => text.trim().replace(/\.+$/, "").toLowerCase();

/**
 * El proyecto completo en el idioma de la ficha. En inglés: título, ubicación y plazo traducidos
 * (localizeProject), tipología y cliente de las tablas de arriba, y relato de PROJECT_CONTENT_EN. Los
 * textos del panel sin traducción (memoria, partidas, materiales, cifras, reseña y llamada final) se
 * vacían para no mezclar idiomas; la ficha usa entonces sus textos por defecto o no muestra el bloque.
 */
export function localizeProjectDetail(project: Project, locale: Locale): Project {
  if (locale === "es") return project;
  const base = localizeProject(project, locale, { keepTypology: true });
  const content = PROJECT_CONTENT_EN[project.slug] ?? {};
  const tipologia = project.tipologia?.trim();
  const cliente = project.cliente?.trim();
  return {
    ...base,
    tipologia: tipologia ? TYPOLOGIES_EN[key(tipologia)] ?? base.tipologia : tipologia,
    cliente: cliente ? CLIENTS_EN[key(cliente)] ?? cliente : cliente,
    content: content.content ?? "",
    reto: content.reto ?? "",
    solucion: content.solucion ?? "",
    resultado: content.resultado ?? "",
    alcance: [],
    materiales: [],
    cifras: [],
    resenaTexto: "",
    resenaAutor: "",
    resenaCargo: "",
    ctaTitulo: "",
    ctaTexto: "",
    ctaBoton: "",
  };
}
