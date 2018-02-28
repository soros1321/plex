import { connect } from 'react-redux';
import { FillLoanEntered } from './FillLoanEntered';

const mapStateToProps = (state: any) => {
	return {
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
