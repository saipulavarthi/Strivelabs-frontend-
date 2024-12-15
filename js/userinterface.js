import { currentSearchResults, favorites } from "./application.js";

// Render the list of countries
export function renderCountries(countries, favorites) {
  const container = document.getElementById("countries-container");

  // Clear the container first
  container.innerHTML = "";

  // Add each country's card to the container
  countries.forEach((country) => {
    const countryCard = createCountryCard(country, favorites);
    container.innerHTML += countryCard;
  });
}

// Create a single country card
function createCountryCard(country, favorites) {
  const isFavorite = favorites.includes(country.name.common);
  const favoriteIcon = isFavorite ? "❤️" : "🤍";

  return `
    <div class="country-card" data-name="${country.name.common}">
      <div class="country-image">
        <img src="${country.flags.png}" alt="Flag of ${country.name.common}" />
      </div>
      <h2>${country.name.common}</h2>
      <button class="favorite-btn" data-name="${country.name.common}">
        ${favoriteIcon}
      </button>
    </div>
  `;
}

// Add event listener for the Favorites button
document.getElementById("heart-button").addEventListener("click", () => {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const container = document.getElementById("favorites-container");

  // Toggle visibility of the favorites container
  if (container.style.display === "block") {
    container.style.display = "none"; // Hide the container if it's already visible
  } else {
    if (favorites.length === 0) {
      container.innerHTML = "<p>No favorite countries to display.</p>";
    } else {
      renderFavorites(favorites);
    }
    container.style.display = "block"; // Show the container
  }

  // Optionally clear the main countries container or leave as is
  document.getElementById("countries-container").innerHTML = ""; // Clear the main container
});

// Render the list of favorite countries
export function renderFavorites(favorites) {
  const container = document.getElementById("favorites-container");

  // Show the container if favorites exist
  container.style.display = "block";
  container.innerHTML = ""; // Clear previous content

  favorites.forEach((countryName) => {
    const favoriteCard = createFavoriteCard(countryName);
    container.innerHTML += favoriteCard;
  });

  // Add click event listeners to "Remove" buttons
  const removeButtons = container.querySelectorAll(".remove-favorite-btn");
  removeButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const countryName = event.target.dataset.name;
      removeFavorite(countryName);
    });
  });
}

// Create a single favorite country card
function createFavoriteCard(countryName) {
  return `
    <div class="favorite-country">
      <h3>${countryName}</h3>
      <button class="remove-favorite-btn" data-name="${countryName}">
        Remove
      </button>
    </div>
  `;
}

// Remove a country from favorites
function removeFavorite(countryName) {
  const index = favorites.indexOf(countryName);
  if (index > -1) {
    favorites.splice(index, 1); // Remove the country from the list
  }

  // Update localStorage and re-render the favorites
  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderFavorites(favorites);

  // Optionally re-render all countries to update favorite buttons
  renderCountries(currentSearchResults, favorites);
}



class FavoritesManager {
  constructor() {
      this.heartButton = document.getElementById('heart-button');
      this.overlay = document.getElementById('favorites-overlay');
      this.closeButton = document.getElementById('favorites-close');
      this.favoritesList = document.getElementById('favorites-list');
      this.noFavoritesMessage = document.getElementById('no-favorites');
      this.counter = this.heartButton.querySelector('.favorites-counter'); // Get the counter

      this.initEventListeners();
      this.renderFavorites();
      this.updateFavoritesCounter(); // Update the counter initially
  }
  
  initEventListeners() {
      // Open overlay
      this.heartButton.addEventListener('click', () => {
          this.renderFavorites();
          this.overlay.style.display = 'flex';
      });
      
      // Close overlay
      this.closeButton.addEventListener('click', () => {
          this.overlay.style.display = 'none';
      });
      
      // Close overlay when clicking outside
      this.overlay.addEventListener('click', (event) => {
          if (event.target === this.overlay) {
              this.overlay.style.display = 'none';
          }
      });
  }
  
  renderFavorites() {
      // Get favorites from localStorage
      const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
      console.log("Current favorites:", favorites);
      
      // Clear existing list
      this.favoritesList.innerHTML = '';
      
      // Populate favorites
      favorites.forEach(item => {
          const li = document.createElement('li');
          
          const span = document.createElement('span');
          span.textContent = item;
          
          li.appendChild(span);
          this.favoritesList.appendChild(li);
      });
      
      // Toggle no favorites message
      this.noFavoritesMessage.style.display = 
          favorites.length === 0 ? 'block' : 'none';
      
      // Update the counter after rendering favorites
      this.updateFavoritesCounter();
  }

  updateFavoritesCounter() {
      // Get favorites from localStorage
      const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
      
      // Update the count on the heart button's badge
      const favoriteCount = favorites.length;

      // Show the counter if there are favorites, otherwise hide it
      if (favoriteCount > 0) {
          this.counter.style.display = 'inline-block';
          this.counter.textContent = favoriteCount;
      } else {
          this.counter.style.display = 'none';
      }
  }

  addFavorite(countryName) {
      // Get favorites from localStorage
      const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
      
      // Check if the country is already in favorites
      if (!favorites.includes(countryName)) {
          favorites.push(countryName);
          localStorage.setItem('favorites', JSON.stringify(favorites));
      }
      
      // Re-render the favorites and update the counter
      this.renderFavorites();
  }

  removeFavorite(countryName) {
      // Get favorites from localStorage
      const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
      
      // Remove the country from favorites
      const index = favorites.indexOf(countryName);
      if (index !== -1) {
          favorites.splice(index, 1);
          localStorage.setItem('favorites', JSON.stringify(favorites));
      }
      
      // Re-render the favorites and update the counter
      this.renderFavorites();
  }
}

// Initialize Favorites Manager
const favoritesManager = new FavoritesManager();

// Example usage of adding/removing a favorite
// favoritesManager.addFavorite("Canada"); // Add a favorite
// favoritesManager.removeFavorite("Canada"); // Remove a favorite
