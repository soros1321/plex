import { combineReducers } from 'redux';
import { web3Reducer } from './web3Reducer';
import { dharmaReducer } from './dharmaReducer';
import { routerReducer } from 'react-router-redux';

export const reducers = combineReducers({
	web3Reducer,
	dharmaReducer,
	routing: routerReducer
});
