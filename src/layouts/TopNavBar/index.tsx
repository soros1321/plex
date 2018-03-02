import * as React from 'react';
import {
	Collapse,
	Navbar,
	Nav
} from 'reactstrap';
import { IndexLink } from 'react-router';
import {
	Wrapper,
	BrandLogo,
	StyledNavbarToggler,
	StyledNavItem,
	StyledLink
} from './styledComponents';
import { TradingPermissionsContainer } from '../../components';

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
				<StyledNavItem key={link.display}>
					<StyledLink to={link.url} activeClassName="active">{link.display}</StyledLink>
				</StyledNavItem>
			)
		);
		return (
			<Wrapper>
				<Navbar color="faded" light={true} expand="md">
					<IndexLink to="/">
						<BrandLogo src={require('../../assets/img/logo_icon_white.png')} />
					</IndexLink>
					<StyledNavbarToggler onClick={this.toggle} />
					<Collapse isOpen={this.state.isOpen} navbar={true}>
						<Nav className="ml-auto" navbar={true}>
							{linkItems}
						</Nav>
						<TradingPermissionsContainer />
					</Collapse>
				</Navbar>
			</Wrapper>
		);
  }
}

export default TopNavBar;
