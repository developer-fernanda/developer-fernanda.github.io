<?php
namespace KaliForms\Inc\Backend\BuilderFormFields;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Class PayPal
 *
 * @package Inc\Backend\BuilderFormFields
 */
class PayPal extends Form_Field
{
    /**
     * @var string
     */
    public $id = 'paypal';
    /**
     * @var string
     */
    public $type = 'paypal';

    /**
     * PayPal constructor.
     *
     * @param $args
     */
    public function __construct($args)
    {
        parent::__construct($args);
        $this->label = esc_html__('PayPal', 'kaliforms');

        $this->remove_props(['name', 'default', 'caption', 'description']);
    }
}
