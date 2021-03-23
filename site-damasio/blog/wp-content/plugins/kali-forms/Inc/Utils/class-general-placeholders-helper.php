<?php
namespace KaliForms\Inc\Utils;

/**
 * Class General_Placeholders_Helper
 *
 * @package Inc\Utils
 */

class General_Placeholders_Helper
{
    /**
     * Plugin slug
     *
     * @var string
     */
    public static $slug = 'kaliforms';

    /**
     * Returns a counter for the form entries
     *
     * @param [type] $id
     * @return void
     */
    public static function count_form_entries($id)
    {
        $args = [
            'post_type'      => self::$slug . '_submitted',
            'posts_per_page' => -1,
            'meta_key'       => 'formId',
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

        return $counter;
    }

    /**
     * Returns the current permalink
     *
     * @param [type] $id
     * @return void
     */
    public static function get_current_permalink()
    {
        if (!isset($_SERVER)) {
            return '';
        }
        if (!isset($_SERVER['HTTP_REFERER'])) {
            return '';
        }

        return esc_url($_SERVER['HTTP_REFERER']);
    }
}
