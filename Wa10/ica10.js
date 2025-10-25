
// async function means this functon doesnt need to run all at once, it can be paused with await. 
// https://api.kanye.rest


let triviaData;

// function to fetch random celebrity data from API
async function getRandomCelebrity() {

    const url = 'https://celebrities-api-by-apirobots.p.rapidapi.com/v1/celebrities/random';
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'a1f2cb0b8fmshaf348b4cb59de06p1adf25jsnf39f8dd29a03',
            'x-rapidapi-host': 'celebrities-api-by-apirobots.p.rapidapi.com'
        }, // i guess GET uses a cache so calling this over and over will just result in the first name
        cache: 'no-cache'
    };

    const response = await fetch(url, options);
    if (!response.ok) {
        throw Error(response.statusText)
    }
    const celebrityData = await response.json();
    console.log(celebrityData);
    return celebrityData;
}


async function getKanyeQuote() {

    const response = await fetch('https://api.kanye.rest');
    // if call wasnt valid
    if (!response.ok) {
        // print error status. Throw will raise an exception stopping the program.
        throw Error(response.statusText);
    }
    else {
        const kanyeData = await response.json();
        console.log(kanyeData);
        return kanyeData;
    }
}


// function to fetch trivia quote data from API
async function getQuote() {
    // using try just for error testing
    try {
        // Await, get url and while getting data run other functions.
        // Await lets us know this is a potential function that could fail and that if it does we can catch the error.


        const response = await fetch('https://trivia.cyberwisp.com/getrandomchristmasquestion');
        // if call wasnt valid
        if (!response.ok) {
            // print error status. Throw will raise an exception stopping the program.
            throw Error(response.statusText);
        }
        else {
            triviaData = await response.json();
            console.log(triviaData);
            displayQuote(triviaData);
        }

    } catch (err) { // err is from error object
        console.error(err);
        alert("There was an error getting the trivia question. Please try again later.");
    }
}




const quoteText = document.getElementById('js-quote-text');
function displayQuote(triviaData) {
    quoteText.textContent = triviaData.question;
}

const randomCelebrityText = document.getElementById('js-random-celebrity-name')
function displayRandomCelebrity(celebrityData) {
    randomCelebrityText.textContent = `${celebrityData.name} -`;

}

const kanyeQuoteText = document.getElementById('js-kanye-quote-text');
function displayKanyeQuote(kanyeData) {
    kanyeQuoteText.textContent = `"${kanyeData.quote}"`;
}

const christmasSound = document.getElementById('js-christmas-sound');
const triviaButton = document.getElementById('js-new-quote');
if (triviaButton) {
    triviaButton.addEventListener('click', () => {
        getQuote();
        // set answer text to empty when new question is generated
        answerText.textContent = '';

        // play christmas noise
        christmasSound.play();
    });
}

const answerButton = document.getElementById('js-show-answer');
const answerText = document.getElementById('js-answer-text');
if (answerButton) {
    answerButton.addEventListener('click', () => {
        answerText.textContent = triviaData.answer;
    });
}

// code to for button to click, will generate a random celebrity and a kanye quote
const kanyeQuoteButton = document.getElementById('js-kanye-quote-button');

// this function uses two apis, so we removed the async from the function and added it here so it waits for both to finish
if (kanyeQuoteButton) {
    kanyeQuoteButton.addEventListener('click', async () => {
        try {
            // declare that we want to wait for all data
            const results = await Promise.all([getRandomCelebrity(), getKanyeQuote()]);
            const celebrityData = results[0];
            const kanyeData = results[1];

            displayRandomCelebrity(celebrityData);
            displayKanyeQuote(kanyeData);
        }
        catch (err) {
            console.error(err);
            alert("There was an error getting the celebrity or Kanye quote. Please try again later.");
        }
    });
}