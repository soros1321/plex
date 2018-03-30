export const encodeUrlParams = (params: any) => {
    const encodedParams = Object.keys(params)
        .map(function(k: string) {
            return encodeURIComponent(k) + "=" + encodeURIComponent(params[k]);
        })
        .join("&");
    return encodedParams;
};

export const shortenString = (text: string) => {
    if (text && text.length > 10) {
        return text.substring(0, 5) + "..." + text.substring(text.length - 5);
    } else {
        return text;
    }
};

export const withCommas = (input: number) => {
    return input.toLocaleString();
};

export const truncate = (input: number, numDecimals: number) => {
    const scaledInput = Math.floor(input * 100 ** numDecimals) / 100 ** numDecimals;
    return scaledInput.toFixed(numDecimals);
};
