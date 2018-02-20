import { connect } from 'react-redux';
import { RequestLoanWeb3 } from '../modules/RequestLoan/RequestLoanWeb3';
import { web3Connected, dharmaInstantiated } from '../actions';

const mapStateToProps = (state: any) => {
	return {
		web3: state.web3Reducer.web3,
		dharma: state.dharmaReducer.dharma
	};
};

const mapDispatchToProps = (dispatch: any) => {
	return {
		handleWeb3Connected: (web3: any) => {
			return dispatch(web3Connected(web3));
		},
		handleDharmaInstantiated: (dharma: any) => {
			return dispatch(dharmaInstantiated(dharma));
		}
	};
};

export const RequestLoanContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(RequestLoanWeb3);
