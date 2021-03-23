<?php

namespace KaliForms\Inc\Backend\Views\Metaboxes;

if ( ! defined( 'WPINC' ) ) {
	die;
}

class Metabox {
	/**
	 * @var string
	 */
	protected $slug = 'kaliforms';

	/**
	 * Invoke magic method
	 */
	public function __invoke() {
		$this->render_box();
	}

	/**
	 * Renders the metabox
	 */
	public function render_box() {

	}
}
