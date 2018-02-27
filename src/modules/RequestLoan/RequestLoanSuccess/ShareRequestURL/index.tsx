import * as React from 'react';
import {
	Row
} from 'reactstrap';
import {
	Wrapper,
	StyledLabel,
	GrayRow,
	ImageContainer,
	IdenticonImage,
	DetailContainer,
	ShareButtonsContainer,
	ShareButton,
	StyledFormGroup,
	InputContainer,
	RequestInput,
	ButtonContainer,
	CopyButton,
	CopiedMessage
} from './styledComponents';
import { Link } from 'react-router';
const Identicon = require('identicon.js');

interface Props {
	issuanceHash: string | undefined;
	debtorSignature: string;
	onShareSocial: (socialMediaName: string) => void;
}

interface State {
	copied: boolean;
}

class ShareRequestURL extends React.Component<Props, State> {
	private requestInput: HTMLInputElement | null;

	constructor (props: Props) {
		super(props);
		this.state = {
			copied: false
		};
		this.handleCopyClipboard = this.handleCopyClipboard.bind(this);
		this.handleShareSocial = this.handleShareSocial.bind(this);
	}

	handleCopyClipboard() {
		this.requestInput!.select();
		document.execCommand('copy');
		this.requestInput!.focus();
		this.setState({ copied: true });
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
			<ShareButton key={social.name} onClick={(e) => this.handleShareSocial(social.name, e)}>
				<img src={social.imgURL} />
			</ShareButton>
		));
		let identiconData: string = '';
		if (this.props.issuanceHash) {
			const identiconOptions = {
				foreground: [28, 193, 204, 255],
				background: [255, 255, 255, 255],
				margin: 0.1,
				size: 100,
				format: 'svg'
			};
			identiconData = new Identicon(this.props.issuanceHash, identiconOptions).toString();
		}
		return (
			<Wrapper>
				<StyledLabel>Share your request URL</StyledLabel>
				<GrayRow>
					<ImageContainer>
					{identiconData && (
						<IdenticonImage src={'data:image/svg+xml;base64,' + identiconData} />
					)}
					</ImageContainer>
					<DetailContainer>
						<ShareButtonsContainer>
							{socialButtonsRow}
						</ShareButtonsContainer>
						<StyledFormGroup>
							<Row>
								<InputContainer>
									<Link to={'/fill/loan/' + this.props.debtorSignature}>
										<RequestInput
											type="text"
											value={this.props.debtorSignature}
											readOnly={true}
											innerRef={(input: HTMLInputElement) => { this.requestInput = input; }}
										/>
									</Link>
									<CopiedMessage>{this.state.copied ? 'Copied!' : ''}</CopiedMessage>
								</InputContainer>
								<ButtonContainer>
									<CopyButton className="button" type="submit" onClick={this.handleCopyClipboard}>Copy</CopyButton>
								</ButtonContainer>
							</Row>
						</StyledFormGroup>
					</DetailContainer>
				</GrayRow>
			</Wrapper>
		);
	}
}

export { ShareRequestURL };
