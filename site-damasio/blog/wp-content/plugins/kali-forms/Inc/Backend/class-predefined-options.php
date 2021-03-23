<?php

namespace KaliForms\Inc\Backend;

if (!defined('ABSPATH')) {
    exit;
}

use KaliForms\Inc\Backend\PredefinedOptions;

/**
 * Class Predefined_Options is used to translate stuff
 *
 * @package App\Libraries
 */
class Predefined_Options
{
    /**
     * Plugin slug
     *
     * @var string
     */
    public $slug = 'kaliforms';
    /**
     * Options array
     *
     * @var array
     */
    public $options = [];
    /**
     * Class constructor
     *
     * @return void
     */
    public function __construct()
    {
        $this->gather_predefined_options();
    }

    /**
     * Gather predefined options
     *
     * @return void
     */
    public function gather_predefined_options()
    {
        $options = [
            new PredefinedOptions\Country_Options(),
            new PredefinedOptions\US_States(),
            new PredefinedOptions\US_States_Postal_Code(),
            new PredefinedOptions\Months(),
            new PredefinedOptions\WeekDays(),
            new PredefinedOptions\Canadian_Provinces(),
        ];

        $this->options = apply_filters($this->slug . '_predefined_options', $options);
    }
}
