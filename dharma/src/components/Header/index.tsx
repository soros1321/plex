import * as React from 'react';
import './Header.css';

interface HeaderProps {
	title: string;
	description?: string;
}

class Header extends React.Component<HeaderProps, {}> {
	render() {
		return (
			<div>
				<h1>{this.props.title}</h1>
				{ this.props.description !== '' && (
					<div className="description">{this.props.description}</div>
					)
				}
			</div>
		);
	}
}

export {Header};
