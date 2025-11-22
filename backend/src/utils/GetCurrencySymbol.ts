import getSymbolFromCurrency from "currency-symbol-map";
import { Country } from "country-state-city";

export const getCurrencySymbolByCountryName = (countryName: string): string => {
    if (!countryName) return "₹";

    // Find the country by name (case-insensitive)
    const countryData = Country.getAllCountries().find(
        (c) => c.name.toLowerCase() === countryName.toLowerCase()
    );

    if (countryData?.currency) {
        return getSymbolFromCurrency(countryData.currency) || "₹";
    }

    return "₹";
};
