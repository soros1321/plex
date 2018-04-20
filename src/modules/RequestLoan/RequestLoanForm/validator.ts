import { TokenEntity } from "src/models";
import { BigNumber } from "bignumber.js";

export const validateInterestRate = (interestRate: number) => {
    const maxDecimalPlaces = 4;
    let error: string = "";
    if (interestRate % 1 !== 0 && interestRate.toString().split(".")[1].length > maxDecimalPlaces) {
        error = `Interest amount cannot have more than ${maxDecimalPlaces} decimal places`;
    }
    return error;
};

export const validateCollateral = (
    tokens: TokenEntity[],
    collateral: { collateralTokenSymbol: string; collateralAmount: number },
) => {
    let response = { fieldName: "", error: "" };
    const selectedToken = tokens.find(function(token: TokenEntity) {
        return token.tokenSymbol === collateral.collateralTokenSymbol;
    });
    if (!selectedToken) {
        response = {
            fieldName: "collateralTokenSymbol",
            error: `${collateral.collateralTokenSymbol} is currently not supported`,
        };
    } else if (
        !selectedToken.tradingPermitted ||
        selectedToken.balance.lt(new BigNumber(collateral.collateralAmount * 10 ** 18))
    ) {
        response = { fieldName: "collateralAmount", error: `Token allowance is insufficient` };
    }
    return response;
};

export const validateNumber = (value: number, maxValue: number, noDecimals: boolean) => {
    let error: string = "";
    if (value < 0) {
        error = "Value cannot be negative";
    } else if (value === 0) {
        error = `Value should be greater than 0`;
    } else if (maxValue > 0 && value > maxValue) {
        error = `Value cannot be greater than ${maxValue}`;
    } else if (value % 1 !== 0 && noDecimals) {
        error = "Value cannot have decimals";
    }
    return error;
};
