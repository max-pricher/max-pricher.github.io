// Global arrays
let keywords = [];
let blockWords = [];

function updateSearchResults() { // searching function
    let searchResults;
    if (keywords.includes("_all")) { // if the keywords array contains _all, make a copy of WEBSITES
        // make a copy of WEBSITES
        searchResults = [...WEBSITES]; // was originally just = WEBSITES, but JS is pass by reference
    } else if (keywords.length > 0) { // if not _all and not empty
        searchResults = []; // get blank array
        getPossibleResults(searchResults); // populate array
    }
    else { // no keyword present
        // clear results
        displayResults([]);
        return;
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
                blockWords.push(blockWord); // push to blockWord array
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

        // create description
        const websiteDescription = document.createElement('p');
        websiteDescription.textContent = website.description; // assign description

        // append elements to card
        websiteLink.appendChild(websiteTitle); // append h3 title
        card.appendChild(websiteLink); // append link 
        card.appendChild(websiteDescription); // append description
        resultsContainer.appendChild(card); // add finished container to results
    }
}


// Display keywords in containers
function updateKeywordContainer() {
    const keywordsContainer = document.getElementById('js-keywords-container'); // get keyword container
    keywordsContainer.innerHTML = ""; // clear render

    const keywordsLength = keywords.length;

    for (let block = 0; block < keywordsLength + blockWords.length; block++) { // add all keywords
        const searchTerm = document.createElement('button'); // create button
        searchTerm.className = 'searchTerm-block'; // add class to button

        // populate with data
        if (block < keywords.length) { // if were searching keywords
            searchTerm.classList.add('keyword-block'); // add class to button
            searchTerm.textContent = keywords[block]; // add content to button
        }
        else { // add block words
            let blockWordIndex = block - keywordsLength;
            searchTerm.classList.add('blockWord-block'); // add class to button
            searchTerm.textContent = blockWords[blockWordIndex];
        }

        // search term removal handler
        searchTerm.addEventListener('click', () => { // add listener to element
            // get text to remove since button doesnt know it's own index just it's content
            const buttonText = searchTerm.textContent;
            if (searchTerm.className == "keyword-block") { // if class is a keyword block
                const index = keywords.indexOf(buttonText);
                if (index > -1) {
                    keywords.splice(index, 1); // remove the block from the keywords array
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