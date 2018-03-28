import { connect } from 'react-redux';
import { Dashboard } from './Dashboard';
import { setError } from '../../components/Error/actions';

const mapStateToProps = (state: any) => {
	return {
		dharma: state.dharmaReducer.dharma,
		accounts: state.web3Reducer.accounts,
		pendingDebtOrders: state.debtOrderReducer.pendingDebtOrders
	};
};

const mapDispatchToProps = (dispatch: any) => {
	return {
		handleSetError: (errorMessage: string) => dispatch(setError(errorMessage))
	};
};

export const DashboardContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Dashboard);
