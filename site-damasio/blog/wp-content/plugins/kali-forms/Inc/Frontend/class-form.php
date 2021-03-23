<?php
namespace KaliForms\Inc\Frontend;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Form class ( FRONTEND RENDERING )
 */
class Form
{
    public $slug = 'kaliforms';
    /**
     * Rows
     *
     * @var array
     */
    protected $rows = [];
    /**
     * Post object
     *
     * @var [WP_Post]
     */
    protected $post = null;
    /**
     * Form id
     *
     * @var [type]
     */
    protected $form_id = null;
    /**
     * Class constructor
     *
     * @param [number] $form_id
     * @param [array] $rows
     * @param [array] $form_info
     */
    public function __construct($form_id, $rows, $form_info)
    {
        $this->form_id   = $form_id;
        $this->rows      = $rows;
        $this->form_info = $form_info;
    }

    /**
     * Render fields
     *
     * @return void
     */
    public function render_fields()
    {
        $div             = '<form ' . $this->generate_form_attributes() . '>';
        $beforeFormStart = apply_filters($this->slug . '_before_form_start', ['context' => $this, 'string' => '']);
        $div .= $beforeFormStart['string'];
        $div .= (empty($this->form_info['form_name']) || $this->form_info['hide_form_name'] === '1') ? '' : '<h3>' . esc_html($this->form_info['form_name']) . '</h3>';
        $div .= '<div id="kaliforms-global-error-message-' . esc_attr($this->form_id) . '" class="global-error-message">' . wp_kses_post($this->form_info['global_error_message']) . '</div>';

        foreach ($this->rows as $row) {
            $div .= $this->render_row($row);
        }
        if ($this->form_info['honeypot'] === '1') {
            $div .= $this->render_honeypot();
        }

        $div .= $this->generate_ip_address_field();
        $beforeFormEnd = apply_filters($this->slug . '_before_form_end', ['context' => $this, 'string' => '']);
        $div .= $beforeFormEnd['string'];

        $credits = apply_filters($this->slug . '_credits', true);
        if ($credits) {
            $div .= '<!-- This form was built using Kali Forms -->';
        }

        $div .= '</form>';

        return $div;
    }
    /**
     * Returns honeypot fields
     *
     * @return void
     */
    public function render_honeypot()
    {
        $div = '';
        $div .= '<label class="khpfield" for="kf-name-field">';
        $div .= '<input class="khpfield" id="kf-name-field" name="kf-name-field" autocomplete="off" type="textbox" />';
        $div .= '</label>';
        $div .= '<label class="khpfield" for="kf-email-field">';
        $div .= '<input class="khpfield" id="kf-email-field" name="kf-email-field" autocomplete="off" type="textbox" />';
        $div .= '</label>';

        return $div;
    }
    /**
     * Render row
     *
     * @param [item] $items
     * @return void
     */
    public function render_row($items)
    {
        $div = '<div class="row kali-form-field-row">';
        foreach ($items as $item) {
            $div .= $this->render_field($item);
        }
        $div .= '</div>';

        return $div;
    }
    /**
     * Renders a field based on a template
     *
     * @param [array] $item
     * @return string
     */
    public function render_field($item)
    {
        if (!$item) {
            return false;
        }
        if (!isset($item['frontend'])) {
            return false;
        }

        return $item['frontend']->render($item, $this->form_info);
    }

    /**
     * Generates form attributes
     *
     * @return string
     */
    public function generate_form_attributes()
    {
        $availableThemes = [
            'rounded-borders',
            'straight-borders',
            'input-with-bg',
            'no-shadows',
            'border-bottom',
            'no-borders',
            'dark no-shadows',
            'input-label-merge',
            'input-label-merge-overlap',
        ];

        $obj = [
            'classes' => '',
            'style'   => '',
        ];

        switch ($this->form_info['form_style']) {
            case 'dark':
                $obj['classes'] = 'straight-borders no-shadows dark';
                $obj['style']   = 'dark';
                break;
            case 'roundedBorders':
                $obj['classes'] = 'rounded-borders';
                break;
            case 'roundedBordersBg':
                $obj['classes'] = 'rounded-borders input-with-bg';
                break;
            case 'straightBorders':
                $obj['classes'] = 'straight-borders';
                break;
            case 'straightBordersBg':
                $obj['classes'] = 'straight-borders input-with-bg';
                break;
            case 'inputBg':
                $obj['classes'] = 'input-with-bg no-borders no-shadows';
                break;
            case 'inputBgRounded';
                $obj['classes'] = 'input-with-bg no-borders rounded-borders';
                break;
            case 'borderBottom':
                $obj['classes'] = 'only-bottom-border';
                break;
            case 'inputLabelMerge':
                $obj['classes'] = 'input-label-merge';
                $obj['style']   = 'inputLabelMerge';
                break;
            case 'inputLabelMergeOverlap':
                $obj['classes'] = 'input-label-merge-overlap';
                $obj['style']   = 'inputLabelMergeOverlap';
                break;
            default:
                break;
        }

        $arr = [
            'class'           => 'kaliforms-form-container bootstrap-wrapper ' . $obj['classes'] . ' ' . $this->form_info['css_class'],
            'id'              => $this->form_info['css_id'],
            'data-form-id'    => $this->form_id,
            'data-form-style' => $obj['style'],
            'action'          => $this->form_info['form_action'],
            'method'          => $this->form_info['form_method'],
            'style'           => 'opacity:0',
        ];

        $found = false;
        foreach ($this->rows as $row => $fields) {
            foreach ($fields as $field) {
                if (isset($field['type']) && $field['type'] === 'pageBreak') {
                    $found = true;
                }
            }
            if ($found) {
                break;
            }
        }

        if (isset($this->form_info['conditionalLogic']) && !empty($this->form_info['conditionalLogic'])) {
            $found = true;
        }

        if ($found) {
            $arr['class'] .= ' kaliforms-hidden-during-load';
            $arr['style'] = 'opacity:0';
        }

        $arr = array_filter($arr);

        $string = '';
        foreach ($arr as $attribute => $value) {
            switch ($attribute) {
                case 'autocomplete':
                case 'enctype':
                case 'name':
                case 'class':
                case 'id':
                case 'data-form-id':
                case 'data-form-style':
                case 'style':
                case 'action':
                case 'method':
                    $string .= empty($value) ? '' : ' ' . esc_attr($attribute) . '="' . esc_attr($value) . '"';
                    break;
                case 'novalidate':
                    $string .= $value ? esc_attr($attribute) . ' ' : '';
                    break;
                default:
                    break;
            }
        }

        return $string;
    }
    /**
     * Returns a form field containing the ip address
     *
     * @return string
     */
    public function generate_ip_address_field()
    {
        return $this->form_info['save_ip_address'] === '1'
        ? '<input type="hidden" name="ip_address" readonly value="' . $this->get_user_ip_addr() . '" />'
        : '';
    }

    /**
     * Get user ip address
     *
     * @return string
     */
    public function get_user_ip_addr()
    {
        $ipaddress = '';
        if (getenv('HTTP_CLIENT_IP')) {
            $ipaddress = getenv('HTTP_CLIENT_IP');
        } else if (getenv('HTTP_X_FORWARDED_FOR')) {
            $ipaddress = getenv('HTTP_X_FORWARDED_FOR');
        } else if (getenv('HTTP_X_FORWARDED')) {
            $ipaddress = getenv('HTTP_X_FORWARDED');
        } else if (getenv('HTTP_FORWARDED_FOR')) {
            $ipaddress = getenv('HTTP_FORWARDED_FOR');
        } else if (getenv('HTTP_FORWARDED')) {
            $ipaddress = getenv('HTTP_FORWARDED');
        } else if (getenv('REMOTE_ADDR')) {
            $ipaddress = getenv('REMOTE_ADDR');
        } else {
            $ipaddress = 'UNKNOWN';
        }

        return $ipaddress;
    }

}
