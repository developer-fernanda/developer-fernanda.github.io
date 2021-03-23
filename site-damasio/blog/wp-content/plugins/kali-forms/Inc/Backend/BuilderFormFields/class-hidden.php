<?php

namespace KaliForms\Inc\Backend\BuilderFormFields;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Class Hidden
 *
 * @package Inc\Backend\BuilderFormFields
 */
class Hidden extends Form_Field
{
    /**
     * @var string
     */
    public $id = 'hidden';
    /**
     * @var string
     */
    public $type = 'hidden';

    /**
     * Hidden field constructor.
     *
     * @param $args
     */
    public function __construct($args)
    {
        parent::__construct($args);
        $this->remove_props(['caption', 'description']);
        $this->label = esc_html__('Hidden field', 'kaliforms');
    }
}
