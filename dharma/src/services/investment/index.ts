import { InvestmentEntity } from '../../models';
import { investments } from './mockData';

const fetchInvestments = (): Promise<InvestmentEntity[]> => {
	return Promise.resolve(investments);
};

export const investmentAPI = {
	fetchInvestments,
};
