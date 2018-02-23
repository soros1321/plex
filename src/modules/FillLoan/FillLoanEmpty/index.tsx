import * as React from 'react';
import {
	Form,
	FormGroup,
	Input,
	Button
} from 'reactstrap';
import { Header, MainWrapper } from '../../../components';
import { Link } from 'react-router';
import { PaperLayout } from '../../../layouts';
import {
	StyledLabel,
	InputBorder,
	ButtonContainer,
	Instructions,
	Title,
	StyledLink
} from './styledComponents';

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
			<PaperLayout>
				<MainWrapper>
					<Header title={'Fill a loan'} description={'Here\'s a quick description of what a loan is and why you should fill one.'} />
					<Form>
						<FormGroup>
							<StyledLabel>Paste the requester's loan request ID here</StyledLabel>
							<InputBorder>
								<Input type="text" name="request-id" placeholder="Request ID" value={this.state.requestId} onChange={this.handleInputChange} />
							</InputBorder>
							<ButtonContainer>
								<Link to="/fill/entered">
									<Button className="button">Next &#8594;</Button>
								</Link>
							</ButtonContainer>
						</FormGroup>
					</Form>
					<Instructions>
						<Title>Just getting started?</Title>
						<StyledLink to="#" >FILLING DEBT ORDERS (VIDEO)</StyledLink>
						<StyledLink to="/chat" >JOIN THE DHARMA CHAT</StyledLink>
					</Instructions>
				</MainWrapper>
			</PaperLayout>
		);
	}
}

export { FillLoanEmpty };
