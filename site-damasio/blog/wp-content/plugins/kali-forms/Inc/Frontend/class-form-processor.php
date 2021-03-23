<?php
namespace KaliForms\Inc\Frontend;

use KaliForms\Inc\Utils\Akismet;
use KaliForms\Inc\Utils\Emailer;
use KaliForms\Inc\Utils\FileManager;
use KaliForms\Inc\Utils\GeneralPlaceholders;
use KaliForms\Inc\Utils\MetaHelper;

if (!defined('WPINC')) {
    die;
}

/**
 * Form processor class
 *
 * @todo
 *  1. Separate concerns into smaller classes (easier to maintain)
 *  2. Move payment stuff to the plugin
 *  3. Create a form process hook/filter logic so we dont have to edit this class anymore (concern separation 1.).
 */
class Form_Processor
{
    /**
     * We need the meta helper class to get values from the post
     */
    use MetaHelper, FileManager;
    /**
     * Form data ( custom post type kaliforms )
     *
     * @var [WP_Post]
     */
    public $post = null;
    /**
     * Data that we get from $_POST ( what's sent from the frontend )
     *
     * @var array
     */
    public $data = [];
    /**
     * Did we save the submission in the database?
     *
     * @var boolean
     */
    public $saved = false;
    /**
     * Easier to replace variables
     *
     * @var array
     */
    public $placeholdered_data = [];
    /**
     * Field type map
     *
     * @var array
     */
    public $field_type_map = [];
    /**
     * Advanced field type map
     *
     * @var array
     */
    public $advanced_field_map = [];
    /**
     * Plugin slug
     *
     * @var string
     */
    public $slug = 'kaliforms';
    /**
     * Class constructor
     */
    public function __construct()
    {
        add_action('wp_ajax_kaliforms_form_process',
            [$this, 'form_process']
        );
        add_action('wp_ajax_nopriv_kaliforms_form_process',
            [$this, 'form_process']
        );

        add_action('wp_ajax_kaliforms_preflight', [$this, 'preflight']);
        add_action('wp_ajax_nopriv_kaliforms_preflight', [$this, 'preflight']);

        add_action('wp_ajax_kaliforms_form_verify_recaptcha', [$this, 'verify_recaptcha']);
        add_action('wp_ajax_nopriv_kaliforms_form_verify_recaptcha', [$this, 'verify_recaptcha']);

        add_action('wp_ajax_kaliforms_form_upload_file', [$this, 'upload_file']);
        add_action('wp_ajax_nopriv_kaliforms_form_upload_file', [$this, 'upload_file']);

        add_action('wp_ajax_kaliforms_form_delete_uploaded_file', [$this, 'delete_file']);
        add_action('wp_ajax_nopriv_kaliforms_form_delete_uploaded_file', [$this, 'delete_file']);
    }

    /**
     * Preflight request
     *
     * This should handle everything that a has to check before the actual process
     *
     * For example : spam requests
     *
     * @return void
     */
    public function preflight()
    {
        /**
         * Runs the checks needed for the form preflight ( we dont need placeholders atm )
         */
        $this->run_form_process_checks(false);

        $data   = stripslashes_deep($_POST['data']);
        $checks = [
            'akismet' => $this->get('akismet', '') && get_option('wordpress_api_key', ''),
        ];

        $checks = array_filter($checks);

        foreach ($checks as $id => $check) {
            switch ($id) {
                case 'akismet':
                    $akismet = new Akismet(
                        get_option('wordpress_api_key', ''),
                        $data,
                        json_decode($this->get('akismet_fields', '[]'), false, 512, JSON_HEX_QUOT)
                    );
                    $akismet_check = $akismet->check();
                    $checks[$id]   = $akismet_check['response'];
                    break;
                default:
                    $checks[$id] = false;
                    break;
            }
        }

        wp_die(
            wp_json_encode($checks)
        );
    }

    /**
     * Ajax handler
     */
    public function form_process()
    {
        /**
         * Runs the checks needed for the form to process
         */
        $this->run_form_process_checks(true);
        /**
         * Run a filter after $_POST data has been checked and sanitized
         */
        $this->data = apply_filters($this->slug . '_before_form_process', $this->data);
        /**
         * Runs an action as well
         */
        do_action(
            $this->slug . '_before_form_process_action',
            ['data' => $this->data, 'placeholders' => $this->placeholdered_data]
        );

        if (isset($this->data['admin_external_change']) && $this->data['admin_external_change']) {
            /**
             * If we change something in before process, update placeholders
             */
            $this->check_if_placeholders_changed();
        }

        if (isset($this->data['admin_stop_execution']) && $this->data['admin_stop_execution']) {
            /**
             * Return a response to the frontend
             */
            wp_die(
                wp_json_encode(
                    [
                        'status'            => 'ok',
                        'thank_you_message' => '',
                        'terminated'        => true,
                        'terminated_reason' => isset($this->data['admin_stop_reason']) ? $this->data['admin_stop_reason'] : '',
                        'error_bag'         => isset($this->data['error_bag']) ? $this->data['error_bag'] : [],
                        'redirect_url'      => esc_url($this->get('redirect_url', '')),
                        'form_data'         => $this->data,
                    ]
                )
            );
        }

        /**
         * Only if we have that particular addon
         */
        $this->_save_data();
        $this->data['kali_submission_id'] = $this->saved;

        if (isset($this->data['kf_hooks']) && !empty($this->data['kf_hooks'])) {
            $this->placeholdered_data = array_merge($this->placeholdered_data, $this->data['kf_hooks']);
        }

        /**
         * Handle file uploads
         */
        $this->_handle_file_uploads();
        do_action(
            $this->slug . '_before_form_notification_send_action',
            ['data' => $this->data, 'placeholders' => $this->placeholdered_data]
        );

        /**
         * Send emails
         */
        $emailer = new Emailer($this->post->ID, $this->data, $this->placeholdered_data);
        $emailer->send();
        /**
         * Run a filter after form has been processed ( Emails were sent )
         */
        $this->data = apply_filters($this->slug . '_after_form_process', $this->data);
        /**
         * Runs an action as well
         */
        do_action(
            $this->slug . '_after_form_process_action',
            ['data' => $this->data, 'placeholders' => $this->placeholdered_data]
        );

        if (isset($this->data['kf_hooks']) && !empty($this->data['kf_hooks'])) {
            $this->placeholdered_data = array_merge($this->placeholdered_data, $this->data['kf_hooks']);
        }

        /**
         * Return a response to the frontend
         */
        wp_die(
            wp_json_encode(
                [
                    'status'            => 'ok',
                    'thank_you_message' => $this->get('show_thank_you_message', '0')
                    ? $this->get_thank_you_message() : '',
                    'redirect_url'      => esc_url($this->get('redirect_url', '')),
                    'reset'             => $this->get('reset_form_after_submit', '0'),
                    'form_data'         => $this->data,
                ]
            )
        );
    }

    /**
     * Checks if we have any changes in our data
     *
     * @return void
     */
    public function check_if_placeholders_changed()
    {
        // 1.6.3 fix - the checkbox "string" value was overwritten with the "source of truth"
        foreach ($this->data as $key => $value) {
            $type = 'textbox';
            if (isset($this->field_type_map[$key]) && !empty($this->field_type_map[$key])) {
                $type = $this->field_type_map[$key];
            }
            $this->_run_placeholder_switch($type, $key, $value);
        }
    }

    /**
     * Runs checks and formats the data as needed
     *
     * @return void
     */
    public function run_form_process_checks($placeholder_process)
    {
        if (empty($_POST['data'])) {
            return $this->display_error(esc_html__('There is no post data', 'kaliforms'));
        }
        if (!isset($_POST['data']['nonce'])) {
            return $this->display_error(esc_html__('Sneaky sneaky', 'kaliforms'));
        }
        if (!wp_verify_nonce(sanitize_key(wp_unslash($_POST['data']['nonce'])), 'kaliforms_nonce')) {
            return $this->display_error(esc_html__('Sneaky sneaky', 'kaliforms'));
        }

        if (empty($_POST['data']['formId'])) {
            return $this->display_error(esc_html__('Form didn`t send a form id, are we sure it is correct?', 'kaliforms'));
        }

        $this->post = get_post(absint(wp_unslash($_POST['data']['formId'])));
        if ($this->post === null) {
            return $this->display_error(esc_html__('There is no form associated with this id. Make sure you copied it correctly', 'kaliforms'));
        }

        $this->multiple_selection_separator = $this->get('multiple_selections_separator', ',');

        if ($placeholder_process) {
            $this->data = $this->prepare_post_data(stripslashes_deep($_POST['data']));
        }
    }
    /**
     * Sets up field map ( field id -> field type )
     *
     * @return void
     */
    public function setup_field_map()
    {
        $map         = [];
        $advancedMap = [];
        $fields      = json_decode($this->get('field_components', '[]'), false, 512, JSON_HEX_QUOT);
        foreach ($fields as $field) {
            if (empty($field->properties->name)) {
                continue;
            }
            $map[$field->properties->name]         = $field->id;
            $advancedMap[$field->properties->name] = $field->properties;
        }
        return ['advanced' => $advancedMap, 'map' => $map];
    }
    /**
     * Prepares post data for processing
     *
     * @param [type] $data
     * @return void
     */
    public function prepare_post_data($data)
    {
        $prepared_maps            = $this->setup_field_map();
        $this->field_type_map     = $prepared_maps['map'];
        $this->advanced_field_map = $prepared_maps['advanced'];
        $this->placeholdered_data = array_merge((new GeneralPlaceholders())->general_placeholders, $this->placeholdered_data);

        $data = array_merge($data, $this->_get_product_fields($data));
        foreach ($data as $k => $v) {
            $type = 'textbox';
            if (isset($this->field_type_map[$k]) && !empty($this->field_type_map[$k])) {
                $type = $this->field_type_map[$k];
            }

            $this->_run_placeholder_switch($type, $k, $v);
        }

        $simplified = [];
        $hooks      = $this->get('webhooks', []);
        foreach ($hooks as $hook) {
            $simplified[] = $hook->name;
        }

        $placeholders = $this->get_strings_between($this->get('thank_you_message', ''), '{', '}');

        $this->placeholdered_data['{allFields}'] = $this->get_all_field_data($data);
        $this->placeholdered_data['{formName}']  = $this->post->post_title;
        foreach ($placeholders as $placeholder) {
            if (in_array($placeholder, ['{allFields}', '{formName}'])) {
                continue;
            }

            if (strpos($placeholder, ':') > -1) {
                if (!empty($hooks)) {
                    $curr_placeholder = str_replace(['{', '}'], '', $placeholder);
                    $exploded         = explode(':', $curr_placeholder);
                    if (in_array($exploded[0], $simplified)) {
                        $this->placeholdered_data[$placeholder] = '';
                    }

                    continue;
                }

                $this->placeholdered_data[$placeholder . '}'] = $this->get_value_from_nested_placeholder($placeholder);
            }
        }

        $this->placeholdered_data = apply_filters($this->slug . '_form_placeholders', $this->placeholdered_data);

        return $data;
    }
    /**
     * Get product total
     *
     * @param [type] $data
     * @return void
     */
    protected function _get_product_fields($data)
    {
        $new_items = [];
        if (in_array('product', $this->field_type_map)) {
            foreach ($this->field_type_map as $id => $type) {
                if ($type !== 'product' || !isset($this->advanced_field_map[$id])) {
                    continue;
                }
                $obj = [
                    'label' => $this->advanced_field_map[$id]->caption,
                    'price' => $this->advanced_field_map[$id]->price,
                    'image' => $this->advanced_field_map[$id]->picture,
                ];

                $new_items[$id] = $obj;
            }
        }
        if (in_array('multipleProducts', $this->field_type_map)) {
            foreach ($this->field_type_map as $id => $type) {
                if ($type !== 'multipleProducts' || !isset($this->advanced_field_map[$id])) {
                    continue;
                }

                $selected = [
                    'label' => '',
                    'price' => '',
                    'image' => '',
                ];

                foreach ($this->advanced_field_map[$id]->products as $product) {
                    if ($product->id === $data[$id]) {
                        $selected['label'] = $product->label;
                        $selected['price'] = $product->price;
                        $selected['image'] = $product->image;
                    }
                }

                $new_items[$id] = $selected;
            }
        }
        return $new_items;
    }
    /**
     * Return all data as formatted string
     *
     * @param array $data
     * @return string
     */
    public function get_all_field_data($data)
    {
        $str = '';
        foreach ($data as $key => $value) {
            $label = $this->get_field_label($key);

            if (!in_array($key, ['formId', 'nonce', 'ip_address', 'kf_submitted_user_id', 'grecaptcha', 'g-recaptcha-response', 'fileUpload', 'multipleProducts', 'product'])) {
                $value = is_string($value) ? $value : implode($this->get('multiple_selections_separator', ','), $value);
                $str .= $label . ' : ' . $value . '<br />';
            }
        }

        return $str;
    }
    /**
     * Get field label
     *
     * @param string $key
     * @return string
     */
    public function get_field_label($key)
    {
        $fields = json_decode($this->get('field_components', '[]'), false, 512, JSON_HEX_QUOT);
        $label  = '';
        foreach ($fields as $idx => $field) {
            if (isset($field->properties->name) && $field->properties->name === $key) {
                $label = !empty($field->properties->caption) ? $field->properties->caption : $field->properties->name;
                break;
            }
        }
        return $label;
    }
    /**
     * Get value from nested placeholder (in a "special way" lol)
     */
    public function get_value_from_nested_placeholder($placeholder)
    {
        // We remove first char because it's a '{'
        $trimmed      = substr($placeholder, 1);
        $trimmedArray = explode(':', $trimmed);
        $value        = '';
        $nestedValue  = isset($this->placeholdered_data[$trimmedArray[1]]) ? $this->placeholdered_data[$trimmedArray[1]] : '';

        switch ($trimmedArray[0]) {
            case 'imagePreview':
                $value = '<img src="' . esc_url(wp_get_attachment_url($nestedValue)) . '" />';
                break;
            case 'code':
                $value = '<code>' . wp_kses_post($nestedValue) . '</code>';
                break;
            default:
                $value = '';
                break;
        }

        return $value;
    }
    /**
     * Runs placeholder switch to set the new values
     *
     * @param [string]     $type
     * @param [string]     $k
     * @param [string]     $v
     * @return void
     */
    protected function _run_placeholder_switch($type, $k, $v)
    {
        switch ($type) {
            case 'wireTransfer':
                $this->placeholdered_data['{' . $k . '}'] = wp_kses_post($this->advanced_field_map[$k]->afterInfo);
                break;
            case 'product':
            case 'multipleProducts':
                $this->placeholdered_data['{' . $k . ':label}'] = sanitize_text_field($v['label']);
                $this->placeholdered_data['{' . $k . ':price}'] = floatval($v['price']);
                if (!empty($v['image']->fullUrl)) {
                    $this->placeholdered_data['{' . $k . ':image}'] = '<img style="width:100%" src="' . esc_url($v['image']->fullUrl) . '" />';
                }
                break;
            case 'radio':
            case 'dropdown':
                $this->placeholdered_data['{' . $k . '}'] = sanitize_text_field($v);

                $choice_labels = [];
                foreach ($this->advanced_field_map[$k]->choices as $choice) {
                    $choice_labels[$choice->value] = $choice->label;
                }

                $this->placeholdered_data['{' . $k . ':value}'] = $this->placeholdered_data['{' . $k . '}'];
                $this->placeholdered_data['{' . $k . ':label}'] = sanitize_text_field($choice_labels[$v]);
                break;
            case 'checkbox':
            case 'choices':
            case 'donation':
                $this->placeholdered_data['{' . $k . '}'] = is_array($v) ? sanitize_text_field(implode($this->get('multiple_selections_separator', ','), $v)) : sanitize_text_field($v);

                $choice_labels = [];
                foreach ($this->advanced_field_map[$k]->choices as $choice) {
                    $choice_labels[$choice->value] = $choice->label;
                }
                $newVal = [];
                if (is_array($v)) {
                    foreach ($v as $value) {
                        $newVal[] = $choice_labels[$value];
                    }
                }

                $this->placeholdered_data['{' . $k . ':value}'] = $this->placeholdered_data['{' . $k . '}'];
                $this->placeholdered_data['{' . $k . ':label}'] = sanitize_text_field(implode($this->get('multiple_selections_separator', ','), $newVal));
                break;
            case 'fileUpload':
                $title      = [];
                $images     = [];
                $ids        = [];
                $urls       = [];
                $imagePaths = [];
                $ids        = explode(',', $v);
                foreach ($ids as $uId) {
                    $img = wp_get_attachment_url($uId);

                    $title[]      = get_the_title($uId);
                    $images[]     = '<img style="width:100%" src="' . esc_url($img) . '" />';
                    $imagePaths[] = wp_get_original_image_path($uId);
                    $urls[]       = esc_url($img);
                }

                $this->placeholdered_data['{' . $k . ':title}']     = implode(',', $title);
                $this->placeholdered_data['{' . $k . ':image}']     = implode("\n", $images);
                $this->placeholdered_data['{' . $k . ':imagePath}'] = implode("\n", $imagePaths);
                $this->placeholdered_data['{' . $k . ':id}']        = sanitize_text_field($v);
                $this->placeholdered_data['{' . $k . ':url}']       = implode(',', $urls);

                break;
            case 'imageRadio':
                $img = wp_get_attachment_url($v);

                $choice_labels = [];
                foreach ($this->advanced_field_map[$k]->choices as $choice) {
                    $choice_labels[$choice->image->id] = ['label' => $choice->label, 'caption' => $choice->caption];
                }

                $this->placeholdered_data['{' . $k . ':title}']   = get_the_title($v);
                $this->placeholdered_data['{' . $k . ':image}']   = '<img style="width:100%" src="' . esc_url($img) . '" />';
                $this->placeholdered_data['{' . $k . ':id}']      = sanitize_text_field($v);
                $this->placeholdered_data['{' . $k . ':url}']     = esc_url($img);
                $this->placeholdered_data['{' . $k . ':label}']   = sanitize_text_field($choice_labels[$v]['label']);
                $this->placeholdered_data['{' . $k . ':caption}'] = sanitize_text_field($choice_labels[$v]['caption']);

                break;
            case 'digitalSignature':
                $validB64 = preg_match("/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).base64,.*/", $v);
                if ($validB64 > 0) {
                    $this->placeholdered_data['{' . $k . ':signature}'] = '<img style="width:100%" src="' . sanitize_text_field($v) . '" />';
                    $this->placeholdered_data['{' . $k . ':src}']       = sanitize_text_field($v);
                    break;
                }
                $img = wp_get_attachment_url($v);

                $this->placeholdered_data['{' . $k . ':signature}'] = '<img style="width:100%" src="' . esc_url($img) . '" />';
                $this->placeholdered_data['{' . $k . ':id}']        = sanitize_text_field($v);
                break;
            default:
                $this->placeholdered_data['{' . $k . '}'] = is_array($v)
                ? implode($this->get('multiple_selections_separator', ','), $v)
                : sanitize_text_field($v);
                break;
        }
    }
    /**
     * Save data in the database
     */
    protected function _save_data()
    {
        $save = $this->get('save_form_submissions', '0');
        if ($save !== '0') {
            $arr = [
                'post'          => $this->post,
                'data'          => $this->data,
                'submission_id' => false,
                'extra'         => [
                    'separator' => $this->get('multiple_selections_separator', ','),
                ],
            ];

            $arr = apply_filters($this->slug . '_save_data', $arr);

            $post = wp_insert_post([
                'post_type'   => 'kaliforms_submitted',
                'post_title'  => $arr['post']->post_title,
                'post_status' => 'publish',
            ]);

            if (is_wp_error($post)) {
                return false;
            }

            foreach ($arr['data'] as $k => $v) {
                if ($k === 'kf_hooks' && is_array($v)) {
                    continue;
                }

                if (
                    isset($v['image'])
                    && isset($v['label'])
                    && isset($v['price'])
                ) {
                    $v = $v['label'];
                }
                $value = is_array($v)
                ? sanitize_text_field(implode($arr['extra']['separator'], $v))
                : sanitize_text_field($v);

                update_post_meta($post, $k, $value);
            }

            $arr['submission_id'] = $post;

            $arr = apply_filters($this->slug . '_after_save_data', $arr);

            $this->saved = $arr['submission_id'];
        }

        if (isset($this->placeholdered_data['{entryCounter}'])) {
            $this->placeholdered_data['{entryCounter}'] = call_user_func($this->placeholdered_data['{entryCounter}'], $this->post->ID);
        }
        if (isset($this->placeholdered_data['{thisPermalink}'])) {
            $this->placeholdered_data['{thisPermalink}'] = call_user_func($this->placeholdered_data['{thisPermalink}']);
        }

        if (isset($this->placeholdered_data['{submission_link}']) && $this->saved) {
            $this->placeholdered_data['{submission_link}'] = call_user_func(
                $this->placeholdered_data['{submission_link}'],
                $this->get('submission_view_page', 0),
                $this->saved,
                $this->post->ID,
                true
            );
        }

        return $this->saved;
    }

    /**
     * Handle file uploads
     *
     * Basically we need to check if we have any file upload fields .. and if so we need to add transients for it
     * so we know that the form was subbmited.
     *
     * When an image is uploaded, is going straight to the media manager ( AJAX loading )
     * which schedules a delete event in 15 minutes
     *
     * However, if a user submits the form .. a transient containing the ID of the file is created
     * e.g. kaliforms_dont_delete_this_image_${id}
     */
    private function _handle_file_uploads()
    {
        if (isset($_POST['extraArgs']) && count($_POST['extraArgs'])) {
            $data = wp_unslash($_POST['extraArgs']);

            $_POST['data'] = stripslashes_deep($_POST['data']);
            foreach ($data as $uploadField) {
                $id = $_POST['data'][$uploadField];
                if ($id === '' || $id === null || is_wp_error($id)) {
                    continue;
                }
                $dont_delete = explode(',', $id);
                foreach ($dont_delete as $uId) {
                    set_transient('kaliforms_dont_delete_this_image_' . absint($uId), 'submitted');
                }
            }
        }
    }

    /**
     * Generates thank you message
     *
     * @return void
     */
    public function get_thank_you_message()
    {
        $conditional = $this->get('conditional_thank_you', false);
        return $conditional === false || $conditional === '0'
        ? strtr($this->get('thank_you_message', ''), $this->placeholdered_data)
        : $this->get_conditional_thank_you();
    }

    /**
     * Undocumented function
     *
     * @return void
     */
    public function get_conditional_thank_you()
    {
        $messages = json_decode($this->get('conditional_thank_you_message', '[]'), false, 512, JSON_HEX_QUOT);
        $cond     = false;

        $msg = '';
        foreach ($messages as $message) {
            switch ($message->condition->operator) {
                case 'greater':
                    // if values are not numeric, there's no point in comparison because a string will always be converted to 0
                    // these can create issues when a user input can select negative values
                    // ( e.g. 'Something' will always be greater than -1 which is fundamentally wrong)
                    $cond = (is_numeric($this->data[$message->condition->if]) && is_numeric($message->condition->value))
                    ? intval($this->data[$message->condition->if]) > intval($message->condition->value)
                    : false;

                    if ($cond) {
                        $msg = strtr($message->message, $this->placeholdered_data);
                    }
                    break;
                case 'less':
                    // same as the case on top of this one
                    $cond = (is_numeric($this->data[$message->condition->if]) && is_numeric($message->condition->value))
                    ? intval($this->data[$message->condition->if]) < intval($message->condition->value)
                    : false;
                    if ($cond) {
                        $msg = strtr($message->message, $this->placeholdered_data);
                    }
                    break;
                case 'contains':
                    // basic strpos function, if there's a match we get an index ( might be 0 )
                    $cond = strpos($this->data[$message->condition->if], $message->condition->value) !== false;
                    if ($cond) {
                        $msg = strtr($message->message, $this->placeholdered_data);
                    }
                    break;
                default:
                    // default case "IS" is a basic comparison between strings
                    $cond = $this->data[$message->condition->if] === $message->condition->value;
                    if ($cond) {
                        $msg = strtr($message->message, $this->placeholdered_data);
                    }
                    break;
            }
        }

        if ($msg === '') {
            $msg = strtr($this->get('thank_you_message', ''), $this->placeholdered_data);
        }

        return $msg;
    }

    /**
     * Get images and render them as previews
     */
    public function get_image_html($string)
    {
        $trimmed      = substr($string, 1, -1);
        $trimmedArray = explode(':', $trimmed);
        $id           = end($trimmedArray);

        return '<img src="' . esc_url(wp_get_attachment_url($id)) . '" />';
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
     * Verify recaptcha
     *
     * @return void
     */
    public function verify_recaptcha()
    {
        if (empty($_POST['data'])) {
            return $this->display_error(esc_html__('There is no post data', 'kaliforms'));
        }
        if (!isset($_POST['data']['nonce'])) {
            return $this->display_error(esc_html__('Sneaky sneaky', 'kaliforms'));
        }
        if (!wp_verify_nonce(sanitize_key(wp_unslash($_POST['data']['nonce'])), 'kaliforms_nonce')) {
            return $this->display_error(esc_html__('Sneaky sneaky', 'kaliforms'));
        }

        if (empty($_POST['data']['formId'])) {
            return $this->display_error(esc_html__('Form didn`t send a form id, are we sure it is correct?', 'kaliforms'));
        }

        $this->post = get_post(absint(wp_unslash($_POST['data']['formId'])));

        if ($this->post === null) {
            return $this->display_error(esc_html__('There is no form associated with this id. Make sure you copied it correctly', 'kaliforms'));
        }

        $recaptcha_secret_key = $this->get('google_secret_key', '');
        if (empty($recaptcha_secret_key)) {
            return $this->display_error(esc_html__('There is no recaptcha key', 'kaliforms'));
        }

        $response = wp_remote_post(
            'https://www.google.com/recaptcha/api/siteverify',
            [
                'body' => [
                    'secret'   => $recaptcha_secret_key,
                    'response' => wp_unslash($_POST['data']['token']),
                ],
            ]
        );

        if (is_wp_error($response)) {
            return $this->display_error(esc_html__('Something went wrong', 'kaliforms'));
        }

        wp_die(
            wp_json_encode(
                [
                    'response' => json_decode($response['body']),
                ]
            )
        );
    }

    /**
     * Displays an error in the frontend
     *
     */
    public function display_error($err)
    {
        wp_die(wp_json_encode(['message' => $err, 'error' => true]));
    }
}
