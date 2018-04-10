const singleLineString = require("single-line-string");

export const web3Errors = {
    UNABLE_TO_FIND_ACCOUNTS: singleLineString`
        Unable to find active account on current Ethereum network.  Make sure you are using
        a Web3-enabled browser (such as Chrome with MetaMask installed), that you are connecting
        to the Kovan testnet, and that your account is unlocked.
    `,
    UNABLE_TO_FIND_CONTRACTS: singleLineString`
        Unable to find the Dharma smart contracts on the current Ethereum network.  Make sure you are using
        a Web3-enabled browser (such as Chrome with MetaMask installed), that you are connecting
        to the Kovan testnet, and that your account is unlocked.
    `,
};
