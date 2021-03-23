<?php
namespace KaliForms\Inc\Backend\BuilderFormFields;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Url
 *
 * @package Inc\Backend\BuilderFormFields
 */
class Url extends Form_Field {
	/**
	 * @var string
	 */
	public $id = 'url';
	/**
	 * @var string
	 */
	public $type = 'url';

	/**
	 * TextBox constructor.
	 *
	 * @param $args
	 */
	public function __construct( $args ) {
		parent::__construct( $args );
		$this->label = esc_html__( 'URL', 'kaliforms' );
	}
}
