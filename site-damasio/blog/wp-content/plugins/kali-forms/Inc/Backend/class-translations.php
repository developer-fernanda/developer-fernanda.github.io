<?php

namespace KaliForms\Inc\Backend;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Class Translations is used to translate stuff
 *
 * @package App\Libraries
 */
class Translations
{
    /**
     * Translations array
     *
     * @var array
     */
    public $translations = [];

    /**
     * Basic constructor
     *
     * Translations constructor
     */
    public function __construct()
    {
        $this->set_general_translations();
        $this->frontend();
        $this->backend();
    }

    /**
     * Set general translations
     *
     * @return array
     */
    public function set_general_translations()
    {
    }

    public function frontend()
    {
        $this->translations['frontend'] = [
            'filePond' => [
                'labelIdle' => sprintf(
                    '%s <span class="filepond--label-action"> %s </span>',
                    esc_html__('Drag & Drop your files or', 'kaliforms'),
                    esc_html__('Browse', 'kaliforms')
                ),
            ],
            'general'  => [
                'loading'   => esc_html__('LOADING', 'kaliforms'),
                'recaptcha' => esc_html__('Please complete recaptcha challenge', 'kaliforms'),
            ],
        ];

        $this->translations['filePond'] = [
            'labelIdle'                      => sprintf(
                '%s <span class="filepond--label-action"> %s </span>',
                esc_html__('Drag & Drop your files or', 'kaliforms'),
                esc_html__('Browse', 'kaliforms')
            ),
            'labelInvalidField'              => esc_html__('Field contains invalid files', 'kaliforms'),
            'labelFileWaitingForSize'        => esc_html__('Waiting for size', 'kaliforms'),
            'labelFileSizeNotAvailable'      => esc_html__('Size not available', 'kaliforms'),
            'labelFileLoading'               => esc_html__('Loading', 'kaliforms'),
            'labelFileLoadError'             => esc_html__('Error during load', 'kaliforms'),
            'labelFileProcessing'            => esc_html__('Uploading', 'kaliforms'),
            'labelFileProcessingComplete'    => esc_html__('Upload complete', 'kaliforms'),
            'labelFileProcessingAborted'     => esc_html__('Upload cancelled', 'kaliforms'),
            'labelFileProcessingError'       => esc_html__('Error during upload', 'kaliforms'),
            'labelFileProcessingRevertError' => esc_html__('Error during revert', 'kaliforms'),
            'labelFileRemoveError'           => esc_html__('Error during remove', 'kaliforms'),
            'labelTapToCancel'               => esc_html__('tap to cancel', 'kaliforms'),
            'labelTapToRetry'                => esc_html__('tap to retry', 'kaliforms'),
            'labelTapToUndo'                 => esc_html__('tap to undo', 'kaliforms'),
            'labelButtonRemoveItem'          => esc_html__('Remove', 'kaliforms'),
            'labelButtonAbortItemLoad'       => esc_html__('Abort', 'kaliforms'),
            'labelButtonRetryItemLoad'       => esc_html__('Retry', 'kaliforms'),
            'labelButtonAbortItemProcessing' => esc_html__('Cancel', 'kaliforms'),
            'labelButtonUndoItemProcessing'  => esc_html__('Undo', 'kaliforms'),
            'labelButtonRetryItemProcessing' => esc_html__('Retry', 'kaliforms'),
            'labelButtonProcessItem'         => esc_html__('Upload', 'kaliforms'),
        ];
    }

    public function backend()
    {
    }
}
