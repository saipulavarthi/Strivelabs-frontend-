const API_URL = "https://restcountries.com/v3.1";

export function fetchAllCountries() {
  return fetch(`${API_URL}/all`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch countries");
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error fetching all countries:", error);
      throw error;
    });
}

export function searchCountries(query) {
  return fetch(`${API_URL}/all`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch countries");
      }
      return response.json();
    })
    .then((countries) => {
      const filteredCountries = countries.filter((country) =>
        country.name.common.toLowerCase().includes(query.toLowerCase())
      );
      return filteredCountries;
    })
    .catch((error) => {
      console.error("Error searching countries by common name:", error);
      return [];
    });
}

export function fetchCountryDetails(countryName) {
  return fetch(`${API_URL}/name/${countryName}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch country details");
      }
      return response.json();
    })
    .then((countries) => countries[0]) // Return the first result
    .catch((error) => {
      console.error("Error fetching country details:", error);
      return null;
    });
}
