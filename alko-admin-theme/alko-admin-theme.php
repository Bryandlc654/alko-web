<?php
/**
 * Plugin Name: ALKO Admin Theme
 * Description: Restyles the WordPress admin (sidebar, top bar, cards, forms, login) with the ALKO panel look.
 * Version: 1.1.0
 * Author: ALKO
 * Text Domain: alko-admin-theme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const ALKO_ADMIN_THEME_VERSION = '1.1.0';

/** Hoja de estilos compartida (admin y login). */
function alko_admin_theme_enqueue() {
	wp_enqueue_style(
		'alko-admin-font',
		'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
		array(),
		null
	);
	wp_enqueue_style(
		'alko-admin-theme',
		plugins_url( 'admin.css', __FILE__ ),
		array( 'alko-admin-font' ),
		ALKO_ADMIN_THEME_VERSION
	);
}
add_action( 'admin_enqueue_scripts', 'alko_admin_theme_enqueue' );
add_action( 'login_enqueue_scripts', 'alko_admin_theme_enqueue' );

/** Marca en la barra superior: nombre del sitio y "Panel de gestión · Rol". */
function alko_admin_theme_bar( $bar ) {
	$bar->remove_node( 'wp-logo' );
	$user = wp_get_current_user();
	$role = '';
	if ( ! empty( $user->roles ) ) {
		$names = wp_roles()->role_names;
		$role  = isset( $names[ $user->roles[0] ] ) ? translate_user_role( $names[ $user->roles[0] ] ) : '';
	}
	$bar->add_node(
		array(
			'id'    => 'alko-brand',
			'title' => '<span class="alko-brand-name">' . esc_html( get_bloginfo( 'name' ) ) . '</span><span class="alko-brand-sub">Panel de gestión' . ( $role ? ' · ' . esc_html( $role ) : '' ) . '</span>',
			'href'  => admin_url(),
		)
	);
}
add_action( 'admin_bar_menu', 'alko_admin_theme_bar', 5 );

/** Pie del admin sin la nota de WordPress. */
add_filter( 'admin_footer_text', '__return_empty_string' );
add_filter( 'update_footer', '__return_empty_string', 99 );

/** Login: el logo enlaza a la web y muestra el nombre del sitio. */
add_filter( 'login_headerurl', 'home_url' );
add_filter( 'login_headertext', 'get_bloginfo' );

/**
 * Redirige automáticamente el listado de 'inicio' directamente al editor de la portada.
 */
add_action( 'current_screen', function( $screen ) {
	if ( $screen && $screen->id === 'edit-inicio' && ! isset( $_GET['trashed'] ) ) {
		$posts = get_posts( array(
			'post_type'      => 'inicio',
			'posts_per_page' => 1,
			'post_status'    => 'any',
		) );
		if ( ! empty( $posts ) ) {
			wp_safe_redirect( admin_url( 'post.php?post=' . $posts[0]->ID . '&action=edit' ) );
			exit;
		}
	}
} );

/**
 * Banner superior exclusivo para la pantalla de Página de Inicio.
 */
add_action( 'edit_form_top', function( $post ) {
	if ( ! $post || $post->post_type !== 'inicio' ) {
		return;
	}
	?>
	<div class="alko-inicio-hero-banner">
		<div class="alko-inicio-hero-left">
			<span class="alko-inicio-pill"><span class="dashicons dashicons-admin-home"></span> Portada Web</span>
			<h2 class="alko-inicio-title">Configuración de la Página de Inicio</h2>
			<p class="alko-inicio-desc">
				Edita los textos, imágenes de cabecera y contenidos modulares que se muestran en la portada.
				Los catálogos (Servicios, Proyectos, Artículos, Fabricantes) se nutren automáticamente de sus propios gestores.
			</p>
		</div>
		<div class="alko-inicio-hero-actions">
			<button type="button" class="button button-primary alko-btn-save-hero" onclick="document.getElementById('publish').click();">
				<span class="dashicons dashicons-saved"></span> Guardar cambios
			</button>
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>" target="_blank" class="button alko-btn-view-hero">
				<span class="dashicons dashicons-external"></span> Ver web en vivo
			</a>
		</div>
	</div>
	<?php
} );

/**
 * Barra inferior fija (Sticky Save Bar) para guardar cambios cómodamente.
 */
add_action( 'edit_form_after_editor', function( $post ) {
	if ( ! $post || $post->post_type !== 'inicio' ) {
		return;
	}
	?>
	<div class="alko-sticky-footer-bar">
		<div class="alko-sticky-info">
			<span class="alko-dot-live"></span>
			<strong>Página de Inicio</strong> &mdash; <span>Recuerda guardar al terminar de editar cualquier bloque</span>
		</div>
		<div class="alko-sticky-actions">
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>" target="_blank" class="button alko-sticky-btn-view">
				Ver portada ↗
			</a>
			<button type="button" class="button button-primary alko-sticky-btn-save" onclick="document.getElementById('publish').click();">
				<span class="dashicons dashicons-saved"></span> Guardar cambios en Portada
			</button>
		</div>
	</div>
	<?php
} );
