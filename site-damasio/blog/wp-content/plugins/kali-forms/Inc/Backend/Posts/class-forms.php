<?php
namespace KaliForms\Inc\Backend\Posts;

use KaliForms\Inc\Backend\Form_Styles;
use KaliForms\Inc\Backend\JS_Vars;
use KaliForms\Inc\Backend\Meta_Save;
use KaliForms\Inc\Backend\Notifications;
use KaliForms\Inc\Backend\Views\Email_Settings_Page;
use KaliForms\Inc\Backend\Views\Extensions_Page;
use KaliForms\Inc\Backend\Views\Metaboxes\Form_Builder;
use KaliForms\Inc\Frontend\Form_Shortcode;
use KaliForms\Inc\Utils\Duplicate_Post;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Class Forms
 *
 * @package Inc\Backend\Posts
 */
class Forms
{
    use Duplicate_Post;
    /**
     * Plugin slug
     *
     * @var string
     */
    protected $slug = 'kaliforms';

    /**
     * Forms constructor.
     */
    public function __construct()
    {
        // Register the new post type
        add_action('init', [$this, 'create_post_type']);
        // We need to add meta boxes to the post type ( the metaboxes will load the react component )
        add_action('add_meta_boxes', [$this, 'register_metaboxes']);
        // Enqueue the scripts needed for this particular post type
        add_action('admin_enqueue_scripts', [$this, 'enqueue'], 20);
        // Change look & feel of the edit page of a post ( kaliforms post type )
        add_filter('get_user_option_screen_layout_kaliforms_forms', [$this, 'change_layout']);
        add_filter('get_user_option_meta-box-order_kaliforms_forms', [$this, 'reorder_metaboxes']);
        // Edit columns ( adds the shortcode in the column & reorders them )
        add_filter('manage_edit-kaliforms_forms_columns', [$this, 'edit_columns']);
        add_action('manage_kaliforms_forms_posts_custom_column', [$this, 'edit_custom_column'], 10, 2);
        // Register shrotcode
        add_shortcode('kaliform', [$this, 'register_shortcode']);
        // Register a gutenberg block
        register_block_type('kali-forms/kali-forms-block', array(
            'editor_script'   => 'kali-forms-block-block-editor',
            'editor_style'    => 'kali-forms-block-block-editor',
            // 'style'           => 'kali-forms-block-block',
            'render_callback' => [$this, 'register_block'],
        ));

        //Adds an admin notice to the backend
        add_action('admin_head', [$this, 'add_admin_notice'], 9999);
        add_action('admin_menu', [$this, 'register_submenus']);
        // Saves the metabox
        $this->metabox_save();
        $this->init_duplicate_post();
        $this->init_email_deliverability_confirmation();
    }
    /**
     * Initiate email deliverability confirmation
     *
     * @return void
     */
    public function init_email_deliverability_confirmation()
    {
        if (!empty($_GET) && !empty($_GET['confirm_email_delivery']) && $_GET['confirm_email_delivery'] === 'true') {
            update_option($this->slug . '_email_send_test_dismissed', true);
            $notifications = Notifications::get_instance();
            $notifications->add_notice(
                [
                    'id'      => $this->slug . '_email_send_test_dismissed',
                    'type'    => 'notice notice-info',
                    'message' => esc_html__('Email delivery confirmed', 'kaliforms'),
                ]
            );
        }
    }
    /**
     * Registers the extensions submenu
     *
     * @return void
     */
    public function register_submenus()
    {
        add_submenu_page(
            'edit.php?post_type=kaliforms_forms',
            esc_html__('SMTP Settings', 'kaliforms'),
            esc_html__('SMTP Settings', 'kaliforms'),
            'manage_options',
            'kaliforms-email-settings',
            new Email_Settings_Page()
        );
        add_submenu_page(
            'edit.php?post_type=kaliforms_forms',
            esc_html__('Extensions', 'kaliforms'),
            esc_html__('Extensions', 'kaliforms'),
            'manage_options',
            'kaliforms-extensions',
            new Extensions_Page()
        );
    }
    /**
     * Adds an admin notice to the backend. Only when we're in the custom post type
     *
     * @return void
     */
    public function add_admin_notice()
    {
        $screen = get_current_screen();
        if ($screen->base !== 'edit' || $screen->id !== 'edit-kaliforms_forms') {
            return;
        }

        $html = '<p>';
        $html .= vsprintf( // Translators: 1 is Plugin Name, 2 is opening Anchor, 3 is closing.
            esc_html__('We\'ve been working hard on making %1$s the best one out there. We\'re interested in hearing your thoughts about %1$s and what we could do to make it even better. %2$sSend your feedback our way%3$s.', 'kaliforms'), [
                'Kali Forms',
                '<a target="_blank" href="https://forms.gle/oTm2huQhNwumSHAu9">',
                '</a>',
            ]);
        $html .= '</p>';
        $notifications = Notifications::get_instance();
        $notifications->add_notice(
            [
                'id'      => $this->slug . '_feedback',
                'type'    => 'notice notice-info',
                'message' => $html,
            ]
        );

    }

    /**
     * Change post type layout
     *
     * @param [Number] $columns
     * @return Number
     */
    public function change_layout($columns)
    {
        return 1;
    }

    /**
     * Reordering of the metaboxes
     *
     * @param [type] $order
     * @return void
     */
    public function reorder_metaboxes($order)
    {
        return [
            'normal' => join(',', ['slugdiv', 'kaliforms_forms_builder', 'submitdiv']),
        ];
    }

    /**
     * Custom post type enqueue
     */
    public function enqueue()
    {
        $screen = get_current_screen();
        if ('kaliforms_forms' === get_post_type() && 'post' === $screen->base) {
            wp_deregister_style('wp-admin');
            wp_deregister_script('postbox');
            wp_enqueue_media();

            wp_register_style(
                'kaliforms-media-view',
                KALIFORMS_URL . 'assets/wp-override/media-views.css',
                [],
                KALIFORMS_VERSION
            );

            wp_register_script(
                'kaliforms-vendor',
                KALIFORMS_URL . 'assets/backend/js/vendor.js',
                [],
                KALIFORMS_VERSION
            );
            wp_enqueue_script(
                'kaliforms-forms',
                KALIFORMS_URL . 'assets/backend/js/forms.js',
                [
                    'wp-i18n',
                    'underscore',
                    'kaliforms-vendor',
                ],
                KALIFORMS_VERSION,
                true
            );

            wp_localize_script(
                'kaliforms-forms',
                'KaliFormsObject',
                (new JS_Vars())->content
            );

            wp_set_script_translations('kaliforms-forms', 'kaliforms', KALIFORMS_BASE . 'languages');

            wp_enqueue_style(
                'kaliforms',
                KALIFORMS_URL . 'assets/backend/css/forms.css',
                [
                    'kaliforms-media-view',
                    'kaliforms-roboto-font',
                    'kaliforms-icon-font',
                ],
                KALIFORMS_VERSION
            );
        }
    }

    /**
     * Create the custom post type
     */
    public function create_post_type()
    {
        register_post_type(
            'kaliforms_forms',
            [
                'labels'            => [
                    'name'                  => esc_html__('Kali Forms', 'kaliforms'),
                    'singular_name'         => esc_html__('Kali Form', 'kaliforms'),
                    'edit_item'             => esc_html__('Edit form', 'kaliforms'),
                    'new_item'              => esc_html__('New form', 'kaliforms'),
                    'add_new_item'          => esc_html__('Add new form', 'kaliforms'),
                    'view_item'             => esc_html__('View form', 'kaliforms'),
                    'view_items'            => esc_html__('View forms', 'kaliforms'),
                    'search_items'          => esc_html__('Search forms', 'kaliforms'),
                    'not_found'             => esc_html__('No forms found', 'kaliforms'),
                    'not_found_in_trash'    => esc_html__('No forms found in Trash', 'kaliforms'),
                    'all_items'             => esc_html__('All forms', 'kaliforms'),
                    'attributes'            => esc_html__('Form attributes', 'kaliforms'),
                    'filter_items_list'     => esc_html__('Filter forms list', 'kaliforms'),
                    'items_list_navigation' => esc_html__('Forms list navigation', 'kaliforms'),
                    'items_list'            => esc_html__('Forms list', 'kaliforms'),
                    'item_published'        => esc_html__('Form published', 'kaliforms'),
                    'item_updated'          => esc_html__('Form updated', 'kaliforms'),
                ],
                'public'            => false,
                'show_in_rest'      => true,
                'has_archive'       => true,
                'rewrite'           => ['slug' => 'forms'],
                'show_ui'           => true,
                'show_in_admin_bar' => true,
                'supports'          => ['title', 'custom-fields'],
                'menu_icon'         => KALIFORMS_URL . 'assets/img/iconMenu.svg',
            ]
        );

        register_post_meta(
            'kaliforms_forms',
            'kaliforms_field_components',
            [
                'single'       => true,
                'show_in_rest' => true,
                'description'  => 'A meta key associated with a string meta value.',
                'type'         => 'string',
            ]
        );
        register_post_meta(
            'kaliforms_forms',
            'kaliforms_grid',
            [
                'single'       => true,
                'show_in_rest' => true,
                'description'  => 'A meta key associated with a string meta value.',
                'type'         => 'string',
            ]
        );

        add_image_size('form-edit-image-preview', 228, 116);
        add_filter('image_size_names_choose', function ($sizes) {
            $sizes['form-edit-image-preview'] = esc_html__('Custom form edit preview', 'kaliforms');
            return $sizes;
        });
    }

    /**
     * Registers meta boxes
     */
    public function register_metaboxes()
    {
        add_meta_box(
            'kaliforms_forms_builder',
            esc_html__('Form Builder', 'kaliforms'),
            new Form_Builder(),
            'kaliforms_forms',
            'normal',
            'high'
        );
    }

    /**
     * Edits columns in the edit posts page, so we can add what we need
     *
     * @param [Array] $columns
     * @return void
     */
    public function edit_columns($columns)
    {
        $date = $columns['date'];
        unset($columns['date']);

        $columns = array_merge(
            $columns,
            [
                'theme'     => esc_html__('Theme', 'kaliforms'),
                'shortcode' => esc_html__('Shortcode', 'kaliforms'), 'date' => $date,
            ]
        );
        return $columns;
    }
    /**
     * Add a duplicate link to quick actions
     *
     * @param [type] $actions
     * @param [type] $post
     * @return void
     */
    public function add_duplicate_link($actions, $post)
    {
        if ($post->post_type === 'kaliforms_forms') {
            $actions['kaliforms-duplicate'] = sprintf(
                '<a href="#" data-post-id="%s" class="kaliforms-duplicate-form-link" id="kaliforms-duplicate-%s">%s</a>',
                $post->ID,
                $post->ID,
                esc_html__('Duplicate form', 'kaliforms')
            );
        }

        return $actions;
    }
    /**
     * Edits custom column
     *
     * @param [string] $column
     * @param [number] $post_id
     * @return void
     */
    public function edit_custom_column($column, $post_id)
    {
        $form_styles = Form_Styles::get_instance();
        switch ($column) {
            case 'theme':
                echo '<div class="kaliforms-themes-formgroup">';
                echo '<select data-form-id="' . $post_id . '" value="' . $form_styles->get_applied_form_style($post_id, 'theme') . '">';
                foreach ($form_styles->styles as $style) {
                    echo '<option value=' . $style['id'] . ' ' . selected($form_styles->get_applied_form_style($post_id, 'theme'), $style['id'], false) . '>' . $style['label'] . '</option>';
                }
                echo '</select>';
                echo '</div>';
                break;
            case 'shortcode':
                echo '<div class="kaliform-shortcode-formgroup">';
                echo '<input readonly type="text" value=\'[kaliform id="' . absint($post_id) . '"]\' />';
                echo '<button type="button"><span class="dashicons dashicons-clipboard"></span></button>';
                echo '</div>';
                break;
            default:
                break;
        }
    }
    /**
     * Gets the themes
     *
     * @return void
     */
    public function get_themes()
    {
        return [
            'current'   => 'dark',
            'available' => [],
        ];
    }
    /**
     * Add fields for the cpt to save
     */
    public function metabox_save()
    {
        $meta = Meta_Save::get_instance();
        apply_filters($this->slug . '_meta_save_fields', $meta);

        /**
         * Form builder fields
         */
        $meta->add_fields(
            ['id' => 'grid', 'sanitize' => 'KaliForms\Inc\Backend\Sanitizers::sanitize_grid_layout'],
            ['id' => 'field_components', 'sanitize' => 'KaliForms\Inc\Backend\Sanitizers::sanitize_field_components']
        );

        /**
         * Form info fields
         */
        $meta->add_fields(
            ['id' => 'akismet', 'sanitize' => 'KaliForms\Inc\Backend\Sanitizers::sanitize_boolean'],
            ['id' => 'akismet_fields', 'sanitize' => 'KaliForms\Inc\Backend\Sanitizers::sanitize_field_mapper'],
            ['id' => 'honeypot', 'sanitize' => 'KaliForms\Inc\Backend\Sanitizers::sanitize_boolean'],
            ['id' => 'required_field_mark', 'sanitize' => 'sanitize_text_field'],
            ['id' => 'global_error_message', 'sanitize' => 'wp_kses_post'],
            ['id' => 'multiple_selections_separator', 'sanitize' => 'sanitize_text_field'],
            ['id' => 'remove_captcha_for_logged_users', 'sanitize' => 'KaliForms\Inc\Backend\Sanitizers::sanitize_boolean'],
            ['id' => 'hide_form_name', 'sanitize' => 'KaliForms\Inc\Backend\Sanitizers::sanitize_boolean'],
            ['id' => 'custom_action', 'sanitize' => 'sanitize_key'],
            ['id' => 'override_method', 'sanitize' => 'sanitize_text_field'],
            ['id' => 'additional_html_attributes', 'sanitize' => 'sanitize_text_field'],
            ['id' => 'css_id', 'sanitize' => 'sanitize_key'],
            ['id' => 'css_class', 'sanitize' => 'sanitize_key'],
            ['id' => 'google_site_key', 'sanitize' => 'sanitize_text_field'],
            ['id' => 'google_secret_key', 'sanitize' => 'sanitize_text_field'],
            ['id' => 'save_ip_address', 'sanitize' => 'KaliForms\Inc\Backend\Sanitizers::sanitize_boolean']
        );

        /**
         * Form submission fields
         */
        $meta->add_fields(
            ['id' => 'submission_view_page', 'sanitize' => 'absint'],
            ['id' => 'reset_form_after_submit', 'sanitize' => 'KaliForms\Inc\Backend\Sanitizers::sanitize_boolean'],
            ['id' => 'show_thank_you_message', 'sanitize' => 'KaliForms\Inc\Backend\Sanitizers::sanitize_boolean'],
            ['id' => 'save_form_submissions', 'sanitize' => 'KaliForms\Inc\Backend\Sanitizers::sanitize_boolean'],
            ['id' => 'thank_you_message', 'sanitize' => 'wp_kses_post'],
            ['id' => 'submission_message', 'sanitize' => 'wp_kses_post'],
            ['id' => 'redirect_url', 'sanitize' => 'esc_url'],
            ['id' => 'form_action', 'sanitize' => 'esc_url'],
            ['id' => 'form_method', 'sanitize' => 'sanitize_text_field']
        );

        /**
         * Form emails
         */
        $meta->add_field(
            ['id' => 'emails', 'sanitize' => 'KaliForms\Inc\Backend\Sanitizers::sanitize_email_builder']
        );

        /**
         * Payment
         *
         * @param [type] $args
         * @return void
         */
        $meta->add_fields(
            ['id' => 'currency', 'sanitize' => 'sanitize_text_field'],
            ['id' => 'payments_live', 'sanitize' => 'KaliForms\Inc\Backend\Sanitizers::sanitize_boolean'],
            ['id' => 'paypal_client_id', 'sanitize' => 'sanitize_text_field'],
            ['id' => 'paypal_client_id_sandbox', 'sanitize' => 'sanitize_text_field']
        );

        /**
         * Sanitizes the selected form style
         */
        $meta->add_field(
            ['id' => 'selected_form_style', 'sanitize' => 'sanitize_text_field']
        );
    }
    /**
     * Register the shortcode so we can display it in the frontend
     *
     * @param [array] $args
     * @return void
     */
    public function register_shortcode($args)
    {
        $form = new Form_Shortcode($args);
        $form = apply_filters($this->slug . '_form_shortcode_finished_rendering', $form);

        return $form->html;
    }
    /**
     * Registers block
     *
     * @param [array] $args
     * @return void
     */
    public function register_block($args)
    {
        $arguments = [];
        if (isset($args['form'])) {
            $arguments['id'] = $args['form'];
        }

        if (isset($args['values']) && is_array($args['values'])) {
            foreach ($args['values'] as $key => $value) {
                $arguments[$key] = $value;
            }
        }

        $form = new Form_Shortcode($arguments);
        return $form->html;
    }
}
