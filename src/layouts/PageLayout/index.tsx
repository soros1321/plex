import * as React from 'react';
import TopNavBar from '../TopNavBar';
import LeftNavBar from '../LeftNavBar';
import {
	Wrapper,
	StyledRow,
	LeftContainer,
	RightContainer,
	Footer,
	FooterLink
} from './styledComponents';

class PageLayout extends React.Component {
	render() {
		const linkItems = [
			{url: '/dashboard', display: 'DASHBOARD'},
			{url: '/request', display: 'REQUEST LOAN'},
			{url: '/fill', display: 'FILL LOAN'}
		];

		return (
			<Wrapper>
				<TopNavBar />
				<StyledRow>
					<LeftContainer>
						<LeftNavBar linkItems={linkItems} />
					</LeftContainer>
					<RightContainer>
						{this.props.children}
						<Footer>
							<FooterLink to="/terms">Terms of Use</FooterLink>
							<FooterLink to="/privacy">Privacy Policy</FooterLink>
						</Footer>
					</RightContainer>
				</StyledRow>
			</Wrapper>
    );
  }
}

export { PageLayout };
