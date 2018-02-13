import * as React from 'react';
import { FieldTemplateProps } from './typeDef';
import {
	Description,
	Error,
	Help
} from './styledComponents';

function FieldTemplate(props: FieldTemplateProps) {
	return (
		<div className={props.classNames} key={props.id}>
			{props.displayLabel && (<label htmlFor={props.id}>{props.label}{props.required ? '*' : null}</label>)}
			{props.displayLabel && (<Description>{props.rawDescription}</Description>)}
			{props.children}
			{props.rawErrors && props.rawErrors.map(error => (
				<Error>{error}</Error>
			))}
			<Help>{props.help}</Help>
		</div>
	);
}
export { FieldTemplate };
