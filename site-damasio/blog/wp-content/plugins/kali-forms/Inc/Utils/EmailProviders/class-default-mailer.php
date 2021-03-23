<?php

namespace KaliForms\Inc\Utils\EmailProviders;

use KaliForms\Inc\Utils\EmailProviders\Sender;

class Default_Mailer extends Sender
{
    public function __construct()
    {
        parent::__construct();
        $this->provider = 'default';
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
        $this->mailer->isMail();
    }
}
