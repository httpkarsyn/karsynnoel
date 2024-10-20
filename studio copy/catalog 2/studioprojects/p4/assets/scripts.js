function getProgress(element) {
    var rect = element.getBoundingClientRect();
    var html = document.documentElement;
    let progress = - (rect.top / (element.clientHeight - window.innerHeight));
    if (progress <= 0) {
        progress = 0;
    } else if (progress >= 1) {
        progress = 1;
    }
    return progress;
}

document.querySelectorAll('.horizontal-section').forEach((section) => {
    window.addEventListener('scroll', () => {
        section.children[0].scrollLeft = getProgress(section) * window.innerWidth * 3;
    });
});
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}


function playVideoWhenInView() {
    const video = document.getElementById('earth-video');
    if (isInViewport(video)) {
        video.play();
       
        window.removeEventListener('scroll', playVideoWhenInView);
    }
}


window.addEventListener('scroll', playVideoWhenInView);