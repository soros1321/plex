import { connect } from 'react-redux';
import { DebtsMetrics } from './DebtsMetrics';

const mapStateToProps = (state: any) => {
	return {
		tokens: state.tokenReducer.tokens,
		dharma: state.dharmaReducer.dharma
	};
};

const mapDispatchToProps = (dispatch: any) => {
	return {
	};
};

export const DebtsMetricsContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(DebtsMetrics);
