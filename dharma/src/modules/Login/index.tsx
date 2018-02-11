import * as React from 'react';
import { authAPI } from '../../services';

interface LoginState {
  accessCode: string;
}

class Login extends React.PureComponent<{}, LoginState> {
  constructor(props: {}) {
    super(props);
    this.state = { accessCode: '' };
  }

  logIn = (event: React.FormEvent<HTMLFormElement>) => {
    console.log(this.state.accessCode);
    authAPI.logIn(this.state.accessCode).then((status) => {
      console.log(`log in was: ${status}`);
    });
    event.preventDefault();
  }

	render() {
		return (
			<div className="main-wrapper">
        <form onSubmit={this.logIn}>
          <label>
            Access Code:
            <input
              onChange={(event) => {
                this.setState({ accessCode: event.target.value });
              }}
              type="text"
              value={this.state.accessCode}
            />
          </label>
        </form>
			</div>
		);
	}
}

export { Login };
