import * as React from 'react';
import { browserHistory } from 'react-router';
import './TypeForm.css';

interface States {
	intervalId: number;
}

class TypeForm extends React.Component<{}, States> {
	constructor(props: {}) {
		super(props);
		this.checkForm = this.checkForm.bind(this);
		this.state = {
			intervalId: 0
		};
	}
	componentDidMount() {
		const intervalId = window.setInterval(this.checkForm, 1000);
		this.setState({intervalId: intervalId});
	}
	componentWillUnmount() {
		window.clearInterval(this.state.intervalId);
		this.setState({intervalId: 0});
	}

	checkForm() {
		if (document!.getElementById('form-values')!.innerHTML !== '') {
			const formValues = JSON.parse(document!.getElementById('form-values')!.innerHTML);
			document!.getElementById('form-values')!.innerHTML = '';
			window.clearInterval(this.state.intervalId);
			this.setState({intervalId: 0});

			console.log(formValues);
			window.setTimeout(() => { browserHistory.push('/request/success'); }, 1500);
		}
	}

	render() {
		const copy = '<iframe class="form-container" src="/typeform.html"></iframe>';
		return (
			<div>
				<div id="request-loan-type-form" dangerouslySetInnerHTML={{__html: copy}} />
				<div id="form-values" />
			</div>
		);
	}
}

export { TypeForm };