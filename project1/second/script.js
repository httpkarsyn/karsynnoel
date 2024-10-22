let body = document.body;
let scroll_counter = 0;
let auto_scroll_started = false;
let scroller;

document.addEventListener("DOMContentLoaded", startAutoScrolling);

function startAutoScrolling() {
    auto_scroll_started = true;
    scroll_counter += 1.2; 
    window.scrollTo(0, scroll_counter);

    scroller = window.requestAnimationFrame(startAutoScrolling);

    if (scroll_counter >= body.offsetHeight) {
        window.cancelAnimationFrame(scroller);
    }
}

