<?php

namespace KaliForms\Inc\Backend;

if (!defined('ABSPATH')) {
    exit;
}

class Dashboard_Widget
{
    /**
     * Plugin slug
     *
     * @var string
     */
    public $slug = 'kaliforms';
    /**
     * Basic constructor
     */
    public function __construct()
    {
        add_action('wp_dashboard_setup', [$this, 'add_widgets']);
    }

    /**
     * Add widget
     *
     * @return void
     */
    public function add_widgets()
    {
        wp_add_dashboard_widget(
            $this->slug . '_dashboard_widget',
            esc_html__('WordPress Forms Made Easy - Kali Forms', 'kaliforms'),
            [$this, 'render_widget']
        );

        global $wp_meta_boxes;
        $default_dashboard = $wp_meta_boxes['dashboard']['normal']['core'];

        $widget_bkup = array($this->slug . '_dashboard_widget' => $default_dashboard[$this->slug . '_dashboard_widget']);
        unset($default_dashboard[$this->slug . '_dashboard_widget']);
        $sorted_dashboard = array_merge($widget_bkup, $default_dashboard);

        $wp_meta_boxes['dashboard']['normal']['core'] = $sorted_dashboard;
    }
    /**
     * Renderer
     *
     * @return void
     */
    public function render_widget()
    {
        $str = '';
        $str .= '<img src="' . KALIFORMS_URL . 'assets/img/logo--dark.svg" />';
        $str .= $this->cta_section();
        $str .= $this->created_forms_section();
        $str .= $this->latest_blog_posts_section();
        echo $str;
    }

    /**
     * Cta section
     *
     * @return string
     */
    public function cta_section()
    {
        $str = '<p>' . esc_html__('Meet Kali Forms. The powerful & user-friendly WordPress form plugin. Easily create powerful contact forms, payment forms, feedback forms and more for your website without the hassle.', 'kaliforms') . '</p>';
        $str .= '<p class="action-buttons"><a href="' . admin_url() . 'post-new.php?post_type=kaliforms_forms" class="button button-primary" style="margin-right:10px">' . esc_html__('Create forms!', 'kaliforms') . '</a><a href="https://kaliforms.com/docs?utm_source=dashboardWidget&utm_campaign=userInterests&utm_medium=button" class="button" target="_blank" style="margin-right:10px">' . esc_html__('Read the docs', 'kaliforms') . '</a><a href="https://kaliforms.com/pricing?utm_source=dashboardWidget&utm_campaign=userInterests&utm_medium=button" target="_blank" class="button button-primary">' . esc_html__('Upgrade to PRO', 'kaliforms') . '</a></p><br />';
        return $str;
    }
    /**
     * Created forms section
     *
     * @return void
     */
    public function created_forms_section()
    {
        $str   = '';
        $posts = new \WP_Query(['post_type' => $this->slug . '_forms', 'posts_per_page' => 3]);
        if ($posts->have_posts()) {
            $str .= '<hr /><br />';
            $str .= '<h3><strong>' . esc_html__('Latest stats', 'kaliforms') . '</strong></h3>';
            $str .= '<table class="wp-list-table widefat striped">';
            $str .= '<thead><tr>
			<th>' . esc_html__('Title', 'kaliforms') . '</th>
			<th>' . esc_html__('Entries', 'kaliforms') . '</th>
			<th style="text-align:right">' . esc_html__('Actions', 'kaliforms') . '</th>
			</tr></thead>';
            $str .= '<tbody>';
            while ($posts->have_posts()) {
                $posts->the_post();
                $str .= '<tr>';
                $str .= '<td>';
                $str .= get_the_title();
                $str .= '</td>';
                $str .= '<td>';
                $str .= $this->get_entries(get_the_ID());
                $str .= '</td>';
                $str .= '<td style="text-align:right">';
                $str .= '<a href="' . admin_url() . 'post.php?post=' . get_the_ID() . '&action=edit" target="_blank"><span class="dashicons dashicons-edit"></span></a>';
                $str .= '</td>';
                $str .= '</tr>';
            }
            $str .= '</tbody>';
            $str .= '</table><br />';
        }
        wp_reset_postdata();
        return $str;
    }

    /**
     * Get entries per id
     *
     * @param [type] $id
     * @return void
     */
    public function get_entries($id)
    {
        $args = [
            'post_type'      => $this->slug . '_submitted',
            'meta_key'       => 'formId',
            'posts_per_page' => -1,
            'meta_query'     => [
                [
                    'key'     => 'formId',
                    'value'   => $id,
                    'compare' => '=',
                ],
            ],
        ];

        $query   = new \WP_Query($args);
        $counter = 0;
        if ($query->have_posts()) {
            $counter = $query->post_count;
        }
        wp_reset_postdata();

        if (defined('KAZLIFORMS_SUBMISSIONS_PLUGIN_FILE')) {
            $str = '<a href="edit.php?post_type=kaliforms_submitted&formId=' . $id . '">' . $counter . '</a>';
            return $str;
        }
        return $counter;
    }

    /**
     * Gets the latest blog posts
     *
     * @return void
     */
    public function latest_blog_posts_section()
    {
        $str = '';
        $str .= '<hr /><br />';
        $str .= '<h3><strong>' . esc_html__('Latest from our blog', 'kaliforms') . '</strong></h3>';
        $posts = $this->get_latest_blog_posts();
        if (empty($posts)) {
            return '';
        }

        $i = 0;
        foreach ($posts as $post) {
            $str .= '<h4><a href="' . esc_url($post['link']) . '?utm_source=dashboardWidget&utm_campaign=userInterests&utm_medium=blogPostLink" target="_blank">' . esc_html($post['title']) . '</a></h4>';
            $str .= wp_kses_post($post['excerpt']);
            $i++;
            if ($i < count($posts)) {
                $str .= '<hr />';
            }
        }

        $str .= '<hr /><br />';
        $str .= '<a class="button button-primary" target="_blank" href="https://www.kaliforms.com/blog?utm_source=dashboardWidget&utm_campaign=userInterests&utm_medium=dashboardLink">' . esc_html__('Read more on our blog', 'kaliforms') . '</a>';
        return $str;
    }

    public function get_latest_blog_posts()
    {
        $blog_posts = get_transient($this->slug . '_latest_blog_posts');
        if (false === $blog_posts) {
            $url      = KALIFORMS_BASE_API . 'posts?tags=560&per_page=3';
            $response = wp_remote_get($url);

            if (!is_wp_error($response)) {
                $data  = json_decode(wp_remote_retrieve_body($response), true);
                $posts = [];
                if (!empty($data) && is_array($data)) {
                    foreach ($data as $post) {
                        $posts[] = [
                            'title'   => $post['title']['rendered'],
                            'excerpt' => $post['excerpt']['rendered'],
                            'link'    => $post['link'],
                        ];
                    }
                }
                set_transient($this->slug . '_latest_blog_posts', $posts, 7 * DAY_IN_SECONDS);
                return $posts;
            }

            return [];
        }
        return $blog_posts;
    }
}
