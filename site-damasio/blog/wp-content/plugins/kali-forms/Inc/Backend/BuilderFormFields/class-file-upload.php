<?php

namespace KaliForms\Inc\Backend\BuilderFormFields;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Class File_Upload
 *
 * @package Inc\Backend\BuilderFormFields
 */
class File_Upload extends Form_Field
{
    /**
     * @var string
     */
    public $id = 'fileUpload';
    /**
     * @var string
     */
    public $type = 'fileUpload';

    /**
     * File_Upload constructor.
     *
     * @param $args
     */
    public function __construct($args)
    {
        parent::__construct($args);
        $this->icon  = 'icon-upload-1';
        $this->label = esc_html__('File upload', 'kaliforms');
    }
}
