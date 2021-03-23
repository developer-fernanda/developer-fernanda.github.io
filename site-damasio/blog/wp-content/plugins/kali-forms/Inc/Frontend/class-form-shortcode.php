<?php
namespace KaliForms\Inc\Frontend;

use KaliForms\Inc\Backend\Translations;
use KaliForms\Inc\Utils;
use KaliForms\Inc\Utils\General_Placeholders_Helper;

if (!defined('ABSPATH')) {
    exit;
}

class Form_Shortcode
{
    /**
     * Metahelper trait
     */
    use Utils\MetaHelper;
    /**
     * Grid helper trait
     */
    use Utils\GridHelper;
    /**
     * Fields helper
     */
    use Utils\FieldsHelper;
    /**
     * Plugin slug
     *
     * @var string
     */
    protected $slug = 'kaliforms';
    /**
     * Post id
     *
     * @var [id]
     */
    public $id;
    /**
     * Post
     *
     * @var [post]
     */
    public $post;
    /**
     * Fields array
     *
     * @var array
     */
    public $fields = [];
    /**
     * Rows
     *
     * @var array
     */
    protected $rows = [];
    /**
     * Actual HTML being outputted
     *
     * @var string
     */
    public $html = '';
    /**
     * Load recaptcha ?
     *
     * @var boolean
     */
    public $load_grecaptcha = false;
    /**
     * Load file pond if needed ( file upload )
     *
     * @var boolean
     */
    public $load_filepond = false;
    /**
     * Payment method
     *
     * @var [type]
     */
    public $payment_method = [];
    /**
     * $args sent from the shortcode
     *
     * @var array
     */
    protected $args = [];
    /**
     * Creates an instance of the form shortcode
     *
     * @param [Array] $args
     */
    public function __construct($args)
    {
        if (!isset($args['id'])) {
            return $this->display_error(esc_html__('The shortcode does not provide an id for the form', 'kaliforms'));
        }

        $this->post = get_post($args['id']);
        if ($this->post === null) {
            return $this->display_error(esc_html__('There is no form associated with this id. Make sure you copied it correctly', 'kaliforms'));
        }
        if ($this->post->post_status !== 'publish') {
            return $this->display_error(esc_html__('This form is not published.', 'kaliforms'));
        }

        $fields = json_decode($this->get('field_components', '[]'));

        $this->payment_method = [
            'field'     => '',
            'providers' => [],
        ];

        foreach ($fields as $field) {
            if ($field->id === 'grecaptcha') {
                $this->load_grecaptcha = true;
            }
            if ($field->id === 'fileUpload') {
                $this->load_filepond = true;
            }

            if ($field->id === 'paymentMethod') {
                $this->payment_method['field'] = $field->internalId;
            }

            if (isset($field->properties->name) && isset($args[$field->properties->name])) {
                $field->properties->default = $args[$field->properties->name];
                $val                        = $field->properties->default;
                if (substr($val, 0, 1) === '{' && substr($val, -1) === '}') {
                    $val                        = substr($val, 1, -1);
                    $field->properties->default = $this->shortcode_value($val);
                }
            }

            if (in_array($field->id, ['paypal', 'stripe'])) {
                $this->payment_method['providers'][] = [
                    'internalId' => $field->internalId,
                    'label'      => $field->label,
                ];
            }

            $this->fields[$field->internalId] = $field;
        }

        $this->prepare_data();
        $this->load_scripts_and_styles();
        $this->load_grecaptcha_if_needed();

        apply_filters($this->slug . '_form_shortcode_init', $this);
        $form       = new Form($args['id'], $this->rows, $this->get_form_info());
        $this->html = $form->render_fields();
    }
    /**
     * Grabs form info from the database
     *
     * @return void
     */
    public function get_form_info()
    {
        return apply_filters($this->slug . '_shortcode_form_info', [
            'form_id'                         => $this->post->ID,
            'honeypot'                        => $this->get('honeypot', '0'),
            'required_field_mark'             => $this->get('required_field_mark', ''),
            'global_error_message'            => $this->get('global_error_message', ''),
            'multiple_selections_separator'   => $this->get('multiple_selections_separator', ','),
            'remove_captcha_for_logged_users' => $this->get('remove_captcha_for_logged_users', '0'),
            'hide_form_name'                  => $this->get('hide_form_name', '0'),
            'save_ip_address'                 => $this->get('save_ip_address', '0'),
            'css_id'                          => $this->get('css_id', ''),
            'css_class'                       => $this->get('css_class', ''),
            'form_name'                       => get_the_title($this->post),
            'google_site_key'                 => $this->get('google_site_key', ''),
            'google_secret_key'               => $this->get('google_secret_key', ''),
            'currency'                        => $this->get('currency', ''),
            'form_style'                      => $this->get('selected_form_style', 'theme'),
            'form_action'                     => $this->get('form_action', ''),
            'form_method'                     => $this->get('form_method', ''),
            'payment_method'                  => $this->payment_method,
        ]);
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

    /**
     * Loads scripts and styles needed for the form
     *
     * @return void
     */
    public function load_scripts_and_styles()
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
        wp_register_script(
            'kaliforms-exports',
            KALIFORMS_URL . 'assets/frontend/js/kaliExports.js',
            [],
            KALIFORMS_VERSION
        );
        $deps = ['wp-i18n', 'kaliforms-exports'];
        if ($this->load_filepond) {
            $deps[] = 'kaliforms-filepond';
        }

        if (!isset($GLOBALS['wp_scripts']->registered['kaliforms-frontend'])) {
            wp_enqueue_script(
                'kaliforms-frontend',
                KALIFORMS_URL . 'assets/frontend/js/frontend.js',
                $deps,
                KALIFORMS_VERSION,
                true
            );
        }

        wp_enqueue_style(
            'bootstrap-v4-grid',
            KALIFORMS_URL . 'assets/frontend/vendor/bootstrap-grid.min.css',
            false,
            KALIFORMS_VERSION
        );

        wp_enqueue_style(
            'kaliforms-frontend',
            KALIFORMS_URL . 'assets/frontend/css/frontend.css',
            false,
            KALIFORMS_VERSION
        );

        wp_localize_script(
            'kaliforms-frontend',
            'KaliFormsObject',
            [
                'ajaxurl'        => esc_url(admin_url('admin-ajax.php')),
                'frontendUrl'    => esc_url(get_bloginfo('url')),
                'translations'   => (new Translations)->translations['frontend'],
                'ajax_nonce'     => wp_create_nonce($this->slug . '_nonce'),
                'restUrl'        => get_rest_url(null, 'kaliforms/v1/processor'),
                'restNonce'      => wp_create_nonce('wp_rest'),
                'akismetEnabled' => esc_js($this->get('akismet', '0')),
            ]
        );
        wp_localize_script(
            'kaliforms-filepond',
            'KaliFormsFilePondObject',
            [
                'ajaxurl' => esc_url(admin_url('admin-ajax.php')),
            ]
        );

        wp_set_script_translations('kaliforms-frontend', 'kaliforms', KALIFORMS_BASE . 'languages');

        do_action($this->slug . '_after_load_script_function', $this);

    }

    /**
     * Loads recaptcha if needed
     *
     * @return void
     */
    public function load_grecaptcha_if_needed()
    {
        if ($this->load_grecaptcha) {
            wp_enqueue_script('kali-grecaptcha');
        }
    }

    /**
     * Displays an error in the frontend
     *
     */
    public function display_error($err)
    {
        $this->html = $err;
    }

    /**
     * Prepares data so we can use it
     *
     * @return void
     */
    public function prepare_data()
    {
        $grid = json_decode($this->get('grid', '[]'));
        $this->walk_array($grid);
    }

    /**
     * Undocumented function
     *
     * @param [type] $val
     * @return void
     */
    public function shortcode_value($val)
    {
        $str = '';

        if (
            in_array(
                $val,
                [
                    'user_email',
                    'first_name',
                    'last_name',
                    'user_login',
                    'user_nicename',
                    'user_url',
                    'display_name',
                ]
            )
            && is_user_logged_in()
        ) {
            $user = wp_get_current_user();
            switch ($val) {
                case 'user_email':
                    $str = $user->get('user_email');
                    break;
                case 'first_name':
                    $str = $user->get('first_name');
                    break;
                case 'last_name':
                    $str = $user->get('last_name');
                    break;
                case 'user_login':
                    $str = $user->get('user_login');
                    break;
                case 'user_nicename':
                    $str = $user->get('user_nicename');
                    break;
                case 'user_url';
                    $str = $user->get('user_url');
                    break;
                case 'display_name':
                    $str = $user->get('display_name');
                    break;
                default:
                    $str = '';
                    break;
            }
        }

        if (
            in_array(
                $val,
                [
                    'entryCounter',
                    'formName',
                    'thisPermalink',
                ]
            )
        ) {
            switch ($val) {
                case 'entryCounter':
                    $str = General_Placeholders_Helper::count_form_entries($this->post->ID);
                    break;
                case 'formName':
                    $str = get_the_title($this->post);
                    break;
                case 'thisPermalink':
                    $str = esc_url(get_permalink());
                    break;
                default:
                    $str = '';
                    break;
            }

        }
        return $str;
    }
}
