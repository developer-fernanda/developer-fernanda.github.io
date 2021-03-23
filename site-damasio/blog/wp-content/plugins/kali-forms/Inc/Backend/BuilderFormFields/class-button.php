<?php

namespace KaliForms\Inc\Backend\BuilderFormFields;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Class Button
 *
 * @package Inc\Backend\BuilderFormFields
 */
class Button extends Form_Field
{
    /**
     * @var string
     */
    public $id = 'button';
    /**
     * @var string
     */
    public $type = 'button';
    /**
     * Button constructor.
     *
     * @param $args
     */
    public function __construct($args)
    {
        parent::__construct($args);
        $this->icon = 'icon-button';
        $this->label = esc_html__('Button', 'kaliforms');
    }
    /**
     * Sets common props
     */
    public function set_common_props()
    {
        $this->properties = [
            'id' => [
                'label' => esc_html__('Button id', 'kaliforms'),
                'type' => 'textbox',
                'value' => $this->id,
                'group' => 'advanced',
            ],
            'clickAction' => [
                'label' => esc_html__('Function to run on click', 'kaliforms'),
                'type' => 'textbox',
                'value' => '',
                'group' => 'advanced',
            ],
            'caption' => [
                'label' => esc_html__('Button caption/label', 'kaliforms'),
                'type' => 'textbox',
                'value' => '',
            ],
            'description' => [
                'label' => esc_html__('Button description', 'kaliforms'),
                'type' => 'textbox',
                'value' => '',
            ],
        ];
    }
}
