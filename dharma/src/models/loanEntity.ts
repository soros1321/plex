export interface LoanEntity {
	id: string;
	amount: string;
	currency: string;
	collateralized: boolean;
	collateralSource: string;
	collateralAmount: string;
	collateralCurrency: string;
	collateralLockupPeriod: string;
	collateralCustomLockupPeriod: number;
	terms: string;
	installments: boolean;
	active: boolean;
	createdOnDate: number;
}
