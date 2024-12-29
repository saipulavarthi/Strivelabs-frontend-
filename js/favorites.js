// Manage the state of favorites
export let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// Create a single country card
function createCountryCard(country, favorites) {
  const isFavorite = favorites.includes(country.name.common);
  
  const card = document.createElement('div');
  card.className = 'country-card';
  card.dataset.name = country.name.common;

  card.innerHTML = `
    <div class="country-image">
      <img src="${country.flags.png}" alt="Flag of ${country.name.common}" />
    </div>
    <h2>${country.name.common}</h2>
    <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-name="${country.name.common}">
      ${isFavorite ? '❤️' : '🤍'}
    </button>
  `;

  return card;
}

// Render the list of countries
export function renderCountries(countries, favorites) {
  const container = document.getElementById("countries-container");
  container.innerHTML = "";

  countries.forEach((country) => {
    const card = createCountryCard(country, favorites);
    container.appendChild(card);
  });
}

class FavoritesManager {
  constructor() {
    this.heartButton = document.getElementById('heart-button');
    this.favoritesPanel = document.getElementById('favorites-panel');
    this.favoritesList = document.getElementById('favorites-list');
    this.noFavoritesMessage = document.getElementById('no-favorites');
    this.counter = document.getElementById('favorites-counter');
    
    this.initEventListeners();
    this.renderFavorites();
    this.updateFavoritesCounter();
  }

  initEventListeners() {
    // Toggle favorites panel
    this.heartButton.addEventListener('click', () => {
      this.favoritesPanel.classList.toggle('show');
      this.renderFavorites();
    });

    // Close panel when clicking outside
    document.addEventListener('click', (event) => {
      if (!this.favoritesPanel.contains(event.target) && 
          event.target !== this.heartButton) {
        this.favoritesPanel.classList.remove('show');
      }
    });
  }

  renderFavorites() {
    const favorites = this.getFavorites();
    this.favoritesList.innerHTML = '';
    
    if (favorites.length === 0) {
      this.noFavoritesMessage.style.display = 'block';
      return;
    }

    this.noFavoritesMessage.style.display = 'none';
    
    favorites.forEach(countryName => {
      const li = document.createElement('li');
      li.className = 'favorite-item';
      
      const nameSpan = document.createElement('span');
      nameSpan.textContent = countryName;
      
      const removeButton = document.createElement('button');
      removeButton.className = 'remove-favorite';
      removeButton.textContent = '×';
      removeButton.addEventListener('click', () => this.removeFavorite(countryName));
      
      li.appendChild(nameSpan);
      li.appendChild(removeButton);
      this.favoritesList.appendChild(li);
    });
  }

  updateFavoritesCounter() {
    const favorites = this.getFavorites();
    this.counter.textContent = favorites.length;
    this.counter.style.display = favorites.length > 0 ? 'inline-block' : 'none';
  }

  getFavorites() {
    return JSON.parse(localStorage.getItem('favorites')) || [];
  }

  addFavorite(countryName) {
    const favorites = this.getFavorites();
    if (!favorites.includes(countryName)) {
      if (favorites.length >= 5) {
        this.showMessage("You can only add up to 5 favorites!");
        return false;
      }
      favorites.push(countryName);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      this.showMessage(`${countryName} added to favorites!`);
      this.renderFavorites();
      this.updateFavoritesCounter();
      return true;
    }
    return false;
  }

  removeFavorite(countryName) {
    const favorites = this.getFavorites();
    const index = favorites.indexOf(countryName);
    if (index !== -1) {
      favorites.splice(index, 1);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      this.showMessage(`${countryName} removed from favorites`);
      this.renderFavorites();
      this.updateFavoritesCounter();
      return true;
    }
    return false;
  }

  showMessage(text) {
    const messageContainer = document.getElementById('message-container');
    const messageText = document.getElementById('message-text');
    
    messageText.textContent = text;
    messageContainer.style.display = 'block';
    messageContainer.classList.add('show');

    setTimeout(() => {
      messageContainer.classList.remove('show');
      messageContainer.style.display = 'none';
    }, 3000);
  }
}

// Initialize favorites manager
const favoritesManager = new FavoritesManager();
export default favoritesManager;