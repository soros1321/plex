import { LoanEntity } from '../../models';
import { loans } from './mockData';

const fetchLoans = (): Promise<LoanEntity[]> => {
	return Promise.resolve(loans);
};

export const loanAPI = {
	fetchLoans,
};
