import * as React from "react";
import { Router, Route, IndexRoute, browserHistory } from "react-router";
import { syncHistoryWithStore } from "react-router-redux";
import { AppContainer } from "../AppContainer";
import {
    WelcomeContainer,
    FillLoanEmpty,
    DefaultContent,
    TestForm,
    RequestLoanFormContainer,
    RequestLoanSuccessContainer,
    DashboardContainer,
    FillLoanEnteredContainer,
    Terms,
    Privacy,
} from "../modules";
import { ParentContainer } from "../layouts";
import * as Web3 from "web3";
import { web3Connected, dharmaInstantiated, setAccounts } from "./actions";
import { setError } from "../components/Toast/actions";
const promisify = require("tiny-promisify");

// Import Dharma libraries
import Dharma from "@dharmaprotocol/dharma.js";

// Import Currently Deployed Dharma contracts (should only be done in test context -- otherwise)
import {
    DebtRegistry,
    DebtKernel,
    RepaymentRouter,
    TokenTransferProxy,
    TokenRegistry,
    DebtToken,
    SimpleInterestTermsContract,
} from "@dharmaprotocol/contracts";

interface Props {
    store: any;
}

class AppRouter extends React.Component<Props, {}> {
    constructor(props: Props) {
        super(props);
    }

    async componentDidMount() {
        const { dispatch } = this.props.store;
        let web3: any = null;
        if (typeof (window as any).web3 !== "undefined") {
            web3 = await new Web3((window as any).web3.currentProvider);
        } else {
            web3 = await new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
        }
        if (web3.isConnected()) {
            dispatch(web3Connected(web3));
            await this.instantiateDharma(web3);
        }
    }

    async instantiateDharma(web3: Web3) {
        const { dispatch } = this.props.store;
        const networkId = await promisify(web3.version.getNetwork)();
        const accounts = await promisify(web3.eth.getAccounts)();

        if (!accounts.length) {
            dispatch(setError("Unable to find active account on current Ethereum network"));
            return;
        }

        dispatch(setAccounts(accounts));

        if (
            !(
                networkId in DebtKernel.networks &&
                networkId in RepaymentRouter.networks &&
                networkId in TokenTransferProxy.networks &&
                networkId in TokenRegistry.networks &&
                networkId in DebtToken.networks &&
                networkId in DebtRegistry.networks &&
                networkId in SimpleInterestTermsContract.networks
            )
        ) {
            dispatch(setError("Unable to connect to the blockchain"));
            return;
        }
        const dharmaConfig = {
            kernelAddress: DebtKernel.networks[networkId].address,
            repaymentRouterAddress: RepaymentRouter.networks[networkId].address,
            tokenTransferProxyAddress: TokenTransferProxy.networks[networkId].address,
            tokenRegistryAddress: TokenRegistry.networks[networkId].address,
            debtTokenAddress: DebtToken.networks[networkId].address,
            debtRegistryAddress: DebtRegistry.networks[networkId].address,
            simpleInterestTermsContractAddress:
                SimpleInterestTermsContract.networks[networkId].address,
        };

        const dharma = new Dharma(web3.currentProvider, dharmaConfig);
        dispatch(dharmaInstantiated(dharma));
    }

    render() {
        const history = syncHistoryWithStore(browserHistory, this.props.store);
        return (
            <Router history={history}>
                <Route path="/" component={AppContainer}>
                    <IndexRoute component={WelcomeContainer} />
                    <Route path="/plex" component={DefaultContent} />
                    <Route path="/whitepaper" component={DefaultContent} />
                    <Route path="/blog" component={DefaultContent} />
                    <Route path="/github" component={DefaultContent} />
                    <Route path="/chat" component={DefaultContent} />
                    <Route path="/twitter" component={DefaultContent} />
                    <Route path="/dashboard" component={DashboardContainer} />
                    <Route path="/request" component={ParentContainer}>
                        <IndexRoute component={RequestLoanFormContainer} />
                        <Route
                            path="success/:issuanceHash"
                            component={RequestLoanSuccessContainer}
                        />
                    </Route>
                    <Route path="/fill" component={ParentContainer}>
                        <IndexRoute component={FillLoanEmpty} />
                        <Route path="loan" component={FillLoanEnteredContainer} />
                    </Route>
                    <Route path="/test" component={TestForm} />
                    <Route path="/terms" component={Terms} />
                    <Route path="/privacy" component={Privacy} />
                </Route>
            </Router>
        );
    }
}

export { AppRouter };
