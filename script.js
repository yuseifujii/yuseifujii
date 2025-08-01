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
                        ${article.lang2_en ? `<span class="tag tag-lang" data-ja="${article.lang2_ja}" data-en="${article.lang2_en}">${article.lang2_en}</span>` : ''}
                    </div>
                    <h3 class="article-title" data-ja="${article.title_ja}" data-en="${article.title_en}">${article.title_en}</h3>
                    <p class="article-meta">
                        <span class="author">${article.author}</span> | 
                        <span class="date-published">Published: ${article.date}</span>
                    </p>
                    <p class="article-abstract" data-ja="${article.abstract_ja}" data-en="${article.abstract_en}">${article.abstract_en}</p>
                    <div class="article-actions">
                        <a href="publication/article.html?id=${article.id}&lang=ja" class="btn-read-more" data-ja="日本語版を閲覧" data-en="View Japanese PDF">View Japanese PDF</a>
                        <a href="publication/article.html?id=${article.id}&lang=en" class="btn-read-more" data-ja="英語版を閲覧" data-en="View English PDF">View English PDF</a>
                    </div>
                </div>
            `;

            articleItem.innerHTML = coverImageHTML + articleDetailsHTML;
            articleListContainer.appendChild(articleItem);
        });
        setLanguage(localStorage.getItem('preferredLanguage') || 'en'); // Re-apply language after rendering
    }

    function isMobile() {
        return window.innerWidth <= 768;
    }

    function renderArticlePage() {
        const urlParams = new URLSearchParams(window.location.search);
        const articleId = urlParams.get('id');
        const lang = urlParams.get('lang') || 'ja'; // Default to Japanese
        const article = articles.find(a => a.id === articleId);

        if (article) {
            document.title = `${article.title_en} | Fujii Journal of Mathematics`;
            
            // Update SEO metadata
            updateSEOMetadata(article, lang);
            
            const pdfPath = lang === 'en' ? article.pdf_path_en : article.pdf_path_ja;

            let pdfViewerHTML;
            if (isMobile()) {
                pdfViewerHTML = `
                    <div class="pdf-viewer-mobile">
                        <p data-ja="お使いのブラウザでは、PDFの直接表示が難しい場合があります。下のボタンからPDFを開いて閲覧してください。" data-en="Viewing PDFs directly in the browser can be difficult on this device. Please use the button below to open and view the PDF.">Viewing PDFs directly in the browser can be difficult on this device. Please use the button below to open and view the PDF.</p>
                        <a href="../${pdfPath}" target="_blank" class="btn-read-more" data-ja="PDFを閲覧する" data-en="View PDF">View PDF</a>
                    </div>
                `;
            } else {
                pdfViewerHTML = `
                    <div class="pdf-viewer">
                        <embed src="../${pdfPath}" type="application/pdf" width="100%" height="1000px" />
                    </div>
                `;
            }

            const articleHTML = `
                <h1 class="article-title-main" data-ja="${article.title_ja}" data-en="${article.title_en}">${article.title_en}</h1>
                <p class="article-meta">
                    <span class="author">${article.author}</span> | 
                    <span class="date-published">Published: ${article.date}</span>
                </p>
                ${pdfViewerHTML}
            `;
            articleContainer.innerHTML = articleHTML;
            setLanguage(localStorage.getItem('preferredLanguage') || 'en'); // Re-apply language after rendering
        } else {
            articleContainer.innerHTML = '<p>Article not found.</p>';
        }
    }

    function updateSEOMetadata(article, lang) {
        const currentLang = localStorage.getItem('preferredLanguage') || 'en';
        const title = currentLang === 'ja' ? article.title_ja : article.title_en;
        const description = currentLang === 'ja' ? article.meta_description_ja : article.meta_description_en;
        const keywords = currentLang === 'ja' ? article.keywords_ja : article.keywords_en;
        const ogDescription = currentLang === 'ja' ? article.og_description_ja : article.og_description_en;
        
        // Update page title
        document.title = `${title} | Fujii Journal of Mathematics`;
        
        // Update or create meta description
        updateMetaTag('name', 'description', description);
        
        // Update or create meta keywords
        updateMetaTag('name', 'keywords', keywords);
        
        // Update or create Open Graph tags
        updateMetaTag('property', 'og:title', title);
        updateMetaTag('property', 'og:description', ogDescription);
        updateMetaTag('property', 'og:type', 'article');
        updateMetaTag('property', 'og:url', window.location.href);
        
        // Article specific meta tags
        updateMetaTag('name', 'author', article.author);
        updateMetaTag('name', 'article:author', article.author);
        updateMetaTag('name', 'article:published_time', article.date);
        updateMetaTag('name', 'article:section', currentLang === 'ja' ? '数学' : 'Mathematics');
        updateMetaTag('name', 'article:tag', keywords);
        
        // Schema.org structured data
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "ScholarlyArticle",
            "headline": title,
            "description": description,
            "author": {
                "@type": "Person",
                "name": article.author
            },
            "datePublished": article.date,
            "publisher": {
                "@type": "Organization",
                "name": "Fujii Journal of Mathematics"
            },
            "about": currentLang === 'ja' ? '数学' : 'Mathematics',
            "keywords": keywords,
            "inLanguage": currentLang === 'ja' ? 'ja' : 'en'
        };
        
        updateStructuredData(structuredData);
    }

    function updateMetaTag(attribute, name, content) {
        let meta = document.querySelector(`meta[${attribute}="${name}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute(attribute, name);
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
    }

    function updateStructuredData(data) {
        let script = document.querySelector('script[type="application/ld+json"]#article-schema');
        if (!script) {
            script = document.createElement('script');
            script.type = 'application/ld+json';
            script.id = 'article-schema';
            document.head.appendChild(script);
        }
        script.textContent = JSON.stringify(data);
    }
});

// Preloader fade out
window.addEventListener('load', function() {
    // This is no longer needed
}); 