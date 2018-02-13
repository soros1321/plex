import * as React from 'react';
import { ObjectFieldTemplateProps } from './typeDef';
import {
	GroupWrapper,
	Title,
	Description,
	InputContainerBorder
} from './styledComponents';

function ObjectFieldTemplate(props: ObjectFieldTemplateProps) {
	return (
		<GroupWrapper>
			{props.title && (<Title>{props.title}</Title>)}
			{props.title ? (
				<InputContainerBorder>
					{props.description && (<Description>{props.description}</Description>)}
					{props.properties.map(prop => prop.content)}
				</InputContainerBorder>) : (
				<div>
					{props.description && (<Description>{props.description}</Description>)}
					{props.properties.map(prop => prop.content)}
				</div>)
			}
		</GroupWrapper>
	);
}
export { ObjectFieldTemplate };
