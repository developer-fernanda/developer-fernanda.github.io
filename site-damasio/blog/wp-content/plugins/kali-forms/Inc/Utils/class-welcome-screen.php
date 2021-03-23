<?php
namespace KaliForms\Inc\Utils;

use KaliForms\Inc\Backend\Views\After_Install_Page;

/**
 * Class Welcome Screen
 */
class Welcome_Screen
{
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
        add_action('plugins_loaded', [$this, 'init']);
    }

    /**
     * Class init
     *
     * @return void
     */
    public function init()
    {
        if (wp_doing_ajax() || wp_doing_cron()) {
            return;
        }

        if (!current_user_can('edit_others_pages')) {
            return;
        }

        add_action('admin_menu', [$this, 'register_menu']);
        add_action('admin_head', [$this, 'hide_menu']);
        add_action('admin_init', [$this, 'redirect'], 9999);
    }
    /**
     * Register menu page
     *
     * @return void
     */
    public function register_menu()
    {
        add_dashboard_page(
            esc_html__('Welcome to Kali Forms', 'kaliforms'),
            esc_html__('Welcome to Kali Forms', 'kaliforms'),
            'manage_options',
            $this->slug . '-after-install',
            new After_Install_Page()
        );
    }
    /**
     * We need to hide it from dashboard page, aesthetics only
     *
     * @return void
     */
    public function hide_menu()
    {
        remove_submenu_page('index.php', $this->slug . '-after-install');
    }

    /**
     * Redirect function
     *
     * @return void
     */
    public function redirect()
    {
        // This happens in class-first-install.php:69
        if (!get_transient($this->slug . '_welcome_activation_redirect')) {
            return;
        }
        // We delete it. It means that Kali Forms was installed has already been installed
        delete_transient($this->slug . '_welcome_activation_redirect');

        // Dont worry about multi sites
        if (isset($_GET['activate-multi']) || is_network_admin()) {
            return;
        }

        // Redirect to the new page
        $url = admin_url('index.php?page=' . $this->slug . '-after-install');
        wp_redirect($url);
        exit;
    }
}
