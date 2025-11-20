let info = false; /* track visibility state as a bool/let*/

const expandNav = document.querySelector('.nav-toggle'); /* select nav toggle button*/
const details = document.querySelector('.nav-menu'); /* select nav menu section*/

const label = document.querySelector('.aria-label'); /* select aria label*/


expandNav.addEventListener('click', showNav); /* when button is clicked, showNav function is called*/

function showNav() {
    if (info == false) {
        details.classList.add('show');
        expandNav.ariaLabel = "Collapse nav";
        info = true;
        expandNav.style.transform = "rotate(90deg)";
    }
    else {
        details.classList.remove('show');
        expandNav.ariaLabel = "Expand nav";
        info = false;
        expandNav.style.transform = "rotate(0deg)";
    }
}