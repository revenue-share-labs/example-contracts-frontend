import { motion } from 'framer-motion';
import { commonAppearVariants, commonParentAppearVariants } from '../../services/common';
import { formatAddress, formatMoney } from '../../utils';
import { RecipientChangedType, WaterfallRecipientChangedType } from '../ValveManageTable';
import { ContractSettings } from '../../pages/factory/new';
import { blockchainData } from '../../constants';
import { Blockchain } from '../../types';

export default function ContractCreationSummary({
    settings,
    recipients,
    waterfallRecipients,
}: {
    settings: ContractSettings;
    recipients: RecipientChangedType[];
    waterfallRecipients: WaterfallRecipientChangedType[];
}) {
    return (
        <motion.div variants={commonParentAppearVariants} initial={'closed'} animate="open" className="factory__summary">
            <motion.div variants={commonAppearVariants} className="factory__summary__simple-value factory__section__cell">
                <span>Contract name</span>
                <span>{settings.name}</span>
            </motion.div>
            <div className="separator" />
            {settings.useUsd && (
                <>
                    <motion.div variants={commonAppearVariants} className="factory__summary__simple-value factory__section__cell">
                        <span>Price feed ETH/USD</span>
                        <span>{formatAddress(settings.ethUsdPriceFeed)}</span>
                    </motion.div>
                    <div className="separator" />
                </>
            )}
            <motion.div variants={commonAppearVariants} className="factory__summary__simple-value factory__section__cell">
                <span>Contract type</span>
                <span>{settings.waterfall ? 'Waterfall' : settings.prepayment ? 'Split with investor' : 'Valve'}</span>
            </motion.div>
            <div className="separator" />

            {settings.prepayment && (
                <>
                    <motion.div
                        style={{ paddingBottom: 0 }}
                        variants={commonAppearVariants}
                        className="factory__summary__simple-value factory__section__cell"
                    >
                        <span>Prepayment settings:</span>
                    </motion.div>

                    <motion.div variants={commonAppearVariants} className="factory__summary__inner-grid">
                        <div className="factory__summary__inner-grid__cell">
                            <span>Investor address</span>
                            <span>{formatAddress(settings.prepayment.investor)}</span>
                        </div>
                        <div className="factory__summary__inner-grid__cell">
                            <span>Invested amount ({settings.useUsd ? 'USD' : blockchainData[settings.blockchain].currencyName})</span>
                            <span>{formatMoney(settings.prepayment.investedAmount, settings.useUsd ? 'USD' : settings.blockchain)}</span>
                        </div>
                        <div className="factory__summary__inner-grid__cell">
                            <span>Interest</span>
                            <span>{settings.prepayment.interestRate.toFixed(2)}%</span>
                        </div>
                        <div className="factory__summary__inner-grid__cell">
                            <span>Residueal interest</span>
                            <span>{settings.prepayment.residualInterestRate.toFixed(2)}%</span>
                        </div>
                    </motion.div>
                </>
            )}
            <motion.div
                style={{ paddingBottom: 0 }}
                variants={commonAppearVariants}
                className="factory__summary__simple-value factory__section__cell"
            >
                <span>Funds distribution:</span>
            </motion.div>
            {settings.waterfall ? (
                <WaterfallRecipients blockchain={settings.blockchain} useUsd={settings.useUsd} recipients={waterfallRecipients} />
            ) : (
                <Recipients recipients={recipients} />
            )}
        </motion.div>
    );
}

function Recipients({ recipients }: { recipients: RecipientChangedType[] }) {
    return (
        <motion.div variants={commonParentAppearVariants} initial={'closed'} animate="open" className="factory__summary__recipients">
            {recipients.map((recipient, index) => (
                <motion.div variants={commonAppearVariants} key={index} className="factory__summary__recipient">
                    <div className="factory__summary__recipient__cell">
                        <span>Name</span>
                        <span>{recipient.name}</span>
                    </div>
                    <div className="factory__summary__recipient__cell">
                        <span>Address</span>
                        <span>{formatAddress(recipient.address)}</span>
                    </div>
                    <div className="factory__summary__recipient__cell">
                        <span>Percentage</span>
                        <span>{recipient.percentage.toFixed(2)}%</span>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}

function WaterfallRecipients({
    recipients,
    useUsd,
    blockchain,
}: {
    recipients: WaterfallRecipientChangedType[];
    useUsd: boolean;
    blockchain: Blockchain;
}) {
    return (
        <motion.div variants={commonParentAppearVariants} initial={'closed'} animate="open" className="factory__summary__recipients">
            {recipients.map((recipient, index) => (
                <motion.div variants={commonAppearVariants} key={index} className="factory__summary__recipient--waterfall">
                    <div className="factory__summary__recipient__cell">
                        <span>Priority</span>
                        <span>{recipient.priority}</span>
                    </div>
                    <div className="factory__summary__recipient__cell">
                        <span>Name</span>
                        <span>{recipient.name}</span>
                    </div>
                    <div className="factory__summary__recipient__cell">
                        <span>Address</span>
                        <span>{formatAddress(recipient.address)}</span>
                    </div>
                    <div className="factory__summary__recipient__cell">
                        <span>Max Cap</span>
                        <span>{formatMoney(recipient.maxCap, useUsd ? 'USD' : blockchain)}</span>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}
