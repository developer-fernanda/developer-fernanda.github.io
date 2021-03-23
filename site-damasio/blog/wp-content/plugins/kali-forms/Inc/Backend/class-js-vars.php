<?php

namespace KaliForms\Inc\Backend;

use KaliForms\Inc\Utils\MetaHelper;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Class JSVars is the "locale" object used in the backend.
 *
 * You can pass any variables from the database here,
 * so they can be used in the JS App. Although this can be done through AJAX,
 * some things are best available when document is ready
 *
 * @package Inc\Backend
 */
class JS_Vars
{
    /**
     * Metahelper trait
     */
    use MetaHelper;
    /**
     * @var null
     */
    protected $post = null;
    /**
     * Plugin slug
     *
     * @var string
     */
    protected $slug = 'kaliforms';
    /**
     * This is the object needed in the frontend
     *
     * @var array
     */
    public $content = [];
    /**
     * Set post property
     */
    public function set_post($post)
    {
        $this->post = $post;
    }
    /**
     * Basic constructor
     *
     * JSVars constructor
     */
    public function __construct($post = null)
    {
        if ($post !== null) {
            $this->set_post($post);
        }

        $this->content['ABSPATH'] = ABSPATH;
        /**
         * Constructor creates the ajax url
         */
        $this->content['ajaxurl'] = esc_url(admin_url('admin-ajax.php'));
        /**
         * Assets url
         */
        $this->content['assetsUrl']         = esc_url(KALIFORMS_URL . 'assets');
        $this->content['assetsUrlBackend']  = esc_url(KALIFORMS_URL . 'assets/backend');
        $this->content['assetsUrlFrontend'] = esc_url(KALIFORMS_URL . 'assets/frontend');
        /**
         * And the nonce
         */
        $this->content['ajax_nonce'] = wp_create_nonce($this->slug . '_nonce');
        /**
         * Exit url ( when button is pressed )
         */
        $this->content['exit_url'] = esc_url(admin_url('edit.php?post_type=kaliforms_forms'));
        /**
         * Build the form fields array
         */
        $this->content['formFields'] = (new Form_Fields())->form_fields;
        /**
         * Grid content
         */
        $this->content['grid'] = json_decode($this->get('grid', '[]'));
        /**
         * Field components saved in the database
         */
        $this->content['fieldComponents'] = json_decode($this->get('field_components', '[]'), false, 512, JSON_HEX_QUOT);
        /**
         * Form Info Fields
         */
        $this->content['requiredFieldMark']           = wp_kses_post($this->get('required_field_mark', ''));
        $this->content['globalErrorMessage']          = wp_kses_post($this->get('global_error_message', ''));
        $this->content['multipleSelectionsSeparator'] = wp_kses_post($this->get('multiple_selections_separator', ','));
        $this->content['removeCaptchaForLoggedUsers'] = esc_attr($this->get('remove_captcha_for_logged_users', '0'));
        $this->content['hideFormName']                = esc_attr($this->get('hide_form_name', '0'));
        $this->content['cssId']                       = esc_attr($this->get('css_id', ''));
        $this->content['cssClass']                    = esc_attr($this->get('css_class', ''));
        $this->content['saveIpAddress']               = esc_attr($this->get('save_ip_address', '0'));
        /**
         * Actual form name
         */
        $this->content['formName'] = esc_html(get_the_title($this->post));
        /**
         * Form settings
         */
        $this->content['resetFormAfterSubmit'] = esc_attr($this->get('reset_form_after_submit', '0'));
        $this->content['showThankYouMessage']  = esc_attr($this->get('show_thank_you_message', '0'));
        $this->content['saveFormSubmissions']  = esc_attr($this->get('save_form_submissions', '0'));
        $this->content['thankYouMessage']      = wp_kses_post($this->get('thank_you_message', ''));
        $this->content['redirectUrl']          = esc_url($this->get('redirect_url', ''));
        $this->content['formAction']           = esc_url($this->get('form_action', ''));
        $this->content['formMethod']           = esc_attr($this->get('form_method', ''));
        $this->content['submissionViewPage']   = absint($this->get('submission_view_page', '0'));
        $this->content['websitePages']         = $this->_get_website_pages();
        /**
         * Form spam
         */
        $this->content['honeypot']        = esc_attr($this->get('honeypot', '0'));
        $this->content['akismetKey']      = esc_attr(get_option('wordpress_api_key', '0'));
        $this->content['akismet']         = esc_attr($this->get('akismet', '0'));
        $this->content['akismetFields']   = json_decode($this->get('akismet_fields', '[]'), false, 512, JSON_HEX_QUOT);
        $this->content['googleSiteKey']   = esc_attr($this->get('google_site_key', ''));
        $this->content['googleSecretKey'] = esc_attr($this->get('google_secret_key', ''));

        /**
         * Form Emails
         */
        $this->content['formEmails'] = json_decode($this->get('emails', '[]'));
        /**
         * Predefined forms
         */
        $forms = new Predefined_Forms();
        $forms->set_forms();
        $this->content['predefinedForms'] = $forms->forms;

        /**
         * Form styles
         */
        $form_styles                 = Form_Styles::get_instance();
        $this->content['formStyles'] = $form_styles->styles;
        /**
         * Form id
         */
        $this->content['formId'] = absint($this->post->ID);
        $this->content['entries_url']   = esc_url(admin_url('edit.php?post_type=kaliforms_forms&page=kaliforms-form-entries#/form-entries/' . absint($this->post->ID)));
        $this->content['entries_count'] = absint($this->get_entries_count());
        /**
         * Payment fields
         */
        $this->content['payPalClientId']        = esc_html($this->get('paypal_client_id', ''));
        $this->content['payPalClientIdSandBox'] = esc_html($this->get('paypal_client_id_sandbox', ''));
        $this->content['paymentsLive']          = esc_attr($this->get('payments_live', '0'));
        $this->content['currency']              = esc_attr($this->get('currency', 'USD'));
        /**
         * Form Styles
         */
        $this->content['selectedFormStyle'] = esc_attr($this->get('selected_form_style', 'theme'));
        /**
         * Global notifications
         */
        $this->content['globalNotifications'] = (new Global_Notifications())->notifications;
        /**
         * Predefined options
         */
        $this->content['predefinedOptions'] = (new Predefined_Options())->options;
        /**
         * Applies a filter, maybe someone wants to edit something
         */
        $this->content = apply_filters($this->slug . '_jsvars_object', $this->content);
    }
    /**
     * Entry count
     *
     * @return void
     */
    public function get_entries_count()
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
    /**
     * Get website pages ( we might need it when choosing the page where submission shortcode is )
     *
     * @return void
     */
    public function _get_website_pages()
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
}
