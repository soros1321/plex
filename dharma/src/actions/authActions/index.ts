import { AUTH_TOKEN_KEY, TypeKeys } from '../../constants';
import { authAPI } from '../../services';

export function logIn(accessCode: string) {
  const authToken = authAPI.logIn(accessCode);
  localStorage.setItem(AUTH_TOKEN_KEY, authToken);
  return {
    authenticated: authToken.length > 0,
    authToken,
    type: TypeKeys.LOG_IN,
  };
}
