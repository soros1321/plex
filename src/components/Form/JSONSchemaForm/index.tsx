import * as React from 'react';
import { Button } from 'reactstrap';
import { JSONSchema4 } from 'json-schema';
import { StyledForm, FieldWrapper } from './styledComponents';
import { ObjectFieldTemplate } from './ObjectFieldTemplate';
import { FieldTemplate } from './FieldTemplate';
import { CustomCheckbox } from './CustomCheckbox';
import { CustomBaseInput } from './CustomBaseInput';
import { CustomSelectDropdown } from './CustomSelectDropdown';
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
	BaseInput: CustomBaseInput,
	SelectWidget: CustomSelectDropdown
};

const paddingTop = 200;
const fieldClassName = 'field-wrapper';
const activeClassName = 'active';
const pressEnterClassName = 'press-enter';

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

function highlightNextSibling(el: any) {
	let parentElm = el.parentNode; // immediate parent
	let siblings = parentElm.childNodes;
	let foundCurrentObj: boolean = false;
	let nextSibling: any = el;
	let potentialSibling: any = el;
	let isButton: boolean = false;
	let siblingInputField: HTMLInputElement | null = null;

	const activeElms = document.querySelectorAll('.' + fieldClassName + '.' + activeClassName);
	const rootElm = activeElms[0];

	for (let sibling of siblings) {
		// First we find the current obj
		if (el === sibling) {
			foundCurrentObj = true;
			let pressEnterDivs = el.getElementsByClassName(pressEnterClassName);
			if (pressEnterDivs.length) {
				if (pressEnterDivs[0].classList.contains(activeClassName)) {
					pressEnterDivs[0].classList.remove(activeClassName);
				}
			}
			continue;
		}
		if (foundCurrentObj) {
			// Once we found the current obj in the siblings list
			// The element with the same classname can be a potential next sibling
			if (sibling.classList.contains(fieldClassName)) {
				// If we found a match, want to make sure if it has an input field
				isButton = false;
				siblingInputField = sibling.querySelector('input');
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
					potentialSibling = findAncestor(siblingInputField, fieldClassName);
					if (potentialSibling) {
						siblingInputField.focus();
						nextSibling = potentialSibling;
						sibling.classList.add(activeClassName);
						nextSibling.classList.add(activeClassName);
						if (!isButton) {
							el.classList.remove(activeClassName);
						}

						if (!siblingInputField.required || siblingInputField.value && !isButton) {
							let pressEnterDivs = potentialSibling.getElementsByClassName(pressEnterClassName);
							if (pressEnterDivs.length) {
								if (!pressEnterDivs[0].classList.contains(activeClassName)) {
									pressEnterDivs[0].classList.add(activeClassName);
								}
							}
							// Check if this is the last element, we probably want to highlight the group
							if (isLastElement(potentialSibling)) {
								highlightGrandParentPressEnter(potentialSibling, siblingInputField.value, siblingInputField.required);
							}
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
		parentElm = findAncestor(el, fieldClassName);
		if (parentElm) {
			// el.classList.remove(activeClassName);
			highlightNextSibling(parentElm);
		}
	} else {
		const grandParentElm = findAncestor(findAncestor(siblingInputField, fieldClassName), fieldClassName);
		if (grandParentElm && grandParentElm !== rootElm) {
			siblings = grandParentElm.querySelectorAll('.' + fieldClassName);
			for (let sibling of siblings as any) {
				if (!sibling.classList.contains(activeClassName)) {
					sibling.classList.add(activeClassName);
				}
			}
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
	const rootElm = activeElms[0];
	let counter = 0;
	for (let elm of activeElms as any) {
		// We don't want to remove root's active class
		if (counter === 0) {
			counter++;
			continue;
		}
		elm.classList.remove(activeClassName);
	}

	parentElm.classList.add(activeClassName);

	// Removed all active press enter elements
	let pressEnterDivs = document.getElementsByClassName(pressEnterClassName);
	if (pressEnterDivs.length) {
		for (let pressEnterDiv of pressEnterDivs as any) {
			if (pressEnterDiv.classList.contains(activeClassName)) {
				pressEnterDiv.classList.remove(activeClassName);
			}
		}
	}

	let inputField = parentElm.querySelector('input');
	if (!inputField) {
		inputField = parentElm.querySelector('select');
	}
	if (!inputField) {
		inputField = parentElm.querySelector('textarea');
	}
	if (inputField) {
		// If the field is disabled, do nothing
		if (inputField.disabled) {
			return;
		}
		const inputFieldParent = findAncestor(inputField, fieldClassName);
		if (inputFieldParent) {
			inputField.focus();
			inputFieldParent.classList.add(activeClassName);
			scroll.scrollTo(inputFieldParent.offsetTop - paddingTop);

			if (!inputField.required || inputField.value) {
				pressEnterDivs = inputFieldParent.getElementsByClassName(pressEnterClassName);
				if (pressEnterDivs.length) {
					if (!pressEnterDivs[0].classList.contains(activeClassName)) {
						pressEnterDivs[0].classList.add(activeClassName);
					}
				}
				// Check if this is the last element, we probably want to highlight the group
				if (isLastElement(inputFieldParent)) {
					highlightGrandParentPressEnter(inputFieldParent, inputField.value, inputField.required);
				}
			}
		}
	}

	// We need to highlight the grandparent as well (Especially for grouped fields)
	const grandParentElm = findAncestor(findAncestor(inputField, fieldClassName), fieldClassName);
	if (grandParentElm && grandParentElm !== rootElm) {
		grandParentElm.classList.add(activeClassName);

		// If this is actually a grouped field, it should have siblings
		// and we want to highlight the sibligs as well
		const siblings = grandParentElm.querySelectorAll('.' + fieldClassName);
		for (let sibling of siblings as any) {
			if (!sibling.classList.contains(activeClassName)) {
				sibling.classList.add(activeClassName);
			}
		}
	}
}

function isLastElement(el: any) {
	const siblings = el.parentNode.childNodes;
	if (el === siblings[siblings.length - 1]) {
		return true;
	} else {
		return false;
	}
}

function highlightGrandParentPressEnter(elm: any, value: any, required: boolean) {
	let grandParentElm = findAncestor(elm, fieldClassName);
	if (grandParentElm) {
		let pressEnterDivs = grandParentElm.getElementsByClassName(pressEnterClassName);
		// Display the last pressEnterDivs elm
		if (!required || (value && pressEnterDivs.length)) {
			pressEnterDivs[pressEnterDivs.length - 1].classList.add(activeClassName);
		} else {
			pressEnterDivs[pressEnterDivs.length - 1].classList.remove(activeClassName);
		}
	}
}

class JSONSchemaForm extends React.Component<Props, {}> {
	constructor(props: Props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleError = this.handleError.bind(this);
		this.handleScroll = this.handleScroll.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
		this.handleKeyUp = this.handleKeyUp.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	componentDidMount() {
		window.addEventListener('scroll', this.handleScroll);
		window.addEventListener('keypress', this.handleKeyPress);
		window.addEventListener('keyup', this.handleKeyUp);
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
		window.removeEventListener('keypress', this.handleKeyPress);
		window.removeEventListener('keyup', this.handleKeyUp);
		window.removeEventListener('click', this.handleClick);
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

	handleKeyPress(event: any) {
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
				highlightNextSibling(parentElm);
			}
		}
	}

	handleKeyUp(event: any) {
		if (event! && event!.key! && event!.path! && event.key !== 'Enter' && (event.srcElement.nodeName === 'INPUT' || event.srcElement.nodeName === 'SELECT' || event.srcElement.nodeName === 'TEXTAREA')) {
			let value: any = '';
			switch (event.srcElement.nodeName) {
				case 'INPUT':
				case 'TEXTAREA':
					value = event.srcElement.value;
					break;
				case 'SELECT':
					value = event.srcElement.options[event.srcElement.selectedIndex].value;
					break;
				default:
					break;
			}
			if (event.key === 'Tab') {
				highlightElement(event.path[0]);
			} else {
				const parentElm = findAncestor(event.srcElement, fieldClassName);
				if (parentElm && isLastElement(parentElm)) {
					highlightGrandParentPressEnter(parentElm, value, event.srcElement.required);
				}
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
				autocomplete="off"
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
				<FieldWrapper className="field-wrapper button-container">
					<Button type="submit" className="button">{this.props.buttonText || 'Submit'}</Button>
				</FieldWrapper>
			</StyledForm>
		);
	}
}

export {JSONSchemaForm};
