<?php

namespace KaliForms\Inc\Frontend\FormFields;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Class Product
 *
 * @package Inc\Frontend\FormFields;
 */
class Product extends Form_Field
{
    /**
     * Class constructor
     */
    public function __construct()
    {
        $this->id = 'product';
    }

    /**
     * Render function
     *
     * @return void
     */
    public function render($item, $form_info)
    {
        $item['price']          = str_replace(',', '.', $item['price']);
        $item['name']           = '';
        $item['kali-form-type'] = $item['type'];

        $attributes = $this->generate_attribute_string($item);
        $offset     = isset($item['offset']) && $item['offset'] > 0 ? 'offset-md-' . absint($item['offset']) : '';
        $div        = '<div class="col-12 col-md-' . absint($item['col']) . ' ' . $offset . '">';
        $div .= '<span ' . $attributes . '>';
        if (isset($item['picture']->fullUrl)) {
            $div .= '<div class="kali-product-image"><img src="' . esc_url($item['picture']->fullUrl) . '" /></div>';
        }
        $div .= '<p>' . esc_html($item['caption']) . ' - <strong>' . floatval($item['price']) . ' ' . esc_html($form_info['currency']) . '</strong></p>';
        $div .= '<p>' . esc_html($item['description']) . '</p>';
        $div .= '</span>';
        $div .= '</div>';

        return $div;
    }
}
