<?php

namespace KaliForms\Inc\Frontend\FormFields;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Class PayPal
 *
 * @package Inc\Frontend\FormFields;
 */
class PayPal extends Form_Field
{
    /**
     * Class constructor
     */
    public function __construct()
    {
        $this->id = 'paypal';
    }

    /**
     * Render function
     *
     * @return void
     */
    public function render($item, $form_info)
    {
        $attributes = $this->generate_attribute_string($item);
        $offset     = isset($item['offset']) && $item['offset'] > 0 ? 'offset-md-' . absint($item['offset']) : '';
        $div        = '<div class="col-12 col-md-' . absint($item['col']) . ' ' . $offset . '">';
        $div .= '<div id="kaliforms-paypal-button-container" style="text-align:center" ' . $attributes . '></div>';
        $div .= '</div>';

        return $div;
    }
}
