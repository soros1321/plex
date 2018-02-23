import { connect } from 'react-redux';
import { Error } from './Error';

const mapStateToProps = (state: any) => {
	return {
		errorMessage: state.errorReducer.errorMessage
	};
};

const mapDispatchToProps = (dispatch: any) => {
	return {
	};
};

export const ErrorContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Error);
