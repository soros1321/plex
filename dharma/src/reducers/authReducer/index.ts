import { ActionTypes, TypeKeys } from '../../constants';
import { AuthState } from '../../reducers';

export const initialState = {
  authenticated: false,
  authToken: '',
};

export default function authReducer(state: AuthState = initialState, action: ActionTypes) {
  switch (action.type) {
    case TypeKeys.LOG_IN:
      return {
        authenticated: action.authenticated,
        authToken: action.authToken,
      };
    default:
      return state;
  }
}
