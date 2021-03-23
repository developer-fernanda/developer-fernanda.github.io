<?php

namespace KaliForms\Inc\Backend;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Class Predefined_Forms is used to translate stuff
 *
 * @package App\Libraries
 */
class Predefined_Forms
{
    /**
     * Plugin slug
     *
     * @var string
     */
    public $slug = 'kaliforms';
    /**
     * Forms array
     *
     * @var array
     */
    public $forms = [];
    /**
     * Class constructor
     */
    public function __construct()
    {
        add_action('wp_ajax_kaliforms_get_form_data',
            [$this, 'get_form_data']
        );
    }
    /**
     * Gets form data
     *
     * @return void
     */
    public function get_form_data()
    {
        if (!isset($_POST['args'], $_POST['args']['nonce'])) {
            wp_die('Denied');
        }
        if (!wp_verify_nonce(sanitize_key(wp_unslash($_POST['args']['nonce'])), 'kaliforms_nonce')) {
            wp_die('Denied');
        }

        $this->set_forms(true);

        $_POST['args'] = stripslashes_deep($_POST['args']);

        if (!isset($this->forms[$_POST['args']['id']])) {
            wp_die('wrong id');
        }

        $form = $this->forms[$_POST['args']['id']]['instance'];

        if ($form === null) {
            wp_die('something went wrong');
        }

        wp_die(wp_json_encode(
            [
                'name'              => $form->name,
                'emails'            => $form->emails,
                'thank_you_message' => $form->thank_you_message,
                'conditional_logic' => isset($form->conditional_logic) ? $form->conditional_logic : [],
                'form_calculator'   => isset($form->form_calculator) ? $form->form_calculator : [],
                'grid'              => $form->grid,
                'field_components'  => $form->field_components,
                'form_info'         => $form->form_info,
            ]
        ));

    }

    /**
     * Sets the default forms
     *
     * @return void
     */
    public function set_forms($full = false)
    {
        $contactForm            = new PredefinedForms\Contact_Form();
        $this->forms['contact'] = [
            'name'        => $contactForm->name,
            'description' => $contactForm->description,
            'class'       => 'PredefinedForms\Contact_Form',
            'pro'         => false,
            'premium'     => false,
            'instance'    => $full ? $contactForm : null,
            'thumb'       => KALIFORMS_URL . '/assets/img/predefined-forms/contact-form.png',
            'demo'        => 'https://kaliforms.dev/contact-form/',
        ];

        $employeeInformation                = new PredefinedForms\Employee_Information_Form();
        $this->forms['employeeInformation'] = [
            'name'        => $employeeInformation->name,
            'description' => $employeeInformation->description,
            'pro'         => false,
            'premium'     => false,
            'class'       => 'PredefinedForms\Employee_Information_Form',
            'instance'    => $full ? $employeeInformation : null,
            'thumb'       => KALIFORMS_URL . '/assets/img/predefined-forms/employee-info-form.png',
            'demo'        => 'https://kaliforms.dev/employee-information-form/',
        ];

        $this->forms['gdpr-contact'] = [
            'name'        => esc_html__('GDPR-Friendly contact form', 'kaliforms'),
            'description' => esc_html__('A simple gdpr-friendly form meant to help you comunicate with your site users.', 'kaliforms'),
            'class'       => 'PredefinedForms\GDPR_Friendly_Contact_Form',
            'pro'         => true,
            'premium'     => true,
            'thumb'       => KALIFORMS_URL . '/assets/img/predefined-forms/gdpr-contact-form.png',
            'instance'    => $full && class_exists('KaliForms\Inc\Backend\PredefinedForms\GDPR_Friendly_Contact_Form') ? new PredefinedForms\GDPR_Friendly_Contact_Form() : null,
            'demo'        => 'https://kaliforms.dev/gdpr-friendly-contact-form/',
        ];

        $this->forms['appointment'] = [
            'name'        => esc_html__('Appointment form', 'kaliforms'),
            'description' => esc_html__('Use this as a starting point in building an appointment service on your site.', 'kaliforms'),
            'class'       => 'PredefinedForms\Appointment_Form',
            'pro'         => true,
            'premium'     => true,
            'thumb'       => KALIFORMS_URL . '/assets/img/predefined-forms/appointment-form.png',
            'instance'    => $full && class_exists('KaliForms\Inc\Backend\PredefinedForms\Appointment_Form') ? new PredefinedForms\Appointment_Form() : null,
            'demo'        => 'https://kaliforms.dev/appointment-form/',
        ];

        $this->forms['customerSatisfaction'] = [
            'name'        => esc_html__('Customer feedback form', 'kaliforms'),
            'description' => esc_html__('Collect feedback from customers and improve your services.', 'kaliforms'),
            'pro'         => true,
            'premium'     => true,
            'class'       => 'PredefinedForms\Customer_Satisfaction_Form',
            'thumb'       => KALIFORMS_URL . '/assets/img/predefined-forms/customer-feedback-form.png',
            'instance'    => $full && class_exists('KaliForms\Inc\Backend\PredefinedForms\Customer_Satisfaction_Form') ? new PredefinedForms\Customer_Satisfaction_Form() : null,
            'demo'        => 'https://kaliforms.dev/customer-feedback-form/',
        ];

        $this->forms['artContest'] = [
            'name'        => esc_html__('Art contest', 'kaliforms'),
            'description' => esc_html__('This form will help you accept registrations for an art contest event.', 'kaliforms'),
            'pro'         => true,
            'premium'     => true,
            'class'       => 'PredefinedForms\Art_Contest_Form',
            'thumb'       => KALIFORMS_URL . '/assets/img/predefined-forms/art-contest.png',
            'instance'    => $full && class_exists('KaliForms\Inc\Backend\PredefinedForms\Art_Contest_Form') ? new PredefinedForms\Art_Contest_Form() : null,
            'demo'        => 'https://kaliforms.dev/art-contest/',
        ];

        $this->forms['jobApplication'] = [
            'name'        => esc_html__('Job application', 'kaliforms'),
            'description' => esc_html__('Collect resumes for the positions available in your company', 'kaliforms'),
            'pro'         => true,
            'premium'     => true,
            'class'       => 'PredefinedForms\Job_Application_Form',
            'thumb'       => KALIFORMS_URL . '/assets/img/predefined-forms/job-application.png',
            'instance'    => $full && class_exists('KaliForms\Inc\Backend\PredefinedForms\Job_Application_Form') ? new PredefinedForms\Job_Application_Form() : null,
            'demo'        => 'https://kaliforms.dev/job-application/',
        ];

        $this->forms['gamingTournamentRegistration'] = [
            'name'        => esc_html__('Gaming tournament registration', 'kaliforms'),
            'description' => esc_html__('Allow ESL teams to join your tournament through this form.', 'kaliforms'),
            'pro'         => true,
            'premium'     => true,
            'class'       => 'PredefinedForms\Gaming_Tournament_Registration_Form',
            'thumb'       => KALIFORMS_URL . '/assets/img/predefined-forms/gaming-tournament.png',
            'instance'    => $full && class_exists('KaliForms\Inc\Backend\PredefinedForms\Gaming_Tournament_Registration_Form') ? new PredefinedForms\Gaming_Tournament_Registration_Form() : null,
            'demo'        => 'https://kaliforms.dev/gaming-tournament-registration/',
        ];

        $this->forms['runningCalculators'] = [
            'name'        => esc_html__('Running calculator form', 'kaliforms'),
            'description' => esc_html__('Easily calculate pace/time/distance using our calculator.', 'kaliforms'),
            'pro'         => true,
            'premium'     => true,
            'class'       => 'PredefinedForms\Running_Calculators',
            'thumb'       => KALIFORMS_URL . '/assets/img/predefined-forms/pace-calculator.jpg',
            'instance'    => $full && class_exists('KaliForms\Inc\Backend\PredefinedForms\Running_Calculators') ? new PredefinedForms\Running_Calculators() : null,
            'demo'        => 'https://kaliforms.dev/running-calculators/',
        ];

        $this->forms['donationForm'] = [
            'name'        => esc_html__('Donation form', 'kaliforms'),
            'description' => esc_html__('Create donation collect form.', 'kaliforms'),
            'pro'         => true,
            'premium'     => true,
            'class'       => 'PredefinedForms\Donation_Form',
            'thumb'       => KALIFORMS_URL . '/assets/img/predefined-forms/donation-form.jpg',
            'instance'    => $full && class_exists('KaliForms\Inc\Backend\PredefinedForms\Donation_Form') ? new PredefinedForms\Donation_Form() : null,
            'demo'        => 'https://kaliforms.dev/donation_form/',
        ];

        $this->forms['requestAQuote'] = [
            'name'        => esc_html__('Request quote form', 'kaliforms'),
            'description' => esc_html__('A simple example of using the calculator to create a quote estimate and request.', 'kaliforms'),
            'pro'         => true,
            'premium'     => true,
            'class'       => 'PredefinedForms\Request_A_Quote',
            'thumb'       => KALIFORMS_URL . '/assets/img/predefined-forms/request-a-quote.jpg',
            'instance'    => $full && class_exists('KaliForms\Inc\Backend\PredefinedForms\Request_A_Quote') ? new PredefinedForms\Request_A_Quote() : null,
            'demo'        => 'https://kaliforms.dev/request-a-quote/',
        ];

        $this->forms['reservationForm'] = [
            'name'        => esc_html__('Reservation form', 'kaliforms'),
            'description' => esc_html__('A form that can be used as to reserve rooms at your hotel.', 'kaliforms'),
            'pro'         => true,
            'premium'     => true,
            'class'       => 'PredefinedForms\Reservation_Form',
            'thumb'       => KALIFORMS_URL . '/assets/img/predefined-forms/hotel-reservation-form.jpg',
            'instance'    => $full && class_exists('KaliForms\Inc\Backend\PredefinedForms\Reservation_Form') ? new PredefinedForms\Reservation_Form() : null,
            'demo'        => 'https://kaliforms.dev/reservation-form/',
        ];

        $this->forms['gymMembershipApplication'] = [
            'name'        => esc_html__('Gym membership form', 'kaliforms'),
            'description' => esc_html__('A form that can collect information about your gym customers.', 'kaliforms'),
            'pro'         => true,
            'premium'     => true,
            'class'       => 'PredefinedForms\Gym_Membership_Application',
            'thumb'       => KALIFORMS_URL . '/assets/img/predefined-forms/gym-membership-application.jpg',
            'instance'    => $full && class_exists('KaliForms\Inc\Backend\PredefinedForms\Gym_Membership_Application') ? new PredefinedForms\Gym_Membership_Application() : null,
            'demo'        => 'https://kaliforms.dev/gym-membership-application/',
        ];

        $this->forms['simpleBookingForm'] = [
            'name'        => esc_html__('Simple booking form', 'kaliforms'),
            'description' => esc_html__('Use our date picker to book certain dates in a calendar. Dates are disabled automatically based on previous submissions.', 'kaliforms'),
            'pro'         => true,
            'premium'     => true,
            'class'       => 'PredefinedForms\Simple_Booking_Form',
            'thumb'       => KALIFORMS_URL . '/assets/img/predefined-forms/simple-booking-form.jpg',
            'instance'    => $full && class_exists('KaliForms\Inc\Backend\PredefinedForms\Simple_Booking_Form') ? new PredefinedForms\Simple_Booking_Form() : null,
            'demo'        => 'https://kaliforms.dev/simple-booking-form/',
        ];

        $this->forms['simpleBookingFormWithPayment'] = [
            'name'        => esc_html__('Simple booking form with payment', 'kaliforms'),
            'description' => esc_html__('Use our date picker to book certain dates in a calendar. Dates are disabled automatically based on previous submissions.', 'kaliforms'),
            'pro'         => true,
            'premium'     => true,
            'class'       => 'PredefinedForms\Simple_Booking_Form_With_Payment',
            'thumb'       => KALIFORMS_URL . '/assets/img/predefined-forms/simple-booking-form-with-payment.jpg',
            'instance'    => $full && class_exists('KaliForms\Inc\Backend\PredefinedForms\Simple_Booking_Form_With_Payment') ? new PredefinedForms\Simple_Booking_Form_With_Payment() : null,
            'demo'        => 'https://kaliforms.dev/simple-booking-form-with-payment/',
        ];

        $this->forms['packageDeliveryRequestForm'] = [
            'name'        => esc_html__('Package delivery request', 'kaliforms'),
            'description' => esc_html__('A simple form to fill up some details to pick up a package from a certain location.', 'kaliforms'),
            'pro'         => true,
            'premium'     => true,
            'class'       => 'PredefinedForms\Package_Delivery_Request_Form',
            'thumb'       => KALIFORMS_URL . '/assets/img/predefined-forms/package-delivery-request-form.jpg',
            'instance'    => $full && class_exists('KaliForms\Inc\Backend\PredefinedForms\Package_Delivery_Request_Form') ? new PredefinedForms\Package_Delivery_Request_Form() : null,
            'demo'        => 'https://kaliforms.dev/package-delivery-request-form/',
        ];

        $this->forms = apply_filters($this->slug . '_predefined_forms', $this->forms);
    }
}
