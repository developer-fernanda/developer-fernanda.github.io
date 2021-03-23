<?php

namespace KaliForms\Inc\Backend\Rest;

if (!defined('ABSPATH')) {
    exit;
}

use KaliForms\Inc\Utils\Post_Translator;
use KaliForms\Inc\Utils\Submission_Action_Helper as Action_Helper;

class Form_Entries_Rest_Controller extends \WP_REST_Controller
{
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
     * Meta fields
     *
     * @var array
     */
    public $meta_fields = [];
    /**
     * Display fields for the current form ( detailed look )
     *
     * @var array
     */
    public $display_fields = [];
    /**
     * Multiple item separator
     *
     * @var string
     */
    public $separator = ',';
    /**
     * Post type
     *
     * @var string
     */
    public $post_type = 'kaliforms_submitted';
    /**
     * Class constructor
     */
    public function __construct()
    {
        $this->namespace              = $this->slug . '/v1';
        $this->resource_name          = 'entries';
        $this->singular_resource_name = 'entry';
    }
    /**
     * Route registration
     *
     * @return void
     */
    public function register_routes()
    {
        register_rest_route(
            $this->namespace, '/' . $this->resource_name . '/(?P<id>[\d]+)',
            [
                [
                    'methods'             => 'GET',
                    'callback'            => [$this, 'get_items'],
                    'permission_callback' => [$this, 'get_items_permissions_check'],
                    'args'                => $this->get_collection_params(),
                ],
            ]
        );

        register_rest_route(
            $this->namespace, '/' . $this->resource_name . '/parsed/(?P<id>[\d]+)',
            [
                'methods'             => 'GET',
                'callback'            => [$this, 'get_items_for_display'],
                'permission_callback' => [$this, 'get_items_permissions_check'],
                'args'                => $this->get_collection_params(),
            ]
        );

        register_rest_route(
            $this->namespace, '/' . $this->resource_name . '/aggregate/',
            [
                'methods'             => 'GET',
                'callback'            => [$this, 'get_items_aggregate'],
                'permission_callback' => [$this, 'get_items_permissions_check'],
                'args'                => $this->get_collection_params(),
            ]
        );

        register_rest_route(
            $this->namespace, '/' . $this->resource_name . '/aggregate/parsed',
            [
                'methods'             => 'GET',
                'callback'            => [$this, 'get_items_aggregate_for_display'],
                'permission_callback' => [$this, 'get_items_permissions_check'],
                'args'                => $this->get_collection_params(),
            ]
        );

        register_rest_route(
            $this->namespace, '/' . $this->resource_name . '/(?P<id>[\d]+)',
            [
                'methods'             => 'PATCH',
                'callback'            => [$this, 'edit_item'],
                'permission_callback' => [$this, 'edit_item_check'],
            ]
        );

        register_rest_route(
            $this->namespace, '/' . $this->resource_name . '/(?P<id>[\d]+)',
            [
                'methods'             => 'DELETE',
                'callback'            => [$this, 'delete_item'],
                'permission_callback' => [$this, 'edit_item_check'],
            ]
        );

        register_rest_route(
            $this->namespace, '/' . $this->resource_name . '/delete',
            [
                'methods'             => 'POST',
                'callback'            => [$this, 'delete_items'],
                'permission_callback' => [$this, 'edit_item_check'],
            ]
        );

        register_rest_route(
            $this->namespace, '/' . $this->resource_name . '/export',
            [
                'methods'             => 'POST',
                'callback'            => [$this, 'start_export'],
                'permission_callback' => [$this, 'edit_item_check'],
            ]
        );

        register_rest_route(
            $this->namespace, '/' . $this->resource_name . '/export/google-sheets',
            [
                'methods'             => 'GET',
                'callback'            => [$this, 'get_sheets'],
                'permission_callback' => [$this, 'edit_item_check'],
            ]
        );

        register_rest_route(
            $this->namespace, '/' . $this->resource_name . '/resend-emails',
            [
                'methods'             => 'POST',
                'callback'            => [$this, 'resend_emails'],
                'permission_callback' => [$this, 'edit_item_check'],
            ]
        );
        register_rest_route(
            $this->namespace, '/' . $this->resource_name . '/frontend-link',
            [
                'methods'             => 'POST',
                'callback'            => [$this, 'get_frontend_link'],
                'permission_callback' => [$this, 'get_items_permissions_check'],
            ]
        );
        register_rest_route(
            $this->namespace, '/' . $this->singular_resource_name . '/(?P<id>[\d]+)',
            [
                'methods'             => 'GET',
                'callback'            => [$this, 'get_item'],
                'permission_callback' => [$this, 'get_items_permissions_check'],
                'args'                => $this->get_collection_params(),
            ]
        );
    }
    /**
     * Returns the frontend link
     *
     * @param [type] $request
     * @return void
     */
    public function get_frontend_link($request)
    {
        $params = $request->get_json_params();
        if (get_post_type((int) $params['id']) !== $this->slug . '_submitted') {
            return rest_ensure_response(['status' => false, 'message' => 'post is not an entry']);
        }
        if (get_post_type((int) $params['formId']) !== $this->slug . '_forms') {
            return rest_ensure_response(['status' => false, 'message' => 'post is not a form']);
        }

        return rest_ensure_response([
            'status' => true,
            'url'    => Action_Helper::get_submission_link(false, $params['id'], $params['formId']),
        ]);
    }
    /**
     * Resend emails
     *
     * @param [type] $request
     * @return void
     */
    public function resend_emails($request)
    {
        $params = $request->get_json_params();
        if (get_post_type((int) $params['id']) !== $this->slug . '_submitted') {
            return rest_ensure_response(['status' => false, 'message' => 'post is not an entry']);
        }
        if (get_post_type((int) $params['formId']) !== $this->slug . '_forms') {
            return rest_ensure_response(['status' => false, 'message' => 'post is not a form']);
        }

        $action = new Action_Helper((int) $params['formId'], (int) $params['id']);
        if (is_wp_error($action)) {
            return rest_ensure_response([
                'status'  => false,
                'message' => sprintf('Soemthing wrong with formId: %s or submissionID : %s', $params['formId'], $params['id']),
            ]);
        }

        $status = $action->send_emails();
        if (is_wp_error($status)) {
            return rest_ensure_response(['status' => false, 'message' => 'Sending failed']);
        }

        return rest_ensure_response($status === 'ok'
            ? ['status' => true, 'message' => 'Notifications sent']
            : ['status' => false, 'message' => 'Status did not return `ok`']
        );
    }
    /**
     * Returns the google sheets
     *
     * @param [type] $request
     * @return void
     */
    public function get_sheets($request)
    {
        if (!class_exists('KaliForms\Inc\Utils\Export')) {
            return rest_ensure_response(['status' => false, 'message' => __('Upgrade to PRO', 'kaliforms')]);
        }

        if (!class_exists('KaliForms\Inc\Google_Sheets_Helper')) {
            return rest_ensure_response(['status' => false, 'message' => __('Google Sheets plugin not installed', 'kaliforms')]);
        }

        $export = new \KaliForms\Inc\Utils\Export();

        return $export->get_sheets($request);
    }
    /**
     * Start export function
     *
     * @param [type] $request
     * @return void
     */
    public function start_export($request)
    {
        if (!class_exists('KaliForms\Inc\Utils\Export')) {
            return rest_ensure_response(['status' => false, 'message' => __('Upgrade to PRO', 'kaliforms')]);
        }

        $params = $request->get_json_params();

        $this->_get_available_meta((int) $params['form']);

        $export = new \KaliForms\Inc\Utils\Export();
        $export->set_stuff(
            $this->display_fields,
            $this->meta_fields,
            $this->separator
        );

        return $export->start_export($request);
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
     * Edit item request
     *
     * @param [type] $request
     * @return void
     */
    public function edit_item($request)
    {
        $options  = $this->_get_options_to_update($request);
        $response = $this->_update_item_meta((int) $request['id'], $options);

        return rest_ensure_response($response);
    }
    /**
     * Delete item
     *
     * @param [type] $request
     * @return void
     */
    public function delete_item($request)
    {
        $post_type = get_post_type((int) $request['id']);
        if ($post_type !== $this->slug . '_submitted') {
            return rest_ensure_response(['status' => false]);
        }
        $deleted = wp_delete_post($request['id'], true);
        return rest_ensure_response(['status' => $deleted]);
    }
    /**
     * Delete multiple items
     *
     * @param [type] $request
     * @return void
     */
    public function delete_items($request)
    {
        $params  = $request->get_json_params();
        $deleted = [];
        foreach ($params['ids'] as $id) {
            if (get_post_type((int) $id) !== $this->slug . '_submitted') {
                continue;
            }

            $deleted[] = wp_delete_post($id, true);
        }
        return rest_ensure_response(['status' => true, 'deleted' => $deleted]);
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
     * Get options and sanitize them so we can update them
     *
     * @param [type] $request
     * @return void
     */
    private function _get_options_to_update($request)
    {
        $content_type = $request->get_content_type();
        if ($content_type['value'] === 'application/x-www-form-urlencoded') {
            parse_str($request->get_body(), $params);
        }

        if ($content_type['value'] === 'application/json') {
            $params = $request->get_json_params();
        }

        $options = $this->_sanitize_values($params);
        return $options;
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

        foreach ($options as $k => $v) {
            if (is_array($v) && isset($v['id']) && isset($v['img'])) {
                $sanitized[sanitize_text_field($k)] = absint($v['id']);
                continue;
            }
            $sanitized[sanitize_text_field($k)] = sanitize_text_field($v);
        }
        return $sanitized;
    }
    /**
     * Initial routine
     *
     * @param [type] $request
     * @return void
     */
    private function _initial_routine($request)
    {
        $this->_get_available_meta((int) $request['id']);

        $posts_per_page = isset($request['per_page']) ? (int) $request['per_page'] : 10;
        $args           = [
            'posts_per_page' => $posts_per_page,
            'post_type'      => $this->slug . '_submitted',
            'status'         => 'published',
        ];

        $args['meta_query'] = $this->create_meta_query($request);
        $args['date_query'] = $this->create_date_query($request);

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

        return $args;
    }
    /**
     * Initial routine for aggregate request
     *
     * @param [type] $request
     * @return void
     */
    private function _initial_routine_aggregate($request)
    {
        $this->_get_available_meta_aggregate($request);

        $posts_per_page = isset($request['per_page']) ? (int) $request['per_page'] : 10;
        $args           = [
            'posts_per_page' => $posts_per_page,
            'post_type'      => $this->slug . '_submitted',
            'status'         => 'published',
        ];

        $args['meta_query'] = $this->create_meta_query_aggregate($request);
        $args['date_query'] = $this->create_date_query($request);

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

        return $args;

    }
    /**
     * Retrieve total posts
     */
    private function _get_total_posts($posts_query, $query_args)
    {
        $total_posts = $posts_query->found_posts;

        if ($total_posts < 1) {
            unset($query_args['paged']);
            $count_query = new \WP_Query();
            $count_query->query($query_args);
            $total_posts = $count_query->found_posts;
        }

        return $total_posts;
    }
    /**
     * Prepare response
     */
    private function _prepare_response($request, $posts, $total_posts, $max_pages, $page)
    {
        $request_params = $request->get_query_params();

        $response = rest_ensure_response($posts);
        $response->header('X-WP-Total', $total_posts);
        $response->header('X-WP-TotalPages', $max_pages);
        $response->header('X-WP-CurrentPage', $page);
        $response->header('X-WP-PerPage', (int) $request_params['per_page']);
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
     * Get items aggregate for display
     *
     * @param [type] $request
     * @return void
     */
    public function get_items_aggregate_for_display($request)
    {
        $params = $request->get_params();
        if (!isset($params['forms'])) {
            return new \WP_Error(
                'rest_post_invalid_forms',
                esc_html__('You need to query data for certain forms. It can\'t be null.', 'kaliforms'),
                ['status' => 400]
            );
        }

        $args         = $this->_initial_routine_aggregate($request);
        $query_args   = $this->prepare_items_query($args, $request);
        $posts_query  = new \WP_Query();
        $query_result = $posts_query->query($query_args);
        $posts        = [];
        foreach ($query_result as $post) {
            $formId  = get_post_meta($post->ID, 'formId', true);
            $data    = $this->prepare_item_for_aggregate_display_response($post, $request, $formId);
            $posts[] = $this->prepare_response_for_collection($data);
        }
        $total_posts = $this->_get_total_posts($posts_query, $query_args);

        $max_pages = ceil($total_posts / (int) $posts_query->query_vars['posts_per_page']);
        $page      = (int) $query_args['paged'];

        if ($page > $max_pages && $total_posts > 0) {
            return new WP_Error(
                'rest_post_invalid_page_number',
                esc_html__('The page number requested is larger than the number of pages available.', 'kaliforms'),
                ['status' => 400]
            );
        }

        $response = $this->_prepare_response($request, $posts, (int) $total_posts, (int) $max_pages, $page);

        return $response;
    }
    /**
     * Aggregate all items
     *
     * @param [type] $request
     * @return void
     */
    public function get_items_aggregate($request)
    {
        $params = $request->get_params();
        if (!isset($params['forms'])) {
            return new \WP_Error(
                'rest_post_invalid_forms',
                esc_html__('You need to query data for certain forms. It can\'t be null.', 'kaliforms'),
                ['status' => 400]
            );
        }

        $args         = $this->_initial_routine_aggregate($request);
        $query_args   = $this->prepare_items_query($args, $request);
        $posts_query  = new \WP_Query();
        $query_result = $posts_query->query($query_args);

        $posts = [];
        foreach ($query_result as $post) {
            $formId  = get_post_meta($post->ID, 'formId', true);
            $data    = $this->prepare_item_for_response($post, $request, $formId);
            $posts[] = $this->prepare_response_for_collection($data);
        }

        $total_posts = $this->_get_total_posts($posts_query, $query_args);

        $max_pages = ceil($total_posts / (int) $posts_query->query_vars['posts_per_page']);
        $page      = (int) $query_args['paged'];

        if ($page > $max_pages && $total_posts > 0) {
            return new WP_Error(
                'rest_post_invalid_page_number',
                esc_html__('The page number requested is larger than the number of pages available.', 'kaliforms'),
                ['status' => 400]
            );
        }

        $response = $this->_prepare_response($request, $posts, (int) $total_posts, (int) $max_pages, $page);

        return $response;
    }
    /**
     * Get one item
     *
     * @param [type] $request
     * @return void
     */
    public function get_item($request)
    {
        $form_id = get_post_meta((int) $request['id'], 'formId', true);
        $this->_get_available_meta((int) $form_id);
        $fakeObj     = new \stdClass();
        $fakeObj->ID = $request['id'];
        $submission  = $this->prepare_item_for_display_response($fakeObj, ['id' => $form_id]);

        return rest_ensure_response($submission);
    }
    /**
     * Grabs the items and returns them
     *
     * @param WP_REST_Request $request Current request.
     */
    public function get_items($request)
    {
        $args = $this->_initial_routine($request);

        $query_args   = $this->prepare_items_query($args, $request);
        $posts_query  = new \WP_Query();
        $query_result = $posts_query->query($query_args);

        $posts = [];
        foreach ($query_result as $post) {
            $data    = $this->prepare_item_for_response($post, $request);
            $posts[] = $this->prepare_response_for_collection($data);
        }

        $total_posts = $this->_get_total_posts($posts_query, $query_args);

        $max_pages = ceil($total_posts / (int) $posts_query->query_vars['posts_per_page']);
        $page      = (int) $query_args['paged'];

        if ($page > $max_pages && $total_posts > 0) {
            return new WP_Error(
                'rest_post_invalid_page_number',
                esc_html__('The page number requested is larger than the number of pages available.', 'kaliforms'),
                ['status' => 400]
            );
        }

        $response = $this->_prepare_response($request, $posts, (int) $total_posts, (int) $max_pages, $page);

        return $response;
    }

    /**
     * Get items for display
     *
     * @param [type] $request
     * @return void
     */
    public function get_items_for_display($request)
    {
        $args = $this->_initial_routine($request);

        $query_args   = $this->prepare_items_query($args, $request);
        $posts_query  = new \WP_Query();
        $query_result = $posts_query->query($query_args);

        $posts = [];
        foreach ($query_result as $post) {
            $data    = $this->prepare_item_for_display_response($post, $request);
            $posts[] = $this->prepare_response_for_collection($data);
        }
        $total_posts = $this->_get_total_posts($posts_query, $query_args);

        $max_pages = ceil($total_posts / (int) $posts_query->query_vars['posts_per_page']);
        $page      = (int) $query_args['paged'];

        if ($page > $max_pages && $total_posts > 0) {
            return new WP_Error(
                'rest_post_invalid_page_number',
                esc_html__('The page number requested is larger than the number of pages available.', 'kaliforms'),
                ['status' => 400]
            );
        }

        $response = $this->_prepare_response($request, $posts, (int) $total_posts, (int) $max_pages, $page);

        return $response;
    }

    /**
     * Matches the post data to the schema we want.
     *
     * @param WP_Post $post The comment object whose response is being prepared.
     */
    public function prepare_item_for_response($post, $request, $formId = null)
    {
        $post_data = [];
        $schema    = $this->get_item_schema();

        // We are also renaming the fields to more understandable names.
        if (isset($schema['properties']['id'])) {
            $post_data['id'] = (int) $post->ID;
        }

        $meta_fields = $formId !== null ? $this->meta_fields[(int) $formId] : $this->meta_fields;
        foreach ($meta_fields as $field) {
            $post_data[sanitize_text_field($field)] = get_post_meta($post->ID, $field, true);
        }

        return rest_ensure_response($post_data);
    }
    /**
     * Return display ready aggregated data
     *
     * @param [type] $post
     * @param [type] $request
     * @return void
     */
    public function prepare_item_for_aggregate_display_response($post, $request)
    {
        $post_data           = [];
        $post_data['id']     = (int) $post->ID;
        $post_data['formId'] = (int) get_post_meta((int) $post->ID, 'formId', true);
        $post_data['fields'] = [];

        foreach ($this->meta_fields[$post_data['formId']] as $field) {
            $post_data['fields'][] = [
                'id'      => $field,
                'caption' => $this->display_fields[$post_data['formId']][$field]['caption'],
                'type'    => $this->display_fields[$post_data['formId']][$field]['type'],
                'props'   => $this->display_fields[$field]['properties'],
                'value'   => $this->_get_post_meta_value(
                    $this->display_fields[$post_data['formId']][$field]['type'],
                    get_post_meta($post->ID, $field, true),
                    $field
                ),
            ];
        }

        return rest_ensure_response($post_data);
    }
    /**
     * Matches the post data to the schema we want.
     *
     * @param WP_Post $post The comment object whose response is being prepared.
     */
    public function prepare_item_for_display_response($post, $request)
    {
        $post_data              = [];
        $post_data['id']        = (int) $post->ID;
        $post_data['formId']    = (int) $request['id'];
        $post_data['separator'] = $this->separator;
        $post_data['fields']    = [];
        foreach ($this->meta_fields as $field) {
            $post_data['fields'][] = [
                'id'      => $field,
                'caption' => $this->display_fields[$field]['caption'],
                'type'    => $this->display_fields[$field]['type'],
                'props'   => $this->display_fields[$field]['properties'],
                'value'   => $this->_get_post_meta_value(
                    $this->display_fields[$field]['type'],
                    get_post_meta($post->ID, $field, true),
                    $field
                ),
            ];
        }

        $post_data['fields'][] = [
            'id'      => 'date_published',
            'caption' => __('Publish date', 'kaliforms'),
            'type'    => 'date',
            'value'   => get_the_date('Y/m/d g:ia', $post->ID),
        ];

        return rest_ensure_response($post_data);

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
            'title'      => 'form_entries',
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
     * Returns a sane value
     *
     * @param [type] $type
     * @param [type] $value
     * @return void
     */
    private function _get_post_meta_value($type, $value, $field)
    {
        switch ($type) {
            case 'product':
                $obj = [
                    'label' => $this->display_fields[$field]['properties']['caption'],
                    'price' => floatval($this->display_fields[$field]['properties']['price']),
                ];

                return $obj;
            case 'multipleProducts':
                $obj = [
                    'label' => '',
                    'price' => '',
                    'url'   => '',
                ];

                foreach ($this->display_fields[$field]['properties']['products'] as $product) {
                    $product = (array) $product;
                    if ($product['label'] === $value) {
                        $obj = [
                            'label' => $product['label'],
                            'price' => floatval($product['price']),
                        ];

                        if (!empty($product['image']->fullUrl)) {
                            $obj['url'] = $product['image']->fullUrl;
                        }
                    }
                }

                return $obj;
                break;
            case 'imageRadio':
                $obj = [
                    'id'  => $value,
                    'img' => esc_url(wp_get_attachment_url($value)),
                ];
                return $obj;
            case 'fileUpload':
                $title      = [];
                $urls       = [];
                $imagePaths = [];

                $ids      = explode(',', $value);
                $combined = [];
                foreach ($ids as $uId) {
                    $img = wp_get_attachment_url($uId);

                    $upload = [
                        'id'    => $uId,
                        'title' => get_the_title($uId),
                        'url'   => esc_url(wp_get_attachment_url($uId)),
                        'path'  => wp_get_original_image_path($uId),
                    ];

                    $combined[] = $upload;

                    $title[]      = $upload['title'];
                    $urls[]       = $upload['url'];
                    $imagePaths[] = $upload['path'];
                }

                return [
                    'titles'     => $title,
                    'imagePaths' => $imagePaths,
                    'urls'       => $urls,
                    'combined'   => $combined,
                ];
            default:
                return $value;
        }
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
     * Create a meta query
     *
     * @param [type] $request
     * @return void
     */
    protected function create_meta_query($request)
    {
        $args = [
            [
                'key'     => 'formId',
                'value'   => (int) $request['id'],
                'compare' => '=',
            ],
            'key_clause' => [
                'relation' => 'AND',
            ],
        ];

        $params = $request->get_params();
        foreach ($params as $k => $v) {
            if (!in_array($k, $this->meta_fields)) {
                continue;
            }

            $args['key_clause'][] = [
                'key'     => $k,
                'value'   => $v,
                'compare' => '=',
            ];
        }

        return $args;
    }
    /**
     * Returns the date query
     *
     * @param [type] $request
     * @return void
     */
    protected function create_date_query($request)
    {
        $params = $request->get_params();
        if (!isset($params['date_published'])) {
            return [];
        }

        $exploded = explode(',', $params['date_published']);

        return [
            'after'  => $exploded[0],
            'before' => $exploded['1'],
        ];
    }

    /**
     * Creates the meta query aggregated
     *
     * @param [type] $request
     * @return void
     */
    protected function create_meta_query_aggregate($request)
    {
        $params = $request->get_params();
        $args   = [
            [
                'key'     => 'formId',
                'value'   => explode(',', $params['forms']),
                'compare' => 'IN',
            ],
        ];
        $aggregated_meta = array_unique(array_merge(...$this->meta_fields));
        foreach ($params as $k => $v) {
            if (!in_array($k, $aggregated_meta)) {
                continue;
            }

            $args['key_clause'][] = [
                'key'     => $k,
                'value'   => $v,
                'compare' => '=',
            ];
        }

        return $args;
    }

    /**
     * Get available meta
     *
     * @param [type] $id
     * @return void
     */
    private function _get_available_meta($id)
    {
        $fields  = [];
        $display = [];
        $builder = new Post_Translator($id);
        $builder->construct_these('formFields', 'formOptions');

        foreach ($builder->formFields as $field) {
            if (!isset($field->properties->name)) {
                continue;
            }

            $fields[]                          = $field->properties->name;
            $display[$field->properties->name] = [
                'type'       => $field->id,
                'caption'    => $this->_get_caption($field),
                'properties' => (array) $field->properties,
            ];
        }

        $this->meta_fields    = $fields;
        $this->display_fields = $display;
        $this->separator      = $builder->formOptions['multipleSelectionsSeparator'];
    }
    /**
     * Returns all fields for all forms
     *
     * @param [type] $request
     * @return void
     */
    private function _get_available_meta_aggregate($request)
    {
        $fields  = [];
        $display = [];

        $params = $request->get_params();
        $forms  = explode(',', $params['forms']);
        foreach ($forms as $id) {
            $builder = new Post_Translator((int) $id);
            $builder->construct_these('formFields');

            foreach ($builder->formFields as $field) {
                if (!isset($field->properties->name)) {
                    continue;
                }

                $fields[$id][]                          = $field->properties->name;
                $display[$id][$field->properties->name] = [
                    'type'    => $field->id,
                    'caption' => $this->_get_caption($field),
                ];
            }
        }

        $this->meta_fields    = $fields;
        $this->display_fields = $display;
    }
    /**
     * Return a caption
     *
     * @param [type] $props
     * @return void
     */
    private function _get_caption($field)
    {
        $string = isset($field->properties->name) ? $field->properties->name : $field->internalId;
        if (isset($field->properties->caption) && !empty($field->properties->caption)) {
            $string = $field->properties->caption;
        }

        return $string;
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
