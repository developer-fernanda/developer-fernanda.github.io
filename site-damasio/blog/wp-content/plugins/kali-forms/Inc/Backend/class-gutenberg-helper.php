<?php

namespace KaliForms\Inc\Backend;

if (!defined('ABSPATH')) {
    exit;
}
use KaliForms\Inc\Utils;

/**
 * Class Gutenberg_Helper
 *
 * @package Inc\Backend
 */
class Gutenberg_Helper
{
    /**
     * Metahelper trait
     */
    use Utils\MetaHelper;
    /**
     * Grid helper trait
     */
    use Utils\GridHelper;
    /**
     * Plugin slug
     *
     * @var string
     */
    protected $slug = 'kaliforms';
    /**
     * Post
     *
     * @var [post]
     */
    public $post;
    /**
     * Row array
     *
     * @var array
     */
    public $rows = [];
    /**
     * Fields
     *
     * @var array
     */
    public $fields = [];
    /**
     * Class constructor
     *
     * @param [type] $id
     */
    public function __construct($id)
    {
        $this->post = get_post($id);
        if ($this->post === null) {
            return $this->display_error(esc_html__('There is no form associated with this id. Make sure you copied it correctly', 'kaliforms'));
        }
        if ($this->post->post_status !== 'publish') {
            return $this->display_error(esc_html__('This form is not published.', 'kaliforms'));
        }

        $fields = json_decode($this->get('field_components', '[]'));
        foreach ($fields as $field) {
            $this->fields[$field->internalId] = $field;
        }
        $grid = json_decode($this->get('grid', '[]'));
        $this->walk_array($grid);
    }

    /**
     * Displays an error in the frontend
     *
     */
    public function display_error($err)
    {
        wp_die($err);
    }
    /**
     * Returns rows
     *
     * @return void
     */
    public function get_rows()
    {
        return $this->rows;
    }

    public function construct_object()
    {
        return true;
    }
}
