<?php

namespace KaliForms\Inc\Backend\Views;

if (!defined('WPINC')) {
    die;
}
use KaliForms\Inc\Utils\Post_Translator;

/**
 * Class Email_Settings_Page
 *
 * @package Inc\Backend\Views
 */
class Form_Entries_Page
{
    /**
     * Plugin slug
     *
     * @var string
     */
    protected $slug = 'kaliforms';

    /**
     * Form_Entries_Page constructor.
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
    }
    /**
     * Enqueue files in the admin
     */
    public function admin_enqueue()
    {
        $screen = get_current_screen();
        if ('kaliforms_forms' === $screen->post_type && 'kaliforms_forms_page_kaliforms-form-entries' === $screen->base) {
            $post = new Post_Translator(1);
            $post->construct_these('plugins');

            wp_enqueue_script(
                'kaliforms-form-entries-scripts',
                KALIFORMS_URL . 'assets/form-entries/js/formEntries.js',
                ['wp-i18n'],
                KALIFORMS_VERSION,
                true
            );
            wp_localize_script(
                'kaliforms-form-entries-scripts',
                'KaliFormsFormEntriesObject',
                [
                    'ajaxurl'    => esc_url(admin_url('admin-ajax.php')),
                    'ajax_nonce' => wp_create_nonce($this->slug . '_nonce'),
                    'restNonce'  => wp_create_nonce('wp_rest'),
                    'publicPath' => KALIFORMS_URL . 'assets/form-entries/js/',
                    'restUrl'    => get_rest_url(null, 'kaliforms/v1/'),
                    'formId'     => $this->_get_form_id(),
                    'allForms'   => $this->_get_forms_with_entry_count(),
                    'plugins'    => $post->plugins,
                ]
            );
            wp_enqueue_style(
                'kaliforms-form-entries',
                KALIFORMS_URL . 'assets/form-entries/css/formEntries.css',
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
    public function _get_form_id()
    {
        return $this->get_request_parameter('formId');
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
     * Get forms with entry count
     *
     * @return void
     */
    public function _get_forms_with_entry_count()
    {
        $args = [
            'post_type'      => $this->slug . '_forms',
            'posts_per_page' => -1,
            'order'          => 'ASC',
        ];
        $posts = [];
        $query = new \WP_Query($args);
        foreach ($query->posts as $post) {
            $posts[] = [
                'id'             => $post->ID,
                'key'            => $post->ID,
                'name'           => $post->post_title,
                'entries'        => $this->get_entries_count($post->ID),
                'submissionPage' => $this->check_submission_page($post->ID),
            ];
        }
        wp_reset_postdata();
        wp_reset_query();

        return $posts;
    }
    /**
     * Check submission page
     *
     * @param [type] $id
     * @return void
     */
    public function check_submission_page($id)
    {
        $baseUrl = get_post_meta($id, 'kaliforms_submission_view_page', true);
        if ($baseUrl === null || $baseUrl === '' || $baseUrl === '0') {
            return false;
        }

        return true;
    }
    /**
     * Entry count
     *
     * @return void
     */
    public function get_entries_count($id)
    {
        $args = [
            'post_type'      => $this->slug . '_submitted',
            'posts_per_page' => -1,
            'meta_key'       => 'formId',
            'meta_query'     => [
                [
                    'key'     => 'formId',
                    'value'   => $id,
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
     * Renders app
     */
    public function render_app()
    {
        echo '<div class="wrap">';
        echo '<div id="kaliforms-form-entries-page" class="kali-reset-all">';
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
        do_action($this->slug . '_before_form_entries_page_rendering');

        /**
         * Echo the container
         */
        $this->render_app();

        /**
         * Initiate an action after rendering the app div
         */
        do_action($this->slug . '_after_form_entries_page_rendering');
    }

}
