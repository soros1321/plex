import { connect } from 'react-redux';
import { Investments } from './Investments';

const mapStateToProps = (state: any) => {
	return {
		dharma: state.dharmaReducer.dharma
	};
};

const mapDispatchToProps = (dispatch: any) => {
	return {
	};
};

export const InvestmentsContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Investments);
