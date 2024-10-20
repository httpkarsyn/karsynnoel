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
        section.children[0].scrollLeft = getProgress(section) * window.innerWidth * 14;
    });
});
