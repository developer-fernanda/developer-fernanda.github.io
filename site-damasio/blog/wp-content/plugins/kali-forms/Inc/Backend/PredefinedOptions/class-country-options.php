<?php
namespace KaliForms\Inc\Backend\PredefinedOptions;

if (!defined('ABSPATH')) {
    exit;
}

class Country_Options
{
    /**
     * Options array
     *
     * @var array
     */
    public $options = [];
    /**
     * Does it have sub categories
     *
     * @var boolean
     */
    public $subcategories = true;
    /**
     * Predefined option label
     *
     * @var string
     */
    public $label = '';
    /**
     * Preset id
     *
     * @var string
     */
    public $id = 'countries';
    public $countries = [];
    /**
     * Class constructor
     */
    public function __construct()
    {
        $this->set_all_countries();
        $this->set_options();
    }
    /**
     * All countries with code and contintent
     *
     * @return void
     */
    public function set_all_countries()
    {
        $antarticaCountries = [
            'AQ' => esc_html__('Antarctica (the territory South of 60 deg S)', 'kaliforms'),
            'BV' => esc_html__('Bouvet Island (Bouvetoya)', 'kaliforms'),
            'GS' => esc_html__('South Georgia and the South Sandwich Islands', 'kaliforms'),
            'TF' => esc_html__('French Southern Territories', 'kaliforms'),
            'HM' => esc_html__('Heard Island and McDonald Islands', 'kaliforms'),
        ];
        $africaCountries = [
            'DZ' => esc_html__('Algeria', 'kaliforms'),
            'AO' => esc_html__('Angola, Republic of', 'kaliforms'),
            'BW' => esc_html__('Botswana, Republic of', 'kaliforms'),
            'BI' => esc_html__('Burundi, Republic of', 'kaliforms'),
            'CM' => esc_html__('Cameroon, Republic of', 'kaliforms'),
            'CV' => esc_html__('Cape Verde, Republic of', 'kaliforms'),
            'CF' => esc_html__('Central African Republic', 'kaliforms'),
            'TD' => esc_html__('Chad, Republic of', 'kaliforms'),
            'KM' => esc_html__('Comoros, Union of the', 'kaliforms'),
            'YT' => esc_html__('Mayotte', 'kaliforms'),
            'CG' => esc_html__('Congo, Republic of the', 'kaliforms'),
            'CD' => esc_html__('Congo, Democratic Republic of the', 'kaliforms'),
            'BJ' => esc_html__('Benin, Republic of', 'kaliforms'),
            'GQ' => esc_html__('Equatorial Guinea, Republic of', 'kaliforms'),
            'ET' => esc_html__('Ethiopia, Federal Democratic Republic of', 'kaliforms'),
            'ER' => esc_html__('Eritrea, State of', 'kaliforms'),
            'DJ' => esc_html__('Djibouti, Republic of', 'kaliforms'),
            'GA' => esc_html__('Gabon, Gabonese Republic', 'kaliforms'),
            'GM' => esc_html__('Gambia, Republic of the', 'kaliforms'),
            'GH' => esc_html__('Ghana, Republic of', 'kaliforms'),
            'GN' => esc_html__('Guinea, Republic of', 'kaliforms'),
            'CI' => esc_html__('Ivory Coast, Republic of', 'kaliforms'),
            'KE' => esc_html__('Kenya, Republic of', 'kaliforms'),
            'LS' => esc_html__('Lesotho, Kingdom of', 'kaliforms'),
            'LR' => esc_html__('Liberia, Republic of', 'kaliforms'),
            'LY' => esc_html__('Libyan Arab Jamahiriya', 'kaliforms'),
            'MG' => esc_html__('Madagascar, Republic of', 'kaliforms'),
            'MW' => esc_html__('Malawi, Republic of', 'kaliforms'),
            'ML' => esc_html__('Mali, Republic of', 'kaliforms'),
            'MR' => esc_html__('Mauritania, Islamic Republic of', 'kaliforms'),
            'MU' => esc_html__('Mauritius, Republic of', 'kaliforms'),
            'MA' => esc_html__('Morocco, Kingdom of', 'kaliforms'),
            'MZ' => esc_html__('Mozambique, Republic of', 'kaliforms'),
            'NA' => esc_html__('Namibia, Republic of', 'kaliforms'),
            'NE' => esc_html__('Niger, Republic of', 'kaliforms'),
            'NG' => esc_html__('Nigeria, Federal Republic of', 'kaliforms'),
            'GW' => esc_html__('Guinea-Bissau, Republic of', 'kaliforms'),
            'RE' => esc_html__('Reunion', 'kaliforms'),
            'RW' => esc_html__('Rwanda, Republic of', 'kaliforms'),
            'SH' => esc_html__('Saint Helena', 'kaliforms'),
            'ST' => esc_html__('Sao Tome and Principe, Democratic Republic of', 'kaliforms'),
            'SN' => esc_html__('Senegal, Republic of', 'kaliforms'),
            'SC' => esc_html__('Seychelles, Republic of', 'kaliforms'),
            'SL' => esc_html__('Sierra Leone, Republic of', 'kaliforms'),
            'SO' => esc_html__('Somalia, Somali Republic', 'kaliforms'),
            'ZA' => esc_html__('South Africa, Republic of', 'kaliforms'),
            'ZW' => esc_html__('Zimbabwe, Republic of', 'kaliforms'),
            'SS' => esc_html__('South Sudan', 'kaliforms'),
            'EH' => esc_html__('Western Sahara', 'kaliforms'),
            'SD' => esc_html__('Sudan, Republic of', 'kaliforms'),
            'SZ' => esc_html__('Swaziland, Kingdom of', 'kaliforms'),
            'TG' => esc_html__('Togo, Togolese Republic', 'kaliforms'),
            'TN' => esc_html__('Tunisia, Tunisian Republic', 'kaliforms'),
            'UG' => esc_html__('Uganda, Republic of', 'kaliforms'),
            'EG' => esc_html__('Egypt, Arab Republic of', 'kaliforms'),
            'TZ' => esc_html__('Tanzania, United Republic of', 'kaliforms'),
            'BF' => esc_html__('Burkina Faso', 'kaliforms'),
            'ZM' => esc_html__('Zambia, Republic of', 'kaliforms'),
        ];
        $asiaCountries = [
            'AF' => esc_html__('Afghanistan, Islamic Republic of', 'kaliforms'),
            'AZ' => esc_html__('Azerbaijan, Republic of', 'kaliforms'),
            'BH' => esc_html__('Bahrain, Kingdom of', 'kaliforms'),
            'BD' => esc_html__('Bangladesh, People Republic of', 'kaliforms'),
            'AM' => esc_html__('Armenia, Republic of', 'kaliforms'),
            'BT' => esc_html__('Bhutan, Kingdom of', 'kaliforms'),
            'IO' => esc_html__('British Indian Ocean Territory (Chagos Archipelago)', 'kaliforms'),
            'BN' => esc_html__('Brunei Darussalam', 'kaliforms'),
            'MM' => esc_html__('Myanmar, Union of', 'kaliforms'),
            'KH' => esc_html__('Cambodia, Kingdom of', 'kaliforms'),
            'LK' => esc_html__('Sri Lanka, Democratic Socialist Republic of', 'kaliforms'),
            'CN' => esc_html__('China, People Republic of', 'kaliforms'),
            'TW' => esc_html__('Taiwan', 'kaliforms'),
            'CX' => esc_html__('Christmas Island', 'kaliforms'),
            'CC' => esc_html__('Cocos (Keeling) Islands', 'kaliforms'),
            'CY' => esc_html__('Cyprus, Republic of', 'kaliforms'),
            'GE' => esc_html__('Georgia', 'kaliforms'),
            'PS' => esc_html__('Palestinian Territory, Occupied', 'kaliforms'),
            'HK' => esc_html__('Hong Kong, Special Administrative Region of China', 'kaliforms'),
            'IN' => esc_html__('India, Republic of', 'kaliforms'),
            'ID' => esc_html__('Indonesia, Republic of', 'kaliforms'),
            'IR' => esc_html__('Iran, Islamic Republic of', 'kaliforms'),
            'IQ' => esc_html__('Iraq, Republic of', 'kaliforms'),
            'IL' => esc_html__('Israel, State of', 'kaliforms'),
            'JP' => esc_html__('Japan', 'kaliforms'),
            'KZ' => esc_html__('Kazakhstan, Republic of', 'kaliforms'),
            'JO' => esc_html__('Jordan, Hashemite Kingdom of', 'kaliforms'),
            'KP' => esc_html__('Korea, Democratic Peoples Republic of', 'kaliforms'),
            'KR' => esc_html__('Korea, Republic of', 'kaliforms'),
            'KW' => esc_html__('Kuwait, State of', 'kaliforms'),
            'KG' => esc_html__('Kyrgyz Republic', 'kaliforms'),
            'LA' => esc_html__('Lao, People Democratic Republic', 'kaliforms'),
            'LB' => esc_html__('Lebanon, Lebanese Republic', 'kaliforms'),
            'MO' => esc_html__('Macao, Special Administrative Region of China', 'kaliforms'),
            'MY' => esc_html__('Malaysia', 'kaliforms'),
            'MV' => esc_html__('Maldives, Republic of', 'kaliforms'),
            'MN' => esc_html__('Mongolia', 'kaliforms'),
            'OM' => esc_html__('Oman, Sultanate of', 'kaliforms'),
            'NP' => esc_html__('Nepal, State of', 'kaliforms'),
            'PK' => esc_html__('Pakistan, Islamic Republic of', 'kaliforms'),
            'PH' => esc_html__('Philippines, Republic of the', 'kaliforms'),
            'TL' => esc_html__('Timor-Leste, Democratic Republic of', 'kaliforms'),
            'QA' => esc_html__('Qatar, State of', 'kaliforms'),
            'RU' => esc_html__('Russian Federation', 'kaliforms'),
            'SA' => esc_html__('Saudi Arabia, Kingdom of', 'kaliforms'),
            'SG' => esc_html__('Singapore, Republic of', 'kaliforms'),
            'VN' => esc_html__('Vietnam, Socialist Republic of', 'kaliforms'),
            'SY' => esc_html__('Syrian Arab Republic', 'kaliforms'),
            'TJ' => esc_html__('Tajikistan, Republic of', 'kaliforms'),
            'TH' => esc_html__('Thailand, Kingdom of', 'kaliforms'),
            'AE' => esc_html__('United Arab Emirates', 'kaliforms'),
            'TR' => esc_html__('Turkey, Republic of', 'kaliforms'),
            'TM' => esc_html__('Turkmenistan', 'kaliforms'),
            'UZ' => esc_html__('Uzbekistan, Republic of', 'kaliforms'),
            'YE' => esc_html__('Yemen', 'kaliforms'),
            'XE' => esc_html__('Iraq-Saudi Arabia Neutral Zone', 'kaliforms'),
            'XD' => esc_html__('United Nations Neutral Zone', 'kaliforms'),
            'XS' => esc_html__('Spratly Islands', 'kaliforms'),
        ];
        $europeCountries = [
            'AL' => esc_html__('Albania, Republic of', 'kaliforms'),
            'AD' => esc_html__('Andorra, Principality of', 'kaliforms'),
            'AZ' => esc_html__('Azerbaijan, Republic of', 'kaliforms'),
            'AT' => esc_html__('Austria, Republic of', 'kaliforms'),
            'AM' => esc_html__('Armenia, Republic of', 'kaliforms'),
            'BE' => esc_html__('Belgium, Kingdom of', 'kaliforms'),
            'BA' => esc_html__('Bosnia and Herzegovina', 'kaliforms'),
            'BG' => esc_html__('Bulgaria, Republic of', 'kaliforms'),
            'BY' => esc_html__('Belarus, Republic of', 'kaliforms'),
            'HR' => esc_html__('Croatia, Republic of', 'kaliforms'),
            'CY' => esc_html__('Cyprus, Republic of', 'kaliforms'),
            'CZ' => esc_html__('Czech Republic', 'kaliforms'),
            'DK' => esc_html__('Denmark, Kingdom of', 'kaliforms'),
            'EE' => esc_html__('Estonia, Republic of', 'kaliforms'),
            'FO' => esc_html__('Faroe Islands', 'kaliforms'),
            'FI' => esc_html__('Finland, Republic of', 'kaliforms'),
            'AX' => esc_html__('Åland Islands', 'kaliforms'),
            'FR' => esc_html__('France, French Republic', 'kaliforms'),
            'GE' => esc_html__('Georgia', 'kaliforms'),
            'DE' => esc_html__('Germany, Federal Republic of', 'kaliforms'),
            'GI' => esc_html__('Gibraltar', 'kaliforms'),
            'GR' => esc_html__('Greece, Hellenic Republic', 'kaliforms'),
            'VA' => esc_html__('Holy See (Vatican City State)', 'kaliforms'),
            'HU' => esc_html__('Hungary, Republic of', 'kaliforms'),
            'IS' => esc_html__('Iceland, Republic of', 'kaliforms'),
            'IE' => esc_html__('Ireland', 'kaliforms'),
            'IT' => esc_html__('Italy, Italian Republic', 'kaliforms'),
            'KZ' => esc_html__('Kazakhstan, Republic of', 'kaliforms'),
            'LV' => esc_html__('Latvia, Republic of', 'kaliforms'),
            'LI' => esc_html__('Liechtenstein, Principality of', 'kaliforms'),
            'LT' => esc_html__('Lithuania, Republic of', 'kaliforms'),
            'LU' => esc_html__('Luxembourg, Grand Duchy of', 'kaliforms'),
            'MT' => esc_html__('Malta, Republic of', 'kaliforms'),
            'MC' => esc_html__('Monaco, Principality of', 'kaliforms'),
            'MD' => esc_html__('Moldova, Republic of', 'kaliforms'),
            'ME' => esc_html__('Montenegro, Republic of', 'kaliforms'),
            'NL' => esc_html__('Netherlands, Kingdom of the', 'kaliforms'),
            'NO' => esc_html__('Norway, Kingdom of', 'kaliforms'),
            'PL' => esc_html__('Poland, Republic of', 'kaliforms'),
            'PT' => esc_html__('Portugal, Portuguese Republic', 'kaliforms'),
            'RO' => esc_html__('Romania', 'kaliforms'),
            'RU' => esc_html__('Russian Federation', 'kaliforms'),
            'SM' => esc_html__('San Marino, Republic of', 'kaliforms'),
            'RS' => esc_html__('Serbia, Republic of', 'kaliforms'),
            'SK' => esc_html__('Slovakia (Slovak Republic)', 'kaliforms'),
            'SI' => esc_html__('Slovenia, Republic of', 'kaliforms'),
            'ES' => esc_html__('Spain, Kingdom of', 'kaliforms'),
            'SJ' => esc_html__('Svalbard & Jan Mayen Islands', 'kaliforms'),
            'SE' => esc_html__('Sweden, Kingdom of', 'kaliforms'),
            'CH' => esc_html__('Switzerland, Swiss Confederation', 'kaliforms'),
            'TR' => esc_html__('Turkey, Republic of', 'kaliforms'),
            'UA' => esc_html__('Ukraine', 'kaliforms'),
            'MK' => esc_html__('Macedonia, The Former Yugoslav Republic of', 'kaliforms'),
            'GB' => esc_html__('United Kingdom of Great Britain & Northern Ireland', 'kaliforms'),
            'GG' => esc_html__('Guernsey, Bailiwick of', 'kaliforms'),
            'JE' => esc_html__('Jersey, Bailiwick of', 'kaliforms'),
            'IM' => esc_html__('Isle of Man', 'kaliforms'),
        ];
        $naCountries = [
            'AG' => esc_html__('Antigua and Barbuda', 'kaliforms'),
            'BS' => esc_html__('Bahamas, Commonwealth of the', 'kaliforms'),
            'BB' => esc_html__('Barbados', 'kaliforms'),
            'BM' => esc_html__('Bermuda', 'kaliforms'),
            'BZ' => esc_html__('Belize', 'kaliforms'),
            'VG' => esc_html__('British Virgin Islands', 'kaliforms'),
            'CA' => esc_html__('Canada', 'kaliforms'),
            'KY' => esc_html__('Cayman Islands', 'kaliforms'),
            'CR' => esc_html__('Costa Rica, Republic of', 'kaliforms'),
            'CU' => esc_html__('Cuba, Republic of', 'kaliforms'),
            'DM' => esc_html__('Dominica, Commonwealth of', 'kaliforms'),
            'DO' => esc_html__('Dominican Republic', 'kaliforms'),
            'SV' => esc_html__('El Salvador, Republic of', 'kaliforms'),
            'GL' => esc_html__('Greenland', 'kaliforms'),
            'GD' => esc_html__('Grenada', 'kaliforms'),
            'GP' => esc_html__('Guadeloupe', 'kaliforms'),
            'GT' => esc_html__('Guatemala, Republic of', 'kaliforms'),
            'HT' => esc_html__('Haiti, Republic of', 'kaliforms'),
            'HN' => esc_html__('Honduras, Republic of', 'kaliforms'),
            'JM' => esc_html__('Jamaica', 'kaliforms'),
            'MQ' => esc_html__('Martinique', 'kaliforms'),
            'MX' => esc_html__('Mexico, United Mexican States', 'kaliforms'),
            'MS' => esc_html__('Montserrat', 'kaliforms'),
            'AN' => esc_html__('Netherlands Antilles', 'kaliforms'),
            'CW' => esc_html__('Curaçao', 'kaliforms'),
            'AW' => esc_html__('Aruba', 'kaliforms'),
            'SX' => esc_html__('Sint Maarten (Netherlands)', 'kaliforms'),
            'BQ' => esc_html__('Bonaire, Sint Eustatius and Saba', 'kaliforms'),
            'NI' => esc_html__('Nicaragua, Republic of', 'kaliforms'),
            'UM' => esc_html__('United States Minor Outlying Islands', 'kaliforms'),
            'PA' => esc_html__('Panama, Republic of', 'kaliforms'),
            'PR' => esc_html__('Puerto Rico, Commonwealth of', 'kaliforms'),
            'BL' => esc_html__('Saint Barthelemy', 'kaliforms'),
            'KN' => esc_html__('Saint Kitts and Nevis, Federation of', 'kaliforms'),
            'AI' => esc_html__('Anguilla', 'kaliforms'),
            'LC' => esc_html__('Saint Lucia', 'kaliforms'),
            'MF' => esc_html__('Saint Martin', 'kaliforms'),
            'PM' => esc_html__('Saint Pierre and Miquelon', 'kaliforms'),
            'VC' => esc_html__('Saint Vincent and the Grenadines', 'kaliforms'),
            'TT' => esc_html__('Trinidad and Tobago, Republic of', 'kaliforms'),
            'TC' => esc_html__('Turks and Caicos Islands', 'kaliforms'),
            'US' => esc_html__('United States of America', 'kaliforms'),
            'VI' => esc_html__('United States Virgin Islands', 'kaliforms'),
        ];
        $saCountries = [
            'AR' => esc_html__('Argentina, Argentine Republic', 'kaliforms'),
            'BO' => esc_html__('Bolivia, Republic of', 'kaliforms'),
            'BR' => esc_html__('Brazil, Federative Republic of', 'kaliforms'),
            'CL' => esc_html__('Chile, Republic of', 'kaliforms'),
            'CO' => esc_html__('Colombia, Republic of', 'kaliforms'),
            'EC' => esc_html__('Ecuador, Republic of', 'kaliforms'),
            'FK' => esc_html__('Falkland Islands (Malvinas)', 'kaliforms'),
            'GF' => esc_html__('French Guiana', 'kaliforms'),
            'GY' => esc_html__('Guyana, Co-operative Republic of', 'kaliforms'),
            'PY' => esc_html__('Paraguay, Republic of', 'kaliforms'),
            'PE' => esc_html__('Peru, Republic of', 'kaliforms'),
            'SR' => esc_html__('Suriname, Republic of', 'kaliforms'),
            'UY' => esc_html__('Uruguay, Eastern Republic of', 'kaliforms'),
            'VE' => esc_html__('Venezuela, Bolivarian Republic of', 'kaliforms'),
        ];
        $ocCountries = [
            'AS' => esc_html__('American Samoa', 'kaliforms'),
            'AU' => esc_html__('Australia, Commonwealth of', 'kaliforms'),
            'SB' => esc_html__('Solomon Islands', 'kaliforms'),
            'CK' => esc_html__('Cook Islands', 'kaliforms'),
            'FJ' => esc_html__('Fiji, Republic of the Fiji Islands', 'kaliforms'),
            'PF' => esc_html__('French Polynesia', 'kaliforms'),
            'KI' => esc_html__('Kiribati, Republic of', 'kaliforms'),
            'GU' => esc_html__('Guam', 'kaliforms'),
            'NR' => esc_html__('Nauru, Republic of', 'kaliforms'),
            'NC' => esc_html__('New Caledonia', 'kaliforms'),
            'VU' => esc_html__('Vanuatu, Republic of', 'kaliforms'),
            'NZ' => esc_html__('New Zealand', 'kaliforms'),
            'NU' => esc_html__('Niue', 'kaliforms'),
            'NF' => esc_html__('Norfolk Island', 'kaliforms'),
            'MP' => esc_html__('Northern Mariana Islands, Commonwealth of the', 'kaliforms'),
            'UM' => esc_html__('United States Minor Outlying Islands', 'kaliforms'),
            'FM' => esc_html__('Micronesia, Federated States of', 'kaliforms'),
            'MH' => esc_html__('Marshall Islands, Republic of the', 'kaliforms'),
            'PW' => esc_html__('Palau, Republic of', 'kaliforms'),
            'PG' => esc_html__('Papua New Guinea, Independent State of', 'kaliforms'),
            'PN' => esc_html__('Pitcairn Islands', 'kaliforms'),
            'TK' => esc_html__('Tokelau', 'kaliforms'),
            'TO' => esc_html__('Tonga, Kingdom of', 'kaliforms'),
            'TV' => esc_html__('Tuvalu', 'kaliforms'),
            'WF' => esc_html__('Wallis and Futuna', 'kaliforms'),
            'WS' => esc_html__('Samoa, Independent State of', 'kaliforms'),
            'XX' => esc_html__('Disputed Territory', 'kaliforms'),
        ];
        $allCountries = array_merge(
            $africaCountries,
            $antarticaCountries,
            $asiaCountries,
            $europeCountries,
            $naCountries,
            $saCountries,
            $ocCountries
        );
        ksort($allCountries);
        $this->countries = [
            'all' => [
                'label' => esc_html__('All Countries', 'kaliforms'),
                'code' => 'all',
                'countries' => $allCountries,
            ],
            'africa' => [
                'label' => esc_html__('Africa', 'kaliforms'),
                'code' => 'AF',
                'countries' => $africaCountries,
            ],
            'antarctica' => [
                'label' => esc_html__('Antarctica', 'kaliforms'),
                'code' => 'AN',
                'countries' => $antarticaCountries,
            ],
            'asia' => [
                'label' => esc_html__('Asia', 'kaliforms'),
                'code' => 'AS',
                'countries' => $asiaCountries,
            ],
            'europe' => [
                'label' => esc_html__('Europe', 'kaliforms'),
                'code' => 'EU',
                'countries' => $europeCountries,
            ],
            'northAmerica' => [
                'label' => esc_html__('North America', 'kaliforms'),
                'code' => 'NA',
                'countries' => $naCountries,
            ],
            'southAmerica' => [
                'label' => esc_html__('South America', 'kaliforms'),
                'code' => 'SA',
                'countries' => $saCountries,
            ],
            'oceania' => [
                'label' => esc_html__('Oceania', 'kaliforms'),
                'code' => 'OC',
                'countries' => $ocCountries,
            ],
        ];
    }
    /**
     * Set options
     *
     * @return void
     */
    public function set_options()
    {
        $this->label = esc_html__('Countries', 'kaliforms');
        foreach ($this->countries as $continent) {
            $this->options[] = [
                'id' => $continent['code'],
                'label' => $continent['label'],
                'options' => $continent['countries'],
            ];
        }
    }
}
