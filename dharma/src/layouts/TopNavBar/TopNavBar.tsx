import * as React from 'react';
import {
	Collapse,
	Navbar,
	NavbarToggler,
	NavbarBrand,
	Nav,
	NavItem,
	NavLink
} from 'reactstrap';
import './TopNavBar.css';

interface TopNavBarState {
	isOpen: boolean;
}

class TopNavBar extends React.Component<{}, TopNavBarState> {
	constructor(props: {}) {
		super(props);

		this.toggle = this.toggle.bind(this);
		this.state = {isOpen : false};
	}

	toggle() {
		this.setState({isOpen: !this.state.isOpen});
	}

	render() {
		const links = [
			{url: '/bazaar', display: 'BAZAAR'},
			{url: '/whitepaper', display: 'WHITEPAPER'},
			{url: '/blog', display: 'BLOG'},
			{url: '/github', display: 'GITHUB'},
			{url: '/chat', display: 'CHAT'},
			{url: '/twitter', display: 'TWITTER'}
		];
		const linkItems = links.map((link) =>
			(
				<NavItem key={link.display}>
					<NavLink href={link.url}>{link.display}</NavLink>
				</NavItem>
			)
		);
		return (
			<div className="top-nav-bar">
				<Navbar color="faded" light={true} expand="md">
					<NavbarBrand href="/">
						<img src={require('../../assets/img/logo_icon_white.png')} className="brand-logo"/>
					</NavbarBrand>
					<NavbarToggler onClick={this.toggle} />
					<Collapse isOpen={this.state.isOpen} navbar={true}>
						<Nav className="ml-auto" navbar={true}>
							{linkItems}
						</Nav>
					</Collapse>
				</Navbar>
			</div>
		);
  }
}

export default TopNavBar;
