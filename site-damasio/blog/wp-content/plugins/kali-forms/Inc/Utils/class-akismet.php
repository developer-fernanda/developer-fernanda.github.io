<?php

namespace KaliForms\Inc\Utils;

define('KALIFORMS_AKISMET_URL', 'https://%s.rest.akismet.com/1.1/comment-check');
/**
 * Akismet Class
 */
class Akismet
{
    /**
     * Url
     *
     * @var string
     */
    public $url = '';
    /**
     * Form id
     *
     * @var [int]
     */
    public $formId = null;
    /**
     * Form data
     *
     * @var array
     */
    public $formData = [];
    /**
     * Class constructor
     *
     * @param [string] $key
     * @param [array] $data
     * @param [array] $akismet_fields
     */
    public function __construct($key, $data, $akismet_fields)
    {
        $this->url      = sprintf(KALIFORMS_AKISMET_URL, $key);
        $this->formId   = $data['formId'];
        $this->formData = $data['data'];
        $this->fields   = $akismet_fields;
    }
    /**
     * Returns the field value
     *
     * @param [string] $key
     * @param [string] $default
     * @return string
     */
    public function get_field_value($key, $default)
    {
        if (!isset($this->formData[$this->fields->{$key}])) {
            return $default;
        }

        if (empty($this->formData[$this->fields->{$key}])) {
            return $default;
        }

        return $this->formData[$this->fields->{$key}];
    }
    /**
     * Run checks
     *
     * @return void
     */
    public function check()
    {
        $check_arr = [
            'blog'                 => get_site_url(),
            'user_ip'              => $this->formData['ip_address'],
            'user_agent'           => $_SERVER['HTTP_USER_AGENT'],
            'referrer'             => $_SERVER['HTTP_REFERER'],
            'permalink'            => $_SERVER['HTTP_REFERER'],
            'comment_type'         => 'contact-form',
            'comment_author'       => $this->get_field_value('firstName', '') . ' ' . $this->get_field_value('lastName', ''),
            'comment_author_email' => $this->get_field_value('email', ''),
            'comment_content'      => $this->get_field_value('message', ''),
            'is_test'              => true,
        ];

        $response = wp_remote_post(
            $this->url,
            [
                'body' => $check_arr,
            ]
        );

        if (is_wp_error($response)) {
            return [
                'response' => '',
                'success'  => false,
                'message'  => esc_html__('Something went wrong', 'kaliforms'),
            ];
        };

        return [
            'response' => json_decode($response['body']),
        ];
    }
}
