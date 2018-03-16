import * as React from 'react';
import { formatDate, formatTime } from '../../../src/utils/formatDate';

describe('formatDate', () => {
	it('should output the right date format', () => {
		const testDate = formatDate(1521174018);
		expect(testDate).toEqual('2018-3-16');
	});

	it('should output the right time format', () => {
		const testTime = formatTime(1521174018);
		expect(testTime).toEqual('11:20:18');
	});
});
