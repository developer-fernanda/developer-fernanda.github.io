<?php
namespace KaliForms\Inc\Backend\PredefinedOptions;

if (!defined('ABSPATH')) {
    exit;
}

class US_States
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
    public $id = 'states';
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
        $this->label = esc_html__('US States', 'kaliforms');

        $this->options = [
            ["Alabama" => "Alabama"],
            ["Alaska" => "Alaska"],
            ["Arizona" => "Arizona"],
            ["Arkansas" => "Arkansas"],
            ["California" => "California"],
            ["Colorado" => "Colorado"],
            ["Connecticut" => "Connecticut"],
            ["Delaware" => "Delaware"],
            ["District of Columbia" => "District of Columbia"],
            ["Florida" => "Florida"],
            ["Georgia" => "Georgia"],
            ["Hawaii" => "Hawaii"],
            ["Idaho" => "Idaho"],
            ["Illinois" => "Illinois"],
            ["Indiana" => "Indiana"],
            ["Iowa" => "Iowa"],
            ["Kansas" => "Kansas"],
            ["Kentucky" => "Kentucky"],
            ["Louisiana" => "Louisiana"],
            ["Maine" => "Maine"],
            ["Montana" => "Montana"],
            ["Nebraska" => "Nebraska"],
            ["Nevada" => "Nevada"],
            ["New Hampshire" => "New Hampshire"],
            ["New Jersey" => "New Jersey"],
            ["New Mexico" => "New Mexico"],
            ["New York" => "New York"],
            ["North Carolina" => "North Carolina"],
            ["North Dakota" => "North Dakota"],
            ["Ohio" => "Ohio"],
            ["Oklahoma" => "Oklahoma"],
            ["Oregon" => "Oregon"],
            ["Maryland" => "Maryland"],
            ["Massachusetts" => "Massachusetts"],
            ["Michigan" => "Michigan"],
            ["Minnesota" => "Minnesota"],
            ["Mississippi" => "Mississippi"],
            ["Missouri" => "Missouri"],
            ["Pennsylvania" => "Pennsylvania"],
            ["Rhode Island" => "Rhode Island"],
            ["South Carolina" => "South Carolina"],
            ["South Dakota" => "South Dakota"],
            ["Tennessee" => "Tennessee"],
            ["Texas" => "Texas"],
            ["Utah" => "Utah"],
            ["Vermont" => "Vermont"],
            ["Virginia" => "Virginia"],
            ["Washington" => "Washington"],
            ["West Virginia" => "West Virginia"],
            ["Wisconsin" => "Wisconsin"],
            ["Wyoming" => "Wyoming"],
        ];

    }
}
