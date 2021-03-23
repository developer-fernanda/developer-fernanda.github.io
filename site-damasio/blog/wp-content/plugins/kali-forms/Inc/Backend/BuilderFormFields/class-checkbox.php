<?php

namespace KaliForms\Inc\Backend\BuilderFormFields;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Class Checkbox
 *
 * @package Inc\Backend\BuilderFormFields
 */
class Checkbox extends Form_Field
{
    /**
     * @var string
     */
    public $id = 'checkbox';
    /**
     * @var string
     */
    public $type = 'checkbox';

    /**
     * Checkbox constructor.
     *
     * @param $args
     */
    public function __construct($args)
    {
        parent::__construct($args);
        $this->icon  = 'icon-checkbox-activated';
        $this->label = esc_html__('Checkbox', 'kaliforms');
    }
}
