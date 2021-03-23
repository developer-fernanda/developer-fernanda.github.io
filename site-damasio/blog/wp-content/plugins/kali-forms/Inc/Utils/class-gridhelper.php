<?php
namespace KaliForms\Inc\Utils;

/**
 * Trait GridHelper
 *
 * @package Inc\Utils
 */
trait GridHelper
{
    /**
     * Parses the array and creates the form structure
     *
     * @return void
     */
    public function walk_array($args)
    {
        /**
         * Sort
         */
        usort($args, [$this, 'sort_by_row']);
        /**
         * Split into rows
         */
        array_walk($args, [$this, 'split_to_rows']);
        /**
         * Assign columns to rows
         */
        array_walk($args, [$this, 'assign_to_rows']);
        /**
         * Rearrange columns as intended
         */
        $this->sort_columns_properly();
        /**
         * If a field has " offsets " - add them
         */
        $this->add_offsets();
    }

    /**
     * Data is saved in a "brute" way, we don't really need to handle item ordering in the backend,
     * but its easier to sort it through PHP for the frontend
     *
     * @param [stdClass] $a
     * @param [stdClass] $b
     * @return void
     */
    public function sort_by_row($a, $b)
    {
        return strnatcmp($a->y, $b->y);
    }
    /**
     * Sorts columns depending on the column position ( WE ALREADY CHANGED OBJECT TO ARRAY )
     *
     * @param [array] $a
     * @param [array] $b
     * @return void
     */
    public function sort_by_column($a, $b)
    {
        return strnatcmp($a['x'], $b['x']);
    }
    /**
     * Run a loop for the rows
     *
     * @return void
     */
    public function sort_columns_properly()
    {
        foreach ($this->rows as &$row) {
            usort($row, [$this, 'sort_by_column']);
        }
    }
    /**
     * Splitter ( data is inserted in the database with a certain flag so we know which row it is )
     *
     * @param [stdClass] $item
     * @return void
     */
    public function split_to_rows($item)
    {
        if (!in_array('row-' . $item->y, $this->rows)) {
            $this->rows['row-' . $item->y] = [];
        }
    }

    /**
     * Assigns items per rows
     *
     * @param [stdClass] $item
     * @return void
     */
    public function assign_to_rows($item)
    {
        $this->rows['row-' . $item->y][] = $this->parse_item($item);
    }
    /**
     * Adds offsets to items
     *
     * @return void
     */
    public function add_offsets()
    {
        foreach ($this->rows as $index => $row) {
            $this->rows[$index] = $this->array_merge_recursive_new($row, $this->_determine_gaps($row));
        }
    }
    /**
     * Determine if we need to add gaps
     */
    private function _determine_gaps($row)
    {
        $total         = 0;
        $start_indexes = [];
        $last_index    = [];
        foreach ($row as $index => $field) {
            if (is_bool($field)) {
                continue;
            }
            if ($index === 0 && $field['x'] > 0) {
                $start_indexes[$index]['offset'] = $field['x'];
            }

            if ($index > 0// In case we are further in the array
                 && !empty($last_index) // and we have the last index array defined
                 && $last_index['end'] !== $field['x']) // and the index is different than it needs
            {
                $start_indexes[$index]['offset'] = $field['x'] - $last_index['end'];
            }

            if (!isset($start_indexes[$index]['offset'])) {
                $start_indexes[$index]['offset'] = 0;
            }

            $last_index = [
                'start' => $field['x'],
                'end'   => $field['x'] + $field['col'],
            ];
        };
        return $start_indexes;
    }
    /**
     * Parses the item and returns it as needed by our workflow
     *
     * @param [stdClass] $item
     * @return Array
     */
    public function parse_item($item)
    {
        $current_field = $this->fields[$item->i];
        $parsedItem    = [
            'col'      => $item->w,
            'grid_id'  => $item->i,
            'type'     => $current_field->id,
            'frontend' => $this->construct_object($current_field->id),
            'x'        => $item->x,
        ];

        if (!$parsedItem['frontend']) {
            return false;
        }

        foreach ($current_field->properties as $key => $value) {
            if (array_key_exists($key, $parsedItem)) {
                $parsedItem['properties.' . $key] = $this->pluck_value_from_properties($key, $current_field);
                continue;
            }
            $parsedItem[$key] = $this->pluck_value_from_properties($key, $current_field);
        }

        return $parsedItem;
    }

    /**
     * Plucks values from the properties array
     *
     * @param [String] $key
     * @param [stdClass] $obj
     * @return String
     */
    public function pluck_value_from_properties($key, $obj)
    {
        return $obj->properties->{$key};
    }

    /**
     * Merge arrays on numeric keys
     *
     * @return void
     */
    public function array_merge_recursive_new()
    {
        $arrays = func_get_args();
        $base   = array_shift($arrays);
        foreach ($arrays as $array) {
            reset($base);
            foreach ($array as $key => $value) {
                if (is_array($value) && @is_array($base[$key])) {
                    $base[$key] = $this->array_merge_recursive_new($base[$key], $value);
                } else {
                    $base[$key] = $value;
                }
            }
        }
        return $base;
    }
}
