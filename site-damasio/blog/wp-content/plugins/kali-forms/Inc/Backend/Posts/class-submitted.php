<?php
namespace KaliForms\Inc\Backend\Posts;

use KaliForms\Inc\Frontend\Submission_Shortcode;
use KaliForms\Inc\Utils\Submission_Actions;
use KaliForms\Inc\Utils\Submission_Action_Helper as Action_Helper;
use KaliForms\Inc\Backend\Views\Form_Entries_Page;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Submitted class
 */
class Submitted
{
/**
 * Current plugin slug
 */

    public $slug = 'kaliforms';
    /**
     * Entry counter setter
     *
     * @var array
     */
    public $entry_counter = [];
	public $form_type_map = [];
	public $form_field_prop_map = [];
    /**
     * Class Constructor
     */
    public function __construct()
    {
        $this->set_entry_counter();
        $this->set_form_type_map();
        add_action('init', [$this, 'register_post_type']);
        add_filter('query_vars', [$this, 'register_formid_var']);
        add_action('pre_get_posts', [$this, 'alter_query'], 99);
        add_filter('manage_edit-kaliforms_forms_columns', [$this, 'edit_columns']);
        add_action('manage_kaliforms_forms_posts_custom_column', [$this, 'edit_custom_column'], 10, 2);
        add_action('restrict_manage_posts', [$this, 'add_form_id_filter']);
        // Edit viwes
        add_action('views_edit-kaliforms_submitted', [$this, 'edit_views']);
        // Enqueue the scripts needed for this particular post type
        add_action('admin_enqueue_scripts', [$this, 'enqueue']);
        // Initiate the submission actions class ( ajax related to submissions )
        new Submission_Actions();
        // Register the shortcode
        new Submission_Shortcode();
        /**
         * Register submenus
         */
        add_action('admin_menu', [$this, 'register_submenus']);

        add_filter('views_edit-kaliforms_submitted', [$this, 'add_export_tab'], 10, 1);
    }
    /**
     * Sets the entry counter formId => count so we can display the number in the column
     *
     * @return []
     */
    public function set_entry_counter()
    {
        $posts = new \WP_Query(['post_type' => $this->slug . '_submitted', 'posts_per_page' => -1, 'post_status' => 'publish']);
        if ($posts->have_posts()) {
            foreach ($posts->posts as $post) {
                $form_id = get_post_meta($post->ID, 'formId', true);
                if (!array_key_exists('form_' . $form_id, $this->entry_counter)) {
                    $this->entry_counter['form_' . $form_id] = 0;
                }

                $this->entry_counter['form_' . $form_id] += 1;
            }
        }

        wp_reset_postdata();
    }
    /**
     * Registers the submenus
     *
     * @return void
     */
    public function register_submenus()
    {
		// add_submenu_page(
		//     'edit.php?post_type=kaliforms_forms',
		//     esc_html__('Form entries', 'kaliforms'),
		//     esc_html__('Form entries'),
		//     'manage_options',
		//     'edit.php?post_type=kaliforms_submitted'
		// );

		add_submenu_page(
            'edit.php?post_type=kaliforms_forms',
			esc_html__('Form entries', 'kaliforms'),
			esc_html__('Form entries', 'kaliforms'),
            'manage_options',
            'kaliforms-form-entries',
            new Form_Entries_Page()
        );
    }
    /**
     * Adds export tab
     *
     * @return void
     */
    public function add_export_tab($views)
    {
        $tabs = [
            'entries'  => [
                'name' => esc_html__('Entries', 'kaliforms'),
                'url'  => admin_url('edit.php?post_type=kaliforms_submitted'),
            ],
            'exporter' => [
                'name'   => esc_html__('Exporter (PRO)', 'kaliforms'),
                'url'    => 'https://www.kaliforms.com/pricing?utm_source=entriesPage&utm_campaign=userInterests&utm_medium=navTabButton',
                '_blank' => true,
            ],
        ];

        $tabs = apply_filters($this->slug . '_submitted_page_tabs', $tabs);

        $str = '<div class="nav-tab-wrapper">';
        foreach ($tabs as $id => $tab) {
            $blank  = isset($tab['_blank']) && $tab['_blank'] ? 'target="_blank"' : '';
            $active = ('entries' === $id ? ' nav-tab-active' : '');
            $str .= '<a href="' . esc_url($tab['url']) . '" ' . $blank . ' class="nav-tab ' . $active . '">' . $tab['name'] . '</a>';
        }
        $str .= '</div><br />';
        echo $str;
    }
    /**
     * Custom post type enqueue
     */
    public function enqueue()
    {
        $screen = get_current_screen();
        if ($screen->id === 'edit-kaliforms_submitted' || $screen->id === 'admin_page_kaliforms-submission-exporter') {
            $deps = ['underscore', 'jquery'];
            if (
                wp_script_is('kaliforms-submission-plugin', 'registered')
                && $screen->id === 'admin_page_kaliforms-submission-exporter'
            ) {
                $deps[] = 'kaliforms-submission-plugin';
            }

            wp_enqueue_script(
                'kaliforms-submission',
                KALIFORMS_URL . 'assets/submissions/backend/js/kaliforms-submissions.js',
                $deps,
                KALIFORMS_VERSION,
                true
            );

            wp_localize_script(
                'kaliforms-submission',
                'KaliFormsObject',
                ['ajaxurl' => esc_url(admin_url('admin-ajax.php')), 'ajax_nonce' => wp_create_nonce($this->slug . '_nonce')]
            );
        }
    }
    /**
     * Adds the form id/name filter select
     *
     * @param [type] $post_type
     * @return void
     */
    public function add_form_id_filter($post_type)
    {
        if ($post_type !== 'kaliforms_submitted') {
            return;
        }
        $options = [];
        $posts   = new \WP_Query(['post_type' => $this->slug . '_forms', 'posts_per_page' => -1, 'post_status' => 'publish']);
        if ($posts->have_posts()) {
            while ($posts->have_posts()) {
                $posts->the_post();
                $options[get_the_ID()] = get_the_title();
            }
        }
        wp_reset_postdata();

        $str = '<select id="kaliforms-filter-by-id" name="formId">';
        foreach ($options as $id => $title) {
            $checked = (isset($_REQUEST['formId']) && absint($_REQUEST['formId']) === $id) ? 'selected' : '';
            $str .= '<option value="' . absint($id) . '" ' . $checked . '>' . esc_html($title) . '</option>';
        }
        $str .= '</select>';
        echo $str;
    }
    /**
     * Edit the views
     *
     * @param Array $views
     * @return Array
     */
    public function edit_views($views)
    {

        // var_dump(get_current_screen());die();
        // var_dump($views);die();
    }

    /**
     * Registers the post type
     *
     * @return void
     */
    public function register_post_type()
    {
        register_post_type(
            'kaliforms_submitted',
            [
                // Labels
                'labels'              => [
                    'name'          => esc_html__('Form Entries', 'kaliforms'),
                    'singular_name' => esc_html__('Form Entry', 'kaliforms'),
                ],
                // Show in ui & menus
                'show_ui'             => true,
                'show_in_menu'        => 'page=kaliforms_settings',
                'show_in_admin_bar'   => false,
                'show_in_rest'        => false,
                // Public
                'public'              => true,
                'publicly_queryable'  => false,
                // has archive
                'has_archive'         => true,
                // URL rewrite
                'rewrite'             => [
                    'slug' => 'form-submissions',
                ],
                // 'menu_icon' => KALIFORMS_URL . 'assets/img/iconMenu.svg',
                'supports'            => [],
                'capabilities'        => ['create_posts' => 'do_not_allow'],
                'map_meta_cap'        => true,
                'exclude_from_search' => true,
                'hierarchical'        => false,
            ]
        );

    }

    /**
     * Register the new formid param as queriable
     *
     * @param [type] $vars
     * @return void
     */
    public function register_formid_var($vars)
    {
        array_push($vars, 'formId');

        return $vars;
    }

    /**
     *  Alters the query so we get submissions only for the specific form Id
     *
     * @param [WP_Query] $query
     * @return void
     */
    public function alter_query($query)
    {
        if (!is_admin() || !$query->is_main_query()) {
            return;
        }

        if ($query->get('post_type') !== 'kaliforms_submitted') {
            return;
        }

        $query->set('meta_query', true);
        $query->set('meta_key', 'formId');

        if (empty($_REQUEST['formId'])) {
            // get first form
            $posts = new \WP_Query(['post_type' => $this->slug . '_forms', 'posts_per_page' => 1, 'post_status' => 'publish']);
            $id    = null;
            if ($posts->have_posts()) {
                $query->set('meta_value', $posts->post->ID);
                $id = $posts->post->ID;
            }
            wp_reset_postdata();
            $_REQUEST['formId'] = absint($id);
        }

        if (!empty(absint($_REQUEST['formId']))) {
            $query->set('meta_value', absint($_REQUEST['formId']));
        }

        add_filter('manage_edit-kaliforms_submitted_columns', [$this, 'edit_submission_columns']);
        add_action('manage_kaliforms_submitted_posts_custom_column', [$this, 'edit_submission_custom_columns'], 10, 2);
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
        $count = array_key_exists('form_' . $post_id, $this->entry_counter) ? $this->entry_counter['form_' . $post_id] : 0;
        switch ($column) {
            case 'submissions':
                echo ($count > 0)
                ? '<a href="edit.php?post_type=kaliforms_forms&page=kaliforms-form-entries#/form-entries/' . absint($post_id) . '">' . sprintf(esc_html__('See entries (%s)', 'kaliforms'), $count) . '</a>'
                : esc_html__('Form has no entries', 'kaliforms');
                break;
            default:
                break;
        }
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
                'submissions' => esc_html__('Submissions', 'kaliforms'), 'date' => $date,
            ]
        );
        return $columns;
    }
    /**
     * Edits submission custom columns
     *
     * @param [string] $column
     * @param [number] $post_id
     * @return void
     */
    public function edit_submission_custom_columns($column, $post_id)
    {
        if (empty($this->form_type_map)) {
            $this->set_form_type_map();
        }

        switch ($column) {
            case 'actions':
                $form_id = null;
                if (get_query_var('formId')) {
                    $form_id = get_query_var('formId');
                }
                if ($form_id === null) {
                    if (!isset($_REQUEST['formId'])) {
                        return;
                    }

                    $form_id = absint($_REQUEST['formId']);
                }

                echo '<div class="button-group">';
                echo sprintf(
                    '<button class="button button-small kaliforms-submission-link" data-link="%s">%s</button>',
                    Action_Helper::get_submission_link(false, $post_id, $form_id),
                    '<span class="dashicons dashicons-admin-links"></span>'
                );
                echo sprintf(
                    '<button class="button button-small kaliforms-resend-emails" data-submission-id="%s" data-form-id="%s">%s</button>',
                    $post_id,
                    $form_id,
                    '<span class="dashicons dashicons-email-alt"></span>'
                );
                echo '</div>';
                break;
            default:
                $val = esc_html(get_post_meta($post_id, $column, true));
                if (!isset($this->form_type_map[$column])) {
                    echo esc_html($val);
                    return;
                }
                switch ($this->form_type_map[$column]) {
                    case 'ip':
                        echo empty($val) ? esc_html__('N\A', 'kaliforms') : esc_html($val);
                        break;
                    case 'radio':
                    case 'dropdown':
                        foreach ($this->form_field_prop_map[$column]->choices as $choice) {
                            if ($choice->value === $val) {
                                $val = !empty($choice->label)
                                ? esc_html($choice->label)
                                : esc_html($choice->value);
                            }
                        };
                        echo esc_html($val);
                        break;
                    case 'checkbox':
                    case 'choices':
                        $values = explode($this->form_field_prop_map[$column]->separator, $val);
                        $newVal = [];
                        foreach ($values as $value) {
                            foreach ($this->form_field_prop_map[$column]->choices as $choice) {
                                if ($choice->value === $value) {
                                    $newVal[] = !empty($choice->label)
                                    ? esc_html($choice->label)
                                    : esc_html($choice->value);
                                }
                            }
                        }
                        echo esc_html(implode($this->form_field_prop_map[$column]->separator, $newVal));
                        break;
                    case 'fileUpload':
                        $images = explode(',', $val);
                        foreach ($images as $uId) {
                            $img = wp_get_attachment_url($uId);
                            echo '<img style="width:150px" src="' . esc_url($img) . '" /><br/>';
                        }
                        break;
                    case 'imageRadio':
                        $img = wp_get_attachment_url($val);
                        echo '<img style="width:150px" src="' . esc_url($img) . '" />';
                        break;
                    case 'digitalSignature':
                        $validB64 = preg_match("/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).base64,.*/", $val);
                        if ($validB64 > 0) {
                            echo '<img style="width:150px" src="' . $val . '" />';
                            break;
                        }
                        $img = wp_get_attachment_url($val);
                        echo '<img style="width:150px" src="' . esc_url($img) . '" />';
                        break;
                    default:
                        echo esc_html__($val);
                        break;
                }
        }
    }

    /**
     * Generates a link to delete the submission
     *
     * @param [type] $post_id
     * @param [type] $form_id
     * @return void
     */
    public function get_delete_link($post_id, $form_id)
    {
        return 'bye-world';
    }
    /**
     * Plucks values from the properties array
     *
     * @param [String] $key
     * @param [stdClass] $obj
     * @return String
     */
    public function pluck_value_from_properties($key, $obj)
    {
        if (isset($obj->properties->{$key})) {
            return $obj->properties->{$key};
        }
    }
    /**
     * Get first form
     *
     * @return void
     */
    public function get_first_form()
    {
        $post  = null;
        $posts = new \WP_Query(['post_type' => $this->slug . '_forms', 'posts_per_page' => 1, 'post_status' => 'publish']);
        if ($posts->have_posts()) {
            $post = $posts->post;
        }
        wp_reset_postdata();
        return $post;
    }
    /**
     * Add columns dynamically based on the submitted data
     *
     * @param [Array] $columns
     * @return void
     */
    public function edit_submission_columns($columns)
    {
        $arr               = $this->_get_field_components();
        $arr['actions']    = esc_html__('Actions', 'kaliforms');
        $arr['ip_address'] = esc_html__('Ip address', 'kaliforms');
        $arr['date']       = $columns['date'];
        unset($columns['title']);
        unset($columns['date']);

        $columns = array_merge($columns, $arr);
        return $columns;
    }

    /**
     * Set form type map
     *
     * @return void
     */
    public function set_form_type_map()
    {
        if (empty($_REQUEST['formId'])) {
            return;
        }

        $form       = !empty($_REQUEST['formId']) ? get_post($_REQUEST['formId']) : $this->get_first_form();
        $components = get_post_meta($form->ID, $this->slug . '_field_components', true);
        $separator  = get_post_meta($form->ID, $this->slug . '_multiple_selections_separator', true);
        if ($components === null || $components === '' && $components !== null) {
            return $columns;
        }
        $components = json_decode($components);
        $arr        = [];
        $propsArr   = [];
        foreach ($components as $component) {
            $name = $this->pluck_value_from_properties('name', $component);

            if (empty($name)) {
                continue;
            }

            $arr[$name]                 = $component->id;
            $propsArr[$name]            = $component->properties;
            $propsArr[$name]->separator = $separator;
        }

        $arr['ip_address']      = 'ip';
        $propsArr['ip_address'] = [
            'id'   => 'ip_address',
            'name' => 'ip_address',
        ];
        $this->form_type_map       = $arr;
        $this->form_field_prop_map = $propsArr;
    }
    /**
     * Get field components
     *
     * @return void
     */
    private function _get_field_components()
    {
        $form       = !empty($_REQUEST['formId']) ? get_post(absint($_REQUEST['formId'])) : $this->get_first_form();
        $components = get_post_meta($form->ID, $this->slug . '_field_components', true);
        if ($components === null || $components === '' && $components !== null) {
            return $columns;
        }
        $components = json_decode($components);
        $arr        = [];
        $skip       = ['payPal', 'grecaptcha', 'stripe', 'wireTransfer', 'button', 'submitButton', 'divider'];
        foreach ($components as $component) {
            if (in_array($component->id, $skip)) {
                continue;
            }

            $name = $this->pluck_value_from_properties('name', $component);
            if (empty($name)) {
                continue;
            }

            $caption    = $this->pluck_value_from_properties('caption', $component);
            $arr[$name] = empty($caption) ? $name : $caption;
            if ($component->id === 'hidden') {
                $arr[$name] = $name;
            }
        }
        $arr = array_filter($arr);

        $arr['ip_address'] = 'ip_address';

        return $arr;
    }
}
