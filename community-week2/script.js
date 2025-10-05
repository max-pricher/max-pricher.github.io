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
    STORAGE_KEYS.forEach(key => {
        localStorage.removeItem(key);
    });
}

// Function to check and clear expired data
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

// nav toggle
let info = false;

const expandNav = document.querySelector('.nav-toggle');
const details = document.querySelector('.nav-menu');

// Safety check before adding listener
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

// --- blog filters ---
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

// theme toggle
const themeButton = document.getElementById('theme-toggle');

if (themeButton) {
    themeButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');

        if (localStorage.getItem('dataConsent') === 'false') {
            return;
        }

        const currentTheme = document.body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode';
        localStorage.setItem('userTheme', currentTheme);
        localStorage.setItem('lastSaveTime', Date.now());
    });
}

// --- INITIALIZATION ---
window.addEventListener('load', function () {

    // check if any data is expired
    const dataExpired = checkDataExpiration();
    if (dataExpired) {
        return;
    }
    // 1. Load saved theme
    function applySavedTheme() {
        if (localStorage.getItem('dataConsent') === 'false') {
            return;
        }


        const savedTheme = localStorage.getItem('userTheme') || 'light';
        document.body.className = savedTheme;
    }

    applySavedTheme();

    // 2. Erase Data Button - MOVED INSIDE LOAD TO AVOID 'NULL' ERROR
    const dataButton = document.getElementById('clear-data');
    if (dataButton) {
        dataButton.addEventListener('click', () => {
            clearAllUserData();
        });
    }

    // 3. Don't Store Data Button - MOVED INSIDE LOAD TO AVOID 'NULL' ERROR
    const dontStoreDataButton = document.getElementById('dont-store-data');
    if (dontStoreDataButton) {
        dontStoreDataButton.addEventListener('click', () => {
            clearAllUserData();
            localStorage.setItem('dataConsent', 'false');
            localStorage.setItem('lastSaveTime', Date.now());
        });
    }
});
