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
    // for every item in array, remove from localStorage
    STORAGE_KEYS.forEach(key => {
        localStorage.removeItem(key);
    });
}

// Function to check and clear expired data
function checkDataExpiration() {
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


window.addEventListener('load', function () {
    applySavedTheme();
});

//stuff i added to generate random colors on every character
// this is my fucntion from my micro interactions project
function getRandomColor() {
    const colorR = Math.floor(Math.random() * 256);
    const colorG = Math.floor(Math.random() * 256);
    const colorB = Math.floor(Math.random() * 256);
    return `rgb(${colorR}, ${colorG}, ${colorB})`;
}

/// I additionally had to Ctrl+F replace textContent to innerHTML due tue to span tags being added.

// https://codepen.io/erevan/pen/MYKBjdZ
// Below is all for my Codepen activity
/// triple line break comments are my own to understand the code

// Constants for wave animation behavior
const WAVE_THRESH = 6; /// directly changes how extreme the wave effect is, anything below 3 looks weird. i like the look of 6 and would maybe choose to keep this as a static effect for a future website. 
const CHAR_MULT = 3;
const ANIM_STEP = 1000; /// i messed around with this and learned that lower falues made it quikc and jittery, higher values made it slower, the default 40 made my page look weird so i decided to increase it
const WAVE_BUF = 5;

/**
 * ASCII ripple animation instance for an element
 */
/// removed export keyword since im not using multiple files. 
const createASCIIShift = (el, opts = {}) => {
    // State variables
    let origTxt = el.innerHTML; /// grab original text 
    let origChars = origTxt.split(""); /// turn original string into array of characters?
    /// initialize settings
    let isAnim = false;
    let cursorPos = 0;
    let waves = [];
    let animId = null;
    let isHover = false;
    let origW = null;

    // options
    const cfg = {
        dur: 600,
        chars: '.,·-─~+:;=*π""┐┌┘┴┬╗╔╝╚╬╠╣╩╦║░▒▓█▄▀▌▐■!?&#$@0123456789*',/// possible characters that can replace text
        preserveSpaces: true, /// keeps white space 
        spread: 0.3,
        ...opts
    };

    /**
     * Updates cursor position based on mouse move
     */
    const updateCursorPos = (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const len = origTxt.length;
        const pos = Math.round((x / rect.width) * len);
        cursorPos = Math.max(0, Math.min(pos, len - 1));
    };

    /**
     * Starts a new wave animation from current cursor pos
     */
    const startWave = () => {
        waves.push({
            startPos: cursorPos, /// start it where cursor is
            startTime: Date.now(),
            id: Math.random() /// assign random id?
        });

        if (!isAnim) start();
    };

    /**
     * Clean up expired waves that have exceeded their duration
     */
    /// could be a good function to mess with and increase duration
    const cleanupWaves = (t) => {
        waves = waves.filter((w) => t - w.startTime < cfg.dur);
    };

    /**
     * Calculates wave fx for a character at given index
     * Returns whether to animate and which character to show
     */
    /// modified to apply a random RGB color to each char
    const calcWaveEffect = (charIdx, t) => {
        let shouldAnim = false;
        let resultChar = origChars[charIdx];  /// get the current character
        let resultColor = null;

        for (const w of waves) { /// repeat for every element of waves
            /// wave math below
            const age = t - w.startTime;
            const prog = Math.min(age / cfg.dur, 1);
            const dist = Math.abs(charIdx - w.startPos);
            const maxDist = Math.max(w.startPos, origChars.length - w.startPos - 1);
            const rad = (prog * (maxDist + WAVE_BUF)) / cfg.spread;

            /// if the distance is less or = to the radius
            if (dist <= rad) {
                shouldAnim = true;
                const intens = Math.max(0, rad - dist);

                // Chars in the wave zone shift through character sequence
                if (intens <= WAVE_THRESH && intens > 0) {
                    const charIdx =
                        (dist * CHAR_MULT + Math.floor(age / ANIM_STEP)) % cfg.chars.length;
                    resultChar = cfg.chars[charIdx];
                    resultColor = getRandomColor(); /// get random color
                }
            }
        }

        return { shouldAnim, char: resultChar, color: resultColor }; /// return random color as well
    };

    /**
     * Generates scrambled text based on current waves
     */
    const genScrambledTxt = (t) =>
        origChars
            .map((char, i) => {
                if (cfg.preserveSpaces && char === " ") return " ";
                const res = calcWaveEffect(i, t); /// get results from calcWave
                if (res.shouldAnim && res.color) {/// if were animating AND have a color, return a span with the color we generated, and wrap the character inside it.
                    return `<span style="color: ${res.color}">${res.char}</span>`; /// apply random color to character
                }
                return res.shouldAnim ? res.char : char;
            })
            .join("");

    /**
     * Stops the animation and resets to original text
     */
    const stop = () => {
        el.innerHTML = origTxt;
        el.classList.remove("as");

        // Reset width to allow natural text flow
        if (origW !== null) {
            el.style.width = "";
            origW = null;
        }
        isAnim = false;
    };

    /**
     * Start the animation loop
     */
    const start = () => {
        if (isAnim) return;

        // Preserve original width to prevent layout shifts
        if (origW === null) {
            origW = el.getBoundingClientRect().width;
            el.style.width = `${origW}px`;
        }

        isAnim = true;
        el.classList.add("as");

        const animate = () => {
            const t = Date.now(); /// get current time, this is to check for expiration later

            // Clean up expired waves first
            cleanupWaves(t); /// see if wave has expired

            if (waves.length === 0) { /// if no waves left, stop trying to animate?
                stop();
                return;
            }

            // Generate scrambled text
            el.innerHTML = genScrambledTxt(t); /// generate the scramble inside <span>
            animId = requestAnimationFrame(animate); /// not sure what this function does, may be from another library
        };

        animId = requestAnimationFrame(animate);
    };

    /**
     * Event handlers
     */

    /// similar to mouseover, when element is entered
    const handleEnter = (e) => {
        isHover = true;
        updateCursorPos(e);
        startWave();
    };

    const handleMove = (e) => { /// every time you move the cursor, check if the position has changed and if it has, startWave
        if (!isHover) return; /// if not hovering over an element
        const old = cursorPos;
        updateCursorPos(e);
        if (cursorPos !== old) startWave();
    };

    const handleLeave = () => {
        isHover = false;
    };

    /**
     * Initializes event listeners
     */

    /// mouse moving, interacting with an element, and mouse leaving element
    const init = () => {
        const events = [
            ["mouseenter", handleEnter],
            ["mousemove", handleMove],
            ["mouseleave", handleLeave]
        ];
        events.forEach(([evt, handler]) => el.addEventListener(evt, handler));
    };

    /**
     * Resets animation to original state
     */
    const resetToOrig = () => {
        waves = []; /// delete all waves 
        if (animId) { /// if therese still an animation, cancel it
            cancelAnimationFrame(animId);
            animId = null;
        }

        // Reset width preservation
        if (origW !== null) {
            el.style.width = "";
            origW = null;
        }
        stop(); /// stop animation
    };

    /**
     * Updates the text content
     */
    const updateTxt = (newTxt) => {
        origTxt = newTxt;
        origChars = newTxt.split("");
        if (!isAnim) el.innerHTML = newTxt; /// if activley animating, update onscreen element
    };

    /**
     * Destroys the instance and cleans up event listeners
     */
    const destroy = () => {
        resetToOrig(); /// cancels all aniamtions and onscreen elements
        ["mouseenter", "mousemove", "mouseleave"].forEach((evt, i) => /// delete each event listener
            el.removeEventListener(evt, [handleEnter, handleMove, handleLeave][i])
        );
    };

    // Initialize the instance
    init();

    // public API
    return { updateTxt, resetToOrig, destroy };
};

/**
 * Initialize animation for all links on the page
 */
const initASCIIShift = () => {
    const links = document.querySelectorAll("a"); /// get all a text elements
    links.forEach((link) => { /// for all elements
        if (!link.innerHTML.trim()) return; /// trim the element and feed it into the wave data generator
        createASCIIShift(link, { dur: 1000, spread: 1 });
    });
};

window.addEventListener("load", initASCIIShift);
