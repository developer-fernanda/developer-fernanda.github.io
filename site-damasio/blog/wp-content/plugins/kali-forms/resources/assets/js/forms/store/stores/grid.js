import { observable, action, computed, makeObservable } from 'mobx';
export default class Grid {
	grid = KaliFormsObject.grid;

	draggedItem = {};
	draggedItemGrid = { i: '', w: 12, h: 0 };
	dragStarted = false;

	constructor() {
		makeObservable(this, {
			grid: observable,
			draggedItem: observable,
			draggedItemGrid: observable,
			dragStarted: observable,
			setGrid: action,
			addGridItem: action,
			addMultipleGridItems: action,
			setFieldDragged: action,
			setDraggedItemGrid: action,
			setDragStarted: action,
			getGrid: computed,
			lastY: computed,
			removeGridItem: action
		});
	}

	setGrid(grid) {
		this.grid = [...grid];
	}
	addGridItem(item) {
		this.grid.push(item)
	}
	addMultipleGridItems(items) {
		this.grid = [...this.grid, ...items]
	}
	setFieldDragged(item) {
		this.draggedItem = item;
	}
	setDraggedItemGrid(item) {
		this.draggedItemGrid = item;
	}
	setDragStarted(state) {
		this.dragStarted = state
	}

	get getGrid() {
		return this.grid;
	}

	get lastY() {
		if (!this.grid.length) {
			return 0;
		}

		let item = this.grid[this.grid.length - 1];
		return item.y;
	}

	removeGridItem(id) {
		this.grid = [...this.grid.filter(e => e.i !== id)];
	}
}
