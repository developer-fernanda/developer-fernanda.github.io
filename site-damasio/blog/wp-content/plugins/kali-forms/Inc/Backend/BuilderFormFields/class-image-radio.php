<?php

namespace KaliForms\Inc\Backend\BuilderFormFields;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Class Image_Radio
 *
 * @package Inc\Backend\BuilderFormFields
 */
class Image_Radio extends Form_Field
{
    /**
     * @var string
     */
    public $id = 'imageRadio';
    /**
     * @var string
     */
    public $type = 'imageRadio';
    /**
     * Radio constructor.
     *
     * @param $args
     */
    public function __construct($args)
    {
        parent::__construct($args);
        $this->label = esc_html__('Image Radio', 'kaliforms');
        $this->icon = 'icon-image-choices';
    }
}
