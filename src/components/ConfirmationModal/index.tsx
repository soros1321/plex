import * as React from "react";
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { ClipLoader } from "react-spinners";

interface Props {
    modal: boolean;
    title: string;
    content: JSX.Element;
    closeButtonText: string;
    submitButtonText: string;
    onToggle: () => void;
    onSubmit: () => void;
    disabled?: boolean;
    awaitingTx?: boolean;
}

class ConfirmationModal extends React.Component<Props, {}> {
    public static defaultProps: Partial<Props> = {
        disabled: false,
    };

    constructor(props: Props) {
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
        const { disabled, awaitingTx } = this.props;

        return (
            <div>
                <Modal
                    isOpen={this.props.modal}
                    toggle={this.handleToggle}
                    keyboard={false}
                    backdrop={"static"}
                >
                    <ModalHeader toggle={this.handleToggle}>{this.props.title}</ModalHeader>
                    <ModalBody>{this.props.content}</ModalBody>
                    <ModalFooter>
                        <Row className="button-container">
                            <Col xs="12" md="6">
                                <Button
                                    className="button secondary width-95"
                                    disabled={!!disabled || !!awaitingTx}
                                    onClick={this.handleToggle}
                                >
                                    {this.props.closeButtonText}
                                </Button>
                            </Col>
                            <Col xs="12" md="6" className="align-right">
                                <Button
                                    className="button width-95"
                                    disabled={!!disabled || !!awaitingTx}
                                    onClick={this.handleSubmit}
                                >
                                    {this.props.submitButtonText}
                                    <ClipLoader
                                        size={12}
                                        color={"#FFFFFF"}
                                        loading={!!awaitingTx}
                                    />
                                </Button>
                            </Col>
                        </Row>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export { ConfirmationModal };
