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

function findAncestor(el: any, cls: string) {
	if (el.parentElement) {
		el = el.parentElement;
		while (!el.classList.contains(cls)) {
			el = el.parentElement;
		}
	}
	return el;
}

function highlightNextSibling(el: any, cls: string) {
	let parentElm = el.parentNode; // immediate parent
	const siblings = parentElm.childNodes;
	let foundCurrentObj: boolean = false;
	let nextSibling: any = el;
	let potentialSibling: any = el;
	for (let sibling of siblings) {
		// First we find the current obj
		if (el === sibling) {
			foundCurrentObj = true;
			continue;
		}
		if (foundCurrentObj) {
			// Once we found the current obj in the siblings list
			// The element with the same classname can be a potential next sibling
			if (sibling.classList.contains(cls)) {
				// If we found a match, want to make sure if it has an input field
				let siblingInputField = sibling.querySelector('input');
				if (!siblingInputField) {
					siblingInputField = sibling.querySelector('select');
				}
				if (!siblingInputField) {
					siblingInputField = sibling.querySelector('textarea');
				}
				if (siblingInputField) {
					potentialSibling = findAncestor(siblingInputField, cls);
					if (potentialSibling) {
						siblingInputField.focus();
						nextSibling = potentialSibling;
						sibling.classList.add('active');
						nextSibling.classList.add('active');
						el.classList.remove('active');
						break;
					}
				}
			}
		}
	}
	// If nextSibling is still the same as the original element, we probably need to move a level up
	if (nextSibling === el) {
		parentElm = findAncestor(el, cls);
		if (parentElm) {
			el.classList.remove('active');
			highlightNextSibling(parentElm, cls);
		}
	}
}

class JSONSchemaForm extends React.Component<Props, {}> {
	constructor(props: Props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleScroll = this.handleScroll.bind(this);
		this.handleKeypress = this.handleKeypress.bind(this);
	}

	componentDidMount() {
		window.addEventListener('scroll', this.handleScroll);
		window.addEventListener('keypress', this.handleKeypress);

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
		window.removeEventListener('keypress', this.handleKeypress);
	}

	handleScroll() {
		return;
		/*
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
		*/
	}

	handleKeypress(event: any) {
		if (event.key === 'Enter') {
			event.preventDefault();
			if (event.path[0].nodeName === 'INPUT') {
				const parentElm = findAncestor(event.path[0], 'field-wrapper');
				if (parentElm) {
					highlightNextSibling(parentElm, 'field-wrapper');
				}
				// window.scrollTo(0, window.scrollY + event.path[1].offsetHeight + 20);
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
		);
	}
}

export {JSONSchemaForm};
