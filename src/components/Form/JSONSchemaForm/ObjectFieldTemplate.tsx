import * as React from 'react';
import { ObjectFieldTemplateProps } from './typeDef';
import {
	GroupWrapper,
	Title,
	Description,
	InputContainerBorder,
	PressEnter
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
			<PressEnter className="press-enter">OK, Press ENTER</PressEnter>
		</GroupWrapper>
	);
}
export { ObjectFieldTemplate };
