import * as React from 'react';
import { LogInAction } from '../../constants';

interface LoginState {
  accessCode: string;
}

interface LoginProps {
  logInAction: (accessCode: string) => LogInAction;
}

// TODO: Handle asynchronous call to log in, failure to log in, etc. gracefully
class Login extends React.PureComponent<LoginProps, LoginState> {
  constructor(props: LoginProps) {
    super(props);
    this.state = { accessCode: '' };
  }

  logIn = (event: React.FormEvent<HTMLFormElement>) => {
    this.props.logInAction(this.state.accessCode);
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
