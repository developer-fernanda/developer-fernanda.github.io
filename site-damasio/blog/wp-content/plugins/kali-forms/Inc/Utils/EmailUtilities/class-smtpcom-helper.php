<?php
namespace KaliForms\Inc\Utils\EmailUtilities;

class SMTPCom_Helper
{
    /**
     * Protected URL for the SMTPCom_Trait
     *
     * @var string
     */
    protected $url = 'https://api.smtp.com/v4/messages';
    /**
     * The send mail object
     *
     * @var array
     */
    protected $send_mail_obj = [];
    /**
     * Token or api key
     *
     * @var string
     */
    protected $token = '';
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
        $this->token                    = $PHPMAILER->SMTPCOM_Api_Key;
        $this->send_mail_obj['channel'] = $PHPMAILER->SMTPCOM_Channel;
        $arr                            = [
            'to'  => [],
            'cc'  => [],
            'bcc' => [],
        ];

        $to      = array_filter($PHPMAILER->getToAddresses());
        $cc      = array_filter($PHPMAILER->getCcAddresses());
        $bcc     = array_filter($PHPMAILER->getBccAddresses());
        $replyTo = array_filter($PHPMAILER->getReplyToAddresses());

        foreach ($to as $toField) {
            if (empty($toField)) {
                continue;
            }
            $arr['to'][] = ['address' => $toField[0]];
        }
        foreach ($cc as $ccField) {
            if (empty($ccField)) {
                continue;
            }
            $arr['cc'][] = ['address' => $ccField[0]];
        }
        foreach ($bcc as $bccField) {
            if (empty($bccField)) {
                continue;
            }
            $arr['bcc'][] = ['address' => $bccField[0]];
        }
        $this->send_mail_obj['subject']    = $PHPMAILER->Subject;
        $this->send_mail_obj['recipients'] = $arr;
        $this->send_mail_obj['originator'] = [
            'from' => [
                'name'    => $PHPMAILER->FromName,
                'address' => $PHPMAILER->From,
            ],
        ];

        if (!empty($replyTo)) {
            $this->send_mail_obj['originator'][] = [
                'reply_to' => $this->_format_array_of_address($replyTo),
            ];
        };

        $this->send_mail_obj['body'] = $this->get_content($PHPMAILER);
    }

    /**
     * Get content
     *
     * @param [type] $PHPMAILER
     * @return void
     */
    public function get_content($PHPMAILER)
    {
        $parts = [];
        if (!empty($PHPMAILER->AltBody)) {
            $parts[] = [
                'type'     => 'text/plain',
                'charset'  => $PHPMAILER->CharSet,
                'encoding' => $PHPMAILER->Encoding,
                'content'  => $PHPMAILER->AltBody,
            ];
        }
        $parts[] = [
            'type'     => 'text/html',
            'charset'  => $PHPMAILER->CharSet,
            'encoding' => $PHPMAILER->Encoding,
            'content'  => $PHPMAILER->Body,
        ];
        return [
            'parts'       => $parts,
            'attachments' => $this->get_attachments($PHPMAILER),

        ];
    }

    /**
     * Get and format attachments as per specs
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
                    $file = file_get_contents($attachment[0]);
                }
            } catch (\Exception $e) {
                $file = false;
            }

            if ($file === false) {
                continue;
            }

            $filetype = str_replace(';', '', trim($attachment[4]));

            $data[] = array(
                'content'     => base64_encode($file),
                'type'        => $filetype,
                'encoding'    => 'base64',
                'filename'    => empty($attachment[2]) ? 'file-' . wp_hash(microtime()) . '.' . $filetype : trim($attachment[2]),
                'disposition' => in_array($attachment[6], array('inline', 'attachment'), true) ? $attachment[6] : 'attachment',
                'cid'         => empty($attachment[7]) ? '' : trim((string) $attachment[7]),
            );
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
                    'Authorization' => 'Bearer ' . $this->token,
                    'Accept'        => 'application/json',
                    'content-type'  => 'application/json',
                ],
                'body'    => json_encode($this->send_mail_obj),
            ]
        );

        if (is_wp_error($response)) {
            throw new \Exception($response->get_error_message(), $response->get_error_code());
        }

        $data = json_decode(wp_remote_retrieve_body($response));
        if ($data->status === 'fail') {
            $error_text = [];
            foreach ($data->data as $error_key => $error_message) {
                $error_text[] = $error_key . ' - ' . $error_message;
            }

            throw new \Exception(implode(',', $error_text));
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
            $ret_array[] = $this->_format_address($address[0]);
        }

        return implode(',', $ret_array);
    }
}
