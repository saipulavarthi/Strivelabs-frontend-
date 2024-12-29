# Country Explorer

**Country Explorer** is a web application that allows users to explore information about countries worldwide. It offers features like keyword search, filtering by region or language, a favorites section, and detailed country views.

## Setup Instructions

### Clone the Repository:
First, clone the repository from GitHub:

```bash
git clone https://github.com/saipulavarthi/Strivelabs-frontend-
```

### Navigate to the Project Folder:
Change to the project directory:

```bash
cd Country
```

### Open the Project in VS Code:
Open the folder in Visual Studio Code:

```bash
code .
```

### Run with Live Server:
Make sure the Live Server extension is installed in VS Code.  
Right-click the `home.html` file in the file explorer and select **Open with Live Server**.  
The app will open in your default browser.

---

## Design Decisions

### Filter Logic:
The app supports combined filtering by region and language for more refined results.

### Search and Filter Integration:
Users can search for countries by name, with real-time updates. Filters work alongside the search to narrow down results.

### Favorite System:
Users can mark countries as favorites, toggled via heart icons (❤️/🤍). Favorites are saved in localStorage and displayed in an overlay for easy management.

---

## Updates from the Feedback

- As you mentioned, I have modified the README file for better readability.
- The issue regarding the pre-favorites (3) has been resolved. Those were not set by default, and I forgot to unfavorite those countries while committing the application.
- The initial load problem has been addressed. Since the app is not hosted on any website, it requires a force reload to work as expected.
- The flags display issue has been resolved by adjusting the count, as mentioned in the feedback.
- I have placed the favorite icon in the list view, making it easier for the viewer to see which countries are already marked as favorites without entering the details view.
- The flags appeared cut-off due to a CSS mistake. This issue has been fixed.
- The search leading to Taiwan due to a keyword mistake has also been resolved.
- The card stretching across the row has been corrected by adjusting the CSS.
- As mentioned, the "Load More" button has been removed when there are no more results to appear. Additionally, a message has been added for better visibility.
- The favorites overlay has been adjusted to a side panel for improved usability.
- Filtering and search functionalities have been adjusted and modified accordingly.

---

## Manual Testing

Open the app in a modern browser (Chrome, Firefox, or Safari). Verify the following:

- **Search:** Search functionality dynamically updates results based on input.
- **Filters:** Combined filters for region and language accurately refine the displayed countries.
- **Favorites:** Adding/removing countries as favorites updates the heart icon and persists in localStorage.
- **Navigation:** Clicking on a country card renders detailed information in the same tab.
- **Load More:** The "Load More" button fetches and displays additional countries seamlessly.

---

## Features

### Search:
- Type in the search bar to find countries by name.
- The search dynamically displays suggestions. The "View All" option displays all matches as cards.
- Filters can be applied alongside the search to refine results further.

### Filters:
- Filter countries by region (e.g., Africa, Europe) and language (e.g., English, French).
- Both filters can be applied simultaneously or independently.
- Filtered results dynamically update based on the search query.

### Favorites:
- Mark countries as favorites.
- Favorites are saved in localStorage and persist across sessions.
- Favorites are displayed under the heart symbol at the top of the page for easy access.

### Country Details:
Clicking a country card opens a detailed view with:

- Flag
- Capital
- Population
- Languages
- Region
- Area
- A "Back" link to return to the homepage without losing the original results.

### Load More:
- Click "Load More" to load more country cards on the homepage.

---

## Acknowledgments

Country data is sourced from the [REST Countries API](https://restcountries.com/).

---

## Future Improvements

- Display country details as an overlay instead of navigating to a new page.
- Add a remove button inside the favorites section with a popup message when a country is added or removed.

