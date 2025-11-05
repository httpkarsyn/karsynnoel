// smooth “go up” scroll + image fade-in
document.addEventListener("DOMContentLoaded", () => {
  const goUp = document.getElementById("goUp");
  if (goUp) {
    goUp.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const imgs = document.querySelectorAll(".card img");
  imgs.forEach((img) => {
    img.style.opacity = "0";
    img.style.transition = "opacity .4s ease";
    if (img.complete) img.style.opacity = "1";
    img.addEventListener("load", () => (img.style.opacity = "1"));
  });
});
