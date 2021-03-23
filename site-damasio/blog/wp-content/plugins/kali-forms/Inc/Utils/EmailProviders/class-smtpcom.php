<?php

namespace KaliForms\Inc\Utils\EmailProviders;

use KaliForms\Inc\Utils\EmailProviders\Sender;

class SMTPCom extends Sender
{

    /**
     * Class constructor
     */
    public function __construct()
    {
        parent::__construct();
        $this->get_options();
        $this->provider = 'smtpcom';
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
     * Sets the options in the class
     *
     * @return void
     */
    public function get_options()
    {
        parent::get_options();
        $this->options = array_merge([
            'smptcom_api_key' => get_option($this->slug . '_smtp_com_api_key', ''),
            'channel'         => get_option($this->slug . '_smtp_com_sender_name', ''),
        ], $this->options);
    }
    /**
     * After prep stuff
     *
     * @return void
     */
    protected function _after_prep()
    {
        $this->mailer->Mailer          = $this->provider;
        $this->mailer->SMTPCOM_Channel = $this->options['channel'];
        $this->mailer->SMTPCOM_Api_Key = $this->options['smptcom_api_key'];
    }
}
