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

interface RequestLoanState {
	amount: string;
}

class RequestLoan extends React.Component<{}, RequestLoanState> {
	constructor(props: {}) {
		super(props);
		this.state = {amount: ''};
		this.handleInputChange = this.handleInputChange.bind(this);
	}

	handleInputChange(e: React.FormEvent<HTMLInputElement>) {
		const target = e.currentTarget;
		const value: string = target.value;
		this.setState({
			amount: value
		});
		console.log(value);
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
											<Input type="text" name="amount" id="request-amount" placeholder="0.00" className="width-95" value={this.state.amount} onChange={e => this.handleInputChange(e)} />
										</Col>
										<Col xs="3">
											<Input type="select" name="currency" id="request-currency">
												<option value="ETH">ETH</option>
												<option value="BTC">BTC</option>
											</Input>
										</Col>
									</Row>
								</FormGroup>
								<div className="margin-top-30">
									<Checkbox name="collateralized" prepend="request" label="Collateralized" />
								</div>
								<SmallDescription description={'A quick, layman\'s definition of what collateralized means and why it\'s a smart idea goes here.'} />
								<FormGroup className="margin-top-30">
									<Label for="collateral">Collateral</Label>
									<Input type="select" name="collateral-source" id="request-collateral-source">
										<option value="">Select your source of collateral</option>
									</Input>
									<Row className="margin-top-10">
										<Col xs="9">
											<Input type="text" name="collateral-amount" id="request-collateral-amount" placeholder="Amount of collateral" className="width-95" />
										</Col>
										<Col xs="3">
											<Input type="select" name="collateral-currency" id="request-collateral-currency">
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
											<input type="radio" name="lockup-period" id="request-lockup-period-1week" value="1week" />{' '}
											<span className="checkmark" />
										</Label>
										<Label className="radio-container" check={false}>
											1 Day
											<input type="radio" name="lockup-period" id="request-lockup-period-1day" value="1day" />{' '}
											<span className="checkmark" />
										</Label>
										<Label className="radio-container no-label" check={false}>
											<span className="no-label">Custom</span>
											<input type="radio" name="lockup-period" id="request-lockup-period-custom" value="custom" />{' '}
											<span className="checkmark" />
										</Label>
										<Input type="text" name="custom-lockup-period" id="request-custom-lockup-period" placeholder="X Weeks" />
									</FormGroup>
								</FormGroup>
								<div className="button-container">
									<Button className="button" id="request-order">Request Order</Button>
								</div>
						</Col>
						<Col xs="12" md="6" className="right-form">
							<FormGroup>
								<Label for="terms">Terms</Label>
								<Input type="select" name="terms" id="request-terms">
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
