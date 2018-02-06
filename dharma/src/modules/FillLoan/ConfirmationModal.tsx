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
	requestId: string;
	amount: string;
	currency: string;
	onToggle: () => void;
}

class ConfirmationModal extends React.Component<Props, {}> {
	constructor (props: Props) {
		super(props);
		this.handleToggle = this.handleToggle.bind(this);
	}

	handleToggle() {
		this.props.onToggle();
	}

	render() {
		return (
			<div>
				<Modal isOpen={this.props.modal} toggle={this.handleToggle}>
					<ModalHeader toggle={this.handleToggle}>Please confirm</ModalHeader>
					<ModalBody>
						You will fill this debt order {this.props.requestId}. This operation will debit {this.props.amount} {this.props.currency} from your account.
					</ModalBody>
					<ModalFooter>
						<Row className="button-container">
							<Col xs="12" md="6">
								<Button className="button secondary width-95" onClick={this.handleToggle}>Cancel</Button>
							</Col>
							<Col xs="12" md="6" className="align-right">
								<Button className="button width-95" onClick={this.handleToggle}>Fill Order</Button>
							</Col>
						</Row>
					</ModalFooter>
				</Modal>
			</div>
		);
	}
}

export { ConfirmationModal };
