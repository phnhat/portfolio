const navLinks = document.querySelectorAll(".main-nav a");

function highlightCurrentLink() {
  for (const link of navLinks) {
    if (link.hash === window.location.hash) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  }
}

highlightCurrentLink();
window.addEventListener("hashchange", highlightCurrentLink);

const carousel = document.querySelector(".recommendations");
const slides = Array.from(carousel.querySelectorAll(".recommendation"));
const slideContainer = carousel.querySelector(".recommendation-slides");
const rotationButton = carousel.querySelector(".recommendation-rotation");
const positionLabel = carousel.querySelector(".recommendation-position");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let currentSlide = 0;
let rotationEnabled = !reducedMotion.matches;
let pointerInside = false;
let rotationTimer;

function showRecommendation(index) {
  currentSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => {
    const active = slideIndex === currentSlide;
    slide.classList.toggle("is-active", active);
    slide.inert = !active;
    slide.setAttribute("aria-hidden", String(!active));
  });
  positionLabel.textContent = `${currentSlide + 1} / ${slides.length}`;
}

function updateRotation() {
  window.clearInterval(rotationTimer);
  rotationButton.textContent = rotationEnabled ? "Pause rotation" : "Resume rotation";
  slideContainer.setAttribute("aria-live", rotationEnabled ? "off" : "polite");
  if (rotationEnabled && !pointerInside && !document.hidden) {
    rotationTimer = window.setInterval(() => showRecommendation(currentSlide + 1), 10000);
  }
}

function moveRecommendation(direction) {
  rotationEnabled = false;
  showRecommendation(currentSlide + direction);
  updateRotation();
}

carousel.querySelector(".recommendation-previous").addEventListener("click", () => moveRecommendation(-1));
carousel.querySelector(".recommendation-next").addEventListener("click", () => moveRecommendation(1));
rotationButton.addEventListener("click", () => {
  rotationEnabled = !rotationEnabled;
  updateRotation();
});
carousel.addEventListener("pointerenter", () => {
  pointerInside = true;
  updateRotation();
});
carousel.addEventListener("pointerleave", () => {
  pointerInside = false;
  updateRotation();
});
carousel.addEventListener("focusin", (event) => {
  if (event.target !== rotationButton) {
    rotationEnabled = false;
    updateRotation();
  }
});
document.addEventListener("visibilitychange", updateRotation);
reducedMotion.addEventListener("change", () => {
  if (reducedMotion.matches) {
    rotationEnabled = false;
    updateRotation();
  }
});

carousel.querySelector(".recommendation-controls").hidden = false;
showRecommendation(0);
updateRotation();
