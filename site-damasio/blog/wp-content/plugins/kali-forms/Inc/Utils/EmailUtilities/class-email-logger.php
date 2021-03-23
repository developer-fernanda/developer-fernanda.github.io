<?php

namespace KaliForms\Inc\Utils\EmailUtilities;

/**
 * Email logger
 */
class Email_Logger
{
    /**
     * Plugin slug
     *
     * @var string
     */
    public $slug = 'kaliforms';
    /**
     * Filename
     *
     * @var string
     */
    public $filename = '';
    /**
     * Path
     *
     * @var string
     */
    public $path = '';
    /**
     * Is it enabled
     *
     * @var boolean
     */
    public $enabled = false;
    /**
     * Class constructor
     */
    public function __construct()
    {
        $this->enabled = get_option($this->slug . '_email_log', 0) !== 0;

        $this->path     = get_temp_dir();
        $this->filename = $this->slug . '-mail.log';
        $this->mailer   = get_option($this->slug . '_smtp_provider', '');

        add_action('kali_mail_failed', [$this, 'error'], 10, 1);
        add_action('wp_mail_failed', [$this, 'error'], 10, 1);
        add_action('kali_mail_success', [$this, 'ok'], 10, 1);
    }
    /**
     * Get instance
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
     * Error occured
     *
     * @return void
     */
    public function error($wp_error)
    {
        $fp = fopen($this->path . $this->filename, 'a');

        fputs($fp, $this->_template([
            'type'    => 'ERROR',
            'message' => $wp_error->get_error_message(),
        ]) . "\n");
        fclose($fp);
    }
    /**
     * Ok function
     *
     * @return void
     */
    public function ok($message)
    {
        $fp = fopen($this->path . $this->filename, 'a');
        fputs($fp, $this->_template([
            'type'    => 'INFO',
            'message' => $message,
        ]) . "\n");
        fclose($fp);
    }
    /**
     * Template
     *
     * @param [type] $data
     * @return void
     */
    public function _template($data)
    {
        $data['message'] = str_replace(["\r", "\n"], ' ', $data['message']);
        $str             = $this->mailer . "|" . date('Y-m-d H:i:s') . "|" . $data['type'] . "|" . $data['message'];
        return $str;
    }
    /**
     * Gets the user log
     *
     * @return void
     */
    public function get_log()
    {
        if (!isset($_POST['args'], $_POST['args']['nonce'])) {
            wp_die(wp_json_encode([
                'success' => false,
                'message' => esc_html__('Denied', 'kaliforms'),
            ]));
        }

        if (!wp_verify_nonce(sanitize_key(wp_unslash($_POST['args']['nonce'])), $this->slug . '_nonce')) {
            wp_die(wp_json_encode([
                'success' => false,
                'message' => esc_html__('Denied', 'kaliforms'),
            ]));
        }

        if (!file_exists($this->path . $this->filename)) {
            return wp_die(wp_json_encode(['success' => false, 'content' => __('No email sent yet', 'kaliforms')]));
        }

        $content  = file_get_contents($this->path . $this->filename);
        $exploded = explode("\n", $content);
        $data     = [];
        $i        = 0;

        foreach ($exploded as $data_entry) {
            if (empty($data_entry)) {
                continue;
            }

            $parts  = explode('|', $data_entry);
            $data[] = [
                'id'      => $i,
                'mailer'  => isset($parts[0]) ? $parts[0] : '-',
                'date'    => isset($parts[1]) ? $parts[1] : '-',
                'type'    => isset($parts[2]) ? $parts[2] : '-',
                'message' => isset($parts[3]) ? $parts[3] : '-',
                'info'    => $parts[2] === 'ERROR' ? 'https://kaliforms.com/docs/faq/' : 'ok',
            ];
            $i++;
        }
        return wp_die(wp_json_encode(['success' => true, 'content' => array_reverse($data)]));
    }
    /**
     * If the user is not authorized, deny action
     */
    public function denied()
    {
        wp_die(esc_html__('Denied', 'kaliforms'));
    }
}
