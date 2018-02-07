import * as React from 'react';
import { Header } from '../../../components';

interface Props {
	totalRequested: number;
	totalRepayed: number;
}

class Debts extends React.Component<Props, {}> {
	render() {
		return (
			<div>
				<Header title="Your debts" />
			</div>
		);
	}
}

export { Debts };
