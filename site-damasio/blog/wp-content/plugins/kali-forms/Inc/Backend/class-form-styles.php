<?php

namespace KaliForms\Inc\Backend;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Class Form Styles
 */
class Form_Styles
{
    /**
     * Styles
     *
     * @var array
     */
    public $styles = [];
    /**
     * Simplfied styles
     *
     * @var array
     */
    public $simplified = [];
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
        $this->set_styles();

        add_action('wp_ajax_kaliforms_set_form_theme',
            [$this, 'set_form_theme']
        );
    }
    /**
     * @return Form_Styles
     */
    public static function get_instance()
    {
        static $inst;
        if (!$inst) {
            $inst = new Form_Styles();
        }

        return $inst;
    }
    /**
     * Returns the applied form style for a given form
     *
     * @return void
     */
    public function get_applied_form_style($id, $default = null)
    {
        $value = get_post_meta($id, $this->slug . '_selected_form_style', true);
        if ($value === null || $value === '' && $default !== null) {
            return $default;
        }
        return $value;
    }
    /**
     * Sets the form theme for a post
     *
     * @return void
     */
    public function set_form_theme()
    {
        if (!isset($_POST['args'], $_POST['args']['nonce'])) {
            wp_die('Denied');
        }

        if (!wp_verify_nonce(sanitize_key(wp_unslash($_POST['args']['nonce'])), $this->slug . '_nonce')) {
            wp_die('Denied');
        }

        if (!current_user_can('manage_options')) {
            wp_die(wp_json_encode([
                'success' => false,
                'message' => esc_html__('Denied', 'kaliforms'),
            ]));
        }

        $_POST['args'] = stripslashes_deep($_POST['args']);
        $current       = Form_Styles::get_instance();
        $form_id       = absint($_POST['args']['formId']);
        $theme         = sanitize_text_field($_POST['args']['newTheme']);

        if (!in_array($theme, $current->simplified)) {
            $theme = 'theme';
        }

        update_post_meta($form_id, $current->slug . '_selected_form_style', $theme);

        wp_die(wp_json_encode([
            'success' => true,
            'message' => 'ok - updated form: ' . $form_id . ' with the theme: ' . $theme,
        ]));

    }
    /**
     * Sets styles
     *
     * @return void
     */
    public function set_styles()
    {
        $this->styles = [
            [
                'id'    => 'theme',
                'label' => esc_html__('Theme styling', 'kaliforms'),
                'thumb' => KALIFORMS_URL . '/assets/img/styles/standard.png',
            ],
            [
                'id'    => 'dark',
                'label' => esc_html__('Dark theme', 'kaliforms'),
                'thumb' => KALIFORMS_URL . '/assets/img/styles/dark.png',
            ],
            [
                'id'    => 'borderBottom',
                'label' => esc_html__('Minimalistic', 'kaliforms'),
                'thumb' => KALIFORMS_URL . '/assets/img/styles/border-bottom.png',
            ],
            [
                'id'    => 'roundedBorders',
                'label' => esc_html__('Rounded borders', 'kaliforms'),
                'thumb' => KALIFORMS_URL . '/assets/img/styles/rounded-borders.png',
            ],
            [
                'id'    => 'roundedBordersBg',
                'label' => esc_html__('Rounded borders grey', 'kaliforms'),
                'thumb' => KALIFORMS_URL . '/assets/img/styles/rounded-borders-bg.png',
            ],
            [
                'id'    => 'straightBorders',
                'label' => esc_html__('Straight borders', 'kaliforms'),
                'thumb' => KALIFORMS_URL . '/assets/img/styles/straight-borders.png',
            ],
            [
                'id'    => 'straightBordersBg',
                'label' => esc_html__('Straight borders grey', 'kaliforms'),
                'thumb' => KALIFORMS_URL . '/assets/img/styles/straight-borders-bg.png',
            ],
            [
                'id'    => 'inputBg',
                'label' => esc_html__('Input grey', 'kaliforms'),
                'thumb' => KALIFORMS_URL . '/assets/img/styles/input-with-bg.png',
            ],
            [
                'id'    => 'inputBgRounded',
                'label' => esc_html__('Rounded input grey', 'kaliforms'),
                'thumb' => KALIFORMS_URL . '/assets/img/styles/rounded-borders-bg-only.png',
            ],
            [
                'id'    => 'inputLabelMerge',
                'label' => esc_html__('Compact', 'kaliforms'),
                'thumb' => KALIFORMS_URL . '/assets/img/styles/input-label-merge.png',
            ],
            [
                'id'    => 'inputLabelMergeOverlap',
                'label' => esc_html__('Compact overlap', 'kaliforms'),
                'thumb' => KALIFORMS_URL . '/assets/img/styles/input-label-overlap.png',
            ],
        ];
        $this->simplified = [];
        foreach ($this->styles as $style) {
            $this->simplified[] = $style['id'];
        }
    }
}
