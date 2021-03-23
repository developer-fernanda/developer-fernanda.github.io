<?php
namespace KaliForms\Inc\Frontend\FormFields;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Class Hidden
 *
 * @package Inc\Frontend\FormFields;
 */
class Hidden extends Form_Field
{
    /**
     * Class constructor
     */
    public function __construct()
    {
        $this->id = 'hidden';
    }

    /**
     * Render function
     *
     * @return void
     */
    public function render($item, $form_info)
    {
		$item['class'] = 'input';

        $item['type'] = 'hidden';
        $attributes = $this->generate_attribute_string($item);

        $div = '<input ' . $attributes . '>';

        return $div;
    }
}
