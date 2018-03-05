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
    return (
			<Wrapper>
				<TopNavBar />
				<StyledRow>
					<LeftContainer>
						<LeftNavBar />
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
