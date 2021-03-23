<?php

namespace KaliForms\Inc\Utils\EmailProviders;

class SMTP extends Sender
{
    /**
     * Class constructor
     */
    public function __construct()
    {
        $this->mailer = $this->generate_mailer();
        $this->get_options();
        $this->provider = 'smtp';
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
            'auth'            => absint(get_option($this->slug . '_smtp_auth', 0)),
            'host'            => get_option($this->slug . '_smtp_host', ''),
            'port'            => get_option($this->slug . '_smtp_port', ''),
            'secure'          => get_option($this->slug . '_smtp_secure', 'none'),
            'username'        => get_option($this->slug . '_smtp_username', ''),
            'password'        => get_option($this->slug . '_smtp_password', ''),
            'disable_autotls' => absint(get_option($this->slug . '_smtp_disable_autotls', 0)),
        ], $this->options);

        $this->options['secure'] = $this->options['secure'] === 'none' ? '' : strtolower($this->options['secure']);

        if (empty($this->options['host'])) {
            $this->errors[] = __('No host configured in settings', 'kaliforms');
        }
        if (empty($this->options['port'])) {
            $this->errors[] = __('No port configured in settings', 'kaliforms');
        }
    }

    /**
     * Prep the mailer
     *
     * @return void
     */
    protected function _prep_mailer()
    {
        parent::_prep_mailer();
        $this->mailer->isSMTP();
        $this->mailer->SMTPDebug = 0;
		$this->mailer->Host      = $this->options['host'];
		
        if ($this->options['auth'] === 1) {
            $this->mailer->SMTPAuth = true;
            $this->mailer->Username = $this->options['username'];
            $this->mailer->Password = $this->options['password'];
        }

        $this->mailer->SMTPSecure  = $this->options['secure'];
        $this->mailer->SMTPAutoTLS = $this->options['disable_autotls'] === 1 ? true : false;
        $this->mailer->Port        = absint($this->options['port']);
    }
}
