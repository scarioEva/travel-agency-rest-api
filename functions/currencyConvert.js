const getCurrencySymbol = (currencyCode, locale = "en-US") => {
  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
    });
    const exampleAmount = 0;
    const currencyString = formatter.format(exampleAmount);
    const symbol = currencyString.replace(/[0-9\s.,]+/g, "").trim();
    console.log(symbol);
    return symbol;
  } catch (error) {
    console.error("Error occurred while getting currency symbol:", error);
    return currencyCode;
  }
};

module.exports = { getCurrencySymbol };
