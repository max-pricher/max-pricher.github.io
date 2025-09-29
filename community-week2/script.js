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

// filter button
// Get all filter buttons and blog posts
const filterButtons = document.querySelectorAll('.Blog-Nav button');
const blogPosts = document.querySelectorAll('.Blog-Grid > div');

// Add click event to each button
filterButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        //get filter
        const filterValue = event.target.dataset.filter;
        // apply filter to function
        filterBlogs(filterValue);
    });
});


function filterBlogs(category) {
    // go through all blogs
    blogPosts.forEach(post => {
        // if categorgy matches or is all, show it
        if (category === 'All' || post.dataset.category === category) {
            post.style.display = 'block';
        } else {
            post.style.display = 'none';
        }
    });
}

// theme toggle button
const themeButton = document.getElementById('theme-toggle');
const body = document.body;

themeButton.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
});