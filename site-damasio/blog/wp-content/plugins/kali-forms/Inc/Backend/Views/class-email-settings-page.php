<?php

namespace KaliForms\Inc\Backend\Views;

if (!defined('WPINC')) {
    die;
}

/**
 * Class Email_Settings_Page
 *
 * @package Inc\Backend\Views
 */
class Email_Settings_Page
{
    /**
     * Plugin slug
     *
     * @var string
     */
    protected $slug = 'kaliforms';

    /**
     * Email_Settings_Page constructor.
     */
    public function __construct()
    {
        add_action('admin_init', [$this, 'register_settings']);
        /**
         * Admin enqueue script
         */
        add_action(
            'admin_enqueue_scripts',
            [$this, 'admin_enqueue'],
            99
        );
    }
    /**
     * Enqueue files in the admin
     */
    public function admin_enqueue()
    {
        $screen = get_current_screen();
        if ('kaliforms_forms' === $screen->post_type && 'kaliforms_forms_page_kaliforms-email-settings' === $screen->base) {
            wp_enqueue_script(
                'kaliforms-email-settings-scripts',
                KALIFORMS_URL . 'assets/email-settings/js/emailSettings.js',
                ['wp-i18n', 'wp-components', 'wp-data', 'wp-element', 'wp-polyfill'],
                KALIFORMS_VERSION,
                true
            );
            wp_localize_script(
                'kaliforms-email-settings-scripts',
                'KaliFormsEmailSettingsObject',
                [
                    'ajaxurl'      => esc_url(admin_url('admin-ajax.php')),
                    'ajax_nonce'   => wp_create_nonce($this->slug . '_nonce'),
                    'settings'     => [
                        'smtp_provider'        => get_option($this->slug . '_smtp_provider', 'php'),
                        'smtp_host'            => get_option($this->slug . '_smtp_host', ''),
                        'smtp_auth'            => get_option($this->slug . '_smtp_auth', '0'),
                        'smtp_disable_autotls' => get_option($this->slug . '_smtp_disable_autotls', '0'),
                        'smtp_port'            => get_option($this->slug . '_smtp_port', ''),
                        'smtp_secure'          => get_option($this->slug . '_smtp_secure', 'None'),
                        'smtp_username'        => get_option($this->slug . '_smtp_username', ''),
                        'smtp_password'        => get_option($this->slug . '_smtp_password', ''),
                        'email_log'            => get_option($this->slug . '_email_log', '1'),
                        'smtp_com_api_key'     => get_option($this->slug . '_smtp_com_api_key', ''),
                        'smtp_com_sender_name' => get_option($this->slug . '_smtp_com_sender_name', ''),
                        'sendin_blue_api'      => get_option($this->slug . '_sendin_blue_api', ''),
                        'admin_email'          => get_bloginfo('admin_email'),
                        'from_email'           => get_bloginfo('admin_email'),
                        'return_path'          => get_option($this->slug . '_return_path', ''),
                        'mailgun_domain_name'  => get_option($this->slug . '_mailgun_domain_name', ''),
                        'mailgun_private_key'  => get_option($this->slug . '_mailgun_private_key', ''),
                        'mailgun_region'       => get_option($this->slug . '_mailgun_region', ''),
                        'postmark_server_api'  => get_option($this->slug . '_postmark_server_api', ''),
                        'selected_tab'         => $this->_get_selected_tab(),
                    ],
                    'providers'    => [
                        'wp'         => [
                            'logo'  => KALIFORMS_URL . 'assets/img/wp_logo.svg',
                            'label' => __('Default WP Mailer', 'kaliforms'),
                        ],
                        'php'        => [
                            'logo'  => KALIFORMS_URL . 'assets/img/php-logo.svg',
                            'label' => __('PHP Mailer', 'kaliforms'),
                        ],
                        'smtp'       => [
                            'logo'  => KALIFORMS_URL . 'assets/img/smtp.svg',
                            'label' => __('Custom SMTP', 'kaliforms'),
                        ],
                        'smtpcom'    => [
                            'logo'  => KALIFORMS_URL . 'assets/img/smtp-com.svg',
                            'label' => __('SMTP.com', 'kaliforms'),
                        ],
                        'sendinblue' => [
                            'logo'  => KALIFORMS_URL . 'assets/img/sendinblue.svg',
                            'label' => __('Send in blue', 'kaliforms'),
                        ],
                        'mailgun'    => [
                            'logo'  => KALIFORMS_URL . 'assets/img/mailgun.svg',
                            'label' => __('Mailgun', 'kaliforms'),
                        ],
                        'postmark'   => [
                            'logo'  => KALIFORMS_URL . 'assets/img/postmark.svg',
                            'label' => __('Postmark', 'kaliforms'),
                        ],
                        // 'gmail'    => [
                        //     'logo'  => KALIFORMS_URL . 'assets/img/gmail.png',
                        //     'label' => __('GMail', 'kaliforms'),
                        // ],
                        // 'mandrill' => [
                        //     'logo'  => KALIFORMS_URL . 'assets/img/mandrill.png',
                        //     'label' => __('Mandrill', 'kaliforms'),
                        // ],
                        // 'sendgrid' => [
                        //     'logo'  => KALIFORMS_URL . 'assets/img/sendgrid.png',
                        //     'label' => __('Sendgrid', 'kaliforms'),
                        // ],
                    ],
                    'translations' => [
                        'logInfo' => esc_html__('Log will appear after page refresh if this is checked', 'kaliforms'),
                    ],
                ]
            );
            wp_enqueue_style(
                'kaliforms-email-settings',
                KALIFORMS_URL . 'assets/email-settings/css/emailSettings.css',
                false,
                KALIFORMS_VERSION
            );
        }

    }
    /**
     * Gets the selected tab
     *
     * @return void
     */
    public function _get_selected_tab()
    {
        return $this->get_request_parameter('tab', 'settings');
    }
    /**
     * Gets the request parameter.
     *
     * @param      string  $key      The query parameter
     * @param      string  $default  The default value to return if not found
     *
     * @return     string  The request parameter.
     */
    public function get_request_parameter($key, $default = '')
    {
        // If not request set
        if (!isset($_REQUEST[$key]) || empty($_REQUEST[$key])) {
            return $default;
        }

        // Set so process it
        return strip_tags((string) wp_unslash($_REQUEST[$key]));
    }

    /**
     * Registers smtp settings
     *
     * @return void
     */
    public function register_settings()
    {
        $settings = [
            ['smtp_provider', 'sanitize_text_field'],
            ['smtp_host', 'sanitize_text_field'],
            ['smtp_port', 'absint'],
            ['smtp_username', 'sanitize_text_field'],
            ['smtp_password', 'sanitize_text_field'],
            ['smtp_com_api_key', 'sanitize_text_field'],
            ['smtp_com_sender_name', 'sanitize_text_field'],
            ['sendin_blue_api', 'sanitize_text_field'],
            ['smtp_auth', 'KaliForms\Inc\Backend\Sanitizers::sanitize_regular_checkbox'],
            ['smtp_secure', 'KaliForms\Inc\Backend\Sanitizers::sanitize_secure_options'],
            ['email_log', 'KaliForms\Inc\Backend\Sanitizers::sanitize_regular_checkbox'],
            ['smtp_disable_autotls', 'KaliForms\Inc\Backend\Sanitizers::sanitize_regular_checkbox'],
            ['return_path', 'sanitize_text_field'],
            ['mailgun_private_key', 'sanitize_text_field'],
            ['mailgun_domain_name', 'sanitize_text_field'],
            ['mailgun_region', 'sanitize_text_field'],
            ['postmark_server_api', 'sanitize_text_field'],
        ];

        $settings = apply_filters($this->slug . '_email_settings_page', $settings);
        foreach ($settings as $setting) {
            register_setting($this->slug . '_email_settings', $this->slug . '_' . $setting[0], $setting[1]);
        }
    }

    /**
     * Renders app
     */
    public function render_app()
    {
        echo '<div class="wrap">';
        echo '<div id="kaliforms-email-settings-page">';
        echo '</div>';
        echo '<div id="kali-settings-fields">';
        settings_fields($this->slug . '_email_settings');
        echo '</div>';
        echo '</div>';
    }

    /**
     * Invoking the class will render the app
     */
    public function __invoke()
    {
        /**
         * Initiate an action before rendering the app div
         */
        do_action($this->slug . '_before_email_settings_page_rendering');

        /**
         * Echo the container
         */
        $this->render_app();

        /**
         * Initiate an action after rendering the app div
         */
        do_action($this->slug . '_after_email_settings_page_rendering');
    }

}
