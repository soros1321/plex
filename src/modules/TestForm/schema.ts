import { JSONSchema4 } from 'json-schema';

export const schema: JSONSchema4 = {
	type: 'object',
	required: ['inputText'],
	properties: {
		inputText: {
			type: 'string',
			title: 'Input Text',
			description: 'You can specify the description content inside the schema object, or uiSchema by using `ui:description`'
		},
		inputNumber: {
			type: 'number',
			title: 'Input Number'
		},
		group: {
			title: 'This is the title of the grouped fields',
			type: 'object',
			description: 'This is the description.',
			properties: {
				someInput: {
					type: 'string',
					title: 'Some input'
				},
				anotherInput: {
					type: 'string',
					title: 'Another input'
				}
			}
		},
		checkboxField: {
			type: 'boolean',
			title: 'Checkbox'
		}
	}
};

export const uiSchema = {
	inputText: {
		'ui:placeholder': 'Specify the placeholder text in the uiSchema'
	},
	inputNumber: {
		'ui:placeholder': 'This input only accepts number',
		'ui:help': 'You can specify the help content inside uiSchema',
	},
	checkboxField: {
		'ui:widget': 'CheckboxWidget',
		'ui:options': {
			title: 'This is a checkbox',
			label: false
		}
	}
};
