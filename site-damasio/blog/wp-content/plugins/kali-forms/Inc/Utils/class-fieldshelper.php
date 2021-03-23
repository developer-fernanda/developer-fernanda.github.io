<?php
namespace KaliForms\Inc\Utils;

trait FieldsHelper
{
    /**
     * Class constructor
     *
     * @param [string] $type
     * @return void
     */
    public function construct_object($type)
    {
        $types = [
            'textbox'        => 'KaliForms\Inc\Frontend\FormFields\Textbox',
            'telephone'      => 'KaliForms\Inc\Frontend\FormFields\Telephone',
            'email'          => 'KaliForms\Inc\Frontend\FormFields\Email',
            'url'            => 'KaliForms\Inc\Frontend\FormFields\URL',
            'textarea'       => 'KaliForms\Inc\Frontend\FormFields\Textarea',
            'dropdown'       => 'KaliForms\Inc\Frontend\FormFields\Dropdown',
            'radio'          => 'KaliForms\Inc\Frontend\FormFields\Radio',
            'checkbox'       => 'KaliForms\Inc\Frontend\FormFields\Checkbox',
            'button'         => 'KaliForms\Inc\Frontend\FormFields\Button',
            'fileUpload'     => 'KaliForms\Inc\Frontend\FormFields\File_Upload',
            'dateTimePicker' => 'KaliForms\Inc\Frontend\FormFields\Date_Time_Picker',
            'date'           => 'KaliForms\Inc\Frontend\FormFields\Date',
            'submitButton'   => 'KaliForms\Inc\Frontend\FormFields\SubmitButton',
            'grecaptcha'     => 'KaliForms\Inc\Frontend\FormFields\GRecaptcha',
            'divider'        => 'KaliForms\Inc\Frontend\FormFields\Divider',
            'freeText'       => 'KaliForms\Inc\Frontend\FormFields\FreeText',
            'hidden'         => 'KaliForms\Inc\Frontend\FormFields\Hidden',
            'product'        => 'KaliForms\Inc\Frontend\FormFields\Product',
            'donation'       => 'KaliForms\Inc\Frontend\FormFields\Donation',
            'paypal'         => 'KaliForms\Inc\Frontend\FormFields\PayPal',
            'imageRadio'     => 'KaliForms\Inc\Frontend\FormFields\Image_Radio',
        ];
        $types = apply_filters($this->slug . '_frontend_field_types', $types);
        return (isset($types[$type]) && class_exists($types[$type])) ? new $types[$type] : false;
    }

    /**
     * Get default value
     *
     * @param [type] $item
     * @return void
     */
    public function default_value($item, $value)
    {
        if (isset($item['name']) && isset($_GET[$item['name']])) {
            $value = sanitize_text_field(wp_unslash($_GET[$item['name']]));
        }

        if (isset($item['smartOutput'])) {
            // $placeholders = $this->get_strings_between($value, '{', '}');
        }

        if ($item['type'] === 'checkbox') {
            $value = explode(',', $value);
        }

        return $value;
    }
    /**
     * List dependencies for the smart field
     */
    public function get_smart_dependencies($value)
    {
        $sanitized    = '';
        $placeholders = $this->get_strings_between($value, '{', '}');
        foreach ($placeholders as $placeholder) {
            $item = str_replace('{', '', $placeholder);
            $item = str_replace('}', '', $item);
            $sanitized .= $item . ',';
        }
        $sanitized = rtrim($sanitized, ',');
        return $sanitized;
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
        $arr      = [];
        $last_pos = 0;
        $last_pos = strpos($str, $start, $last_pos);
        while ($last_pos !== false) {
            $t        = strpos($str, $end, $last_pos);
            $arr[]    = ($with_from_to ? $start : '') . substr($str, $last_pos + 1, $t - $last_pos - 1) . ($with_from_to ? $end : '');
            $last_pos = strpos($str, $start, $last_pos + 1);
        }
        return $arr;
    }
    /**
     * Generates attributes string
     *
     * @param [type] $args
     * @return string
     */
    public function generate_attribute_string($args)
    {
        $string = '';
        foreach ($args as $attribute => $value) {
            switch ($attribute) {
                case 'content':
                    break;
                case 'id':
                case 'name':
                case 'type':
                case 'placeholder':
                case 'for':
                case 'class':
                case 'multipleSeparator':
                case 'rows':
                    $string .= empty($value) ? '' : ' ' . esc_attr($attribute) . '="' . esc_attr($value) . '"';
                    break;
                case 'onclick':
                    $string .= empty($value) ? '' : ' ' . esc_attr($attribute) . '="' . esc_attr($value) . '(event, this)"';
                    break;
                case 'grid_id';
                    $string .= empty($value) ? '' : ' data-internal-id="' . esc_attr($value) . '"';
                    break;
                case 'min':
                case 'data-max-files':
                case 'step':
                case 'max':
                case 'maxItemCount':
                case 'minDateDependencyOffset':
                    $string .= !isset($value) ? '' : ' ' . esc_attr($attribute) . '="' . absint($value) . '"';
                    break;
                case 'default':
                    $defaultValue = $this->default_value($args, $value);
                    if ($args['type'] !== 'checkbox' && $args['type'] !== 'radio') {
                        $string .= empty($defaultValue) ? '' : ' value="' . esc_attr($defaultValue) . '" ';
                    }
                    break;
                case 'minDateDependency':
                    if (empty($value) || $value === 'kf-select-field') {
                        break;
                    }
                    $string .= 'data-mindatedependency="' . esc_attr($value) . '" ';
                    break;
                case 'inline':
                case 'readonly':
                case 'data-was-required':
                case 'required':
                case 'imagePreview':
                case 'instantUpload':
                case 'showTime':
                case 'addableItems':
                case 'removableItems':
                case 'minDateToday':
                case 'multiple':
                case 'editor':
                case 'gradation':
                    $string .= $value ? esc_attr($attribute) . ' ' : '';
                    break;
                case 'smartOutput':
                    $string .= $value ? esc_attr($attribute) . ' ' : '';
                    $defaultValue = $this->default_value($args, $args['default']);
                    $string .= 'data-dependencies="' . $this->get_smart_dependencies($defaultValue) . '" ';
                    break;
                case 'description':
                case 'caption':
                    break;
                case 'populateFromApi':
                    if (is_string($value) && is_string($attribute)) {
                        $string .= empty($value) ? '' : ' ' . esc_attr($attribute) . '="' . esc_url($value) . '"';
                    }
                    break;
                default:
                    if (is_string($value) && is_string($attribute)) {
                        $string .= empty($value) ? '' : ' data-' . esc_attr($attribute) . '="' . esc_attr($value) . '" ';
                    }
                    break;
            }
        }

        return $string;
    }

    /**
     * Generates labels for the fields
     *
     * @param [Array] $args
     * @param [Array] $form_info
     * @return string
     */
    public function generate_label($args, $form_info)
    {
        $string = '';
        if (empty($args['caption'])) {
            return $string;
        }
        if (empty($args['required'])) {
            $args['required'] = false;
        }
        $id = isset($args['id']) ? $args['id'] : '';
        $string .= '<label ' . $this->generate_attribute_string(['for' => $id]) . '>';
        $string .= $args['caption'];
        $string .= $args['required'] ? ' ' . $this->render_required_mark($form_info['required_field_mark']) : '';
        $string .= '</label>';

        return $string;
    }

    /**
     * Generates label for checkbox and radios
     *
     * @param [stdClass] $args
     * @param [Array] $form_info
     * @return string
     */
    public function generate_label_for_checkbox_radio($args, $form_info)
    {
        $string = '';
        if (empty($args->label)) {
            return $string;
        }

        return $string;
    }
}
