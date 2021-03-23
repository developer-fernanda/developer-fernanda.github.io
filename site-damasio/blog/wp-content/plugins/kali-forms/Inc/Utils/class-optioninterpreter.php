<?php
namespace KaliForms\Inc\Utils;

/**
 * Trait Option Interpreter
 *
 * @package Inc\Utils
 */
trait OptionInterpreter
{
    /**
     * Option array
     *
     * @var array
     */
    public $options = [
        'userRegistration' => 'userRegistrationData',
        'newsletter'       => 'newsletterData',
        'slack'            => 'slackData',
        'googleSheets'     => 'googleSheetsData',
    ];
    /**
     * A middleware function
     *
     * @return void
     */
    private function _middleware($option, $value)
    {
        if (in_array($option, ['emails', 'userRegistrationData'])) {
            $value = ($value !== null && $value !== '') ? json_decode($value) : [];
        }

        if (in_array($option, ['fieldComponents'])) {
            $value = ($value !== null && $value !== '') ? json_decode($value, false, 512, JSON_HEX_QUOT) : [];
        }

        return $value;
    }
}
