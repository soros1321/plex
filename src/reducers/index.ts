import { combineReducers } from 'redux';
import { web3Reducer } from './web3Reducer';
import { dharmaReducer } from './dharmaReducer';
import { errorReducer } from './errorReducer';
import { debtOrderReducer } from './debtOrderReducer';
import { routerReducer } from 'react-router-redux';

export const reducers = combineReducers({
	web3Reducer,
	dharmaReducer,
	debtOrderReducer,
	errorReducer,
	routing: routerReducer
});
