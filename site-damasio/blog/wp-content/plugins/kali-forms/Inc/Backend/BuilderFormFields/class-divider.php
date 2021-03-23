<?php

namespace KaliForms\Inc\Backend\BuilderFormFields;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Class Divider
 *
 * @package Inc\Backend\BuilderFormFields
 */
class Divider extends Form_Field
{
    /**
     * @var string
     */
    public $id = 'divider';
    /**
     * @var string
     */
    public $type = 'divider';
    /**
     * Constraint. Should always occupy 12 rows ( CANT BE SMALLER )
     *
     * @var string
     */
    public $constraint = 12;

    /**
     * Divider constructor.
     *
     * @param $args
     */
    public function __construct($args)
    {
        parent::__construct($args);
        $this->remove_props(['default', 'description']);
        $this->label = esc_html__('Divider', 'kaliforms');
    }
}
