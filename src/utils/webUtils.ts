export const encodeUrlParams = (params: any) => {
	const encodedParams = Object.keys(params).map(function(k: string) {
		return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
	}).join('&');
	return encodedParams;
};
