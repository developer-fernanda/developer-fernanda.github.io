<?php

namespace KaliForms\Inc\Backend;

if (!defined('ABSPATH')) {
    exit;
}

use KaliForms\Inc\Backend\Notifications;

/**
 * Global notification class ( rendered in the app )
 */
class Global_Notifications
{
    /**
     * Plugin slug
     *
     * @var string
     */
    protected $slug = 'kaliforms';

    /**
     * Notifications
     *
     * @var array
     */
    public $notifications = [];
    /**
     * Class constructor
     */
    public function __construct()
    {
        $this->set_notifications();
    }
    /**
     * Sets notifications
     *
     * @return void
     */
    public function set_notifications()
    {
        $this->notifications = apply_filters($this->slug . '_hook_external_notifications', $this->notifications);
    }

}
