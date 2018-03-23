import { BigNumber } from 'bignumber.js';
import { DebtOrder } from '@dharmaprotocol/dharma.js/dist/types/src/types';

export const amortizationUnitToFrequency = (unit: string) => {
	let frequency: string = '';
	switch (unit) {
		case 'hours':
			frequency = 'Hourly';
			break;
		case 'days':
			frequency = 'Daily';
			break;
		case 'weeks':
			frequency = 'Weekly';
			break;
		case 'months':
			frequency = 'Monthly';
			break;
		case 'years':
			frequency = 'Yearly';
			break;
		default:
			break;
	}
	return frequency;
};

export const normalizeDebtOrder = (debtOrder: DebtOrder.Instance) => {
	const _debtOrder = {
		...debtOrder,
		principalAmount: debtOrder!.principalAmount!.toNumber(),
		debtorFee: debtOrder!.debtorFee!.toNumber(),
		creditorFee: debtOrder!.creditorFee!.toNumber(),
		relayerFee: debtOrder!.relayerFee!.toNumber(),
		underwriterFee: debtOrder!.underwriterFee!.toNumber(),
		underwriterRiskRating: debtOrder!.underwriterRiskRating!.toNumber(),
		expirationTimestampInSec: debtOrder!.expirationTimestampInSec!.toNumber(),
		salt: debtOrder!.salt!.toNumber(),
		debtorSignature: JSON.stringify(debtOrder.debtorSignature),
		creditorSignature: JSON.stringify(debtOrder.creditorSignature),
		underwriterSignature: JSON.stringify(debtOrder.underwriterSignature)
	};
	return _debtOrder;
};

export const debtOrderFromJSON = (debtOrderJSON: string) => {
	const debtOrder = JSON.parse(debtOrderJSON);
	debtOrder.principalAmount = new BigNumber(debtOrder.principalAmount);
	debtOrder.debtorFee = new BigNumber(debtOrder.debtorFee);
	debtOrder.creditorFee = new BigNumber(debtOrder.creditorFee);
	debtOrder.relayerFee = new BigNumber(debtOrder.relayerFee);
	debtOrder.underwriterFee = new BigNumber(debtOrder.underwriterFee);
	debtOrder.underwriterRiskRating = new BigNumber(debtOrder.underwriterRiskRating);
	debtOrder.expirationTimestampInSec = new BigNumber(debtOrder.expirationTimestampInSec);
	debtOrder.salt = new BigNumber(debtOrder.salt);
	if (typeof debtOrder.debtorSignature === 'string') {
		debtOrder.debtorSignature = JSON.parse(debtOrder.debtorSignature);
	}
	if (typeof debtOrder.creditorSignature === 'string') {
		debtOrder.creditorSignature = JSON.parse(debtOrder.creditorSignature);
	}
	if (typeof debtOrder.underwriterSignature === 'string') {
		debtOrder.underwriterSignature = JSON.parse(debtOrder.underwriterSignature);
	}
	return debtOrder;
};
