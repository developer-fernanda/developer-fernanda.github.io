<?php

namespace KaliForms\Inc\Backend;

if (!defined('ABSPATH')) {
    exit;
}

use KaliForms\Inc\Utils\EmailUtilities\Email_Logger;

/**
 * Class Hooks
 *
 * @package Inc\Backend
 */
class Hooks
{
    /**
     * Plugin slug
     *
     * @var string
     */
    protected $slug = 'kaliforms';

    /**
     * Plugin basic hooks
     * Hooks constructor.
     */
    public function __construct()
    {
        /**
         * Admin enqueue script
         */
        add_action(
            'admin_enqueue_scripts',
            [$this, 'admin_enqueue'],
            99
        );

        add_action(
            'plugins_loaded',
            [$this, 'load_text_domain']
        );

        // add_action(
        //     'init',
        //     [$this, 'block_enqueue'],
        // );

        /**
         * Add settings link to plugins page
         */
        add_filter(
            'plugin_action_links_kaliforms/kaliforms.php',
            [$this, 'add_settings_link']
        );

        add_action('wp_ajax_kaliforms_reload_api_extensions',
            [$this, 'reload_api_extensions']
        );
        add_action('wp_ajax_nopriv_kaliforms_reload_api_extensions',
            [$this, 'denied']
        );
        add_action('wp_ajax_kaliforms_set_form_theme',
            [Form_Styles::get_instance(), 'set_form_theme']
        );
        add_action('wp_ajax_nopriv_kaliforms_set_form_theme',
            [$this, 'denied']
        );
        add_action('wp_ajax_kaliforms_update_option_ajax',
            [$this, 'update_option']
        );
        $email_logger = Email_Logger::get_instance();
        add_action('wp_ajax_kaliforms_get_email_log',
            [$email_logger, 'get_log']
        );
        add_action('wp_ajax_nopriv_kaliforms_get_email_log',
            [$this, 'denied']
        );

        add_action('wp_ajax_kaliforms_clear_log', [$this, 'clear_mail_log']);
        add_action('wp_ajax_kaliforms_get_grid', [$this, 'return_grid']);
        add_action('wp_ajax_nopriv_kaliforms_clear_log', [$this, 'denied']);
        add_action('wp_ajax_nopriv_kaliforms_update_option_ajax', [$this, 'denied']);
        add_action('wp_ajax_nopriv_kaliforms_get_grid', [$this, 'denied']);
    }
    /**
     * If the user is not authorized, deny action
     */
    public function denied()
    {
        wp_die(esc_html__('Denied', 'kaliforms'));
    }

    /**
     * Loads the plugin text domain
     */
    public function load_text_domain()
    {
        load_plugin_textdomain('kaliforms');
    }

    /**
     * Add settings link to plugin list table
     *
     * @param  array $links Existing links
     *
     * @return array        Modified links
     */
    public function add_settings_link($links)
    {
        /** @noinspection HtmlUnknownTarget */
        array_push(
            $links,
            sprintf(
                '<a href="%sedit.php?post_type=%s_forms">%s</a>',
                esc_url(get_admin_url()),
                $this->slug,
                esc_html__('Create your first form', 'kaliforms')
            )
        );

        return $links;
    }
    /**
     * Reloads extensions
     *
     * @return void
     */
    public function reload_api_extensions()
    {
        check_admin_referer('kaliforms_nonce', 'nonce');
        delete_transient('kaliforms_extensions');
        wp_die(json_encode(['status' => 'ok']));
    }
    /**
     * Returns the grid array
     *
     * @return void
     */
    public function return_grid()
    {
        if (!isset($_POST['action'], $_POST['nonce'])) {
            wp_die(wp_json_encode([
                'success' => false,
                'message' => esc_html__('Denied', 'kaliforms'),
            ]));
        }
        if (!wp_verify_nonce(sanitize_key(wp_unslash($_POST['nonce'])), $this->slug . '_nonce')) {
            wp_die(wp_json_encode([
                'success' => false,
                'message' => esc_html__('Denied', 'kaliforms'),
            ]));
        }
        if (!isset($_POST['id'])) {
            wp_die(wp_json_encode([
                'success' => false,
                'message' => esc_html__('Denied', 'kaliforms'),
            ]));
        }

        $helper = new Gutenberg_Helper($_POST['id']);
        $rows   = $helper->get_rows();
        return wp_die(wp_json_encode($rows));
    }
    /**
     * Updates option through ajax
     *
     * @return void
     */
    public function update_option()
    {
        if (!isset($_POST['args'], $_POST['args']['nonce'])) {
            wp_die(wp_json_encode([
                'success' => false,
                'message' => esc_html__('Denied', 'kaliforms'),
            ]));
        }
        if (!wp_verify_nonce(sanitize_key(wp_unslash($_POST['args']['nonce'])), $this->slug . '_nonce')) {
            wp_die(wp_json_encode([
                'success' => false,
                'message' => esc_html__('Denied', 'kaliforms'),
            ]));
        }
        if (!current_user_can('manage_options')) {
            wp_die(wp_json_encode([
                'success' => false,
                'message' => esc_html__('Denied', 'kaliforms'),
            ]));
        }

        $args = stripslashes_deep($_POST['args']);
        $args['method'] === 'delete'
        ? delete_option($this->slug . '_' . $args['option']['key'])
        : update_option($this->slug . '_' . $args['option']['key'], sanitize_text_field($args['option']['value']));

        wp_die(wp_json_encode([
            'success' => true,
            'message' => 'ok - updated option: ' . $args['option']['key'] . ' with the value: ' . $args['option']['value'],
        ]));
    }
    /**
     * Clear mail log
     *
     * @return void
     */
    public function clear_mail_log()
    {
        if (!isset($_POST['args'], $_POST['args']['nonce'])) {
            wp_die(wp_json_encode([
                'success' => false,
                'message' => esc_html__('Denied', 'kaliforms'),
            ]));
        }

        if (!wp_verify_nonce(sanitize_key(wp_unslash($_POST['args']['nonce'])), $this->slug . '_nonce')) {
            wp_die(wp_json_encode([
                'success' => false,
                'message' => esc_html__('Denied', 'kaliforms'),
            ]));
        }

        if (!current_user_can('manage_options')) {
            wp_die(wp_json_encode([
                'success' => false,
                'message' => esc_html__('Denied', 'kaliforms'),
            ]));
        }

        $temp_dir = get_temp_dir();
        if (file_exists($temp_dir . $this->slug . '-mail.log')) {
            unlink($temp_dir . $this->slug . '-mail.log');
        }

        wp_die(wp_json_encode(['success' => true, 'message' => esc_html__('Log deleted', 'kaliforms')]));
    }
    /**
     * Block enqueues
     *
     * @return void
     */
    public function block_enqueue()
    {
        wp_register_script(
            'kali-forms-block-block-editor',
            KALIFORMS_URL . 'assets/block/js/block.js',
            ['wp-i18n'],
            KALIFORMS_VERSION
        );
        wp_register_style(
            'kali-forms-block-block-editor',
            KALIFORMS_URL . 'assets/block/css/block.css',
            ['bootstrap-v4-grid'],
            KALIFORMS_VERSION
        );
    }
    /**
     * Enqueue files in the admin
     */
    public function admin_enqueue()
    {
        wp_enqueue_script(
            'kaliforms-general-scripts',
            KALIFORMS_URL . 'assets/general/js/general.js',
            ['wp-i18n', 'jquery'],
            KALIFORMS_VERSION,
            true
        );

        wp_localize_script(
            'kaliforms-general-scripts',
            'KaliFormsGeneralObject',
            [
                'ajaxurl'    => esc_url(admin_url('admin-ajax.php')),
                'ajax_nonce' => wp_create_nonce($this->slug . '_nonce'),
                'rest_url'   => get_rest_url(),
            ]
        );

        wp_enqueue_style(
            'kaliforms-general',
            KALIFORMS_URL . 'assets/general/css/general.css',
            false,
            KALIFORMS_VERSION
        );
        wp_register_style(
            'kaliforms-icon-font',
            KALIFORMS_URL . 'assets/fonts/icomoon.css',
            false,
            KALIFORMS_VERSION
        );
        wp_register_style(
            'kaliforms-roboto-font',
            '//fonts.googleapis.com/css?family=Roboto:300,400,500',
            false,
            KALIFORMS_VERSION
        );
    }
}
