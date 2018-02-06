import * as React from 'react';
import {
	Row,
	Col,
	Form,
	FormGroup,
	Label,
	Input,
	Button
} from 'reactstrap';
import { Header, Checkbox, SmallDescription, ConfirmationModal } from '../../components';
import { browserHistory } from 'react-router';
import './RequestLoanForm.css';

enum CollateralLockupPeriod {Week1, Day1, Custom}

interface States {
	amount: string;
	currency: string;
	collateralized: boolean;
	collateralSource: string;
	collateralAmount: string;
	collateralCurrency: string;
	collateralLockupPeriod: CollateralLockupPeriod;
	collateralCustomLockupPeriod: string;
	terms: string;
	confirmationModal: boolean;
}

class RequestLoanForm extends React.Component<{}, States> {
	constructor(props: {}) {
		super(props);
		this.state = {
			amount: '',
			currency: 'ETH',
			collateralized: true,
			collateralSource: '',
			collateralAmount: '',
			collateralCurrency: 'ETH',
			collateralLockupPeriod: CollateralLockupPeriod.Week1,
			collateralCustomLockupPeriod: '',
			terms: 'recommended',
			confirmationModal: false
		};
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleCollateralizedChange = this.handleCollateralizedChange.bind(this);
		this.handleLockupPeriodChange = this.handleLockupPeriodChange.bind(this);
		this.confirmationModalToggle = this.confirmationModalToggle.bind(this);
		this.successModalToggle = this.successModalToggle.bind(this);
	}

	handleInputChange(e: React.FormEvent<HTMLInputElement>) {
		const target = e.currentTarget;
		const value: string = target.value;
		switch (target.name) {
			case 'amount':
				this.setState({amount: value});
				break;
			case 'currency':
				this.setState({currency: value});
				break;
			case 'collateral-source':
				this.setState({collateralSource: value});
				break;
			case 'collateral-amount':
				this.setState({collateralAmount: value});
				break;
			case 'collateral-currency':
				this.setState({collateralCurrency: value});
				break;
			case 'collateral-custom-lockup-period':
				this.setState({collateralCustomLockupPeriod: value});
				break;
			case 'terms':
				this.setState({terms: value});
				break;
			default:
				break;
		}
	}

	handleCollateralizedChange(checked: boolean) {
		this.setState({
			collateralized: checked,
			collateralSource: '',
			collateralAmount: '',
			collateralCurrency: '',
			collateralLockupPeriod: CollateralLockupPeriod.Week1,
			collateralCustomLockupPeriod: ''
		});
	}

	handleLockupPeriodChange(e: React.FormEvent<HTMLInputElement>) {
		const target = e.currentTarget;
		this.setState({
			collateralLockupPeriod: CollateralLockupPeriod[target.value]
		});
		if (CollateralLockupPeriod[target.value] !== '2') {
			this.setState({
				collateralCustomLockupPeriod: ''
			});
		}
	}

	confirmationModalToggle() {
		this.setState({
			confirmationModal: !this.state.confirmationModal
		});
	}

	successModalToggle() {
		this.setState({
			confirmationModal: false
		});
		browserHistory.push('/request/success');
	}

	render() {
		return (
			<div>
				{this.props.children ? this.props.children : (
					<div>
						<Header title={'Request a loan'} description={'Here\'s a quick description of what a debt order is and why you should request one.'} />
						<Form className="form-container">
							<Row>
								<Col xs="12" md="6" className="left-form">
										<FormGroup>
											<Label for="amount">Amount</Label>
											<Row>
												<Col xs="9">
													<Input type="text" name="amount" placeholder="0.00" className="width-95" value={this.state.amount} onChange={this.handleInputChange} />
												</Col>
												<Col xs="3">
													<Input type="select" name="currency" value={this.state.currency} onChange={this.handleInputChange}>
														<option value="ETH">ETH</option>
														<option value="BTC">BTC</option>
													</Input>
												</Col>
											</Row>
										</FormGroup>
										<div className="margin-top-30">
											<Checkbox name="collateralized" prepend="request" label="Collateralized" onChange={this.handleCollateralizedChange} checked={this.state.collateralized} />
										</div>
										<SmallDescription description={'A quick, layman\'s definition of what collateralized means and why it\'s a smart idea goes here.'} />
										<FormGroup className="margin-top-30">
											<Label for="collateral">Collateral</Label>
											<Input type="select" name="collateral-source" disabled={!this.state.collateralized} onChange={this.handleInputChange}>
												<option value="">Select your source of collateral</option>
											</Input>
											<Row className="margin-top-10">
												<Col xs="9">
													<Input type="text" name="collateral-amount" placeholder="Amount of collateral" className="width-95" disabled={!this.state.collateralized} onChange={this.handleInputChange}/>
												</Col>
												<Col xs="3">
													<Input type="select" name="collateral-currency" disabled={!this.state.collateralized} onChange={this.handleInputChange}>
														<option value="ETH">ETH</option>
														<option value="BTC">BTC</option>
													</Input>
												</Col>
											</Row>
										</FormGroup>
										<FormGroup>
											<FormGroup check={true} className="radio">
												Lockup period:
												<Label className="radio-container" check={true}>
													1 Week
													<input type="radio" name="lockup-period" value="Week1" onChange={this.handleLockupPeriodChange} checked={this.state.collateralized && this.state.collateralLockupPeriod === CollateralLockupPeriod.Week1 ? true : false} disabled={!this.state.collateralized} />{' '}
													<span className="checkmark" />
												</Label>
												<Label className="radio-container" check={false}>
													1 Day
													<input type="radio" name="lockup-period" value="Day1" onChange={this.handleLockupPeriodChange} checked={this.state.collateralized && this.state.collateralLockupPeriod === CollateralLockupPeriod.Day1 ? true : false} disabled={!this.state.collateralized} />{' '}
													<span className="checkmark" />
												</Label>
												<Label className="radio-container no-label" check={false}>
													<span className="no-label">Custom</span>
													<input type="radio" name="lockup-period" value="Custom" onChange={this.handleLockupPeriodChange} checked={this.state.collateralized && this.state.collateralLockupPeriod === CollateralLockupPeriod.Custom ? true : false} disabled={!this.state.collateralized}  />{' '}
													<span className="checkmark" />
												</Label>
												<Input type="text" name="collateral-custom-lockup-period" value={this.state.collateralCustomLockupPeriod} placeholder="X Weeks" onChange={this.handleInputChange} disabled={!this.state.collateralized || this.state.collateralLockupPeriod !== CollateralLockupPeriod.Custom}/>
											</FormGroup>
										</FormGroup>
										<div className="button-container">
											<Button className="button" onClick={this.confirmationModalToggle}>Request Order</Button>
										</div>
								</Col>
								<Col xs="12" md="6" className="right-form">
									<FormGroup>
										<Label for="terms">Terms</Label>
										<Input type="select" name="terms" value={this.state.terms} onChange={this.handleInputChange}>
											<option value="recommended">Recommended</option>
										</Input>
									</FormGroup>
									<FormGroup>
										<label>Principal</label>
										<div className="label-desc">
											Insert this information here
										</div>
									</FormGroup>
									<FormGroup>
										<label>Interest</label>
										<div className="label-desc">
											Insert this information here
										</div>
									</FormGroup>
									<FormGroup>
										<label>Repayment Terms</label>
										<div className="label-desc">
											Insert this information here
										</div>
									</FormGroup>
									<FormGroup>
										<label>Collateralization</label>
										<div className="label-desc">
											Insert this information here
										</div>
									</FormGroup>
								</Col>
							</Row>
						</Form>
						<ConfirmationModal modal={this.state.confirmationModal} title="Please confirm" content={`You are requesting a loan of ${this.state.amount} ${this.state.currency} using your ${this.state.collateralSource} as collateral per the terms in the contract on the previous page. Are you sure you want to do this?`} onToggle={this.confirmationModalToggle} onSubmit={this.successModalToggle} closeButtonText="&#8592; Modify Request" submitButtonText="Complete Request" />
					</div>
				)}
			</div>
		);
	}
}

export { RequestLoanForm };
