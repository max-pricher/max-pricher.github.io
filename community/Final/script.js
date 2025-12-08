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
            <h2>${post.name}'s Blog</h2>
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
    categoryEntry.vale = 0;

    // save the blog entry to localStorage
    submitBlogEntry(name, entry, category);
});


window.addEventListener('load', function () {
    // 1. Load saved theme and check expiration
    applySavedTheme();

    // 2. Load Saved blog entries // 
    loadSavedBlogs();

    // 3. Render blogs
    displayBlogs();
});