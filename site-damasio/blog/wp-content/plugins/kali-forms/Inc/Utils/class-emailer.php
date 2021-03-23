<?php

namespace KaliForms\Inc\Utils;

use KaliForms\Inc\Utils\EmailProviders\Default_Mailer;
use KaliForms\Inc\Utils\EmailProviders\Mailgun;
use KaliForms\Inc\Utils\EmailProviders\Postmark;
use KaliForms\Inc\Utils\EmailProviders\Sendinblue;
use KaliForms\Inc\Utils\EmailProviders\SMTP;
use KaliForms\Inc\Utils\EmailProviders\SMTPCom;
use KaliForms\Inc\Utils\EmailProviders\WP_Default;
use KaliForms\Inc\Utils\EmailUtilities\Email_Logger;

class Emailer
{
    /**
     * Plugin slug
     *
     * @var string
     */
    public $slug = 'kaliforms';
    /**
     * Current form id
     *
     * @var [Number]
     */
    public $form = null;
    /**
     * Submission id
     *
     * @var [type]
     */
    public $submission = null;
    /**
     * Placeholders
     *
     * @var array
     */
    public $placeholders = [];
    /**
     * Field type map
     *
     * @var array
     */
    public $field_type_map = [];
    /**
     * Data
     *
     * @var [type]
     */
    public $data = [];
    /**
     * Email providers
     *
     * @var array
     */
    public $providers = [];
    /**
     * Class constructor
     *
     * @param [type] $form_id
     */
    public function __construct($form_id = null, $rawData = null, $placeholders = null)
    {
        $this->form = $form_id;
        if ($this->form === null) {
            return new \WP_Error(500, esc_html__('Something went wrong', 'kaliforms'));
        }
        $this->data         = $rawData;
        $this->placeholders = $placeholders;

        $this->selected_provider = get_option($this->slug . '_smtp_provider', 'wp');

        $this->providers = [
            'wp'         => WP_Default::class,
            'php'        => Default_Mailer::class,
            'sendinblue' => Sendinblue::class,
            'smtp'       => SMTP::class,
            'smtpcom'    => SMTPCom::class,
            'mailgun'    => Mailgun::class,
            'postmark'   => Postmark::class,
        ];

        Email_Logger::get_instance();
    }

    /**
     * Attaches a submission id and popuplates 'data' and 'placeholders' with its values
     *
     * @param [type] $id
     * @return void
     */
    public function attach_submission($id)
    {
        $this->submission = $id;
        if ($this->submission === null) {
            return new \WP_Error(500, esc_html__('Something went wrong', 'kaliforms'));
        }

        $this->prepare_data();
        $this->prepare_placeholders();
    }

    /**
     * Prepares data to be used in the email
     *
     * @return void
     */
    public function prepare_data()
    {
        $components = $this->get('form', true, 'field_components', '[]');
        if ($components === null || $components === '' && $components !== null) {
            return $columns;
        }

        $components = json_decode($components);
        $arr        = [];

        foreach ($components as $component) {
            $name = $this->pluck_value_from_properties('name', $component);
            if ($name !== null) {
                $arr[$name] = esc_html($this->get('submission', false, $name, ''));
            }
        }

        $this->data = $arr;
    }

    /**
     * Prepares placeholders
     *
     * @return void
     */
    public function prepare_placeholders()
    {
        $prepared_maps            = $this->setup_field_map();
        $this->field_type_map     = $prepared_maps['map'];
        $this->advanced_field_map = $prepared_maps['advanced'];
        $this->data               = array_merge($this->data, $this->_get_product_fields($this->data));
        // @todo just like on thankyou message
        foreach ($this->data as $k => $v) {
            $type = 'textbox';
            if (isset($this->field_type_map[$k]) && !empty($this->field_type_map[$k])) {
                $type = $this->field_type_map[$k];
            }

            switch ($type) {
                case 'wireTransfer':
                    $this->placeholders['{' . $k . '}'] = wp_kses_post($this->advanced_field_map[$k]->afterInfo);
                    break;
                case 'product':
                case 'multipleProducts':
                    $this->placeholders['{' . $k . ':label}'] = sanitize_text_field($v['label']);
                    $this->placeholders['{' . $k . ':price}'] = floatval($v['price']);
                    if (!empty($v['image']->fullUrl)) {
                        $this->placeholders['{' . $k . ':image}'] = '<img style="width:100%" src="' . esc_url($v['image']->fullUrl) . '" />';
                    }
                    break;
                case 'radio':
                    $this->placeholders['{' . $k . '}'] = sanitize_text_field($v);

                    $choice_labels = [];
                    foreach ($this->advanced_field_map[$k]->choices as $choice) {
                        $choice_labels[$choice->value] = $choice->label;
                    }

                    $this->placeholders['{' . $k . ':value}'] = $this->placeholders['{' . $k . '}'];
                    $this->placeholders['{' . $k . ':label}'] = sanitize_text_field($choice_labels[$v]);
                    break;
                case 'checkbox':
                case 'dropdown':
                case 'choices':
                case 'donation':
                    $this->placeholders['{' . $k . '}'] = is_array($v)
                    ? sanitize_text_field(implode($this->get('form', true, 'multiple_selections_separator', ','), $v))
                    : sanitize_text_field($v);

                    $choice_labels = [];
                    foreach ($this->advanced_field_map[$k]->choices as $choice) {
                        $choice_labels[$choice->value] = $choice->label;
                    }

                    $label = '';
                    if (strpos($v, $this->get('form', true, 'multiple_selections_separator', ','))) {
                        $v = explode($this->get('form', true, 'multiple_selections_separator', ','), $v);
                    }

                    if (is_array($v)) {
                        $newVal = [];
                        foreach ($v as $value) {
                            $newVal[] = $choice_labels[$value];
                        }
                        $label = implode($this->get('form', true, 'multiple_selections_separator', ','), $newVal);
                    } else {
                        $label = isset($choice_labels[$v]) ? $choice_labels[$v] : $v;
                    }

                    $this->placeholders['{' . $k . ':value}'] = $this->placeholders['{' . $k . '}'];
                    $this->placeholders['{' . $k . ':label}'] = sanitize_text_field($label);
                    break;

                case 'fileUpload':
                    $title  = [];
                    $images = [];
                    $urls   = [];

                    $ids = explode(',', $v);
                    foreach ($ids as $uId) {
                        $img = wp_get_attachment_url($uId);

                        $title[]  = get_the_title($uId);
                        $images[] = '<img style="width:100%" src="' . esc_url($img) . '" />';
                        $urls[]   = esc_url($img);
                    }
                    $this->placeholders['{' . $k . ':title}'] = implode(',', $title);
                    $this->placeholders['{' . $k . ':image}'] = implode("\n", $images);
                    $this->placeholders['{' . $k . ':id}']    = sanitize_text_field($v);
                    $this->placeholders['{' . $k . ':url}']   = implode(',', $urls);
                    break;

                case 'imageRadio':
                    $img = wp_get_attachment_url($v);

                    $choice_labels = [];
                    foreach ($this->advanced_field_map[$k]->choices as $choice) {
                        $choice_labels[$choice->image->id] = ['label' => $choice->label, 'caption' => $choice->caption];
                    }

                    $this->placeholders['{' . $k . ':title}'] = get_the_title($v);
                    $this->placeholders['{' . $k . ':image}'] = '<img style="width:100%" src="' . esc_url($img) . '" />';
                    $this->placeholders['{' . $k . ':id}']    = sanitize_text_field($v);
                    $this->placeholders['{' . $k . ':url}']   = esc_url($img);
                    $this->placeholders['{' . $k . ':label}'] = sanitize_text_field(
                        isset($choice_labels[$v]['label']) ? $choice_labels[$v]['label'] : ''
                    );
                    $this->placeholders['{' . $k . ':caption}'] = sanitize_text_field(
                        isset($choice_labels[$v]['caption']) ? $choice_labels[$v]['caption'] : ''
                    );

                    break;
                case 'digitalSignature':
                    $validB64 = preg_match("/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).base64,.*/", $v);
                    if ($validB64 > 0) {
                        $this->placeholders['{' . $k . ':signature}'] = '<img style="width:100%" src="' . sanitize_text_field($v) . '" />';
                        $this->placeholders['{' . $k . ':src}']       = sanitize_text_field($v);
                        break;
                    }
                    $img = wp_get_attachment_url($v);

                    $this->placeholders['{' . $k . ':signature}'] = '<img style="width:100%" src="' . esc_url($img) . '" />';
                    $this->placeholders['{' . $k . ':id}']        = sanitize_text_field($v);
                    break;
                default:
                    $this->placeholders['{' . $k . '}'] = is_array($v)
                    ? implode($this->get('form', true, 'multiple_selections_separator', ','), $v)
                    : $v;
                    break;
            }
        }

        $this->placeholders = array_merge((new GeneralPlaceholders())->general_placeholders, $this->placeholders);
        if (isset($this->placeholders['{entryCounter}'])) {
            $this->placeholders['{entryCounter}'] = call_user_func($this->placeholders['{entryCounter}'], $this->form);
        }
        if (isset($this->placeholders['{thisPermalink}'])) {
            $this->placeholders['{thisPermalink}'] = call_user_func($this->placeholders['{thisPermalink}']);
        }

        if (isset($this->placeholders['{submission_link}'])) {
            $this->placeholders['{submission_link}'] = call_user_func(
                $this->placeholders['{submission_link}'],
                $this->get('form', true, 'submission_view_page', 0),
                $this->submission,
                $this->form,
                true
            );
        }
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
     * Sets up field map ( field id -> field type )
     *
     * @return void
     */
    public function setup_field_map()
    {
        $map         = [];
        $advancedMap = [];
        $fields      = json_decode($this->get('form', true, 'field_components', '[]'), false, 512, JSON_HEX_QUOT);
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
            if (!in_array($key, ['formId', 'nonce', 'ip_address'])) {
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
        $fields = json_decode($this->get('form', true, 'field_components', '[]'), false, 512, JSON_HEX_QUOT);
        $label  = '';
        foreach ($fields as $idx => $field) {
            if ($field->properties->name === $key) {
                $label = !empty($field->properties->caption) ? $field->properties->caption : $field->properties->name;
                break;
            }
        }
        return $label;
    }
    /**
     * Plucks values from the properties array
     *
     * @param [String] $key
     * @param [stdClass] $obj
     * @return String
     */
    public function pluck_value_from_properties($key, $obj)
    {
        if (isset($obj->properties->{$key})) {
            return $obj->properties->{$key};
        }
    }
    /**
     * Get selected provider
     *
     * @return void
     */
    public function get_selected_provider()
    {
        $emailer = isset($this->providers[$this->selected_provider])
        ? $this->providers[$this->selected_provider]
        : $this->providers[$this->try_and_determine_provider()];

        return new $emailer();
    }
    /**
     * Try and determine latest settings
     *
     * @return void
     */
    public function try_and_determine_provider()
    {
        $prov = 'wp';
        if (in_array($this->selected_provider, ['gmail', 'mandrill', 'sendgrid'])) {
            $prov = 'smtp';
        }

        return $prov;
    }
    /**
     * Return email props
     *
     * @param [type] $email
     * @return void
     */
    private function _get_email_props($email)
    {
        $props = [];
        foreach ($email as $prop => $value) {
            $initialParse = is_string($value) ? strtr($value, $this->placeholders) : $value;
            if ($prop === 'emailAttachmentMediaIds' && is_array($value)) {
                $res = [];
                foreach ($value as $media) {
                    $res[] = $media->id;
                }
                $initialParse = implode(',', $res);
            }

            $arr      = [];
            $previews = $this->get_strings_between($initialParse, '{', '}');
            foreach ($previews as $preview) {
                $arr[$preview] = $this->get_image_html($preview);
            }

            $arr          = array_filter($arr);
            $props[$prop] = strtr($initialParse, $arr);
        }

        if (!isset($props['emailAttachmentFilePaths'])) {
            $props['emailAttachmentFilePaths'] = '';
        }
        if (!isset($props['emailAttachmentMediaIds'])) {
            $props['emailAttachmentMediaIds'] = '';
        }
        return $props;
    }
    /**
     * Send emails
     *
     * @return void
     */
    public function send()
    {
        $emails = json_decode($this->get('form', true, 'emails', '[]'));

        $sent = [];
        foreach ($emails as $idx => $email) {
            $sent[] = $this->_send($email, $idx);
        }

        if (count($sent) === count($emails)) {
            return 'ok';
        }

        return new \WP_Error();
    }
    /**
     * Send emails one by one
     */
    private function _send($email, $idx)
    {
        $props   = $this->_get_email_props($email);
        $headers = $this->_get_headers($props);
        $emailer = $this->get_selected_provider();

        $attachments   = [];
        $fileUploads   = explode(',', $props['emailAttachment']);
        $filePaths     = explode(',', $props['emailAttachmentFilePaths']);
        $fileFromMedia = explode(',', $props['emailAttachmentMediaIds']);

        foreach ($fileUploads as $upload) {
            $validB64 = preg_match("/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).base64,.*/", $upload);
            if ($validB64 > 0) {
                continue;
            }

            if (isset($this->data[$upload]) && $this->data[$upload] !== '') {
                $uploaded = explode(',', $this->data[$upload]);
                foreach ($uploaded as $uId) {
                    $attachments[] = get_attached_file((int) $uId);
                }
            }
        }

        foreach ($fileFromMedia as $media) {
            $attachments[] = get_attached_file((int) $media);
        }

        foreach ($filePaths as $path) {
            if (!empty($path) && file_exists(ABSPATH . $path)) {
                $attachments[] = ABSPATH . $path;
            }
        }

        $attachments = array_filter($attachments);

        $emailer_props = apply_filters(
            $this->slug . '_email_properties_create_' . $this->form . '_' . $idx,
            [
                'to'          => explode(',', $props['toEmail']),
                'subject'     => $props['emailSubject'],
                'body'        => $props['emailBody'],
                'from'        => $props['fromEmail'],
                'fromName'    => $props['fromName'],
                'attachments' => $attachments,
                'cc'          => explode(',', $props['ccEmail']),
                'bcc'         => explode(',', $props['bccEmail']),
                'replyTo'     => explode(',', $props['replyTo']),
                'filter'      => $this->slug . '_email_properties_create_' . $this->form . '_' . $idx,
            ]
        );
        unset($emailer_props['filter']);
        $emailer->set_properties($emailer_props);

        return $emailer->send();
    }

    /**
     * Get email headers
     *
     * @param [type] $props
     * @return void
     */
    protected function _get_headers($props)
    {
        $headers = [];
        if (!empty($props['ccEmail'])) {
            $arr = explode(',', $props['ccEmail']);
            foreach ($arr as $email) {
                $headers[] = 'CC: <' . $email . '>;';
            }
        }
        if (!empty($props['bccEmail'])) {
            $arr = explode(',', $props['bccEmail']);
            foreach ($arr as $email) {
                $headers[] = 'BCC: <' . $email . '>;';
            }
        }
        if (!empty($props['replyTo'])) {
            $arr = explode(',', $props['replyTo']);
            foreach ($arr as $email) {
                $headers[] = 'Reply-to: <' . $email . '>;';
            }
        }
        return $headers;
    }
    /**
     * Shortcut for get_post_meta
     *
     * @param string $key
     * @param mixed  $default
     *
     * @return mixed
     */
    public function get($entity = 'form', $prefix = true, $key = '', $default = null)
    {
        $string = $prefix ? $this->slug . '_' . $key : $key;
        $value  = get_post_meta($this->{$entity}, $string, true);

        if ($value === null || $value === '' && $default !== null) {
            return $default;
        }

        return $value;
    }

    /**
     * Get images and render them as previews
     */
    public function get_image_html($string)
    {
        $trimmed      = substr($string, 1, -1);
        $trimmedArray = explode(':', $trimmed);
        $id           = end($trimmedArray);
        if (!is_numeric($id)) {
            return false;
        }
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
}
