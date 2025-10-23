
// async function means this functon doesnt need to run all at once, it can be paused with await. 

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
            const triviaData = await response.json();
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




const triviaButton = document.getElementById('js-new-quote');
if (triviaButton) {
    triviaButton.addEventListener('click', () => {
        getQuote();
    });
}
