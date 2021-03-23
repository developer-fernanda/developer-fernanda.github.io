<?php
/**
 * Plugin Name: Kali Forms - WordPress Forms Made Easy
 * Plugin URI: https://www.kaliforms.com
 * Description: Kali Forms provides the best form creation experience for WordPress.
 * Author: Kali Forms
 * Version: 2.3.0
 * Author URI: https://www.kaliforms.com/
 * License: GPLv3 or later
 * License URI: http://www.gnu.org/licenses/gpl-3.0.html
 * Requires PHP: 5.6
 * Text Domain: kaliforms
 * Domain Path: /languages
 *
 * Copyright 2019        Kali Forms         hello@kaliforms.com
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License, version 3, as
 * published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 */

namespace KaliForms;

use KaliForms\Inc\KaliForms;

if (!defined('ABSPATH')) {
    exit;
}

define('KALIFORMS_PLUGIN_FILE', __FILE__);
require_once 'bootstrap.php';

if (!class_exists('KaliForms\Inc\KaliForms')) {
    return;
}
KaliForms::get_instance();
