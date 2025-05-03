document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Language switching functionality
    const langButtons = document.querySelectorAll('.lang-btn');
    const elements = document.querySelectorAll('[data-ja], [data-en]');

    function switchLanguage(lang) {
        elements.forEach(element => {
            const text = element.getAttribute(`data-${lang}`);
            if (text !== null) { // Check if the attribute exists
                // Preserve child elements like spans within the text if necessary
                // This simple version replaces the entire textContent
                element.textContent = text;
            }
        });

        // Update active button state
        langButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            }
        });

        // Optionally, save the selected language to localStorage
        localStorage.setItem('preferredLang', lang);
    }

    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            switchLanguage(lang);
        });
    });

    // Check for saved language preference
    const preferredLang = localStorage.getItem('preferredLang');
    if (preferredLang) {
        switchLanguage(preferredLang);
    } else {
        // Default to Japanese if no preference is saved
        switchLanguage('ja');
    }

    // Image Slideshow functionality
    const slideshowContainer = document.querySelector('.slideshow-container');
    const slidesWrapper = document.querySelector('.slides-wrapper');
    const slides = document.querySelectorAll('.slideshow-container .slide');
    let currentSlide = 0;
    const numSlides = slides.length;
    const dotsContainer = document.querySelector('.navigation-dots'); // Get dots container
    let slideInterval; // Variable to hold the interval ID

    if (numSlides > 1) {
        // Create dots
        for (let i = 0; i < numSlides; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.dataset.slideIndex = i; // Store index in data attribute
            dot.addEventListener('click', () => {
                showSlide(i);
                resetInterval(); // Reset interval on manual navigation
            });
            dotsContainer.appendChild(dot);
        }
        const dots = dotsContainer.querySelectorAll('.dot'); // Get all created dots

        // Adjust wrapper width dynamically based on number of slides
        slidesWrapper.style.width = `${numSlides * 100}%`;
        // Adjust individual slide width
        slides.forEach(slide => {
            slide.style.width = `${100 / numSlides}%`;
        });

        function updateActiveDot(index) {
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }

        function showSlide(index) {
            const offset = index * -(100 / numSlides);
            slidesWrapper.style.transform = `translateX(${offset}%)`;
            currentSlide = index; // Update currentSlide index
            updateActiveDot(index); // Update the active dot
        }

        function nextSlide() {
            const nextIndex = (currentSlide + 1) % numSlides;
            showSlide(nextIndex);
        }

        function startInterval() {
            slideInterval = setInterval(nextSlide, 3000); // Change image every 3 seconds
        }

        function resetInterval() {
            clearInterval(slideInterval);
            startInterval();
        }

        // Start the slideshow
        startInterval();
        showSlide(0); // Show the first slide initially
    }
});

// Preloader functionality
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Optional: Add a small delay before hiding for smoother transition
        setTimeout(() => {
            preloader.classList.add('loaded');
        }, 200); // 200ms delay

        // Ensure it's eventually removed from the flow or fully hidden
        preloader.addEventListener('transitionend', () => {
            preloader.style.display = 'none';
        });
    }
}); 