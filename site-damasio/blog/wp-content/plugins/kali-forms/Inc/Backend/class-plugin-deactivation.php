<?php
namespace KaliForms\Inc\Backend;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Plugin Deactivation class
 */
class Plugin_Deactivation
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
        $this->init();
    }
    /**
     * Init functionality
     *
     * @return void
     */
    public function init()
    {
        add_action('admin_enqueue_scripts', [$this, 'enqueue']);
        add_action('wp_ajax_' . $this->slug . '_uninstall_feedback', [$this, 'ajax_request']);
        add_action('wp_ajax_nopriv_' . $this->slug . '_uninstall_feedback', [$this, 'denied']);
        add_filter('plugin_action_links_' . plugin_basename(KALIFORMS_PLUGIN_FILE), [$this, 'filter_action_links']);
    }
    /**
     * Enqueue function
     *
     * @return void
     */
    public function enqueue()
    {
        $current_screen = get_current_screen();
        if ($current_screen->id !== 'plugins') {
            return;
        }
        wp_enqueue_style(
            'kaliforms-plugin-deactivation',
            KALIFORMS_URL . 'assets/general/css/pluginDeactivation.css',
            false,
            KALIFORMS_VERSION
        );

        wp_enqueue_script(
            'kaliforms-plugin-deactivation',
            KALIFORMS_URL . 'assets/general/js/pluginDeactivation.js',
            ['wp-i18n', 'jquery'],
            KALIFORMS_VERSION,
            true
        );

        wp_localize_script(
            'kaliforms-plugin-deactivation',
            'KaliFormsPluginDeactivationObject',
            [
                'ajaxurl'    => esc_url(admin_url('admin-ajax.php')),
                'ajax_nonce' => wp_create_nonce($this->slug . '_nonce'),
                'modalHtml'  => esc_js($this->deactivation_form_template()),
            ]
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
        $response      = wp_remote_post(
            KALIFORMS_UNINSTALL_FEEDBACK_API,
            [
                'body' => [
                    'reason'  => $_POST['args']['reason'],
                    'details' => $_POST['args']['details'],
                    'user'    => $_POST['args']['anonymous'] === 'true' ? 'anonymous' : $this->get_user_email($_POST['args']['anonymous']),
                ],
            ]
        );

        if (is_wp_error($response)) {
            wp_die(
                wp_json_encode(
                    [
                        'success' => false,
                        'message' => esc_html__('Something went wrong', 'kaliforms'),
                    ]
                )
            );
        }

        wp_die(wp_json_encode([
            'success' => true,
        ]));
    }
    /**
     * Return user email
     *
     * @param [type] $id
     * @return void
     */
    public function get_user_email($id)
    {
        $user = get_userdata(absint($id));
        return $user->user_email;
    }

    /**
     * Filter the deactivation link to allow us to present a form when the user deactivates the plugin
     */
    public function filter_action_links($links)
    {
        if (isset($links['deactivate'])) {
            $deactivation_link = $links['deactivate'];

            $deactivation_link = str_replace('<a ',
                '<div class="' . $this->slug . '-deactivate-form-wrapper">
					 <span 	class="' . $this->slug . '-deactivate-form" id="' . $this->slug . '-deactivate-form"></span>
					 <div class="' . $this->slug . '-deactivate-form-bg"></div>
                 </div><a id="' . $this->slug . '-deactivate-link-' . $this->slug . '" ', $deactivation_link);
            $links['deactivate'] = $deactivation_link;
        }
        return $links;
    }
    public function deactivation_form_template()
    {
        $options = [
            'setup'           => esc_html__('Set up is too difficult', 'kaliforms'),
            'docs'            => esc_html__('Lack of documentation', 'kaliforms'),
            'features'        => esc_html__('Not the features I wanted', 'kaliforms'),
            'better-plugin'   => esc_html__('Found a better plugin', 'kaliforms'),
            'incompatibility' => esc_html__('Incompatible with theme or plugin', 'kaliforms'),
            'maintenance'     => esc_html__('Other', 'kaliforms'),
        ];

        $html = '<div class="kaliforms-deactivate-form-head"><strong>' . esc_html__('Sorry to see you go', 'kaliforms') . '</strong>';
        $html .= '</div>';
        // Start kaliforms deactivate form body <div>
        $html .= '<div class="kaliforms-deactivate-form-body">';
        // Start kaliforms deactivate options <div>
        $html .= '<div class="kaliforms-deactivate-options">';
        $html .= '<p><strong>' . esc_html__('Before you deactivate the plugin, would you quickly give us your reason for doing so?', 'kaliforms') . '</strong></p>';
        $html .= '<p>';
        foreach ($options as $value => $label) {
            $html .= '<input type="radio" name="' . $this->slug . '-deactivate-reason" id="' . $value . '"  value="' . $value . '"/><label for="' . $value . '">' . $label . '</label><br/>';
        }
        $html .= '</p>';
        $html .= '<label id="' . $this->slug . '-deactivate-details-label" for="' . $this->slug . '-deactivate-reasons" ><strong>' . esc_html__('How can we improve', 'kaliforms') . '</strong></label>';
        $html .= '<textarea name="' . $this->slug . '-deactivate-details" id="' . $this->slug . '-deactivate-details" rows="2" style="width:100%"></textarea>';
        $html .= '</div>';
        // End kaliforms deactivate options </div>
        $html .= '<hr />';
        $html .= '</div>';
        // End kaliforms deactivate form body <div>
        $html .= '<p class="deactivating-spinner"><span class="spinner"></span> ' . esc_html__('Submitting form', 'kaliforms') . '</p>';
        $html .= '<div class="' . $this->slug . '-deactivate-form-footer">';
        $html .= '<p id="' . $this->slug . '-anonymous">';
        $html .= '<label>';
        $html .= esc_html__('If you UNCHECK this then your email address will be sent along with your feedback. This can be used by Kali Forms to get back to you for more info or a solution.', 'kaliforms');
        $html .= '<br />';
        $html .= '<input type="checkbox" name="' . $this->slug . '-anonymous" checked="checked" id="' . $this->slug . '-anonymous" />' . esc_html__('Send anonyous', 'kaliforms');
        $html .= '</label>';
        $html .= '</p>';
        $html .= '<p><a class="button button-primary" href="#" id="' . $this->slug . '-deactivate-submit-form"> <span>Submit & </span>' . esc_html__(' Deactivate', 'kaliforms') . '</a></p>';
        $html .= '</div>';

        return $html;
    }
}
