import * as React from "react";
import { Description } from "./styledComponents";

interface HeaderProps {
    title: string;
    description?: JSX.Element;
}

class Header extends React.Component<HeaderProps, {}> {
    render() {
        return (
            <div>
                <h1>{this.props.title}</h1>
                <Description>{this.props.description}</Description>
            </div>
        );
    }
}

export { Header };
