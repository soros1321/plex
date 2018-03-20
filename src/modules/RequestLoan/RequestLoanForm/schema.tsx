import { JSONSchema4 } from 'json-schema';

export const schema: JSONSchema4 = {
	type: 'object',
	definitions: {
		tokens: {
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
		}
	},
	properties: {
		debtOrderType: {
			type: 'string',
			title: 'Which type of debt would you like?',
			enum: [
				'simpleInterestLoanNonCollateralized',
				'compoundInterestLoanNonCollateralized',
				'simpleInterestLoanCollateralized',
				'compoundInterestLoanCollateralized'
			],
			enumNames: [
				'Simple Interest Loan (Non-Collateralized)',
				'Compound Interest Loan (Non-Collateralized)',
				'Simple Interest Loan (Collateralized)',
				'Compound Interest Loan (Collateralized)'
			],
			default: 'simpleInterestLoanNonCollateralized'
		}
	},
	required: ['debtOrderType'],
	dependencies: {
		debtOrderType: {
			oneOf: [
				{
					properties: {
						debtOrderType: {
							enum: ['simpleInterestLoanNonCollateralized']
						},
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
									'$ref': '#/definitions/tokens'
								},
								description: {
									type: 'string',
								}
							}
						},
						/*
						collateral: {
							type: 'object',
							title: 'Do you want it collateralized?',
							properties: {
								collateralized: {
									type: 'boolean',
									title: 'Collateralized',
									description: 'A quick, layman\'s definition of what collateralized means and why it\'s a smart idea goes here.'
								}
							},
							dependencies: {
								collateralized: {
									properties: {
										collateralSource: {
											title: 'Collateral',
											'$ref': '#/definitions/tokens'
										},
										collateralAmount: {
											type: 'number',
										},
										collateralTokenSymbol: {
											'$ref': '#/definitions/tokens'
										}
									}
								}
							}
						},
						*/
						terms: {
							type: 'object',
							title: 'What terms would you like?',
							description: 'The most commonly chosen options are selected by default.',
							required: [
								'interestRate',
								'amortizationUnit',
								'termLength'
							],
							properties: {
								interestRate: {
									type: 'number',
									title: 'Interest Rate'
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
									]
								},
								termLength: {
									type: 'number',
									title: 'Term Length',
									description: 'Enter the length of the entire debt agreement, in units of the chosen installments (e.g. a term length of 2 with an installment type of "monthly" would be equivalent to a 2 month long loan)'
								}
							}
						}
					}
				}
			]
		}
	}
};

export const uiSchema = {
	debtOrderType: {
		'ui:autofocus': true,
		'ui:options': {
			pressEnter: true
		}
	},
	loan: {
		principalAmount: {
			'ui:placeholder': '100.3',
			classNames: 'inline-field width65',
			'ui:options': {
				pressEnter: false
			}
		},
		principalTokenSymbol: {
			'ui:placeholder': 'select',
			'ui:options': {
				label: false,
				pressEnter: false
			},
			classNames: 'inline-field width35 padding-top'
		},
		description: {
			'ui:placeholder': 'Description (optional, but helpful to lenders)',
			'ui:options': {
				label: false,
				pressEnter: false
			},
			classNames: 'group-field'
		}
	},
	/*
	collateral: {
		collateralized: {
			'ui:disabled': true,
			classNames: 'group-field',
			'ui:options': {
				pressEnter: false
			}
		},
		collateralSource: {
			'ui:placeholder': 'Select your source of collateral',
			classNames: 'group-field',
			'ui:options': {
				pressEnter: false
			}
		},
		collateralAmount: {
			'ui:placeholder': 'Amount of collateral',
			'ui:options': {
				label: false,
				pressEnter: false
			},
			classNames: 'inline-field width65'
		},
		collateralTokenSymbol: {
			'ui:placeholder': 'select',
			'ui:options': {
				label: false,
				pressEnter: false
			},
			classNames: 'inline-field width35'
		}
	},
	*/
	terms: {
		interestRate: {
			'ui:placeholder': '8.12%',
			classNames: 'group-field',
			'ui:options': {
				pressEnter: false
			}
		},
		amortizationUnit: {
			'ui:placeholder': 'select',
			classNames: 'group-field',
			'ui:options': {
				pressEnter: false
			}
		},
		termLength: {
			'ui:placeholder': '3',
			classNames: 'group-field',
			'ui:options': {
				pressEnter: false
			}
		}
	}
};
