<?php
namespace KaliForms\Inc\Utils;

/**
 * Trait MetaHelper
 *
 * @package Inc\Utils
 */
trait MetaHelper
{
    /**
     * Shortcut for get_post_meta
     *
     * @param string $key
     * @param mixed  $default
     *
     * @return mixed
     */
    public function get($key = '', $default = null)
    {
        if (null === $this->post) {
            global $post;

            if (null === $post) {
                return false;
            }
            $this->post = $post;
        }

        $value = get_post_meta($this->post->ID, $this->slug . '_' . $key, true);
        if ($value === null || $value === '' && $default !== null) {
            return $default;
        }

        return $value;
    }

    /**
     * Shortcut for update_post_meta
     *
     * @param string $key
     * @param mixed  $value
     *
     * @return mixed
     */
    public function set($key = '', $value = '')
    {
        if (null === $this->post) {
            global $post;
            $this->post = $post;
        }

        update_post_meta($this->post->ID, $this->slug . '_' . $key, $value);

        return $value;
    }

}
