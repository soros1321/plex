import * as React from 'react';
import { Button } from 'reactstrap';
import { JSONSchema4 } from 'json-schema';
import { StyledForm } from './styledComponents';
import { ObjectFieldTemplate } from './ObjectFieldTemplate';
import { FieldTemplate } from './FieldTemplate';
import { CustomCheckbox } from './CustomCheckbox';

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

const widgets = {
	CustomCheckbox: CustomCheckbox
};

const paddingTop = 55;

class JSONSchemaForm extends React.Component<Props, {}> {
	constructor(props: Props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleScroll = this.handleScroll.bind(this);
	}

	componentDidMount() {
		window.addEventListener('scroll', this.handleScroll);

		const formGroup = document.getElementsByClassName('field-wrapper') as HTMLCollectionOf<HTMLElement>;
		if (formGroup.length) {
			for (let elm of formGroup as any) {
				if (elm.offsetTop <= paddingTop) {
					elm.classList.add('active');
				}
			}
		}
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll);
	}

	handleScroll() {
		const formGroup = document.getElementsByClassName('field-wrapper') as HTMLCollectionOf<HTMLElement>;
		if (formGroup.length) {
			for (let elm of formGroup as any) {
				if (window.scrollY + paddingTop >= elm.offsetTop && window.scrollY + paddingTop <= elm.offsetTop + elm.offsetHeight) {
					elm.classList.add('active');
				} else {
					elm.classList.remove('active');
				}
			}
		}
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
				<StyledForm
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
				</StyledForm>
			</div>
		);
	}
}

export {JSONSchemaForm};
