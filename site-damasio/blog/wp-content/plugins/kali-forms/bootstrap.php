<?php
if (!defined('ABSPATH')) {
    exit;
}
require_once 'autoloader.php';

/**
 *
 * Plugin defines
 *
 */
define('KALIFORMS_BASE', plugin_dir_path(__FILE__));
define('KALIFORMS_URL', plugin_dir_url(__FILE__) . '/public/');
define('KALIFORMS_SITE', rtrim(ABSPATH, '\\/'));
define('KALIFORMS_BASE_API', 'https://www.kaliforms.com/wp-json/wp/v2/');
define('KALIFORMS_EXTENSIONS_API', 'https://kaliforms.com/wp-json/kf/v1/plugins');
define('KALIFORMS_UNINSTALL_FEEDBACK_API', 'https://kaliforms.com/wp-json/kf/v1/uninstall-feedback');
define('KALIFORMS_VERSION', '2.3.0');
