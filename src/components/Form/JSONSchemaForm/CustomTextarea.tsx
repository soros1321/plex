import * as React from 'react';
import { PressEnter } from './styledComponents';

export const CustomTextarea = (props: any) => {
	return (
		<div>
			<textarea
				className="form-control"
				id={props.id}
				placeholder={props.placeholder}
				required={props.required}
				disabled={props.disabled}
				readOnly={props.readonly}
				onChange={(event) => props.onChange(event.target.value)}
				rows={props.options.rows ? props.options.rows : 3}
			/>
			{ (props.options.pressEnter || typeof props.options.pressEnter === 'undefined') && (
					<PressEnter className={'press-enter ' + (props.value ? 'active' : '')}>OK, Press ENTER</PressEnter>
				)
			}
		</div>
	);
};
