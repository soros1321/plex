const AUTH_TOKEN_KEY = 'auth_token';

const logIn = (accessCode: string): Promise<boolean> => {
  const authToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE1MTgzOTI5NjR9.IBWI7D12nSEVhbZ-SfwFSKVbpeG5krCaNL0GfMGy5kc';
  localStorage.setItem(AUTH_TOKEN_KEY, authToken);
  return Promise.resolve(true);
};

export const authAPI = {
  logIn,
};
