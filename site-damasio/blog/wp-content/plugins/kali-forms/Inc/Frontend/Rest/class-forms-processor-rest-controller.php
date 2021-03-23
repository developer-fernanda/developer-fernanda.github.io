<?php

namespace KaliForms\Inc\Frontend\Rest;

if (!defined('ABSPATH')) {
    exit;
}

use KaliForms\Inc\Frontend\Processor;
use KaliForms\Inc\Utils\OptionInterpreter;

class Forms_Processor_Rest_Controller extends \WP_REST_Controller
{
    /**
     * Along the way, we might have strayed from the path
     */
    use OptionInterpreter;
    /**
     * Public slug
     *
     * @var string
     */
    public $slug = 'kaliforms';
    /**
     * Schema
     *
     * @var array
     */
    public $schema = [];
    /**
     * Class constructor
     */
    public function __construct()
    {
        $this->namespace     = $this->slug . '/v1';
        $this->resource_name = 'processor';
    }
    /**
     * Route registration
     *
     * @return void
     */
    public function register_routes()
    {
        register_rest_route(
            $this->namespace, '/' . $this->resource_name,
            [
                [
                    'methods'             => 'POST',
                    'callback'            => [$this, 'process_form'],
                    'permission_callback' => [$this, 'process_form_permissions_check'],
                ],
                'schema' => [$this, 'get_item_schema'],
            ]
        );
    }

    /**
     * Permission check
     */
    public function process_form_permissions_check($request)
    {
        // if (!current_user_can('edit_posts')) {
        //     return new \WP_Error(
        //         'rest_forbidden',
        //         esc_html__('You cannot view the post resource.', 'kaliforms'),
        //         ['status' => $this->authorization_status_code()]
        //     );
        // }

        return true;
    }
    /**
     * Process form request
     *
     * @param [type] $request
     * @return void
     */
    public function process_form($request)
    {
        $data      = $request->get_param('data');
        $processor = new Processor($data['formId'], $data);
    }
    /**
     * Get our sample schema for a post.
     *
     * @return array The sample schema for a post
     */
    public function get_item_schema()
    {
        if ($this->schema) {
            // Since WordPress 5.3, the schema can be cached in the $schema property.
            return $this->schema;
        }

        $this->schema = [
            '$schema'    => 'http://json-schema.org/draft-04/schema#',
            'title'      => 'form',
            'type'       => 'object',
            'properties' => [
                'id' => [
                    'description' => esc_html__('Unique identifier for the object.', 'kaliforms'),
                    'type'        => 'integer',
                    'context'     => ['view', 'edit', 'embed'],
                    'readonly'    => true,
                ],
            ],
        ];

        return $this->schema;
    }
    /**
     * Return authorization status code
     *
     * @return void
     */
    public function authorization_status_code()
    {
        $status = 401;
        if (is_user_logged_in()) {
            $status = 403;
        }
        return $status;
    }
}
