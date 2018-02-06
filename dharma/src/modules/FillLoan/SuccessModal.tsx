import * as React from 'react';
import {
	Button,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter
} from 'reactstrap';

interface Props {
	modal: boolean;
	requestId: string;
	onToggle: () => void;
}

class SuccessModal extends React.Component<Props, {}> {
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
					<ModalHeader toggle={this.handleToggle}>Filled</ModalHeader>
					<ModalBody>
						You filled debt order {this.props.requestId}. You will find this order at the top of your dashboard.
					</ModalBody>
					<ModalFooter className="center">
						<Button className="button" onClick={this.handleToggle}>Done</Button>
					</ModalFooter>
				</Modal>
			</div>
		);
	}
}

export { SuccessModal };
