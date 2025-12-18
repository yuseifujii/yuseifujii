// ============================================
// YUSEI FUJII - GLASS AURORA EXPERIENCE
// Interactive particles & animations
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Set current year
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Set initial states explicitly
    gsap.set('.hero-content', {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        clearProps: 'filter'
    });
    
    // ============================================
    // PARTICLE SYSTEM
    // ============================================
    class ParticleSystem {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.particles = [];
            this.mouse = { x: null, y: null, radius: 150 };
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
        }
        
        animate() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Draw connections first (behind particles)
            this.drawConnections();
            
            // Update and draw particles
            this.particles.forEach(particle => {
                particle.update(this.mouse);
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
                        this.ctx.strokeStyle = `rgba(255, 140, 50, ${opacity})`;
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
                { r: 255, g: 107, b: 44 },  // Orange
                { r: 255, g: 170, b: 0 },   // Amber
                { r: 255, g: 71, b: 87 },   // Coral
                { r: 79, g: 70, b: 229 }    // Indigo
            ];
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.alpha = Math.random() * 0.5 + 0.3;
        }
        
        update(mouse) {
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
            
            // Return to base
            this.x += (this.baseX - this.x) * 0.02;
            this.y += (this.baseY - this.y) * 0.02;
            
            // Wrap around edges
            if (this.x < 0) this.x = this.canvas.width;
            if (this.x > this.canvas.width) this.x = 0;
            if (this.y < 0) this.y = this.canvas.height;
            if (this.y > this.canvas.height) this.y = 0;
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
    
    // Minimal links
    heroTimeline.to('.minimal-link', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out'
    }, '-=0.3');
    
    // Footer
    heroTimeline.to('.footer', {
        opacity: 1,
        duration: 1
    }, '-=0.3');
    
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
            '.minimal-link',
            '.footer'
        ], {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'none'
        });
    }
});
