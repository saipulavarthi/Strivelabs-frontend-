import { fetchAllCountries, searchCountries, fetchCountryDetails } from "./api.js";
import favoritesManager, { renderCountries } from "./favorites.js";

let countries = [];
let displayedCount = 0;
export let currentSearchResults = [];

// Add event listeners
document.getElementById("search-bar").addEventListener("input", handleSearch);
document.getElementById("load-more").addEventListener("click", loadMore);
document.getElementById("region-filter").addEventListener("change", handleFilter);
document.getElementById("language-filter").addEventListener("change", handleFilter);
document.getElementById("countries-container").addEventListener("click", handleCountryClick);

// Save the state to localStorage
function saveState() {
  localStorage.setItem("displayedCount", displayedCount);
  localStorage.setItem("currentSearchResults", JSON.stringify(currentSearchResults));
}

// Restore the state from localStorage
function restoreState() {
  displayedCount = parseInt(localStorage.getItem("displayedCount")) || 10;
  currentSearchResults = JSON.parse(localStorage.getItem("currentSearchResults")) || [];
}

// Initialize the application
function init() {
  fetchAllCountries()
    .then((data) => {
      countries = data;
      restoreState();
      const favorites = favoritesManager.getFavorites();
      renderCountries(currentSearchResults, favorites);
    })
    .catch((error) => {
      console.error("Error initializing:", error);
      favoritesManager.showMessage("Error loading countries", "error");
    });
}

// Handle search input
function handleSearch(event) {
  const query = event.target.value.trim();
  const dropdown = document.getElementById("search-dropdown");

   // Get current filter values
   const region = document.getElementById("region-filter").dataset.value || "";
   const language = document.getElementById("language-filter").dataset.value || "";
 
  if (!query) {
    dropdown.style.display = "none";
    return;
  }

  searchCountries(query)
    .then((results) => {
      // Apply region and language filters
      let filteredResults = results;

      if (region) {
        filteredResults = filteredResults.filter(
          (country) => country.region.toLowerCase() === region.toLowerCase()
        );
      }

      if (language) {
        filteredResults = filteredResults.filter((country) =>
          Object.values(country.languages || {}).some((lang) =>
            lang.toLowerCase().includes(language.toLowerCase())
          )
        );
      }

      if (filteredResults.length === 0) {
        // No results matching the current filters
        dropdown.innerHTML = `<li class="dropdown-item no-results">No results in this filter</li>`;
      } else {
        const suggestions = filteredResults.slice(0, 5);
        dropdown.innerHTML = suggestions
          .map(
            (country) =>
              `<li class="dropdown-item" data-name="${country.name.common}">${country.name.common}</li>`
          )
          .join("");
        dropdown.innerHTML += `<li class="dropdown-item view-all" data-query="${query}">View All</li>`;
      }

      dropdown.style.display = "block";
    })
    .catch((error) => {
      console.error("Error in search:", error);
      favoritesManager.showMessage("Error searching countries", "error");
    });
}

// Handle search dropdown click
document.getElementById("search-dropdown").addEventListener("click", (event) => {
  const target = event.target;

  if (target.classList.contains("dropdown-item")) {
    const countryName = target.dataset.name;
    if (countryName) {
      const detailsUrl = `details.html?name=${encodeURIComponent(countryName)}`;
      window.open(detailsUrl, "_blank");
    } else if (target.classList.contains("view-all")) {
      const query = target.dataset.query;
      searchCountries(query)
        .then((results) => {
          currentSearchResults = results;
          const favorites = favoritesManager.getFavorites();
          renderCountries(currentSearchResults, favorites);
          document.getElementById("search-dropdown").style.display = "none";
        })
        .catch((error) => {
          console.error("Error viewing all results:", error);
          favoritesManager.showMessage("Error loading results", "error");
        });
    }
  }
});

function handleFilter() {
  const region = document.querySelector('#region-filter').dataset.value || '';
  const language = document.querySelector('#language-filter').dataset.value || '';
  const query = document.getElementById('search-bar').value.trim().toLowerCase();

  let filtered = [...countries];

  if (region) {
    filtered = filtered.filter((country) => country.region === region);
  }

  if (language) {
    filtered = filtered.filter((country) =>
      Object.values(country.languages || {}).some((lang) =>
        lang.toLowerCase().includes(language.toLowerCase())
      )
    );
  }

  if (query) {
    filtered = filtered.filter((country) =>
      country.name.common.toLowerCase().includes(query)
    );
  }

  currentSearchResults = filtered.slice(0, displayedCount);
  const favorites = favoritesManager.getFavorites();
  renderCountries(currentSearchResults, favorites);

  const loadMoreButton = document.getElementById('load-more');
  if (filtered.length === 0) {
    favoritesManager.showMessage("No countries match your filters");
    loadMoreButton.style.display = 'none';
  } else if (displayedCount >= filtered.length) {
    favoritesManager.showMessage("No more countries available to load");
    loadMoreButton.style.display = 'none';
  } else {
    loadMoreButton.style.display = 'block';
  }
  saveState();
}

// Load more countries
const loadIncrement = 10;
function loadMore() {
  displayedCount += loadIncrement;
  currentSearchResults = countries.slice(0, displayedCount);
  const favorites = favoritesManager.getFavorites();
  renderCountries(currentSearchResults, favorites);

  const loadMoreButton = document.getElementById("load-more");
  if (displayedCount >= countries.length) {
    loadMoreButton.style.display = "none";
    favoritesManager.showMessage("No more countries available to load");
  }
  saveState();
}

// Handle country card click or favorite button click
function handleCountryClick(event) {
  const target = event.target;

  if (target.classList.contains("favorite-btn")) {
    const countryName = target.dataset.name;
    const isFavorite = favoritesManager.getFavorites().includes(countryName);
    
    if (isFavorite) {
      favoritesManager.removeFavorite(countryName);
    } else {
      favoritesManager.addFavorite(countryName);
    }
    
    // Re-render countries to update favorite buttons
    renderCountries(currentSearchResults, favoritesManager.getFavorites());
  } else {
    const card = target.closest(".country-card");
    if (card) {
      const countryName = card.dataset.name;
      saveState();
      const detailsUrl = `details.html?name=${encodeURIComponent(countryName)}`;
      window.location.href = detailsUrl;
    }
  }
}

// Region dropdown toggle
document.querySelector('#region-filter .custom-dropdown-btn').addEventListener('click', () => {
  document.querySelector('#region-filter .custom-dropdown-list').classList.toggle('open');
});

// Language dropdown toggle
document.querySelector('#language-filter .custom-dropdown-btn').addEventListener('click', () => {
  document.querySelector('#language-filter .custom-dropdown-list').classList.toggle('open');
});

// Handle region selection
document.querySelectorAll('#region-filter .custom-dropdown-list li').forEach((item) => {
  item.addEventListener('click', (event) => {
    const regionDropdown = document.getElementById('region-filter');
    const selectedRegion = event.target.getAttribute('data-value');
    regionDropdown.querySelector('.custom-dropdown-btn').textContent = event.target.textContent;
    regionDropdown.dataset.value = selectedRegion;
    document.querySelector('#region-filter .custom-dropdown-list').classList.remove('open');
    handleFilter();
  });
});

// Handle language selection
document.querySelectorAll('#language-filter .custom-dropdown-list li').forEach((item) => {
  item.addEventListener('click', (event) => {
    const languageDropdown = document.getElementById('language-filter');
    const selectedLanguage = event.target.getAttribute('data-value');
    languageDropdown.querySelector('.custom-dropdown-btn').textContent = event.target.textContent;
    languageDropdown.dataset.value = selectedLanguage;
    document.querySelector('#language-filter .custom-dropdown-list').classList.remove('open');
    handleFilter();
  });
});

// Initialize on DOM content loaded
document.addEventListener("DOMContentLoaded", init);