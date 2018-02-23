import * as React from 'react';
import { Row } from 'reactstrap';
import TopNavBar from '../TopNavBar';
import LeftNavBar from '../LeftNavBar';
import {
	Wrapper,
	LeftContainer,
	RightContainer
} from './styledComponents';

class PageLayout extends React.Component {
  render() {
    return (
			<Wrapper>
				<TopNavBar />
				<Row>
					<LeftContainer>
						<LeftNavBar />
					</LeftContainer>
					<RightContainer>
						{this.props.children}
					</RightContainer>
				</Row>
			</Wrapper>
    );
  }
}

export { PageLayout };
