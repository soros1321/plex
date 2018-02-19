import * as React from 'react';
import { PressEnter } from './styledComponents';

export const CustomBaseInput = (props: any) => {
	/*
	const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			if (!props.value) {
				event.preventDefault();
			}
		}
	};
	*/
	return (
		<div>
			<input
				type="text"
				className="form-control"
				id={props.id}
				placeholder={props.placeholder}
				required={props.required}
				onChange={(event) => props.onChange(event.target.value)}
			/>
			<PressEnter className={props.value ? 'active' : ''}>OK, Press ENTER</PressEnter>
		</div>
	);
};
