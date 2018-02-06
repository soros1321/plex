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
import './GetNotified.css';

interface Props {
	email: string;
	onInputChange: (email: string) => void;
	onFormSubmit: () => void;
}

class GetNotified extends React.Component<Props, {}> {
	constructor (props: Props) {
		super(props);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleInputChange(e: React.FormEvent<HTMLInputElement>) {
		this.props.onInputChange(e.currentTarget.value);
	}

	handleSubmit(e: React.FormEvent<HTMLInputElement>) {
		e.preventDefault();
		this.props.onFormSubmit();
	}

	render() {
		return (
			<div>
				<Form className="form-container get-notified-form">
					<FormGroup>
						<Label for="email">Get notified when your order is filled</Label>
						<Row>
							<Col xs="12" md="8">
								<Input type="text" name="email" placeholder="Enter your email" className="width-95" value={this.props.email} onChange={this.handleInputChange} />
							</Col>
							<Col xs="12" md="4">
								<Button className="button" type="submit" onClick={this.handleSubmit}>Get Notified</Button>
							</Col>
						</Row>
					</FormGroup>
				</Form>
			</div>
		);
	}
}

export { GetNotified };
