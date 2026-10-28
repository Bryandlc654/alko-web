<?php
/**
 * Plugin Name: ALKO Admin Theme
 * Description: Restyles the WordPress admin (sidebar, top bar, cards, forms, login) with the ALKO panel look.
 * Version: 1.0.1
 * Author: ALKO
 * Text Domain: alko-admin-theme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const ALKO_ADMIN_THEME_VERSION = '1.0.1';

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
