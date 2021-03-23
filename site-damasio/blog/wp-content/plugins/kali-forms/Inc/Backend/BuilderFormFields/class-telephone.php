<?php
namespace KaliForms\Inc\Backend\BuilderFormFields;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Telephone
 *
 * @package Inc\Backend\BuilderFormFields
 */
class Telephone extends Form_Field {
	/**
	 * @var string
	 */
	public $id = 'telephone';
	/**
	 * @var string
	 */
	public $type = 'telephone';

	/**
	 * TextBox constructor.
	 *
	 * @param $args
	 */
	public function __construct( $args ) {
		parent::__construct( $args );
		$this->icon = 'icon-phone';
		$this->label = esc_html__( 'Phone', 'kaliforms' );
	}
}
