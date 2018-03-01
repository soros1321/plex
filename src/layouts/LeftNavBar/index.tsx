import * as React from 'react';
import { IndexLink } from 'react-router';
import {
	Row,
	Nav,
	NavItem
} from 'reactstrap';
import {
	Wrapper,
	LogoContainer,
	BrandLogo,
	StyledCol,
	StyledLink,
	TitleFirst,
	TitleRest
} from './styledComponents';
import { TradingPermissionsContainer } from '../../containers/TradingPermissionsContainer';

class LeftNavBar extends React.Component {
	render() {
		const links = [
			{url: '/dashboard', display: 'DASHBOARD'},
			{url: '/request', display: 'REQUEST LOAN'},
			{url: '/fill', display: 'FILL LOAN'}
		];
		const linkItems = links.map((link) =>
			(
				<StyledCol key={link.display}>
					<NavItem>
						<StyledLink to={link.url} className="nav-link" activeClassName="active">
							<TitleFirst>
								{link.display.indexOf(' ') >= 0 ? link.display.substr(0, link.display.indexOf(' ')) : link.display}
							</TitleFirst>
							<TitleRest>
								{link.display.indexOf(' ') >= 0 ? link.display.substr(link.display.indexOf(' ')) : ''}
							</TitleRest>
						</StyledLink>
					</NavItem>
				</StyledCol>
			)
		);

		return (
			<Wrapper>
				<LogoContainer>
					<IndexLink to="/">
						<BrandLogo src={require('../../assets/img/logo_icon_white.png')} />
					</IndexLink>
				</LogoContainer>
				<Nav>
					<Row>
						{linkItems}
					</Row>
					<Row>
						<TradingPermissionsContainer />
					</Row>
				</Nav>
			</Wrapper>
		);
	}
}

export default LeftNavBar;
