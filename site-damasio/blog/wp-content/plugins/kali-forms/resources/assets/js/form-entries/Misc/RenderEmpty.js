import React from 'react'
import { Tooltip } from 'antd'
const { __ } = wp.i18n;
import InfoCircleOutlined from '@ant-design/icons/InfoCircleOutlined';
export default function RenderEmpty() {
	return (
		<div>
			<p>{__('No entry found ', 'kaliforms')}
				<Tooltip title={__('Most likely, user did not complete this field', 'kaliforms')}>
					<InfoCircleOutlined />
				</Tooltip>
			</p>
		</div>
	)
}
