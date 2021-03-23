const { registerBlockType } = wp.blocks;
const { __ } = wp.i18n;
import './style.scss';
import KaliIcon from './kali-icon';
import Edit from './edit';
import Save from './save';
const { withSelect } = wp.data;

registerBlockType('kali-forms/kali-forms-block', {
	title: __('Kali Forms Block (BETA)', 'kaliforms'),
	description: __(
		'Add a form to your page using this block',
		'kaliforms'
	),
	category: 'common',
	icon: KaliIcon,
	supports: {
		html: false,
	},
	attributes: {
		form: {
			type: 'string',
		},
		values: {
			type: 'json'
		},
		loading: {
			type: 'boolean',
		},
		rows: {
			type: 'object',
		}
	},
	edit: withSelect(select => {
		return {
			forms: select('core').getEntityRecords('postType', 'kaliforms_forms', { per_page: -1 }),
		};
	})(Edit),
	save: Save,
});
