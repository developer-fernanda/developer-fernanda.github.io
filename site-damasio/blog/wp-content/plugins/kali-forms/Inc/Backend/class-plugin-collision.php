<?php

namespace KaliForms\Inc\Backend;

if (!defined('ABSPATH')) {
    exit;
}
use KaliForms\Inc\Backend\Notifications;

/**
 * Plugin Collision class
 */
class Plugin_Collision
{
    /**
     * Plugin slug
     *
     * @var string
     */
    protected $slug = 'kaliforms';
    /**
     * Plugins that we need to deactivate when installing kali forms
     *
     * @var array
     */
    public $plugins = [
        'calculated-fields-form/cp_calculatedfieldsf_free.php',
        'caldera-forms/caldera-core.php',
        'contact-form-7/wp-contact-form-7.php',
        'everest-forms/everest-forms.php',
        'form-maker/form-maker.php',
        'formidable/formidable.php',
        'gravityforms/gravityforms.php',
        'ninja-forms/ninja-forms.php',
        'wpforms-lite/wpforms.php',
        'weforms/weforms.php',
    ];
    /**
     * Activated plugins
     *
     * @var array
     */
    public $activated_plugins = [];
    /**
     * Activated plugins by name
     *
     * @var array
     */
    public $activated_plugins_name = [];
    /**
     * Class constructor
     */
    public function __construct()
    {
        $this->check_collision();
        $this->await_plugin_deactivation();
    }
    /**
     * Check collision
     *
     * @return void
     */
    public function check_collision()
    {
        $apl = get_option('active_plugins');
        if (!function_exists('get_plugins')) {
            include_once ABSPATH . 'wp-admin/includes/plugin.php';
        }
        $plugins = get_plugins();
        foreach ($apl as $p) {
            if (isset($plugins[$p]) && in_array($p, $this->plugins)) {
                $this->activated_plugins[$p] = $plugins[$p];
                $this->activated_plugins_name[$p] = $plugins[$p]['Name'];
            }
        }
    }
    /**
     * Create notifications
     */
    public function set_notice()
    {
        $notifications = Notifications::get_instance();
        $html = '<p>';
        $html .= vsprintf( // Translators: 1 is list of plugins, 2 is opening Anchor, 3 is closing.
            esc_html__('We noticed that the following plugins are active: %1$s. We recommend that you de-activate them so they don\'t interfere with Kali Forms. You can do it manually in the plugins page, or click the button below and we\'ll do it for you! %2$sDeactivate Plugins%3$s', 'kaliforms'),
            [
                implode(', ', $this->activated_plugins_name),
                '<br/><br/> <a class="button button-primary" href="' . $this->create_url() . '">',
                '</a>',
            ]);
        $html .= '</p>';

        $notifications->add_notice(
            [
                'id' => $this->slug . '_plugin_colission',
                'type' => 'notice notice-info',
                'message' => $html,
                'omit-pages' => ['site-health'],
			]
        );
    }
    /**
     * Creates a url to deactivate plugins
     *
     * @return void
     */
    public function create_url($health_check = false)
    {
        $data = [
            'plugins_queued' => array_keys($this->activated_plugins_name),
            'redirect' => $health_check ? admin_url('site-health.php') : admin_url('plugins.php'),
        ];
        return $health_check
        ? wp_nonce_url(
            admin_url('site-health.php?') . http_build_query($data),
            'kaliforms_deactivating_plugins',
            'kaliforms_plugin_deactivation_queue'
        )
        : wp_nonce_url(
            admin_url('plugins.php?') . http_build_query($data),
            'kaliforms_deactivating_plugins',
            'kaliforms_plugin_deactivation_queue'
        );
    }

    /**
     * Awaits plugin deactivation.
     * Checks nonce, and if correct deactivates the plugins
     *
     * @return void
     */
    public function await_plugin_deactivation()
    {
        if (!isset($_GET['kaliforms_plugin_deactivation_queue'])
            || !wp_verify_nonce(wp_unslash($_GET['kaliforms_plugin_deactivation_queue']), 'kaliforms_deactivating_plugins')
            || !isset($_GET['plugins_queued'])
        ) {
            return;
        }

		$plugins = wp_unslash($_GET['plugins_queued']);
		$redirect = wp_unslash($_GET['redirect']);
        deactivate_plugins($plugins, true);
        wp_redirect($redirect);
    }
}
