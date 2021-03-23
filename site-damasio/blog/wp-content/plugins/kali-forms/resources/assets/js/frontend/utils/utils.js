export default {
	/**
	 * Cross Browser compatibility for animation end
	 *
	 * @param {*} element
	 * @param {*} type
	 * @param {*} callback
	 * @memberof FormProcessor
	 */
	whichAnimationEvent() {
		let t;
		let el = document.createElement('fakeelement');
		let transitions = {
			'animation': 'animationend',
			'OAnimation': 'oAnimationEnd',
			'MozAnimation': 'animationend',
			'WebkitAnimation': 'webkitAnimationEnd'
		}

		for (t in transitions) {
			if (el.style[t] !== undefined) {
				return transitions[t];
			}
		}
	}
}
