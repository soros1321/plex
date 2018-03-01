import { connect } from 'react-redux';
import { TradingPermissions } from './tradingPermissions';

const mapStateToProps = (state: any) => {
  return {
    web3: state.web3Reducer.web3,
    dharma: state.dharmaReducer.dharma
  };
};

export const TradingPermissionsContainer = connect(
  mapStateToProps,
)(TradingPermissions);
