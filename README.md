# Country Explorer

**Country Explorer** is a web application that allows users to explore information about countries worldwide. It offers features like keyword search, filtering by region or language, a favorites section, and detailed country views.

## Setup Instructions

### Clone the Repository:
First, clone the repository from GitHub:

```bash
git clone https://github.com/](https://github.com/saipulavarthi/Strivelabs-frontend-
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


--------------------
### Design Decisions
Filter Logic:
The app supports combined filtering by region and language for more refined results.

Search and Filter Integration:
Users can search for countries by name, with real-time updates. Filters work alongside the search to narrow down results.

Favorite System:
Users can mark countries as favorites, toggled via heart icons (❤️/🤍). Favorites are saved in localStorage and displayed in an overlay for easy management.
---------------------


### Manual Testing:
Open the app in a modern browser (Chrome, Firefox, or Safari).
Verify the following:

-Search: Search functionality dynamically updates results based on input.
-Filters: Combined filters for region and language accurately refine the displayed countries.
-Favorites: Adding/removing countries as favorites updates the heart icon and persists in localStorage.
-Navigation: Clicking on a country card renders detailed information in the same tab.
-Load More: The "Load More" button fetches and displays additional countries seamlessly.


----------------------

### Search:
-Type in the search bar to find countries by name.
-The search dynamically displays suggestions. The "View All" option displays all matches as cards.
-Filters can be applied alongside the search to refine results further.
### Filters:
-Filter countries by region (e.g., Africa, Europe) and language (e.g., English, French).
-Both filters can be applied simultaneously or independently.
-Filtered results dynamically update based on the search query.

------------------------


### Favorites:
-Mark countries as favorites.
-The favorites are saved in localStorage and persist across sessions.
-Favorites are displayed under the heart symbol at the top of the page for easy access.
---------------------------

### Country Details:
-Clicking a country card opens a detailed view with:

-Flag
-Capital
-Population
-Languages
-Region
-Area
-A "Back" link to return to the homepage without losing the original results.
-----------------------------------------


-------------
### Load More:
-Click "Load More" to load more country cards on the homepage.
--------------------

---

## Acknowledgments
-Country data is sourced from the [REST Countries API](https://restcountries.com/).

--- 

##Future Improvements:
-Display country details as an overlay instead of navigating to a new page.
-Add a remove button inside the favorites section with a popup message when a country is added or removed.
