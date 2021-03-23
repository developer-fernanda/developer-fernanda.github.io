<?php
namespace KaliForms\Inc\Backend;

if (!defined('ABSPATH')) {
    exit;
}

class Elementor_KaliForms_Widget extends \Elementor\Widget_Base
{
    /**
     * Plugin slug
     *
     * @var string
     */
    public $slug = 'kaliforms';
    /**
     * Class constructor
     *
     * @param array $data
     * @param [type] $args
     */
    public function __construct($data = [], $args = null)
    {
        parent::__construct($data, $args);
        $this->_register_scripts();
        $this->_register_styles();
    }
    /**
     * Script registration
     *
     * @return void
     */
    private function _register_scripts()
    {
        wp_register_script(
            'kali-grecaptcha',
            '//www.google.com/recaptcha/api.js',
            false,
            false,
            false
        );
        wp_register_script(
            'kaliforms-filepond',
            KALIFORMS_URL . 'assets/frontend/js/filepond.js',
            ['wp-i18n'],
            KALIFORMS_VERSION
        );
        wp_localize_script(
            'kaliforms-filepond',
            'KaliFormsFilePondObject',
            [
                'ajaxurl' => esc_url(admin_url('admin-ajax.php')),
            ]
        );
        wp_register_script(
            'kaliforms-exports',
            KALIFORMS_URL . 'assets/frontend/js/kaliExports.js',
            [],
            KALIFORMS_VERSION
        );
        wp_register_script(
            'kaliforms-frontend',
            KALIFORMS_URL . 'assets/frontend/js/elementor.js',
            ['wp-i18n', 'kaliforms-exports', 'kaliforms-filepond'],
            KALIFORMS_VERSION,
            true
        );
    }
    /**
     * Style registration
     *
     * @return void
     */
    private function _register_styles()
    {
        wp_register_style(
            'bootstrap-v4-grid',
            KALIFORMS_URL . 'assets/frontend/vendor/bootstrap-grid.min.css',
            false,
            KALIFORMS_VERSION
        );

        wp_register_style(
            'kaliforms-frontend',
            KALIFORMS_URL . 'assets/frontend/css/frontend.css',
            false,
            KALIFORMS_VERSION
        );

    }
    /**
     * Get style depends
     *
     * @return void
     */
    public function get_style_depends()
    {
        return ['bootstrap-v4-grid', 'kaliforms-frontend'];
    }
    /**
     * Get script depends
     *
     * @return void
     */
    public function get_script_depends()
    {
        $arr = ['elementor-frontend', 'kaliforms-frontend'];
        return $arr;
    }
    /**
     * Widget name
     *
     * @return void
     */
    public function get_name()
    {
        return 'kaliforms';
    }
    /**
     * Widget title
     *
     * @return void
     */
    public function get_title()
    {
        return esc_html__('Kali Form', 'kaliforms');
    }
    /**
     * Widget icon
     *
     * @return void
     */
    public function get_icon()
    {
        return 'fa fa-code';
    }
    /**
     * Get categories
     *
     * @return void
     */
    public function get_categories()
    {
        return ['general'];
    }
    /**
     * Controls
     *
     * @return void
     */
    protected function _register_controls()
    {
        $this->start_controls_section(
            'content_section',
            [
                'label' => esc_html__('General', 'kaliforms'),
                'tab'   => \Elementor\Controls_Manager::TAB_CONTENT,
            ]
        );

        $this->add_control(
            'formId',
            [
                'label'      => esc_html__('Form id', 'kaliforms'),
                'type'       => \Elementor\Controls_Manager::SELECT2,
                'input_type' => 'text',
                'options'    => $this->_get_forms(),
            ]
        );

        $this->end_controls_section();
    }
    /**
     * Get kali forms
     *
     * @return void
     */
    protected function _get_forms()
    {
        $args = [
            'post_type'      => 'kaliforms_forms',
            'posts_per_page' => -1,
        ];
        $query = new \WP_Query($args);
        $forms = [
            0 => esc_html__('Select a form', 'kaliforms'),
        ];
        foreach ($query->posts as $form) {
            $forms[$form->ID] = $form->post_title;
        }
        return $forms;
    }
    /**
     * Render function
     *
     * @return void
     */
    protected function render()
    {
        $settings = $this->get_settings_for_display();
        if ((int) $settings['formId'] === 0) {
            echo esc_html__('Please select a form from the dropdown', 'kaliforms');
            return;
        }
        if ($this->_check_if_elementor_preview()) {
            echo '<em>' . esc_html__('Form may not look the same in the Elementor preview as on the actual page', 'kaliforms') . '</em>';
        }

        echo do_shortcode('[kaliform id="' . $settings['formId'] . '"]');
    }

    /**
     * Check if is elementor preview
     *
     * @return void
     */
    public function _check_if_elementor_preview()
    {
        if (empty($_GET)) {
            return false;
        }

        if (isset($_GET['action']) && $_GET['action'] === 'elementor') {
            return true;
        }
    }

    public function determine_if_form_has_filepond($formId)
    {
        if (absint($formId) === 0) {
            return false;
        }

        $fields = get_post_meta($formId, $this->slug . '_field_components', true);
        if ($fields === null || $fields === '' && $fields !== null) {
            return false;
        }
        $load   = false;
        $fields = json_decode($fields);
        foreach ($fields as $field) {
            if ($field->id === 'fileUpload') {
                $load = true;
                break;
            }
        }

        return $load;
    }
}
