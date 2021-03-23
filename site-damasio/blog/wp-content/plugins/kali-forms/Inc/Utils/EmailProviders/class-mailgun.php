<?php

namespace KaliForms\Inc\Utils\EmailProviders;

use KaliForms\Inc\Utils\EmailProviders\Sender;

class Mailgun extends Sender
{
    public function __construct()
    {
        parent::__construct();
        $this->get_options();
        $this->provider = 'mailgun';
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
            'mailgun_domain_name' => get_option($this->slug . '_mailgun_domain_name', ''),
            'mailgun_private_key' => get_option($this->slug . '_mailgun_private_key', ''),
            'mailgun_region'      => get_option($this->slug . '_mailgun_region', ''),
        ], $this->options);
    }
    /**
     * After prep stuff
     *
     * @return void
     */
    protected function _after_prep()
    {
        $this->mailer->Mailer              = $this->provider;
        $this->mailer->MailGun_Private_key = $this->options['mailgun_private_key'];
        $this->mailer->MailGun_Domain_Name = $this->options['mailgun_domain_name'];
        $this->mailer->MailGun_Region      = $this->options['mailgun_region'];
    }
}
