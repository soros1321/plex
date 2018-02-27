import { connect } from 'react-redux';
import { FillLoanEntered } from './FillLoanEntered';
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

export const FillLoanEnteredContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(FillLoanEntered);
