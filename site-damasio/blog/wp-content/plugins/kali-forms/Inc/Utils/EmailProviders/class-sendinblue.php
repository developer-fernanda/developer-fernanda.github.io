<?php

namespace KaliForms\Inc\Utils\EmailProviders;

use KaliForms\Inc\Utils\EmailProviders\Sender;

class Sendinblue extends Sender
{
    public function __construct()
    {
        parent::__construct();
        $this->get_options();
        $this->provider = 'sendinblue';
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
            'sendin_blue_api' => get_option($this->slug . '_sendin_blue_api', ''),
        ], $this->options);
    }
    /**
     * After prep stuff
     *
     * @return void
     */
    protected function _after_prep()
    {
        $this->mailer->Mailer             = $this->provider;
        $this->mailer->Sendinblue_Api_Key = $this->options['sendin_blue_api'];
    }
}
