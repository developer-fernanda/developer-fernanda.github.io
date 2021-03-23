<?php
namespace KaliForms\Inc\Backend\PredefinedOptions;

if (!defined('ABSPATH')) {
    exit;
}

class Months
{
    /**
     * Options array
     *
     * @var array
     */
    public $options = [];
    /**
     * Does it have sub categories
     *
     * @var boolean
     */
    public $subcategories = false;
    /**
     * Predefined option label
     *
     * @var string
     */
    public $label = '';
    /**
     * Preset id
     *
     * @var string
     */
    public $id = 'months';
    /**
     * Class constructor
     */
    public function __construct()
    {
        $this->set_options();
    }
    /**
     * Set options
     *
     * @return void
     */
    public function set_options()
    {
        $this->label = esc_html__('Months', 'kaliforms');
        $this->options = [
            ['january' => esc_html__('January', 'kaliforms')],
            ['february' => esc_html__('February', 'kaliforms')],
            ['march' => esc_html__('March', 'kaliforms')],
            ['april' => esc_html__('April', 'kaliforms')],
            ['may' => esc_html__('May', 'kaliforms')],
            ['june' => esc_html__('June', 'kaliforms')],
            ['july' => esc_html__('July', 'kaliforms')],
            ['august' => esc_html__('August', 'kaliforms')],
            ['september' => esc_html__('September', 'kaliforms')],
            ['october' => esc_html__('October', 'kaliforms')],
            ['november' => esc_html__('November', 'kaliforms')],
            ['december' => esc_html__('December', 'kaliforms')],
        ];

    }
}
