import * as React from 'react';
import {
	Button,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter
} from 'reactstrap';
import { Bold } from '../../../../components';
import { shortenString } from '../../../../utils';

interface Props {
	modal: boolean;
	debtorSignature: string;
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
				<Modal isOpen={this.props.modal} toggle={this.handleToggle} keyboard={false} backdrop={'static'}>
					<ModalHeader toggle={this.handleToggle}>Filled</ModalHeader>
					<ModalBody>
						You filled debt order <Bold>{shortenString(this.props.debtorSignature)}</Bold>. You will find this order at the top of your dashboard.
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
