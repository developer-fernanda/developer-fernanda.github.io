<?php

namespace KaliForms\Inc\Backend\Views;

if (!defined('WPINC')) {
    die;
}

/**
 * Class After_Install_Page
 *
 * @package App\Views
 */
class After_Install_Page
{
    /**
     * Plugin slug
     *
     * @var string
     */
    protected $slug = 'kaliforms';

    /**
     * MainPage constructor.
     */
    public function __construct()
    {
    }
    /**
     * Renders app
     */
    public function render_app()
    {
        echo '<div class="wrap">';
        echo '<div id="kaliforms-after-install-page"> ' . $this->generate_page() . ' </div>';
        echo '</div>';
    }

    /**
     * Generates the page
     *
     * @return String
     */
    public function generate_page()
    {
        $str = '<div class="container">';
        $str .= $this->generate_header();
        $str .= $this->generate_features();
        $str .= $this->generate_pro_vs_lite();
        $str .= $this->generate_footer();
        $str .= '</div>';

        return $str;
    }

    public function generate_header()
    {
        $str = '<div class="page-card header">';
        $str .= '<img src="' . KALIFORMS_URL . 'assets/img/logo--dark.svg" />';
        $str .= '<p>' . esc_html__('Meet Kali Forms. The powerful & user-friendly WordPress form plugin. Easily create powerful contact forms, payment forms, feedback forms and more for your website without the hassle.', 'kaliforms') . '</p>';
        $str .= '<p><a href="' . admin_url() . 'post-new.php?post_type=kaliforms_forms
" class="button button-primary">' . esc_html__('Create your first form', 'kaliforms') . '</a><a href="https://kaliforms.com/docs?utm_source=welcomeBanner&utm_campaign=userInterests&utm_medium=button
" class="button" target="_blank">' . esc_html__('Read the docs', 'kaliforms') . '</a></p>';
        $str .= '</div>';

        return $str;
    }

    public function generate_footer()
    {
        $str = '<div class="page-card footer">';
        $str .= '<p>' . vsprintf(esc_html__('If you have any questions about Kali Forms, what features are available or how to get started – feel free to get in touch with us using the form from our %1$sContact Page%2$s.', 'kaliforms'), ['<a href="https://www.kaliforms.com/contact-us?utm_source=welcomeBanner&utm_campaign=userInterests&utm_medium=button" target="_blank">', '</a>']) . '</p>';
        $str .= '<p style="text-align:center"><a href="' . admin_url() . 'post-new.php?post_type=kaliforms_forms
" class="button button-primary">' . esc_html__('Create your first form', 'kaliforms') . '</a><a href="https://kaliforms.com/docs?utm_source=welcomeBanner&utm_campaign=userInterests&utm_medium=button
" target="_blank" class="button">' . esc_html__('Upgrade to PRO', 'kaliforms') . '</a></p>';
        $str .= '</div>';
        return $str;
    }

    public function generate_pro_vs_lite()
    {
        $features = [
            [
                'title' => esc_html__('Field sets', 'kaliforms'),
                'lite' => esc_html__('Basic', 'kaliforms'),
                'pro' => esc_html__('Basic + Advanced', 'kaliforms'),
            ],
            [
                'title' => esc_html__('Multi-Page forms', 'kaliforms'),
                'lite' => esc_html__('✗', 'kaliforms'),
                'pro' => esc_html__('✓', 'kaliforms'),
            ],
            [
                'title' => esc_html__('Number of fields', 'kaliforms'),
                'lite' => esc_html__('Unlimited', 'kaliforms'),
                'pro' => esc_html__('Unlimited', 'kaliforms'),
            ],
            [
                'title' => esc_html__('Supported sites', 'kaliforms'),
                'lite' => esc_html__('1 Site', 'kaliforms'),
                'pro' => esc_html__('Multiple Sites', 'kaliforms'),
            ],
            [
                'title' => esc_html__('Anti spam', 'kaliforms'),
                'lite' => esc_html__('✓', 'kaliforms'),
                'pro' => esc_html__('✓', 'kaliforms'),
            ],
            [
                'title' => esc_html__('Submission handling', 'kaliforms'),
                'lite' => esc_html__('✗', 'kaliforms'),
                'pro' => esc_html__('✓', 'kaliforms'),
                'tooltip' => esc_html__('Store submission data into your website database for future references.', 'kaliforms'),
            ],
            [
                'title' => esc_html__('Conditional logic', 'kaliforms'),
                'lite' => esc_html__('✗', 'kaliforms'),
                'pro' => esc_html__('✓', 'kaliforms'),
                'tooltip' => esc_html__('Setup conditional statements that will allow you to hide certain fields until the correct selections are made.', 'kaliforms'),
            ],
            [
                'title' => esc_html__('Custom scripting', 'kaliforms'),
                'lite' => esc_html__('✗', 'kaliforms'),
                'pro' => esc_html__('✓', 'kaliforms'),
                'tooltip' => esc_html__('Gain more control over how your form looks and performs using the custom scripting areas', 'kaliforms'),
            ],
        ];

        $str = '<div class="page-card pro-vs-lite">';
        $str .= '<h2>' . esc_html__('Upgrade to PRO', 'kaliforms') . '</h2>';
        $str .= '<div class="pricing-table">';
        $str .= '<div class="pricing-table__row">';
        $str .= '<span class="pricing-table__cell"></span>';
        $str .= '<span class="pricing-table__cell">' . esc_html__('Paid plans', 'kaliforms') . '</span>';
        $str .= '<span class="pricing-table__cell">' . esc_html__('Free plans', 'kaliforms') . '</span>';
        $str .= '</div>';

        foreach ($features as $feature) {
            $cell_class = in_array($feature['pro'], ['✓', '✗']) || in_array($feature['lite'], ['✓', '✗']);
            $cell_class_arr = ['lite' => '', 'pro' => ''];
            if ($cell_class) {
                $cell_class_arr['lite'] = $feature['lite'] === '✓' ? 'success' : 'danger';
                $cell_class_arr['pro'] = $feature['pro'] === '✓' ? 'success' : 'danger';

            }
            $str .= '<div class="pricing-table__row">';
            $str .= '<span class="pricing-table__cell">' . $feature['title'];
            if (!empty($feature['tooltip'])) {
                $str .= '<span class="kaliforms-tooltip" data-tippy-content="' . $feature['tooltip'] . '"><span class="dashicons dashicons-info"></span></span>';
            }
            $str .= '</span>';
            $str .= '<span class="pricing-table__cell ' . $cell_class_arr['pro'] . '">' . $feature['pro'] . '</span>';
            $str .= '<span class="pricing-table__cell ' . $cell_class_arr['lite'] . '">' . $feature['lite'] . '</span>';
            $str .= '</div>';
        }
        $str .= '</div>';
        $str .= '<div class="row justify-center"> <p> <a href="https://kaliforms.com/pricing?utm_source=welcomeBanner&utm_campaign=userInterests&utm_medium=button" class="button button-primary" target="_blank">' . esc_html__('Upgrade to PRO', 'kaliforms') . '</a></p></div>';

        $str .= '</div>';
        return $str;
    }

    public function generate_features()
    {
        $features = [
            [
                'icon' => KALIFORMS_URL . 'assets/img/multi-page-forms-white.svg',
                'title' => esc_html__('Multi-page Forms', 'kaliforms'),
                'text' => esc_html__('Break long forms across multiple pages to encourage form completion.', 'kaliforms'),
                'pro' => true,
            ],
            [
                'icon' => KALIFORMS_URL . 'assets/img/form-templates.svg',
                'title' => esc_html__('Predesigned Templates', 'kaliforms'),
                'text' => esc_html__('Save time by importing any available Kali Forms templates as a starting point.', 'kaliforms'),
                'pro' => true,
            ],
            [
                'icon' => KALIFORMS_URL . 'assets/img/no-coding-required.svg',
                'title' => esc_html__('No Coding Required', 'kaliforms'),
                'text' => esc_html__('Build the form you need with in minutes with our drag and drop builder.', 'kaliforms'),
                'pro' => false,
            ],
            [
                'icon' => KALIFORMS_URL . 'assets/img/all-the-fields.svg',
                'title' => esc_html__('All the fields you need', 'kaliforms'),
                'text' => esc_html__('Kali Forms provides a large variety of form fields that can be used to built-up your forms.', 'kaliforms'),
                'pro' => true,
            ],
            [
                'icon' => KALIFORMS_URL . 'assets/img/email-notifications.svg',
                'title' => esc_html__('Email notifications', 'kaliforms'),
                'text' => esc_html__('Each form submission can trigger a notification via email for both submitting users and admins.', 'kaliforms'),
                'pro' => false,
            ],
            [
                'icon' => KALIFORMS_URL . 'assets/img/no-coding-required.svg',
                'title' => esc_html__('Conditional Logic', 'kaliforms'),
                'text' => esc_html__('Easily create advanced WordPress forms using Kali Forms smart conditional logic.', 'kaliforms'),
                'pro' => true,
            ],
            [
                'icon' => KALIFORMS_URL . 'assets/img/easy-file-uploads.svg',
                'title' => esc_html__('Easy File Uploads', 'kaliforms'),
                'text' => esc_html__('Want people to submit documents or photos? Easy. Just add file upload fields to forms.', 'kaliforms'),
                'pro' => false,
            ],
            [
                'icon' => KALIFORMS_URL . 'assets/img/goodbye-spam.svg',
                'title' => esc_html__('Say Goodbye to Form Span', 'kaliforms'),
                'text' => esc_html__('Use our built-in reCAPTCHA integration to protect your forms from spam.', 'kaliforms'),
                'pro' => false,
            ],
        ];
        $str = '<div class="page-card features">';
        $str .= '<h2>' . esc_html__('Kali Forms Features', 'kaliforms') . '</h2>';
        $str .= '<div class="row">';
        foreach ($features as $feature) {
            $pro = $feature['pro'] ? '<span class="pro-badge">PRO</span>' : '';
            $str .= '<div class="col">';
            $str .= '<div class="icon-div">';
            $str .= '<img src="' . $feature['icon'] . '" />';
            $str .= '</div>';
            $str .= '<div class="text-div">';
            $str .= '<h3>' . $feature['title'] . $pro . '</h3>';
            $str .= '<p>' . $feature['text'] . '</h3>';
            $str .= '</div>';
            $str .= '</div>';
        }
        $str .= '</div>';
        $str .= '<div class="row justify-center"> <p> <a href="https://kaliforms.com?utm_source=welcomeBanner&utm_campaign=userInterests&utm_medium=button"  target="_blank" class="button">' . esc_html__('Read More', 'kaliforms') . '</a></p></div>';
        $str .= '</div>';
        return $str;
    }

    /**
     * Invoking the class will render the app
     */
    public function __invoke()
    {
        /**
         * Initiate an action before rendering the page div
         */
        do_action($this->slug . '_before_after_install_page_rendering');

        /**
         * Echo the container
         */
        $this->render_app();

        /**
         * Initiate an action after rendering the page div
         */
        do_action($this->slug . '_after_after_install_page_rendering');
    }
}
