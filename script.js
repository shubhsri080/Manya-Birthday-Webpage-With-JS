/* =====================================
   SLIDE SYSTEM
===================================== */

let currentSlide = 0;

const slides = document.querySelectorAll(".slide");

const slideNumber = document.querySelector(".slide-number");

const transitionContainer =
    document.getElementById("particle-transition");


/* =====================================
   FLOATING HEARTS
===================================== */

const heartsContainer =
    document.getElementById("hearts-container");


function createHeart() {

    const heart = document.createElement("div");

    heart.classList.add("heart");

    heart.innerHTML = "♥";

    heart.style.left =
        Math.random() * 100 + "%";

    heart.style.fontSize =
        (10 + Math.random() * 14) + "px";

    heart.style.animationDuration =
        (8 + Math.random() * 10) + "s";

    heart.style.animationDelay =
        Math.random() * 5 + "s";

    heartsContainer.appendChild(heart);


    setTimeout(() => {

        heart.remove();

    }, 20000);

}


/* Create hearts continuously */

setInterval(createHeart, 700);


/* Initial hearts */

for (let i = 0; i < 15; i++) {

    setTimeout(createHeart, i * 250);

}


/* =====================================
   STAR BURST TRANSITION
===================================== */

function createStarBurst() {

    transitionContainer.innerHTML = "";


    const numberOfStars = 180;


    for (let i = 0; i < numberOfStars; i++) {

        const star =
            document.createElement("div");

        star.classList.add("transition-star");


        /* Random starting position */

        const startX =
            Math.random() * window.innerWidth;

        const startY =
            Math.random() * window.innerHeight;


        /* Random explosion direction */

        const angle =
            Math.random() * Math.PI * 2;

        const distance =
            300 + Math.random() * 900;


        const x =
            Math.cos(angle) * distance;

        const y =
            Math.sin(angle) * distance;


        star.style.left =
            startX + "px";

        star.style.top =
            startY + "px";


        star.style.setProperty(
            "--x",
            x + "px"
        );

        star.style.setProperty(
            "--y",
            y + "px"
        );


        star.style.animationDelay =
            Math.random() * 0.25 + "s";


        transitionContainer.appendChild(star);

    }

}


/* =====================================
   GO TO SLIDE
===================================== */

function goToSlide(targetSlide) {

    if (targetSlide === currentSlide) {

        return;

    }


    /* Create particle explosion */

    createStarBurst();


    /* Temporarily hide navigation */

    document.querySelector(".navigation")
        .style.pointerEvents = "none";


    setTimeout(() => {

        slides[currentSlide]
            .classList.remove("active");


        currentSlide = targetSlide;


        slides[currentSlide]
            .classList.add("active");


        slideNumber.textContent =
            String(currentSlide + 1).padStart(2, "0")
            + " / 05";


    }, 550);


    /* Clean transition */

    setTimeout(() => {

        transitionContainer.innerHTML = "";

        document.querySelector(".navigation")
            .style.pointerEvents = "auto";

    }, 1300);

}


/* =====================================
   KEYBOARD NAVIGATION
===================================== */

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "ArrowRight") {

            if (currentSlide < slides.length - 1) {

                goToSlide(currentSlide + 1);

            }

        }


        if (event.key === "ArrowLeft") {

            if (currentSlide > 0) {

                goToSlide(currentSlide - 1);

            }

        }

    }
);

/* =====================================
   BACKGROUND MUSIC
===================================== */

const backgroundMusic =
    document.getElementById("backgroundMusic");

const musicButton =
    document.getElementById("musicButton");

let musicPlaying = false;

function toggleMusic() {

    if (!musicPlaying) {

        backgroundMusic.volume = 0.35;

        backgroundMusic.play()
            .then(() => {

                musicPlaying = true;

                musicButton.innerHTML = "🔊";

                musicButton.classList.add("playing");

            })
            .catch(() => {

                console.log(
                    "Music could not be played."
                );

            });

    } else {

        backgroundMusic.pause();

        musicPlaying = false;

        musicButton.innerHTML = "♪";

        musicButton.classList.remove("playing");

    }

}

function startMusic() {

    const music = document.getElementById("backgroundMusic");
    const button = document.getElementById("musicButton");

    music.volume = 0.35;

    music.play()
        .then(() => {

            musicPlaying = true;

            if (button) {
                button.innerHTML = "🔊";
                button.classList.add("playing");
            }

        })
        .catch((error) => {

            console.log("Music could not be played:", error);

        });
}