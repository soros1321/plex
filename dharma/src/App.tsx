import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { PageLayout } from './layouts';
import { Login } from './modules';
import { logIn } from './actions';
import { LogInAction } from './constants';
import { authAPI } from './services';

interface AppProps {
  authenticated: boolean;
  logIn: () => LogInAction;
}

export type State = {
  auth: {
    authenticated: boolean
  };
};

class App extends React.Component<AppProps, {}> {
	render() {
    if (!this.props.authenticated) {
      return (<Login logInAction={this.props.logIn} />);
    } else {
      return (
        <div>
          <PageLayout>
            {this.props.children}
          </PageLayout>
        </div>
      );
    }
	}
}

function mapStateToProps(state: State) {
  const authenticated = state.auth.authenticated || authAPI.loggedIn();

  return {
    authenticated,
  };
}

function mapDispatchToProps(dispatch: Dispatch<State>) {
  return {
    logIn: bindActionCreators(logIn, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App) as React.ComponentClass<{}>;
