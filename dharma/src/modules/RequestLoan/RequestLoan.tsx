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
import { Header, Checkbox, SmallDescription } from '../../components';
import './RequestLoan.css';

enum CollateralLockupPeriod {Week1, Day1, Custom}

interface States {
	amount: string;
	currency: string;
	collateralized: boolean;
	collateral_source: string;
	collateral_amount: string;
	collateral_currency: string;
	collateral_lockup_period: CollateralLockupPeriod;
	collateral_custom_lockup_period: string;
	terms: string;
}

class RequestLoan extends React.Component<{}, States> {
	constructor(props: {}) {
		super(props);
		this.state = {
			amount: '',
			currency: 'ETH',
			collateralized: true,
			collateral_source: '',
			collateral_amount: '',
			collateral_currency: 'ETH',
			collateral_lockup_period: CollateralLockupPeriod.Week1,
			collateral_custom_lockup_period: '',
			terms: ''
		};
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleCollateralizedChange = this.handleCollateralizedChange.bind(this);
		this.handleLockupPeriodChange = this.handleLockupPeriodChange.bind(this);
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
				this.setState({collateral_source: value});
				break;
			case 'collateral-amount':
				this.setState({collateral_amount: value});
				break;
			case 'collateral-currency':
				this.setState({collateral_currency: value});
				break;
			case 'collateral-custom-lockup-period':
				this.setState({collateral_custom_lockup_period: value});
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
			collateral_source: '',
			collateral_amount: '',
			collateral_currency: '',
			collateral_lockup_period: CollateralLockupPeriod.Week1,
			collateral_custom_lockup_period: ''
		});
	}

	handleLockupPeriodChange(e: React.FormEvent<HTMLInputElement>) {
		const target = e.currentTarget;
		this.setState({
			collateral_lockup_period: CollateralLockupPeriod[target.value]
		});
		if (CollateralLockupPeriod[target.value] !== '2') {
			this.setState({
				collateral_custom_lockup_period: ''
			});
		}
	}

	render() {
		return (
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
											<input type="radio" name="lockup-period" value="Week1" onChange={this.handleLockupPeriodChange} checked={this.state.collateralized && this.state.collateral_lockup_period === CollateralLockupPeriod.Week1 ? true : false} disabled={!this.state.collateralized} />{' '}
											<span className="checkmark" />
										</Label>
										<Label className="radio-container" check={false}>
											1 Day
											<input type="radio" name="lockup-period" value="Day1" onChange={this.handleLockupPeriodChange} checked={this.state.collateralized && this.state.collateral_lockup_period === CollateralLockupPeriod.Day1 ? true : false} disabled={!this.state.collateralized} />{' '}
											<span className="checkmark" />
										</Label>
										<Label className="radio-container no-label" check={false}>
											<span className="no-label">Custom</span>
											<input type="radio" name="lockup-period" value="Custom" onChange={this.handleLockupPeriodChange} checked={this.state.collateralized && this.state.collateral_lockup_period === CollateralLockupPeriod.Custom ? true : false} disabled={!this.state.collateralized}  />{' '}
											<span className="checkmark" />
										</Label>
										<Input type="text" name="collateral-custom-lockup-period" value={this.state.collateral_custom_lockup_period} placeholder="X Weeks" onChange={this.handleInputChange} disabled={!this.state.collateralized || this.state.collateral_lockup_period !== CollateralLockupPeriod.Custom}/>
									</FormGroup>
								</FormGroup>
								<div className="button-container">
									<Button className="button" id="request-order">Request Order</Button>
								</div>
						</Col>
						<Col xs="12" md="6" className="right-form">
							<FormGroup>
								<Label for="terms">Terms</Label>
								<Input type="select" name="terms" value={this.state.currency} onChange={this.handleInputChange}>
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
			</div>
		);
	}
}

export { RequestLoan };
