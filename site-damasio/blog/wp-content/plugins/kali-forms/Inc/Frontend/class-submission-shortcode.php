<?php
namespace KaliForms\Inc\Frontend;

if (!defined('ABSPATH')) {
    exit;
}
class Submission_Shortcode
{
    /**
     * Current plugin slug
     */
    public $slug = 'kaliforms';
    /**
     * Form id
     *
     * @var [type]
     */
    protected $form_id = null;
    /**
     * Undocumented variable
     *
     * @var [type]
     */
    protected $submission_id = null;
    /**
     * Hash
     *
     * @var [type]
     */
    protected $hash = null;
    /**
     * Hash computed from backend
     *
     * @var [type]
     */
    private $computed_hash = null;
    /**
     * Field map
     *
     * @var array
     */
    public $form_type_map = [];
    /**
     * Class constructor
     */
    public function __construct()
    {
        // Register shrotcode
        add_shortcode('kaliform-submission', [$this, 'register_shortcode']);
        // Enqueue scripts in frontend
        add_action(
            'wp_enqueue_scripts',
            [$this, 'enqueue'],
            99
        );
        $this->set_form_type_map();
    }

    /**
     * Custom post type enqueue
     */
    public function enqueue()
    {
        wp_enqueue_script(
            'kaliforms-submission-frontend',
            KALIFORMS_URL . 'assets/submissions/frontend/js/kaliforms-submissions.js',
            ['jquery'],
            KALIFORMS_VERSION,
            true
        );

        wp_localize_script(
            'kaliforms-submission-frontend',
            'KaliFormsObject',
            ['ajaxurl' => esc_url(admin_url('admin-ajax.php')), 'ajax_nonce' => wp_create_nonce($this->slug . '_nonce')]
        );

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

        $form = !empty($_REQUEST['formId']) ? get_post(absint($_REQUEST['formId'])) : null;
        if ($form === null) {
            return;
        }
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
     * Register the shortcode so we can display it in the frontend
     *
     * @return void
     */
    public function register_shortcode()
    {
        $this->get_form_id();
        $this->get_submission_id();
        $this->get_hash();

        if ($this->form_id === null || $this->hash === null) {
            return esc_html__('Something went wrong.', 'kaliforms');
        }

        $this->compute_hash();
        if (!$this->verify_hash()) {
            return esc_html__('Denied!', 'kaliforms');
        }

        return $this->render_submission();
    }

    /**
     * Renders the submission
     *
     * @return void
     */
    public function render_submission()
    {
        $data = $this->_get_data();
        $html = '<dl>';

        foreach ($data as $k => $v) {
            $type = isset($this->form_type_map[$v['id']]) ? $this->form_type_map[$v['id']] : 'textbox';
            if (in_array($type, ['freeText'])) {
                continue;
            }
            $html .= '<dt>' . esc_html($v['caption']) . '</dt>';
            $html .= '<dd>' . $this->_render_value($type, $v) . '<dd>';
        }
        $html .= '</dl>';

        $html .= '<hr />';
        $html .= '<button class="button" id="delete-kaliform-submission" data-hash="' . $this->hash . '" data-form-id="' . $this->form_id . '" data-submission-id="' . $this->submission_id . '">' . esc_html__('Delete submission', 'kaliforms') . '</button>';
        return $html;
    }

    /**
     * Renders a value
     *
     * @return void
     */
    private function _render_value($type, $v)
    {
        switch ($type) {
            case 'digitalSignature':
                $html     = '';
                $validB64 = preg_match("/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).base64,.*/", $v['value']);
                if ($validB64 > 0) {
                    $html .= '<img style="width:350px" src="' . $v['value'] . '" />';
                    return $html;
                }
                $img = wp_get_attachment_url($v['value']);
                $html .= '<img style="width:350px" src="' . esc_url($img) . '" />';
                return $html;
                break;
            case 'fileUpload':
                $images = explode(',', $v['value']);
                $html   = '';
                foreach ($images as $uId) {
                    $img = wp_get_attachment_url($uId);
                    $html .= '<img style="width:350px" src="' . esc_url($img) . '" /><br/>';
                }
                return $html;
                break;
            default:
                return esc_html($v['value']);
                break;
        }
        return $type;
    }

    /**
     * Creates an array with data combining field components and submitted information
     *
     * @return Array
     */
    private function _get_data()
    {
        $form = get_post($this->form_id);

        $components = get_post_meta($this->form_id, $this->slug . '_field_components', true);
        if ($components === null || $components === '' && $components !== null) {
            return esc_html__('Something went wrong.', 'kaliforms');
        }

        $components = json_decode($components);
        $arr        = [
            'publish_date' => [
                'caption' => __('Submission date', 'kaliforms'),
                'id'      => 'publish_date',
                'value'   => get_post_time('F j, Y - g:i a', false, $form, true),
            ],
        ];
        foreach ($components as $component) {
            $name = isset($component->properties->name) ? $component->properties->name : '';
            if (empty($name)) {
                continue;
            }

            $arr[$name] = [
                'caption' => isset($component->properties->caption) ? $component->properties->caption : $name,
                'id'      => $name,
                'value'   => get_post_meta($this->submission_id, $name, true),
            ];
        }
        $arr = array_filter($arr);

        return $arr;
    }

    /**
     * Computes the current hash ( from the backend ) <-- this is source of truth
     *
     * @return void
     */
    private function compute_hash()
    {
        $this->computed_hash = self::encode([
            'submission_id' => $this->submission_id,
            'form_id'       => $this->form_id,
        ]);
    }

    /**
     * Verify hash
     *
     * @return boolean
     */
    public function verify_hash()
    {
        return $this->hash === $this->computed_hash;
    }

    /**
     * Get the submission id
     *
     * @return void
     */
    public function get_submission_id()
    {
        if (!empty($_GET['submissionId'])) {
            $this->submission_id = wp_unslash($_GET['submissionId']);
        }
    }

    /**
     * Get the form id
     *
     * @return void
     */
    public function get_form_id()
    {
        if (!empty($_GET['formId'])) {
            $this->form_id = wp_unslash($_GET['formId']);
        }
    }

    /**
     * Get the form hash
     *
     * @return void
     */
    public function get_hash()
    {
        if (!empty($_GET['hash'])) {
            $this->hash = wp_unslash($_GET['hash']);
        }
    }

    /**
     * Encode an array of arguments into a md5 hash
     *
     * @param [type] $args
     * @return void
     */
    public static function encode($args)
    {
        $string = $args['submission_id'] . '*' . $args['form_id'] . '*' . AUTH_KEY;
        $string = md5($string);
        $string = strrev($string);
        return $string;
    }
}
