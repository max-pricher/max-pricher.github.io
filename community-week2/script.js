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
    const lastSaveTime = localStorage.getItem('lastSaveTime');
    const currentTime = Date.now();

    if (lastSaveTime && (currentTime - lastSaveTime > EXPIRATION_TIME)) {
        clearAllUserData();
        return true;
    }
    return false;
}

// Function to apply the saved theme
function applySavedTheme() {
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

// --- NAVIGATION TOGGLE LOGIC (Works fine globally) ---
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

// --- BLOG FILTER LOGIC (Wrapped in check to prevent errors on community.html) ---
const filterButtons = document.querySelectorAll('.blog-nav button');
const blogPosts = document.querySelectorAll('.blog-grid > div');

if (filterButtons.length > 0 && blogPosts.length > 0) {
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
}


// --- THEME TOGGLE LOGIC (Works fine globally) ---
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

window.addEventListener('load', function () {
    // 1. Load saved theme and check expiration
    applySavedTheme();

    // --- BUTTON DEFINITIONS ---
    const clearButton = document.getElementById('clear-data');
    const dontStoreDataButton = document.getElementById('dont-store-data');
    const startStoringButton = document.getElementById('start-storing-data'); // Variable is now defined here.

    // 2. Erase Data Button (Clears all data)
    if (clearButton) {
        clearButton.addEventListener('click', () => {
            console.log("Clearing all user data.");
            clearAllUserData();
        });
    }

    // 3. Don't Store Data Button (Sets opt-out flag)
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

    // 4. Start Storing Data Button (Opt-in reversal)
    if (startStoringButton) { // This conditional check will now succeed.
        startStoringButton.addEventListener('click', () => {
            // change flag to true
            localStorage.setItem('dataConsent', 'true');
            localStorage.setItem('lastSaveTime', Date.now());
            console.log("Opt-out reversed.");
        });
    }
});
