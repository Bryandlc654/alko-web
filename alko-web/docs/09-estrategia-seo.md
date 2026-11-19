# 09. Estrategia SEO

Estrategia para posicionar alkoreformas.com. Está escrita como una lista de decisiones: qué página
compite por qué búsqueda, qué se hace en el código, qué se hace en el panel y qué se hace fuera de la web.

Revisión: noviembre de 2026.

---

## 1. Objetivo y a quién buscamos

ALKO vende **reformas integrales y obra en Madrid** (pisos, viviendas unifamiliares, oficinas, locales).
Una persona que busca eso hace tres tipos de búsqueda, y la web tiene que estar en las tres:

| Intención | Ejemplos de búsqueda | Página que compite |
|---|---|---|
| **Contratar** (la que da clientes) | «empresa de reformas Madrid», «reforma integral piso Madrid», «reforma de oficinas Madrid» | Portada y páginas de servicio |
| **Comprobar** (antes de llamar) | «ALKO reformas», «reforma piso Salamanca antes y después» | Proyectos y fichas de obra, Nosotros |
| **Informarse** (semanas antes) | «cuánto cuesta reformar un piso en Madrid», «licencia para reformar un piso en Madrid» | Journal (artículos y guías) |

**Decisión:** el castellano y Madrid son la prioridad absoluta. El inglés solo se amplía donde
el cliente es extranjero (ver punto 6).

## 2. Mapa de palabras clave por página

Una página por búsqueda principal; dos páginas no compiten por la misma.

| Página | Búsqueda principal | Secundarias |
|---|---|---|
| `/` | reformas integrales Madrid / empresa de reformas Madrid | construcción Madrid, presupuesto cerrado |
| `/servicios/residencial` | reformas de viviendas Madrid | reforma integral piso Madrid, reforma de áticos |
| `/servicios/viviendas-unifamiliares` | construcción de viviendas unifamiliares Madrid | reforma chalet Madrid |
| `/servicios/oficinas` | reformas de oficinas Madrid | reforma de oficinas sin parar la actividad |
| `/servicios/retail` | reformas de locales comerciales Madrid | acondicionamiento de locales |
| `/servicios/hospitality` | reformas de hoteles y restaurantes Madrid | reforma de restaurantes |
| `/servicios/restauracion-de-locales` | restauración de locales Madrid | — |
| `/servicios/naves-industriales` | acondicionamiento de naves industriales Madrid | — |
| `/servicios/carpinteria-metalica` | carpintería metálica Madrid | cerramientos de acero y vidrio |
| `/servicios/ventanas-acusticas` | ventanas acústicas Madrid | aislamiento acústico de ventanas |
| `/servicios/cabinas-acusticas-oficinas` | cabinas acústicas para oficinas | phone booth oficina |
| `/servicios/concierge-familias-extranjeras` | (inglés) renovation company Madrid for expats | — |
| `/servicios/implantacion-de-empresas` | (inglés) office fit-out Madrid | — |
| `/proyectos` | proyectos de reformas integrales Madrid | antes y después reformas Madrid |
| `/proyectos/<obra>` | «reforma <tipo> en <barrio>» (cola larga local) | — |
| `/journal` y artículos | búsquedas informativas (punto 4) | — |
| `/contacto` | presupuesto reforma Madrid | — |

**Barrios y municipios.** No se crean páginas «Reformas en Chamberí», «Reformas en Pozuelo»… con el
mismo texto cambiando el nombre: Google las trata como páginas puerta y penaliza. El SEO local se hace
con **fichas de obra reales** (cada una con su barrio en el título) y con Google Business Profile.
Una página de zona solo se crea cuando haya **3 obras o más** en esa zona y algo propio que contar
(normativa municipal, tipología de vivienda de la zona…).

## 3. SEO técnico (hecho en el código)

Ya está en la web:

- **Title, description y canonical en todas las páginas públicas**, con Open Graph completo (nombre del
  sitio, idioma, URL e imagen con su alt) a través de `pageMetadata` (`lib/seo.ts`). Descripciones
  recortadas a 155 caracteres sin cortar palabras (`metaDescription`).
- **Títulos con la búsqueda delante y la marca detrás** (`… en Madrid | ALKO`).
- **Fichas de obra** con tipología y barrio en el título: «Reforma de baños en Barrio de Salamanca,
  Madrid · Hermosilla | ALKO», generado a partir de los datos del panel.
- **Servicios** con H1 de búsqueda («Reformas de viviendas en Madrid»); si el titular del panel solo
  repite el nombre de la división, se usa el de búsqueda.
- **Datos estructurados**: empresa (`GeneralContractor`) con el mismo `@id` en todo el sitio, `WebSite`,
  `FAQPage` en portada y servicios, `Service` en servicios, `CollectionPage` + `ItemList` en proyectos,
  `Article` en el Journal y `BreadcrumbList` en las migas.
- **Listado de proyectos**: todas las obras van en el HTML (antes Google solo veía 6 de 15).
- **Idiomas**: hreflang es/en/x-default en portada y proyectos; sitemap con alternativas.
- **robots.txt** cierra `/admin` y `/api/`; el sitemap incluye servicios, obras, artículos y guías.

Pendiente técnico (por orden):

1. **Imágenes del panel**: se sirven sin optimizar desde `raw.githubusercontent.com` (WebP de 1920 px).
   Es lo que más pesa en el LCP en móvil. Decisión: moverlas a un almacenamiento con CDN
   (Cloudflare R2 / S3 + CloudFront) y servirlas por el optimizador de Next con `sizes` correctos.
2. Medir Core Web Vitals reales en Search Console (informe «Experiencia») una vez haya datos.
3. Fichas de obra: añadir `ImageGallery` en los datos estructurados cuando tengan memoria (punto 5).

## 4. Contenido: plan del Journal

Los artículos actuales son buenos pero muy de nicho (piscina en invierno, climatización industrial).
Faltan las búsquedas informativas que más se repiten **antes de pedir presupuesto**. Orden de escritura
(uno cada dos semanas, 1.200–2.000 palabras, con datos propios de obras de ALKO):

1. Cuánto cuesta una reforma integral de un piso en Madrid (precio por m² por calidades, qué entra y qué no).
2. Licencia o declaración responsable para reformar un piso en Madrid: qué trámite toca y cuánto tarda.
3. Cuánto dura una reforma integral, fase por fase.
4. Precio de reformar un baño en Madrid.
5. Precio de reformar una cocina en Madrid.
6. Reformar un piso antiguo en Madrid: instalaciones, bajantes, forjados y lo que aparece al demoler.
7. Reforma de oficinas: licencia de actividad, plazos y cómo seguir trabajando durante la obra.
8. Presupuesto cerrado frente a presupuesto abierto: cómo comparar ofertas de reforma.

Reglas para cada artículo:
- Enlaza a **una** página de servicio (la que corresponda) y a **una o dos** obras reales.
- El servicio enlazado devuelve el enlace (bloque «Artículos relacionados» o en el texto).
- Fecha visible y actualización anual de los precios (el título lleva el año solo si los precios cambian).

## 5. Contenido en el panel (lo hace el equipo de ALKO)

Es lo que más rinde ahora mismo y no necesita programar:

1. **Memoria de cada obra.** Las 15 fichas no tienen memoria: la descripción que ve Google se genera
   con los datos básicos. Cada obra necesita 150–300 palabras propias: barrio, m², plazo, qué se hizo,
   el problema que resolvió y los materiales. Es contenido único que no tiene ninguna otra web.
2. **Titular de /proyectos.** El H1 es «Obra hecha, …». Debe contener la búsqueda; por ejemplo
   «Proyectos de reforma en Madrid» (la frase editorial puede ir en la descripción).
3. **Datos de las fichas.** Revisar tipologías y ubicaciones: «Reforma Piso Plaza de Castilla» figura
   como «vivienda unifamiliar», y varios campos acaban en punto.
4. **Alt de las fotos de galería**: hoy se generan («Reforma Luchana, imagen 3»). Decisión: añadir
   en el panel un campo de descripción por foto («cocina abierta con isla de porcelánico») para
   posicionar en Google Imágenes.
5. **Reseñas de clientes en cada ficha** (el campo ya existe): con nombre y barrio.

## 6. Inglés

La versión inglesa cubre portada, proyectos (`/en/projects`) y estudio (`/en/about`). Decisión: **las siguientes páginas a traducir son
`/servicios/concierge-familias-extranjeras` y `/servicios/implantacion-de-empresas`**, porque su cliente
busca en inglés. Después, Contacto. El resto de servicios y el Journal se quedan en castellano: el
cliente madrileño busca en castellano y traducirlos no traería visitas que conviertan.

## 7. SEO local y fuera de la web (lo hace ALKO)

Para «empresa de reformas Madrid» Google enseña primero el mapa. Ese bloque no depende de la web, sino
de la ficha de Google:

1. **Google Business Profile**: verificar la ficha, categoría principal «Empresa de reformas»
   (secundarias: «Contratista general», «Empresa de construcción»), mismo nombre, dirección y teléfono que
   la web, horario, zona de servicio (Madrid y municipios donde se trabaja) y fotos de obra cada mes.
2. **Reseñas**: pedirla al entregar cada obra (enlace directo a la reseña). Objetivo: 30 reseñas en
   6 meses. Contestar todas.
3. **Directorios con el mismo nombre, dirección y teléfono**: Houzz, Habitissimo, Páginas Amarillas,
   Cronoshare, Cylex. Con eso basta; nada de directorios de baja calidad.
4. **Enlaces de fabricantes**: pedir aparecer como instalador o colaborador en Cortizo, Kömmerling y
   Porcelanosa (ya salen sus logos en la web).
5. **Prensa y colaboraciones**: publicar obras destacadas en revistas de interiorismo y blogs de
   arquitectura (cada artículo con enlace a la ficha de la obra).

## 8. Medición

- **Google Search Console** con la propiedad de dominio y el sitemap (`/sitemap.xml`) enviado. Revisión
  mensual de: páginas indexadas, consultas por página y CTR.
- **GA4** con los envíos del formulario como conversión (el campo `source` ya dice desde qué página se envió).
- Objetivos a 6 meses:
  - Top 10 en «reformas de oficinas Madrid» y «reformas de viviendas Madrid».
  - Mapa (top 3) en «empresa de reformas» desde los barrios donde hay obras.
  - +100 % de clics orgánicos sobre el punto de partida que marque Search Console.
  - Formularios con origen orgánico medidos cada mes.

## 9. Calendario

| Cuándo | Qué |
|---|---|
| Semana 1 | Search Console + GA4, Google Business Profile, titular de /proyectos, corregir datos de fichas |
| Mes 1 | Memoria de las 15 obras, primeros 2 artículos, directorios |
| Mes 2 | Migrar las imágenes a CDN, 2 artículos, traducir los 2 servicios para extranjeros |
| Meses 3–6 | 2 artículos al mes, reseñas, enlaces de fabricantes y prensa, revisar consultas en Search Console y reescribir títulos con CTR bajo |
