import * as React from 'react';
import TopNavBar from '../TopNavBar';
import LeftNavBar from '../LeftNavBar';
import {
	Wrapper,
	StyledRow,
	LeftContainer,
	RightContainer
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
					</RightContainer>
				</StyledRow>
			</Wrapper>
    );
  }
}

export { PageLayout };
