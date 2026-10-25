/* =====================================
   SLIDES AND NAVIGATION
===================================== */

let currentSlide = 0;

const slides = [...document.querySelectorAll(".slide")];
const slideNumber = document.querySelector(".slide-number");
const transitionContainer = document.getElementById("slide-transition");
const navigation = document.querySelector(".navigation");
const previousButton = document.querySelector(".nav-arrow--previous");
const nextButton = document.querySelector(".nav-arrow--next");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const revealTargets = document.querySelectorAll(
    ".story-block, .admire-card, .support-opening, .support-message, .support-final, .birthday-wish"
);

if ("IntersectionObserver" in window && !prefersReducedMotion.matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealTargets.forEach((element) => {
        element.classList.add("reveal-on-scroll");
        revealObserver.observe(element);
    });
} else {
    revealTargets.forEach((element) => element.classList.add("is-visible"));
}

document.querySelectorAll(".slide img").forEach((image, index) => {
    image.decoding = "async";
    if (index === 0) {
        image.fetchPriority = "high";
    } else {
        image.loading = "lazy";
    }
});

let isTransitioning = false;
let transitionTimers = [];

function updateSlideControls() {
    if (slideNumber) {
        slideNumber.textContent = `${String(currentSlide + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
    }

    if (previousButton) previousButton.disabled = currentSlide === 0 || isTransitioning;
    if (nextButton) nextButton.disabled = currentSlide === slides.length - 1 || isTransitioning;
}

function clearTransitionTimers() {
    transitionTimers.forEach(window.clearTimeout);
    transitionTimers = [];
}

function goToSlide(targetSlide) {
    const nextSlideIndex = Number(targetSlide);

    if (
        !Number.isInteger(nextSlideIndex) ||
        nextSlideIndex < 0 ||
        nextSlideIndex >= slides.length ||
        nextSlideIndex === currentSlide ||
        isTransitioning
    ) {
        return;
    }

    clearTransitionTimers();
    isTransitioning = true;
    updateSlideControls();
    if (!prefersReducedMotion.matches && transitionContainer) {
        transitionContainer.classList.add("is-active");
    }

    if (navigation) navigation.setAttribute("aria-busy", "true");

    const switchSlide = () => {
        slides[currentSlide].classList.remove("active");
        slides[currentSlide].setAttribute("aria-hidden", "true");

        currentSlide = nextSlideIndex;
        slides[currentSlide].classList.add("active");
        slides[currentSlide].setAttribute("aria-hidden", "false");

        const scrollableContent = slides[currentSlide].querySelector(
            ".story-content, .admire-content, .support-content, .birthday-slide"
        );
        if (scrollableContent) scrollableContent.scrollTop = 0;

        updateSlideControls();
    };

    const finishTransition = () => {
        if (transitionContainer) transitionContainer.classList.remove("is-active");
        isTransitioning = false;
        if (navigation) navigation.removeAttribute("aria-busy");
        updateSlideControls();
    };

    if (prefersReducedMotion.matches) {
        switchSlide();
        finishTransition();
        return;
    }

    transitionTimers.push(window.setTimeout(switchSlide, 420));
    transitionTimers.push(window.setTimeout(finishTransition, 1370));
}

slides.forEach((slide, index) => {
    slide.setAttribute("aria-hidden", index === currentSlide ? "false" : "true");
});
updateSlideControls();

document.addEventListener("keydown", (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.defaultPrevented) return;

    const target = event.target;
    const isTyping = target instanceof HTMLElement && (
        target.isContentEditable ||
        target.matches("input, textarea, select, button, a, [role='button']") ||
        target.closest(".story-content, .admire-content, .support-content, .birthday-slide")
    );
    if (isTyping) return;

    if (event.key === "ArrowRight" && currentSlide < slides.length - 1) {
        event.preventDefault();
        goToSlide(currentSlide + 1);
    } else if (event.key === "ArrowLeft" && currentSlide > 0) {
        event.preventDefault();
        goToSlide(currentSlide - 1);
    }
});

/* =====================================
   DECORATIVE HEARTS
===================================== */

const heartsContainer = document.getElementById("hearts-container");
const MAX_HEARTS = 5;

function createHeart() {
    if (!heartsContainer || prefersReducedMotion.matches) return;

    while (heartsContainer.childElementCount >= MAX_HEARTS) {
        heartsContainer.firstElementChild.remove();
    }

    const heart = document.createElement("span");
    heart.className = "heart";
    heart.setAttribute("aria-hidden", "true");
    heart.textContent = "♥";
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.fontSize = `${8 + Math.random() * 7}px`;
    heart.style.animationDuration = `${8 + Math.random() * 10}s`;
    heart.addEventListener("animationend", () => heart.remove(), { once: true });
    heartsContainer.appendChild(heart);
}

let heartTimer = null;

function syncDecorativeMotion() {
    if (heartTimer) {
        window.clearInterval(heartTimer);
        heartTimer = null;
    }

    if (!prefersReducedMotion.matches) {
        for (let i = 0; i < 3; i += 1) {
            window.setTimeout(createHeart, i * 520);
        }
        heartTimer = window.setInterval(createHeart, 2600);
    } else if (heartsContainer) {
        heartsContainer.replaceChildren();
    }
}

syncDecorativeMotion();
prefersReducedMotion.addEventListener?.("change", syncDecorativeMotion);

/* =====================================
   BACKGROUND MUSIC
===================================== */

const backgroundMusic = document.getElementById("backgroundMusic");
const musicButton = document.getElementById("musicButton");

function updateMusicControl(isPlaying) {
    if (!musicButton) return;

    musicButton.textContent = isPlaying ? "🔊" : "♪";
    musicButton.setAttribute("aria-pressed", String(isPlaying));
    musicButton.setAttribute("aria-label", isPlaying ? "Pause background music" : "Play background music");
    musicButton.classList.toggle("playing", isPlaying);
}

async function startMusic() {
    if (!backgroundMusic) return;

    backgroundMusic.volume = 0.35;

    try {
        await backgroundMusic.play();
        updateMusicControl(true);
    } catch (error) {
        updateMusicControl(false);
        console.info("Background music could not be played.", error);
    }
}

function toggleMusic() {
    if (!backgroundMusic) return;

    if (backgroundMusic.paused) {
        startMusic();
    } else {
        backgroundMusic.pause();
        updateMusicControl(false);
    }
}

if (backgroundMusic) {
    backgroundMusic.addEventListener("play", () => updateMusicControl(true));
    backgroundMusic.addEventListener("pause", () => updateMusicControl(false));
}

updateMusicControl(false);
