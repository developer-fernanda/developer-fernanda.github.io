<?php
namespace KaliForms\Inc\Frontend\FormFields;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Class URL
 *
 * @package Inc\Frontend\FormFields;
 */
class URL extends Form_Field
{
    /**
     * Class constructor
     */
    public function __construct()
    {
        $this->id = 'url';
    }

    /**
     * Render function
     *
     * @return void
     */
    public function render($item, $form_info)
    {
		$item['type'] = 'url';
		$item['class'] = 'input';

        $attributes = $this->generate_attribute_string($item);
        $offset = isset($item['offset']) && $item['offset'] > 0 ? 'offset-md-' . absint($item['offset']) : '';
        $div = '<div class="col-12 col-md-' . absint($item['col']) . ' ' . $offset . '">';
        $div .= $this->generate_label($item, $form_info);
        $div .= '<input ' . $attributes . '>';
        $div .= !empty($item['description']) ? '<small>' . esc_html($item['description']) . '</small>' : '';

        $div .= '</div>';

        return $div;
    }
}
