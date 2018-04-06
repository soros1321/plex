import { connect } from 'react-redux';
import { ActiveDebtOrder } from './ActiveDebtOrder';
import { BigNumber } from 'bignumber.js';
import { successfulRepayment, cancelDebtOrder } from './actions';
import { setError, setSuccess } from '../../../../components/Toast/actions';

const mapStateToProps = (state: any) => {
	return {
		accounts: state.web3Reducer.accounts
	};
};

const mapDispatchToProps = (dispatch: any) => {
	return {
		handleSuccessfulRepayment: (agreementId: string, repaymentAmount: BigNumber, tokenSymbol: string) =>
			dispatch(successfulRepayment(agreementId, repaymentAmount, tokenSymbol)),
		handleSetErrorToast: (errorMessage: string) => dispatch(setError(errorMessage)),
		handleSetSuccessToast: (successMessage: string) => dispatch(setSuccess(successMessage)),
		handleCancelDebtOrder: (issuanceHash: string) => dispatch(cancelDebtOrder(issuanceHash))
	};
};

export const ActiveDebtOrderContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ActiveDebtOrder);
