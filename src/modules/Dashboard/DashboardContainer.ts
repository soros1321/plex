import { connect } from 'react-redux';
import { Dashboard } from './Dashboard';

const mapStateToProps = (state: any) => {
	return {
		debtOrders: state.debtOrderReducer.debtOrders
	};
};

const mapDispatchToProps = (dispatch: any) => {
	return {
	};
};

export const DashboardContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Dashboard);
