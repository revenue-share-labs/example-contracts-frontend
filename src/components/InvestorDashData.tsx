import BigNumber from 'bignumber.js';
import { PrepaymentDashboardData } from '../services/valveAndPrepayment';
import { formatMoney, formatPermille, formatUsd } from '../utils';
import AddressBox from './AddressBox';
import { Blockchain } from '../types';

export default function InvestorDashData({
    data: { interestRate, investedAmount, currency, residualInterestRate, left, paidOut, investorToReceiveTotal, investorAddress },
    blockchain,
}: {
    data: Pick<
        PrepaymentDashboardData,
        | 'interestRate'
        | 'currency'
        | 'investedAmount'
        | 'left'
        | 'paidOut'
        | 'residualInterestRate'
        | 'investorToReceiveTotal'
        | 'investorAddress'
    >;
    blockchain: Blockchain;
}) {
    const paidOutPercentage = paidOut.div(investorToReceiveTotal).times(100).decimalPlaces(2);

    const curr = currency === 'USD' ? 'USD' : blockchain;

    return (
        <div className="investor-dash-data">
            <div className="investor-dash-data__row1">
                <div className="investor-dash-data__row1__left">
                    <div className="investor-dash-data__progress-bar">
                        <div
                            className="investor-dash-data__progress-bar__inner"
                            style={{ width: `${paidOutPercentage.toString()}%` }}
                        ></div>
                    </div>
                    <span>{paidOutPercentage.toString()}%</span>
                    {/* <span className="investor-dash-data__row1__name">{}</span> */}
                </div>
                <AddressBox blockchain={blockchain} hexString={investorAddress} type="address" />
                {/* <span>0x3c03b473c5c9C0055E6863D6fE148Eb3850482De</span> */}
            </div>
            <div className="investor-dash-data__row2">
                <div>
                    <span>Prepaid:</span>
                    <span>{formatMoney(investedAmount, curr)}</span>
                </div>
                <div>
                    <span>Prepaid + interest:</span>
                    <span>{formatMoney(investorToReceiveTotal, curr)}</span>
                </div>
                <div>
                    <span>Paid out:</span>
                    <span>{formatMoney(paidOut, curr)}</span>
                </div>
                <div>
                    <span>Left:</span>
                    <span>{formatMoney(left, curr)}</span>
                </div>
                <div>
                    <span>Basic interest:</span>
                    <span>{formatPermille(interestRate.times(100))}</span>
                </div>
                <div>
                    <span>Residual interest:</span>
                    <span>{formatPermille(residualInterestRate.times(100))}</span>
                </div>
            </div>
        </div>
    );
}
