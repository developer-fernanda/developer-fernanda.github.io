<?php
namespace KaliForms\Inc\Utils;

class Condition_Checker
{
    /**
     * Condition checker (to process the action or not)
     *
     * @param [stdClass] $action
     * @param [array] $data
     * @return void
     */
    public static function check_conditions($conditions, $data)
    {
        if ($conditions->conditionalLogic === 'always') {
            return true;
        }
        // Fill an array with actual conditions ( some might be empty )
        $conditionsChecker = [];
        foreach ($conditions->conditions as $condition) {
            if (!empty($condition->formField) && !empty($condition->value)) {
                $conditionsChecker[] = $condition;
            }
        }

        if (empty($conditionsChecker)) {
            return true;
        }

        $checker = [];
        foreach ($conditionsChecker as $condition) {
            $checker[] = self::_check_condition($condition, $data);
        }

        $checker = array_filter($checker);

        return $conditions->conditionalLogic === 'any' ? count($checker) > 0 : count($checker) === count($conditionsChecker);
    }
    /**
     * Checks the condition based on its purpose to see if we should proceed or not
     *
     * We verify for the following operators:
     * not <- String comparisson false
     * is <- String comparisson true
     * greater <- Integer comparisson. Works for numeric values only, returns false otherwise
     * less <- Integer comparisson. Works for numeric values only, returns false otherwise
     * contains <- Checks if a certain strings is found in another string
     * starts <- Checks if a certain string is found at the begining of another string
     * ends <- Checks if a certain string is found at the end of another string
     *
     * @param [stdClass] $condition
     * @return Boolean
     */
    public static function _check_condition($condition, $data)
    {
        if (!isset($data[$condition->formField])) {
            return false;
        }

        $cond = false;

        switch ($condition->condition) {
            case 'not':
                // If strings are not the same, it's false
                $cond = $data[$condition->formField] !== $condition->value;
                break;
            case 'greater':
                // if values are not numeric, there's no point in comparison because a string will always be converted to 0
                // these can create issues when a user input can select negative values
                // ( e.g. 'Something' will always be greater than -1 which is fundamentally wrong)
                $cond = (is_numeric($data[$condition->formField]) && is_numeric($condition->value))
                ? intval($data[$condition->formField]) > intval($condition->value)
                : false;
                break;
            case 'less':
                // same as the case on top of this one
                $cond = (is_numeric($data[$condition->formField]) && is_numeric($condition->value))
                ? intval($data[$condition->formField]) < intval($condition->value)
                : false;
                break;
            case 'contains':
                // basic strpos function, if there's a match we get an index ( might be 0 )
                $cond = strpos($data[$condition->formField], $condition->value) !== false;
                break;
            case 'starts':
                // substr returns a part of the string of a certain length,
                // we use the length of the condition->value to determine it dynamically
                $cond = substr($data[$condition->formField], 0, strlen($condition->value)) === $condition->value;
                break;
            case 'ends':
                // We get a length of the condition value
                $length = strlen($condition->value);
                // If the length is 0, there's nothing to check and we let it pass
                // Else we use substr to determine if they are the same
                $cond = $length === 0 ? true : (substr($data[$condition->formField], -$length) === $condition->value);
                break;
            default:
                // default case "IS" is a basic comparison between strings
                $cond = $data[$condition->formField] === $condition->value;
                break;
        }
        return $cond;
    }
}
