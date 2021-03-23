<?php

namespace KaliForms\Inc\Frontend\FormFields;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Class Donation
 *
 * @package Inc\Frontend\FormFields;
 */
class Donation extends Form_Field
{
    /**
     * Class constructor
     */
    public function __construct()
    {
        $this->id = 'donation';
    }

    /**
     * Render function
     *
     * @return void
     */
    public function render($item, $form_info)
    {
        $item['kali-form-type'] = 'donation';
        $item['type']           = $item['donationType'] === 'custom' ? 'number' : 'select';

        $attributes = $this->generate_attribute_string($item);
        $offset     = isset($item['offset']) && $item['offset'] > 0 ? 'offset-md-' . absint($item['offset']) : '';
        $div        = '<div class="col-12 col-md-' . absint($item['col']) . ' ' . $offset . '">';
        $div .= $item['donationType'] === 'custom'
        ? $this->_render_custom($attributes, $item, $form_info)
        : $this->_render_fixed($attributes, $item, $form_info);
        $div .= '</div>';

        return $div;
    }

    /**
     * Render a custom function
     *
     * @param [type] $attributes
     * @param [type] $item
     * @param [type] $form_info
     * @return void
     */
    public function _render_custom($attributes, $item, $form_info)
    {
        $div = '';
        $div .= $this->generate_label($item, $form_info);
        $div .= '<input step=".01" ' . $attributes . '>';
        return $div;
    }

    /**
     * Render fixed amount
     *
     * @param [type] $attributes
     * @param [type] $item
     * @param [type] $form_info
     * @return void
     */
    public function _render_fixed($attributes, $item, $form_info)
    {

        $div = '';
        $div .= $this->generate_label($item, $form_info);
        $div .= '<select ' . $attributes . '>';
        foreach ($item['choices'] as $choice) {
            $defaultValue = $this->default_value($item, $item['default']);
            $selected     = $choice->value === $defaultValue ? 'selected' : '';

            $div .= '<option value="' . $choice->value . '" ' . $selected . '>' . $choice->label . '</option>';
        }
        $div .= '</select>';
        return $div;
    }
}
