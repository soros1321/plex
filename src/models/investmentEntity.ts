export interface InvestmentEntity {
	id: string;
	loanId: string;
	amountLended: number;
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
	defaulted: boolean;
	collected: boolean;
	paid: boolean;
	createdOnTimestamp: number;
	paidOnTimestamp: number;
	defaultedOnTimestamp: number;
	collectedOnTimestamp: number;
}
