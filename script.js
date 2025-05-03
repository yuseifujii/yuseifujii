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

    if (numSlides > 1) {
        // Adjust wrapper width dynamically based on number of slides
        slidesWrapper.style.width = `${numSlides * 100}%`;
        // Adjust individual slide width
        slides.forEach(slide => {
            slide.style.width = `${100 / numSlides}%`;
        });

        function showSlide(index) {
            const offset = index * -(100 / numSlides);
            slidesWrapper.style.transform = `translateX(${offset}%)`;
            currentSlide = index; // Update currentSlide index
        }

        function nextSlide() {
            const nextIndex = (currentSlide + 1) % numSlides;
            showSlide(nextIndex);
        }

        // Start the slideshow
        setInterval(nextSlide, 3000); // Change image every 3 seconds
        showSlide(0); // Show the first slide initially
    }
}); 