<?php

namespace KaliForms\Inc\Utils\EmailProviders;

use KaliForms\Inc\Utils\EmailUtilities\Mailer;
use KaliForms\Inc\Utils\EmailUtilities\Mailer_V6;

abstract class Sender
{
    /**
     * Plugin slug
     *
     * @var string
     */
    public $slug = 'kaliforms';
    /**
     * Provider
     *
     * @var string
     */
    public $provider = '';
    /**
     * Content body
     *
     * @var string
     */
    public $body = '';
    /**
     * Attachments
     *
     * @var array
     */
    public $attachments = [];
    /**
     * To field
     *
     * @var string
     */
    public $to = [];
    /**
     * From email field
     *
     * @var string
     */
    public $from = '';
    /**
     * From name field
     *
     * @var string
     */
    public $fromName = '';
    /**
     * Reply to
     *
     * @var string
     */
    public $replyTo = [];
    /**
     * Subject
     *
     * @var string
     */
    public $subject = '';
    /**
     * CC field
     *
     * @var string
     */
    public $cc = [];
    /**
     * Bcc field
     *
     * @var string
     */
    public $bcc = [];
    /**
     * Options from database
     *
     * @var array
     */
    public $options = [];
    /**
     * Errors
     *
     * @var array
     */
    public $errors = [];
    /**
     * Mailer
     *
     * @var [type]
     */
    public $mailer = null;
    /**
     * Class constructor
     *
     * @param [type] $provider
     */
    public function __construct()
    {
        $this->mailer = $this->generate_mailer();
    }
    /**
     * Generate mailer function
     *
     * @return void
     */
    public function generate_mailer()
    {
        $mailer = version_compare(get_bloginfo('version'), '5.5-alpha', '<') ? $this->_load_legacy() : $this->_load();
        return $mailer;
    }
    /**
     * Load legacy mailer
     *
     * @return void
     */
    private function _load_legacy()
    {
        if (!class_exists('\PHPMailer', false)) {
            require_once ABSPATH . WPINC . '/class-phpmailer.php';
        }

        return new Mailer(true);
    }
    /**
     * Load the new php mailer library
     *
     * @return void
     */
    private function _load()
    {
        if (!class_exists('\PHPMailer\PHPMailer\PHPMailer', false)) {
            require_once ABSPATH . WPINC . '/PHPMailer/PHPMailer.php';
        }

        if (!class_exists('\PHPMailer\PHPMailer\Exception', false)) {
            require_once ABSPATH . WPINC . '/PHPMailer/Exception.php';
        }

        if (!class_exists('\PHPMailer\PHPMailer\SMTP', false)) {
            require_once ABSPATH . WPINC . '/PHPMailer/SMTP.php';
        }

        return new Mailer_V6(true);
    }
    /**
     * Get options
     *
     * @return void
     */
    public function get_options()
    {
        $this->options = array_merge(
            [
                'return_path' => get_option($this->slug . '_return_path', ''),
            ],
            $this->options
        );
    }
    /**
     * Sets properties
     *
     * @param [type] $property
     * @param [type] $value
     * @return void
     */
    public function set_property($property, $value)
    {
        $this->{$property} = $value;
    }
    /**
     * Set properties
     *
     * @param [type] $arr
     * @return void
     */
    public function set_properties($arr)
    {
        foreach ($arr as $k => $v) {
            if (is_array($v) && empty(array_filter($v))) {
                continue;
            }

            $this->{$k} = $v;
        }
    }
    /**
     * Send function
     *
     * @return void
     */
    public function send()
    {
        try {
            $this->_prep_mailer();
            $this->_after_prep();
        } catch (\Exception $e) {
            $error_data['phpmailer_exception_code'] = $e->getCode();
            do_action('kali_mail_failed', new \WP_Error('kali_mail_failed', $e->getMessage(), $error_data));
            return false;
        }

        $status = $this->mailer->send();
        if ($status) {
            $args = implode(',', $this->to) . ' - ' . $this->subject;
            do_action('kali_mail_success', $args);
        }
        return $status;
    }
    /**
     * Sets stuff if needed
     *
     * @return void
     */
    protected function _after_prep()
    {
    }
    /**
     * Prep the mailer client
     *
     * @return void
     */
    protected function _prep_mailer()
    {
        $this->mailer->isHTML(true);
        $this->mailer->setFrom($this->from, wp_specialchars_decode($this->fromName));
        if (!empty($this->options['return_path'])) {
            $this->mailer->Sender = $this->options['return_path'];
        }

        foreach ($this->to as $recipient) {
            $this->mailer->addAddress($recipient);
        }

        foreach ($this->replyTo as $recipient) {
            $this->mailer->addReplyTo($recipient);
        }

        foreach ($this->cc as $recipient) {
            $this->mailer->addCC($recipient);
        }

        foreach ($this->bcc as $recipient) {
            $this->mailer->addBCC($recipient);
        }

        foreach ($this->attachments as $attachment) {
            $this->mailer->addAttachment($attachment);
        }
        $this->mailer->CharSet  = 'UTF-8';
        $this->mailer->Subject  = wp_specialchars_decode($this->subject);
        $this->mailer->Body     = $this->body;
        $this->mailer->AltBody  = wp_strip_all_tags($this->body);
    }
}
