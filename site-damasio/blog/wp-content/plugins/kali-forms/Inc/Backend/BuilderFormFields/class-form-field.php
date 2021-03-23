<?php
namespace KaliForms\Inc\Backend\BuilderFormFields;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Class Form_Field
 *
 * @package Inc\BuilderFormFields
 */
abstract class Form_Field
{
    /**
     * @var array
     */
    public $properties;
    /**
     * @var
     */
    public $id;
    /**
     * @var
     */
    public $label;
    /**
     * @var
     */
    public $type;
    /**
     *
     * @var
     */
    public $icon;
    /**
     * is the field constraint to a certain size?
     *
     * @var [number|string]
     */
    public $constraint = 'none';
    /**
     * FormField constructor.
     *
     * @param $args
     */
    public function __construct($args)
    {
        $this->set_common_props();
        $this->set_icon();
        $this->set_properties($args);
    }

    /**
     * Sets the icon
     *
     * @return void
     */
    public function set_icon()
    {
        $this->icon = 'icon-' . $this->id;
    }

    /**
     * Remove props from the array
     *
     * @param [type] $args
     * @return void
     */
    public function remove_props($args)
    {
        foreach ($args as $k) {
            unset($this->properties[$k]);
        }
    }

    /**
     * Remove a single prop
     *
     * @param [type] $key
     * @return void
     */
    public function remove_prop($key)
    {
        unset($this->properties[$key]);
    }

    /**
     * Sets common props
     */
    public function set_common_props()
    {
        $this->properties = [
            'id' => [
                'label' => esc_html__('Field id', 'kaliforms'),
                'type' => 'textbox',
                'value' => $this->id,
                'group' => 'advanced',
            ],
            'name' => [
                'label' => esc_html__('Field name', 'kaliforms'),
                'type' => 'textbox',
                'value' => $this->id,
                'group' => 'general',
            ],
            'caption' => [
                'label' => esc_html__('Field caption/label', 'kaliforms'),
                'type' => 'textbox',
                'value' => '',
                'group' => 'general',
            ],
            'description' => [
                'label' => esc_html__('Field description', 'kaliforms'),
                'type' => 'textbox',
                'value' => '',
                'group' => 'general',
            ],
            'default' => [
                'label' => esc_html__('Default value', 'kaliforms'),
                'type' => 'textbox',
                'value' => '',
                'group' => 'advanced',
            ],
        ];
    }

    /**
     * @param $value
     */
    public function set_properties($value)
    {
        $this->properties = wp_parse_args($value, $this->properties);
    }
}
