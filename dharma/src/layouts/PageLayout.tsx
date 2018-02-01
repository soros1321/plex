import * as React from 'react';
import TopNavBar from './TopNavBar';

class PageLayout extends React.Component {
  render() {
    return (
			<div>
				<TopNavBar />
				{this.props.children}
			</div>
    );
  }
}

export default PageLayout;
