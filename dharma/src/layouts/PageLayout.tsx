import * as React from 'react';
import {
	Row,
	Col
} from 'reactstrap';

import TopNavBar from './TopNavBar/TopNavBar';
import LeftNavBar from './LeftNavBar/LeftNavBar';

class PageLayout extends React.Component {
  render() {
    return (
			<div>
				<TopNavBar />
				<Row>
					<Col xs="12" md="2">
						<LeftNavBar />
					</Col>
					<Col xs="12" md="10">
						{this.props.children}
					</Col>
				</Row>
			</div>
    );
  }
}

export default PageLayout;
