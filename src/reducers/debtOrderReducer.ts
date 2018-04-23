import { actionsEnums } from "../common/actionsEnums";
import { DebtOrderEntity } from "../models";

class DebtOrderReducerState {
    debtOrders: Map<string, DebtOrderEntity>;
    filledDebtOrderIssuanceHashes: string[];
    pendingDebtOrderIssuanceHashes: string[];
    singleDebtOrder: DebtOrderEntity;

    constructor() {
        this.debtOrders = new Map<string, DebtOrderEntity>();
        this.filledDebtOrderIssuanceHashes = [];
        this.pendingDebtOrderIssuanceHashes = [];
        this.singleDebtOrder = new DebtOrderEntity();
    }
}

const handleRequestDebtOrder = (state: DebtOrderReducerState, payload: DebtOrderEntity) => {
    const { debtOrders, pendingDebtOrderIssuanceHashes } = state;
    debtOrders.set(payload.issuanceHash, payload);
    pendingDebtOrderIssuanceHashes.push(payload.issuanceHash);

    return {
        ...state,
        debtOrders,
        pendingDebtOrderIssuanceHashes,
    };
};

const handleGetPendingDebtOrder = (state: DebtOrderReducerState, payload: string) => {
    const pendingDebtOrder = state.debtOrders.get(payload);

    return {
        ...state,
        singleDebtOrder: pendingDebtOrder,
    };
};

const handleRemovePendingDebtOrder = (state: DebtOrderReducerState, payload: string) => {
    const { debtOrders, pendingDebtOrderIssuanceHashes } = state;
    debtOrders.delete(payload);

    return {
        ...state,
        debtOrders,
        pendingDebtOrderIssuanceHashes: pendingDebtOrderIssuanceHashes.filter(
            (issuanceHash) => issuanceHash !== payload,
        ),
    };
};

const handleSetFilledDebtOrders = (
    state: DebtOrderReducerState,
    filledDebtOrders: DebtOrderEntity[],
) => {
    const debtOrders = state.debtOrders;
    const filledDebtOrderIssuanceHashes = [];

    for (const debtOrder of filledDebtOrders) {
        debtOrders.set(debtOrder.issuanceHash, debtOrder);
        filledDebtOrderIssuanceHashes.push(debtOrder.issuanceHash);
    }

    return {
        ...state,
        debtOrders,
        filledDebtOrderIssuanceHashes,
    };
};

const handleUpdateDebtOrder = (state: DebtOrderReducerState, debtOrder: DebtOrderEntity) => {
    const debtOrders = state.debtOrders;
    debtOrders.set(debtOrder.issuanceHash, debtOrder);

    return {
        ...state,
        debtOrders,
    };
};

export const debtOrderReducer = (
    state: DebtOrderReducerState = new DebtOrderReducerState(),
    action: any,
) => {
    switch (action.type) {
        case actionsEnums.REQUEST_DEBT_ORDER:
            return handleRequestDebtOrder(state, action.payload);
        case actionsEnums.GET_PENDING_DEBT_ORDER:
            return handleGetPendingDebtOrder(state, action.payload);
        case actionsEnums.FILL_DEBT_ORDER:
        case actionsEnums.CANCEL_DEBT_ORDER:
            return handleRemovePendingDebtOrder(state, action.payload);
        case actionsEnums.SET_FILLED_DEBT_ORDERS:
            return handleSetFilledDebtOrders(state, action.payload);
        case actionsEnums.UPDATE_DEBT_ORDER:
            return handleUpdateDebtOrder(state, action.debtOrder);
        default:
            return state;
    }
};
