import { currentSearchResults } from "./application.js";

// FavoritesManager class to handle all favorites-related functionality
export class FavoritesManager {
  constructor() {
    this.heartButton = document.getElementById('heart-button');
    this.favoritesPanel = document.getElementById('favorites-panel');
    this.favoritesList = document.getElementById('favorites-list');
    this.noFavoritesMessage = document.getElementById('no-favorites');
    this.storageError = document.getElementById('storage-error');
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

    // Handle storage events
    window.addEventListener('storage', () => {
      this.renderFavorites();
      this.updateFavoritesCounter();
    });
  }

  renderFavorites() {
    try {
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

      this.storageError.style.display = 'none';
    } catch (error) {
      this.storageError.style.display = 'block';
      console.error('Error rendering favorites:', error);
    }
  }

  updateFavoritesCounter() {
    const favorites = this.getFavorites();
    this.counter.textContent = favorites.length;
    this.counter.style.display = favorites.length > 0 ? 'inline-block' : 'none';
  }

  getFavorites() {
    try {
      return JSON.parse(localStorage.getItem('favorites')) || [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  }

  addFavorite(countryName) {
    try {
      const favorites = this.getFavorites();
      if (!favorites.includes(countryName)) {
        favorites.push(countryName);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        this.showMessage(`${countryName} added to favorites!`);
        this.renderFavorites();
        this.updateFavoritesCounter();
      }
    } catch (error) {
      this.showMessage('Error adding to favorites', 'error');
      console.error('Error adding favorite:', error);
    }
  }

  removeFavorite(countryName) {
    try {
      const favorites = this.getFavorites();
      const index = favorites.indexOf(countryName);
      if (index !== -1) {
        favorites.splice(index, 1);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        this.showMessage(`${countryName} removed from favorites`);
        this.renderFavorites();
        this.updateFavoritesCounter();
        
        // Update country cards if they're currently displayed
        if (typeof renderCountries === 'function' && currentSearchResults) {
          renderCountries(currentSearchResults, favorites);
        }
      }
    } catch (error) {
      this.showMessage('Error removing from favorites', 'error');
      console.error('Error removing favorite:', error);
    }
  }

  showMessage(text, type = 'info') {
    const messageContainer = document.getElementById('message-container');
    const messageText = document.getElementById('message-text');
    
    messageText.textContent = text;
    messageContainer.className = `message ${type}`;
    messageContainer.style.display = 'block';

    setTimeout(() => {
      messageContainer.style.display = 'none';
    }, 3000);
  }
}

// Export function to create country cards
export function renderCountries(countries, favorites) {
  const container = document.getElementById('countries-container');
  container.innerHTML = '';

  countries.forEach(country => {
    const card = createCountryCard(country, favorites);
    container.appendChild(card);
  });
}

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

// Initialize favorites manager
const favoritesManager = new FavoritesManager();
export default favoritesManager;