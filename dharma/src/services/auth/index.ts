import { AUTH_TOKEN_KEY } from '../../constants';

const logIn = (accessCode: string): string => {
  var authToken = '';
  let request = new XMLHttpRequest();
  request.open('GET', `http://localhost:3000/authenticate?access_token=${accessCode}`, false);
  request.send(null);

  if (request.status === 401) {
    console.log(request.responseText);
    return authToken;
  }

  if (request.status === 200) {
    console.log(request.responseText);
    authToken = JSON.parse(request.responseText).auth_token;
  }

  return authToken;
};

// TODO: update with API call
const loggedIn = () => {
  if (!localStorage.getItem(AUTH_TOKEN_KEY)) {
    return false;
  } else {
    return true;
  }
};

export const authAPI = {
  logIn,
  loggedIn,
};
