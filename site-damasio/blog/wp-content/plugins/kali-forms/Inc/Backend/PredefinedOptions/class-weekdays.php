<?php
namespace KaliForms\Inc\Backend\PredefinedOptions;

if (!defined('ABSPATH')) {
    exit;
}

class WeekDays
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
    public $id = 'weekdays';
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
        $this->label = esc_html__('Week Days', 'kaliforms');
        $this->options = [
            ['monday' => esc_html__('Monday', 'kaliforms')],
            ['tuesday' => esc_html__('Tuesday', 'kaliforms')],
            ['wednesday' => esc_html__('Wednesday', 'kaliforms')],
            ['thursday' => esc_html__('Thursday', 'kaliforms')],
            ['friday' => esc_html__('Friday', 'kaliforms')],
            ['saturday' => esc_html__('Saturday', 'kaliforms')],
            ['sunday' => esc_html__('Sunday', 'kaliforms')],
        ];
    }
}
