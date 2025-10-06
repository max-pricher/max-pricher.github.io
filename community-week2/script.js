// Define constants for the expiration time (4 days in milliseconds)
const EXPIRATION_TIME = 4 * 24 * 60 * 60 * 1000; // 4 days in milliseconds
// array of all possible data storage keys
const STORAGE_KEYS = [
    'userTheme',
    'language',
    'lastSaveTime',
    'dataConsent',
];

function clearAllUserData() {
    // for every item in array, remove from localStorage
    STORAGE_KEYS.forEach(key => {
        localStorage.removeItem(key);
    });
}

// Function to check and clear expired data
function checkDataExpiration() {
    const lastSaveTime = localStorage.getItem('lastSaveTime');
    const currentTime = Date.now();
    // if past expiration, clear all data and return true
    if (lastSaveTime && (currentTime - lastSaveTime > EXPIRATION_TIME)) {
        clearAllUserData();
        return true;
    }
    // if data isnt expired, return false
    return false;
}

// Function to apply the saved theme
function applySavedTheme() {
    // if we arent saving data, return
    if (localStorage.getItem('dataConsent') === 'false') {
        return;
    }

    // Check if data has expired
    if (checkDataExpiration()) {
        return;
    }

    // get theme from userTheme, if none default to light (empty string)
    const savedTheme = localStorage.getItem('userTheme') || '';
    document.body.className = savedTheme;
}

// --nav toggle--
let info = false;
const expandNav = document.querySelector('.nav-toggle');
const details = document.querySelector('.nav-menu');

if (expandNav) {
    expandNav.addEventListener('click', showNav);
}

function showNav() {
    if (info == false) {
        details.classList.add('show');
        expandNav.ariaLabel = "Collapse nav";
        info = true;
        expandNav.style.transform = "rotate(90deg)";
    } else {
        details.classList.remove('show');
        expandNav.ariaLabel = "Expand nav";
        info = false;
        expandNav.style.transform = "rotate(0deg)";
    }
}

// --- blog filter ---
const filterButtons = document.querySelectorAll('.blog-nav button');
const blogPosts = document.querySelectorAll('.blog-grid > div');

// Attach listeners to filter buttons
filterButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        const filterValue = event.target.dataset.filter;
        filterBlogs(filterValue);
    });
});

function filterBlogs(category) {
    blogPosts.forEach(post => {
        if (category === 'All' || post.dataset.category === category) {
            post.style.display = 'block';
        } else {
            post.style.display = 'none';
        }
    });
}

// --- theme toggle ---
const themeButton = document.getElementById('theme-toggle');

if (themeButton) {
    themeButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');

        if (localStorage.getItem('dataConsent') === 'false') {
            return;
        }

        const currentTheme = document.body.classList.contains('dark-mode') ? 'dark-mode' : '';
        localStorage.setItem('userTheme', currentTheme);
        localStorage.setItem('lastSaveTime', Date.now());
    });
}


// --- data buttons DEFINITIONS ---
const clearButton = document.getElementById('clear-data');
if (clearButton) {
    clearButton.addEventListener('click', () => {
        console.log("Clearing all user data.");
        clearAllUserData();
    });
}

const dontStoreDataButton = document.getElementById('dont-store-data');
if (dontStoreDataButton) {
    dontStoreDataButton.addEventListener('click', () => {
        // Clear data and set the opt-out flag
        clearAllUserData();
        // set flag to false
        console.log("Opted out of data storage.");
        localStorage.setItem('dataConsent', 'false');
        localStorage.setItem('lastSaveTime', Date.now());
    });
}

const startStoringButton = document.getElementById('start-storing-data');
if (startStoringButton) { // This conditional check will now succeed.
    startStoringButton.addEventListener('click', () => {
        // change flag to true
        localStorage.setItem('dataConsent', 'true');
        localStorage.setItem('lastSaveTime', Date.now());
        console.log("Opt-out reversed.");
    });
}


window.addEventListener('load', function () {
    // 1. Load saved theme and check expiration
    applySavedTheme();


});
