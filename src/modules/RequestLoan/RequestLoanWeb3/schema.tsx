import { JSONSchema4 } from 'json-schema';

export const schema: JSONSchema4 = {
	type: 'object',
	required: [
		'interestRate',
		'amortizationUnit',
		'termLength'
	],
	properties: {
		loan: {
			type: 'object',
			title: 'How much do you want?',
			required: [
				'principalAmount',
				'principalTokenSymbol'
			],
			properties: {
				principalAmount: {
					type: 'number',
					title: 'Amount',
				},
				principalTokenSymbol: {
					type: 'string',
					title: 'Token',
					enum: [
						'REP',
						'MKR',
						'ZRX'
					],
					enumNames: [
						'Augur (REP)',
						'Maker DAO (MKR)',
						'0x Token (ZRX)'
					]
				},
				description: {
					type: 'string',
				}
			}
		},
		interestRate: {
			type: 'number',
			title: 'Interest Rate',
			description: 'Specify your desired interest rate'
		},
		amortizationUnit: {
			type: 'string',
			title: 'Installments Type',
			enum: [
				'hours',
				'days',
				'weeks',
				'months',
				'years'
			],
			enumNames: [
				'Hourly',
				'Daily',
				'Weekly',
				'Monthly',
				'Yearly'
			],
			description: 'Specify how often you would like repayments to be due'
		},
		termLength: {
			type: 'number',
			title: 'Term Length',
			description: 'Enter the length of the entire debt agreement, in units of the chosen installments (e.g. a term length of 2 with an installment type of "monthly" would be equivalent to a 2 month long loan)'
		}
	}
};

export const uiSchema = {
	loan: {
		principalAmount: {
			'ui:autofocus': true,
			'ui:placeholder': '100.3',
			classNames: 'inline-field width75'
		},
		principalTokenSymbol: {
			'ui:placeholder': 'select',
			'ui:options': {
				label: false
			},
			classNames: 'inline-field width25 no-label'
		},
		description: {
			'ui:placeholder': 'Description (optional, but helpful to lenders)',
			'ui:options': {
				label: false
			},
			classNames: 'group-field'
		}
	},
	interestRate: {
		'ui:placeholder': '8.12%'
	},
	amortizationUnit: {
		'ui:placeholder': 'select'
	},
	termLength: {
		'ui:placeholder': '3'
	}
};
