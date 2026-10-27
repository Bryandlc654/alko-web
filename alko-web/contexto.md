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
- **Detalle de proyecto, segunda ampliación** (2026-10-17):
  - Nuevos campos en `Project`: `cliente`, `servicio` (slug del sector), `cronograma: ProjectEtapa[]` (periodo, titulo, texto), `materiales: ProjectMaterial[]` (elemento, detalle) y `resultado`. En WP son textareas con columnas separadas por `|` (`wpRowsField` en normalizers). **Plugin 1.3.0** (zip regenerado): hay que reinstalarlo.
  - Página: ficha de cliente y servicio en la columna de la memoria; secciones «Cronograma de la obra» (línea de tiempo), «Materiales y acabados», galería con contador, «El resultado» (banda oscura con CTA) y «Servicio relacionado» (tarjeta enlazada a `/servicios/<slug>`).
  - Contenido (de ejemplo, redactado por Claude) en `content.ts` y en WP: un apartado más de memoria por proyecto y galerías con imágenes de la biblioteca de WP (SR: 7, 23, 10, 28; Castellana: 27, 11, 12; El Viso: 21, 22, 29). **Son imágenes de stock/de proceso, no fotos reales de cada obra.** Plugin 1.3.0 instalado por el usuario (la primera vez quedó la 1.2.0: al subir el zip hay que pulsar «Reemplazar la versión actual por la subida»). Cronograma, materiales, resultado, cliente y servicio ya están cargados en WP (proyectos 16–18) y verificados en un build conectado a WP. La imagen del servicio Residencial (`service-interior-1.jpg`, 334 px) se ve blanda en la tarjeta de servicio relacionado.
  - El script previo a la hidratación (`data-inview`) solo se inyecta en producción: en desarrollo React 19 avisa del atributo añadido como diferencia de hidratación.
- **Los formularios de contacto ahora llegan a Fluent Forms, sin SMTP** (2026-10-27, petición del usuario: «no usaré SMTP, usa Fluent Forms free en WordPress»):
  - `/api/contacto` valida igual que antes (mismo origen, límite por IP, campo trampa, listas cerradas) y reenvía los datos limpios a `POST {WP_API_URL}/wp-admin/admin-ajax.php` (`action=fluentform_submit`, `form_id`, `data` urlencoded). Las entradas aparecen en WordPress › Fluent Forms › Entradas y el aviso por correo lo envía Fluent Forms con `wp_mail`. Se eliminó `nodemailer` y las variables SMTP.
  - Formularios creados en WordPress: **id 3 «ALKO Contacto rápido»** (nombre, email, telefono, origen) e **id 4 «ALKO Solicitud de proyecto»** (tipo, ubicacion, superficie, situacion, fecha, presupuesto, nombre, contacto, planos, origen). Los nombres de campo deben coincidir con los de la API. Ids configurables con `FLUENTFORM_QUICK_ID` y `FLUENTFORM_PROJECT_ID` (por defecto 3 y 4). Cada uno tiene un aviso por correo al email de administrador de WordPress (`{wp.admin_email}`); se puede cambiar en Ajustes › Notificaciones de cada formulario.
  - **Planos**: el campo de subir archivos de Fluent Forms es de pago, así que se quitó la zona de adjuntos; el formulario completo indica que los planos se envían después por WhatsApp o correo. Si se quiere adjuntar de verdad: Fluent Forms Pro, o subir a la mediateca de WordPress con una contraseña de aplicación.
  - Probado en local contra el WordPress real: los dos modos crean su entrada y un envío inválido se rechaza.
- **Dos formularios en modal y reparto de las llamadas a la acción** (2026-10-27, petición del usuario: «uno simplificado y otro avanzado, que salgan en modal, y decide estratégicamente dónde va cada uno»):
  - **Formulario rápido** (`components/ui/QuickContactForm.tsx`): nombre, correo y teléfono; obligatorio el nombre y *al menos uno* de correo o teléfono. **Formulario completo** (`ContactForm.tsx`, el de planos). Los dos envían a `/api/contacto` (el rápido con `modo=rapido`) y comparten límites, validación, campo trampa y errores sin detalles internos. Cada correo lleva una fila **«Origen»** («Cabecera · /servicios/interiorismo»): sirve para medir qué botón convierte.
  - **Modal:** `ContactModalProvider` (en `layout.tsx`, con los tipos de proyecto de WP, el email y el WhatsApp) + `ContactModal` (`role="dialog"`, foco atrapado y devuelto al botón, Escape, clic fuera, scroll bloqueado; hoja inferior en móvil) + `ContactTrigger`. El disparador es un enlace a `/contacto#formulario`: sin JS o con Ctrl/clic central lleva a la página; en `/contacto` los botones del formulario completo bajan a la ancla (no duplican el modal). `RouteLoader` ignora los enlaces con `data-modal-trigger` (si no, mostraría el velo de cambio de página). Cada modal enlaza al otro formulario.
  - **Regla del reparto: el formulario cumple lo que promete el botón.** *Completo* si el botón habla de presupuesto o valoración (la persona ya piensa en su obra); *rápido* si habla de contactar o conversar. En la práctica: **completo** → «Solicitar presupuesto» (hero de la portada y menú móvil), «Solicitar valoración» (8 páginas de servicio, con el tipo marcado), «Solicitar valoración de sede» (Oficinas, «Reformas de oficinas») y «Quiero un proyecto así» (detalle de proyecto, con el servicio del proyecto; solo si `enlace` no es el `/contacto` por defecto). **Rápido** → «Contactar» (cabecera y menú móvil) y «Solicitar consultoría» (franja final de 8 páginas y de Equipo). `/contacto` mantiene el formulario completo en la página.
  - Corregido de paso: «Descubrir proyectos» (portada) apuntaba a `#contacto`; ahora va a `/proyectos`.
  - Probado en local con SMTP falso: API en modo rápido (con correo, con teléfono, con ambos, sin nada, inválidos), foco, Escape, clic fuera, validación, confirmación, cambio entre formularios, tipo marcado, todos los botones y móvil. Ojo: en `next dev`, un archivo nuevo puede no entrar en el CSS de Tailwind hasta tocar `globals.css` (la compilación de producción no tiene ese problema).
- **Formulario «Cuéntanos tu proyecto» con envío real y planos adjuntos** (2026-10-26, petición del usuario):
  - Campos, en este orden: Tipo de proyecto, Ubicación, Superficie, Situación actual, Fecha prevista, Presupuesto aproximado, Nombre / empresa, Teléfono / email (un único campo: vale uno de los dos) y Adjuntar planos. **Obligatorios solo tipo, nombre y teléfono/email** (regla UX: no pedir datos innecesarios). No hay campo de mensaje libre.
  - **Reglas UX del usuario:** no pedir datos innecesarios; permitir adjuntar documentación; mostrar una confirmación clara; **no usar «presupuesto sin compromiso»** ni variantes (en la web y en WP no aparecía; no escribirlo en textos nuevos).
  - Las listas (Situación actual, Fecha prevista y Presupuesto aproximado) están en `lib/contact/config.ts` y son **propuesta mía**: revisar las opciones y los tramos de presupuesto. «Situación actual» mezcla estado del espacio y fase del proyecto; ajustar si se quiere otra cosa.
  - **Envío:** `app/api/contacto/route.ts` (POST multipart) con `nodemailer` (v10, trae sus tipos). Valida en servidor (obligatorios, contacto = email o teléfono, listas cerradas); planos: PDF, JPG, PNG, WEBP, DWG o DXF, hasta 5 archivos, 8 MB cada uno y 15 MB en total, con comprobación de que el contenido corresponde a la extensión (los DWG/DXF solo por extensión; **no hay antivirus**). Protecciones: origen propio, 5 envíos por IP cada 30 min y 100 al día, campo trampa `website` (finge éxito sin enviar) y errores sin detalles internos (el log solo guarda código). Correo en texto y HTML escapado, «Responder a» con el email del cliente si lo dio. Limitador y funciones de IP/origen compartidos con el chat (`lib/rate-limit.ts` con `createRateLimiter()`, `lib/http.ts`).
  - **Falta configurar en Render (variables de entorno):** `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` y `CONTACT_TO_EMAIL` (opcionales `CONTACT_FROM_EMAIL` y `SMTP_SECURE`; ver `.env.example`). Sin ellas el formulario responde «el envío no está disponible» y ofrece WhatsApp y correo; **no envía nada ni a `settings.email`, que sigue siendo un dato de ejemplo**.
  - Formulario (`components/ui/ContactForm.tsx`): validación con errores bajo cada campo y foco en el primero, arrastrar y soltar planos con lista y botón de quitar, estado «Enviando…», **confirmación** («Hemos recibido tu proyecto», nombre, medio de contacto y resumen, con foco y `role="status"`) y panel de error con WhatsApp y email conservando los datos. Sin cursiva ni mezclas de mayúsculas y minúsculas.
  - Probado en local con un SMTP falso (`smtp-server`/`mailparser`, fuera del repo): correo con los adjuntos íntegros, HTML escapado, tildes, € y ² correctos, campo trampa sin envío, límites (413, 400, 403, 429), caída del SMTP (502 con aviso amable) y móvil sin desbordes. **No se ha probado con un servidor SMTP real.**
- **Desplegable en Servicios** (2026-10-26): el menú de Servicios (escritorio y panel móvil) lista «Todos los servicios» y un enlace por cada servicio de WP. `buildMainNav(services)` (`lib/site.ts`) construye el menú a partir de `getSectors()` (el layout se los pasa a `Nav` como `services`), así que un servicio nuevo en WP › sectores aparece solo en el menú, en `/servicios` y en el sitemap. En móvil es un acordeón que se abre por defecto en la sección actual. `MAIN_NAV` conserva Servicios sin hijos: es el respaldo si no hay datos.
- **Descargas y Actualidad dentro de Guías** (2026-10-26, cierra el esquema): `/conocimiento/guias` ahora tiene barra de anclas (Guías · Descargas · Actualidad), sección **Descargas** (`#descargas`), sección **Actualidad** (`#actualidad`) y `ContactCta`. El desplegable de Conocimiento (y el panel móvil) suma «Descargas» y «Actualidad» como enlaces a esas anclas.
  - **Descargas:** 3 PDF **redactados por Claude como borrador, a revisar** en `public/descargas/` (se generan con `reportlab`; script fuera del repo): checklist para planificar una reforma, plantilla para comparar presupuestos y ficha de calidades y acabados, uno por cada guía. Sin teléfono ni correo (siguen siendo datos de ejemplo). Descarga directa, sin formulario (el contacto solo abre el correo). Tipo `Descarga` (`types.ts`), `toDescarga`, `getDescargas()` y `DEFAULT_DESCARGAS` (respaldo con los 3 PDF).
  - **Plugin 1.4.0:** nuevo tipo «Descargas» (`descarga`, REST `descargas`) con descripción, archivo (ruta o URL), formato, peso y guía relacionada (slug). Instalado por el usuario (la primera vez WP siguió en 1.3.0: al subir el zip hay que elegir «Reemplazar la versión actual por la subida»). Las 3 descargas están creadas en WP (ids 67, 68 y 69) y la web las lee de ahí (comprobado en la caché de peticiones: `descargas?…` → 200 con 3 elementos); `DEFAULT_DESCARGAS` queda como respaldo si WP no responde. El archivo es un campo de texto para poder apuntar a `/descargas/x.pdf` de la web o a una URL de la biblioteca de medios.
  - **Actualidad:** entradas de WP con la categoría `actualidad` (id 6, creada). `getNews()` las lista (las 4 últimas; sin respaldo: si no hay, la sección no aparece) y `getArticles()` las excluye con `categories_exclude`, así que no salen en Artículos ni en la portada; el detalle sigue siendo `/conocimiento/[slug]` (con «Volver a actualidad»), y el sitemap y `generateStaticParams` las incluyen. Sembradas 2 novedades **reales**: «Nuevos servicios: Interiorismo, Instalaciones y Gestión técnica» (post 61, 26/10/2026) y «Publicamos nuestras primeras guías» (post 62, 25/10/2026).
  - Verificado en dev con WP: las 3 secciones, anclas desde el menú (escritorio y móvil), PDF servidos como `application/pdf`, Artículos sin las novedades y detalle de novedad. Sin scroll horizontal en 375 px.
- **Arquitectura web alineada con el esquema** (2026-10-26): Proyectos (listado + detalle), Servicios (6 del esquema + Retail y Hospitality), Empresa (Nosotros con Método y Valores dentro, Equipo, Trabaja con nosotros), Conocimiento (Artículos y Guías, páginas distintas) y Contacto (una página).
  - **Método ya no tiene página:** el contenido (enfoque, imagen y las 6 fases de `Process`) está en `/nosotros#metodo`. `/metodo` redirige (308) a esa ancla; se eliminó `app/metodo`, `ROUTES.method` y su entrada en menú y pie; los enlaces usan `METHOD_HREF` (`lib/site.ts`). `Process` admite la prop `id` (en Nosotros es `fases`, para no duplicar el `id="metodo"` del contenedor; la portada sigue con `metodo`).
  - **Servicios** (WP › sectores, orden por `menu_order`): 01 Reformas integrales (`reformas-integrales`, nuevo, id 57), 02 Reformas de oficinas (`oficinas`, página propia en `app/servicios/oficinas`), 03 Reformas de viviendas (`residencial`, antes «Residencial»; imagen cambiada a El Viso por la de 334 px), 04 Interiorismo (`interiorismo`, 58), 05 Instalaciones (`instalaciones`, 59), 06 Gestión técnica (`gestion-tecnica`, 60), 07 Retail, 08 Hospitality. Se mantienen los slugs `oficinas` y `residencial` para no romper enlaces.
  - Plantilla `app/servicios/[slug]/page.tsx` rehecha: hero con imagen, entradilla + «Qué incluye / Cómo lo ejecutamos», «Proyectos de este servicio» (proyectos cuyo campo `servicio` coincide con el slug), «Más servicios» y `ContactCta`. No requiere plugin nuevo: la estructura va en el HTML del contenido.
  - Los textos de los 4 servicios nuevos y de Viviendas son **borradores míos, sin cifras ni certificaciones**: hay que revisarlos. Retail y Hospitality conservan su texto corto. El respaldo local (`DEFAULT_SECTORS`) tiene los mismos 8.
  - El listado dice «SERVICIO» (antes «SECTOR»); la portada, «SERVICIOS Y SECTORES». Contacto ofrece ahora 8 tipos de proyecto + «Otro».
- **Cambios traídos de origin/main** (2026-10-23, fast-forward 7138e4a → f339342, 5 commits de otra persona o sesión):
  - **Chat con OpenAI:** `components/chat/ChatWidget.tsx` (burbuja abajo a la derecha, estilo claro; WhatsApp sigue abajo a la izquierda), `app/api/chat/route.ts` (POST, `runtime = "nodejs"`) y `lib/ai/config.ts` (modelo `gpt-4o-mini` por defecto, temperatura 0,6, 600 tokens y el prompt de sistema con datos de ALKO). Nueva dependencia `openai` y variables `OPENAI_API_KEY` y `OPENAI_MODEL` en `.env.example`.
  - **Página propia de Oficinas** en `app/servicios/oficinas/page.tsx` (con `PageHero`, capacidades técnicas y metodología de ejecución). `app/oficinas/page.tsx` la reexporta (misma página en dos URL) y `generateStaticParams` de `servicios/[slug]` excluye `oficinas`, así que el sector «Oficinas» de WP ya no se usa en esa ruta.
  - Estado en Render: publicado; `/servicios/oficinas` y `/oficinas` dan 200 y `/api/chat` responde. **Falta definir `OPENAI_API_KEY` en Render**: sin ella, el chat muestra al visitante un aviso pensado para el desarrollador («añade tu variable… en `.env.local`»).
  - **Límites del chat** (2026-10-26): `lib/ai/limits.ts` (`AI_LIMITS` y `AI_MESSAGES`, sin secretos: lo importan servidor y widget) y `lib/ai/rate-limit.ts` (ventana deslizante en memoria, por instancia). `/api/chat` ahora: rechaza orígenes ajenos (403); 15 peticiones por IP cada 10 min y tope de 1500 al día (429 con `Retry-After`); cuerpo ≤ 32 KB; ≤ 40 mensajes aceptados y solo los últimos 12 llegan al modelo; mensajes del usuario ≤ 1000 caracteres (los del asistente se recortan a 2500); solo roles `user` y `assistant`, y el último debe ser del usuario; timeout de 20 s y 1 reintento con OpenAI. IP: `cf-connecting-ip` → `x-real-ip` → primer `x-forwarded-for` (el tope diario cubre IP rotatorias).
  - **Errores sin detalles internos:** toda respuesta lleva `content` con un texto amable de `AI_MESSAGES`; el detalle (solo estado y código, no el mensaje de OpenAI, que incluye un fragmento de la clave) va al log. Sin `OPENAI_API_KEY` o con la clave rechazada (401/403): 503 «El asistente virtual no está disponible…» (aviso en el log una sola vez). El widget ya no muestra `details`/`error`: usa `content` o un aviso genérico, limita el campo a 1000 caracteres y envía solo los últimos 12 mensajes.
  - Probado en local: JSON roto, vacío, mensaje de 1001 caracteres, 41 mensajes, rol `system`, último mensaje del asistente, cuerpo de 40 KB, origen ajeno, límite por IP (el 16.º → 429), otra IP sigue pudiendo y clave falsa (503 sin filtrar nada). **No se ha probado una respuesta real de OpenAI** (no hay clave).
  - Pendiente: el prompt de sistema afirma cosas no verificadas (p. ej. «chimenea suspendida y terrazas panorámicas»).
  - No se pudo hacer `next build` local (el equipo iba justo de RAM: ~0,8 GB libres y se atascó en lint/tipos); `tsc --noEmit` pasa y el build de Render sí funcionó.
- **Sin mezcla de MAYÚSCULAS y minúsculas en un mismo texto** (2026-10-17, petición del usuario):
  - «NUESTRO Proceso» (`Process.tsx`) → «Nuestro proceso»; «para START Research» (`Experience.tsx`) → «para Start Research».
  - Revisado el texto renderizado (con `text-transform` aplicado) de las 14 rutas, marcando los bloques que mezclan palabras en mayúsculas (menos siglas: ALKO, VRF, KNX, LED…) con palabras en minúsculas: no queda ninguno.
  - Los títulos de proyecto en WP siguen en mayúsculas completas («START RESEARCH», «RESIDENCIA EL VISO»): son coherentes dentro de cada texto, no se han tocado. Los eyebrows y botones van enteros en mayúsculas por diseño.
- **Menú móvil como panel lateral** (2026-10-17), en `components/layout/Nav.tsx` (`MobileDrawer`):
  - Panel desde la derecha (86 % del ancho, máx. 384 px, fondo negro) con velo `stone-950/60` y blur. Cabecera con logo y botón de cerrar; enlaces numerados 01–05 en serif grande; Empresa y Conocimiento como acordeón (se abre solo el de la sección actual); pie con «Solicitar presupuesto» y teléfono, email y WhatsApp de `settings` (ahora `layout.tsx` pasa `settings` a `<Nav>`).
  - Se cierra con el velo, con Escape, con el botón y al navegar. Bloquea el scroll del `body`, lleva el foco al botón de cerrar y lo devuelve al de abrir. Usa `role="dialog"`, `aria-modal` e `inert` cuando está cerrado.
  - Va **fuera de `#site-nav`**: su `backdrop-filter` haría de bloque contenedor de los `fixed` y recortaría el panel.
  - En móvil (<640 px) el botón «Contactar» de la barra se oculta, porque está dentro del panel. En escritorio (≥1024 px) no cambia nada.
  - Verificado en 375×812: abrir y cerrar (velo, Escape), acordeón, navegación a Guías desde el panel, foco y scroll. En 1440 px el panel y la hamburguesa no se muestran. Build correcto.
- **Rediseño de `/nosotros`** (2026-10-17):
  - Secciones: hero (`PageHero`), introducción en dos columnas («Un criterio único para cada obra.», entradilla y dos párrafos, botones a Proyectos y Método), banda de imagen enlazada al primer proyecto del CMS, cifras en banda negra (1996, 1 interlocutor, nº de sectores y nº de fases, contados desde WP; no hay cifras inventadas), «Cómo trabajamos» (Arquitectura / Construcción / Dirección integrada, con imagen), valores en rejilla de tarjetas sobre `stone-100`, carrusel de fabricantes (reutiliza `Materials`), tarjetas a Equipo y Trabaja con nosotros, y `ContactCta` (antes era una copia del CTA dentro de la página).
  - Los textos de pilares y valores son ampliaciones redactadas por Claude a partir del texto existente: conviene revisarlos.
  - Verificado en dev a 1440, 1280 y 375 px: sin scroll horizontal y todas las secciones con contenido.
- **Sin cursiva en toda la web** (2026-10-17, petición del usuario: no mezclar texto normal y cursiva):
  - Títulos en tipografía uniforme: «Hablemos de tu próximo proyecto.» (ContactCta, Contacto, Nosotros), «Obra hecha, obra entregada.», «¿No encuentras tu puesto ideal?», «Criterio técnico, por escrito.», «Cuéntanos qué necesitas» y los h2 del detalle de proyecto (antes tenían una palabra en cursiva dorada). También se quitó el punto final en `font-sans`.
  - Las dos etiquetas de `Experience` ya no van en cursiva.
  - `layout.tsx` carga EB Garamond solo en estilo normal (una fuente menos que descargar). `Prose` muestra sin cursiva `em`, `i` y `cite` del contenido del CMS.
  - Desde aquí se trabaja en `main` (la web está en Render: https://alko-web.onrender.com/ y todo push va a `main`). La rama `feature/cms-wordpress-y-rediseno` se fusionó en `main` por fast-forward (be4c18b) y se publicó.
- **Todos los heroes con imagen de fondo** (2026-10-17):
  - `PageHero` rehecho con el estilo de Contacto: imagen a plena opacidad (antes al 30 % o sin imagen), tres degradados para que el texto se lea, de 560–620 px de alto o 72vh en escritorio, con el contenido abajo. `image` es obligatoria; además admite `imageAlt` e `imagePosition`.
  - Imágenes: Servicios → primer sector; Guías → primera guía; Artículos → artículo destacado (con respaldo local); Equipo → `/proceso-coordinacion.jpg`; Método → `/proceso-construccion.jpg`; Trabaja con nosotros → `/proceso-control.jpg`; Nosotros → `/oficinas.jpg`.
  - Los detalles de servicio, artículo y guía usan ahora `PageHero` (antes tenían su propio hero al 30 %). La 404 también lleva hero, con `/cta-bg.jpg`.
  - `TRANSPARENT_HEADER_ROUTES = ["/*"]`: la cabecera es transparente en todo el sitio.
  - Verificado en dev con WP: las 14 rutas (incluida la 404) tienen imagen con opacidad 1 y cabecera transparente; móvil sin scroll horizontal.
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
