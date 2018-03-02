import { connect } from 'react-redux';
import { Error } from './Error';
import { setError } from '../../common/actions';

const mapStateToProps = (state: any) => {
	return {
		errorMessage: state.errorReducer.errorMessage
	};
};

const mapDispatchToProps = (dispatch: any) => {
	return {
		handleSetError: (errorMessage: string) => dispatch(setError(errorMessage))
	};
};

export const ErrorContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Error);
