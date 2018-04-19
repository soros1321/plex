import { connect } from "react-redux";
import { OpenOrdersMetrics } from "./OpenOrdersMetrics";

const mapStateToProps = (state: any) => {
    return {
        tokens: state.tokenReducer.tokens,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {};
};

export const OpenOrdersMetricsContainer = connect(mapStateToProps, mapDispatchToProps)(
    OpenOrdersMetrics,
);
