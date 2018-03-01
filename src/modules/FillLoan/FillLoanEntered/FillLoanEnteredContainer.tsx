import { connect } from 'react-redux';
import { FillLoanEntered } from './FillLoanEntered';

const mapStateToProps = (state: any) => {
	return {
		web3: state.web3Reducer.web3,
		accounts: state.web3Reducer.accounts,
		dharma: state.dharmaReducer.dharma
	};
};

const mapDispatchToProps = (dispatch: any) => {
	return {
	};
};

export const FillLoanEnteredContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(FillLoanEntered);
