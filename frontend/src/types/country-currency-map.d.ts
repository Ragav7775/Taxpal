declare module 'country-currency-map' {
    interface CountryCurrencyInfo {
        country: string;
        currency: string;
        locale: string;
        alpha2: string;
        alpha3: string;
    }

    interface CountryCurrencyMap {
        getCountry: (alpha2Code: string) => CountryCurrencyInfo | undefined;
        getCountryByAlpha2: (alpha2Code: string) => CountryCurrencyInfo | undefined;
        getCountryByAlpha3: (alpha3Code: string) => CountryCurrencyInfo | undefined;
        getAllCountries: () => CountryCurrencyInfo[];
    }

    const countryCurrencyMap: CountryCurrencyMap;
    export default countryCurrencyMap;
}
