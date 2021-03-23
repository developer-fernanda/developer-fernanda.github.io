<?php

namespace KaliForms\Inc\Backend\BuilderFormFields;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Class Upsell_Field
 *
 * @package Inc\Backend\BuilderFormFields
 */
class Upsell_Field extends Form_Field
{
    /**
     * @var string
     */
    public $id = 'upsellField';
    /**
     * @var string
     */
	public $type = 'upsellField';
	/**
	 * Icon
	 *
	 * @var string
	 */
	public $icon = '';
    /**
     * Dropdown constructor.
     *
     * @param $args
     */
    public function __construct($args)
    {
        parent::__construct($args);
        $this->label = $args['label'];
		$this->pro = $args['pro'];
		$this->icon = $args['icon'];
        $this->upsell_for = $args['upsell_for'];
        $this->remove_props(['caption', 'description', 'default']);
    }
}
