import { combineReducers } from 'redux';
import authReducer from './authReducer';

export type AuthState = {
  authenticated: boolean;
  authToken: string;
};

export type RootState = {
  auth: AuthState;
};

const rootReducer = combineReducers({
  auth: authReducer,
});

export default rootReducer;
