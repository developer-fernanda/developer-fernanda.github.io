<?php

namespace KaliForms\Inc\Backend;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Plugin review class
 */
class Plugin_Review
{
    /**
     * Plugin slug
     *
     * @var string
     */
    public $slug        = 'kaliforms';
    public $wp_org_slug = 'kali-forms';
    /**
     * Link to the review page
     *
     * @var string
     */
    private $link = 'https://wordpress.org/support/plugin/%s/reviews/#new-post';
    /**
     * Messages to be shown in the notice
     *
     * @var array
     */
    private $messages = [];
    /**
     * Timestamp (set in database)
     *
     * @var [type]
     */
    private $timestamp = null;
    /**
     * Class constructor
     */
    public function __construct()
    {
        if (get_option($this->slug . '_never_rate', false)) {
            return;
        }

        $this->set_messages();
        add_action('init', [$this, 'init']);
    }
    /**
     * Sets the messages that should/will be used in the messages
     *
     * @return void
     */
    public function set_messages()
    {
        $this->messages = array(
            'notice'  => esc_html__("Hi there! Stoked to see you're using Kali Forms for a few days now - hope you like it! And if you do, please consider rating it. It would mean the world to us.  Keep on rocking!", 'kaliforms'),
            'rate'    => esc_html__('Rate the plugin', 'kaliforms'),
            'later'   => esc_html__('Remind me later', 'kaliforms'),
            'no_rate' => esc_html__('Don\'t show again', 'kaliforms'),
        );
    }
    /**
     * Retrieves or sets the timestamp
     *
     * @return int
     */
    public function get_timestamp()
    {
        $value = get_option($this->slug . '_rating_timestamp', false);
        if ($value) {
            return absint($value);
        }
        $value = time() + DAY_IN_SECONDS * 2;
        update_option($this->slug . '_rating_timestamp', $value);
        return absint($value);
    }
    /**
     * Init functionality
     *
     * @return void
     */
    public function init()
    {
        if (!is_admin()) {
            return;
        }

        if (!current_user_can('manage_options')) {
            return false;
        }

        $this->timestamp = $this->get_timestamp();

        if (time() > $this->timestamp) {
            add_action('admin_notices', [$this, 'notice']);
            add_action('admin_enqueue_scripts', [$this, 'enqueue']);
            add_action('wp_ajax_' . $this->slug . '_review', [$this, 'ajax_request']);
            add_action('wp_ajax_nopriv_' . $this->slug . '_review', [$this, 'denied']);
        }
    }
    /**
     * Notice creator
     *
     * @return void
     */
    public function notice()
    {
        $html = '<div id="' . esc_attr($this->slug) . '-review-notice" class="notice notice-success is-dismissible" data-title="' . esc_html__('Hi there !', 'kaliforms') . '">';
        $html .= '<p>' . esc_html($this->messages['notice']) . '</p>';
        $html .= '<p class="actions">';
        $html .= '<a class="' . esc_attr($this->slug) . '-review-button button button-primary" id="' . esc_attr($this->slug) . '-rate" href="' . esc_url(sprintf($this->link, $this->wp_org_slug)) . '" target="_blank">' . esc_html($this->messages['rate']) . '</a>';
        $html .= '<a class="' . esc_attr($this->slug) . '-review-button js-notice-hide" id="' . esc_attr($this->slug) . '-later" href="#" style="margin-left:10px">' . esc_html($this->messages['later']) . '</a>';
        $html .= '<a class="' . esc_attr($this->slug) . '-review-button js-notice-hide" id="' . esc_attr($this->slug) . '-no-rate" href="#" style="margin-left:10px">' . esc_html($this->messages['no_rate']) . '</a>';
        $html .= '</p>';
        $html .= '</div>';
        echo $html;
    }
    /**
     * Enqueue function
     *
     * @return void
     */
    public function enqueue()
    {
        wp_enqueue_script(
            'kaliforms-plugin-review-script',
            KALIFORMS_URL . 'assets/general/js/pluginReview.js',
            ['jquery'],
            KALIFORMS_VERSION,
            true
        );

        wp_localize_script(
            'kaliforms-plugin-review-script',
            'KaliFormsPluginReviewObject',
            ['ajaxurl' => esc_url(admin_url('admin-ajax.php')), 'ajax_nonce' => wp_create_nonce($this->slug . '_nonce')]
        );
    }
    /**
     * If the user is not authorized, deny action
     */
    public function denied()
    {
        wp_die(esc_html__('Denied', 'kaliforms'));
    }
    /**
     * Ajax request
     *
     * @return wp_die lol
     */
    public function ajax_request()
    {
        if (!isset($_POST['args'], $_POST['args']['nonce'])) {
            wp_die('Denied');
        }
        if (!wp_verify_nonce(sanitize_key(wp_unslash($_POST['args']['nonce'])), $this->slug . '_nonce')) {
            wp_die('Denied');
        }
        $_POST['args'] = stripslashes_deep($_POST['args']);

        if (!isset($_POST['args']['user_action'])) {
            wp_die(esc_html__('Something went wrong', 'kaliforms'));
        }

        switch ($_POST['args']['user_action']) {
            case $this->slug . '-later':
                $timestamp = time() + WEEK_IN_SECONDS;
                break;
            case $this->slug . '-no-rate':
                $timestamp = time() + YEAR_IN_SECONDS * 5;
                update_option($this->slug . '_never_rate', true);
                break;
            default:
                $timestamp = time() + YEAR_IN_SECONDS * 5;
                break;
        }

        update_option($this->slug . '_rating_timestamp', $timestamp);

        wp_die(wp_json_encode([
            'success' => true,
        ]));
    }
}
