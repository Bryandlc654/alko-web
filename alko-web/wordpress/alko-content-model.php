<?php
/**
 * Plugin Name:       ALKO Content Model (Headless)
 * Description:       Registra la gestión de Página de Inicio, CPTs y campos SCF/ACF que consume el front-end Next.js de ALKO.
 * Version:           1.5.0
 * Author:            ALKO
 *
 * Requiere "Secure Custom Fields" o "Advanced Custom Fields" activo (no se usa la
 * cabecera "Requires Plugins" para admitir cualquiera de los dos).
 *
 * INSTALACIÓN
 * -----------
 * 1. Coloca este archivo en wp-content/mu-plugins/ (recomendado) o actívalo como plugin normal.
 * 2. Asegúrate de que el plugin "Secure Custom Fields" (SCF) o Advanced Custom Fields está activo.
 * 3. Ve a Ajustes → Enlaces permanentes y pulsa "Guardar" una vez (para refrescar las rutas REST).
 * 4. En el front-end, define la variable WP_API_URL con la URL de este WordPress.
 *
 * Los campos están expuestos en la REST API (show_in_rest) bajo la clave "acf" de cada entrada:
 *   GET /wp-json/wp/v2/inicio?per_page=1
 *   GET /wp-json/wp/v2/slides?_embed
 *   GET /wp-json/wp/v2/sectores?_embed
 *   GET /wp-json/wp/v2/proyectos?_embed
 *   GET /wp-json/wp/v2/fases?_embed
 *   GET /wp-json/wp/v2/fabricantes?_embed
 *   GET /wp-json/wp/v2/guias?_embed
 *   GET /wp-json/wp/v2/descargas?_embed
 *   GET /wp-json/wp/v2/ajustes?per_page=1
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Tipos de contenido personalizados y estructuración del panel.
 */
add_action( 'init', function () {

	// 1. PÁGINA DE INICIO (Menú principal dedicado)
	register_post_type( 'inicio', array(
		'labels'              => array(
			'name'               => 'Página de Inicio',
			'singular_name'      => 'Bloques de Inicio',
			'add_new_item'       => 'Configurar Inicio',
			'edit_item'          => 'Editar Página de Inicio',
			'new_item'           => 'Nueva Configuración de Inicio',
			'view_item'          => 'Ver Inicio',
			'all_items'          => 'Bloques y Textos de Inicio',
			'menu_name'          => 'Página de Inicio',
		),
		'public'              => true,
		'publicly_queryable'  => false,
		'exclude_from_search' => true,
		'has_archive'         => false,
		'show_ui'             => true,
		'show_in_rest'        => true,
		'rest_base'           => 'inicio',
		'menu_icon'           => 'dashicons-admin-home',
		'menu_position'       => 19,
		'supports'            => array( 'title' ),
	) );

	// 2. DIAPOSITIVAS (Anidadas como submenú dentro de Página de Inicio)
	register_post_type( 'slide', array(
		'labels'        => array(
			'name'          => 'Diapositivas (Hero y Showcase)',
			'singular_name' => 'Diapositiva',
			'add_new_item'  => 'Añadir Diapositiva',
			'edit_item'     => 'Editar Diapositiva',
			'all_items'     => 'Diapositivas (Imágenes)',
			'menu_name'     => 'Diapositivas',
		),
		'public'        => true,
		'show_in_rest'  => true,
		'rest_base'     => 'slides',
		'show_in_menu'  => 'edit.php?post_type=inicio',
		'supports'      => array( 'title', 'thumbnail', 'page-attributes' ),
	) );

	// 3. SERVICIOS (Renombrado desde Sectores para coherencia con la web)
	register_post_type( 'sector', array(
		'labels'        => array(
			'name'          => 'Servicios',
			'singular_name' => 'Servicio',
			'add_new_item'  => 'Añadir Servicio',
			'edit_item'     => 'Editar Servicio',
			'all_items'     => 'Todos los Servicios',
			'menu_name'     => 'Servicios',
		),
		'public'        => true,
		'show_in_rest'  => true,
		'rest_base'     => 'sectores',
		'menu_icon'     => 'dashicons-hammer',
		'menu_position' => 20,
		'supports'      => array( 'title', 'editor', 'thumbnail', 'page-attributes' ),
	) );

	// 4. PROYECTOS
	register_post_type( 'proyecto', array(
		'labels'       => array(
			'name'          => 'Proyectos',
			'singular_name' => 'Proyecto',
			'add_new_item'  => 'Añadir Proyecto',
			'edit_item'     => 'Editar Proyecto',
			'all_items'     => 'Todos los Proyectos',
			'menu_name'     => 'Proyectos',
		),
		'public'        => true,
		'show_in_rest'  => true,
		'has_archive'   => true,
		'rest_base'     => 'proyectos',
		'menu_icon'     => 'dashicons-building',
		'menu_position' => 21,
		'supports'      => array( 'title', 'editor', 'thumbnail', 'excerpt', 'page-attributes' ),
	) );

	// 5. MÉTODO Y FASES
	register_post_type( 'fase', array(
		'labels'        => array(
			'name'          => 'Método (Fases)',
			'singular_name' => 'Fase',
			'add_new_item'  => 'Añadir Fase',
			'edit_item'     => 'Editar Fase',
			'all_items'     => 'Todas las Fases',
			'menu_name'     => 'Método (Fases)',
		),
		'public'        => true,
		'show_in_rest'  => true,
		'rest_base'     => 'fases',
		'menu_icon'     => 'dashicons-list-view',
		'menu_position' => 22,
		'supports'      => array( 'title', 'editor', 'thumbnail', 'page-attributes' ),
	) );

	// 6. MATERIALES Y FABRICANTES
	register_post_type( 'fabricante', array(
		'labels'        => array(
			'name'          => 'Materiales y Fabricantes',
			'singular_name' => 'Fabricante',
			'add_new_item'  => 'Añadir Fabricante',
			'edit_item'     => 'Editar Fabricante',
			'all_items'     => 'Todos los Fabricantes',
			'menu_name'     => 'Fabricantes',
		),
		'public'        => true,
		'show_in_rest'  => true,
		'rest_base'     => 'fabricantes',
		'menu_icon'     => 'dashicons-awards',
		'menu_position' => 23,
		'supports'      => array( 'title', 'thumbnail', 'page-attributes' ),
	) );

	// 7. GUÍAS
	register_post_type( 'guia', array(
		'labels'        => array(
			'name'          => 'Guías',
			'singular_name' => 'Guía',
			'add_new_item'  => 'Añadir Guía',
			'edit_item'     => 'Editar Guía',
			'all_items'     => 'Todas las Guías',
			'menu_name'     => 'Guías',
		),
		'public'        => true,
		'show_in_rest'  => true,
		'rest_base'     => 'guias',
		'menu_icon'     => 'dashicons-book-alt',
		'menu_position' => 24,
		'supports'      => array( 'title', 'editor', 'thumbnail', 'excerpt', 'page-attributes' ),
	) );

	// 8. DESCARGAS
	register_post_type( 'descarga', array(
		'labels'        => array(
			'name'          => 'Descargas',
			'singular_name' => 'Descarga',
			'add_new_item'  => 'Añadir Descarga',
			'edit_item'     => 'Editar Descarga',
			'all_items'     => 'Todas las Descargas',
			'menu_name'     => 'Descargas',
		),
		'public'        => true,
		'show_in_rest'  => true,
		'rest_base'     => 'descargas',
		'menu_icon'     => 'dashicons-download',
		'menu_position' => 25,
		'supports'      => array( 'title', 'page-attributes' ),
	) );

	// 9. AJUSTES DEL SITIO (Contacto, horario, redes)
	register_post_type( 'ajuste', array(
		'labels'              => array(
			'name'          => 'Ajustes del sitio',
			'singular_name' => 'Ajuste',
			'add_new_item'  => 'Añadir Ajuste',
			'edit_item'     => 'Editar Ajuste',
			'all_items'     => 'Ajustes del sitio',
			'menu_name'     => 'Ajustes del sitio',
		),
		'public'              => true,
		'publicly_queryable'  => false,
		'exclude_from_search' => true,
		'has_archive'         => false,
		'show_ui'             => true,
		'show_in_rest'        => true,
		'rest_base'           => 'ajustes',
		'menu_icon'           => 'dashicons-admin-generic',
		'menu_position'       => 26,
		'supports'            => array( 'title' ),
	) );
} );

/**
 * Grupos de campos (SCF / ACF).
 */
add_action( 'acf/include_fields', function () {

	if ( ! function_exists( 'acf_add_local_field_group' ) ) {
		return;
	}

	// -------------------------------------------------------------------------
	// 1. CONFIGURACIÓN DE LA PÁGINA DE INICIO (Hero y Bloques)
	// -------------------------------------------------------------------------
	acf_add_local_field_group( array(
		'key'          => 'group_inicio',
		'title'        => 'Contenido y Bloques de la Página de Inicio',
		'show_in_rest' => 1,
		'location'     => array( array( array( 'param' => 'post_type', 'operator' => '==', 'value' => 'inicio' ) ) ),
		'fields'       => array(
			// Pestaña 1: Hero
			array( 'key' => 'tab_inicio_hero', 'label' => '1. Hero Principal', 'type' => 'tab' ),
			array( 'key' => 'field_inicio_hero_titulo', 'label' => 'Título principal', 'name' => 'hero_titulo', 'type' => 'text', 'default_value' => 'Construcción', 'wrapper' => array( 'width' => '50' ) ),
			array( 'key' => 'field_inicio_hero_subtitulo', 'label' => 'Subtítulo', 'name' => 'hero_subtitulo', 'type' => 'text', 'default_value' => 'y reformas integrales en Madrid.', 'wrapper' => array( 'width' => '50' ) ),
			array( 'key' => 'field_inicio_hero_descripcion', 'label' => 'Descripción del Hero', 'name' => 'hero_descripcion', 'type' => 'textarea', 'rows' => 3, 'default_value' => 'Ejecutamos proyectos residenciales y corporativos de alta exigencia, coordinando construcción, instalaciones, acabados y gestión técnica hasta la entrega final.' ),
			array( 'key' => 'field_inicio_hero_cta_texto', 'label' => 'Texto botón CTA', 'name' => 'hero_cta_texto', 'type' => 'text', 'default_value' => 'SOLICITAR PRESUPUESTO', 'wrapper' => array( 'width' => '50' ) ),
			array( 'key' => 'field_inicio_hero_secundario_texto', 'label' => 'Texto enlace secundario', 'name' => 'hero_secundario_texto', 'type' => 'text', 'default_value' => 'Explorar', 'wrapper' => array( 'width' => '50' ) ),

			// Pestaña 2: Proyectos
			array( 'key' => 'tab_inicio_proyectos', 'label' => '2. Bloque Proyectos', 'type' => 'tab' ),
			array( 'key' => 'field_inicio_proyectos_titulo', 'label' => 'Título de sección', 'name' => 'proyectos_titulo', 'type' => 'text', 'default_value' => 'PROYECTOS', 'wrapper' => array( 'width' => '50' ) ),
			array( 'key' => 'field_inicio_proyectos_cta_texto', 'label' => 'Texto botón catálogo', 'name' => 'proyectos_cta_texto', 'type' => 'text', 'default_value' => 'DESCUBRIR PROYECTOS', 'wrapper' => array( 'width' => '50' ) ),
			array( 'key' => 'field_inicio_proyectos_subtitulo', 'label' => 'Subtítulo / Entradilla', 'name' => 'proyectos_subtitulo', 'type' => 'textarea', 'rows' => 2, 'default_value' => 'Cada proyecto rige planificación, ejecución, coordinación técnica y control hasta la entrega.', 'instructions' => 'Nota: Cada obra individual se gestiona en el menú lateral "Proyectos".' ),

			// Pestaña 3: Proceso / Método
			array( 'key' => 'tab_inicio_proceso', 'label' => '3. Bloque Método', 'type' => 'tab' ),
			array( 'key' => 'field_inicio_proceso_titulo', 'label' => 'Título de sección', 'name' => 'proceso_titulo', 'type' => 'text', 'default_value' => 'Nuestro proceso', 'wrapper' => array( 'width' => '50' ) ),
			array( 'key' => 'field_inicio_proceso_subtitulo', 'label' => 'Subtítulo / Etiqueta', 'name' => 'proceso_subtitulo', 'type' => 'text', 'default_value' => 'SECUENCIA DE COORDINACIÓN INTEGRAL · 6 FASES · 1 EQUIPO', 'wrapper' => array( 'width' => '50' ), 'instructions' => 'Nota: Las fases individuales se gestionan en el menú lateral "Método (Fases)".' ),

			// Pestaña 4: Servicios
			array( 'key' => 'tab_inicio_servicios', 'label' => '4. Bloque Servicios', 'type' => 'tab' ),
			array( 'key' => 'field_inicio_servicios_tag', 'label' => 'Etiqueta superior', 'name' => 'servicios_tag', 'type' => 'text', 'default_value' => 'SERVICIOS Y SECTORES', 'wrapper' => array( 'width' => '50' ) ),
			array( 'key' => 'field_inicio_servicios_titulo', 'label' => 'Título de sección', 'name' => 'servicios_titulo', 'type' => 'text', 'default_value' => 'ESPECIALIDADES', 'wrapper' => array( 'width' => '50' ) ),
			array( 'key' => 'field_inicio_servicios_descripcion', 'label' => 'Descripción', 'name' => 'servicios_descripcion', 'type' => 'textarea', 'rows' => 2, 'default_value' => 'Actuamos de forma transversal en rehabilitación, reforma integral, obra nueva y gestión de instalaciones técnicas con un único responsable de proyecto.', 'instructions' => 'Nota: Los servicios individuales se gestionan en el menú lateral "Servicios".' ),

			// Pestaña 5: Showcase (Taller de Soluciones)
			array( 'key' => 'tab_inicio_workshop', 'label' => '5. Bloque Showcase / Taller', 'type' => 'tab' ),
			array( 'key' => 'field_inicio_workshop_badge', 'label' => 'Etiqueta / Badge', 'name' => 'workshop_badge', 'type' => 'text', 'default_value' => 'START RESEARCH', 'wrapper' => array( 'width' => '50' ) ),
			array( 'key' => 'field_inicio_workshop_titulo', 'label' => 'Titular destacado', 'name' => 'workshop_titulo', 'type' => 'text', 'default_value' => 'Soluciones arquitectónicas y técnicas con criterio constructivo.', 'wrapper' => array( 'width' => '50' ) ),
			array( 'key' => 'field_inicio_workshop_descripcion', 'label' => 'Descripción', 'name' => 'workshop_descripcion', 'type' => 'textarea', 'rows' => 3, 'default_value' => 'Investigar, coordinar y ejecutar: cada detalle responde a una exigencia funcional, constructiva y estética.', 'instructions' => 'Nota: Las imágenes de fondo se gestionan en "Página de Inicio → Diapositivas" con grupo Showcase.' ),

			// Pestaña 6: Experiencia (90 días)
			array( 'key' => 'tab_inicio_experiencia', 'label' => '6. Bloque Experiencia (90 Días)', 'type' => 'tab' ),
			array( 'key' => 'field_inicio_experiencia_imagen', 'label' => 'Imagen de obra interactiva', 'name' => 'experiencia_imagen', 'type' => 'image', 'return_format' => 'url', 'instructions' => 'Imagen arquitectónica que se expande al hacer scroll (por defecto: /90dias.jpg).' ),
			array( 'key' => 'field_inicio_experiencia_badges', 'label' => 'Etiquetas técnicas / Badges', 'name' => 'experiencia_badges', 'type' => 'textarea', 'rows' => 4, 'instructions' => 'Una etiqueta por línea. Ej: Climatización, Ventilación, Red de Datos, Acabados H2.' ),

			// Pestaña 7: Materiales y Fabricantes
			array( 'key' => 'tab_inicio_materiales', 'label' => '7. Bloque Materiales', 'type' => 'tab' ),
			array( 'key' => 'field_inicio_materiales_tag', 'label' => 'Etiqueta superior', 'name' => 'materiales_tag', 'type' => 'text', 'default_value' => 'ESPECIFICACIÓN TÉCNICA & CALIDAD', 'wrapper' => array( 'width' => '50' ) ),
			array( 'key' => 'field_inicio_materiales_titulo', 'label' => 'Título de sección', 'name' => 'materiales_titulo', 'type' => 'text', 'default_value' => 'Materiales y fabricantes', 'wrapper' => array( 'width' => '50' ) ),
			array( 'key' => 'field_inicio_materiales_descripcion', 'label' => 'Descripción', 'name' => 'materiales_descripcion', 'type' => 'textarea', 'rows' => 2, 'default_value' => 'Soluciones y materiales seleccionados según las necesidades técnicas de cada proyecto.', 'instructions' => 'Nota: Los logotipos de fabricantes colaboradores se gestionan en "Fabricantes".' ),

			// Pestaña 8: Artículos de Conocimiento
			array( 'key' => 'tab_inicio_articulos', 'label' => '8. Bloque Artículos', 'type' => 'tab' ),
			array( 'key' => 'field_inicio_articulos_tag', 'label' => 'Etiqueta superior', 'name' => 'articulos_tag', 'type' => 'text', 'default_value' => 'BIBLIOTECA TÉCNICA', 'wrapper' => array( 'width' => '33' ) ),
			array( 'key' => 'field_inicio_articulos_titulo', 'label' => 'Título de sección', 'name' => 'articulos_titulo', 'type' => 'text', 'default_value' => 'Conocimiento', 'wrapper' => array( 'width' => '33' ) ),
			array( 'key' => 'field_inicio_articulos_cta_texto', 'label' => 'Texto botón enlace', 'name' => 'articulos_cta_texto', 'type' => 'text', 'default_value' => 'Ver todo', 'wrapper' => array( 'width' => '33' ), 'instructions' => 'Nota: Las publicaciones se redactan en el menú "Entradas".' ),

			// Pestaña 9: Contacto Final
			array( 'key' => 'tab_inicio_contacto', 'label' => '9. Bloque Contacto Final', 'type' => 'tab' ),
			array( 'key' => 'field_inicio_contacto_titulo', 'label' => 'Título de la llamada a la acción', 'name' => 'contacto_titulo', 'type' => 'textarea', 'rows' => 2, 'default_value' => "Hablemos de tu\npróximo proyecto." ),
			array( 'key' => 'field_inicio_contacto_descripcion', 'label' => 'Descripción', 'name' => 'contacto_descripcion', 'type' => 'textarea', 'rows' => 3, 'default_value' => 'Una única interlocución para coordinar arquitectura, compras, instalaciones y obra completa. Sin intermediarios ni imprevistos.', 'instructions' => 'Nota: Los teléfonos, email y dirección se configuran en "Ajustes del sitio".' ),
		),
	) );

	// -------------------------------------------------------------------------
	// 2. PROYECTOS
	// -------------------------------------------------------------------------
	acf_add_local_field_group( array(
		'key'          => 'group_proyecto',
		'title'        => 'Datos del Proyecto',
		'show_in_rest' => 1,
		'location'     => array( array( array( 'param' => 'post_type', 'operator' => '==', 'value' => 'proyecto' ) ) ),
		'fields'       => array(
			array( 'key' => 'field_proyecto_indice', 'label' => 'Índice (p. ej. 01)', 'name' => 'indice', 'type' => 'text', 'wrapper' => array( 'width' => '25' ) ),
			array( 'key' => 'field_proyecto_anio', 'label' => 'Año', 'name' => 'anio', 'type' => 'text', 'wrapper' => array( 'width' => '25' ) ),
			array( 'key' => 'field_proyecto_ubicacion', 'label' => 'Ubicación', 'name' => 'ubicacion', 'type' => 'text', 'wrapper' => array( 'width' => '50' ) ),
			array( 'key' => 'field_proyecto_tipologia', 'label' => 'Tipología', 'name' => 'tipologia', 'type' => 'text', 'wrapper' => array( 'width' => '50' ) ),
			array( 'key' => 'field_proyecto_cliente', 'label' => 'Cliente (p. ej. Cliente particular)', 'name' => 'cliente', 'type' => 'text', 'wrapper' => array( 'width' => '50' ) ),
			array( 'key' => 'field_proyecto_servicio', 'label' => 'Servicio relacionado (slug, p. ej. oficinas)', 'name' => 'servicio', 'type' => 'text', 'wrapper' => array( 'width' => '50' ) ),
			array( 'key' => 'field_proyecto_superficie', 'label' => 'Superficie (p. ej. 1.450 m²)', 'name' => 'superficie', 'type' => 'text', 'wrapper' => array( 'width' => '25' ) ),
			array( 'key' => 'field_proyecto_plazo', 'label' => 'Plazo de obra (p. ej. 20 semanas)', 'name' => 'plazo', 'type' => 'text', 'wrapper' => array( 'width' => '25' ) ),
			array( 'key' => 'field_proyecto_imagen', 'label' => 'Imagen del proyecto', 'name' => 'imagen', 'type' => 'image', 'return_format' => 'url' ),
			array( 'key' => 'field_proyecto_galeria', 'label' => 'Galería (imágenes adicionales)', 'name' => 'galeria', 'type' => 'gallery', 'return_format' => 'url' ),
			array( 'key' => 'field_proyecto_enlace', 'label' => 'Enlace', 'name' => 'enlace', 'type' => 'url' ),
			array( 'key' => 'field_proyecto_reto', 'label' => 'El reto', 'name' => 'reto', 'type' => 'textarea', 'rows' => 4, 'new_lines' => '', 'instructions' => 'Punto de partida: condicionantes y exigencias del encargo.' ),
			array( 'key' => 'field_proyecto_solucion', 'label' => 'La solución', 'name' => 'solucion', 'type' => 'textarea', 'rows' => 4, 'new_lines' => '', 'instructions' => 'Cómo se resolvió el encargo.' ),
			array( 'key' => 'field_proyecto_alcance', 'label' => 'Alcance de los trabajos', 'name' => 'alcance', 'type' => 'textarea', 'rows' => 6, 'new_lines' => '', 'instructions' => 'Una partida por línea.' ),
			array( 'key' => 'field_proyecto_cronograma', 'label' => 'Cronograma de la obra', 'name' => 'cronograma', 'type' => 'textarea', 'rows' => 6, 'new_lines' => '', 'instructions' => 'Una etapa por línea, con el formato «periodo | título | descripción». Ej.: Semanas 1–2 | Planificación | Levantamiento y plan de fases.' ),
			array( 'key' => 'field_proyecto_materiales', 'label' => 'Materiales y acabados', 'name' => 'materiales', 'type' => 'textarea', 'rows' => 6, 'new_lines' => '', 'instructions' => 'Uno por línea, con el formato «elemento | detalle». Ej.: Pavimentos | Madera natural de roble' ),
			array( 'key' => 'field_proyecto_resultado', 'label' => 'Resultado', 'name' => 'resultado', 'type' => 'textarea', 'rows' => 3, 'new_lines' => '', 'instructions' => 'Cierre del proyecto: qué se consiguió.' ),
			array( 'key' => 'field_proyecto_cifras', 'label' => 'Cifras destacadas', 'name' => 'cifras', 'type' => 'textarea', 'rows' => 4, 'new_lines' => '', 'instructions' => 'Una por línea, con el formato «valor | etiqueta». Ej.: 0 | días de cierre de la actividad' ),
		),
	) );

	// -------------------------------------------------------------------------
	// 3. SERVICIOS (Sectores)
	// -------------------------------------------------------------------------
	acf_add_local_field_group( array(
		'key'          => 'group_sector',
		'title'        => 'Datos del Servicio',
		'show_in_rest' => 1,
		'location'     => array( array( array( 'param' => 'post_type', 'operator' => '==', 'value' => 'sector' ) ) ),
		'fields'       => array(
			array( 'key' => 'field_sector_numero', 'label' => 'Número (p. ej. 01)', 'name' => 'numero', 'type' => 'text', 'wrapper' => array( 'width' => '25' ) ),
			array( 'key' => 'field_sector_enlace', 'label' => 'Enlace', 'name' => 'enlace', 'type' => 'url', 'wrapper' => array( 'width' => '75' ) ),
			array( 'key' => 'field_sector_descripcion', 'label' => 'Descripción', 'name' => 'descripcion', 'type' => 'textarea' ),
			array( 'key' => 'field_sector_imagen', 'label' => 'Imagen del servicio', 'name' => 'imagen', 'type' => 'image', 'return_format' => 'url' ),
		),
	) );

	// -------------------------------------------------------------------------
	// 4. FASES DEL MÉTODO
	// -------------------------------------------------------------------------
	acf_add_local_field_group( array(
		'key'          => 'group_fase',
		'title'        => 'Datos de la Fase',
		'show_in_rest' => 1,
		'location'     => array( array( array( 'param' => 'post_type', 'operator' => '==', 'value' => 'fase' ) ) ),
		'fields'       => array(
			array( 'key' => 'field_fase_tag', 'label' => 'Etiqueta (p. ej. 01 / FASE · CONSTRUCCIÓN)', 'name' => 'tag', 'type' => 'text' ),
			array( 'key' => 'field_fase_texto', 'label' => 'Descripción de la fase', 'name' => 'texto', 'type' => 'textarea' ),
			array( 'key' => 'field_fase_imagen', 'label' => 'Imagen de la fase', 'name' => 'imagen', 'type' => 'image', 'return_format' => 'url' ),
		),
	) );

	// -------------------------------------------------------------------------
	// 5. FABRICANTES Y MATERIALES
	// -------------------------------------------------------------------------
	acf_add_local_field_group( array(
		'key'          => 'group_fabricante',
		'title'        => 'Datos del Fabricante',
		'show_in_rest' => 1,
		'location'     => array( array( array( 'param' => 'post_type', 'operator' => '==', 'value' => 'fabricante' ) ) ),
		'fields'       => array(
			array( 'key' => 'field_fabricante_logo', 'label' => 'Logo', 'name' => 'logo', 'type' => 'image', 'return_format' => 'url' ),
			array( 'key' => 'field_fabricante_url', 'label' => 'Web', 'name' => 'url', 'type' => 'url' ),
		),
	) );

	// -------------------------------------------------------------------------
	// 6. SLIDES (Hero / Showcase)
	// -------------------------------------------------------------------------
	acf_add_local_field_group( array(
		'key'          => 'group_slide',
		'title'        => 'Datos de la Diapositiva',
		'show_in_rest' => 1,
		'location'     => array( array( array( 'param' => 'post_type', 'operator' => '==', 'value' => 'slide' ) ) ),
		'fields'       => array(
			array( 'key' => 'field_slide_grupo', 'label' => 'Grupo en la Portada', 'name' => 'grupo', 'type' => 'select', 'choices' => array( 'hero' => 'Hero (Carrusel de entrada)', 'showcase' => 'Showcase (Taller de soluciones)' ), 'default_value' => 'hero', 'wrapper' => array( 'width' => '25' ) ),
			array( 'key' => 'field_slide_alt', 'label' => 'Texto alternativo', 'name' => 'alt', 'type' => 'text', 'wrapper' => array( 'width' => '75' ) ),
			array( 'key' => 'field_slide_imagen', 'label' => 'Imagen', 'name' => 'imagen', 'type' => 'image', 'return_format' => 'url' ),
		),
	) );

	// -------------------------------------------------------------------------
	// 7. GUÍAS
	// -------------------------------------------------------------------------
	acf_add_local_field_group( array(
		'key'          => 'group_guia',
		'title'        => 'Datos de la Guía',
		'show_in_rest' => 1,
		'location'     => array( array( array( 'param' => 'post_type', 'operator' => '==', 'value' => 'guia' ) ) ),
		'fields'       => array(
			array( 'key' => 'field_guia_numero', 'label' => 'Número (p. ej. 01)', 'name' => 'numero', 'type' => 'text', 'wrapper' => array( 'width' => '25' ) ),
			array( 'key' => 'field_guia_tema', 'label' => 'Tema (p. ej. PLANIFICACIÓN)', 'name' => 'tema', 'type' => 'text', 'wrapper' => array( 'width' => '50' ) ),
			array( 'key' => 'field_guia_lectura', 'label' => 'Tiempo de lectura (p. ej. 8 min)', 'name' => 'lectura', 'type' => 'text', 'wrapper' => array( 'width' => '25' ) ),
			array( 'key' => 'field_guia_descripcion', 'label' => 'Descripción', 'name' => 'descripcion', 'type' => 'textarea' ),
			array( 'key' => 'field_guia_imagen', 'label' => 'Imagen de la guía', 'name' => 'imagen', 'type' => 'image', 'return_format' => 'url' ),
		),
	) );

	// -------------------------------------------------------------------------
	// 8. DESCARGAS
	// -------------------------------------------------------------------------
	acf_add_local_field_group( array(
		'key'          => 'group_descarga',
		'title'        => 'Datos de la Descarga',
		'show_in_rest' => 1,
		'location'     => array( array( array( 'param' => 'post_type', 'operator' => '==', 'value' => 'descarga' ) ) ),
		'fields'       => array(
			array( 'key' => 'field_descarga_descripcion', 'label' => 'Descripción (una línea)', 'name' => 'descripcion', 'type' => 'textarea', 'rows' => 3, 'new_lines' => '' ),
			array( 'key' => 'field_descarga_archivo', 'label' => 'Archivo (ruta o URL del PDF)', 'name' => 'archivo', 'type' => 'text', 'instructions' => 'Ruta de un archivo de la web (p. ej. /descargas/checklist.pdf) o URL completa de uno subido a la biblioteca de medios.' ),
			array( 'key' => 'field_descarga_formato', 'label' => 'Formato (p. ej. PDF)', 'name' => 'formato', 'type' => 'text', 'wrapper' => array( 'width' => '25' ) ),
			array( 'key' => 'field_descarga_peso', 'label' => 'Peso (p. ej. 120 KB)', 'name' => 'peso', 'type' => 'text', 'wrapper' => array( 'width' => '25' ) ),
			array( 'key' => 'field_descarga_guia', 'label' => 'Guía relacionada (slug)', 'name' => 'guia', 'type' => 'text', 'wrapper' => array( 'width' => '50' ), 'instructions' => 'Slug de la guía a la que acompaña, p. ej. planificar-reforma-integral.' ),
		),
	) );

	// -------------------------------------------------------------------------
	// 9. AJUSTES DEL SITIO
	// -------------------------------------------------------------------------
	acf_add_local_field_group( array(
		'key'          => 'group_ajuste',
		'title'        => 'Datos de contacto y marca',
		'show_in_rest' => 1,
		'location'     => array( array( array( 'param' => 'post_type', 'operator' => '==', 'value' => 'ajuste' ) ) ),
		'fields'       => array(
			array( 'key' => 'field_ajuste_telefono', 'label' => 'Teléfono', 'name' => 'telefono', 'type' => 'text', 'wrapper' => array( 'width' => '50' ) ),
			array( 'key' => 'field_ajuste_email', 'label' => 'Email', 'name' => 'email', 'type' => 'text', 'wrapper' => array( 'width' => '50' ) ),
			array( 'key' => 'field_ajuste_whatsapp', 'label' => 'WhatsApp (solo números con prefijo)', 'name' => 'whatsapp', 'type' => 'text', 'wrapper' => array( 'width' => '50' ) ),
			array( 'key' => 'field_ajuste_horario', 'label' => 'Horario', 'name' => 'horario', 'type' => 'text', 'wrapper' => array( 'width' => '50' ) ),
			array( 'key' => 'field_ajuste_direccion', 'label' => 'Dirección', 'name' => 'direccion', 'type' => 'textarea' ),
			array( 'key' => 'field_ajuste_linkedin', 'label' => 'LinkedIn', 'name' => 'linkedin', 'type' => 'url', 'wrapper' => array( 'width' => '33' ) ),
			array( 'key' => 'field_ajuste_facebook', 'label' => 'Facebook', 'name' => 'facebook', 'type' => 'url', 'wrapper' => array( 'width' => '33' ) ),
			array( 'key' => 'field_ajuste_instagram', 'label' => 'Instagram', 'name' => 'instagram', 'type' => 'url', 'wrapper' => array( 'width' => '33' ) ),
		),
	) );
} );
