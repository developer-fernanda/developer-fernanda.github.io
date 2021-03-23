<?php
namespace KaliForms\Inc\Utils;

use KaliForms\Inc\Backend\PredefinedForms\Contact_Form;

/**
 * Class First_Install
 */
class First_Install
{
    /**
     * Plugin slug
     *
     * @var string
     */
    protected $slug = 'kaliforms';
    /**
     * Constructor
     */
    public function __construct()
    {
        $forms = $this->check_for_posts();
        if ($forms) {
            return;
        }

        $this->import_initial_contact_form();
    }

    /**
     * Checks for posts
     *
     * @return boolean
     */
    public function check_for_posts()
    {
        $posts = new \WP_Query(['post_type' => $this->slug . '_forms']);
        wp_reset_postdata();
        return $posts->have_posts();
    }

    /**
     * Imports the initial contact form
     */
    public function import_initial_contact_form()
    {
        // Get data from contact form
        $data = new Contact_Form();
        // Create post
        $id = wp_insert_post([
            'post_title'  => $data->name,
            'post_type'   => $this->slug . '_forms',
            'post_status' => 'publish',
        ]);
        // Use data from contact form to structure our meta array

        $meta = [
            'emails'                 => wp_json_encode($data->emails),
            'field_components'       => wp_json_encode($data->field_components),
            'grid'                   => wp_json_encode($data->grid),
            'required_field_mark'    => '*',
            'show_thank_you_message' => 1,
            'thank_you_message'      => $data->form_info['thankYouMessage'],
        ];

        // Update metas
        foreach ($meta as $k => $v) {
            update_post_meta($id, $this->slug . '_' . $k, $v);
        }

        // set_transient($this->slug . '_welcome_activation_redirect', true, 30);
    }
}
