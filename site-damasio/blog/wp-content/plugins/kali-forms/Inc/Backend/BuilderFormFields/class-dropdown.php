<?php

namespace KaliForms\Inc\Backend\BuilderFormFields;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Dropdown
 *
 * @package Inc\Backend\BuilderFormFields
 */
class Dropdown extends Form_Field {
	/**
	 * @var string
	 */
	public $id = 'dropdown';
	/**
	 * @var string
	 */
	public $type = 'dropdown';

	/**
	 * Dropdown constructor.
	 *
	 * @param $args
	 */
	public function __construct( $args ) {
		parent::__construct( $args );
		$this->label = esc_html__( 'Dropdown', 'kaliforms' );
	}
}
