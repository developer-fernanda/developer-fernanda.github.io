<?php

namespace KaliForms\Inc\Backend\BuilderFormFields;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Radio
 *
 * @package Inc\Backend\BuilderFormFields
 */
class Radio extends Form_Field {
	/**
	 * @var string
	 */
	public $id = 'radio';
	/**
	 * @var string
	 */
	public $type = 'radio';

	/**
	 * Radio constructor.
	 *
	 * @param $args
	 */
	public function __construct( $args ) {
		parent::__construct( $args );
		$this->label = esc_html__( 'Radio', 'kaliforms' );
	}
}
