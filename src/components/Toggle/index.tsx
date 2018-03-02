import * as React from 'react';
import ReactToggle from 'react-toggle';
import { ToggleLabel, ToggleName } from './styledComponents';
import './toggle.css';

interface Props {
  disabled?: boolean;
  name: string;
  label: JSX.Element;
  prepend?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

interface State {
  disabled: boolean;
}

class Toggle extends React.Component<Props, State> {
  constructor (props: Props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      disabled: props.disabled ? props.disabled : false
    };
  }

  handleChange(e: React.FormEvent<HTMLInputElement>) {
    this.setState({ disabled: true });
    this.props.onChange(e.currentTarget.checked);
    this.setState({ disabled: false });
  }

  render() {
    return (
      <div>
				<ReactToggle
					checked={this.props.checked}
					disabled={this.state.disabled}
					icons={false}
					id={this.props.prepend ? this.props.prepend + '-' + this.props.name : this.props.name}
					name={this.props.name}
					onChange={this.handleChange}
				/>
        <ToggleLabel>
          <ToggleName>{this.props.label}</ToggleName>
        </ToggleLabel>
      </div>
    );
  }
}

export { Toggle };
