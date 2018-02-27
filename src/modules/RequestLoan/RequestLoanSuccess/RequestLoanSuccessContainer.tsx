import { connect } from 'react-redux';
import { RequestLoanSuccess } from './RequestLoanSuccess';
import { getDebtOrder } from './actions';

const mapStateToProps = (state: any) => {
	return {
		debtOrder: state.debtOrderReducer.singleDebtOrder
	};
};

const mapDispatchToProps = (dispatch: any) => {
	return {
		getDebtOrder: (debtorSignature: string) => dispatch(getDebtOrder(debtorSignature))
	};
};

export const RequestLoanSuccessContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(RequestLoanSuccess);
