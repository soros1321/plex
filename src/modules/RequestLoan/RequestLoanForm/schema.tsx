import { JSONSchema4 } from "json-schema";
const singleLineString = require("single-line-string");

export const schema: JSONSchema4 = {
    type: "object",
    definitions: {
        tokens: {
            type: "string",
            title: "Token",
            enum: ["REP", "MKR", "ZRX"],
            enumNames: ["Augur (REP)", "Maker DAO (MKR)", "0x Token (ZRX)"],
        },
    },
    properties: {
        debtOrderType: {
            type: "string",
            title: "Which type of loan would you like?",
            enum: ["simpleInterestLoan", "compoundInterestLoan"],
            enumNames: ["Simple Interest Loan", "Compound Interest Loan (Coming Soon)"],
            default: "simpleInterestLoan",
        },
        loan: {
            type: "object",
            title: "How much of which token would you like to borrow?",
            required: ["principalAmount", "principalTokenSymbol"],
            properties: {
                principalAmount: {
                    type: "number",
                    title: "Amount",
                },
                principalTokenSymbol: {
                    $ref: "#/definitions/tokens",
                },
                description: {
                    type: "string",
                    maxLength: 500,
                },
            },
        },
        terms: {
            type: "object",
            title: "What terms would you like?",
            required: ["interestRate", "amortizationUnit", "termLength"],
            properties: {
                interestRate: {
                    type: "number",
                    title: "Interest Rate (Per Installment)",
                    description:
                        "The interest rate you specify below will be applied for each installment.",
                },
                amortizationUnit: {
                    type: "string",
                    title: "Installments Type",
                    enum: ["hours", "days", "weeks", "months", "years"],
                    enumNames: ["Hourly", "Daily", "Weekly", "Monthly", "Yearly"],
                },
                termLength: {
                    type: "number",
                    title: "Term Length",
                    description:
                        'Enter the length of the entire debt agreement, in units of the chosen installments (e.g. a term length of 2 with an installment type of "monthly" would be equivalent to a 2 month long loan)',
                },
            },
        },
        collateral: {
            type: "object",
            title: "Will you offer collateral?",
            properties: {
                collateralized: {
                    type: "boolean",
                    title: "Collateralized",
                    description: singleLineString`Collateralization occurs when you, the borrower,
                    pledge an asset as recourse to the lender in the event that you, the borrower,
                    default on the original loan. Collateralization of assets gives lenders a
                    sufficient level of reassurance against default risk. It also helps you, the
                    borrower, receive loans that you might not otherwise receive given your credit
                    history or lack thereof.`,
                },
            },
            dependencies: {
                collateralized: {
                    properties: {
                        collateralAmount: {
                            type: "number",
                        },
                        collateralTokenSymbol: {
                            $ref: "#/definitions/tokens",
                        },
                        gracePeriodInDays: {
                            type: "number",
                        },
                    },
                },
            },
        },
    },
    required: ["debtOrderType", "loan", "terms"],
};

export const uiSchema = {
    debtOrderType: {
        "ui:autofocus": true,
        "ui:options": {
            pressEnter: true,
        },
    },
    loan: {
        principalAmount: {
            "ui:placeholder": "100.3",
            classNames: "inline-field width65",
            "ui:options": {
                pressEnter: false,
            },
        },
        principalTokenSymbol: {
            "ui:placeholder": "Select token...",
            "ui:options": {
                label: false,
                pressEnter: false,
            },
            classNames: "inline-field width35 padding-top",
        },
        description: {
            "ui:placeholder": "Description (optional, but helpful to lenders)",
            "ui:options": {
                label: false,
                pressEnter: false,
            },
            classNames: "group-field",
        },
    },
    collateral: {
        collateralized: {
            classNames: "group-field",
            "ui:options": {
                pressEnter: false,
            },
        },
        collateralAmount: {
            "ui:placeholder": "Amount of collateral",
            "ui:options": {
                label: false,
                pressEnter: false,
            },
            classNames: "inline-field width65",
        },
        collateralTokenSymbol: {
            "ui:placeholder": "select",
            "ui:options": {
                label: false,
                pressEnter: false,
            },
            classNames: "inline-field width35",
        },
        gracePeriodInDays: {
            "ui:placeholder": "Grace period (days)",
            "ui:options": {
                label: false,
                pressEnter: false,
            },
            classNames: "inline-field width65",
        },
    },
    terms: {
        interestRate: {
            "ui:placeholder": "8.12%",
            classNames: "group-field",
            "ui:options": {
                pressEnter: false,
            },
        },
        amortizationUnit: {
            "ui:placeholder": "Select installments...",
            classNames: "group-field",
            "ui:options": {
                pressEnter: false,
            },
        },
        termLength: {
            "ui:placeholder": "3",
            classNames: "group-field",
            "ui:options": {
                pressEnter: false,
            },
        },
    },
};
