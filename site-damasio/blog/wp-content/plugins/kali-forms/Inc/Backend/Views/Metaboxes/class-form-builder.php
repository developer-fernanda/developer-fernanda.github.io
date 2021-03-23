<?php

namespace KaliForms\Inc\Backend\Views\Metaboxes;

if (!defined('WPINC')) {
    die;
}

/**
 * Class Form_Builder
 *
 * @package Inc\Backend\Views\Metaboxes;
 */
class Form_Builder extends Metabox
{

    /**
     * Render the metabox
     */
    public function render_box()
    {
        wp_nonce_field(KALIFORMS_BASE, 'kaliforms_fields');
        echo '<div id="kaliforms-container" class="kaliforms-wrapper">';
        echo $this->skeleton();
        echo '</div>';
    }

    /**
     * Preloader html content
     *
     * @return void
     */
    public function skeleton()
    {
        $html = '<div class="kaliforms-preloader">';
        $html .= '<div class="kaliforms-preloader-badge">' . esc_html__('Loading', 'kaliforms') . '</div>';
        $html .= '</div>';
        return $html;
    }

    /**
     * Skeleton
     *
     * @return void
     */
    private function __skeleton()
    {
        // $html .= '<div class="kaliforms-skeleton-app-bar">';
        // $html .= '<img src="' . KALIFORMS_URL . 'assets/img/logo.svg' . '" />';
        // $html .= '<span class="skeleton-button"></span>';
        // $html .= '<span class="skeleton-button"></span>';
        // $html .= '<span class="skeleton-button"></span>';
        // $html .= '</div>';
        // $html .= '<div class="kaliforms-skeleton-main">';
        // $html .= '<div class="kaliforms-skeleton-sidebar">
        //     <div class="row">
        //         <span class="skeleton-box" style="width:33%"></span>
        //         <span class="skeleton-box" style="width:33%"></span>
        //         <span class="skeleton-box" style="width:33%"></span>
        //     </div>

        //     <div class="row">
        //         <span class="skeleton-box" style="width:33%"></span>
        //         <span class="skeleton-box" style="width:33%"></span>
        //         <span class="skeleton-box" style="width:33%"></span>
        //     </div>

        //     <div class="row">
        //         <span class="skeleton-box" style="width:33%"></span>
        //     </div>

        //     <div class="row" style="margin-top:50px">
        //         <span class="skeleton-box" style="width:33%"></span>
        //         <span class="skeleton-box" style="width:33%"></span>
        //         <span class="skeleton-box" style="width:33%"></span>
        //     </div>

        //     <div class="row"
        //         <span class="skeleton-box" style="width:33%"></span>
        //     </div>

        //     <div class="row" style="margin-top:50px">
        //         <span class="skeleton-box" style="width:33%"></span>
        //         <span class="skeleton-box" style="width:33%"></span>
        //         <span class="skeleton-box" style="width:33%"></span>
        //     </div>

        //     <div class="row">
        //         <span class="skeleton-box" style="width:33%"></span>
        //     </div>
        // </div>';
        // $html .= '<div class="kaliforms-skeleton-container">';
        // $html .= '</div>';
        // $html .= '</div>';

    }
}
