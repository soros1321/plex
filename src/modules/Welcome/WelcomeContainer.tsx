import { connect } from 'react-redux';
import { Welcome } from './Welcome';
import { setError } from '../../common/actions';

const mapStateToProps = (state: any) => {
	return {
	};
};

const mapDispatchToProps = (dispatch: any) => {
	return {
		handleSetError: (errorMessage: string) => dispatch(setError(errorMessage))
	};
};

export const WelcomeContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Welcome);
