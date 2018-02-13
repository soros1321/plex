import * as React from 'react';
import Form from 'react-jsonschema-form';
import { Button } from 'reactstrap';
import { JSONSchema4 } from 'json-schema';
import { ObjectFieldTemplate } from './ObjectFieldTemplate';
import { FieldTemplate } from './FieldTemplate';
import {
	CheckboxLabel,
	Checkmark
} from './styledComponents';

interface FormResponse {
	formData: {};
}

interface Props {
	schema: JSONSchema4;
	uiSchema?: {};
	formData: {};
	buttonText?: string;
	onHandleChange: (formData: {}) => void;
	onHandleSubmit: () => void;
}

const CustomCheckbox = function(props: any) {
	return (
		<CheckboxLabel>{props.schema.title}
			<input type="checkbox" required={props.required} onClick={() => props.onChange(!props.value)}/>
			<Checkmark />
		</CheckboxLabel>
	);
};

const CustomRadioButton = function(props: any) {
	return (
		<label>{JSON.stringify(props.schema)}</label>
	);
};

const widgets = {
	CustomCheckbox: CustomCheckbox,
	CustomRadioButton: CustomRadioButton
};

class JSONSchemaForm extends React.Component<Props, {}> {
	constructor(props: Props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(response: FormResponse) {
		this.props.onHandleChange(response.formData);
	}

	handleSubmit() {
		this.props.onHandleSubmit();
	}

	render() {
		return (
			<div>
				<Form
					schema={this.props.schema}
					uiSchema={this.props.uiSchema}
					formData={this.props.formData}
					onChange={this.handleChange}
					onSubmit={this.handleSubmit}
					ObjectFieldTemplate={ObjectFieldTemplate}
					FieldTemplate={FieldTemplate}
					showErrorList={false}
					widgets={widgets}
				>
					<Button type="submit" className="button">{this.props.buttonText || 'Submit'}</Button>
				</Form>
			</div>
		);
	}
}

export {JSONSchemaForm};
