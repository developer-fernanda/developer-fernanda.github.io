<?php
namespace KaliForms\Inc\Utils;

use KaliForms\Inc\Utils\MetaHelper;

class Payments_Action_Helper
{
    /**
     * Metahelper trait
     */
    use MetaHelper;

    /**
     * Parent plugin slug
     *
     * @var string
     */
    public $slug = 'kaliforms';
    /**
     * Current post
     *
     * @var [type]
     */
    public $post = null;
    /**
     * Class constructor
     *
     * @param [type] $formId
     */
    public function __construct($formId)
    {
        $this->form = $formId;
        if ($this->form === null) {
            return new \WP_Error();
        }
    }

    /**
     * Get payment data
     *
     * @return void
     */
    public function get_payment_data($args)
    {
        $this->post   = get_post($args['formId']);
        $paymentsLive = $this->get('payments_live', false);
        $currency     = $this->get('currency', 'USD');
        $foreachRun   = $this->foreachFieldsToProducts();
        $email        = false;
        $description  = [];

        foreach ($foreachRun['products'] as $product) {
            $description[] = $product['type'] === 'multipleProducts' ? $product['variant'] : $product['caption'];
        }

        if ($foreachRun['email'] && isset($args['formData'][$foreachRun['email']])) {
            $email = $args['formData'][$foreachRun['email']];
        }

        return [
            'email'       => $email,
            'currency'    => $currency,
            'live'        => $paymentsLive,
            'amount'      => $foreachRun['total'],
            'products'    => $foreachRun['products'],
            'description' => $description,
        ];
    }

    /**
     * Get stripe data
     *
     * @return void
     */
    public function get_stripe_data($args)
    {
        $this->post = get_post($args['formId']);

        if ($this->post === null) {
            return new \WP_Error(500, esc_html__('There is no form associated with this id. Make sure you copied it correctly', 'kaliforms'));
        }

        $fields       = json_decode($this->get('stripe_fields', '{}'), false, 512, JSON_HEX_QUOT);
        $paymentsLive = $this->get('payments_live', false);
        $currency     = $this->get('currency', 'USD');
        $filtered     = [];

        foreach ($fields as $k => $v) {
            if ($v !== '' && $v !== 'empty') {
                $filtered[$k] = $v;
            };
        }

        $foreachRun = $this->foreachFieldsToProducts();
        return [
            'fields'   => $filtered,
            'currency' => $currency,
            'amount'   => $foreachRun['total'],
            'products' => $foreachRun['products'],
            's_key'    => $paymentsLive ? $this->get('stripe_s_key_live', '') : $this->get('stripe_s_key', ''),
        ];
    }

    /**
     * Verify products from the database
     * @return void
     */
    public function get_products($args)
    {
        $this->post = get_post($args['formId']);

        if ($this->post === null) {
            return new \WP_Error(500, esc_html__('There is no form associated with this id. Make sure you copied it correctly', 'kaliforms'));
        }

        $foreachRun = $this->foreachFieldsToProducts();
        if ($foreachRun['payee']) {
            foreach ($foreachRun['products'] as $i => $product) {
                $foreachRun['products'][$i]['payee'] = $foreachRun['payee'];
            }
        }

        return wp_json_encode(
            [
                'response' => $foreachRun['products'],
            ]
        );
    }

    /**
     * Get products from fields
     *
     * @return void
     */
    public function foreachFieldsToProducts()
    {
        $fields          = json_decode($this->get('field_components', '[]'), false, 512, JSON_HEX_QUOT);
        $products        = [];
        $payee           = false;
        $total           = 0;
        $emailFieldFound = false;
        $currency        = $this->get('currency', 'USD');
        foreach ($fields as $k => $v) {
            if ($v->id === 'email') {
                $emailFieldFound = $v->properties->name;
            }
            if ($v->id === 'paypal') {
                $payee = $v->properties->merchantEmail;
            }
            if ($v->id === 'donation') {
                $products[] = [
                    'type'         => $v->id,
                    'id'           => $v->properties->id,
                    'internalId'   => $v->internalId,
                    'name'         => $v->properties->name,
                    'price'        => '',
                    'caption'      => $v->properties->donationName,
                    'description'  => $v->properties->description,
                    'donationType' => $v->properties->donationType,
                    'choices'      => $v->properties->choices,
                    'currency'     => $currency,
                ];
            }
            if ($v->id === 'product') {
                $products[] = [
                    'type'        => $v->id,
                    'internalId'  => $v->internalId,
                    'id'          => $v->properties->id,
                    'price'       => $v->properties->price,
                    'caption'     => $v->properties->caption,
                    'description' => $v->properties->description,
                    'currency'    => $currency,
                ];
                $total += floatval($v->properties->price);
            }
            if ($v->id === 'multipleProducts') {
                foreach ($v->properties->products as $deepK => $deepV) {
                    $products[] = [
                        'type'        => $v->id,
                        'internalId'  => $v->internalId,
                        'parentId'    => $v->properties->id,
                        'name'        => $v->properties->name,
                        'id'          => $deepV->id,
                        'price'       => $deepV->price,
                        'caption'     => $v->properties->caption,
                        'variant'     => $deepV->label,
                        'description' => $v->properties->description,
                        'currency'    => $currency,
                    ];
                }
            }
        }
        return ['payee' => $payee, 'products' => $products, 'total' => $total, 'email' => $emailFieldFound];
    }
}
