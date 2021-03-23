<?php

namespace KaliForms\Inc\Backend\BuilderFormFields;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Date
 *
 * @package Inc\Backend\BuilderFormFields
 */
class Date extends Form_Field {
	/**
	 * @var string
	 */
	public $id = 'date';
	/**
	 * @var string
	 */
	public $type = 'date';

	/**
	 * Date constructor.
	 *
	 * @param $args
	 */
	public function __construct( $args ) {
		parent::__construct( $args );
		$this->icon = 'icon-data-picker';
		$this->label = esc_html__( 'Date field', 'kaliforms' );
	}
}
