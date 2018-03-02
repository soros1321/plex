import { connect } from 'react-redux';
import { RequestLoanWeb3 } from './RequestLoanWeb3';
import { userRequestDebtOrder } from './actions';
import { DebtOrderEntity } from '../../../models';
import { setError } from '../../../common/actions';

const mapStateToProps = (state: any) => {
	return {
		web3: state.web3Reducer.web3,
		accounts: state.web3Reducer.accounts,
		dharma: state.dharmaReducer.dharma
	};
};

const mapDispatchToProps = (dispatch: any) => {
	return {
		handleRequestDebtOrder: (debtOrder: DebtOrderEntity) => dispatch(userRequestDebtOrder(debtOrder)),
		handleSetError: (errorMessage: string) => dispatch(setError(errorMessage))
	};
};

export const RequestLoanWeb3Container = connect(
	mapStateToProps,
	mapDispatchToProps
)(RequestLoanWeb3);
