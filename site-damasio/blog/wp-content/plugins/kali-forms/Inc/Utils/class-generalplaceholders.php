<?php

namespace KaliForms\Inc\Utils;

/**
 * Class GeneralPlaceholders
 *
 * @package Inc\Utils
 */

class GeneralPlaceholders
{
    /**
     * Plugin slug
     *
     * @var string
     */
    protected $slug = 'kaliforms';
    /**
     * General placeholders array
     *
     * @var array
     */
    public $general_placeholders = [];

    /**
     * Class constructor
     */
    public function __construct()
    {
        $this->set_placeholders();
    }

    /**
     * Sets the placeholders so we can retrieve it easily
     *
     * @return void
     */
    public function set_placeholders()
    {
        $placeholders = [
            '{sitetitle}'       => get_bloginfo('name'),
            '{tagline}'         => get_bloginfo('description'),
            '{siteurl}'         => get_bloginfo('wpurl'),
            '{homeurl}'         => get_bloginfo('url'),
            '{admin_email}'     => get_bloginfo('admin_email'),
            '{entryCounter}'    => 'KaliForms\Inc\Utils\General_Placeholders_Helper::count_form_entries',
            '{thisPermalink}'   => 'KaliForms\Inc\Utils\General_Placeholders_Helper::get_current_permalink',
            '{submission_link}' => 'KaliForms\Inc\Utils\Submission_Action_Helper::get_submission_link',

        ];

        $this->general_placeholders = array_merge($this->general_placeholders, $placeholders);
        $this->general_placeholders = apply_filters($this->slug . '_general_placeholders', $this->general_placeholders);
    }
}
