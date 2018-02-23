import * as React from 'react';
import {
	Row
} from 'reactstrap';
import {
	Wrapper,
	StyledLabel,
	GrayRow,
	ImageContainer,
	DetailContainer,
	ShareButtonsContainer,
	ShareButton,
	StyledFormGroup,
	InputContainer,
	RequestInput,
	ButtonContainer,
	CopyButton
} from './styledComponents';

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
			<ShareButton key={social.name} onClick={(e) => this.handleShareSocial(social.name, e)}>
				<img src={social.imgURL} />
			</ShareButton>
		));
		return (
			<Wrapper>
				<StyledLabel>Share your request URL</StyledLabel>
				<GrayRow>
					<ImageContainer />
					<DetailContainer>
						<ShareButtonsContainer>
							{socialButtonsRow}
						</ShareButtonsContainer>
						<StyledFormGroup>
							<Row>
								<InputContainer>
									<RequestInput type="text" name="request-url" value={this.props.requestURL} readOnly={true} />
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
