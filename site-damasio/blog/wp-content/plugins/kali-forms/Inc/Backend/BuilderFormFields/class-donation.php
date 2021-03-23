<?php
namespace KaliForms\Inc\Backend\BuilderFormFields;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Class Donation
 *
 * @package Inc\Backend\BuilderFormFields
 */
class Donation extends Form_Field
{
    /**
     * @var string
     */
    public $id = 'donation';
    /**
     * @var string
     */
    public $type = 'donation';
    /**
     * Product constructor.
     *
     * @param $args
     */
    public function __construct($args)
    {
        parent::__construct($args);
        $this->label = esc_html__('Donation', 'kaliforms');
    }
}
