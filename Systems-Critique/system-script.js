
const searchBar = document.getElementById('main-search-bar');

// empty array for keywords, let allows it to not conflict with other scripts e.g. scope is this file
let keywords = [];

// listen for all keydowns
searchBar.addEventListener('keydown', (event) => {
    // filter only for enter key
    if (event.key === 'Enter') {
        // search logic...
        let currentKeyword = "null";
        currentKeyword = searchBar.value.trim().toLowerCase();
        if (currentKeyword != "null" && currentKeyword != "") {
            console.log(currentKeyword);
            keywords.push(currentKeyword)
        }
        // clear bar
        searchBar.value = "";
        // display keywords
        displayKeywords();
    }
});


const searchButton = document.getElementById('js-search-button');
searchButton.addEventListener('click', () => {
    if (keywords.includes("_all")) {
        displayResults(websites);
    } else if (keywords.length > 0) {
        searchKeywords();
    }
    else {
        // clear results
        displayResults([]);
    }

    // clear bar when finished
    searchBar.value = "";
});

function searchKeywords() {
    let searchResults = [];

    // itterate through every keyword inputted
    for (let keyword = 0; keyword < keywords.length; keyword++) {
        // and check every website
        const currentKeyword = keywords[keyword];
        for (let website = 0; website < websites.length; website++) {
            const currentWebsite = websites[website];
            const currentTitle = currentWebsite.title.toLowerCase();
            const currentDescription = currentWebsite.description.toLowerCase();

            if (currentTitle.includes(currentKeyword) || currentDescription.includes(currentKeyword)) {
                if (!searchResults.includes(currentWebsite)) {
                    // push the index of the website to search results
                    searchResults.push(currentWebsite);
                    console.log(currentWebsite);
                }
            }
        }
    }
    //done searching
    console.log(searchResults.length);
    displayResults(searchResults);
}


// display results

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

    for (let i = 0; i < searchResults.length; i++) {
        const website = searchResults[i];
        // create div
        const card = document.createElement('div');
        // add class
        card.className = 'result-card';

        // create href
        const websiteLink = document.createElement('a');
        websiteLink.href = website.url;
        // tells browser to open in new tab
        websiteLink.target = '_blank';

        // create title
        const websiteTitle = document.createElement('h3');
        websiteTitle.textContent = website.title;

        // create description
        const websiteDescription = document.createElement('p');
        websiteDescription.textContent = website.description;

        // append to card
        websiteLink.appendChild(websiteTitle);
        card.appendChild(websiteLink);
        card.appendChild(websiteDescription);

        // add finished container to results
        resultsContainer.appendChild(card);
    }
}


// display keywords in containers



function displayKeywords() {
    const keywordsContainer = document.getElementById('js-keywords-container');

    // clear old render
    keywordsContainer.innerHTML = "";

    for (let keyword = 0; keyword < keywords.length; keyword++) {
        // span because we dont want the element on a new line
        const keywordBlock = document.createElement('span');
        keywordBlock.className = 'keyword-block';
        keywordBlock.textContent = keywords[keyword];

        // needs to be within function due to it being dynamic
        keywordBlock.addEventListener('click', () => {

            // if keyword exists or in bounds
            if (keyword > -1) {
                // splice one element from array and indice of keyword 
                keywords.splice(keyword, 1);
            }
            displayKeywords();
        });
        keywordsContainer.appendChild(keywordBlock);
    }
}