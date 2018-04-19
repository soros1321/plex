import * as React from "react";
import styled from "styled-components";
import { Col } from "reactstrap";
import { StyledLink, StyledButton, A } from "../../../../components";
import { Link } from "react-router";

interface Props {
    className?: string;
}

export const Wrapper = styled.div`
    margin-bottom: 20px;
    background-color: #ffffff;
    box-shadow: 0 12px 24px 0 rgba(0, 0, 0, 0.12);
    cursor: pointer;
`;

class UglyImageContainer extends React.Component<Props, {}> {
    render() {
        return (
            <Col className={this.props.className} xs="3" sm="1" md="1">
                {this.props.children}
            </Col>
        );
    }
}

export const ImageContainer = styled(UglyImageContainer)`
    padding: 15px 0 15px 15px !important;

    @media only screen and (max-width: 823px) {
        padding: 10px 0 10px 10px !important;
    }
    @media only screen and (max-width: 568px) {
        padding: 10px 0 10px 10px !important;
    }
`;

export const IdenticonImage = styled.img`
    width: 60px;
    height: 60px;

    @media only screen and (max-width: 823px) {
        width: 40px;
        height: 40px;
    }
    @media only screen and (max-width: 568px) {
        width: 80px;
        height: 80px;
    }
    @media only screen and (max-width: 480px) {
        width: 60px;
        height: 60px;
    }
`;

class UglyDetailContainer extends React.Component<Props, {}> {
    render() {
        return (
            <Col className={this.props.className} xs="9" sm="5" md="5">
                {this.props.children}
            </Col>
        );
    }
}

export const DetailContainer = styled(UglyDetailContainer)`
    padding: 15px !important;

    @media only screen and (max-width: 823px) {
        padding: 10px !important;
    }
    @media only screen and (max-width: 568px) {
        padding: 10px !important;
    }
`;

export const Amount = styled.div`
    color: #002326;
    font-family: DIN-Bold;
    font-size: 17px;
    line-height: 25px;

    @media only screen and (max-width: 823px) {
        font-size: 14px;
        line-height: 22px;
    }
    @media only screen and (max-width: 568px) {
        font-size: 14px;
        line-height: 22px;
    }
`;

export const Url = styled.div`
    color: #002326;
    font-size: 15px;
    line-height: 25px;

    @media only screen and (max-width: 823px) {
        font-size: 10px;
        line-height: 18px;
    }
    @media only screen and (max-width: 568px) {
        font-size: 10px;
        line-height: 18px;
    }
`;

export const StatusPending = styled.div`
    display: inline-block;
    color: #ffffff;
    font-size: 12px;
    letter-spacing: 1px;
    line-height: 16px;
    border-radius: 12.5px;
    background-color: #e93d59;
    text-transform: uppercase;
    padding: 2px 10px;
    margin-right: 10px;

    @media only screen and (max-width: 823px) {
        font-size: 8px;
        line-height: 12px;
    }
    @media only screen and (max-width: 568px) {
        font-size: 8px;
        line-height: 12px;
    }
`;

export const Terms = styled.div`
    display: inline-block;
    font-family: DIN-Bold;
    font-size: 13px;
    line-height: 16px;
    text-transform: uppercase;

    @media only screen and (max-width: 823px) {
        font-size: 8px;
        line-height: 16px;
    }
    @media only screen and (max-width: 568px) {
        font-size: 8px;
        line-height: 16px;
    }
`;

class HalfCol extends React.Component<Props, {}> {
    render() {
        return (
            <Col className={this.props.className} xs="12" sm="6" md="6">
                {this.props.children}
            </Col>
        );
    }
}
export { HalfCol };

export const PendingActionContainer = styled(HalfCol)`
    padding: 15px 30px !important;
    color: #ffffff;
    background-color: #ffffff;
    display: block;

    &.active {
        display: block;
    }

    @media only screen and (max-width: 823px) {
        padding: 10px !important;
    }
    @media only screen and (max-width: 568px) {
        float: none;
        padding-top: 0px !important;
        text-align: center;
    }
`;

export const Drawer = styled.div`
    padding: 20px;
    background-color: #f5f5f5;

    @media only screen and (max-width: 823px) {
        padding: 12px;
    }
    @media only screen and (max-width: 568px) {
        padding: 10px;
    }
`;

export const InfoItem = styled.div`
    @media only screen and (max-width: 823px) {
        margin-bottom: 5px;
    }
    @media only screen and (max-width: 568px) {
        margin-bottom: 5px;
    }
`;

export const InfoItemTitle = styled.div`
    text-transform: uppercase;
    font-family: DIN-Bold;
    opacity: 0.5;
    color: #002326;
    font-size: 13px;
    line-height: 20px;

    @media only screen and (max-width: 823px) {
        font-size: 12px;
        line-height: 20px;
    }
    @media only screen and (max-width: 568px) {
        font-size: 10px;
        line-height: 18px;
    }
`;

export const InfoItemContent = styled.div`
    margin-top: 5px;
    font-family: DIN-Bold;
    opacity: 1;
    color: #002326;
    font-size: 13px;
    line-height: 20px;
    word-wrap: break-word;

    @media only screen and (max-width: 823px) {
        margin-top: 2px;
        font-size: 10px;
        line-height: 18px;
    }
    @media only screen and (max-width: 568px) {
        margin-top: 2px;
        font-size: 10px;
        line-height: 18px;
    }
`;

export const DetailLink = StyledLink.extend`
    font-family: DIN;
    &:hover {
        font-family: DIN;
    }
`;

export const CancelButton = StyledButton.extend`
    background-color: #e93d59 !important;
    font-size: 13px !important;
    border-color: #e93d59 !important;
    min-width: auto !important;
    padding: 0px 15px !important;
    float: right;
    line-height: 36px !important;

    @media only screen and (max-width: 823px) {
        margin-top: 5px;
        padding: 4px 14px !important;
        font-size: 10px !important;
        line-height: 14px !important;
        min-width: auto !important;
    }
    @media only screen and (max-width: 736px) {
        margin-top: 5px;
        padding: 2px 12px !important;
        font-size: 8px !important;
        line-height: 12px !important;
        min-width: auto !important;
    }
    @media only screen and (max-width: 568px) {
        margin-top: 5px;
        padding: 4px 14px !important;
        font-size: 10px !important;
        line-height: 14px !important;
        min-width: auto !important;
        font-size: 10px !important;
        width: 100%;
    }
    @media only screen and (max-width: 480px) {
        padding: 3px 12px !important;
        font-size: 8px !important;
        line-height: 12px !important;
    }
`;

export const ShareButton = styled(Link)`
    background-color: #e93d59 !important;
    font-size: 13px !important;
    border-color: #e93d59 !important;
    min-width: auto !important;
    padding: 0px 15px !important;
    float: right;
    line-height: 38px !important;
    margin-right: 10px;
    color: #ffffff !important;
    font-family: DIN;
    border-radius: 0 !important;
    text-transform: uppercase;
    text-align: center;

    &:hover {
        text-decoration: none;
    }

    @media only screen and (max-width: 823px) {
        margin-top: 5px;
        padding: 5px 14px !important;
        font-size: 10px !important;
        line-height: 14px !important;
        min-width: auto !important;
    }
    @media only screen and (max-width: 736px) {
        margin-top: 5px;
        padding: 3px 12px !important;
        font-size: 8px !important;
        line-height: 12px !important;
        min-width: auto !important;
    }
    @media only screen and (max-width: 568px) {
        padding: 3px 12px !important;
        font-size: 10px !important;
        line-height: 12px !important;
        margin-right: 0px;
        margin-bottom: 5px;
        width: 100%;
    }
`;

export const BitlyLink = A.extend``;
