<?php

namespace KaliForms\Inc\Backend\BuilderFormFields;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Class Collection
 *
 * @package Inc\Backend\BuilderFormFields
 */
class Collection extends Form_Field
{
    /**
     * @var string
     */
    public $id = 'collection';
    /**
     * @var string
     */
	public $type = 'collection';
	/**
	 * Collection of fields
	 *
	 * @var array
	 */
	public $collection = [];
    /**
     * Collecton constructor.
     *
     * @param $args
     */
    public function __construct($args)
    {
        parent::__construct($args);
        $this->label = $args['label'];
		$this->collection = $args['fields'];
		$this->icon = $args['icon'];
        $this->remove_props(['caption', 'description', 'default']);
    }
}
