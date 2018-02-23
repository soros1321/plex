import * as React from 'react';
import { Row } from 'reactstrap';
import TopNavBar from '../TopNavBar';
import LeftNavBar from '../LeftNavBar';
import {
	LeftContainer,
	RightContainer
} from './styledComponents';

class PageLayout extends React.Component {
  render() {
    return (
			<div>
				<TopNavBar />
				<Row>
					<LeftContainer>
						<LeftNavBar />
					</LeftContainer>
					<RightContainer>
						{this.props.children}
					</RightContainer>
				</Row>
			</div>
    );
  }
}

export { PageLayout };
