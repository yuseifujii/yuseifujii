document.addEventListener('DOMContentLoaded', () => {
    const slideshow = document.querySelector('.slides-wrapper');
    const dotsContainer = document.querySelector('.navigation-dots');
    const langButtons = document.querySelectorAll('.lang-btn');

    if (slideshow && dotsContainer) {
        const slides = Array.from(slideshow.children);
        const slideCount = slides.length;
        let currentSlide = 0;

        // Create navigation dots
        for (let i = 0; i < slideCount; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            dot.addEventListener('click', () => {
                currentSlide = i;
                showSlide(currentSlide);
                updateDots();
            });
            dotsContainer.appendChild(dot);
        }
        
        const dots = Array.from(dotsContainer.children);

        function showSlide(index) {
            slideshow.style.transform = `translateX(-${index * 25}%)`; // Adjust based on 4 slides
            updateDots();
        }

        function updateDots() {
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slideCount;
            showSlide(currentSlide);
        }

        // Initialize slideshow
        showSlide(0); // Show the first slide initially

        // Auto-advancing slides
        setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }

    // Language switcher logic
    // Function to set the language
    function setLanguage(lang) {
        const translatableElements = document.querySelectorAll('[data-ja]');
        translatableElements.forEach(el => {
            const text = el.getAttribute(`data-${lang}`);
            if (text) {
                el.innerHTML = text;
            }
        });
        langButtons.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });
        localStorage.setItem('preferredLanguage', lang);
    }

    // Event listeners for language buttons
    langButtons.forEach(button => {
        button.addEventListener('click', () => {
            const lang = button.getAttribute('data-lang');
            setLanguage(lang);
        });
    });

    // On page load, check for saved language preference
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) {
        setLanguage(savedLang);
    } else {
        // Default to English if no preference is saved
        setLanguage('en');
    }

    // Dynamic Article List Generation
    const articleListContainer = document.getElementById('article-list-container');
    if (articleListContainer && typeof articles !== 'undefined') {
        renderArticleList();
    }
    
    // Dynamic Article Page Generation
    const articleContainer = document.getElementById('article-container');
    if (articleContainer && typeof articles !== 'undefined') {
        renderArticlePage();
    }

    function renderArticleList() {
        articleListContainer.innerHTML = ''; // Clear existing content
        articles.forEach(article => {
            const articleItem = document.createElement('div');
            articleItem.className = 'article-item';

            let coverImageHTML = '<div class="article-cover-image">';
            if (article.cover_image) {
                coverImageHTML += `<img src="${article.cover_image}" alt="${article.alt_text}">`;
            } else {
                coverImageHTML += '<!-- Placeholder for cover image -->';
            }
            coverImageHTML += '</div>';

            const articleDetailsHTML = `
                <div class="article-details">
                    <div class="journal-tags">
                        <span class="tag tag-article-type" data-ja="${article.type_ja}" data-en="${article.type_en}">${article.type_en}</span>
                        <span class="tag tag-lang" data-ja="${article.lang_ja}" data-en="${article.lang_en}">${article.lang_en}</span>
                    </div>
                    <h3 class="article-title" data-ja="${article.title_ja}" data-en="${article.title_en}">${article.title_en}</h3>
                    <p class="article-meta">
                        <span class="author">${article.author}</span> | 
                        <span class="date-published">Published: ${article.date}</span>
                    </p>
                    <p class="article-abstract" data-ja="${article.abstract_ja}" data-en="${article.abstract_en}">${article.abstract_en}</p>
                    <a href="publication/article.html?id=${article.id}" class="btn-read-more" data-ja="閲覧する" data-en="View">View</a>
                </div>
            `;

            articleItem.innerHTML = coverImageHTML + articleDetailsHTML;
            articleListContainer.appendChild(articleItem);
        });
        setLanguage(localStorage.getItem('preferredLanguage') || 'en'); // Re-apply language after rendering
    }

    function renderArticlePage() {
        const urlParams = new URLSearchParams(window.location.search);
        const articleId = urlParams.get('id');
        const article = articles.find(a => a.id === articleId);

        if (article) {
            document.title = `${article.title_en} | Fujii Journal of Mathematics`;
            
            const articleHTML = `
                <h1 class="article-title-main" data-ja="${article.title_ja}" data-en="${article.title_en}">${article.title_en}</h1>
                <p class="article-meta">
                    <span class="author">${article.author}</span> | 
                    <span class="date-published">Published: ${article.date}</span>
                </p>
                <div class="pdf-viewer">
                    <embed src="../${article.pdf_path}" type="application/pdf" width="100%" height="1000px" />
                </div>
            `;
            articleContainer.innerHTML = articleHTML;
            setLanguage(localStorage.getItem('preferredLanguage') || 'en'); // Re-apply language after rendering
        } else {
            articleContainer.innerHTML = '<p>Article not found.</p>';
        }
    }
});

// Preloader fade out
window.addEventListener('load', function() {
    // This is no longer needed
}); 