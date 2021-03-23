<?php

namespace KaliForms\Inc\Backend\BuilderFormFields;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Class Submit_Button
 *
 * @package Inc\Backend\BuilderFormFields
 */
class Submit_Button extends Button
{
    /**
     * @var string
     */
    public $id = 'submitButton';
    /**
     * @var string
     */
    public $type = 'submitButton';
    /**
     * Button constructor.
     *
     * @param $args
     */
    public function __construct($args)
    {
        parent::__construct($args);
        $this->label = esc_html__('Submit Button', 'kaliforms');
        $this->icon  = 'icon-button';
        $this->remove_props(['clickAction']);
    }
}
