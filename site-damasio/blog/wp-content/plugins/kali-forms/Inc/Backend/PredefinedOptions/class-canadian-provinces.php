<?php
namespace KaliForms\Inc\Backend\PredefinedOptions;

if (!defined('ABSPATH')) {
    exit;
}

class Canadian_Provinces
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
    public $id = 'canadian';
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
        $this->label = esc_html__('Canadian Provinces', 'kaliforms');

        $this->options = [
            ["NL" => "Newfoundland and Labrador"],
            ["PE" => "Prince Edward Island"],
            ["NS" => "Nova Scotia"],
            ["NB" => "New Brunswick"],
            ["QC" => "Quebec"],
            ["ON" => "Ontario"],
            ["MB" => "Manitoba"],
            ["SK" => "Saskatchewan"],
            ["AB" => "Alberta"],
            ["BC" => "British Columbia"],
            ["YT" => "Yukon"],
            ["NT" => "Northwest Territories"],
            ["NU" => "Nunavut"],
        ];
    }
}
