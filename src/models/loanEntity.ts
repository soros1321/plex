export interface LoanEntity {
	id: string;
	amount: number;
	currency: string;
	collateralized: boolean;
	collateralSource: string;
	collateralAmount: number;
	collateralCurrency: string;
	collateralLockupPeriod: string;
	collateralCustomLockupPeriod: number;
	terms: string;
	installments: boolean;
	amountPaid: number;
	active: boolean;
	paid: boolean;
	createdOnTimestamp: number;
	paidOnTimestamp: number;
}
