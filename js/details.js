import { fetchCountryDetails } from "./api.js";

function loadCountryDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const countryName = urlParams.get("name");


  // Handle back button click
document.getElementById("back-button").addEventListener("click", () => {
  window.location.href = "home.html"; // Replace 'index.html' with your home page file name
});


  if (!countryName) {
    alert("No country specified in the URL.");
    return;
  }

  fetchCountryDetails(countryName)
    .then((countryDetails) => {
      if (countryDetails) {
        renderCountryDetails(countryDetails);
      } else {
        console.error("Country details not found.");
      }
    })
    .catch((error) => {
      console.error("Error fetching country details:", error);
    });
}


function renderCountryDetails(country) {
  const detailsContainer = document.getElementById("country-details");


  detailsContainer.innerHTML = `
    <h1>${country.name.common}</h1>
    <p><strong>Region:</strong> ${country.region}</p>
    <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
    <p><strong>Languages:</strong> ${
      country.languages ? Object.values(country.languages).join(", ") : "N/A"
    }</p>
    <p><strong>Capital:</strong> ${
      country.capital && country.capital.length > 0 ? country.capital[0] : "N/A"
    }</p>
    <img src="${country.flags.svg}" alt="${country.name.common} flag" style="width: 200px; border: 1px solid #ccc;" />
  `;
}

window.addEventListener("DOMContentLoaded", loadCountryDetails);