import * as React from 'react';
import { schema, uiSchema } from './schema';
import Form from 'react-jsonschema-form';
import { Header } from '../../../components';
import { Button } from 'reactstrap';
import { Wrapper } from './styledComponents';
import './JSONSchemaForm.css';

interface FormResponse {
	formData: {
		loan: {
			amount: number;
			currency: string;
			description?: string;
		};
		collateral: {
			collateralized: boolean;
			source?: string;
			amount?: number;
			currency?: string;
			lockupPeriod?: string;
			customPeriod?: number;
		};
		terms: {
			principle: string;
			interest: string;
			repaymentDate: string;
			repaymentTerms: string;
		};
	};
}

class JSONSchemaForm extends React.Component<{}, FormResponse> {
	constructor(props: {}) {
		super(props);
		this.state = {
			formData: {
				loan: {
					amount: 0,
					currency: 'ETH'
				},
				collateral: {
					collateralized: true
				},
				terms: {
					principle: 'option1',
					interest: 'option1',
					repaymentDate: 'option1',
					repaymentTerms: 'option1'
				}
			}
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount() {
		const loan = document.getElementsByClassName('loan-container') as HTMLCollectionOf<HTMLElement>;
		const collateral = document.getElementsByClassName('collateral-container') as HTMLCollectionOf<HTMLElement>;
		const terms = document.getElementsByClassName('terms-container') as HTMLCollectionOf<HTMLElement>;
		window.addEventListener('scroll', function() {
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
		});
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', function() {
			console.log('event removed');
		});
	}

	handleChange(response: FormResponse) {
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
			formData: response.formData
		});
	}

	handleSubmit(response: FormResponse) {
		console.log('State data', this.state);
	}

	render() {
		return (
			<Wrapper>
				<Header title={'Request a loan'} description={'Here\'s a quick description of what a debt order is and why you should request one.'} />
				<Form schema={schema} uiSchema={uiSchema} onSubmit={this.handleSubmit} onChange={this.handleChange} formData={this.state.formData}>
					<Button type="submit" className="button">Request Loan</Button>
				</Form>
			</Wrapper>
		);
	}
}

export {JSONSchemaForm};
