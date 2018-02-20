import { connect } from 'react-redux';
import { RequestLoanWeb3 } from '../modules/RequestLoan/RequestLoanWeb3';

const mapStateToProps = (state: any) => {
	return {
		web3: state.web3Reducer.web3,
		accounts: state.web3Reducer.accounts,
		dharma: state.dharmaReducer.dharma
	};
};

export const RequestLoanContainer = connect(
	mapStateToProps,
)(RequestLoanWeb3);
