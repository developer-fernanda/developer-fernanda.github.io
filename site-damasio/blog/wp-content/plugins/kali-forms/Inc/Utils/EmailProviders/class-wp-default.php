<?php

namespace KaliForms\Inc\Utils\EmailProviders;

use KaliForms\Inc\Utils\EmailProviders\Sender;

class WP_Default extends Sender
{
    public function __construct()
    {
        parent::__construct();
        $this->provider = 'wp';
    }

    /**
     * Get instance class
     *
     * @return void
     */
    public static function get_instance()
    {
        static $inst;
        if (!$inst) {
            $inst = new self();
        }

        return $inst;
    }

    /**
     * Prep the mailer
     *
     * @return void
     */
    protected function _prep_mailer()
    {
        parent::_prep_mailer();
    }

    /**
     * Status
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
        $status = wp_mail(
            implode(',', $this->to),
            wp_specialchars_decode($this->subject),
            $this->body,
            $this->_get_headers(),
            $this->attachments
        );
        if ($status) {
            $args = implode(',', $this->to) . ' - ' . $this->subject;
            do_action('kali_mail_success', $args);
        }

        return $status;
    }

    /**
     * Get email headers
     *
     * @param [type] $props
     * @return void
     */
    protected function _get_headers()
    {
        $headers   = [];
        $headers[] = "Content-Type: text/html; charset=UTF-8;";
        $headers[] = "From: {$this->fromName} <{$this->from}>";
        if (!empty($this->cc)) {
            foreach ($this->cc as $email) {
                $headers[] = 'CC: ' . $email;
            }
        }
        if (!empty($this->bcc)) {
            foreach ($this->bcc as $email) {
                $headers[] = 'BCC: ' . $email;
            }
        }
        if (!empty($this->replyTo)) {
            foreach ($this->replyTo as $email) {
                $headers[] = 'Reply-to: ' . $email;
            }
        }
        return $headers;
    }
}
