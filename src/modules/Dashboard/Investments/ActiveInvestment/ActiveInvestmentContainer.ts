import { connect } from "react-redux";
import { ActiveInvestment } from "./ActiveInvestment";

const mapStateToProps = (state: any) => {
    return {};
};

const mapDispatchToProps = (dispatch: any) => {
    return {};
};

export const ActiveInvestmentContainer = connect(mapStateToProps, mapDispatchToProps)(
    ActiveInvestment,
);
