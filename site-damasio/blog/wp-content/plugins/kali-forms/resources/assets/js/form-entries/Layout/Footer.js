import React from 'react'
import { Layout as AntdLayout, Typography } from 'antd';
const { Footer } = AntdLayout;
const { __ } = wp.i18n;
import StarFilled from '@ant-design/icons/StarFilled';

export default function MyFooter() {
	return (
		<Footer style={{ textAlign: 'center' }}>
			<Typography.Paragraph>
				<a href="https://wordpress.org/support/plugin/kali-forms/reviews/#rate-response" target="_blank">
					{__('Rate us on WordPress!', 'kaliforms')} <StarFilled /><StarFilled /><StarFilled /><StarFilled /><StarFilled />
				</a>
			</Typography.Paragraph>
		</Footer>
	)
}
