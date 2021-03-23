<?php

namespace KaliForms\Inc\Utils\EmailUtilities;

if (!class_exists('PHPMailer', false)) {
    require_once ABSPATH . WPINC . '/class-phpmailer.php';
}
use \Exception as Exception;

class Mailer extends \PHPMailer
{
    /**
     * Plugin slug
     *
     * @var string
     */
    public $slug = 'kaliforms';
    /**
     * Send function
     *
     * @return void
     */
    public function send()
    {
        $this->XMailer = 'KaliForms/Mailer_V6/' . $this->Mailer . '/' . KALIFORMS_VERSION;

        return in_array($this->Mailer, ['mail', 'smtp'])
        ? $this->default_send()
        : $this->send_custom();
    }
    /**
     * Send a custom email
     *
     * @return void
     */
    public function send_custom()
    {
        $mailer = null;
        switch ($this->Mailer) {
            case 'smtpcom':
                $mailer = new SMTPCom_Helper();
                break;
            case 'sendinblue':
                $mailer = new Sendinblue_Helper();
                break;
            case 'mailgun':
                $mailer = new Mailgun_Helper();
                break;
            case 'postmark':
                $mailer = new Postmark_Helper();
                break;
        }

        try {
            $this->preSend();
            $mailer->set_data($this);

            return $mailer->send();
        } catch (Exception $exc) {
            $this->mailHeader = '';
            $this->setError($exc->getMessage());
            $error_data['phpmailer_exception_code'] = $exc->getCode();
            do_action('kali_mail_failed', new \WP_Error('kali_mail_failed', $exc->getMessage(), $error_data));
            return false;

        }

    }
    /**
     * Default send scenario
     *
     * @return void
     */
    public function default_send()
    {
        try {
            if (!$this->preSend()) {
                return false;
            }
            return $this->postSend();
        } catch (Exception $exc) {
            $this->mailHeader = '';
            $this->setError($exc->getMessage());
            $error_data['phpmailer_exception_code'] = $exc->getCode();
            do_action('kali_mail_failed', new \WP_Error('kali_mail_failed', $exc->getMessage(), $error_data));
            return false;
        }
    }
}
