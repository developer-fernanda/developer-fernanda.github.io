<?php

namespace KaliForms\Inc\Backend\BuilderFormFields;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Class FreeText
 *
 * @package Inc\Backend\BuilderFormFields
 */
class FreeText extends Form_Field
{
    /**
     * @var string
     */
    public $id = 'freeText';
    /**
     * @var string
     */
    public $type = 'freeText';
    /**
     * FreeText constructor.
     *
     * @param $args
     */
    public function __construct($args)
    {
        parent::__construct($args);
        $this->icon  = 'icon-free-text';
        $this->label = esc_html__('Free Text', 'kaliforms');
    }
    /**
     * Sets common props
     */
    public function set_common_props()
    {
        $this->properties = [
            'id'   => [
                'label' => esc_html__('Free text id', 'kaliforms'),
                'type'  => 'textbox',
                'value' => $this->id,
            ],
            'name' => [
                'label' => esc_html__('Field name', 'kaliforms'),
                'type'  => 'textbox',
                'value' => $this->id,
            ],
        ];
    }
}
