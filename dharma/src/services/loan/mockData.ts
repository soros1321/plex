import { LoanEntity } from '../../models';

export const loans: LoanEntity[] =
[
	{
		id: 'asdfGH',
		amount: '10',
		currency: 'ETH',
		collateralized: true,
		collateralSource: 'SNT',
		collateralAmount: '15',
		collateralCurrency: 'BTC',
		collateralLockupPeriod: '1 Week',
		collateralCustomLockupPeriod: '',
		terms: 'Simple Interest',
		active: true
	},
	{
		id: 'Iihwdko',
		amount: '3',
		currency: 'BTC',
		collateralized: true,
		collateralSource: 'ADA',
		collateralAmount: '20',
		collateralCurrency: 'ETH',
		collateralLockupPeriod: '1 Day',
		collateralCustomLockupPeriod: '',
		terms: 'Compound Interest (Installments)',
		active: true
	},
	{
		id: 'OWJceb',
		amount: '5',
		currency: 'ETH',
		collateralized: true,
		collateralSource: 'REP',
		collateralAmount: '100',
		collateralCurrency: 'BTC',
		collateralLockupPeriod: 'Custom',
		collateralCustomLockupPeriod: '10',
		terms: 'Simple Interest (Installments)',
		active: true
	}
];
