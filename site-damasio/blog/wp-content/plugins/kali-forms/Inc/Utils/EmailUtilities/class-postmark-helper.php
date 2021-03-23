<?php
namespace KaliForms\Inc\Utils\EmailUtilities;

class Postmark_Helper
{
    /**
     * Protected URL for the Sendinblue_Helper
     *
     * @var string
     */
    protected $url = 'https://api.postmarkapp.com/email';
    /**
     * The send mail object
     *
     * @var array
     */
    protected $send_mail_obj = [];
    /**
     * $token (api key)
     *
     * @var string
     */
    protected $token                = '';
    protected $forbidden_attach_ext = ['vbs', 'exe', 'bin', 'bat', 'chm', 'com', 'cpl', 'crt', 'hlp', 'hta', 'inf', 'ins', 'isp', 'jse', 'lnk', 'mdb', 'pcd', 'pif', 'reg', 'scr', 'sct', 'shs', 'vbe', 'vba', 'wsf', 'wsh', 'wsl', 'msc', 'msi', 'msp', 'mst'];

    /**
     * Class constructor
     */
    public function __construct()
    {
    }
    /**
     * Send the actual email
     *
     * @return void
     */
    public function send()
    {
        if (empty($this->token)) {
            throw new \Exception(__('No Api Key configured', 'kaliforms'));
        }
        return $this->make_request();
    }
    /**
     * Set user data
     *
     * @return void
     */
    public function set_data($PHPMAILER)
    {
        $this->token = $PHPMAILER->Postmark_Api_Key;
        $recipients  = $this->_get_recipients($PHPMAILER);

        if (!empty($recipients['ReplyTo'])) {
            $this->send_mail_obj['ReplyTo'] = $this->_format_array_of_address($recipients['ReplyTo']);
        };

        $this->send_mail_obj['To']            = $this->_format_array_of_address($recipients['To']);
        $this->send_mail_obj['Cc']            = $this->_format_array_of_address($recipients['Cc']);
        $this->send_mail_obj['Bcc']           = $this->_format_array_of_address($recipients['Bcc']);
        $this->send_mail_obj['From']          = $this->_format_address($PHPMAILER->From, $PHPMAILER->FromName);
        $this->send_mail_obj['Subject']       = $PHPMAILER->Subject;
        $this->send_mail_obj['HtmlBody']      = $PHPMAILER->Body;
        $this->send_mail_obj['TextBody']      = $PHPMAILER->AltBody;
        $this->send_mail_obj['MessageStream'] = 'outbound';
        $this->send_mail_obj['Attachments']   = $this->get_attachments($PHPMAILER);

        $this->send_mail_obj = array_filter($this->send_mail_obj);
    }
    /**
     * Format the address as we need it
     *
     * @param string $email
     * @param string $name
     * @return string
     */
    private function _format_address($email = '', $name = '')
    {
        return empty($name) ? sprintf('<%s>', $email) : sprintf('%s<%s>', $name, $email);
    }
    /**
     * Formats an array of addresses
     *
     * @param [type] $arr
     * @return string
     */
    public function _format_array_of_address($arr)
    {
        $ret_array = [];

        foreach ($arr as $address) {
            if (empty($address)) {
                continue;
            }
            $ret_array[] = $this->_format_address($address[0]);
        }

        return implode(',', $ret_array);
    }
    /**
     * Get the recipients
     *
     * @param [type] $PHPMAILER
     * @return void
     */
    public function _get_recipients($PHPMAILER)
    {
        return [
            'To'      => array_filter($PHPMAILER->getToAddresses()),
            'Cc'      => array_filter($PHPMAILER->getCcAddresses()),
            'Bcc'     => array_filter($PHPMAILER->getBccAddresses()),
            'ReplyTo' => array_filter($PHPMAILER->getReplyToAddresses()),
        ];
    }
    /**
     * Get attachments
     *
     * @param [type] $PHPMAILER
     * @return void
     */
    public function get_attachments($PHPMAILER)
    {
        $attachments = $PHPMAILER->getAttachments();
        if (empty($attachments)) {
            return [];
        }

        $data = [];
        foreach ($attachments as $attachment) {
            $file = false;
            $mime = 'text/plain';
            try {
                if (is_file($attachment[0]) && is_readable($attachment[0])) {
                    $ext  = pathinfo($attachment[0], PATHINFO_EXTENSION);
                    $mime = mime_content_type($attachment[0]);

                    if (!in_array($ext, $this->forbidden_attach_ext, true)) {
                        $file = file_get_contents($attachment[0]);
                    }
                }
            } catch (\Exception $e) {
                $file = false;
            }

            if ($file === false) {
                continue;
            }

            $data[] = [
                'Name'        => $attachment[2],
                'Content'     => base64_encode($file),
                'ContentType' => $mime,
            ];
        }
        return $data;
    }

    /**
     * Send request
     *
     * @return void
     */
    public function make_request()
    {
        $response = wp_remote_post(
            $this->url,
            [
                'headers' => [
                    'X-Postmark-Server-Token' => $this->token,
                    'content-type'            => 'application/json',
                    'accept'                  => 'application/json',
                ],
                'body'    => json_encode($this->send_mail_obj),
            ]
        );

        if (is_wp_error($response)) {
            throw new \Exception($response->get_error_message(), $response->get_error_code());
        }

        $data = json_decode(wp_remote_retrieve_body($response));
        if ($data->ErrorCode > 0) {
            throw new \Exception($data->ErrorCode . ' ' . $data->Message);
        };

        return true;
    }
}
