<?php
namespace KaliForms\Inc\Frontend\FormFields;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Class Divider
 *
 * @package Inc\Frontend\FormFields;
 */
class Divider extends Form_Field
{
    /**
     * Class constructor
     */
    public function __construct()
    {
        $this->id = 'divider';
    }

    /**
     * Render function
     *
     * @return void
     */
    public function render($item, $form_info)
    {
        $div = '<div class="col-12">';
        $div .= $this->generate_label($item, $form_info);
        switch ($item['type']) {
			case 'space':
				$div .= '<span style="display:block;width:100%;margin-top:3rem;margin-bottom:3rem"></span>';
                break;
			case 'both':
				$div .= '<hr style="margin-top:3rem;margin-bottom:3rem" />';
                break;
            default:
                $div .= '<hr />';
                break;
        }
        $div .= '</div>';

        return $div;
    }
}
