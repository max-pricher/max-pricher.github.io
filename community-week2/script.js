const EXPIRATION_TIME = 4 * 24 * 60 * 60 * 1000; // 4 days in milliseconds
// array of all possible data storage keys
const STORAGE_KEYS = [
    'userTheme',
    'language',
    'lastSaveTime',
    'dataConsent',
];

function clearAllUserData() {
    STORAGE_KEYS.forEach(key => {
        localStorage.removeItem(key);
    });
}


let info = false; /* track visibility state as a bool/let*/

const expandNav = document.querySelector('.nav-toggle'); /* select nav toggle button*/
const details = document.querySelector('.nav-menu'); /* select nav menu section*/

const label = document.querySelector('.aria-label'); /* select aria label*/


expandNav.addEventListener('click', showNav); /* when button is clicked, showNav function is called*/

function showNav() {
    if (info == false) {
        details.classList.add('show');
        expandNav.ariaLabel = "Collapse nav";
        info = true;
        expandNav.style.transform = "rotate(90deg)";
    }
    else {
        details.classList.remove('show');
        expandNav.ariaLabel = "Expand nav";
        info = false;
        expandNav.style.transform = "rotate(0deg)";
    }
}

// filter button
// Get all filter buttons and blog posts
const filterButtons = document.querySelectorAll('.Blog-Nav button');
// go inside blog-grid add select all divs, assign to blogPosts
const blogPosts = document.querySelectorAll('.Blog-Grid > div');

// Add click event to each button
filterButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        //get filter from button selected
        const filterValue = event.target.dataset.filter;
        // apply filter to function
        filterBlogs(filterValue);
    });
});


function filterBlogs(category) {
    // go through all blogs
    blogPosts.forEach(post => {
        // if categorgy matches or is all, show it
        if (category === 'All' || post.dataset.category === category) {
            post.style.display = 'block';
        } else {
            post.style.display = 'none';
        }
    });
}

// theme toggle button
const themeButton = document.getElementById('theme-toggle');
const body = document.body;

themeButton.addEventListener('click', () => {
    body.classList.toggle('dark-mode'); // toggle the theme

    if (localStorage.getItem('dataConsent') === 'false') {
        // If user has opted out of data storage, don't save theme preference
        return;
    }

    // figure out what theme is active and save to local storage
    if (body.classList.contains('dark-mode')) {
        // save mode as userTheme in local storage.
        localStorage.setItem('userTheme', 'dark-mode');
    } else {
        localStorage.setItem('userTheme', 'light-mode');
    }
    localStorage.setItem('lastSaveTime', Date.now());
});

// erase data button
const dataButton = document.getElementById('clear-data');

dataButton.addEventListener('click', () => {
    clearAllUserData()
}
);

// dont store my data button
const dontStoreDataButton = document.getElementById('dont-store-data');

dontStoreDataButton.addEventListener('click', () => {
    // clear previous data
    clearAllUserData()

    // set website to not save
    localStorage.setItem('dataConsent', 'false');
    localStorage.setItem('lastSaveTime', Date.now());
}
);


function checkDataExpiration() {
    // get last save time
    const lastSaveTime = localStorage.getItem('lastSaveTime');
    // get current time
    const currentTime = Date.now();

    // Check if there was a last save and if the data is older than the expiration limit
    if (lastSaveTime && (currentTime - lastSaveTime > EXPIRATION_TIME)) {
        clearAllUserData();
        return true; // Return true if data was cleared
    }
    return false; // Return false if data is still valid
}



// --- INITIALIZATION ---
window.addEventListener('load', function () {
    // 1. Load saved theme
    applySavedTheme();

    // 2. BLOG FILTER LOGIC - MOVED INSIDE LOAD TO ENSURE BUTTONS EXIST
    const filterButtons = document.querySelectorAll('.blog-nav button');
    const blogPosts = document.querySelectorAll('.blog-grid > div');

    function filterBlogs(category) {
        blogPosts.forEach(post => {
            if (category === 'All' || post.dataset.category === category) {
                post.style.display = 'block';
            } else {
                post.style.display = 'none';
            }
        });
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const filterValue = event.target.dataset.filter;
            filterBlogs(filterValue);
        });
    });

    // 3. Erase Data Button 
    const dataButton = document.getElementById('clear-data');
    if (dataButton) {
        dataButton.addEventListener('click', () => {
            clearAllUserData();
        });
    }

    // 4. Don't Store Data Button 
    const dontStoreDataButton = document.getElementById('dont-store-data');
    if (dontStoreDataButton) {
        dontStoreDataButton.addEventListener('click', () => {
            clearAllUserData();
            localStorage.setItem('dataConsent', 'false');
            localStorage.setItem('lastSaveTime', Date.now());
        });
    }
});