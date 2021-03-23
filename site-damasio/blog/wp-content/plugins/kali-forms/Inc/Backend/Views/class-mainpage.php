<?php

namespace KaliForms\Inc\Backend\Views;

if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Class MainPage
 *
 * @package App\Views
 */
class MainPage {
	/**
	 * Plugin slug
	 *
	 * @var string
	 */
	protected $slug = 'kaliforms';

	/**
	 * MainPage constructor.
	 */
	public function __construct() {
	}

	/**
	 * Renders app
	 */
	public function render_app() {
		echo '<div id="kaliforms-app"></div>';
	}

	/**
	 * Invoking the class will render the app
	 */
	public function __invoke() {
		/**
		 * Initiate an action before rendering the app div
		 */
		do_action( $this->slug . '_before_app_rendering' );

		/**
		 * Echo the container
		 */
		$this->render_app();

		/**
		 * Initiate an action after rendering the app div
		 */
		do_action( $this->slug . '_after_app_rendering' );
	}
}
