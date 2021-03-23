import React from 'react'
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import MenuOutlined from '@ant-design/icons/MenuOutlined';


const DragHandle = sortableHandle(() => (
	<MenuOutlined style={{ cursor: 'pointer', color: '#999' }} />
));
const SortableItem = sortableElement(props => <tr {...props} />);
const SortableContainer = sortableContainer(props => <tbody {...props} />);

export { DragHandle, SortableContainer, SortableItem }
