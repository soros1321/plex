import { connect } from 'react-redux';
import { TradingPermissions } from './TradingPermissions';
import { TokenEntity } from '../../models';
import { setAllTokensTradingPermission, toggleTokenTradingPermission } from './actions';
import { setError } from '../../components/Error/actions';

const mapStateToProps = (state: any) => {
	return {
		web3: state.web3Reducer.web3,
		dharma: state.dharmaReducer.dharma,
		tokens: state.tokenReducer.tokens
	};
};

const mapDispatchToProps = (dispatch: any) => {
	return {
		handleSetAllTokensTradingPermission: (tokens: TokenEntity[]) => dispatch(setAllTokensTradingPermission(tokens)),
		handleToggleTokenTradingPermission: (tokenSymbol: string, permission: boolean) => dispatch(toggleTokenTradingPermission(tokenSymbol, permission)),
		handleSetError: (errorMessage: string) => dispatch(setError(errorMessage))
	};
};

export const TradingPermissionsContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(TradingPermissions);
