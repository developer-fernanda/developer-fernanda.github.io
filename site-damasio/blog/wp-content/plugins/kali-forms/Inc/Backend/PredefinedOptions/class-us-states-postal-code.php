<?php
namespace KaliForms\Inc\Backend\PredefinedOptions;

if (!defined('ABSPATH')) {
    exit;
}

class US_States_Postal_Code
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
    public $id = 'postal';
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
        $this->label = esc_html__('US States Postal Code', 'kaliforms');

        $this->options = [
            ["AL" => "Alabama"],
            ["AK" => "Alaska"],
            ["AZ" => "Arizona"],
            ["AR" => "Arkansas"],
            ["CA" => "California"],
            ["CO" => "Colorado"],
            ["CT" => "Connecticut"],
            ["DE" => "Delaware"],
            ["DC" => "District of Columbia"],
            ["FL" => "Florida"],
            ["GA" => "Georgia"],
            ["HI" => "Hawaii"],
            ["ID" => "Idaho"],
            ["IL" => "Illinois"],
            ["IN" => "Indiana"],
            ["IA" => "Iowa"],
            ["KS" => "Kansas"],
            ["KY" => "Kentucky"],
            ["LA" => "Louisiana"],
            ["ME" => "Maine"],
            ["MT" => "Montana"],
            ["NE" => "Nebraska"],
            ["NV" => "Nevada"],
            ["NH" => "New Hampshire"],
            ["NJ" => "New Jersey"],
            ["NM" => "New Mexico"],
            ["NY" => "New York"],
            ["NC" => "North Carolina"],
            ["ND" => "North Dakota"],
            ["OH" => "Ohio"],
            ["OK" => "Oklahoma"],
            ["OR" => "Oregon"],
            ["MD" => "Maryland"],
            ["MA" => "Massachusetts"],
            ["MI" => "Michigan"],
            ["MN" => "Minnesota"],
            ["MS" => "Mississippi"],
            ["MO" => "Missouri"],
            ["PA" => "Pennsylvania"],
            ["RI" => "Rhode Island"],
            ["SC" => "South Carolina"],
            ["SD" => "South Dakota"],
            ["TN" => "Tennessee"],
            ["TX" => "Texas"],
            ["UT" => "Utah"],
            ["VT" => "Vermont"],
            ["VA" => "Virginia"],
            ["WA" => "Washington"],
            ["WV" => "West Virginia"],
            ["WI" => "Wisconsin"],
            ["WY" => "Wyoming"],
        ];
    }
}
