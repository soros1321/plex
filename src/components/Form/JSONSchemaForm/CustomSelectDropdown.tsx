import * as React from 'react';
import { PressEnter } from './styledComponents';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

export const CustomSelectDropdown = (props: any) => {
	let selectOptions: any[] = [];
	props.options.enumOptions.map((opt: any) => selectOptions.push({value: opt.value, label: opt.label}));
	return (
		<div>
			<Select
				options={selectOptions}
				value={props.value}
				onChange={(selected: any) => props.onChange(selected.value)}
				clearable={false}
				style={{ borderRadius : 0, height: 38 }}
			/>
			{ (props.options.pressEnter || typeof props.options.pressEnter === 'undefined') && (
					<PressEnter className={'press-enter ' + (props.value ? 'active' : '')}>OK, Press ENTER</PressEnter>
				)
			}
		</div>
	);
};
