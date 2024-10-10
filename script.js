let lastScrollTop = 0;
const nav = document.querySelector('nav');

window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop) {
        // Scrolling down - hide navbar
        nav.style.top = '-100px';
    } else {
        // Scrolling up - show navbar
        nav.style.top = '0';
    }
    lastScrollTop = scrollTop;
});

// Show navbar when hovering near the top
window.addEventListener('mousemove', function(event) {
    if (event.clientY < 100) { // If the mouse is near the top of the screen
        nav.style.top = '0';
    }
});
