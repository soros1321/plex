import * as React from 'react';
import {
	Form,
	FormGroup,
	Label,
	Input,
	Button
} from 'reactstrap';
import { Header, MainWrapper } from '../../../components';
import { Link } from 'react-router';
import './FillLoanEmpty.css';

interface States {
	requestId: string;
}

class FillLoanEmpty extends React.Component<{}, States> {
	constructor(props: {}) {
		super(props);
		this.state = {
			requestId: ''
		};
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleInputChange(e: React.FormEvent<HTMLInputElement>) {
		const target = e.currentTarget;
		const value: string = target.value;
		switch (target.name) {
			case 'request-id':
				this.setState({requestId: value});
				break;
			default:
				break;
		}
	}

	handleSubmit(e: React.FormEvent<HTMLInputElement>) {
		e.preventDefault();
		console.log(this.state);
	}

	render() {
		return (
			<MainWrapper>
				<Header title={'Fill a loan'} description={'Here\'s a quick description of what a loan is and why you should fill one.'} />
				<Form className="form-container fill-loan-form">
					<FormGroup>
						<Label for="request-id">Paste the requester's loan request ID here</Label>
						<div className="input-border">
							<Input type="text" name="request-id" placeholder="Request ID" value={this.state.requestId} onChange={this.handleInputChange} />
						</div>
						<div className="button-container margin-top-30">
							<Link to="/fill/entered">
								<Button className="button">Next &#8594;</Button>
							</Link>
						</div>
					</FormGroup>
				</Form>
				<div className="instructions">
					<div className="title">Just getting started?</div>
					<div className="instructions-link">
						<Link to="#" >FILLING DEBT ORDERS (VIDEO)</Link>
					</div>
					<div className="instructions-link">
						<Link to="/chat" >JOIN THE DHARMA CHAT</Link>
					</div>
				</div>
			</MainWrapper>
		);
	}
}

export { FillLoanEmpty };
