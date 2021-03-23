<?php
namespace KaliForms\Inc\Utils;

/**
 * Trait TransientHelper
 *
 * @package Inc\Utils
 */
trait TransientHelper
{
    /**
     * Adds a transient to the website
     *
     * @return void
     */
    public function add_transient($id, $value, $expiration)
    {

    }

    /**
     * Removes transient
     */
    public function remove_transient($id, $value)
    {

    }

    /**
     * Schedules an event
     *
     * @return void
     */
    public function schedule_event($action, $function)
    {

    }

    /**
     * Delets a transient file
     *
     * @param [type] $args
     * @return void
     */
    public function delete_transient_file($id)
    {
        $transient = get_transient('kaliforms_dont_delete_this_image_' . absint($id));
        if (!$transient) {
            return wp_delete_post(absint($id));
        }

        delete_transient('kaliforms_dont_delete_this_image_' . absint($id));
	}
}
