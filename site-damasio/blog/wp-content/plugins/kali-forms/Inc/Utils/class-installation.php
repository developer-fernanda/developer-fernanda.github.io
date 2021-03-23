<?php

namespace KaliForms\Inc\Utils;

/**
 * Class Installation
 *
 * @since 2.2.0
 *
 * Purpose of this class was to update users to the SMTP settings
 *
 * @package Inc\Utils
 */

class Installation
{
    /**
     * Plugin slug
     *
     * @var string
     */
    protected $slug = 'kaliforms';
    /**
     * Saved options
     *
     * @var array
     */
    protected $saved_options = [];
    /**
     * Class constructor
     */
    public function __construct()
    {
        $updated = get_option($this->slug . '_settings_updated_for_220', false);

        $this->saved_options = $this->_get_saved_options();
        if ($updated !== 'yes') {
            $this->add_options();
        }

        $this->_check_submission_page_option();
        $this->_check_submission_plugin();
    }
    /**
     * Check submission plugin
     *
     * @return void
     */
    private function _check_submission_plugin()
    {
        if (
            defined('KALIFORMS_SUBMISSIONS_PLUGIN_FILE')
            && defined('KALIFORMS_SUBMISSIONS_VERSION')
            && version_compare(KALIFORMS_SUBMISSIONS_VERSION, '1.4.0', '<')
        ) {
            deactivate_plugins(KALIFORMS_SUBMISSIONS_PLUGIN_FILE, true);
        }
    }
    /**
     * Checks submission page option
     *
     * @return void
     */
    private function _check_submission_page_option()
    {
        $args = [
            'post_type'      => 'kaliforms_forms',
            'posts_per_page' => -1,
        ];
        $query = new \WP_Query($args);
        if ($query->have_posts()) {
            foreach ($query->posts as $post) {
                $option = get_post_meta($post->ID, 'kaliforms_submission_view_page', true);

                if (is_numeric($option) || $option === '') {
                    continue;
                }

                if (filter_var($option, FILTER_VALIDATE_URL)) {
                    $new_option = url_to_postid($option);
                    update_post_meta($post->ID, 'kaliforms_submission_view_page', $new_option);
                }
            }
        }
        wp_reset_postdata();
    }
    /**
     * Get saved function
     *
     * @return void
     */
    private function _get_saved_options()
    {
        return [
            'smtp_provider' => get_option($this->slug . '_smtp_provider'),
            'smtp_host'     => get_option($this->slug . '_smtp_host'),
            'smtp_auth'     => get_option($this->slug . '_smtp_auth', 0),
            'smtp_port'     => get_option($this->slug . '_smtp_port'),
            'smtp_secure'   => get_option($this->slug . '_smtp_secure'),
            'smtp_username' => get_option($this->slug . '_smtp_username', ''),
            'smtp_password' => get_option($this->slug . '_smtp_password', ''),
        ];
    }
    /**
     * Add options to database
     *
     * @return void
     */
    public function add_options()
    {
        $this->check_if_we_have_different_settings();

        add_option($this->slug . '_email_log', 1);
        add_option($this->slug . '_smtp_auth', 0);
        add_option($this->slug . '_smtp_disable_autotls', 0);
        delete_option($this->slug . '_smtp_advanced');

        add_option($this->slug . '_save_ip_address', 1);
        add_option($this->slug . '_settings_updated_for_220', 'yes');
    }

    /**
     * Check if we have different settings
     *
     * @return void
     */
    public function check_if_we_have_different_settings()
    {
        $previous_settings = ['gmail', 'mandrill', 'mailgun', 'sendgrid'];
        if (in_array($this->saved_options['smtp_provider'], $previous_settings) || $this->smtp_settings_used()) {
            update_option($this->slug . '_smtp_provider', 'smtp');
            return;
        }

        return update_option($this->slug . '_smtp_provider', 'wp');
    }

    /**
     * Determine if smtp settings were used
     *
     * @return void
     */
    public function smtp_settings_used()
    {
        if (empty($this->saved_options['smtp_host'])) {
            return false;
        }

        if (empty($this->saved_options['smtp_username']) || empty($this->saved_options['smtp_password'])) {
            return false;
        }

        return true;
    }

    /**
     * Remove logs if exists on the server
     *
     * @todo remove this in future versions
     * @return void
     */
    public function remove_log_if_exists()
    {
        $temp_dir = get_temp_dir();
        if (file_exists($temp_dir . $this->slug . '-mail.log')) {
            unlink($temp_dir . $this->slug . '-mail.log');
        }
    }
}
