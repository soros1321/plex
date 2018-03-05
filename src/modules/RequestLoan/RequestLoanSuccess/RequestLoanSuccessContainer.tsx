import { connect } from 'react-redux';
import { RequestLoanSuccess } from './RequestLoanSuccess';
import { getDebtOrder } from './actions';

const mapStateToProps = (state: any) => {
	return {
		debtOrder: state.debtOrderReducer.singleDebtOrder,
		dharma: state.dharmaReducer.dharma
	};
};

const mapDispatchToProps = (dispatch: any) => {
	return {
		getDebtOrder: (identifier: string) => dispatch(getDebtOrder(identifier))
	};
};

export const RequestLoanSuccessContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(RequestLoanSuccess);
