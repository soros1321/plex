import * as React from 'react';
import { schema, uiSchema } from './schema';
import { Header, JSONSchemaForm } from '../../../components';
import { Wrapper } from './styledComponents';

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
