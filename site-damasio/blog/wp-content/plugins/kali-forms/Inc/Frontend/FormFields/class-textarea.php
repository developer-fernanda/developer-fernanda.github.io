<?php
namespace KaliForms\Inc\Frontend\FormFields;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Class TextArea
 *
 * @package Inc\Frontend\FormFields;
 */
class TextArea extends Form_Field
{
    /**
     * Class constructor
     */
    public function __construct()
    {
        $this->id = 'textarea';
    }

    /**
     * Render function
     *
     * @return void
     */
    public function render($item, $form_info)
    {
        $item['class'] = 'input';

        $editor = isset($item['changeToEditor']) && $item['changeToEditor'] ? true : false;
        if ($editor) {
            wp_enqueue_editor();
        }
        $item['rows'] = isset($item['rows']) ? $item['rows'] : 4;
        $item['editor'] = $editor;
        $attributes = $this->generate_attribute_string($item);
        $offset = isset($item['offset']) && $item['offset'] > 0 ? 'offset-md-' . absint($item['offset']) : '';
        $div = '<div class="col-12 col-md-' . absint($item['col']) . ' ' . $offset . '">';
        $div .= $this->generate_label($item, $form_info);
        $div .= '<textarea ' . $attributes . '>' . esc_html($item['default']) . '</textarea>';
        $div .= !empty($item['description']) ? '<small>' . esc_html($item['description']) . '</small>' : '';
        $div .= '</div>';

        return $div;
    }
}
