import * as React from 'react';
import {
	Row,
	Col,
	Nav,
	NavItem,
	NavLink
} from 'reactstrap';
import './LeftNavBar.css';

class LeftNavBar extends React.Component {
	render() {
		const isMobile: boolean = window.innerWidth <= 500;
		return (
			<div className="left-nav-bar">
				<Nav>
					<Row>
						<Col xs="4" md="12" className="top-nav-item">
							<NavItem>
								<NavLink href="#">Dashboard</NavLink>
							</NavItem>
						</Col>
						<Col xs="4" md="12">
							<NavItem>
								<NavLink href="#">Request{!isMobile && ' Loan'}</NavLink>
							</NavItem>
						</Col>
						<Col xs="4" md="12">
							<NavItem>
								<NavLink href="#">Fill{!isMobile && ' Loan'}</NavLink>
							</NavItem>
						</Col>
					</Row>
				</Nav>
			</div>
		);
	}
}

export default LeftNavBar;
