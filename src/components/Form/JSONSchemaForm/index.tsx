import * as React from 'react';
import { Button } from 'reactstrap';
import { JSONSchema4 } from 'json-schema';
import { StyledForm, FieldWrapper } from './styledComponents';
import { ObjectFieldTemplate } from './ObjectFieldTemplate';
import { FieldTemplate } from './FieldTemplate';
import { CustomCheckbox } from './CustomCheckbox';
import { CustomBaseInput } from './CustomBaseInput';
import { animateScroll as scroll } from 'react-scroll';

interface FormResponse {
	formData: any;
}

interface Props {
	className?: string;
	schema: JSONSchema4;
	uiSchema?: {};
	formData: any;
	buttonText?: string;
	onHandleChange: (formData: any) => void;
	onHandleSubmit: () => void;
}

const widgets = {
	CustomCheckbox: CustomCheckbox,
	BaseInput: CustomBaseInput
};

const paddingTop = 200;
const fieldClassName = 'field-wrapper';
const activeClassName = 'active';

function findAncestor(el: any, cls: string) {
	if (el.parentElement) {
		el = el.parentElement;
		while (!el.classList.contains(cls)) {
			el = el.parentElement;
			if (!el) {
				break;
			}
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
	let isButton: boolean = false;
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
				isButton = false;
				let siblingInputField = sibling.querySelector('input');
				if (!siblingInputField) {
					siblingInputField = sibling.querySelector('select');
				}
				if (!siblingInputField) {
					siblingInputField = sibling.querySelector('textarea');
				}
				if (!siblingInputField) {
					siblingInputField = sibling.querySelector('button');
					isButton = true;
				}
				if (siblingInputField) {
					if (siblingInputField.disabled) {
						continue;
					}
					potentialSibling = findAncestor(siblingInputField, cls);
					if (potentialSibling) {
						siblingInputField.focus();
						nextSibling = potentialSibling;
						sibling.classList.add(activeClassName);
						nextSibling.classList.add(activeClassName);
						if (!isButton) {
							el.classList.remove(activeClassName);
						}
						scroll.scrollTo(potentialSibling.offsetTop - paddingTop);
						break;
					}
				}
			}
		}
	}
	// If nextSibling is still the same as the original element, we probably need to move a level up
	if (nextSibling === el) {
		el.classList.remove(activeClassName);
		parentElm = findAncestor(el, cls);
		if (parentElm) {
			// el.classList.remove(activeClassName);
			highlightNextSibling(parentElm, cls);
		}
	}
}

function highlightElement(clickedElm: any) {
	let parentElm: any = clickedElm;
	if (!parentElm.classList.contains(fieldClassName)) {
		parentElm = findAncestor(clickedElm, fieldClassName);
		if (!parentElm) {
			return;
		}
	}
	if (parentElm.classList.contains(activeClassName)) {
		return;
	}
	// Removed all active elements
	const activeElms = document.querySelectorAll('.' + fieldClassName + '.' + activeClassName);
	let counter = 0;
	for (let elm of activeElms as any) {
		// We don't want to remove root's active class
		if (counter === 0) {
			counter++;
			continue;
		}
		elm.classList.remove(activeClassName);
	}
	let inputField = parentElm.querySelector('input');
	if (!inputField) {
		inputField = parentElm.querySelector('select');
	}
	if (!inputField) {
		inputField = parentElm.querySelector('textarea');
	}
	if (inputField) {
		const inputFieldParent = findAncestor(inputField, fieldClassName);
		if (inputFieldParent) {
			inputField.focus();
			inputFieldParent.classList.add(activeClassName);
			scroll.scrollTo(inputFieldParent.offsetTop - paddingTop);
		}
	}
	parentElm.classList.add(activeClassName);

	// We need to highlight the grandparent as well (Especially for grouped fields)
	const grandParentElm = findAncestor(parentElm, fieldClassName);
	if (grandParentElm) {
		grandParentElm.classList.add(activeClassName);
	}
}

class JSONSchemaForm extends React.Component<Props, {}> {
	constructor(props: Props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleError = this.handleError.bind(this);
		this.handleScroll = this.handleScroll.bind(this);
		this.handleKeypress = this.handleKeypress.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	componentDidMount() {
		window.addEventListener('scroll', this.handleScroll);
		window.addEventListener('keypress', this.handleKeypress);
		window.addEventListener('click', this.handleClick);

		// Always set the root element as active
		const rootElm = document.querySelector('.' + fieldClassName);
		if (rootElm) {
			rootElm.classList.add(activeClassName);
			// Then we want to highlight the first input child
			let inputField: any = rootElm.querySelector('input');
			if (!inputField) {
				inputField = rootElm.querySelector('select');
			}
			if (!inputField) {
				inputField = rootElm.querySelector('textarea');
			}
			if (inputField) {
				highlightElement(inputField);
			}
		}
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll);
		window.removeEventListener('keypress', this.handleKeypress);
	}

	handleChange(response: FormResponse) {
		this.props.onHandleChange(response.formData);
	}

	handleSubmit() {
		this.props.onHandleSubmit();
	}

	handleError(response: FormResponse) {
		const fieldErrors = document.getElementsByClassName('field-error-message') as HTMLCollectionOf<HTMLElement>;
		if (fieldErrors.length) {
			const firstError = fieldErrors[0];
			highlightElement(firstError);
		}
	}

	handleScroll() {
		return;
		/*
		const fieldWrappers = document.getElementsByClassName('field-wrapper') as HTMLCollectionOf<HTMLElement>;
		if (fieldWrappers.length) {
			for (let elm of fieldWrappers as any) {
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
		if (event! && event!.key! && event!.path! && event.key === 'Enter' && (event.path[0].nodeName === 'INPUT' || event.path[0].nodeName === 'SELECT' || event.path[0].nodeName === 'TEXTAREA')) {
			event.preventDefault();
			let value: any = '';
			switch (event.path[0].nodeName) {
				case 'INPUT':
				case 'TEXTAREA':
					value = event.path[0].value;
					break;
				case 'SELECT':
					value = event.path[0].options[event.path[0].selectedIndex].value;
					break;
				default:
					break;
			}
			if (event.path[0].required && !value) {
				return;
			}
			const parentElm = findAncestor(event.path[0], fieldClassName);
			if (parentElm) {
				highlightNextSibling(parentElm, fieldClassName);
			}
		}
	}

	handleClick(event: any) {
		if (event! && event!.path!) {
			highlightElement(event.path[0]);
		}
	}

	render() {
		return (
			<StyledForm
				className={this.props.className}
				schema={this.props.schema}
				uiSchema={this.props.uiSchema}
				formData={this.props.formData}
				onChange={this.handleChange}
				onSubmit={this.handleSubmit}
				onError={this.handleError}
				ObjectFieldTemplate={ObjectFieldTemplate}
				FieldTemplate={FieldTemplate}
				showErrorList={false}
				widgets={widgets}
			>
				<FieldWrapper className="field-wrapper">
					<Button type="submit" className="button">{this.props.buttonText || 'Submit'}</Button>
				</FieldWrapper>
			</StyledForm>
		);
	}
}

export {JSONSchemaForm};
