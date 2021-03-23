<?php
namespace KaliForms;

if ( ! defined( 'ABSPATH' ) ) {
	die;
}

/**
 * Class KaliForms_Autoloader
 */
class KaliForms_Autoloader {
	/**
	 * KaliForms_Autoloader constructor.
	 */
	public function __construct() {
		spl_autoload_register( [ $this, 'load' ] );
	}

	/**
	 * Load the class name
	 *
	 * @param string $filename
	 */
	public function load( $filename = '' ) {
		/**
		 * Explode namespace
		 * (SPL AUTOLOAD REGISTER receives something like Inc/KaliForms or Inc/Console/Command)
		 */
		$fp = explode( '\\', $filename );

		$cf = $this->format_class_name( $fp );

		/**
		 * Get plugin root
		 */
		$path = trailingslashit( dirname( __FILE__ ) );

		/**
		 * Build path based on the explode from before
		 */
		for ( $i = 1; $i < count( $fp ) - 1; $i ++ ) {
			$path .= trailingslashit( $fp[ $i ] );
		}

		/**
		 * Append class name
		 */
		$path .= $cf;

		$this->include_file( $path );
	}

	/**
	 * Include file
	 *
	 * @param string $path
	 */
	public function include_file( $path = '' ) {
		/**
		 * If it exists, include it.
		 */
		if ( file_exists( $path ) ) {
			include_once $path;
		}
	}

	/**
	 * Formats the class name and returns it
	 *
	 * @param array $fp
	 *
	 * @return string
	 */
	public function format_class_name( $fp = [] ) {
		$cf = '';
		/**
		 * We need to get the last index, that's the class name
		 */
		if ( isset( $fp[ count( $fp ) - 1 ] ) ) {
			/**
			 * turn it lowercase
			 */
			$cf = strtolower( $fp[ count( $fp ) - 1 ] );
			/**
			 * Format class file according to standards
			 */
			$cf = str_ireplace( '_', '-', $cf );
			/**
			 * prepend class-
			 */
			$cf = sprintf( 'class-%s.php', $cf );
		}

		return $cf;
	}
}

new KaliForms_Autoloader();
