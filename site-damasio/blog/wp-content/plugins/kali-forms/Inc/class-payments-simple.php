<?php
namespace KaliForms\Inc;

if (!defined('ABSPATH')) {
    exit;
}

use KaliForms\Inc\Utils\Payments_Action_Helper;

class Payments_Simple
{
    /**
     * Plugin slug
     *
     * @var string
     */
    protected $slug = 'kaliforms';
    /**
     * Keeps the current post
     *
     * @var WP_POST
     */
    protected $post = null;
    /**
     * Class constructor
     */
    public function __construct()
    {
        /**
         * Filter for the form shortcode (init)
         */
        add_filter($this->slug . '_form_shortcode_init', [$this, 'hook_into_shortcode']);

        add_action('wp_ajax_kaliforms_form_verify_products', [$this, 'verify_products']);
        add_action('wp_ajax_nopriv_kaliforms_form_verify_products', [$this, 'verify_products']);

        add_action('wp_ajax_kaliforms_form_paypal_confirm_log', [$this, 'nothing_to_see_here']);
        add_action('wp_ajax_nopriv_kaliforms_form_paypal_confirm_log', [$this, 'nothing_to_see_here']);
    }

    /**
     * Nothing to see here
     *
     * @return void
     */
    public function nothing_to_see_here()
    {
        wp_die(esc_html__('Upgrade to Pro version for a payment log'));
    }

    /**
     * If the user is not authorized, deny action
     */
    public function denied()
    {
        wp_die(esc_html__('Denied', 'kaliforms'));
    }

    /**
     * Verify products
     *
     * @return void
     */
    public function verify_products()
    {
        $args = $this->sanitize_post();
        $this->verify($args);
        $actionHelper = new Payments_Action_Helper($args['formId']);
        wp_die(
            is_wp_error($actionHelper) ? esc_html__('Something went wrong', 'kaliforms') : $actionHelper->get_products($args)
        );
    }

    /**
     * Run security check and return args
     *
     * @return void
     */
    private function sanitize_post()
    {
        if (!isset($_POST['data'])) {
            return false;
        }

        return stripslashes_deep($_POST['data']);
    }

    /**
     * When hooked into the shortcode we need to register the script
     *
     * @param Form_Shortcode $args
     * @return void
     */
    public function hook_into_shortcode($args)
    {
        foreach ($args->fields as $k => $v) {
            if ($v->id === 'paypal') {
                $paymentMethod = $v->id;
                break;
            }
        }

        if (empty($paymentMethod)) {
            return $args;
        }

        switch ($paymentMethod) {
            case 'paypal':
                $this->load_paypal($args);
                break;
            default:
                break;
        }

        return $args;
    }

    /**
     * Load paypal scripts
     *
     * @return void
     */
    protected function load_paypal($args)
    {
        $paymentsLive = get_post_meta($args->post->ID, $this->slug . '_payments_live', true);
        if ($paymentsLive === null || $paymentsLive === '') {
            $paymentsLive = 0;
        }

        $key = $paymentsLive === 0
        ? get_post_meta($args->post->ID, $this->slug . '_paypal_client_id_sandbox', true)
        : get_post_meta($args->post->ID, $this->slug . '_paypal_client_id', true);

        if (empty($key)) {
            return false;
        }

        $currency = get_post_meta($args->post->ID, $this->slug . '_currency', true);
        if ($currency === null || $currency === '') {
            $currency = 'USD';
        }

        $url = 'https://www.paypal.com/sdk/js?client-id=' . $key . '&currency=' . $currency;

        wp_enqueue_script(
            'kaliforms-paypal',
            $url,
            false,
            null,
            true
        );
    }
    /**
     * Verifies stuff, dies if something happens
     *
     * @param [type] $args
     * @return void
     */
    private function verify($args)
    {
        if (!$args) {
            $this->denied();
        }

        if (!isset($args['formId'])) {
            $this->denied();

        }

        if (!isset($args['nonce'])) {
            $this->denied();
        }

        if (!wp_verify_nonce($args['nonce'], 'kaliforms_nonce')) {
            $this->denied();
        }
    }
}
