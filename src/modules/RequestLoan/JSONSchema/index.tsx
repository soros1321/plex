import * as React from 'react';
import { schema, uiSchema } from './schema';
import { Header, JSONSchemaForm } from '../../../components';
import { Wrapper } from './styledComponents';
import './JSONSchema.css';

interface FormResponse {
	formData: {};
}

class JSONSchema extends React.Component<{}, FormResponse> {
	constructor(props: {}) {
		super(props);
		this.state = {
			formData: {}
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleScroll = this.handleScroll.bind(this);
	}

	componentDidMount() {
		window.addEventListener('scroll', this.handleScroll);
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll);
	}

	handleScroll() {
		const loan = document.getElementsByClassName('loan-container') as HTMLCollectionOf<HTMLElement>;
		const collateral = document.getElementsByClassName('collateral-container') as HTMLCollectionOf<HTMLElement>;
		const terms = document.getElementsByClassName('terms-container') as HTMLCollectionOf<HTMLElement>;

		if (loan.length && collateral.length && terms.length) {
			if (window.scrollY > 400) {
				// Set focus on the loan container
				loan[0].style.opacity = '0.2';
				collateral[0].style.opacity = '0.2';
				terms[0].style.opacity = '1';
			} else if (window.scrollY > 200 && window.scrollY <= 400) {
				// Set focus on the collateral container
				loan[0].style.opacity = '0.2';
				collateral[0].style.opacity = '1';
				terms[0].style.opacity = '0.2';
			} else {
				// Set focus on the terms container
				loan[0].style.opacity = '1';
				collateral[0].style.opacity = '0.2';
				terms[0].style.opacity = '0.2';
			}
		}
	}

	handleChange(formData: {}) {
		const collateralized = document.getElementById('root_collateral_collateralized') as HTMLInputElement;
		const collateralSource = document.getElementById('root_collateral_source') as HTMLInputElement;
		const collateralAmount = document.getElementById('root_collateral_amount') as HTMLInputElement;
		const collateralCurrency = document.getElementById('root_collateral_currency') as HTMLInputElement;
		const lockupPeriod = document.querySelectorAll('.lockup-period-container input') as NodeListOf<HTMLInputElement>;
		const customLockupPeriod = document.getElementById('root_collateral_customPeriod') as HTMLInputElement;

		if (collateralized.checked) {
			collateralSource.disabled = false;
			collateralAmount.disabled = false;
			collateralCurrency.disabled = false;
			lockupPeriod[0].disabled = false;
			lockupPeriod[1].disabled = false;
			lockupPeriod[2].disabled = false;
			if (lockupPeriod[2].checked) {
				customLockupPeriod.disabled = false;
			} else {
				customLockupPeriod.disabled = true;
			}
		} else {
			collateralSource.disabled = true;
			collateralAmount.disabled = true;
			collateralCurrency.disabled = true;
			lockupPeriod[0].disabled = true;
			lockupPeriod[1].disabled = true;
			lockupPeriod[2].disabled = true;
			customLockupPeriod.disabled = true;
		}
		this.setState({
			formData: formData
		});
	}

	handleSubmit() {
		console.log('Form submitted', this.state);
	}

	render() {
		return (
			<Wrapper>
				<Header title={'Request a loan'} description={'Here\'s a quick description of what a debt order is and why you should request one.'} />
				<JSONSchemaForm
					schema={schema}
					uiSchema={uiSchema}
					formData={this.state.formData}
					onHandleChange={this.handleChange}
					onHandleSubmit={this.handleSubmit}
				/>
			</Wrapper>
		);
	}
}

export {JSONSchema};
