<?php
namespace KaliForms\Inc\Backend\BuilderFormFields;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Class Product
 *
 * @package Inc\Backend\BuilderFormFields
 */
class Product extends Form_Field
{
    /**
     * @var string
     */
    public $id = 'product';
    /**
     * @var string
     */
    public $type = 'product';

    /**
     * Product constructor.
     *
     * @param $args
     */
    public function __construct($args)
    {
        parent::__construct($args);
        $this->label = esc_html__('Product', 'kaliforms');
        
        $this->remove_prop('default');
    }
}
