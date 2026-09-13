const CURRENCY_SUBUNIT_FACTOR = {
    INR: 100,
};

const toSubunit = ({ amount, currency }) => {
    const factor = CURRENCY_SUBUNIT_FACTOR[currency];

    if (!factor) {
        throw new Error(`Unsupported currency: ${currency}`);
    }

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount < 0) {
        throw new Error("Invalid monetary amount.");
    }

    const subunitAmount = Math.round(numericAmount * factor);

    if (subunitAmount < 0) {
        throw new Error("Invalid monetary amount.");
    }

    return subunitAmount;
};

export { toSubunit };
