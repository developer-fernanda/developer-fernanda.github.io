<?php
namespace KaliForms\Inc\Frontend\FormFields;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Class File_Upload
 *
 * @package Inc\Frontend\FormFields;
 */
class File_Upload extends Form_Field
{
    /**
     * Class constructor
     */
    public function __construct()
    {
        $this->id = 'fileUpload';
    }

    /**
     * Render function
     *
     * @return void
     */
    public function render($item, $form_info)
    {
        $item['type'] = 'file';
        if (isset($item['multiple']) && $item['multiple']) {
            $item['data-max-files'] = isset($item['maxFiles']) && !empty($item['maxFiles']) ? absint($item['maxFiles']) : 2;
        }

        $attributes = $this->generate_attribute_string($item);

        $offset = isset($item['offset']) && $item['offset'] > 0 ? 'offset-md-' . absint($item['offset']) : '';
        $div    = '<div class="col-12 col-md-' . absint($item['col']) . ' ' . $offset . '">';
        $div .= $this->generate_label($item, $form_info);
        $div .= '<input ' . $attributes . ' style="display:none">';
        $div .= !empty($item['description']) ? '<br/><small>' . esc_html($item['description']) . '</small>' : '';

        $div .= '</div>';

        return $div;
    }
}
