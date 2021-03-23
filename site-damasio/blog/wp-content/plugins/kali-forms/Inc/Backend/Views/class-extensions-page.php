<?php

namespace KaliForms\Inc\Backend\Views;

if (!defined('WPINC')) {
    die;
}

/**
 * Class Extensions_Page
 *
 * @package Inc\Backend\Views
 */
class Extensions_Page
{
    /**
     * Plugin slug
     *
     * @var string
     */
    protected $slug = 'kaliforms';
    /**
     * Extensions array
     *
     * @var array
     */
    protected $extensions = [];
    /**
     * Known extensions ( that we can install from our server )
     *
     * @var array
     */
    public $known_extensions = [];
    /**
     * Extensions_Page constructor.
     */
    public function __construct()
    {
        $this->get_extensions();
        $this->get_installed_plugins();
    }

    /**
     * Renders app
     */
    public function render_app()
    {
        echo '<div class="wrap">';
        echo '<div id="kaliforms-extensions-page">';
        $this->generate_extensions_html();
        echo '</div>';
        echo '<div style="display:inline-block; margin-top:15px; width:100%"><button id="kali-extensions-reload" class="button button-primary">' . esc_html__('Reload', 'kaliforms') . '</button></div>';
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
        do_action($this->slug . '_before_extensions_page_rendering');

        /**
         * Echo the container
         */
        $this->render_app();

        /**
         * Initiate an action after rendering the app div
         */
        do_action($this->slug . '_after_extensions_page_rendering');
    }

    /**
     * Create an array of plugins
     *
     * @return void
     */
    public function get_installed_plugins()
    {
        $this->known_extensions = [
            'kali-forms-pro' => '',
        ];

        foreach ($this->extensions as $k => $v) {
            $this->known_extensions[$v['slug']] = '';
        }

        $plugins = get_plugins();
        foreach ($this->known_extensions as $k => $v) {
            $this->known_extensions[$k] = array_key_exists($k . '/' . $k . '.php', $plugins) ? 'installed' : 'not-installed';
            if ($this->known_extensions[$k] === 'installed') {
                $this->known_extensions[$k] = is_plugin_active($k . '/' . $k . '.php') ? 'active' : 'installed';
            }
        }
    }

    /**
     * Gets extensions from the rest API
     *
     * @return void
     */
    public function get_extensions()
    {
        $this->extensions = get_transient($this->slug . '_extensions');
        if (false === $this->extensions) {
            $this->extensions = [];
            $this->make_request();
        }
    }
    /**
     * Make the request to our API
     *
     * @return void
     */
    public function make_request()
    {
        $url = KALIFORMS_EXTENSIONS_API;
        if (defined('KALIFORMS_PRO_EXTENSIONS_API')) {
            $url = KALIFORMS_PRO_EXTENSIONS_API;
            $arr = [
                'license' => trim(get_option('kaliforms_pro_license_key')),
                'url'     => site_url(),
            ];

            if (empty($arr['license'])) {
                $arr = [];
            }

            $url = add_query_arg($arr, $url);
        }

        $response = wp_remote_get($url);

        if (!is_wp_error($response)) {
            $data = json_decode(wp_remote_retrieve_body($response), true);
            if (!empty($data) && is_array($data)) {
                set_transient($this->slug . '_extensions', $data, 2 * DAY_IN_SECONDS);

                $this->extensions = $data;
            }
        }
    }

    /**
     * Generates the extensions html
     *
     * @return void
     */
    public function generate_extensions_html()
    {
        if (empty($this->extensions)) {
            esc_html_e('No extensions available. Come back later!', 'kaliforms');
            return;
        }

        // Move pro version as the first element of array
        $pro = $this->extensions['kali-forms-pro'];
        unset($this->extensions['kali-forms-pro']);
        array_unshift($this->extensions, $pro);

        foreach ($this->extensions as $extension) {
            echo '<div class="plugin-card">';
            echo $this->_get_card_top($extension);
            // echo $this->_get_card_bottom($extension);
            echo '</div>';
        }
    }

    /**
     * Get the card bottom part
     *
     * @param [type] $extension
     * @return string
     */
    private function _get_card_bottom($extension)
    {
        $html = '<div class="plugin-card-bottom">';
        $html .= '<div class="column-updated">';
        $html .= '<strong>' . esc_html__('Last Updated:', 'kaliforms') . '</strong> 4 weeks ago';
        $html .= '</div>';
        $html .= '</div>';

        return $html;
    }

    /**
     * Get the card top part
     *
     * @param [type] $extension
     * @return string
     */
    private function _get_card_top($extension)
    {
        if (empty($extension['image'])) {
            $extension['image'] = KALIFORMS_URL . 'assets/img/logo.svg';
        }

        $html = '<div class="plugin-card-top">';
        $html .= '<div class="name column-name">';
        $html .= '<h3>' . esc_html($extension['name']) . '<img style="height:auto" class="plugin-icon" src="' . $extension['image'] . '" /></h3>';
        $html .= '</div>';
        $html .= $this->_get_action_links($extension);
        $html .= '<div class="desc column-descripton"><p>' . esc_html($extension['description']) . '</p></div>';
        $html .= '</div>';

        return $html;
    }

    /**
     * Plugin action links
     *
     * @param [type] $extension
     * @return void
     */
    private function _get_action_links($extension)
    {
        $html = '<div class="action-links">';
        $html .= '<ul class="plugin-action-buttons">';
        $html .= '<li>' . $this->_do_now_button($extension) . '</li>';
        $html .= '</ul>';
        $html .= '</div>';
        return $html;
    }

    /**
     * Render the do now button
     *
     * @param [type] $extension
     * @return string
     */
    private function _do_now_button($extension)
    {
        return $this->_determine_plugin_state($extension);
    }

    /**
     * Determines plugin state
     *
     * @param [type] $extension
     * @return string
     */
    private function _determine_plugin_state($extension)
    {
        $status = $this->known_extensions[$extension['slug']];
        $html   = '';
        switch ($this->known_extensions[$extension['slug']]) {
            case 'installed';
                $html .= '<a class="button button-primary" data-url="' . $this->generate_activate_link($extension['slug'] . '/' . $extension['slug'] . '.php') . '" data-action="activate" data-slug="' . $extension['slug'] . '">' . esc_html__('Activate', 'kaliforms') . '</a>';
                break;
            case 'active':
                $html .= esc_html__('All done', 'kaliforms');
                break;
            case 'not-installed':
                if ('no-license' === $extension['download_link']) {
                    $html .= '<a class"button" href="' . admin_url('edit.php?post_type=kaliforms_forms&page=kaliforms-license') . '">' . esc_html__('Please activate your license', 'kaliforms') . '</a>';
                } else {
                    $html .= '<a class="button" data-action="install" data-download-url="' . $extension['download_link'] . '" data-slug="' . $extension['slug'] . '">' . esc_html__('Install Now', 'kaliforms') . '</a>';
                }

                break;
            default:
                break;
        }

        if ($this->known_extensions['kali-forms-pro'] !== 'active') {
            $html = '<a class="button button-primary" target="_blank" href="https://www.kaliforms.com/pricing?utm_source=extensionsPage&utm_campaign=userInterests&utm_medium=upgradeToProButton">' . esc_html__('Upgrade to PRO', 'kaliforms') . '</a>';
        }

        return $html;
    }

    /**
     * Generates an activate link
     *
     * @return string
     */
    public function generate_activate_link($plugin)
    {
        $link = wp_nonce_url(admin_url('plugins.php?action=activate&plugin=' . $plugin), 'activate-plugin_' . $plugin);
        return $link;
    }
}
