<?php
namespace KaliForms\Inc\Backend\BuilderFormFields;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Email
 *
 * @package Inc\Backend\BuilderFormFields
 */
class Email extends Form_Field {
	/**
	 * @var string
	 */
	public $id = 'email';
	/**
	 * @var string
	 */
	public $type = 'email';

	/**
	 * TextBox constructor.
	 *
	 * @param $args
	 */
	public function __construct( $args ) {
		parent::__construct( $args );
		$this->label = esc_html__( 'Email', 'kaliforms' );
	}
}
