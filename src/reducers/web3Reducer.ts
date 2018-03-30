import { actionsEnums } from "../common/actionsEnums";

class Web3ReducerState {
    web3: any;
    accounts: string[];

    constructor() {
        this.web3 = null;
        this.accounts = [];
    }
}

const handleWeb3Connected = (state: Web3ReducerState, action: any) => {
    return {
        ...state,
        web3: action.web3,
    };
};

const handleSetAccounts = (state: Web3ReducerState, action: any) => {
    return {
        ...state,
        accounts: action.accounts,
    };
};

export const web3Reducer = (state: Web3ReducerState = new Web3ReducerState(), action: any) => {
    switch (action.type) {
        case actionsEnums.WEB3_CONNECTED:
            return handleWeb3Connected(state, action);
        case actionsEnums.SET_ACCOUNTS:
            return handleSetAccounts(state, action);
        default:
            return state;
    }
};
