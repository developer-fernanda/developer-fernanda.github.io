<?php

namespace KaliForms\Inc\Backend\BuilderFormFields;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Class TextArea
 *
 * @package Inc\Backend\BuilderFormFields
 */
class TextArea extends Form_Field
{
    /**
     * @var string
     */
    public $id = 'textarea';
    /**
     * @var string
     */
    public $type = 'textarea';
    /**
     * TextArea constructor.
     *
     * @param $args
     */
    public function __construct($args)
    {
        parent::__construct($args);
        $this->icon  = 'icon-text-area';
        $this->label = esc_html__('Textarea', 'kaliforms');
    }
}
