// ============================================
// YUSEI FUJII - GLASS AURORA EXPERIENCE
// Interactive particles & scroll animations
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Set current year
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Initialize GSAP
    gsap.registerPlugin(ScrollTrigger);
    
    // ============================================
    // PARTICLE SYSTEM
    // ============================================
    class ParticleSystem {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.particles = [];
            this.mouse = { x: null, y: null, radius: 150 };
            this.scrollY = 0;
            this.animationId = null;
            
            this.init();
            this.animate();
            this.addEventListeners();
        }
        
        init() {
            this.resize();
            this.createParticles();
        }
        
        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
        
        createParticles() {
            this.particles = [];
            const numberOfParticles = Math.min(
                Math.floor((this.canvas.width * this.canvas.height) / 12000),
                150
            );
            
            for (let i = 0; i < numberOfParticles; i++) {
                this.particles.push(new Particle(this.canvas));
            }
        }
        
        addEventListeners() {
            window.addEventListener('resize', () => {
                this.resize();
                this.createParticles();
            });
            
            window.addEventListener('mousemove', (e) => {
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
            });
            
            window.addEventListener('mouseout', () => {
                this.mouse.x = null;
                this.mouse.y = null;
            });
            
            window.addEventListener('scroll', () => {
                this.scrollY = window.scrollY;
            });
        }
        
        animate() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Draw connections first (behind particles)
            this.drawConnections();
            
            // Update and draw particles
            this.particles.forEach(particle => {
                particle.update(this.mouse, this.scrollY);
                particle.draw(this.ctx);
            });
            
            this.animationId = requestAnimationFrame(() => this.animate());
        }
        
        drawConnections() {
            const maxDistance = 120;
            
            for (let i = 0; i < this.particles.length; i++) {
                for (let j = i + 1; j < this.particles.length; j++) {
                    const dx = this.particles[i].x - this.particles[j].x;
                    const dy = this.particles[i].y - this.particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < maxDistance) {
                        const opacity = (1 - distance / maxDistance) * 0.15;
                        this.ctx.beginPath();
                        this.ctx.strokeStyle = `rgba(0, 255, 242, ${opacity})`;
                        this.ctx.lineWidth = 0.5;
                        this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                        this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                        this.ctx.stroke();
                    }
                }
            }
        }
    }
    
    class Particle {
        constructor(canvas) {
            this.canvas = canvas;
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.baseX = this.x;
            this.baseY = this.y;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.density = Math.random() * 30 + 1;
            
            // Color variation
            const colors = [
                { r: 0, g: 255, b: 242 },   // Cyan
                { r: 0, g: 168, b: 255 },   // Blue
                { r: 177, g: 74, b: 237 },  // Purple
                { r: 0, g: 255, b: 136 }    // Green
            ];
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.alpha = Math.random() * 0.5 + 0.3;
        }
        
        update(mouse, scrollY) {
            // Parallax based on scroll
            const parallaxFactor = (this.density / 30) * 0.5;
            const scrollOffset = scrollY * parallaxFactor;
            
            // Mouse interaction
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    const directionX = dx / distance;
                    const directionY = dy / distance;
                    
                    this.x -= directionX * force * this.density * 0.1;
                    this.y -= directionY * force * this.density * 0.1;
                }
            }
            
            // Natural movement
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Return to base with scroll offset
            const targetY = this.baseY + scrollOffset;
            this.x += (this.baseX - this.x) * 0.02;
            this.y += (targetY - this.y) * 0.02;
            
            // Wrap around edges
            if (this.x < 0) this.x = this.canvas.width;
            if (this.x > this.canvas.width) this.x = 0;
            if (this.y < -scrollOffset) this.y = this.canvas.height + scrollOffset;
            if (this.y > this.canvas.height + scrollOffset) this.y = -scrollOffset;
        }
        
        draw(ctx) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha})`;
            ctx.fill();
            
            // Glow effect
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha * 0.2})`;
            ctx.fill();
        }
    }
    
    // Initialize particle system
    const particleCanvas = document.getElementById('particles');
    new ParticleSystem(particleCanvas);
    
    // ============================================
    // AURORA ANIMATION
    // ============================================
    const auroraLayers = document.querySelectorAll('.aurora-layer');
    
    // Fade in aurora layers
    gsap.to(auroraLayers, {
        opacity: 1,
        duration: 3,
        stagger: 0.5,
        ease: 'power2.out',
        delay: 0.5
    });
    
    // ============================================
    // HERO ANIMATIONS
    // ============================================
    const heroTimeline = gsap.timeline({
        defaults: { ease: 'power4.out' }
    });
    
    // Greeting
    heroTimeline.to('.greeting', {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.3
    });
    
    // Name lines
    heroTimeline.to('.name-line', {
        opacity: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.15,
        onComplete: () => {
            document.querySelectorAll('.name-line').forEach(el => {
                el.classList.add('animate');
            });
        }
    }, '-=0.6');
    
    // Tagline words
    heroTimeline.to('.tagline-word', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1
    }, '-=0.6');
    
    // Tagline dots
    heroTimeline.to('.tagline-dot', {
        opacity: 1,
        duration: 0.5,
        stagger: 0.1
    }, '-=0.5');
    
    // Scroll indicator
    heroTimeline.to('.scroll-indicator', {
        opacity: 1,
        duration: 1
    }, '-=0.3');
    
    // ============================================
    // SCROLL ANIMATIONS
    // ============================================
    
    // Hero fade out on scroll
    gsap.to('.hero-content', {
        opacity: 0,
        scale: 0.9,
        filter: 'blur(20px)',
        scrollTrigger: {
            trigger: '.spacer',
            start: 'top bottom',
            end: 'top center',
            scrub: 1.5
        }
    });
    
    gsap.to('.scroll-indicator', {
        opacity: 0,
        y: 20,
        scrollTrigger: {
            trigger: '.spacer',
            start: 'top bottom',
            end: 'top 80%',
            scrub: 1
        }
    });
    
    // Aurora intensity based on scroll
    ScrollTrigger.create({
        trigger: '.spacer',
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
            const progress = self.progress;
            const intensity = 0.4 + progress * 0.5;
            document.querySelector('.aurora').style.opacity = intensity;
        }
    });
    
    // ============================================
    // LINKS SECTION ANIMATIONS
    // ============================================
    
    // Links title
    gsap.to('.links-title', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.links-section',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        }
    });
    
    // Glass cards stagger animation
    const glassCards = document.querySelectorAll('.glass-card');
    
    glassCards.forEach((card, index) => {
        gsap.to(card, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.links-section',
                start: 'top 60%',
                toggleActions: 'play none none reverse'
            }
        });
    });
    
    // Footer
    gsap.to('.footer', {
        opacity: 1,
        duration: 1,
        delay: 0.4,
        scrollTrigger: {
            trigger: '.links-section',
            start: 'top 50%',
            toggleActions: 'play none none reverse'
        }
    });
    
    // ============================================
    // GLASS CARD INTERACTIONS
    // ============================================
    glassCards.forEach(card => {
        // 3D tilt effect on mouse move
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            gsap.to(card, {
                rotateX: rotateX,
                rotateY: rotateY,
                duration: 0.5,
                ease: 'power2.out',
                transformPerspective: 1000
            });
            
            // Move glow with cursor
            const glowX = (x / rect.width) * 100;
            const glowY = (y / rect.height) * 100;
            card.style.setProperty('--glow-x', `${glowX}%`);
            card.style.setProperty('--glow-y', `${glowY}%`);
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    });
    
    // ============================================
    // SMOOTH SCROLL BEHAVIOR
    // ============================================
    
    // Smooth scroll for better experience
    let scrollTimeout;
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        
        scrollTimeout = setTimeout(() => {
            lastScrollY = window.scrollY;
        }, 100);
    }, { passive: true });
    
    // ============================================
    // PERFORMANCE OPTIMIZATION
    // ============================================
    
    // Pause animations when tab is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            gsap.globalTimeline.pause();
        } else {
            gsap.globalTimeline.resume();
        }
    });
    
    // ============================================
    // PREFERS REDUCED MOTION
    // ============================================
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        // Disable complex animations
        gsap.globalTimeline.timeScale(10); // Speed up animations
        
        // Show all elements immediately
        gsap.set([
            '.greeting',
            '.name-line',
            '.tagline-word',
            '.tagline-dot',
            '.scroll-indicator',
            '.links-title',
            '.glass-card',
            '.footer'
        ], {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'none'
        });
    }
});
