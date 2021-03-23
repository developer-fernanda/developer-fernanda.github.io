import { observable, action, computed, makeObservable } from 'mobx';
import { computedFn } from "mobx-utils"
export default class FormStyles {
    styles = KaliFormsObject.formStyles;
    selectedStyle = KaliFormsObject.selectedFormStyle;

    constructor() {
        makeObservable(this, {
            styles: observable,
            selectedStyle: observable,
            setSelectedStyle: action,
            pages: computed
        });
    }

    setSelectedStyle(key) {
		this.selectedStyle = key
	}
    get pages() {
		return Math.ceil(this.styles.length / 8);
	}
    getStylesPage = computedFn(function getStylesPage(page = 1) {
		return this.styles.slice((page - 1) * 8, page * 8);
	})
}
