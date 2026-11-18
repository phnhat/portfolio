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
const recommendationCard = carousel.querySelector(".recommendation-card");
const slides = Array.from(carousel.querySelectorAll(".recommendation"));
const slideContainer = carousel.querySelector(".recommendation-slides");
const positionLabel = carousel.querySelector(".recommendation-position");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const manualPauseDuration = 3 * 60 * 1000;
let currentSlide = 0;
let resumeAt = 0;
let pointerInside = false;
let cardHasFocus = false;
let rotationTimer;
let resumeTimer;

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
  const canRotate = !reducedMotion.matches && !pointerInside && !cardHasFocus &&
    !document.hidden && Date.now() >= resumeAt;
  slideContainer.setAttribute("aria-live", canRotate ? "off" : "polite");
  if (canRotate) {
    rotationTimer = window.setInterval(() => showRecommendation(currentSlide + 1), 10000);
  }
}

function moveRecommendation(direction) {
  resumeAt = Date.now() + manualPauseDuration;
  window.clearTimeout(resumeTimer);
  resumeTimer = window.setTimeout(updateRotation, manualPauseDuration);
  showRecommendation(currentSlide + direction);
  updateRotation();
}

carousel.querySelector(".recommendation-previous").addEventListener("click", () => moveRecommendation(-1));
carousel.querySelector(".recommendation-next").addEventListener("click", () => moveRecommendation(1));
recommendationCard.addEventListener("pointerenter", () => {
  pointerInside = true;
  updateRotation();
});
recommendationCard.addEventListener("pointerleave", () => {
  pointerInside = false;
  updateRotation();
});
recommendationCard.addEventListener("focusin", () => {
  cardHasFocus = true;
  updateRotation();
});
recommendationCard.addEventListener("focusout", (event) => {
  cardHasFocus = recommendationCard.contains(event.relatedTarget);
  updateRotation();
});
document.addEventListener("visibilitychange", updateRotation);
reducedMotion.addEventListener("change", updateRotation);

carousel.querySelector(".recommendation-navigation").hidden = false;
showRecommendation(0);
updateRotation();
