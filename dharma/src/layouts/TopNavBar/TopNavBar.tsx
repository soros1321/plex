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
    return (
			<div className="top-nav-bar">
				<Navbar color="faded" light={true} expand="md">
					<NavbarBrand href="/">
						<img src={require('../../assets/img/logo_icon_white.png')} className="brand-logo"/>
					</NavbarBrand>
					<NavbarToggler onClick={this.toggle} />
					<Collapse isOpen={this.state.isOpen} navbar={true}>
						<Nav className="ml-auto" navbar={true}>
							<NavItem>
								<NavLink href="/bazaar">BAZAAR</NavLink>
							</NavItem>
							<NavItem>
								<NavLink href="/whitepaper">WHITEPAPER</NavLink>
							</NavItem>
							<NavItem>
								<NavLink href="/blog">BLOG</NavLink>
							</NavItem>
							<NavItem>
								<NavLink href="/github">GITHUB</NavLink>
							</NavItem>
							<NavItem>
								<NavLink href="/chat">CHAT</NavLink>
							</NavItem>
							<NavItem>
								<NavLink href="/twitter">TWITTER</NavLink>
							</NavItem>
						</Nav>
					</Collapse>
				</Navbar>
			</div>
    );
  }
}

export default TopNavBar;
