<?php
namespace KaliForms\Inc\Utils;

if (!defined('ABSPATH')) {
    exit;
}

class Post_Translator
{
    use MetaHelper;
    /**
     * Plugin slug
     */
    public $slug = 'kaliforms';
    /**
     * Post
     *
     * @var [type]
     */
    public $post = null;
    /**
     * Form grid
     *
     * @var array
     */
    public $formGrid = [];
    /**
     * Form fields
     *
     * @var array
     */
    public $formFields = [];
    /**
     * Immutable state
     *
     * @var array
     */
    public $immutableState = [];
    /**
     * Form options
     *
     * @var array
     */
    public $formOptions = [];
    /**
     * Form notifications
     *
     * @var array
     */
    public $formNotifications = [];
    /**
     * Plugins
     */
    public $plugins = [];
    /**
     * Class constructor
     *
     * @param [type] $post
     */
    public function __construct($post)
    {
        if (is_int($post)) {
            $post = get_post($post);
        }
        $this->post = $post;
    }
    /**
     * Construct based on arguments so we don't query everything if not needed
     *
     * @param [type] ...$args
     * @return void
     */
    public function construct_these(...$args)
    {
        foreach ($args as $propName) {
            $methodName = 'set' . ucfirst($propName);
            if (method_exists($this, $methodName) && property_exists($this, $propName)) {
                $this->{$propName} = $this->{$methodName}();
            }
        }
    }
    /**
     * Sets form notifactions
     *
     * @return void
     */
    public function setFormNotifications()
    {
        return apply_filters(
            $this->slug . '_form_notifications',
            [
                'formId' => absint($this->post->ID),
                'emails' => json_decode($this->get('emails', '[]')),
                'sms'    => class_exists('KaliForms\Inc\KaliForms_Sms') ? json_decode($this->get('sms', '[]')) : [],
            ]
        );
    }
    /**
     * Immutable state
     *
     * @return void
     */
    public function setImmutableState()
    {
        return apply_filters(
            $this->slug . '_immutable_state',
            [
                'ABSPATH'           => ABSPATH,
                'ajaxurl'           => esc_url(admin_url('admin-ajax.php')),
                'assetsUrl'         => esc_url(KALIFORMS_URL . 'assets'),
                'assetsUrlBackend'  => esc_url(KALIFORMS_URL . 'assets/backend'),
                'assetsUrlFrontend' => esc_url(KALIFORMS_URL . 'assets/frontend'),
                'exitUrl'           => esc_url(admin_url('edit.php?post_type=kaliforms_forms')),
                'ajaxnonce'         => wp_create_nonce($this->slug . '_nonce'),
                'entriesCount'      => absint($this->_get_entries_count()),
                'websitePages'      => $this->_get_website_pages(),
            ]);
    }
    /**
     * Form options
     *
     * @return void
     */
    public function setFormOptions()
    {
        $options = apply_filters(
            $this->slug . '_form_options',
            [
                'formId'                      => absint($this->post->ID),
                'requiredFieldMark'           => wp_kses_post($this->get('required_field_mark', '')),
                'globalErrorMessage'          => wp_kses_post($this->get('global_error_message', '')),
                'multipleSelectionsSeparator' => wp_kses_post($this->get('multiple_selections_separator', ',')),
                'removeCaptchaForLoggedUsers' => esc_attr($this->get('remove_captcha_for_logged_users', '0')),
                'hideFormName'                => esc_attr($this->get('hide_form_name', '0')),
                'cssId'                       => esc_attr($this->get('css_id', '')),
                'cssClass'                    => esc_attr($this->get('css_class', '')),
                'saveIpAddress'               => esc_attr($this->get('save_ip_address', '0')),
                'formName'                    => esc_html(get_the_title($this->post)),
                'resetFormAfterSubmit'        => esc_attr($this->get('reset_form_after_submit', '0')),
                'showThankYouMessage'         => esc_attr($this->get('show_thank_you_message', '0')),
                'saveFormSubmissions'         => esc_attr($this->get('save_form_submissions', '0')),
                'thankYouMessage'             => wp_kses_post($this->get('thank_you_message', '')),
                'redirectUrl'                 => esc_url($this->get('redirect_url', '')),
                'formAction'                  => esc_url($this->get('form_action', '')),
                'formMethod'                  => esc_attr($this->get('form_method', '')),
                'submissionViewPage'          => absint($this->get('submission_view_page', '0')),
                'honeypot'                    => esc_attr($this->get('honeypot', '0')),
                'akismetKey'                  => esc_attr(get_option('wordpress_api_key', '0')),
                'akismet'                     => esc_attr($this->get('akismet', '0')),
                'akismetFields'               => json_decode($this->get('akismet_fields', '[]'), false, 512, JSON_HEX_QUOT),
                'googleSiteKey'               => esc_attr($this->get('google_site_key', '')),
                'googleSecretKey'             => esc_attr($this->get('google_secret_key', '')),
                'entriesUrl'                  => esc_url(admin_url('edit.php?post_type=kaliforms_submitted&formId=' . absint($this->post->ID))),
                'payPalClientId'              => esc_html($this->get('paypal_client_id', '')),
                'payPalClientIdSandBox'       => esc_html($this->get('paypal_client_id_sandbox', '')),
                'paymentsLive'                => esc_attr($this->get('payments_live', '0')),
                'currency'                    => esc_attr($this->get('currency', 'USD')),
                'selectedFormStyle'           => esc_attr($this->get('selected_form_style', 'theme')),
            ]
        );

        foreach ($options as $key => $value) {
            if (strpos($key, 'Installed') > -1) {
                unset($options[$key]);
            }
        }

        return $options;
    }
    /**
     * Form grid
     *
     * @return void
     */
    public function setFormGrid()
    {
        return apply_filters(
            $this->slug . '_form_grid',
            json_decode($this->get('grid', '[]'))
        );

    }
    /**
     * Form fields
     *
     * @return void
     */
    public function setFormFields()
    {
        return apply_filters(
            $this->slug . '_form_fields',
            json_decode($this->get('field_components', '[]'), false, 512, JSON_HEX_QUOT)
        );
    }
    /**
     * Return plugins
     *
     * @return void
     */
    public function setPlugins()
    {
        return apply_filters(
            $this->slug . '_plugins',
            [
                'pro'              => class_exists('KaliForms\Inc\KaliForms_Pro'),
                'user'             => class_exists('KaliForms\Inc\KaliForms_User_Registration'),
                'sms'              => class_exists('KaliForms\Inc\KaliForms_Sms'),
                'newsletter'       => class_exists('KaliForms\Inc\KaliForms_Newsletter'),
                'slack'            => class_exists('KaliForms\Inc\KaliForms_Slack'),
                'googleSheets'     => class_exists('KaliForms\Inc\KaliForms_Google_Sheets'),
                'hubspot'          => class_exists('KaliForms\Inc\KaliForms_Hubspot'),
                'webhooks'         => class_exists('KaliForms\Inc\KaliForms_Webhooks'),
                'payments'         => class_exists('KaliForms\Inc\KaliForms_Payments'),
                'submissions'      => class_exists('KaliForms\Inc\KaliForms_Submissions'),
                'analytics'        => class_exists('KaliForms\Inc\KaliForms_Google_Analytics'),
                'digitalSignature' => class_exists('KaliForms\Inc\KaliForms_Digital_Signature'),
            ]
        );
    }
    /**
     * Get website pages ( we might need it when choosing the page where submission shortcode is )
     *
     * @return void
     */
    private function _get_website_pages()
    {
        $args = [
            'post_type'      => 'page',
            'posts_per_page' => -1,
        ];
        $query = new \WP_Query($args);
        $pages = [];
        if ($query->have_posts()) {
            foreach ($query->posts as $post) {
                $pages[] = [
                    'id'        => $post->ID,
                    'title'     => $post->post_title,
                    'permalink' => get_permalink($post->ID),
                ];
            }
        }
        wp_reset_postdata();
        return $pages;
    }
    /**
     * Entry count
     *
     * @return void
     */
    private function _get_entries_count()
    {
        $args = [
            'post_type'      => $this->slug . '_submitted',
            'posts_per_page' => -1,
            'meta_key'       => 'formId',
            'meta_query'     => [
                [
                    'key'     => 'formId',
                    'value'   => $this->post->ID,
                    'compare' => '=',
                ],
            ],
        ];
        $query   = new \WP_Query($args);
        $counter = 0;
        if ($query->have_posts()) {
            $counter = $query->post_count;
        }
        wp_reset_postdata();
        wp_reset_query();
        return $counter;
    }
}
