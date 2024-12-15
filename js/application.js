import { fetchAllCountries, searchCountries, fetchCountryDetails } from "./api.js";
import { renderCountries, renderFavorites } from "./userinterface.js";

let countries = [];
let displayedCount = 0;
export let currentSearchResults = [];
export let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

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
  localStorage.setItem("favorites", JSON.stringify(favorites));
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
      renderCountries(currentSearchResults, favorites);
      renderFavorites(favorites);
    })
    .catch((error) => {
      console.error("Error initializing:", error);
    });
}

// Handle search input
function handleSearch(event) {
  const query = event.target.value.trim();
  const dropdown = document.getElementById("search-dropdown");

  if (!query) {
    dropdown.style.display = "none";
    return;
  }

  searchCountries(query)
    .then((results) => {
      const suggestions = results.slice(0, 5);
      dropdown.innerHTML = suggestions
        .map(
          (country) =>
            `<li class="dropdown-item" data-name="${country.name.common}">${country.name.common}</li>`
        )
        .join("");
      dropdown.innerHTML += `<li class="dropdown-item view-all" data-query="${query}">View All</li>`;
      dropdown.style.display = "block";
    })
    .catch((error) => console.error("Error in search:", error));
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
          renderCountries(currentSearchResults, favorites);
          document.getElementById("search-dropdown").style.display = "none";
        })
        .catch((error) => console.error("Error viewing all results:", error));
    }
  }
});

// Close dropdown when clicking outside
document.addEventListener("click", (event) => {
  const dropdown = document.getElementById("search-dropdown");
  if (!dropdown.contains(event.target) && event.target.id !== "search-bar") {
    dropdown.style.display = "none";
  }
});

function handleFilter() {
  const region = document.querySelector('#region-filter').dataset.value || '';
  const language = document.querySelector('#language-filter').dataset.value || '';
  const query = document.getElementById('search-bar').value.trim().toLowerCase();

  let filtered = [...countries]; // Use a fresh copy of countries

  // Filter by region
  if (region) {
    filtered = filtered.filter((country) => country.region === region);
  }

  // Filter by language
  if (language) {
    filtered = filtered.filter((country) =>
      Object.values(country.languages || {}).some((lang) =>
        lang.toLowerCase().includes(language.toLowerCase())
      )
    );
  }

  // Filter by search query
  if (query) {
    filtered = filtered.filter((country) =>
      country.name.common.toLowerCase().includes(query)
    );
  }

  // Update search results and render
  currentSearchResults = filtered.slice(0, displayedCount);
  renderCountries(currentSearchResults, favorites);
  saveState();
}

// Load more countries
function loadMore() {
  displayedCount += 10;
  currentSearchResults = countries.slice(0, displayedCount);
  renderCountries(currentSearchResults, favorites);
  saveState();
}

// Handle country card click or favorite button click
function handleCountryClick(event) {
  const target = event.target;

  if (target.classList.contains("favorite-btn")) {
    const countryName = target.dataset.name;
    toggleFavorite(countryName);
    
    // Change heart icon based on favorite status
    target.textContent = favorites.includes(countryName) ? "❤️" : "🤍";
    
    // Show popup message
    const messageText = favorites.includes(countryName)
      ? `${countryName} added to favorites!`
      : `${countryName} removed from favorites!`;

    showMessage(messageText);  // Display the message
    
    renderFavorites(favorites);
  } else {
    const card = target.closest(".country-card");
    if (card) {
      const countryName = card.dataset.name;
      saveState(); // Save any necessary state before navigating
      const detailsUrl = `details.html?name=${encodeURIComponent(countryName)}`;
      window.location.href = detailsUrl; // Navigate to details page in the same tab
    }
  }
}

// Show floating message
function showMessage(message) {
  const messageContainer = document.getElementById('message-container');
  const messageText = document.getElementById('message-text');
  
  messageText.textContent = message;
  messageContainer.classList.add('show');
  
  // Hide the message after 3 seconds
  setTimeout(() => {
    messageContainer.classList.remove('show');
  }, 3000);
}

// Close message manually
function closeMessage() {
  const messageContainer = document.getElementById('message-container');
  messageContainer.classList.remove('show');
}


// Toggle favorite country
function toggleFavorite(countryName) {
  const index = favorites.indexOf(countryName);
  if (index > -1) {
    favorites.splice(index, 1);
  } else if (favorites.length < 5) {
    favorites.push(countryName);
  } else {
    alert("You can only add up to 5 favorites!");
    return;
  }
  saveState();
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
    regionDropdown.dataset.value = selectedRegion; // Store selected value
    document.querySelector('#region-filter .custom-dropdown-list').classList.remove('open');
    handleFilter(); // Apply filter
  });
});

// Handle language selection
document.querySelectorAll('#language-filter .custom-dropdown-list li').forEach((item) => {
  item.addEventListener('click', (event) => {
    const languageDropdown = document.getElementById('language-filter');
    const selectedLanguage = event.target.getAttribute('data-value');
    languageDropdown.querySelector('.custom-dropdown-btn').textContent = event.target.textContent;
    languageDropdown.dataset.value = selectedLanguage; // Store selected value
    document.querySelector('#language-filter .custom-dropdown-list').classList.remove('open');
    handleFilter(); // Apply filter
  });
});

// Initialize on DOM content loaded
document.addEventListener("DOMContentLoaded", init);
console.log("Current favorites:", JSON.parse(localStorage.getItem("favorites")));
