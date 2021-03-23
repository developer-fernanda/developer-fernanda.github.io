<?php

namespace KaliForms\Inc\Backend;

if (!defined('ABSPATH')) {
    exit;
}

class Notifications
{
    /**
     * @var null
     */
    private static $instance = null;
    /**
     * @var array
     */
    public $notices = [];
    /**
     * @var string
     */
    public $html = '<div class="kaliforms-notice is-dismissible %1$s" data-unique-id="%2$s">%3$s</div>';
    /**
     * Notifications constructor.
     */
    public function __construct()
    {
        add_action('admin_notices', [$this, 'display_notices']);

        add_action('wp_ajax_kaliforms_dismiss_notice',
            [$this, 'dismiss_notice']
        );
    }
    /**
     * We need to grab instances of this object, so we can add multiple notices at the same time
     *
     * @return Notifications
     */
    public static function get_instance()
    {
        if (is_null(self::$instance)) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    /**
     * Adds a notice to the array
     *
     * @param array $notice
     */
    public function add_notice($notice = [])
    {
        $this->notices[] = $notice;
        $this->_build_options();
    }
    /**
     * Build options
     */
    private function _build_options()
    {
        $notices = get_option('kaliforms_notices', []);
        $option  = array();
        foreach ($this->notices as $k => $v) {
            $option[] = $v['id'];
        }
        $equal_arrays = serialize($notices) === serialize($option);
        if ($equal_arrays) {
            return;
        }
        $option = $equal_arrays
        ? array_unique(array_merge($option, $notices))
        : array_unique(array_merge($option, []));
        update_option('kaliforms_notices', $option);
    }
    /**
     * Displays notices in the frontend
     *
     * @since 1.0.0
     */
    public function display_notices()
    {
        foreach ($this->notices as $notice) {
            if (get_user_meta(get_current_user_id(), $notice['id'], true)) {
                continue;
            }
            $screen = get_current_screen();
            if (
                isset($notice['omit-pages']) &&
                is_array($notice['omit-pages']) &&
                in_array($screen->id, $notice['omit-pages'])) {
                continue;
            }
            printf($this->html, esc_attr($notice['type']), esc_attr($notice['id']), wp_kses_post($notice['message']));
        }
    }
    /**
     * Dismiss a notice
     *
     * @param $args
     *
     * @return string
     */
    public function dismiss_notice($args)
    {
        $args    = wp_unslash($_POST['args']);
        $options = get_option('kaliforms_notices', []);

        if (!isset($args['nonce'])) {
            return 'nok';
        }
        if (!wp_verify_nonce(sanitize_key(wp_unslash($args['nonce'])), 'kaliforms_nonce')) {
            return 'nok';
        }

        if (empty($options)) {
            return 'nok';
        }

        $denied = [
            'wp_capabilities',
            'wp_user_level',
            'nickname',
            'first_name',
            'last_name',
            'description',
        ];

        if (in_array($args['id'], $denied)) {
            wp_die('nok');
        }

        if (strpos($args['id'], 'kaliforms_') > -1) {
            add_user_meta($args['userId'], $args['id'], 'true', true);
            wp_die('ok');
        }

        wp_die('nok');
    }
}
