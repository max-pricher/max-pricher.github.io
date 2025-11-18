// Global arrays
let keywords = [];
let blockWords = [];
let listKeywords = [];
let activePreferences = [];
const SEO_KEYS = [
    'Relevancy',
    'NULL',
    'NULL'
];


function updateSearchResults() { // searching function, grabs results based on keywords, functions, lists, etc.
    let searchResults;
    if (keywords.includes("_all")) { // if the keywords array contains _all, make a copy of WEBSITES
        // make a copy of WEBSITES
        searchResults = [...WEBSITES]; // was originally just = WEBSITES, but JS is pass by reference
    }
    else if (listKeywords.length > 0) { // if list keywords exist
        searchResults = []; // get blank array
        getKeywordLists(searchResults); // get results from lists
    }
    else if (keywords.length > 0) { // if not _all and not empty
        searchResults = []; // get blank array
        getPossibleResults(searchResults); // populate array
    }
    else { // no keyword present
        // clear results
        displayResults([]);
        return;
    }

    // my idea to optimize this was use an array to call functions, i looked it up and found this was a dynamic function or call()
    



    SEO_KEYS.forEach(preference => {
        if (activePreferences.includes(preference)) {
            const functionName = "get" + preference + "Results";
            // apply preference function here
            // e.g., if (preference === 'Relevancy') { applyRelevancy(searchResults); }
        }



    // apply SEO
    filterBlockWords(searchResults, blockWords); // Remove blockwords
    getRelevantResults(searchResults); // Sort by relevance

    // Later?
    //applySorting(searchResults);
    //applyPrefrences(searchResults); 

    // display filtered WEBSITES
    displayResults(searchResults);
}


function findListName(potentialName) {
    const masterList = getBookmarks();

    let listNames = Object.keys(masterList); // get every list name,

    // case insensitive search for list name
    const actualName = listNames.find(name => name.toLowerCase() === potentialName);
    return actualName; // return actual list name or undefined
}

// Search bar logic
const searchBar = document.getElementById('main-search-bar'); // Get search bar object
searchBar.addEventListener('keydown', (event) => { // listener for all keydowns, looking for enter key
    // search logic...
    if (event.key === 'Enter') { // filter only for enter key
        let currentKeyword = searchBar.value.trim().toLowerCase(); // interpret and store keyword
        if (currentKeyword) {
            if (currentKeyword[0] == '-') // leading char is - ||block word
            {
                let blockWord = currentKeyword.substring(1); // remove the leading character -
                if (!blockWords.includes(blockWord)) { // if block word isn't already in array
                    blockWords.push(blockWord); // add to array
                }
            }

            // https://www.geeksforgeeks.org/javascript/how-to-make-array-indexof-case-insensitive-in-javascript/ used this article for case insensitive search
            else if (currentKeyword[0] == '~') // leading char is ~ || search in list
            {
                const actualName = findListName(currentKeyword.substring(1)); // remove leading character ~
                if (actualName) // if the name exists
                {
                    if (!listKeywords.includes(actualName)) { // if list keyword isn't already in array
                        listKeywords.push(actualName); // add to array
                    }
                }
                else {
                    alert("A list with that name does not exist");
                }
            }
            else // not special term, treat as regular keyword
            {
                if (!keywords.includes(currentKeyword)) { // if current keyword isn't already in array
                    keywords.push(currentKeyword); // add to array
                }
            } // keyword has been added
        }

        updateSearchResults();

        // clear bar after each keyword input
        searchBar.value = "";
        // display keywords
        updateKeywordContainer();
    }
});

function getPossibleResults(searchResults) { // Find every result that contains any of the keywords and populate array.
    for (let keyword = 0; keyword < keywords.length; keyword++) { // itterate through every keyword inputted
        const currentKeyword = keywords[keyword]; // get current keyword
        for (let website = 0; website < WEBSITES.length; website++) { // and check every website
            const currentWebsite = WEBSITES[website]; // get current website
            if (isMatch(currentKeyword, currentWebsite)) { // if match exists
                if (!searchResults.includes(currentWebsite)) { // and isnt already in results
                    searchResults.push(currentWebsite); // add index to results array
                }
            }
        } // end of website check
    } // finished searching/end of keyword check
}

function filterBlockWords(searchResults) { // takes array and filters out any matching results from global blockWords
    for (let resultsIndex = searchResults.length - 1; resultsIndex >= 0; resultsIndex--) { // itterate backwards to not skip any results when splicing
        const currentWebsite = searchResults[resultsIndex]; // get current website
        for (let blockWordsIndex = 0; blockWordsIndex < blockWords.length; blockWordsIndex++) { // and check every block word
            const currentBlockWord = blockWords[blockWordsIndex];

            if (isMatch(currentBlockWord, currentWebsite)) { // if block word found in site
                searchResults.splice(resultsIndex, 1); // splice result
                break; // dont check if any more block words exist
            }
        } // end of block words checks
    } // end of websites check
    // finished searching
}

function isMatch(currentkeyword, currentWebsite) {
    const currentTitle = currentWebsite.title.toLowerCase(); // get it's lowercase title
    const currentDescription = currentWebsite.description.toLowerCase(); // get its lowercase description
    if (currentTitle.includes(currentkeyword) || currentDescription.includes(currentkeyword)) { // if title or description contains keyword
        return true;
    }
    return false;
}

// article used for sorting https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort

function getRelevantResults(searchResults) { // sort results by relevance (number of keyword occurences)
    searchResults.sort((a, b) => { // compare elements a and b, if b is greater, swap
        return getKeywordOccurence(b) - getKeywordOccurence(a); // greater score wins
    });
}

// function to return a WEBSITES keyword occurence score
function getKeywordOccurence(website) { // how many unique keywords were found in website
    let score = 0;
    for (let keyword = 0; keyword < keywords.length; keyword++) { // itterate through every keyword
        const currentKeyword = keywords[keyword];
        if (isMatch(currentKeyword, website)) { // if website contains at least one occurence of keyword
            score++;
        }
    }
    return score; // how many unique keywords were found
}

let activeBookmarkWebsite = null;

// display results in relevance to current website
function displayResults(searchResults) {
    // get container
    const resultsContainer = document.getElementById('js-search-container');

    // check if theres any results
    if (searchResults.length == 0) {
        resultsContainer.innerHTML = "<p>No results found</p>"
        return;
    }

    resultsContainer.innerHTML = ""; // reset
    // create every website

    for (let i = 0; i < searchResults.length; i++) { // load ALL results
        const website = searchResults[i]; // get current website
        // create div
        const card = document.createElement('div');
        card.className = 'result-card'; // add class

        // setup href
        const websiteLink = document.createElement('a');
        websiteLink.href = website.url; // assign URL
        websiteLink.target = '_blank'; // tells browser to open in new tab

        // create title
        const websiteTitle = document.createElement('h3');
        websiteTitle.textContent = website.title;

        // description button wrap
        const descriptionContainer = document.createElement('div');
        descriptionContainer.className = 'description-container';

        // create description
        const websiteDescription = document.createElement('p');
        websiteDescription.textContent = website.description; // assign description

        // create bookmark button
        const bookmarkButton = document.createElement('button');
        bookmarkButton.className = "bookmark-button";

        if (website.saved) {
            bookmarkButton.classList.add('bookmarked');
        } else {
            bookmarkButton.classList.remove('bookmarked');
        }

        // create event listener
        bookmarkButton.addEventListener('click', () => {
            if (localStorage.getItem('dataConsent') !== 'true') {
                alert("Please enable data storage consent in order to use bookmarks.");
                return;
            }
            if (website.saved) // if website clicked is already saved
            {
                // check if website open
                if (bookmarksContainer.style.display === 'flex' && activeBookmarkWebsite === website) {
                    bookmarksContainer.style.display = 'none'; // close window
                    activeBookmarkWebsite = null;
                }
                else {
                    activeBookmarkWebsite = website; // set active website
                    displayBookmarks(bookmarkButton); // open window
                }
            }
            else {
                website.saved = true;
                bookmarkButton.classList.add('bookmarked');

                const masterList = getBookmarks();
                if (!inMasterList(website)) {
                    masterList["All saves"].push(website);
                    syncBookmarkLists(masterList);
                }
            }
        });


        // append elements to card
        websiteLink.appendChild(websiteTitle); // append h3 title
        card.appendChild(websiteLink); // append link 

        descriptionContainer.appendChild(websiteDescription); // add description to description container
        descriptionContainer.appendChild(bookmarkButton); // add bookmark to description container

        card.appendChild(descriptionContainer); // append description container
        resultsContainer.appendChild(card); // add finished container to results
    }
}


// Display keywords in containers
function updateKeywordContainer() {
    const keywordsContainer = document.getElementById('js-keywords-container'); // get keyword container
    keywordsContainer.innerHTML = ""; // clear render

    const keywordsLength = keywords.length;
    const blockwordsLength = blockWords.length;
    const listkeywordsLength = listKeywords.length;

    // each keyword in container is a block, this adds each block to container
    for (let block = 0; block < keywordsLength + blockwordsLength + listkeywordsLength; block++) { // add all keywords
        const searchTerm = document.createElement('button'); // create button
        searchTerm.className = 'searchTerm-block'; // add class to button

        // populate with data
        if (block < keywordsLength) { // if were searching keywords
            searchTerm.classList.add('keyword-block'); // add class to button
            searchTerm.textContent = keywords[block]; // add content to button
        }
        else if (block < keywordsLength + listkeywordsLength) { // add list keywords
            let listKeywordIndex = block - keywordsLength;
            searchTerm.classList.add('listKeyword-block'); // add class to button
            searchTerm.textContent = "~" + listKeywords[listKeywordIndex];
        }
        else { // add block words
            let blockWordIndex = block - keywordsLength - listkeywordsLength;
            searchTerm.classList.add('blockWord-block'); // add class to button
            searchTerm.textContent = blockWords[blockWordIndex];
        }

        // search term removal handler
        searchTerm.addEventListener('click', () => { // add listener to element
            // get text to remove since button doesnt know it's own index just it's content
            const buttonText = searchTerm.textContent;
            if (searchTerm.classList.contains("keyword-block")) { // if class is a keyword block
                const index = keywords.indexOf(buttonText);
                if (index > -1) {
                    keywords.splice(index, 1); // remove the block from the keywords array
                }
            }
            if (searchTerm.classList.contains("listKeyword-block")) {
                const index = listKeywords.indexOf(buttonText.substring(1));
                if (index > -1) {
                    listKeywords.splice(index, 1); // remove the block from the keywords array
                }

            }
            else { // block word
                const index = blockWords.indexOf(buttonText);
                if (index > -1) {
                    blockWords.splice(index, 1); // remove the block from the blockWords array
                }
            } // keyword has been removed
            updateSearchResults(); // update search results
            updateKeywordContainer(); // re-render keywords
        });
        keywordsContainer.appendChild(searchTerm); // add finished child
    }
}

// local storage

const EXPIRATION_TIME = 4 * 24 * 60 * 60 * 1000; // 4 days in milliseconds
const STORAGE_KEYS = [
    'bookmarkList',
    'lastAccesedTime',
    'dataConsent' // match preferences button
];

// function to parse the lists string in localstorage and convert back into objects
function getBookmarks() {
    if (localStorage.getItem('dataConsent') !== 'true') // if consent does not exist
    {
        return { "All saves": [] }; // return default/empty list
    }

    const bookmarkList = localStorage.getItem('bookmarkList'); // get bookmark list
    if (!bookmarkList) // if none exists
    {
        return { "All saves": [] }; // return default/empty list
    }
    return JSON.parse(bookmarkList); // return JSON parsed list
}

function syncBookmarkLists(newList) { // function to sync bookmark lists to local storage, should only be called when dataConsent is true
    localStorage.setItem('bookmarkList', JSON.stringify(newList));
    localStorage.setItem('lastAccesedTime', Date.now());
}

function inList(currentWebsite, currentList) { // function checks if a website exists within a singular list
    return currentList.some(website => website.title === currentWebsite.title); // check if any item in list matches website title, was using url but not every site has unique url
}

function inMasterList(website) { // function checks if a website exists within the master list of lists
    const masterList = getBookmarks(); // get current master list
    for (let listIndex in masterList) { // better way to use a for loop with an array
        if (inList(website, masterList[listIndex])) { // if website found in any list
            return true;
        }
    }
    return false; // if not found in any list
}

// DOM for bookmarking system
const bookmarksContainer = document.querySelector('.bookmarks-container');
const addListButton = document.getElementById('js-add-list-button');
const bookmarkListDiv = document.getElementById('js-bookmark-lists');

addListButton.addEventListener('click', () => {
    const newListName = prompt("Enter new list name:");
    if (newListName) {
        const masterList = getBookmarks(); // get current master list
        if (!masterList[newListName]) { // if a list with that name doesn't exist
            masterList[newListName] = []; // make it
            syncBookmarkLists(masterList); // and add this list to the master list
            bookmarksContainer.style.display = 'none'; // close window
            activeBookmarkWebsite = null; // reset active website
        }
        else {
            alert("A list with that name already exists");
        }
    }
});


function displayBookmarks(button) { // function to display the container for the master bookmark list
    if (!activeBookmarkWebsite || localStorage.getItem('dataConsent') !== 'true') { // if no active website or no consent
        return; // no active website or user has not consented to data storage
    }

    // get button position and move container
    const parentContainer = button.parentElement; // get position of button
    parentContainer.appendChild(bookmarksContainer);

    // draw menu
    bookmarkListDiv.innerHTML = ""; // clear previous render
    const masterList = getBookmarks(); // get current master list
    const userLists = Object.keys(masterList); // get every list name

    // go through every user list and initialize
    userLists.forEach(listName => {
        // create label for each list
        const itemLabel = document.createElement('label');
        itemLabel.className = 'bookmark-list-item';

        // create checkbox for each list
        const resultInList = document.createElement('input');
        resultInList.type = 'checkbox';
        resultInList.value = listName;

        if (inList(activeBookmarkWebsite, masterList[listName])) { // if website exists in any saved list
            resultInList.checked = true; // checkbox default checked
        }

        // Add a listener for each list's checkbox
        resultInList.addEventListener('change', () => {
            const currentLists = getBookmarks();

            if (resultInList.checked) { // if adding website to this list
                currentLists[listName].push(activeBookmarkWebsite); // ADD website to this list
            } else {
                // REMOVE website from this list
                const index = currentLists[listName].findIndex(item => item.title === activeBookmarkWebsite.title); // find index of website
                if (index > -1) {
                    currentLists[listName].splice(index, 1); // REMOVE website from this list
                }
            }

            syncBookmarkLists(currentLists);

            if (inMasterList(activeBookmarkWebsite)) {
                activeBookmarkWebsite.saved = true;
                button.classList.add('bookmarked');
            } else {
                activeBookmarkWebsite.saved = false;
                button.classList.remove('bookmarked');
            }
        }); //end of listener
        itemLabel.appendChild(resultInList);
        itemLabel.appendChild(document.createTextNode(" " + listName));
        bookmarkListDiv.appendChild(itemLabel);
    });
    bookmarksContainer.style.display = 'flex';
}

// function to assign saved status on load
function loadSavedData() {
    // set all WEBSITES saved status
    WEBSITES.forEach(currentSite => {
        if (inMasterList(currentSite)) {
            currentSite.saved = true;
        }
        else {
            currentSite.saved = false;
        }
    });
}

// Check last time data was acessed, clear if expired
function checkDataExpiration() {
    const lastAccesedTime = localStorage.getItem('lastAccesedTime');
    const currentTime = Date.now();
    // if past expiration, clear all data and return true
    if (lastAccesedTime && (currentTime - lastAccesedTime > EXPIRATION_TIME)) {
        clearAllUserData();
        return true;
    }
    // if data isnt expired, return false
    return false;
}

// Clear every storage key, revoke consent and reload window
function clearAllUserData() {
    STORAGE_KEYS.forEach(key => {
        localStorage.removeItem(key);
    });
    localStorage.setItem('dataConsent', 'false');
    window.location.reload();
}

// delete user data
const deleteDataButton = document.getElementById('js-delete-user-data');
deleteDataButton.addEventListener('click', clearAllUserData);

const privacyCheckbox = document.getElementById('js-privacy-checkbox');
privacyCheckbox.addEventListener('change', () => {
    if (privacyCheckbox.checked) {
        localStorage.setItem('dataConsent', 'true');
        localStorage.setItem('lastAccesedTime', Date.now());
    } else {
        localStorage.setItem('dataConsent', 'false');
        clearAllUserData();
    }
});

window.addEventListener('load', () => {
    if (checkDataExpiration()) // if data is expired
    {
        // user data should be deleted
        privacyCheckbox.checked = false;
        localStorage.setItem('dataConsent', 'false');
    } else {
        privacyCheckbox.checked = localStorage.getItem('dataConsent') === 'true';
        localStorage.setItem('lastAccesedTime', Date.now());
    }
    loadSavedData();
});


// book mark list button
const listButton = document.getElementById('js-lists-button');

listButton.addEventListener('click', () => {
    const listsContainer = document.getElementById('js-lists-container');

    // Check if it is currently visible
    if (listsContainer.style.display === 'flex') {
        // If it's open, CLOSE IT
        listsContainer.style.display = 'none';
    } else {
        // If it's closed, OPEN IT
        displayLists();
    }
});

function displayLists() { // function to display the container for bookmark list
    const listsContainer = document.getElementById('js-lists-container');

    listsContainer.innerHTML = ""; // clear previous render

    if (localStorage.getItem('dataConsent') !== 'true') { // if consent not given
        return; // user has not consented to data storage
    }

    // draw menu
    const masterList = getBookmarks(); // get current master list
    const userLists = Object.keys(masterList); // get every list name

    // go through every user list and initialize
    userLists.forEach(listName => {
        // create button for each list
        const listItem = document.createElement('button');
        listItem.className = 'lists-list-item';
        listItem.value = listName;
        listItem.textContent = listName;

        // Add a listener for each list's button
        listItem.addEventListener('click', () => {
            if (!listKeywords.includes(listName)) { // if list keyword isn't already in array
                listKeywords.push(listName); // add to array
            }
            updateKeywordContainer();

            listsContainer.style.display = 'none'; // close menu after selection
            updateSearchResults();

        }); //end of listener
        listsContainer.appendChild(listItem);
    }); // end of lists list
    listsContainer.style.display = 'flex';
}

const seoButton = document.getElementById('js-seo-button');
seoButton.addEventListener('click', () => {
    const preferencesContainer = document.getElementById('js-preferences-container');

    // Check if it is currently visible
    if (preferencesContainer.style.display === 'flex') {
        // If it's open, CLOSE IT
        preferencesContainer.style.display = 'none';
    } else {
        // If it's closed, OPEN IT
        displayPreferences();
    }
});



// add a load settings to Load handler
function displayPreferences() {

    const preferencesContainer = document.getElementById('js-preferences-container');
    preferencesContainer.innerHTML = ""; // clear previous render

    // go through every SEO key and initialize
    SEO_KEYS.forEach(preferenceName => {
        // create button for each preference
        const preferenceButton = document.createElement('button');
        preferenceButton.className = 'preference-item';
        preferenceButton.value = preferenceName;
        preferenceButton.textContent = preferenceName;

        // Check if this preference is ALREADY active in array
        if (activePreferences.includes(preferenceName)) {
            preferenceButton.classList.add('active');
        }

        // Add a listener for each preference's button
        preferenceButton.addEventListener('click', () => {
            // Toggle preference in activePreferences array
            const index = activePreferences.indexOf(preferenceName);
            if (index > -1) {
                activePreferences.splice(index, 1); // remove preference
                preferenceButton.classList.remove('active'); // set button to inactive
            } else {
                activePreferences.push(preferenceName); // add preference
                preferenceButton.classList.add('active'); // set button to active
            }
            preferencesContainer.style.display = 'none'; // close menu after selection
            updateSearchResults();
        }); //end of listener
        preferencesContainer.appendChild(preferenceButton);
    }); // end of lists list
    preferencesContainer.style.display = 'flex';
}

function getKeywordLists(searchResults) { // Find every result that contains any of the list keywords and populate array.
    const masterList = getBookmarks(); // get all lists

    // itterate through every list keyword inputted
    for (let listIndex = 0; listIndex < listKeywords.length; listIndex++) {
        const currentListName = listKeywords[listIndex]; // get current list name
        const currentList = masterList[currentListName]; // get current list object
        // add every website from list to the search results
        for (let websiteIndex = 0; websiteIndex < currentList.length; websiteIndex++) {
            const currentWebsite = currentList[websiteIndex]; // get current website
            if (!searchResults.includes(currentWebsite)) { // and isnt already in results
                searchResults.push(currentWebsite); // add index to results array
            }
        } // end of website check
    }
}
