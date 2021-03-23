<?php
namespace KaliForms\Inc\Frontend;

// use KaliForms\Inc\Utils\Akismet;
// use KaliForms\Inc\Utils\Emailer;
// use KaliForms\Inc\Utils\FileManager;
// use KaliForms\Inc\Utils\GeneralPlaceholders;
// use KaliForms\Inc\Utils\MetaHelper;
use KaliForms\Inc\Utils\Post_Translator;

if (!defined('WPINC')) {
    die;
}

class Processor
{
    /**
     * Form id
     *
     * @var [type]
     */
    public $form_id = null;
    /**
     * Form data
     */
    public $form_data = [];
    /**
     * Placeholders
     *
     * @var array
     */
    public $placeholders = [];
    /**
     * Fields
     *
     * @var array
     */
    public $fields = [];
    /**
     * Emails
     */
    public $emails = [];
    /**
     * Options
     *
     * @var array
     */
    public $options = [];
    /**
     * Class constructor
     */
    public function __construct($form_id, $form_data)
    {
        $this->form_id   = (int) $form_id;
        $this->form_data = $form_data;

        $this->_build_translators();
        $this->_build_placeholders();
    }
	/**
	 * Process function
	 *
	 * @return void
	 */
    public function process()
    {
     
    }
    /**
     * Build translators
     *
     * @return void
     */
    private function _build_translators()
    {
        $translator = new Post_Translator($this->form_id);
        $translator->construct_these('formFields', 'formOptions', 'formNotifications');
        $this->fields  = $translator->formFields;
        $this->options = $translator->formOptions;

        $this->emails = $translator->formNotifications['emails'];
    }
    /**
     * Build placeholders
     *
     * @return void
     */
    private function _build_placeholders()
    {

    }
}
