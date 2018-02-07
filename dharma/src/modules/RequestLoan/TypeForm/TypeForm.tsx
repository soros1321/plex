import * as React from 'react';
import { ReactTypeformEmbed } from 'react-typeform-embed';

class TypeForm extends React.Component<{}, {}> {
	render() {
		return (
			<div className="main-wrapper">
				<ReactTypeformEmbed url={'https://johan146.typeform.com/to/PsJrcQ'} style={{height: '500px'}} />
			</div>
		);
	}
}

export { TypeForm };
