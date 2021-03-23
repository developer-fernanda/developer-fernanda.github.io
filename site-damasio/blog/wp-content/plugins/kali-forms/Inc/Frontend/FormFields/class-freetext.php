<?php
namespace KaliForms\Inc\Frontend\FormFields;

if (!defined('ABSPATH')) {
    exit;
}
use KaliForms\Inc\Utils\GeneralPlaceholders;

/**
 * Class FreeText
 *
 * @package Inc\Frontend\FormFields;
 */
class FreeText extends Form_Field
{
    public $placeholders = [];

    /**
     * Class constructor
     */
    public function __construct()
    {
        $this->id = 'freeText';
    }

    /**
     * Render function
     *
     * @return void
     */
    public function render($item, $form_info)
    {
        $attributes = $this->generate_attribute_string($item);
        $evaluateShortcodes = isset($item['triggerShortcode']) ? $item['triggerShortcode'] : false;
        $offset = isset($item['offset']) && $item['offset'] > 0 ? 'offset-md-' . absint($item['offset']) : '';
        $div = '<div class="col-12 col-md-' . absint($item['col']) . ' ' . $offset . '">';
        $div .= '<span ' . $attributes . '>';
        $content = $evaluateShortcodes ? do_shortcode(wp_kses_post($item['content'])) : wp_kses_post($item['content']);
        $placeholders = $this->get_strings_between($content, '{', '}');

        $this->placeholders = array_merge((new GeneralPlaceholders())->general_placeholders, $this->placeholders);
        if (isset($this->placeholders['{entryCounter}'])) {
            $this->placeholders['{entryCounter}'] = call_user_func($this->placeholders['{entryCounter}'], $form_info['form_id']);
        }

        if (in_array('{formName}', $placeholders)) {
            $this->placeholders['{formName}'] = $form_info['form_name'];
        }

        $div .= strtr($content, $this->placeholders);

        $div .= '</span>';
        $div .= '</div>';

        return $div;

    }

    /**
     * Gets strings between delimiters
     *
     * @param [type] $str
     * @param string $start
     * @param string $end
     * @param boolean $with_from_to
     * @return void
     */
    public function get_strings_between($str, $start = '[', $end = ']', $with_from_to = true)
    {
        $arr = [];
        $last_pos = 0;
        $last_pos = strpos($str, $start, $last_pos);
        while ($last_pos !== false) {
            $t = strpos($str, $end, $last_pos);
            $arr[] = ($with_from_to ? $start : '') . substr($str, $last_pos + 1, $t - $last_pos - 1) . ($with_from_to ? $end : '');
            $last_pos = strpos($str, $start, $last_pos + 1);
        }
        return $arr;
    }
}
