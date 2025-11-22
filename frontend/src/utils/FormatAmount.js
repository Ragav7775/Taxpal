import { Country } from "country-state-city";
import countryCurrencyMap from "country-currency-map";


export function FormatAmount(amount, countryName) {
    if (typeof amount !== "number") return amount;

    if (!countryName) {
        // fallback to en-US locale if country not provided
        return amount.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    }

    // Find country ISO code from country name
    const countryData = Country.getAllCountries().find(
        (c) => c.name.toLowerCase() === countryName.toLowerCase()
    );

    const countryCode = countryData?.isoCode || "US"; // fallback to US

    // Get locale from country-currency-map
    const currencyInfo = countryCurrencyMap.getCountry(countryCode) || {
        locale: "en-US",
    };

    const { locale } = currencyInfo;

    // Format amount without currency
    return amount.toLocaleString(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}
