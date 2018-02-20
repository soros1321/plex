import { combineReducers } from 'redux';
import { web3Reducer } from './web3Reducer';
import { dharmaReducer } from './dharmaReducer';

export const reducers = combineReducers({
	web3Reducer,
	dharmaReducer
});
