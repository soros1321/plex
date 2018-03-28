import * as React from 'react';
import { PressEnter } from './styledComponents';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import './select.css';

export const CustomSelectDropdown = (props: any) => {
	let selectOptions: any[] = [];
	let onInputKeyDown = (event: any) => {
		switch (event.keyCode) {
			case 13:
				event.preventDefault();
				const selectGoToNext = new CustomEvent('selectGoToNext', {detail: {name: props.id}});
				window.dispatchEvent(selectGoToNext);
				break;
			default:
				break;
		}
	};
	props.options.enumOptions.map((opt: any) => {
		// TODO: Remove once we enable more loan types.  This is a hacky way of disabling the
		// 	options, but is also temporary.
		if (opt.label.includes('Coming Soon')) {
			selectOptions.push({value: opt.value, label: opt.label, disabled: true});
		} else {
			selectOptions.push({value: opt.value, label: opt.label});
		}
	});
	return (
		<div>
			<Select
				name={props.id}
				autoFocus={props.autofocus}
				options={selectOptions}
				value={props.value}
				onChange={(selected: any) => props.onChange(selected.value)}
				clearable={false}
				style={{ borderRadius: 0, height: 38, borderColor: '#000000' }}
				disabled={props.disabled}
				onInputKeyDown={onInputKeyDown}
			/>
			{ (props.options.pressEnter || typeof props.options.pressEnter === 'undefined') && (
					<PressEnter className={'press-enter ' + (props.value ? 'active' : '')}>OK, Press ENTER</PressEnter>
				)
			}
		</div>
	);
};
