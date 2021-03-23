<?php
namespace KaliForms\Inc\Utils;

if (!defined('ABSPATH')) {
    exit;
}
use KaliForms\Inc\Frontend\Submission_Shortcode;

class Submission_Action_Helper
{
    /**
     * Form post
     *
     * @var [type]
     */
    public $form = null;
    /**
     * Submission post
     *
     * @var [type]
     */
    public $submission = null;
    /**
     * Hash
     *
     * @var [type]
     */
    public $hash = null;
    /**
     * Placeholders
     *
     * @var array
     */
    public $placeholders = [];
    /**
     * Parent plugin slug
     *
     * @var string
     */
    public $slug = 'kaliforms';
    /**
     * Class constructor
     *
     * @param [type] $formId
     * @param [type] $submissionId
     */
    public function __construct($formId, $submissionId)
    {
        $this->form       = $formId;
        $this->submission = $submissionId;

        if ($this->form === null || $this->submission === null) {
            return new \WP_Error();
        }
    }
    /**
     * Adds the hash to the class constructor
     *
     * @param [type] $string
     * @return void
     */
    public function add_hash($string)
    {
        $this->hash = $string;
    }
    /**
     * Shortcut for get_post_meta
     *
     * @param string $key
     * @param mixed  $default
     *
     * @return mixed
     */
    public function get($entity = 'form', $key = '', $default = null)
    {
        $value = get_post_meta($this->{$entity}, $this->slug . '_' . $key, true);
        if ($value === null || $value === '' && $default !== null) {
            return $default;
        }

        return $value;
    }
    /**
     * Delets a submission from the database
     *
     * @return void
     */
    public function delete_submission()
    {
        $computedHash = $this->submission . '*' . $this->form . '*' . AUTH_KEY;
        $computedHash = md5($computedHash);
        $computedHash = strrev($computedHash);

        if ($computedHash !== $this->hash) {
            return new \WP_Error();
        }

        $delete = wp_delete_post($this->submission, true);
        if ($delete === null && $delete === false) {
            return new \WP_Error();

        }

        return 'ok';
    }
    /**
     * resends emails for a certain submission
     *
     * @return void
     */
    public function send_emails()
    {
        $emailer = new Emailer($this->form);
        $emailer->attach_submission($this->submission);
        return $emailer->send();
    }

    /**
     * Returns a submission link
     *
     * @param [string] $baseUrl
     * @param [number] $submissionId
     * @param [number] $formId
     * @param [bool]   $asAnchor
     * @return void
     */
    public static function get_submission_link($baseUrl, $submissionId, $formId, $asAnchor = false)
    {
        if (!$baseUrl) {
            $baseUrl = get_post_meta($formId, 'kaliforms_submission_view_page', true);
            if ($baseUrl === null || $baseUrl === '') {
                $baseUrl = get_bloginfo('url');
            }
            $baseUrl = get_permalink($baseUrl);
        }

        if (!$baseUrl) {
            return __('Please configure a submission view page', 'kaliforms');
        }

        $glue   = strpos($baseUrl, '?') > -1 ? '&' : '?';
        $string = $baseUrl . $glue . http_build_query([
            'submissionId' => $submissionId,
            'formId'       => $formId,
            'hash'         => Submission_Shortcode::encode([
                'submission_id' => $submissionId,
                'form_id'       => $formId,
            ]),
        ]);

        return $asAnchor ? self::get_anchor($string) : $string;
    }

    /**
     * Returns an anchor for the submission link
     *
     * @param [type] $url
     * @return void
     */
    public static function get_anchor($url)
    {
        return '<a target="_blank" href="' . $url . '">' . esc_html__('Submission', 'kaliforms') . '</a>';
    }
}
