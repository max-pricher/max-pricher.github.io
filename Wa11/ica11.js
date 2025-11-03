const APIKEY = '27af608f5f030c95f2ad7a51b593784a';
let currentMovie = null; // global current movie

async function getMovie(query) {
    // get API URL
    const url = `https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${APIKEY}`;


    const response = await fetch(url);
    if (!response.ok) {
        throw Error(response.statusText);
    }

    const movieData = await response.json();
    console.log(movieData);
    return movieData;
}

// update page content based on movie
const textBox = document.getElementById('js-movie-name');

function updatePage(movieData) {
    movieName = movieData.title;
    posterPath = movieData.poster_path;
    textBox.textContent = movieName;
    currentMovie = movieData;

    // update poster
    const baseURL = 'https://image.tmdb.org/t/p/w500';
    if (!posterPath) {
        posterImg.src = ''; // clear the image if no poster is available
        return;
    } else {
        const fullPosterPath = baseURL + posterPath;
        posterImg.src = fullPosterPath;
    }

    // update buttons
    const isFav = checkFavoriteStatus(movieData);
    favToggle.textContent = isFav ? 'Remove from Favorites' : 'Add to Favorites';
}


// search for movie
const searchButton = document.getElementById('js-search-button');
const searchInput = document.getElementById('js-search-bar');
const posterImg = document.getElementById('js-movie-poster');

searchButton.addEventListener('click', async () => { // before, event listener was trying to get data before it existed, so we converted listener to async and await the data
    const movieList = await getMovie(searchInput.value);
    if (movieList.results && movieList.results.length > 0) {
        updatePage(movieList.results[0]); // return the first/most relevant movie
    } else {
        // Handle no results
        textBox.textContent = "No movie found.";
        posterImg.src = "";
        currentMovie = null;
    }
});


// favorites managment

// DOM
const favToggle = document.getElementById('js-fav-toggle');
const favExport = document.getElementById('js-fav-export');
const favClear = document.getElementById('js-fav-clear');

// local storage
//key
const FAVS_KEY = 'movieAppFavs';

function getFavs() {
    const favsString = localStorage.getItem(FAVS_KEY);

    // one line if statements, should start using more
    return favsString ? JSON.parse(favsString) : [];
}


const favButton = document.getElementById('js-fav-toggle');
favButton.addEventListener('click', () => {
    const isFav = checkFavoriteStatus(currentMovie)
    // check if movie loaded
    if (!currentMovie) {
        alert("Please search for a movie first!");
        return;
    }

    // get fav list
    let favs = getFavs();
    if (isFav) {
        // in the list, remove
        // get index
        const movieIndex = favs.findIndex(fav => fav.id === currentMovie.id);
        // remove
        favs.splice(movieIndex, 1);

    }
    else {
        favs.push(currentMovie);
    }
    // Save the new list
    savefavs(favs);

    // update buttons
    favToggle.textContent = (!isFav) ? 'Remove from Favorites' : 'Add to Favorites';
});

function savefavs(favs) {
    const favsString = JSON.stringify(favs);
    localStorage.setItem(FAVS_KEY, favsString);
}

function checkFavoriteStatus(movie) {
    // get the current list
    const favs = getFavs();
    // some checks if any item in array matches
    // favs array, check every fav element, if their id matches movie.id return true
    return favs.some(fav => fav.id === movie.id);
}

// clear button
const clearButton = document.getElementById('js-favs-clear');

clearButton.addEventListener('click', () => {
    localStorage.removeItem(FAVS_KEY); // Clear from storage
    favToggle.textContent = 'Add to Favorites'; // Reset the button
    alert("All favorites cleared!");
});

// export button
const exportButton = document.getElementById('js-favs-export');

exportButton.addEventListener('click', () => {
    const favs = getFavs();
    if (favs.length === 0) {
        alert("No favorites to export!");
        return;
    }

    // Create a "virtual" file to download
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(favs, null, 2));

    // Create a temporary link element to trigger the download
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr); // set download link
    downloadAnchor.setAttribute("download", "my_movie_favorites.json"); // set file name
    document.body.appendChild(downloadAnchor); // Required for Firefox
    downloadAnchor.click(); // Trigger the download
    downloadAnchor.remove(); // remove temporary link
    alert("Favorites exported!");
}); 