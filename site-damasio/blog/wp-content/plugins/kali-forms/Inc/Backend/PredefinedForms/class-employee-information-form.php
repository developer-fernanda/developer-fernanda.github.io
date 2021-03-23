<?php

namespace KaliForms\Inc\Backend\PredefinedForms;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Class Eployee_Information_Form
 *
 * @package Inc\Backend\PredefinedForms
 */
class Employee_Information_Form extends Predefined_Form
{
    /**
     * Class constructor
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
        $this->id = 'employeeInformation';
        $this->name = esc_html__('Employee information form', 'kaliforms');
        $this->description = esc_html__('Create a database with your employee information using this form.', 'kaliforms');
        $this->emails = [
            [
                "fromName" => "{first-name} {last-name}",
                "fromEmail" => "{email}",
                "toEmail" => "{admin_email}",
                "replyTo" => "",
                "ccEmail" => "",
                "bccEmail" => "",
                "emailSubject" => "A new employee information was submitted",
                "emailAttachment" => "",
                "emailAttachmentFilePaths" => "",
                "emailAttachmentMediaIds" => "",
                "emailBody" => "<p>Applicant information</p><p>{imagepreview:{photo}}</p><p>{first-name} {last-name} ({email})</p><p>{date-of-birth}</p><p>{phone}</p><p>Address:</p><p>{city}, {state}</p><p>{address1}</p><p>{address2}</p><p>Department: {department}</p><p>Position: {position}</p>",
            ],
        ];
        $this->form_info = [
			'thankYouMessage' => 'Employee added to the database.',
			'showThankYouMessage' => '1',
			'saveFormSubmissions' => '1',
            'requiredFieldMark' => '*',
        ];
        $this->thank_you_message = ['key' => 'thankYouMessage', 'value' => 'Employee added to the database.'];

        $this->grid = [
            ["w" => 6, "h" => 1, "x" => 0, "y" => 0, "i" => "textbox0", "minW" => 3, "maxH" => 1, "moved" => false, "static" => false],
            ["w" => 6, "h" => 1, "x" => 6, "y" => 0, "i" => "textbox1", "minW" => 3, "maxH" => 1, "moved" => false, "static" => false],
            ["w" => 12, "h" => 1, "x" => 0, "y" => 1, "i" => "textbox2", "minW" => 3, "maxH" => 1, "moved" => false, "static" => false],
            ["w" => 12, "h" => 1, "x" => 0, "y" => 3, "i" => "textbox3", "minW" => 3, "maxH" => 1, "moved" => false, "static" => false],
            ["w" => 12, "h" => 1, "x" => 0, "y" => 5, "i" => "textbox4", "minW" => 3, "maxH" => 1, "moved" => false, "static" => false],
            ["w" => 12, "h" => 1, "x" => 0, "y" => 6, "i" => "textbox5", "minW" => 3, "maxH" => 1, "moved" => false, "static" => false],
            ["w" => 7, "h" => 1, "x" => 0, "y" => 2, "i" => "date6", "minW" => 3, "maxH" => 1, "moved" => false, "static" => false],
            ["w" => 12, "h" => 1, "x" => 0, "y" => 8, "i" => "textbox7", "minW" => 3, "maxH" => 1, "moved" => false, "static" => false],
            ["w" => 6, "h" => 1, "x" => 0, "y" => 4, "i" => "textbox8", "minW" => 3, "maxH" => 1, "moved" => false, "static" => false],
            ["w" => 6, "h" => 1, "x" => 6, "y" => 4, "i" => "textbox9", "minW" => 3, "maxH" => 1, "moved" => false, "static" => false],
            ["w" => 12, "h" => 1, "x" => 0, "y" => 9, "i" => "fileUpload10", "minW" => 3, "maxH" => 1, "moved" => false, "static" => false],
            ["w" => 12, "h" => 1, "x" => 0, "y" => 7, "i" => "dropdown11", "minW" => 3, "maxH" => 1, "moved" => false, "static" => false],
            ["w" => 12, "h" => 1, "x" => 0, "y" => 10, "i" => "submitButton12", "minW" => 3, "maxH" => 1, "moved" => false, "static" => false],
        ];
        $this->field_components = [
            ["id" => "textbox", "label" => "Text box", "internalId" => "textbox0", "properties" => ["id" => "first-name", "name" => "first-name", "caption" => "First name", "description" => "", "default" => "", "type" => "text", "placeholder" => "", "required" => true, "readonly" => false], "constraint" => "none"],
            ["id" => "textbox", "label" => "Text box", "internalId" => "textbox1", "properties" => ["id" => "last-name", "name" => "last-name", "caption" => "Last name", "description" => "", "default" => "", "type" => "text", "placeholder" => "", "required" => true, "readonly" => false], "constraint" => "none"],
            ["id" => "textbox", "label" => "Text box", "internalId" => "textbox2", "properties" => ["id" => "email", "name" => "email", "caption" => "Email", "description" => "", "default" => "", "type" => "text", "placeholder" => "", "required" => true, "readonly" => false], "constraint" => "none"],
            ["id" => "textbox", "label" => "Text box", "internalId" => "textbox3", "properties" => ["id" => "phone", "name" => "phone", "caption" => "Phone number", "description" => "", "default" => "", "type" => "text", "placeholder" => "", "required" => true, "readonly" => false], "constraint" => "none"],
            ["id" => "textbox", "label" => "Text box", "internalId" => "textbox4", "properties" => ["id" => "address1", "name" => "address1", "caption" => "Address line 1", "description" => "", "default" => "", "type" => "text", "placeholder" => "", "required" => true, "readonly" => false], "constraint" => "none"],
            ["id" => "textbox", "label" => "Text box", "internalId" => "textbox5", "properties" => ["id" => "address2", "name" => "address2", "caption" => "Address line 2", "description" => "", "default" => "", "type" => "text", "placeholder" => "", "required" => false, "readonly" => false], "constraint" => 0],
            ["id" => "date", "label" => "Date field", "internalId" => "date6", "properties" => ["id" => "date-of-birth", "name" => "date-of-birth", "caption" => "", "description" => "", "default" => "", "required" => true, "readonly" => false], "constraint" => "none"],
            ["id" => "textbox", "label" => "Text box", "internalId" => "textbox7", "properties" => ["id" => "position", "name" => "position", "caption" => "Position", "description" => "", "default" => "", "type" => "text", "placeholder" => "", "required" => true, "readonly" => false], "constraint" => 0],
            ["id" => "textbox", "label" => "Text box", "internalId" => "textbox8", "properties" => ["id" => "city", "name" => "city", "caption" => "City", "description" => "", "default" => "", "type" => "text", "placeholder" => "", "required" => false, "readonly" => false], "constraint" => "none"],
            ["id" => "textbox", "label" => "Text box", "internalId" => "textbox9", "properties" => ["id" => "state", "name" => "state", "caption" => "State", "description" => "", "default" => "", "type" => "text", "placeholder" => "", "required" => false, "readonly" => false], "constraint" => "none"],
            ["id" => "fileUpload", "label" => "File upload", "internalId" => "fileUpload10", "properties" => ["id" => "photo", "name" => "photo", "caption" => "Photo", "description" => "", "default" => "", "maxFileSize" => "", "acceptedExtensions" => "", "filePrefix" => "", "instantUpload" => true, "imagePreview" => true, "required" => false, "readonly" => false], "constraint" => "none"],
            ["id" => "dropdown", "label" => "Dropdown", "internalId" => "dropdown11", "properties" => ["id" => "department", "name" => "department", "caption" => "Department", "description" => "", "default" => "", "choices" => [["value" => "tech", "label" => "Tech"], ["value" => "support", "label" => "Support"], ["value" => "marketing", "label" => "Marketing"]], "required" => true, "readonly" => false], "constraint" => "none"],
            ["id" => "submitButton", "label" => "Submit Button", "internalId" => "submitButton12", "properties" => ["id" => "submit", "caption" => "submit", "description" => ""], "constraint" => "none"],
        ];
    }
}
