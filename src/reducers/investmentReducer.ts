import { actionsEnums } from "../common/actionsEnums";
import { InvestmentEntity } from "../models";

class InvestmentReducerState {
    investments: InvestmentEntity[];

    constructor() {
        this.investments = [];
    }
}

const handleSetInvestments = (state: InvestmentReducerState, investments: InvestmentEntity[]) => {
    return {
        ...state,
        investments,
    };
};

export const investmentReducer = (
    state: InvestmentReducerState = new InvestmentReducerState(),
    action: any,
) => {
    switch (action.type) {
        case actionsEnums.SET_INVESTMENTS:
            return handleSetInvestments(state, action.payload);
        default:
            return state;
    }
};
