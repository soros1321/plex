import * as React from 'react';
import { Row, Col } from 'reactstrap';
import TopNavBar from '../TopNavBar/TopNavBar';
import LeftNavBar from '../LeftNavBar/LeftNavBar';
import './PageLayout.css';

class PageLayout extends React.Component {
  render() {
    return (
			<div>
				<TopNavBar />
				<Row>
					<Col xs="12">
						<LeftNavBar />
					</Col>
					<Col xs="12" className="right-container">
						{this.props.children}
					</Col>
				</Row>
			</div>
    );
  }
}

export { PageLayout };
