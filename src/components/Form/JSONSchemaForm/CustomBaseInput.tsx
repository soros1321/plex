import * as React from 'react';
import { PressEnter } from './styledComponents';

export const CustomBaseInput = (props: any) => {
	return (
		<div>
			<input
				type="text"
				className="form-control"
				id={props.id}
				placeholder={props.placeholder}
				required={props.required}
				disabled={props.disabled}
				readOnly={props.readonly}
				onChange={(event) => props.onChange(event.target.value)}
			/>
			<PressEnter className={'press-enter ' + (props.value ? 'active' : '')}>OK, Press ENTER</PressEnter>
		</div>
	);
};
