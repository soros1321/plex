import { BigNumber } from "bignumber.js";

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

/**
 * Given a token's balance, and then number of decimals associated with that token,
 * returns a human-readable string.
 *
 * Examples:
 * displayBalance(100000000020000000000000, 18);
 * => "100,000.00002"
 *
 * displayBalance(100000000000000200000000, 18);
 * => "100,000.0000000002"
 *
 * displayBalance(100000000000000000000000, 18);
 * => "100,000"
 *
 * @param {BigNumber} balance
 * @param {number} numDecimals
 * @returns {string}
 */
export const displayBalance = (balance: BigNumber, numDecimals: number) => {
    return balance.shift(-numDecimals).toFormat();
};
