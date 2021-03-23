<?php
namespace KaliForms\Inc\Utils;

if (!defined('ABSPATH')) {
    exit;
}

use KaliForms\Inc\Backend;

class Builder_Translator
{
    /**
     * Plugin slug
     */
    public $slug = 'kaliforms';
    /**
     * Form styles
     *
     * @var array
     */
    public $styles = [];
    /**
     * Predefined options
     *
     * @var array
     */
    public $predefinedOptions = [];
    /**
     * Predefined forms
     *
     * @var array
     */
    public $predefinedForms = [];
    /**
     * Form fields
     *
     * @var array
     */
    public $fields = [];
    /**
     * Notifications
     *
     * @var array
     */
    public $notifications = [];
    /**
     * Class constructor
     */
    public function __construct()
    {
    }
    /**
     * Construct based on arguments so we don't query everything if not needed
     *
     * @param [type] ...$args
     * @return void
     */
    public function construct_these(...$args)
    {
        if (count($args) === 1 && $args[0] === 'all') {
            $args = ['fields', 'predefinedForms', 'predefinedOptions', 'styles'];
        }
        foreach ($args as $propName) {
            $methodName = 'set' . ucfirst($propName);
            if (method_exists($this, $methodName) && property_exists($this, $propName)) {
                $this->{$propName} = $this->{$methodName}();
            }
        }
    }
    /**
     * Set styles
     *
     * @return void
     */
    public function setStyles()
    {
        $form_styles = Backend\Form_Styles::get_instance();
        return apply_filters(
            $this->slug . '_builder_styles',
            $form_styles->styles
        );
    }
    /**
     * Set fields
     *
     * @return void
     */
    public function setFields()
    {
        return apply_filters(
            $this->slug . '_builder_fields',
            (new Backend\Form_Fields())->form_fields
        );
    }
    /**
     * Set predefined forms
     *
     * @return void
     */
    public function setPredefinedForms()
    {
        $forms = new Backend\Predefined_Forms();
        $forms->set_forms();

        return apply_filters(
            $this->slug . '_builder_predefined_forms',
            $forms->forms
        );
    }
    /**
     * Set the predefined options
     *
     * @return void
     */
    public function setPredefinedOptions()
    {
        return apply_filters(
            $this->slug . '_builder_predefiend_options',
            (new Backend\Predefined_Options())->options
        );
    }

    /**
     * Global notifications
     *
     * @return void
     */
    public function setNotifications()
    {
        return apply_filters(
            $this->slug . '_builder_notifications',
            (new Backend\Global_Notifications())->notifications
        );
    }
}
