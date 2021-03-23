<?php
namespace KaliForms\Inc\Utils\EmailUtilities;

class Sendinblue_Helper
{
    /**
     * Protected URL for the Sendinblue_Helper
     *
     * @var string
     */
    protected $url = 'https://api.sendinblue.com/v3/smtp/email';
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
    protected $token              = '';
    protected $allowed_attach_ext = ['xlsx', 'xls', 'ods', 'docx', 'docm', 'doc', 'csv', 'pdf', 'txt', 'gif', 'jpg', 'jpeg', 'png', 'tif', 'tiff', 'rtf', 'bmp', 'cgm', 'css', 'shtml', 'html', 'htm', 'zip', 'xml', 'ppt', 'pptx', 'tar', 'ez', 'ics', 'mobi', 'msg', 'pub', 'eps', 'odt', 'mp3', 'm4a', 'm4v', 'wma', 'ogg', 'flac', 'wav', 'aif', 'aifc', 'aiff', 'mp4', 'mov', 'avi', 'mkv', 'mpeg', 'mpg', 'wmv'];
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
        $this->token = $PHPMAILER->Sendinblue_Api_Key;
        $recipients  = $this->_get_recipients($PHPMAILER);

        foreach ($recipients['to'] as $toField) {
            if (empty($toField)) {
                continue;
            }
            $this->send_mail_obj['to'][] = ['email' => $toField[0]];
        }
        foreach ($recipients['cc'] as $ccField) {
            if (empty($ccField)) {
                continue;
            }
            $this->send_mail_obj['cc'][] = ['email' => $ccField[0]];
        }
        foreach ($recipients['bcc'] as $bccField) {
            if (empty($bccField)) {
                continue;
            }
            $this->send_mail_obj['bcc'][] = ['email' => $bccField[0]];
        }

        $this->send_mail_obj['sender'] = [
            'name'  => $PHPMAILER->FromName,
            'email' => $PHPMAILER->From,
        ];

        if (!empty($recipients['replyTo'])) {
            $this->send_mail_obj['replyTo'] = [
                'email' => $this->_format_array_of_address($recipients['replyTo']),
            ];
        };
        $this->send_mail_obj['subject']     = $PHPMAILER->Subject;
        $this->send_mail_obj['htmlContent'] = $PHPMAILER->Body;
        $this->send_mail_obj['textContent'] = $PHPMAILER->AltBody;
        $this->send_mail_obj['attachment']  = $this->get_attachments($PHPMAILER);
        $this->send_mail_obj                = array_filter($this->send_mail_obj);
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
            'to'      => array_filter($PHPMAILER->getToAddresses()),
            'cc'      => array_filter($PHPMAILER->getCcAddresses()),
            'bcc'     => array_filter($PHPMAILER->getBccAddresses()),
            'replyTo' => array_filter($PHPMAILER->getReplyToAddresses()),
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

            try {
                if (is_file($attachment[0]) && is_readable($attachment[0])) {
                    $ext = pathinfo($attachment[0], PATHINFO_EXTENSION);

                    if (in_array($ext, $this->allowed_attach_ext, true)) {
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
                'name'    => $attachment[2],
                'content' => base64_encode($file),
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
                    'api-key'      => $this->token,
                    'content-type' => 'application/json',
                ],
                'body'    => json_encode($this->send_mail_obj),
            ]
        );

        if (is_wp_error($response)) {
            throw new \Exception($response->get_error_message(), $response->get_error_code());
        }

        $data = json_decode(wp_remote_retrieve_body($response));
        if (!isset($data->messageId)) {
            throw new \Exception($data->code . ' ' . $data->message);
        };

        return true;
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
            $ret_array[] = $address[0];
        }

        return $ret_array[0];
    }
}
