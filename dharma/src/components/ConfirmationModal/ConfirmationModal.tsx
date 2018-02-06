import * as React from 'react';
import {
	Row,
	Col,
	Button,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter
} from 'reactstrap';

interface Props {
	modal: boolean;
	title: string;
	content: string;
	closeButtonText: string;
	submitButtonText: string;
	onToggle: () => void;
	onSubmit: () => void;
}

class ConfirmationModal extends React.Component<Props, {}> {
	constructor (props: Props) {
		super(props);
		this.handleToggle = this.handleToggle.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleToggle() {
		this.props.onToggle();
	}

	handleSubmit() {
		this.props.onSubmit();
	}

	render() {
		return (
			<div>
				<Modal isOpen={this.props.modal} toggle={this.handleToggle}>
					<ModalHeader toggle={this.handleToggle}>{this.props.title}</ModalHeader>
					<ModalBody>
						{this.props.content}
					</ModalBody>
					<ModalFooter>
						<Row className="button-container">
							<Col xs="12" md="6">
								<Button className="button secondary width-95" onClick={this.handleToggle}>{this.props.closeButtonText}</Button>
							</Col>
							<Col xs="12" md="6" className="align-right">
								<Button className="button width-95" onClick={this.handleSubmit}>{this.props.submitButtonText}</Button>
							</Col>
						</Row>
					</ModalFooter>
				</Modal>
			</div>
		);
	}
}

export { ConfirmationModal };
