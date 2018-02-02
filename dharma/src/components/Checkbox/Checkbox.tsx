import * as React from 'react';
import {
	FormGroup,
	Label,
	Input
} from 'reactstrap';

interface CheckboxProps {
	name: string;
	label: string;
	prepend?: string;
	checked?: boolean;
}

class Checkbox extends React.Component<CheckboxProps, {}> {
	render() {
		return (
			<div>
				<FormGroup check={true}>
					<Label className="checkbox-container" check={true}>
						{this.props.label}
						<Input type="checkbox" name={this.props.name} id={this.props.prepend ? this.props.prepend + '-' + this.props.name : this.props.name}  />{' '}
						<span className="checkmark" />
					</Label>
				</FormGroup>
			</div>
		);
	}
}

export default Checkbox;
