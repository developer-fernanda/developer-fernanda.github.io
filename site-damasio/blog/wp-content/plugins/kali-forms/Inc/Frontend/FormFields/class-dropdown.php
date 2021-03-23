<?php
namespace KaliForms\Inc\Frontend\FormFields;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Class DropDown
 *
 * @package Inc\Frontend\FormFields;
 */
class DropDown extends Form_Field
{
    /**
     * Class constructor
     */
    public function __construct()
    {
        $this->id = 'dropdown';
    }

    /**
     * Render function
     *
     * @return void
     */
    public function render($item, $form_info)
    {
		$item['class'] = 'input';

        $attributes = $this->generate_attribute_string($item);

        $offset = isset($item['offset']) && $item['offset'] > 0 ? 'offset-md-' . absint($item['offset']) : '';
        $div = '<div class="col-12 col-md-' . absint($item['col']) . ' ' . $offset . '">';
        $div .= $this->generate_label($item, $form_info);
        $div .= '<select ' . $attributes . '>';
        foreach ($item['choices'] as $choice) {
            $defaultValue = $this->default_value($item, $item['default']);
            $selected = $choice->value === $defaultValue ? 'selected' : '';

            $div .= '<option value="' . $choice->value . '" ' . $selected . '>' . $choice->label . '</option>';
        }
        $div .= '</select>';
        $div .= !empty($item['description']) ? '<small>' . esc_html($item['description']) . '</small>' : '';

        $div .= '</div>';

        return $div;
    }
}
