let info = false; /* track visibility state as a bool/let*/

const expandNav = document.querySelector('.nav-toggle'); /* select nav toggle button*/
const details = document.querySelector('.nav-menu'); /* select nav menu section*/

const label = document.querySelector('.aria-label'); /* select aria label*/


expandNav.addEventListener('click', showNav); /* when button is clicked, showNav function is called*/

function showNav() {
    if (info == false) {
        details.style.display = "flex";
        expandNav.ariaLabel = "Collapse menu";
        info = true;
        alert("You have expanded the menu");
    }
    else {
        details.style.display = "none";
        expandNav.ariaLabel = "Expand menu";
        info = false;
        alert("You have collapsed the menu");
    }
}