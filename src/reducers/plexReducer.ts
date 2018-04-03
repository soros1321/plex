import { actionsEnums } from "../common/actionsEnums";

class PlexReducerState {
    agreeToTerms: boolean;

    constructor() {
        this.agreeToTerms = false;
    }
}

const handleAgreeToTerms = (state: PlexReducerState, action: any) => {
    return {
        ...state,
        agreeToTerms: action.payload,
    };
};

export const plexReducer = (state: PlexReducerState = new PlexReducerState(), action: any) => {
    switch (action.type) {
        case actionsEnums.AGREE_TO_TERMS:
            return handleAgreeToTerms(state, action);
        default:
            return state;
    }
};
