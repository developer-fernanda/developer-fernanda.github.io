<?php
namespace KaliForms\Inc\Utils\EmailUtilities;

class Mailgun_Helper
{
    /**
     * Protected URL for the Sendinblue_Helper
     *
     * @var string
     */
    protected $url = 'https://api.%smailgun.net/v3/%s/messages';
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
    protected $token = '';
    /**
     * Send a custom header
     *
     * @var string
     */
    protected $xmailer = '';

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
        $this->token   = $PHPMAILER->MailGun_Private_key;
        $this->domain  = $PHPMAILER->MailGun_Domain_Name;
        $this->region  = $PHPMAILER->MailGun_Region;
        $this->xmailer = $PHPMAILER->XMailer;
        $this->url     = sprintf($this->url, $this->region === 'us' ? '' : 'eu.', $this->domain);

        $recipients = $this->_get_recipients($PHPMAILER);

        $this->send_mail_obj = [
            'from'       => $this->_format_address($PHPMAILER->From, $PHPMAILER->FromName),
            'to'         => $this->_format_array_of_address($recipients['to']),
            'cc'         => $this->_format_array_of_address($recipients['cc']),
            'bcc'        => $this->_format_array_of_address($recipients['bcc']),
            'subject'    => $PHPMAILER->Subject,
            'text'       => $PHPMAILER->AltBody,
            'html'       => $PHPMAILER->Body,
            'attachment' => $this->get_attachments($PHPMAILER),
        ];

        $this->send_mail_obj = array_filter($this->send_mail_obj);
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
     * Get the recipients
     *
     * @param [type] $PHPMAILER
     * @return void
     */
    public function _get_recipients($PHPMAILER)
    {
        return [
            'to'  => array_filter($PHPMAILER->getToAddresses()),
            'cc'  => array_filter($PHPMAILER->getCcAddresses()),
            'bcc' => array_filter($PHPMAILER->getBccAddresses()),
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
        $i    = 1;
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

            $data[] = [
                'filePath' => $attachment[0],
                'type'     => $filetype,
                'filename' => empty($attachment[2]) ? 'file-' . wp_hash(microtime()) . '.' . $filetype : trim($attachment[2]),
            ];
            $i++;
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
        $WP_HTTP = new \WP_Http_Curl();

        if (isset($attachment)) {
            foreach ($this->send_mail_obj['attachment'] as $i => $attachment) {
                $this->send_mail_obj['attachment[' . ($i + 1) . ']'] =
                    curl_file_create($attachment['filePath'], $attachment['type'], $attachment['filename']);
            }
        }

        unset($this->send_mail_obj['attachment']);

        $response = $WP_HTTP->request(
            $this->url,
            [
                'method'     => 'POST',
                'stream'     => false,
                'decompress' => true,
                'filename'   => '',
                'headers'    => [
                    'User-Agent'    => $this->xmailer,
                    'Authorization' => 'Basic ' . base64_encode(sprintf('api:%s', $this->token)),
                    'Content-Type'  => 'multipart/form-data',
                ],
                'body'       => $this->send_mail_obj,
            ]
        );

        if (is_wp_error($response)) {
            throw new \Exception($response->get_error_message(), $response->get_error_code());
        }

        $data = json_decode(wp_remote_retrieve_body($response));
        if (!isset($data->id)) {
            throw new \Exception($data->message);
        };

        return true;
    }
}
