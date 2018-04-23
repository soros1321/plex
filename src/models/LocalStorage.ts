import { DebtOrderEntity } from "../models";

export const loadState = () => {
    try {
        const serializedState = localStorage.getItem(
            process.env.REACT_APP_LOCAL_STORAGE_KEY_PREPEND + "state",
        );
        if (serializedState === null) {
            return undefined;
        }

        const state = JSON.parse(serializedState);
        state.debtOrderReducer.debtOrders = new Map<string, DebtOrderEntity>(
            state.debtOrderReducer.debtOrders,
        );

        return state;
    } catch (err) {
        return undefined;
    }
};

export const saveState = (state: any) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem(
            process.env.REACT_APP_LOCAL_STORAGE_KEY_PREPEND + "state",
            serializedState,
        );
    } catch (err) {
        // console.log(err);
    }
};
