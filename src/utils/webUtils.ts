export const encodeUrlParams = (params: any) => {
	const encodedParams = Object.keys(params).map(function(k: string) {
		return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
	}).join('&');
	return encodedParams;
};

export const shortenString = (text: string) => {
	if (text.length > 6) {
		return text.substring(0, 1) + '...' + text.substring(text.length - 5);
	} else {
		return text;
	}
};
