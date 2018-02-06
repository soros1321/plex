import * as React from 'react';
import { Header } from '../../components';

class Dashboard extends React.Component<{}, {}> {
	render() {
		return (
			<div>
				<Header title={'Your Dashboard'} description={'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'} />
			</div>
		);
	}
}

export { Dashboard };
