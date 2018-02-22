import * as React from 'react';
import { PressEnter } from './styledComponents';

export const CustomSelectDropdown = (props: any) => {
	return (
		<div>
			<select
				className="form-control"
				id={props.id}
				required={props.required}
				disabled={props.disabled || props.readonly}
				onChange={(event) => props.onChange(event.target.value)}
			>
				{props.placeholder !== '' && (<option>{props.placeholder}</option>)}
				{props.options.enumOptions.map((opt: any) => (
					<option value={opt.value}>{opt.label}</option>
				))}
			</select>
			<PressEnter className={props.value ? 'active' : ''}>OK, Press ENTER</PressEnter>
		</div>
	);
};
