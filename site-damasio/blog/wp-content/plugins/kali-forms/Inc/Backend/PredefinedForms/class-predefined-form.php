<?php

namespace KaliForms\Inc\Backend\PredefinedForms;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Predefined form abstrat class
 */
abstract class Predefined_Form
{
    /**
     * Emails
     *
     * @var array
     */
    public $emails = [];
    /**
     * Thank you message
     *
     * @var array
     */
    public $thank_you_message = [];
    /**
     * Grid
     *
     * @var array
     */
    public $grid = [];
    /**
     * Field components
     *
     * @var array
     */
    public $field_components = [];
    /**
     * Name
     *
     * @var string
     */
    public $name = '';
    /**
     * Description
     *
     * @var string
     */
    public $description = '';
    /**
     * Plugin slug
     *
     * @var string
     */
    public $slug = 'kaliforms';
    /**
     * Form info
     *
     * @var array
     */
    public $form_info = [];
    /**
     * Class constructor
     */
    public function __construct()
    {

    }
}
