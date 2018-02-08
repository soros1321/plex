export interface LoanEntity {
	id: string;
	amount: string;
	currency: string;
	collateralized: boolean;
	collateralSource: string;
	collateralAmount: string;
	collateralCurrency: string;
	collateralLockupPeriod: string;
	collateralCustomLockupPeriod: string;
	terms: string;
	active: boolean;
}
