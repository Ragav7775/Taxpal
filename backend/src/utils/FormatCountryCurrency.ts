import { Country } from "country-state-city";
import getSymbolFromCurrency from "currency-symbol-map";
import getCurrencyFromSymbol from "currency-symbol-map";// correct import

// The function now only formats based on the country’s locale
export function FormatAmountWithName(amount: number | string, countryName?: string): string {
    if (typeof amount !== "number") {
        // If it's not a number, convert it to a string directly
        return String(amount);
    }

    if (!countryName) {
        // Fallback to en-US locale if country not provided
        return amount.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    }

    // Find country ISO code from country name
    const countryData = Country.getAllCountries().find(
        (c) => c.name.toLowerCase() === countryName.toLowerCase()
    );

    if (!countryData) {
        // If country is not found, fallback to "US"
        return amount.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    }

    const countryCode = countryData.isoCode;

    // Safely get the locale for the given country code using `toLocaleString`
    const locale = new Intl.NumberFormat(countryCode).resolvedOptions().locale;

    // Format amount based on the country's locale
    return amount.toLocaleString(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};


export function FormatAmountWithSymbol(amount: number, symbol: string): string {
    // Step 1: Try to get currency code from symbol
    let currencyCode: string | undefined = getCurrencyFromSymbol(symbol);

    // Step 2: Fallback — search countries that use this symbol
    if (!currencyCode) {
        const country = Country.getAllCountries().find(
            c => getSymbolFromCurrency(c.currency) === symbol
        );
        if (country) currencyCode = country.currency;
    }

    // Step 3: Final fallback
    if (!currencyCode) currencyCode = "INR";

    // Step 4: Find a country for this currency code
    const country = Country.getAllCountries().find(c => c.currency === currencyCode);

    // Step 5: Determine locale (force English numerals)
    const locale = country ? `en-${country.isoCode}` : "en-IN";

    // Step 6: Format number
    const formattedAmount = new Intl.NumberFormat(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);

    return formattedAmount;
}