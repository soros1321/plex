import { connect } from 'react-redux';
import { Debts } from './Debts';

const mapStateToProps = (state: any) => {
	return {
		dharma: state.dharmaReducer.dharma
	};
};

const mapDispatchToProps = (dispatch: any) => {
	return {
	};
};

export const DebtsContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Debts);
