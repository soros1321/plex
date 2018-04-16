import { BigNumber } from "bignumber.js";

export class DebtOrderEntity {
    amortizationUnit: string;
    collateralAmount?: BigNumber;
    collateralized?: boolean;
    collateralTokenSymbol?: string;
    creditor?: string;
    debtor: string;
    description?: string;
    fillLoanShortUrl?: string;
    gracePeriodInDays?: BigNumber;
    interestRate: BigNumber;
    issuanceHash: string;
    json?: string;
    principalAmount: BigNumber;
    principalTokenSymbol: string;
    repaidAmount: BigNumber;
    repaymentSchedule: number[];
    status: string;
    termLength: BigNumber;
    termsContract: string;
    termsContractParameters: string;
    underwriter: string;
    underwriterRiskRating: BigNumber;

    public constructor() {
        this.amortizationUnit = "";
        this.creditor = "";
        this.debtor = "";
        this.description = "";
        this.fillLoanShortUrl = "";
        this.interestRate = new BigNumber(0);
        this.issuanceHash = "";
        this.json = "";
        this.principalAmount = new BigNumber(0);
        this.principalTokenSymbol = "";
        this.repaidAmount = new BigNumber(0);
        this.repaymentSchedule = [];
        this.status = "";
        this.termLength = new BigNumber(0);
        this.termsContract = "";
        this.termsContractParameters = "";
        this.underwriter = "";
        this.underwriterRiskRating = new BigNumber(0);
    }
}
