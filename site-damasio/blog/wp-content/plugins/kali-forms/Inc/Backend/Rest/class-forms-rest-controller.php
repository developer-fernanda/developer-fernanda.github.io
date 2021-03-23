<?php

namespace KaliForms\Inc\Backend\Rest;

if (!defined('ABSPATH')) {
    exit;
}

use KaliForms\Inc\Utils\Builder_Translator;
use KaliForms\Inc\Utils\OptionInterpreter;
use KaliForms\Inc\Utils\Post_Translator;

class Forms_Rest_Controller extends \WP_REST_Controller
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
        $this->resource_name = 'forms';
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
                    'methods'             => 'GET',
                    'callback'            => [$this, 'get_items'],
                    'permission_callback' => [$this, 'get_items_permissions_check'],
                    'args'                => $this->get_collection_params(),
                ],
                'schema' => [$this, 'get_item_schema'],
            ]
        );

        register_rest_route(
            $this->namespace, '/' . $this->resource_name . '/(?P<id>[\d]+)',
            [
                [
                    'methods'             => 'GET',
                    'callback'            => [$this, 'get_item'],
                    'permission_callback' => [$this, 'get_items_permissions_check'],
                ],
                'schema' => [$this, 'get_item_schema'],
            ]
        );

        register_rest_route(
            $this->namespace, '/' . $this->resource_name . '/(?P<id>[\d]+)',
            [
                [
                    'methods'             => 'PATCH',
                    'callback'            => [$this, 'update_item'],
                    'permission_callback' => [$this, 'edit_item_check'],
                ],
            ]
        );

        register_rest_route(
            $this->namespace, '/' . $this->resource_name . '/options/',
            [
                [
                    'methods'             => 'GET',
                    'callback'            => [$this, 'get_item_properties'],
                    'permission_callback' => [$this, 'get_items_permissions_check'],
                ],
            ]
        );

        register_rest_route(
            $this->namespace, '/' . $this->resource_name . '/builder/(?P<retrieve>[\w]+)',
            [
                [
                    'methods'             => 'GET',
                    'callback'            => [$this, 'get_builder'],
                    'permission_callback' => [$this, 'get_items_permissions_check'],
                ],
            ]
        );

        register_rest_route(
            $this->namespace, '/' . $this->resource_name . '/notifications',
            [
                [
                    'methods'             => 'GET',
                    'callback'            => [$this, 'get_notifications'],
                    'permission_callback' => [$this, 'get_items_permissions_check'],
                ],
            ]
        );

        register_rest_route(
            $this->namespace, '/' . $this->resource_name . '/entries/(?P<id>[\d]+)',
            [
                [
                    'methods'             => 'GET',
                    'callback'            => [$this, 'get_form_entries'],
                    'permission_callback' => [$this, 'get_items_permissions_check'],
                ],
            ]
        );
    }

    /**
     * Check permissions for the posts.
     *
     * @param WP_REST_Request $request Current request.
     */
    public function get_items_permissions_check($request)
    {
        if (!current_user_can('edit_posts')) {
            return new \WP_Error(
                'rest_forbidden',
                esc_html__('You cannot view the post resource.', 'kaliforms'),
                ['status' => $this->authorization_status_code()]
            );
        }

        return true;
    }
    /**
     * Check permission to edit a post
     *
     * @param [type] $request
     * @return void
     */
    public function edit_item_check($request)
    {
        if (!current_user_can('edit_posts')) {
            return new \WP_Error(
                'rest_forbidden',
                esc_html__('You cannot edit the post resource.', 'kaliforms'),
                ['status' => $this->authorization_status_code()]
            );
        }

        return true;
    }
    /**
     * Get item properties
     *
     * @param [type] $request
     * @return void
     */
    public function get_item_properties($request)
    {
        $options = $this->_get_options($request['id'], $request['options']);
        return rest_ensure_response($options);
    }
    /**
     * Updates an item
     *
     * @param [type] $request
     * @return void
     */
    public function update_item($request)
    {
        $options  = $this->_get_options_to_update($request);
        $response = $this->_update_item_meta((int) $request['id'], $options);

        return rest_ensure_response($response);
    }
    /**
     * Grabs the items and returns them
     *
     * @param WP_REST_Request $request Current request.
     */
    public function get_items($request)
    {
        $posts_per_page = isset($request['per_page']) ? (int) $request['per_page'] : 5;
        $args           = [
            'posts_per_page' => $posts_per_page,
            'post_type'      => $this->slug . '_forms',
            'status'         => 'published',
        ];

        $registered         = $this->get_collection_params();
        $parameter_mappings = [
            'page'   => 'paged',
            'search' => 's',
        ];

        foreach ($parameter_mappings as $api_param => $wp_param) {
            if (isset($registered[$api_param], $request[$api_param])) {
                $args[$wp_param] = $request[$api_param];
            }
        }

        $query_args = $this->prepare_items_query($args, $request);

        $posts_query  = new \WP_Query();
        $query_result = $posts_query->query($query_args);
        $posts        = [];

        foreach ($query_result as $post) {
            $data    = $this->prepare_item_for_response($post, $request);
            $posts[] = $this->prepare_response_for_collection($data);
        }

        $page        = (int) $query_args['paged'];
        $total_posts = $posts_query->found_posts;

        if ($total_posts < 1) {
            unset($query_args['paged']);
            $count_query = new \WP_Query();
            $count_query->query($query_args);
            $total_posts = $count_query->found_posts;
        }

        $max_pages = ceil($total_posts / (int) $posts_query->query_vars['posts_per_page']);
        if ($page > $max_pages && $total_posts > 0) {
            return new WP_Error(
                'rest_post_invalid_page_number',
                esc_html__('The page number requested is larger than the number of pages available.', 'kaliforms'),
                ['status' => 400]
            );
        }

        $response = rest_ensure_response($posts);
        $response->header('X-WP-Total', (int) $total_posts);
        $response->header('X-WP-TotalPages', (int) $max_pages);
        $request_params = $request->get_query_params();
        $base           = add_query_arg(urlencode_deep($request_params), rest_url(sprintf('%s/%s', $this->namespace, $this->rest_base)));

        if ($page > 1) {
            $prev_page = $page - 1;

            if ($prev_page > $max_pages) {
                $prev_page = $max_pages;
            }

            $prev_link = add_query_arg('page', $prev_page, $base);
            $response->link_header('prev', $prev_link);
        }
        if ($max_pages > $page) {
            $next_page = $page + 1;
            $next_link = add_query_arg('page', $next_page, $base);

            $response->link_header('next', $next_link);
        }

        return $response;
    }

    /**
     * Get item
     *
     *  @param WP_REST_Request $request Current request.
     * @return void
     */
    public function get_item($request)
    {
        $id   = (int) $request['id'];
        $post = get_post($id);

        if (empty($post)) {
            return rest_ensure_response([]);
        }

        $response = $this->prepare_item_for_response($post, $request);

        return $response;
    }
    /**
     * Get notifications
     *
     * @param [type] $request
     * @return void
     */
    public function get_notifications($request)
    {
        $builder = new Builder_Translator();
        $builder->construct_these('notifications');
        return rest_ensure_response($builder->notifications);
    }
    /**
     * Retrieves builder stuff
     *
     * @param [type] $request
     * @return void
     */
    public function get_builder($request)
    {
        $data    = [];
        $builder = new Builder_Translator();
        switch ($request['retrieve']) {
            case 'all':
                $builder->construct_these('all');
                $data = [
                    'fields'            => $builder->fields,
                    'styles'            => $builder->styles,
                    'predefinedOptions' => $builder->predefinedOptions,
                    'predefinedForms'   => $builder->predefinedForms,
                ];
                break;
            case 'fields':
                $builder->construct_these('fields');
                $data['fields'] = $builder->fields;
                break;
            case 'styles':
                $builder->construct_these('styles');
                $data['styles'] = $builder->styles;
                break;
            case 'predefined-options':
                $builder->construct_these('predefinedOptions');
                $data['predefinedOptions'] = $builder->predefinedOptions;
                break;
            case 'predefined-forms':
                $builder->construct_these('predefinedForms');
                $data['predefinedForms'] = $builder->predefinedForms;
                break;
        }

        return rest_ensure_response($data);
    }
    /**
     * Matches the post data to the schema we want.
     *
     * @param WP_Post $post The comment object whose response is being prepared.
     */
    public function prepare_item_for_response($post, $request)
    {
        $post_data = [];

        $schema = $this->get_item_schema($request);

        // We are also renaming the fields to more understandable names.
        if (isset($schema['properties']['id'])) {
            $post_data['id'] = (int) $post->ID;
        }

        $post = new Post_Translator($post);
        $post->construct_these(...array_keys($schema['properties']));

        foreach ($schema['properties'] as $key => $property) {
            if ($key === 'id') {
                continue;
            }

            $post_data[$key] = $post->{$key};
        }

        return rest_ensure_response($post_data);
    }
    /**
     * Returns the installed plugins
     *
     * @param [type] $data
     * @return void
     */
    public function _get_installed_plugins($data)
    {
        return [
            'pro'              => class_exists('KaliForms\Inc\KaliForms_Pro'),
            'user'             => class_exists('KaliForms\Inc\KaliForms_User_Registration'),
            'sms'              => class_exists('KaliForms\Inc\KaliForms_Sms'),
            'newsletter'       => class_exists('KaliForms\Inc\KaliForms_Newsletter'),
            'slack'            => class_exists('KaliForms\Inc\KaliForms_Slack'),
            'googleSheets'     => class_exists('KaliForms\Inc\KaliForms_Google_Sheets'),
            'hubspot'          => class_exists('KaliForms\Inc\KaliForms_Hubspot'),
            'webhooks'         => class_exists('KaliForms\Inc\KaliForms_Webhooks'),
            'payments'         => class_exists('KaliForms\Inc\KaliForms_Payments'),
            'submissions'      => class_exists('KaliForms\Inc\KaliForms_Submissions'),
            'analytics'        => class_exists('KaliForms\Inc\KaliForms_Google_Analytics'),
            'digitalSignature' => class_exists('KaliForms\Inc\KaliForms_Digital_Signature'),
        ];
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
                'id'                => [
                    'description' => esc_html__('Unique identifier for the object.', 'kaliforms'),
                    'type'        => 'integer',
                    'context'     => ['view', 'edit', 'embed'],
                    'readonly'    => true,
                ],
                'formFields'        => [
                    'description' => esc_html__('Fields.', 'kaliforms'),
                    'type'        => 'object',
                ],
                'formGrid'          => [
                    'description' => esc_html__('Grid.', 'kaliforms'),
                    'type'        => 'object',
                ],
                'formOptions'       => [
                    'description' => esc_html__('Form options.', 'kaliforms'),
                    'type'        => 'object',
                ],
                'formNotifications' => [
                    'description' => esc_html__('Form notifications, that include emails and sms.', 'kaliforms'),
                    'type'        => 'array',
                ],
                'immutableState'    => [
                    'description' => esc_html__('Immutable data, that is needed for form building', 'kaliforms'),
                    'type'        => 'object',
                ],
                'plugins'           => [
                    'description' => esc_html__('What plugins we have installed.', 'kaliforms'),
                    'type'        => 'object',
                ],
            ],
        ];

        return $this->schema;
    }
    /**
     * Determines the allowed query_vars for a get_items() response and prepares
     * them for WP_Query.
     *
     * @since 4.7.0
     *
     * @param array           $prepared_args Optional. Prepared WP_Query arguments. Default empty array.
     * @param WP_REST_Request $request       Optional. Full details about the request.
     * @return array Items query arguments.
     */
    protected function prepare_items_query($prepared_args = [], $request = null)
    {
        $query_args = [];

        foreach ($prepared_args as $key => $value) {
            $query_args[$key] = apply_filters("rest_query_var-{$key}", $value);
        }
        $query_args['ignore_sticky_posts'] = true;

        if (isset($query_args['orderby']) && isset($request['orderby'])) {
            $orderby_mappings = [
                'id'            => 'ID',
                'include'       => 'post__in',
                'slug'          => 'post_name',
                'include_slugs' => 'post_name__in',
            ];

            if (isset($orderby_mappings[$request['orderby']])) {
                $query_args['orderby'] = $orderby_mappings[$request['orderby']];
            }
        }

        return $query_args;
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
    /**
     * Get options and sanitize them so we can update them
     *
     * @param [type] $request
     * @return void
     */
    private function _get_options_to_update($request)
    {
        $options      = [];
        $content_type = $request->get_content_type();
        if ($content_type['value'] === 'application/x-www-form-urlencoded') {
            parse_str($request->get_body(), $params);
        }

        if ($content_type['value'] === 'application/json') {
            $params = $request->get_json_params();
        }

        foreach ($params as $key => $value) {
            $options[$this->_convert_to_snake_case($key)] = $value;
        }

        $options = $this->_sanitize_values($options);

        return $options;
    }
    /**
     * Returns a camel case string
     *
     * @param [type] $string
     * @return void
     */
    private function _convert_to_camel_case($string)
    {
        return lcfirst(str_replace(' ', '', ucwords(str_replace('_', ' ', $string))));
    }
    /**
     * Return a snake case string
     *
     * @param [type] $string
     * @return void
     */
    private function _convert_to_snake_case($string)
    {
        return strtolower(preg_replace('/(?<!^)[A-Z]/', '_$0', $string));
    }
    /**
     * Prefix our string
     *
     * @param [type] $string
     * @return void
     */
    private function _prefix_string($string)
    {
        return $this->slug . '_' . $string;
    }
    /**
     * Sanitize values
     *
     * @param [type] $options
     * @return void
     */
    private function _sanitize_values($options)
    {
        $sanitized = [];
        $meta      = Meta_Save::get_instance();
        foreach ($options as $key => $value) {
            $sanitizedOption = $meta->sanitize_option($key, $value);
            if ($sanitizedOption === null) {
                continue;
            }

            $sanitized[$this->_prefix_string($key)] = $sanitizedOption;
        }

        return $sanitized;
    }
    /**
     * Retrieve options from database
     *
     * @param [type] $id
     * @param [type] $options
     * @return void
     */
    private function _get_options($id, $options)
    {
        $returner = [];
        $options  = explode(',', $options);
        foreach ($options as $option) {
            $returner[$option] = $this->_get_value($id, $option);
        }

        return $returner;
    }
    /**
     * Update item meta
     *
     * @param [int] $id
     * @param [array] $options
     * @return void
     */
    private function _update_item_meta($id, $options)
    {
        $updated = [];
        foreach ($options as $key => $value) {
            $updated[$key] = update_post_meta($id, $key, $value);
        };
        return $updated;
    }
    /**
     * Return option value
     *
     * @param [type] $id
     * @param [type] $option
     * @return void
     */
    private function _get_value($id, $option)
    {
        $option = array_key_exists($option, $this->options) ? $this->options[$option] : $option;
        $value  = get_post_meta(
            $id,
            $this->_prefix_string($this->_convert_to_snake_case($option)),
            true
        );

        return $this->_middleware($option, $value);
    }
}
