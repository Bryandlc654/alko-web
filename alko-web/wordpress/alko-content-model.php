<?php
/**
 * Plugin Name:       ALKO Content Model (Headless)
 * Description:       Registra los tipos de contenido (CPT) y los campos SCF/ACF que consume el front-end Next.js de ALKO.
 * Version:           1.3.0
 * Author:            ALKO
 *
 * Requiere "Secure Custom Fields" o "Advanced Custom Fields" activo (no se usa la
 * cabecera "Requires Plugins" para admitir cualquiera de los dos).
 *
 * INSTALACIÓN
 * -----------
 * 1. Coloca este archivo en  wp-content/mu-plugins/  (recomendado) o actívalo como plugin normal.
 * 2. Asegúrate de que el plugin "Secure Custom Fields" (SCF) o Advanced Custom Fields está activo.
 * 3. Ve a  Ajustes → Enlaces permanentes  y pulsa "Guardar" una vez (para refrescar las rutas REST).
 * 4. En el front-end, define la variable WP_API_URL con la URL de este WordPress.
 *
 * Los campos están expuestos en la REST API (show_in_rest) bajo la clave "acf" de cada entrada:
 *   GET /wp-json/wp/v2/proyectos?_embed
 *   GET /wp-json/wp/v2/sectores?_embed
 *   GET /wp-json/wp/v2/fases?_embed
 *   GET /wp-json/wp/v2/fabricantes?_embed
 *   GET /wp-json/wp/v2/slides?_embed
 *   GET /wp-json/wp/v2/guias?_embed
 *   GET /wp-json/wp/v2/ajustes?per_page=1
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Tipos de contenido personalizados.
 */
add_action( 'init', function () {

	register_post_type( 'proyecto', array(
		'labels'       => array(
			'name'          => 'Proyectos',
			'singular_name' => 'Proyecto',
			'add_new_item'  => 'Añadir Proyecto',
			'edit_item'     => 'Editar Proyecto',
			'all_items'     => 'Todos los Proyectos',
		),
		'public'        => true,
		'show_in_rest'  => true,
		'has_archive'   => true,
		'rest_base'     => 'proyectos',
		'menu_icon'     => 'dashicons-building',
		'menu_position' => 20,
		'supports'      => array( 'title', 'editor', 'thumbnail', 'excerpt', 'page-attributes' ),
	) );

	register_post_type( 'sector', array(
		'labels'        => array(
			'name'          => 'Sectores',
			'singular_name' => 'Sector',
			'add_new_item'  => 'Añadir Sector',
			'edit_item'     => 'Editar Sector',
			'all_items'     => 'Todos los Sectores',
		),
		'public'        => true,
		'show_in_rest'  => true,
		'rest_base'     => 'sectores',
		'menu_icon'     => 'dashicons-category',
		'menu_position' => 21,
		'supports'      => array( 'title', 'editor', 'thumbnail', 'page-attributes' ),
	) );

	register_post_type( 'fase', array(
		'labels'        => array(
			'name'          => 'Fases del proceso',
			'singular_name' => 'Fase',
			'add_new_item'  => 'Añadir Fase',
			'edit_item'     => 'Editar Fase',
			'all_items'     => 'Todas las Fases',
		),
		'public'        => true,
		'show_in_rest'  => true,
		'rest_base'     => 'fases',
		'menu_icon'     => 'dashicons-list-view',
		'menu_position' => 22,
		'supports'      => array( 'title', 'editor', 'thumbnail', 'page-attributes' ),
	) );

	register_post_type( 'fabricante', array(
		'labels'        => array(
			'name'          => 'Materiales y fabricantes',
			'singular_name' => 'Fabricante',
			'add_new_item'  => 'Añadir Fabricante',
			'edit_item'     => 'Editar Fabricante',
			'all_items'     => 'Todos los Fabricantes',
		),
		'public'        => true,
		'show_in_rest'  => true,
		'rest_base'     => 'fabricantes',
		'menu_icon'     => 'dashicons-awards',
		'menu_position' => 23,
		'supports'      => array( 'title', 'thumbnail', 'page-attributes' ),
	) );

	register_post_type( 'slide', array(
		'labels'        => array(
			'name'          => 'Slides (Hero y Showcase)',
			'singular_name' => 'Slide',
			'add_new_item'  => 'Añadir Slide',
			'edit_item'     => 'Editar Slide',
			'all_items'     => 'Todos los Slides',
		),
		'public'        => true,
		'show_in_rest'  => true,
		'rest_base'     => 'slides',
		'menu_icon'     => 'dashicons-images-alt2',
		'menu_position' => 24,
		'supports'      => array( 'title', 'thumbnail', 'page-attributes' ),
	) );

	register_post_type( 'guia', array(
		'labels'        => array(
			'name'          => 'Guías',
			'singular_name' => 'Guía',
			'add_new_item'  => 'Añadir Guía',
			'edit_item'     => 'Editar Guía',
			'all_items'     => 'Todas las Guías',
		),
		'public'        => true,
		'show_in_rest'  => true,
		'rest_base'     => 'guias',
		'menu_icon'     => 'dashicons-book-alt',
		'menu_position' => 26,
		'supports'      => array( 'title', 'editor', 'thumbnail', 'excerpt', 'page-attributes' ),
	) );

	register_post_type( 'ajuste', array(
		'labels'        => array(
			'name'          => 'Ajustes del sitio',
			'singular_name' => 'Ajuste',
			'add_new_item'  => 'Añadir Ajuste',
			'edit_item'     => 'Editar Ajuste',
			'all_items'     => 'Ajustes del sitio',
		),
		'public'             => true,
		'publicly_queryable' => false,
		'exclude_from_search' => true,
		'has_archive'        => false,
		'show_ui'            => true,
		'show_in_rest'       => true,
		'rest_base'          => 'ajustes',
		'menu_icon'          => 'dashicons-admin-generic',
		'menu_position'      => 25,
		'supports'           => array( 'title' ),
	) );
} );

/**
 * Grupos de campos (SCF / ACF).
 */
add_action( 'acf/include_fields', function () {

	if ( ! function_exists( 'acf_add_local_field_group' ) ) {
		return;
	}

	// Proyectos.
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

	// Sectores.
	acf_add_local_field_group( array(
		'key'          => 'group_sector',
		'title'        => 'Datos del Sector',
		'show_in_rest' => 1,
		'location'     => array( array( array( 'param' => 'post_type', 'operator' => '==', 'value' => 'sector' ) ) ),
		'fields'       => array(
			array( 'key' => 'field_sector_numero', 'label' => 'Número (p. ej. 01)', 'name' => 'numero', 'type' => 'text', 'wrapper' => array( 'width' => '25' ) ),
			array( 'key' => 'field_sector_enlace', 'label' => 'Enlace', 'name' => 'enlace', 'type' => 'url', 'wrapper' => array( 'width' => '75' ) ),
			array( 'key' => 'field_sector_descripcion', 'label' => 'Descripción', 'name' => 'descripcion', 'type' => 'textarea' ),
			array( 'key' => 'field_sector_imagen', 'label' => 'Imagen del sector', 'name' => 'imagen', 'type' => 'image', 'return_format' => 'url' ),
		),
	) );

	// Fases.
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

	// Fabricantes.
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

	// Slides.
	acf_add_local_field_group( array(
		'key'          => 'group_slide',
		'title'        => 'Datos del Slide',
		'show_in_rest' => 1,
		'location'     => array( array( array( 'param' => 'post_type', 'operator' => '==', 'value' => 'slide' ) ) ),
		'fields'       => array(
			array( 'key' => 'field_slide_grupo', 'label' => 'Grupo', 'name' => 'grupo', 'type' => 'select', 'choices' => array( 'hero' => 'Hero', 'showcase' => 'Showcase' ), 'default_value' => 'hero', 'wrapper' => array( 'width' => '25' ) ),
			array( 'key' => 'field_slide_alt', 'label' => 'Texto alternativo', 'name' => 'alt', 'type' => 'text', 'wrapper' => array( 'width' => '75' ) ),
			array( 'key' => 'field_slide_imagen', 'label' => 'Imagen', 'name' => 'imagen', 'type' => 'image', 'return_format' => 'url' ),
		),
	) );

	// Guías.
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

	// Ajustes del sitio.
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
