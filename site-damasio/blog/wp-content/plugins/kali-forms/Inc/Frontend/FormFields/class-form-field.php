<?php
namespace KaliForms\Inc\Frontend\FormFields;

use KaliForms\Inc\Utils\FieldsHelper;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Class Form_Field
 *
 * @package Inc\FrontEnd\FormField;
 */
abstract class Form_Field
{
    /**
     * Trait with utilities
     */
    use FieldsHelper;
    /**
     * Class constructor
     */
    public function __construct()
    {
    }

    /**
     * Render function
     *
     * @return void
     */
    public function render($item, $form_info)
    {
    }
    /**
     * Renders the required field mark
     *
     * @return void
     */
    public function render_required_mark($mark)
    {
        return '<span class="kali-required-mark">' . esc_html($mark) . '</span>';
    }
}
