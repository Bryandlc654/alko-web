# Contexto del proyecto — ALKO Web

> Resumen para retomar el trabajo sin el historial. Generado el 2026-10-15 a partir de una lectura del código. Actualizado el 2026-10-15: `npm install` y `npm run build` ejecutados (ver §4 y §7).

## 1. Objetivo y funcionalidades
Web corporativa de **ALKO Construcción y Reformas Integrales (Madrid)**. Es un front-end Next.js que usa **WordPress headless** (REST API) como CMS y, si no hay CMS, tira de contenido por defecto local.
Páginas: inicio, proyectos (listado + detalle), servicios/sectores (listado + detalle), nosotros, equipo, método, trabaja con nosotros, conocimiento: artículos (`/conocimiento/articulos` + detalle en `/conocimiento/[slug]`) y guías (`/conocimiento/guias` + detalle), contacto, 404, sitemap y robots.

## 2. Tecnologías y estructura
- Next.js 15 (App Router, ISR con `revalidate = 60`), React 19, TypeScript 5, Tailwind 3, GSAP 3 (ScrollTrigger), lucide-react. Fuente: EB Garamond (`next/font`).
- **Repo Git:** la raíz es `D:\Escritorio\alko`, y el proyecto está en la subcarpeta `alko-web/`. Remoto: `https://github.com/Bryandlc654/alko-web.git`, rama con un único commit `934446a first commit`.
```
alko-web/
  app/            rutas (App Router); [slug] en proyectos, servicios, conocimiento
  components/
    layout/       Nav (client), Footer, WhatsAppFloat
    sections/     secciones de la home (Hero, Process, Workshop, Experience, Materials…)
    ui/           Container, PageHero, ProjectsList, SectorsList, ArticleCard, Prose
    SiteScripts.tsx  (client) sliders, fases, GSAP reveals, parallax (~560 líneas, vía data-*/clases DOM)
    RouteLoader.tsx  (client) velo/barra de transición entre rutas
  lib/
    types.ts      modelo de dominio (Project, Sector, Fase, Fabricante, Article, Slide, SiteSettings, HomeData)
    site.ts       SITE (nombre, URL, SEO), ROUTES, MAIN_NAV, FOOTER_NAV, TRANSPARENT_HEADER_ROUTES
    content.ts    DEFAULT_* = contenido de respaldo (imágenes locales en /public)
    utils.ts      slugify, stripHtml, decodeEntities, text…
    wordpress/    client.ts (wpGet + WP_API_URL), queries.ts (get* con fallback), normalizers.ts (WP → dominio)
  wordpress/alko-content-model.php   plugin/mu-plugin WP: CPTs + campos SCF/ACF
  public/         imágenes y logos locales
```

## 3. Archivos importantes
- `lib/wordpress/queries.ts`: cada `getX()` intenta primero WP y, si falla o viene vacío, devuelve `DEFAULT_X`. `getHomeData()` agrega todo para la home. `getSettings()` mezcla los campos campo a campo con los valores por defecto.
- `lib/wordpress/client.ts`: `wpGet` hace un GET a `${WP_API_URL}/wp-json/wp/v2/…` y devuelve `null` si hay error o no hay URL.
- `wordpress/alko-content-model.php`: CPTs `proyecto`, `sector`, `fase`, `fabricante`, `slide`, `ajuste` y sus campos en `acf`. Endpoints REST: `proyectos`, `sectores`, `fases`, `fabricantes`, `slides`, `ajustes`. Los artículos usan los `posts` nativos.
- `next.config.mjs`: añade el host de `WP_API_URL` (y su variante `www.`) a `images.remotePatterns`. AVIF/WebP.
- `app/layout.tsx`: Nav, Footer, WhatsAppFloat, RouteLoader y SiteScripts globales; carga `getSettings()`.
- `.env.example`: `WP_API_URL`. `lib/site.ts` también lee `NEXT_PUBLIC_SITE_URL` (por defecto `https://www.alko.es`).

## 4. Estado real
**Implementado (visto en el código, sin ejecutar):**
- Todas las rutas listadas, con `generateStaticParams`, `generateMetadata` y `notFound()` en los detalles.
- Capa de datos con fallback completo, sitemap dinámico y robots.
- Contacto y candidaturas por `mailto:`, más WhatsApp flotante (`wa.me`).

**Pendiente o con datos de ejemplo:**
- Contacto tiene formulario, pero envía por `mailto:`. Candidaturas sigue solo con mailto. No hay API routes.
- `DEFAULT_SETTINGS` lleva datos de ejemplo: teléfono `+34 910 000 000`, `hola@alkoreformas.com`, y redes sociales con `"#"`.
- Las páginas Nosotros, Equipo, Método, Trabaja con nosotros y la sección Experience tienen el contenido **escrito a mano en el código** (no sale del CMS).
- Falta configurar el WordPress real; no se sabe si existe ni si el plugin está instalado.

**Verificado (2026-10-15, Node 22.15.1 / npm 11.4.0, sin `.env.local` → modo fallback):**
- `npm install`: OK, 424 paquetes en ~3 min. Versiones resueltas: Next 15.5.27, React/React-DOM 19.3.0. `package-lock.json` no cambió.
- `npm run build`: **OK, sin errores ni warnings**. Compila en ~47 s; el paso de lint + comprobación de tipos de `next build` pasa limpio. Genera 24 páginas estáticas: 3 artículos, 3 proyectos y 4 servicios (todos del contenido por defecto).

**Necesita verificación:** `npm run lint` por separado (el build ya ejecuta ESLint y no da avisos), que se vea bien en el navegador y la integración real con WP.

## 5. Cambios de esta sesión
- Se clonó el repo en `D:\Escritorio\alko`.
- Se creó este `contexto.md`. No se modificó ningún otro archivo.
- **Nueva página `/conocimiento/articulos`** (`app/conocimiento/articulos/page.tsx`): PageHero con chips de categoría (anclas), último artículo destacado y rejilla de `ArticleCard` agrupada por categoría. Es un Server Component (sin filtro en cliente, para no romper las animaciones `reveal-item` de SiteScripts). Verificada en build y en el navegador, sin errores de consola.
- `lib/site.ts`: se añadió `ROUTES.articlesList` (también entra en el sitemap) y «Conocimiento» pasa a ser un desplegable: «Biblioteca técnica» (`/conocimiento`) + «Artículos».
- `.claude/launch.json` en la raíz del repo: `next start -p 4555` para previsualizar.
- `components/layout/Nav.tsx`: en los submenús (escritorio y móvil) solo se resalta la opción cuya ruta coincide exactamente (`pathname === child.href`). El elemento padre sigue usando `isActive`, que marca también las subrutas. Consecuencia: en el detalle de un artículo no se resalta ninguna opción del submenú. Verificado en el navegador.
- **Rediseño de `/conocimiento/articulos`:**
  - Hero con la imagen del destacado, título en dos líneas con cursiva («Criterio técnico, *por escrito*.») y fila de cifras (artículos, categorías, última publicación).
  - Destacado en banda `stone-100`.
  - Índice «Todos los artículos» en filas editoriales (número/fecha, categoría en ámbar, título, extracto y miniatura), con filtro por categoría en cliente. Está en el componente nuevo `components/ui/ArticlesIndex.tsx`; las filas no usan `reveal-item`, para que sigan visibles al filtrar.
  - Al final, enlace a Guías y `ContactCta`.
  - Verificado en 1440 px y en móvil (375 px, sin scroll horizontal), con el filtro probado. El build pasa.
- `.claude/launch.json` ahora arranca `npm run dev` en el puerto 4555 (en lugar de `next start`).
- Visto de paso: `formatDate` muestra un día menos en zonas horarias negativas (la fecha `2024-06-12` sale como «11 de junio»), porque parsea en UTC. No se ha tocado.
- **Eliminada «Biblioteca técnica»** (`app/conocimiento/page.tsx`, borrada con `git rm`, recuperable desde git):
  - `next.config.mjs`: redirección permanente (308) de `/conocimiento` → `/conocimiento/articulos`.
  - `lib/site.ts`: el desplegable queda en «Artículos» + «Guías»; el footer enlaza a `articlesList`. `ROUTES.articles` (`/conocimiento`) sigue siendo la base de las URL de cada artículo y el `href` del padre del menú, para que se marque como activo en todas las subrutas.
  - `app/sitemap.ts` excluye `/conocimiento`. El «Ver todo» de la portada y el «← Volver a artículos» del detalle apuntan a `/conocimiento/articulos`.
  - Verificado con el servidor de desarrollo: la redirección, el menú, el footer y los enlaces funcionan. El build pasa.
- **Rehecha la página `/contacto`** (`app/contacto/page.tsx`):
  - Hero con `/cta-bg.jpg` («Hablemos de tu *próximo* proyecto.»).
  - Columna «Canales directos» con teléfono, email, WhatsApp, oficina y horario, todo sacado de `getSettings()`.
  - Formulario en bloque `stone-100` y sección «Qué pasa a continuación» en 3 pasos (texto genérico escrito por Claude, sin plazos comprometidos).
  - Ya no usa `ContactCta`.
  - Nuevo `components/ui/ContactForm.tsx` (cliente): nombre*, email*, teléfono, ubicación, tipo de proyecto (chips con los títulos de `getSectors()` + «Otro») y mensaje*.
  - **Sigue sin backend**: al enviar compone un `mailto:` con asunto y cuerpo rellenos y muestra un aviso por si no se abre el correo. Para enviarlo desde el servidor bastaría con cambiar `handleSubmit` por un POST a una API route y elegir proveedor (Resend, SMTP…), que está pendiente de decidir.
  - Verificado: validación de campos obligatorios, envío y selección de tipo, escritorio y móvil sin scroll horizontal. El build pasa.
  - El color `stone-300` del tema es `#e1e1df` y apenas se ve sobre `stone-100`; por eso los inputs usan `border-stone-900/25`.
- **Rediseño de estilo de `/contacto`**:
  - Hero con botones rápidos: «Solicitar presupuesto» (ancla a `#formulario`), Llamar y WhatsApp.
  - Sección con las líneas de retícula de Nosotros. A la izquierda, columna fija (sticky) con canales e iconos `lucide-react`; a la derecha, formulario en **panel negro** con grupos numerados («01 Tus datos», «02 Tu proyecto»), subrayado dorado al enfocar y chips en dorado.
  - Proceso en línea de tiempo con puntos dorados (horizontal en escritorio, vertical en móvil).
  - Bloque «Nuestra oficina» con `/oficinas.jpg` (imagen de stock local, no es la oficina real) y enlace «Cómo llegar» a una búsqueda de Google Maps con la dirección.
  - **Hero propio** (ya no usa `PageHero`, que pone la imagen al 30 % de opacidad): `/cta-bg.jpg` a plena opacidad, con degradados laterales e inferiores para que el texto se lea, de 640–720 px de alto o 82vh en escritorio. `/contacto` se añadió a `TRANSPARENT_HEADER_ROUTES` en `lib/site.ts`, así que la cabecera es transparente sobre la imagen. Verificado en 1440 px y en móvil.
  - La sección del formulario usa `overflow-clip` en lugar de `overflow-hidden`, porque `hidden` rompe el `position: sticky`.
  - Verificado: sticky a 1440×900, móvil sin scroll horizontal, y validación y envío del formulario. El build pasa.
- **Rediseño de `/proyectos`** (`app/proyectos/page.tsx`):
  - Hero a pantalla completa con la imagen del primer proyecto, título «Obra hecha, *obra* entregada.» y cifras (obras, tipologías, periodo de años). `/proyectos` se añadió a `TRANSPARENT_HEADER_ROUTES`.
  - Nuevo `components/ui/ProjectsGallery.tsx` (cliente): filtro por tipología y filas alternadas con imagen + etiqueta de año, número grande, título, extracto (primer párrafo del contenido), ficha (tipología, ubicación, año) y botón «Ver proyecto».
  - Cierra con `ContactCta`.
  - **`ProjectsList` (portada) no se ha tocado.** Los títulos se muestran tal como vienen (en mayúsculas).
  - Verificado en 1440 px y en móvil, con el filtro probado. El build pasa.
- **Rediseño del detalle de proyecto** (`app/proyectos/[slug]/page.tsx`); ya existía, pero era básico:
  - Hero a pantalla completa con la imagen del proyecto, enlace «← Proyectos», índice grande, título y ficha (tipología, ubicación, año).
  - «Memoria del proyecto»: el primer párrafo como entradilla grande y el resto con `Prose`, sobre las líneas de retícula.
  - Galería: imagen principal + `galeria`. La primera imagen ocupa todo el ancho y el resto va en 2 columnas.
  - Proyecto anterior y siguiente (circular) con imagen de fondo, y `ContactCta`. `generateMetadata` añade `openGraph.images`.
  - **Nuevo campo `galeria: string[]`** en `Project`: en `types.ts`, en `content.ts` (start-research lleva `/start-research-2.jpg`; los otros dos van vacíos porque no hay más imágenes), `wpGalleryField` + `toProject` en normalizers, y un campo `gallery` en el plugin PHP. **Hay que reinstalar el plugin en WP.**
  - `lib/utils.ts`: nueva `splitLead(html)`, que separa el primer párrafo del resto; también la usa el listado de `/proyectos`.
  - Cabecera transparente en subrutas: `TRANSPARENT_HEADER_ROUTES` admite entradas terminadas en `/*` (se añadió `/proyectos/*`) y `Nav.tsx` las interpreta.
  - Verificado con start-research (galería de 2 imágenes) y residencia-el-viso (sin galería), en 1440 px y en móvil; los enlaces de anterior/siguiente son correctos. El build pasa.
- **WordPress conectado como CMS** (2026-10-16): `https://white-leopard-845001.hostingersite.com`.
  - `.env.local` (ignorado por git) con `WP_API_URL` apuntando ahí. Con esto los **artículos ya salen de WP** (por ahora solo «Hello world»).
  - Estado del WP: instalación limpia, sin ACF/SCF ni CPTs. El plugin Easy MCP AI 2.2.0 está activo, con `wp_install_plugin`, `wp_activate_plugin` y `wp_cli_run` **desactivados**.
  - MCP: servidor «wordpress» con token Bearer en `~/.claude.json` (ámbito local del proyecto, fuera del repo). Copia previa: `~/.claude.json.bak-antes-mcp-wordpress`. Sus herramientas solo se cargan en una sesión nueva; mientras tanto se usó el endpoint por JSON-RPC.
  - `lib/wordpress/client.ts`: todas las peticiones añaden `acf_format=standard`, porque sin ello ACF/SCF devuelve las imágenes como ID y no como URL.
  - Plugin `wordpress/alko-content-model.php` 1.1.0: se quitó la cabecera `Requires Plugins`, cuyo valor inválido impedía activarlo en WP ≥ 6.5. Zip listo para subir: `D:\Escritoriolkolko-content-model.zip` (no versionar).
  - Plugins activos en WP (2026-10-16): **Secure Custom Fields 6.9.6** y **ALKO Content Model 1.1.0**, instalados por el usuario. La API expone `proyectos`, `sectores`, `fases`, `fabricantes`, `slides`, `guias` y `ajustes`.
  - **Migración hecha vía MCP (JSON-RPC):**
    - Medios: IDs 6–12 (start-research-1/2, oficinas, el-viso, proceso-instalaciones/compras/control), con texto alternativo.
    - Categorías: Climatización (2), Materiales (3) y Gestión técnica (4).
    - Artículos publicados (posts 13–15), con las fechas originales (2024), extracto, categoría e imagen destacada.
    - Proyectos publicados (16–18), con `menu_order` 1–3, imagen destacada y ACF: indice, anio, ubicacion, tipologia, imagen, galeria (solo start-research tiene 1 imagen). `enlace` queda vacío porque el campo es de tipo URL y no admite `/contacto`; el normalizer usa `/contacto` por defecto.
    - «Hello world» (post 1) movido a la **papelera** (no borrado definitivo).
  - Verificado: la API pública devuelve imágenes y galería como URL (con `acf_format=standard`); una galería vacía llega como `false` y se trata como `[]`. El build genera las rutas de los artículos y proyectos de WP, y portada, `/proyectos`, detalles y artículos usan imágenes de WP. El optimizador `/_next/image` las sirve con HTTP 200.
  - Ojo con la caché: `next build` reutiliza `.next/cache/fetch-cache` (revalidación de 60 s). Si un build muestra contenido viejo de WP, borra esa carpeta.
  - **Segunda migración (resto de colecciones), todo publicado:**
    - Medios 21–32: slides, sectores, fases y logos.
    - Sectores 33–36: numero, descripcion, imagen y contenido.
    - Fases 37–42: tag, texto, imagen.
    - Fabricantes 43–45: logo.
    - Slides 46–49: grupo hero/showcase, alt, imagen.
    - Guías 50–52: numero, tema, lectura, descripcion, imagen y contenido.
    - Ajustes 53: teléfono, email, WhatsApp, dirección y horario.
    - Orden con `menu_order`. Los campos URL con valores relativos o `#` (`enlace` de sectores, `url` de fabricantes y redes sociales de ajustes) quedan vacíos y la web aplica su valor por defecto.
  - **Los ajustes siguen siendo datos de ejemplo** (+34 910 000 000, hola@alkoreformas.com…), ahora editables en WP › Ajustes del sitio.
  - Verificado: la API pública devuelve todos los campos y el build genera servicios y guías desde WP. Portada (slides, sectores, fases, logos), `/servicios`, `/conocimiento/guias` y `/contacto` usan datos e imágenes de WP.
  - **Ya no queda contenido servido desde `content.ts`** mientras WP responda. `content.ts` sigue como respaldo si WP cae o una colección queda vacía.
  - Script de migración (temporal, no versionado): scratchpad de la sesión, `wpmcp.py`.
- **Detalle de proyecto ampliado** (2026-10-16):
  - `Project` incluye ahora `superficie`, `plazo`, `reto`, `solucion`, `alcance: string[]` y `cifras: ProjectCifra[]` (con `valor` y `etiqueta`).
  - Página: la ficha del hero suma Superficie y Plazo y se adapta al número de datos. Secciones nuevas: banda de cifras (fondo negro), «El reto / La solución», «Alcance de los trabajos» (lista numerada) y «Cómo lo ejecutamos» (las fases de `getFases()`, con enlace a `/metodo`). Cada sección solo aparece si tiene datos.
  - `content.ts`: los 3 proyectos traen estos campos y más párrafos en la memoria. **Superficies, plazos, cifras y textos son de ejemplo, redactados por Claude**: hay que revisarlos con datos reales.
  - Plugin 1.2.0: campos `superficie`, `plazo`, `reto`, `solucion`, `alcance` (una partida por línea) y `cifras` (`valor | etiqueta` por línea), leídos con `wpLinesField` y `wpCifrasField`. Zip regenerado. El usuario reinstaló el plugin en WP y el contenido de los proyectos 16–18 se cargó vía MCP (`wp_rest_write` con `acf` + `content`). Verificado en modo WP: los 3 detalles muestran todas las secciones.
  - `.claude/launch.json`: nueva configuración `alko-web-fallback` (puerto 4556, `WP_API_URL` vacío) para ver el contenido de respaldo.
  - Verificado en modo respaldo (1440 px y 375 px, sin scroll horizontal) y en modo WP. `tsc` y lint pasan.
- **Optimización de rendimiento** (2026-10-17, objetivo PageSpeed móvil ≥ 90):
  - Causa de que las imágenes «a veces» tardaran: el optimizador `/_next/image` codificaba en AVIF (muy lento) la primera vez que se pedía cada tamaño. En la portada, `slide1` tardó 7,4 s. Ahora `next.config.mjs` usa **solo WebP** y menos tamaños (`deviceSizes` 640/828/1080/1440/1920, `imageSizes` 64–384): las 6 imágenes de la portada salen en ~2,3 s con la caché vacía y en ~6 ms con la caché llena. El origen (Hostinger) ya tarda ~0,8 s por imagen (TTFB 0,5 s).
  - Logos de cabecera y pie con `sizes` (antes se pedía la variante de 1080 px); la imagen de Process ya no lleva `priority`; los slides 2+ del hero llevan `fetchPriority="low"`.
  - `package.json` → `browserslist` moderno (Chrome/Edge/Firefox ≥ 111, Safari ≥ 16.4): quita polyfills antiguos.
  - Animaciones: un script en línea en `layout.tsx` marca con `data-inview` los `.reveal-*` visibles antes de hidratar (CSS en `globals.css`), así no esperan a React ni a GSAP. GSAP se carga en `requestIdleCallback` tras `load`, o con el primer scroll. Se quitó `will-change` de `.reveal-*` y `.service-row`.
  - Se probó `experimental.inlineCss`: no mejoraba (y Next dejaba de precargar cosas), así que **se descartó**. Next tampoco emite la precarga de las fuentes (`next/font`); no se ha tocado.
  - Medición: Lighthouse 12.6 móvil en local (`next start`), mediana de 3 pasadas. La máquina (Ryzen 5 3500U, benchmarkIndex ~1000) es más lenta que la de PageSpeed: con `cpuSlowdownMultiplier=2` (calibrado) da 92–97 en portada, proyectos, detalle, servicios, artículos y contacto; con 4× (por defecto) da 75–90 y mucho ruido. **Falta medir en PageSpeed real tras desplegar.**
- Ojo: un artículo con slug `articulos` (o `guias`) quedaría tapado por la ruta estática.
- **Nueva sección Guías** (`/conocimiento/guias` + `/conocimiento/guias/[slug]`), siguiendo la convención del proyecto:
  - `lib/types.ts`: tipo `Guide` (numero, tema, descripcion, lectura, imagen, content).
  - `lib/content.ts`: `DEFAULT_GUIDES` con 3 guías **de ejemplo, redactadas por Claude** (planificar una reforma, leer un presupuesto, elegir materiales). Hay que revisarlas o sustituirlas por contenido real.
  - `lib/wordpress/`: `toGuide` (normalizers), `getGuides`/`getGuideBySlug` (queries, con fallback) y su exportación en `index.ts`.
  - `wordpress/alko-content-model.php`: CPT `guia` (REST `guias`) y grupo de campos `group_guia`. **Hay que reinstalar el plugin en WP.**
  - Páginas: el listado usa filas numeradas al estilo de Servicios; el detalle lleva cabecera con imagen, Prose y una barra lateral («Sobre esta guía» y «Otras guías»).
  - `lib/site.ts`: `ROUTES.guides` y la opción «Guías» en el desplegable de Conocimiento. `app/sitemap.ts` incluye el detalle de cada guía.
  - Verificado: el build pasa (28 páginas) y, en el navegador, el listado y el detalle se ven correctamente y todas las peticiones devuelven 200.
- Se ejecutó `npm install` (crea `node_modules/`) y `npm run build` (crea `.next/`), ambos ignorados por git. `git status` solo muestra `contexto.md` sin seguimiento.

## 6. Decisiones técnicas (deducidas del código)
- Headless WP + fallback local, para que el sitio funcione aunque no haya CMS.
- Los tipos de dominio en `types.ts` hacen de contrato, así que los componentes no dependen de la fuente de datos.
- Las animaciones del sitio estático original se portaron a un único `SiteScripts` que se apoya en el DOM (data-*/clases), en lugar de reescribirlas por componente.
- Las imágenes de respaldo son locales, para que `next/image` las optimice sin depender de hosts externos.

## 7. Errores y problemas
- Build: sin errores.
- `npm install` avisa de paquetes obsoletos (todos vienen de `eslint@8`: inflight, glob@7, rimraf@3, @humanwhocodes/*). No bloquea nada.
- `npm audit`: 11 vulnerabilidades (3 moderadas, 8 altas) en `braces`, `postcss` (≤8.5.22) y `postcss-selector-parser` (<7.1.6). En producción (`--omit=dev`) quedan 2 (postcss, la que trae Next). **No se ha ejecutado `npm audit fix`**; está pendiente decidirlo.
- Restos en el repo: `start-out.log` (servidor arrancado antes en el puerto **4555**, Next 15.5.27), `start-err.log` vacío y `chrome-dom.html` vacío (0 bytes). Probablemente son artefactos que se pueden borrar o ignorar en git; **no se han tocado**.
- `README.md` está prácticamente vacío.

## 8. Última tarea / punto exacto
Se completó el paso 1: dependencias instaladas y build de producción correcto. El siguiente paso es revisar el sitio en el navegador (`npm run dev`).

## 9. Próximos pasos (por prioridad)
1. ~~`npm install` y `npm run build`~~ ✅ hecho. Queda opcional: `npm run lint` por separado y decidir sobre `npm audit fix`.
2. `npm run dev` y revisar todas las rutas en el navegador, comprobando sliders y animaciones GSAP.
3. Definir `.env.local` con `WP_API_URL` (y `NEXT_PUBLIC_SITE_URL`) e instalar `wordpress/alko-content-model.php` + SCF/ACF en el WP.
4. Sustituir los datos de ejemplo (teléfono, email, redes) por los reales, en WP (`ajustes`) o en `DEFAULT_SETTINGS`.
5. Decidir si el contacto y las candidaturas necesitan formularios reales en lugar de mailto.
6. Opcional: llevar al CMS el contenido escrito a mano (nosotros, equipo, método, empleo); limpiar los logs y `chrome-dom.html`; escribir el README.

## 10. Comandos (ejecutar en `alko-web/`)
```bash
npm install
npm run dev        # http://localhost:3000 (antes se usó el puerto 4555: npx next start -p 4555)
npm run build
npm run start
npm run lint
```
Despliegue: no hay configuración de despliegue en el repo (ni Vercel ni Docker). Hay que decidirla.

## 11. Restricciones e instrucciones
- No dar nada por terminado sin comprobarlo; distinguir siempre entre lo implementado, lo pendiente y lo que hay que verificar.
- No eliminar ni revertir cambios existentes sin confirmarlo.
- Para añadir contenido o secciones: tipo en `types.ts` → fallback en `content.ts` → normalizer y query en `lib/wordpress/` → ruta en `site.ts`.
- `.env` y `.env*.local` están en `.gitignore`: no subir secretos.
- Idioma del sitio y del código (comentarios): español.
