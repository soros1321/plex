import { combineReducers } from "redux";
import { web3Reducer } from "./web3Reducer";
import { dharmaReducer } from "./dharmaReducer";
import { toastReducer } from "./toastReducer";
import { debtOrderReducer } from "./debtOrderReducer";
import { tokenReducer } from "./tokenReducer";
import { plexReducer } from "./plexReducer";
import { investmentReducer } from "./investmentReducer";
import { routerReducer } from "react-router-redux";

export const reducers = combineReducers({
    web3Reducer,
    dharmaReducer,
    debtOrderReducer,
    toastReducer,
    tokenReducer,
    plexReducer,
    investmentReducer,
    routing: routerReducer,
});
