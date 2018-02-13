import * as React from 'react';
import {
	Row,
	Col,
	FormGroup,
	Label,
	Input,
	Button
} from 'reactstrap';
import './ShareRequestURL.css';

interface Props {
	requestURL: string;
	onCopyClipboard: () => void;
	onShareSocial: (socialMediaName: string) => void;
}

class ShareRequestURL extends React.Component<Props, {}> {
	constructor (props: Props) {
		super(props);
		this.handleCopyClipboard = this.handleCopyClipboard.bind(this);
		this.handleShareSocial = this.handleShareSocial.bind(this);
	}

	handleCopyClipboard() {
		this.props.onCopyClipboard();
	}

	handleShareSocial(socialMediaName: string, e: React.MouseEvent<HTMLDivElement>) {
		this.props.onShareSocial(socialMediaName);
	}

	render() {
		const socialButtons = [
			{name: 'twitter', imgURL: require('../../../../assets/img/logo_twitter.png')},
			{name: 'facebook', imgURL: require('../../../../assets/img/logo_facebook.png')},
			{name: 'instagram', imgURL: require('../../../../assets/img/logo_instagram.png')}
		];
		const socialButtonsRow = socialButtons.map((social) => (
			<div className="share-button" key={social.name} onClick={(e) => this.handleShareSocial(social.name, e)}>
				<img src={social.imgURL} />
			</div>
		));
		return (
			<div className="share-request-url-container">
				<Label for="request-url">Share your request URL</Label>
				<Row className="gray">
					<Col xs="12" md="2" className="image-container" />
					<Col xs="12" md="10">
						<div className="share-buttons-container">
							{socialButtonsRow}
						</div>
						<FormGroup>
							<Row>
								<Col xs="12" md="8">
									<Input type="text" name="request-url" className="width-95" value={this.props.requestURL} readOnly={true} />
								</Col>
								<Col xs="12" md="4">
									<Button className="button" type="submit" onClick={this.handleCopyClipboard}>Copy</Button>
								</Col>
							</Row>
						</FormGroup>
					</Col>
				</Row>
			</div>
		);
	}
}

export { ShareRequestURL };
