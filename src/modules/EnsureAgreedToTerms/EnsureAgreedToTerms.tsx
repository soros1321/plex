import * as React from "react";
import { browserHistory } from "react-router";

interface Props {
    agreeToTerms: boolean;
}

class EnsureAgreedToTerms extends React.Component<Props, {}> {
    componentDidMount() {
        if (!this.props.agreeToTerms) {
            browserHistory.push("/");
        }
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.agreeToTerms !== prevProps.agreeToTerms && !this.props.agreeToTerms) {
            browserHistory.push("/");
        }
    }

    render() {
        if (this.props.agreeToTerms) {
            return this.props.children;
        } else {
            return null;
        }
    }
}

export { EnsureAgreedToTerms };
