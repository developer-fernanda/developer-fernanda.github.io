const supressNotices = () => {
	const tryToParseActions = arr => {
		let obj = [];
		arr.map((action, idx) => {
			action.classList.remove('button', 'button-primary');
			if (idx === 0) { action.classList.add('primary'); }
			if (action.classList.contains('js-notice-hide')) {
				return;
			}
			obj.push({
				label: action.innerText,
				href: action.getAttribute('href'),
				id: action.getAttribute('id'),
				class: action.getAttribute('class'),
				variant: 'primary',
			})
		})
		return obj;
	}
	const noticePush = (e) => {
		e.style.display = 'none';
		if (e.classList.contains('hidden')) {
			return;
		}

		let types = [
			'success',
			'error',
			'info',
			'warning',
			'error',
		]

		let type = 'info';

		types.map(eType => type = e.classList.contains(eType) ? eType : type)

		if (e.getAttribute('id') === 'kaliforms-review-notice') {
			notices.push({
				message: e.querySelector('p').innerText,
				title: e.getAttribute('data-title'),
				tip: true,
				id: e.getAttribute('id'),
				type: 'info',
				actions: tryToParseActions([...e.querySelectorAll('a')]),
			});
			return;
		}

		notices.push({
			type: type,
			id: e.getAttribute('id'),
			title: '',
			message: e.innerText.replace('Post', 'Form'),
			tip: false,
			actions: [],
		});
	}

	let notices = [];
	[...document.querySelectorAll('.notice')].map(e => noticePush(e));
	[...document.querySelectorAll('.error')].map(e => noticePush(e));

	// notices.push({ message: 'Easily create dynamic forms by hiding & showing fields in your form', title:'Conditional logic', tip: true, id: '123123', type: 'info' });

	return notices;
}

export default supressNotices;
