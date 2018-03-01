import { connect } from 'react-redux';
import { TradingPermissions } from './tradingPermissions';
import { TokenEntity } from '../../models';
import { setAllTokensTradingPermission, toggleTokenTradingPermission } from './actions';

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
		handleToggleTokenTradingPermission: (tokenSymbol: string, permission: boolean) => dispatch(toggleTokenTradingPermission(tokenSymbol, permission))
	};
};

export const TradingPermissionsContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(TradingPermissions);
