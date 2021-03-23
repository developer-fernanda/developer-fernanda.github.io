<?php

namespace KaliForms\Inc\Backend\BuilderFormFields;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Class TextBox
 *
 * @package Inc\Backend\BuilderFormFields
 */
class TextBox extends Form_Field
{
    /**
     * @var string
     */
    public $id = 'textbox';
    /**
     * @var string
     */
    public $type = 'textbox';

    /**
     * TextBox constructor.
     *
     * @param $args
     */
    public function __construct($args)
    {
        parent::__construct($args);
        $this->icon  = 'icon-text';
        $this->label = esc_html__('Text box', 'kaliforms');
    }
}
