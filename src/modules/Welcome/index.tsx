import * as React from 'react';
import { PaperLayout } from '../../layouts';
import { MainWrapper } from '../../components';
import {
	BannerContainer,
	Header,
	Description,
	ButtonContainer,
	SkipButton,
	NextButton
} from './styledComponents';

class Welcome extends React.Component<{}, {}> {
	render() {
		return (
			<PaperLayout>
				<BannerContainer />
				<MainWrapper>
					<Header>Welcome to Dharma Bazaar</Header>
					<Description>
						Here's a quick description of what you can do and why it is awesome.
					</Description>
					<ButtonContainer>
						<SkipButton>Skip</SkipButton>
						<NextButton>Next &rarr;</NextButton>
					</ButtonContainer>
				</MainWrapper>
			</PaperLayout>
		);
	}
}

export { Welcome };
