import * as React from 'react';
import {
	CheckboxLabel,
	Checkmark
} from './styledComponents';

export const CustomCheckbox = function(props: any) {
	return (
		<CheckboxLabel>{props.schema.title} {props.required ? '*' : null}
			<input type="checkbox" onChange={() => props.onChange(!props.value)} />
			<Checkmark />
		</CheckboxLabel>
	);
};
