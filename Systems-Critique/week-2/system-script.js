
const searchBar = document.getElementById('main-search-bar');
const updateReminder = document.getElementById('js-update-reminder');
// empty array for keywords, let allows it to not conflict with other scripts e.g. scope is this file
let keywords = [];

// listen for all keydowns
searchBar.addEventListener('keydown', (event) => {
    // filter only for enter key
    if (event.key === 'Enter') {
        // search logic...

        // interpret and store keyword
        let currentKeyword = searchBar.value.trim().toLowerCase();
        if (currentKeyword) {
            if (currentKeyword[0] == '-') // treat as block word
            {
                // remove the -
                let blockWord = currentKeyword.substring(1); // remove leading character
                console.log(`block added: ${blockWord}`);
                blockWords.push(blockWord);
            }
            else // treat as regular keyword
            {
                if (!keywords.includes(currentKeyword)) {
                    console.log(currentKeyword);
                    keywords.push(currentKeyword);
                }
            } // keyword has been added
            if (keywords.includes("_all")) {
                // make a copy of WEBSITES
                let allWEBSITES = WEBSITES;
                // remove block words for testing
                filterblockWords(allWEBSITES);
                // sort by relevance
                getRelevantResults(allWEBSITES);
                // display filtered WEBSITES
                displayResults(allWEBSITES);
            } else if (keywords.length > 0) {
                searchKeywords();
            }
            else {
                // clear results
                displayResults([]);
            }
        }

        // clear bar
        searchBar.value = "";
        // display keywords
        const keywordsContainer = document.getElementById('js-keywords-container');
        displayKeywordContainer(keywordsContainer);
    }
});


const searchButton = document.getElementById('js-search-button');
searchButton.addEventListener('click', () => {


    // clear bar when finished
    searchBar.value = "";
});

function getPossibleResults(searchResults) {
    // itterate through every keyword inputted
    for (let keyword = 0; keyword < keywords.length; keyword++) {
        // and check every website
        const currentKeyword = keywords[keyword];
        for (let website = 0; website < WEBSITES.length; website++) {
            const currentWebsite = WEBSITES[website];
            const currentTitle = currentWebsite.title.toLowerCase();
            const currentDescription = currentWebsite.description.toLowerCase();

            if (currentTitle.includes(currentKeyword) || currentDescription.includes(currentKeyword)) {
                if (!searchResults.includes(currentWebsite)) {
                    // push the index of the website to search results
                    searchResults.push(currentWebsite);
                }
            }
        }
    }
    // finished searching
}

let blockWords = [];

function filterblockWords(searchResults) {
    // itterate through every blockWord in array
    for (let blockWord = 0; blockWord < blockWords.length; blockWord++) {
        // and check every result
        const currentblockWord = blockWords[blockWord];
        for (let website = 0; website < WEBSITES.length; website++) {
            const currentWebsite = WEBSITES[website];
            const currentTitle = currentWebsite.title.toLowerCase();
            const currentDescription = currentWebsite.description.toLowerCase();

            if (currentTitle.includes(currentblockWord) || currentDescription.includes(currentblockWord)) {
                // if it exists in the list
                if (searchResults.includes(currentWebsite)) {
                    // get index and splice it out, god bless indexOf
                    const index = searchResults.indexOf(currentWebsite);
                    searchResults.splice(index, 1);
                }
            }
        }
    }
    // finished searching
}

// article used for sorting https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort

function getRelevantResults(searchResults) {
    searchResults.sort((a, b) => {
        return getKeywordOccurence(b) - getKeywordOccurence(a);
    });
}

// function to return a WEBSITES  keyword occurence score
function getKeywordOccurence(website) {
    let score = 0;
    // get title and description
    const title = website.title.toLowerCase();
    const description = website.description.toLowerCase();

    // itterate through every keyword
    for (let keyword = 0; keyword < keywords.length; keyword++) {
        const currentKeyword = keywords[keyword];
        if (title.includes(currentKeyword) || description.includes(currentKeyword)) {
            score++;
        }
    }
    return score;
}

function searchKeywords() {
    let searchResults = [];
    // pass by reference is default in JS
    getPossibleResults(searchResults);
    filterblockWords(searchResults);
    getRelevantResults(searchResults);
    //filterBlocklist(searchResults); 
    //applySorting(searchResults);
    //applyPrefrences(searchResults); 


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



function displayKeywordContainer(keywordsContainer) {
    // clear render
    keywordsContainer.innerHTML = "";
    // add keywords
    for (let keyword = 0; keyword < keywords.length; keyword++) {
        // button because we  want our element to be able to focus and be clickable
        const keywordBlock = document.createElement('button');
        keywordBlock.className = 'keyword-block';
        keywordBlock.textContent = keywords[keyword];

        // needs to be within function due to it being dynamic
        keywordBlock.addEventListener('click', () => {

            // if leading char is - treat as block word
            if (keyword[0] == '-') {
                // treat the keyword as a block word
                blockWords.splice(keyword, 1);
            }
            // if keyword exists or in bounds
            else if (keyword > -1) {
                // splice one element from array and indice of keyword 
                keywords.splice(keyword, 1);
            }
            const keywordsContainer = document.getElementById('js-keywords-container');

            // clear old render
            keywordsContainer.innerHTML = "";
            displayKeywordContainer(keywordsContainer);
        }); // end of event listener
        keywordsContainer.appendChild(keywordBlock);
    }
    for (let blockWord = 0; blockWord < blockWords.length; blockWord++) {
        const blockWordBlock = document.createElement('button');
        blockWordBlock.className = 'blockWord-block';
        blockWordBlock.textContent = blockWords[blockWord];
        // needs to be within function due to it being dynamic
        // when clicked, removes block word from array
        blockWordBlock.addEventListener('click', () => {
            // if block word exists or in bounds
            if (blockWord > -1) {
                // splice one element from array and indice of block word 
                blockWords.splice(blockWord, 1);
            }
            displayKeywordContainer(keywordsContainer);
        });
        keywordsContainer.appendChild(blockWordBlock);
    }
}