import { connect } from 'react-redux';
import { RequestLoanWeb3 } from './RequestLoanWeb3';

const mapStateToProps = (state: any) => {
	return {
		web3: state.web3Reducer.web3,
		accounts: state.web3Reducer.accounts,
		dharma: state.dharmaReducer.dharma
	};
};

export const RequestLoanWeb3Container = connect(
	mapStateToProps,
)(RequestLoanWeb3);
