// Define constants for the expiration time (4 days in milliseconds)
const EXPIRATION_TIME = 4 * 24 * 60 * 60 * 1000; // 4 days in milliseconds
// array of all possible data storage keys
const STORAGE_KEYS = [
    'userTheme',
    'language',
    'lastSaveTime',
    'dataConsent',
    'blogEntries'
];

let blogEntries = [];

function clearAllUserData() {
    // for every item in array, remove from localStorage
    STORAGE_KEYS.forEach(key => {
        localStorage.removeItem(key);
    });
}

// Function to check and clear expired data
function checkDataExpiration() {
     if (localStorage.getItem('dataConsent') === 'false') {
        return;
    }
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

// resource button submenu (only toggles aria rn)
const resourceButton = document.getElementById('Nav-Button');
if (resourceButton) {
    // when resource is clicked, it can only be expanded (not collapsed) so set to true
    resourceButton.addEventListener('click', () => {
        resourceButton.setAttribute('aria-expanded', true);
    });

    // doesnt work with focus, probably need to change how the submenu functions
}

// --nav toggle--
let info = false;
const expandNav = document.querySelector('.nav-toggle');
const navContainer = document.querySelector('.nav-bar-container');

if (expandNav && navContainer) {
    expandNav.addEventListener('click', showNav);
}

function showNav() {
    if (info == false) {
        navContainer.classList.add('show');
        expandNav.ariaLabel = "Collapse nav";
        info = true;
        expandNav.style.transform = "rotate(90deg)";
    } else {
        navContainer.classList.remove('show');
        expandNav.ariaLabel = "Expand nav";
        info = false;
        expandNav.style.transform = "rotate(0deg)";
    }
}

// --- blog filter ---
const filterButtons = document.querySelectorAll('.blog-nav button');

// Attach listeners to filter buttons
filterButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        const filterValue = event.target.dataset.filter;
        filterBlogs(filterValue);
    });
});

function filterBlogs(category) {
    const currentPosts = document.querySelectorAll('.blog-grid > div');

    currentPosts.forEach(post => {
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

const privacyCheckbox = document.getElementById('js-privacy-checkbox');
const clearButton = document.getElementById('clear-data');

//  Initialize Checkbox on Page Load
function initPrivacySettings() {
    if (!privacyCheckbox) return;

    const currentConsent = localStorage.getItem('dataConsent');
    console.log("Current Data Consent:", currentConsent); // Debug log

    if (currentConsent === 'true') {
        privacyCheckbox.checked = true;
    } else {
        privacyCheckbox.checked = false;
    }
}

// Toggle Logic
if (privacyCheckbox) {
    privacyCheckbox.addEventListener('change', () => {
        if (privacyCheckbox.checked) {
            // User checked the box // Enable
            localStorage.setItem('dataConsent', 'true');
            localStorage.setItem('lastSaveTime', Date.now());
        } else {
            // User unchecked the box // ask to clear
            if(confirm("Unchecking this will disable storage and clear your saved data. Continue?")) {
                clearAllUserData();
                localStorage.setItem('dataConsent', 'false'); 
                console.log("Data cleared and storage disabled.");
                location.reload(); // Refresh to show clean state
            } else {
                // If they cancel, re-check the box visually
                privacyCheckbox.checked = true;
            }
        }
    });
}

if (clearButton) {
    clearButton.addEventListener('click', () => {
        if(confirm("This will wipe all your saved blog posts and theme settings. Are you sure?")) {
            clearAllUserData();

            if(privacyCheckbox.checked) {
                 localStorage.setItem('dataConsent', 'true'); // re-initialize consent
            }
            console.log("User data wiped manually.");
            location.reload();
        }
    });
}

// Blog entry functions

function loadSavedBlogs() { // get saved blogs from localStorage and sync with global array.
    if (localStorage.getItem('dataConsent') === 'false') {
        return [];
    }
    const savedBlogs = localStorage.getItem('blogEntries');
    return savedBlogs ? JSON.parse(savedBlogs) : [];
}

function deleteBlogEntry(timestampId)
{
    if (!confirm("Are you sure you want to delete this post?"))
    {
        return;
    }

    // get saved blogs
    let currentBlogs = loadSavedBlogs();

    // remoove blog from array
    currentBlogs = currentBlogs.filter(post => post.timestamp !== timestampId);
    
    // sync blogs
    localStorage.setItem('blogEntries', JSON.stringify(currentBlogs));

    // Re-render
    displayBlogs();
}

function submitBlogEntry(newName, newEntry, newIdentity) { // turn the blog name and entry into an object

    const currentBlogs = loadSavedBlogs();

    const newPost = {
        name: newName,
        entry: newEntry,
        identity: newIdentity,
        timestamp: Date.now(),
        isUserPost: true // for delete button
    };

    // push to front of array
    currentBlogs.unshift(newPost);
    // add to local storage
    localStorage.setItem('blogEntries', JSON.stringify(currentBlogs));

    displayBlogs();
}
function displayBlogs() { 
    const blogGrid = document.getElementById('js-blog-grid');
    // clear html
    blogGrid.innerHTML = '';

    // get blogs from local storage // may be empty
    const userBlogs = loadSavedBlogs();

    // combine userblogs and demo/starter blogs
    const allBlogs = [...userBlogs, ...STARTER_BLOGS];


    // for every blog
        // create new blog element
        // attach each element as a child
        // attach to container element

    allBlogs.forEach(post => {
        const blogDiv = document.createElement('div');
        blogDiv.classList.add('blog');
        
        // Add filtering
        blogDiv.setAttribute('data-category', post.identity);
        
       // Format Date
        const dateString = new Date(post.timestamp).toLocaleDateString();

        // Add the Text Content
        blogDiv.innerHTML = `
            <h2 class ="header">${post.name}'s Blog</h2>
            <p style="font-size: 0.8rem; color: gray; margin-bottom: 5px;">
                ${post.identity} • ${dateString}
            </p>
            <p>${post.entry}</p>
        `;

        // delete button logic
        if (post.isUserPost) {
            const deleteButton = document.createElement('button');
            deleteButton.textContent = "(Delete Post)";
            deleteButton.classList.add('delete-button'); // Applies CSS class
            
            // Attach Event Listener directly to this button
            deleteButton.addEventListener('click', function() {
                deleteBlogEntry(post.timestamp);
            });

            // Append button to the blog card
            blogDiv.appendChild(deleteButton);
        }

        blogGrid.appendChild(blogDiv);
    });
}

const blogButton = document.getElementById('js-blog-button');
const nameEntry = document.getElementById('name-entry');
const blogEntry = document.getElementById('blog-entry');
const categoryEntry = document.getElementById('category-entry');

if (blogButton)
{
    blogButton.addEventListener('click', () => {
    // get name, check if empty
    let name = nameEntry.value.trim();
    // get blog entry, check if empty
    let entry = blogEntry.value.trim();
    // Get dropdown value   
    let category = categoryEntry.value;

    if (!entry || !name  || !category) {
        alert("Please fill out all fields.");
        return;
    }

    // valid response, reset fields
    nameEntry.value = "";
    blogEntry.value = "";
    categoryEntry.selectedIndex = 0;

    // save the blog entry to localStorage
    submitBlogEntry(name, entry, category);
});

}



window.addEventListener('load', function () {

    initPrivacySettings(); // load and visualize settings

    //  Load saved theme and check expiration
    applySavedTheme();

    //  Load Saved blog entries // 
    loadSavedBlogs();

    //  Render blogs
    displayBlogs();
});