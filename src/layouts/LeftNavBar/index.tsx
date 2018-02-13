import * as React from 'react';
import {
	Row,
	Col,
	Nav,
	NavItem
} from 'reactstrap';
import { Link } from 'react-router';
import './LeftNavBar.css';

class LeftNavBar extends React.Component {
	render() {
		const links = [
			{url: '/dashboard', display: 'DASHBOARD'},
			{url: '/request', display: 'REQUEST LOAN'},
			{url: '/fill', display: 'FILL LOAN'}
		];
		const linkItems = links.map((link, index) =>
			(
				<Col xs="4" md="12" key={link.display} className={index === 0 ? 'top-nav-item' : ''}>
					<NavItem>
						<Link to={link.url} className="nav-link" activeClassName="active">
							<span className="title-first">
								{link.display.indexOf(' ') >= 0 ? link.display.substr(0, link.display.indexOf(' ')) : link.display}
							</span>
							<span className="title-rest">
								{link.display.indexOf(' ') >= 0 ? link.display.substr(link.display.indexOf(' ')) : ''}
							</span>
						</Link>
					</NavItem>
				</Col>
			)
		);

		return (
			<div className="left-nav-bar">
				<Nav>
					<Row>
						{linkItems}
					</Row>
				</Nav>
			</div>
		);
	}
}

export default LeftNavBar;
