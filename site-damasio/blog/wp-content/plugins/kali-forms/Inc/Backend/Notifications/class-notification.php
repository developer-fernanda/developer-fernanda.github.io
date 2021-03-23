<?php

namespace KaliForms\Inc\Backend\Notifications;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Notification class
 */
class Notification
{
    /**
     * ID of the notification
     *
     * @var string
     */
    public $id = '';
    /**
     * Can be info / error / warning
     *
     * @var string
     */
    public $type = '';
    /**
     * Message string
     *
     * @var string
     */
    public $message = '';
    /**
     * Action
     *
     * @var string
     */
    public $action = '';
    /**
     * Action type can be ajax / redirect / info
     *
     * @var string
     */
    public $actionType = '';
    /**
     * Dismissable
     *
     * @var boolean
     */
    public $dismissable = false;
    /**
     * Class constructor
     *
     * @param string $id
     * @param string $type
     * @param string $message
     * @param string $action_type
     * @param string $action
     * @param boolean $dismissable
     */
    public function __construct($id = '', $type = 'info', $message = '', $action_type = '', $action = '', $dismissable = false)
    {
        $this->set_id($id);
        $this->set_type($type);
        $this->set_message($message);
        $this->set_action($action);
        $this->set_action_type($action_type);
        $this->set_dismissable($dismissable);
    }
    /**
     * Dismissable
     *
     * @param [type] $state
     * @return void
     */
    public function set_dismissable($state)
    {
        $this->dismissable = $state;
    }
    /**
     * Set id
     *
     * @return void
     */
    public function set_id($id)
    {
        $this->id = $id;
    }
    /**
     * Type setter
     *
     * @param [type] $type
     * @return void
     */
    public function set_type($type)
    {
        $this->type = $type;
    }
    /**
     * Message setter
     *
     * @param [type] $message
     * @return void
     */
    public function set_message($message)
    {
        $this->message = $message;
    }
    /**
     * Action setter
     *
     * @param [type] $action
     * @return void
     */
    public function set_action($action)
    {
        $this->action = $action;
    }
    /**
     * Action type setter
     *
     * @param [type] $action_type
     * @return void
     */
    public function set_action_type($action_type)
    {
        $this->actionType = $action_type;
    }
}
