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
		collateralLockupPeriod: 'custom',
		collateralCustomLockupPeriod: 6,
		terms: 'simple',
		installments: true,
		active: true,
		createdOnDate: 1514764800
	},
	{
		id: 'Iihwdko',
		amount: '3',
		currency: 'BTC',
		collateralized: true,
		collateralSource: 'ADA',
		collateralAmount: '20',
		collateralCurrency: 'ETH',
		collateralLockupPeriod: '1week',
		collateralCustomLockupPeriod: 0,
		terms: 'compound',
		installments: false,
		active: true,
		createdOnDate: 1517961600
	},
	{
		id: 'OWJceb',
		amount: '5',
		currency: 'ETH',
		collateralized: true,
		collateralSource: 'REP',
		collateralAmount: '100',
		collateralCurrency: 'BTC',
		collateralLockupPeriod: 'custom',
		collateralCustomLockupPeriod: 10,
		terms: 'simple',
		installments: true,
		active: true,
		createdOnDate: 1515974400
	}
];
