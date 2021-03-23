<?php
namespace KaliForms\Inc\Utils;

if (!defined('ABSPATH')) {
    exit;
}
use KaliForms\Inc\Utils\Submission_Action_Helper as Action_Helper;

class Submission_Actions
{
    /**
     * Plugin slug
     *
     * @var string
     */
    protected $slug = 'kaliforms';
    /**
     * Keeps the current post
     *
     * @var WP_POST
     */
    protected $post = null;
    /**
     * Class constructor
     */
    public function __construct()
    {
        add_action('wp_ajax_kaliforms_resend_emails', [$this, 'resend_emails']);
        add_action('wp_ajax_nopriv_kaliforms_resend_emails', [$this, 'denied']);

        add_action('wp_ajax_kaliforms_delete_submission', [$this, 'delete_submission']);
        add_action('wp_ajax_nopriv_kaliforms_delete_submission', [$this, 'delete_submission']);
    }

    /**
     * If the user is not authorized, deny action
     */
    public function denied()
    {
        wp_die(esc_html__('Denied', 'kaliforms'));
    }

    /**
     * Creates an array with data combining field components and submitted information
     *
     * @return Array
     */
    private function _get_data($id)
    {
        $form       = get_post($id);
        $components = get_post_meta($id, $this->parent_slug . '_field_components', true);
        if ($components === null || $components === '' && $components !== null) {
            return esc_html__('Something went wrong.', 'kaliforms');
        }

        $components = json_decode($components);
        $arr        = [];
        foreach ($components as $component) {
            if (in_array($component->id, ['freeText', 'divider', 'fileUpload', 'pageBreak', 'smartTextOutput'])) {
                continue;
            }

            $name = isset($component->properties->name) ? $component->properties->name : '';
            if (empty($name)) {
                continue;
            }

            $arr[] = [
                'caption' => isset($component->properties->caption) ? $component->properties->caption : $name,
                'id'      => $name,
            ];
        }

        $arr = array_filter($arr);
        return $arr;
    }

    /**
     * Resend emails for the current form & submission
     *
     * @return void
     */
    public function resend_emails()
    {
        $args = $this->sanitize_post();
        if (!$args) {
            wp_die(esc_html__('Denied', 'kaliforms'));
        }
        if (!isset($args['formId'])) {
            wp_die(esc_html__('Something went wrong', 'kaliforms'));
        }
        if (!isset($args['submissionId'])) {
            wp_die(esc_html__('Something went wrong', 'kaliforms'));
        }

        $actionHelper = new Action_Helper($args['formId'], $args['submissionId']);
        wp_die(
            is_wp_error($actionHelper) ? esc_html__('Something went wrong', 'kaliforms') : $actionHelper->send_emails()
        );
    }

    /**
     * Anonimize current submission
     *
     * @return void
     */
    public function delete_submission()
    {
        $args = $this->sanitize_post();
        if (!$args) {
            wp_die(esc_html__('Denied', 'kaliforms'));
        }
        $actionHelper = new Action_Helper($args['formId'], $args['submissionId']);
        $actionHelper->add_hash($args['hash']);
        wp_die(
            is_wp_error($actionHelper) ? esc_html__('Something went wrong', 'kaliforms') : $actionHelper->delete_submission()
        );

    }

    /**
     * Run security check and return args
     *
     * @return void
     */
    private function sanitize_post()
    {
        if (!isset($_POST['args'])) {
            return false;
        }
        if (!isset($_POST['args'], $_POST['args']['nonce'])) {
            return false;
        }
        if (!wp_verify_nonce(sanitize_key(wp_unslash($_POST['args']['nonce'])), 'kaliforms_nonce')) {
            return false;
        }

        return stripslashes_deep($_POST['args']);
    }
}
