// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Particle effect for hero section
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 108;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random properties
        const size = Math.random() * 5 + 1;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const animDuration = Math.random() * 20 + 10;
        const animDelay = Math.random() * 2;
        const opacity = Math.random() * 0.3 + 0.1;
        
        // Apply styles
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.opacity = opacity;
        
        // Add wiggling motion with random parameters
        const wiggleX = Math.random() * 30 - 15; // Random X wiggle between -7.5 and 7.5
        const wiggleY = Math.random() * 30 - 15; // Random Y wiggle between -7.5 and 7.5
        const rotationRange = Math.random() * 69; // Random rotation up to 45 degrees
        const wiggleFrequency = Math.random() * 7 + 1; // Random frequency between 1-3s
        
        particle.style.animation = `
            wiggle${i} ${wiggleFrequency}s ease-in-out infinite,
            float${i} ${animDuration}s ease-in-out ${animDelay}s infinite
        `;
        
        // Create keyframes for both wiggle and float animations
        const keyframes = `
            @keyframes wiggle${i} {
                0%, 100% {
                    transform: translate(0, 0) rotate(0deg);
                }
                25% {
                    transform: translate(${wiggleX * 0.5}px, ${wiggleY * 0.5}px) rotate(${rotationRange}deg);
                }
                50% {
                    transform: translate(${-wiggleX * 0.3}px, ${wiggleY * 0.3}px) rotate(${-rotationRange}deg);
                }
                75% {
                    transform: translate(${wiggleX * 0.2}px, ${-wiggleY * 0.2}px) rotate(${rotationRange * 0.5}deg);
                }
            }
            @keyframes float${i} {
                0%, 100% {
                    margin-left: 0;
                    margin-top: 0;
                }
                33% {
                    margin-left: ${Math.random() * 30 - 15}px;
                    margin-top: ${Math.random() * 30 - 15}px;
                }
                66% {
                    margin-left: ${Math.random() * -30 + 15}px;
                    margin-top: ${Math.random() * 30 - 15}px;
                }
            }
        `;
        
        // Add keyframe animations to document
        const styleSheet = document.createElement('style');
        styleSheet.textContent = keyframes;
        document.head.appendChild(styleSheet);
        
        particlesContainer.appendChild(particle);
    }
}

// Scroll animations
function animateOnScroll() {
    const elements = document.querySelectorAll('.section-title, .section-subtitle, .philosophy-card, .creation-card, .contact-form');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    elements.forEach(element => {
        observer.observe(element);
    });
}

// Mobile menu functionality
function setupMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Toggle menu button appearance
            const spans = this.querySelectorAll('span');
            if (this.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
}

// Smooth scrolling for navigation links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
            const navLinks = document.querySelector('.nav-links');
            if (mobileMenuBtn && mobileMenuBtn.classList.contains('active')) {
                mobileMenuBtn.click();
            }
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Interactive elements
function setupInteractiveElements() {
    // Philosophy card interactions (added to the existing hover states in CSS)
    const cards = document.querySelectorAll('.philosophy-card');
    cards.forEach(card => {
        card.addEventListener('click', function() {
            // Add a subtle pulse effect on click
            this.style.animation = 'pulse 0.5s ease';
            setTimeout(() => {
                this.style.animation = '';
            }, 500);
        });
    });
    
    // Creation card interactions
    const creationCards = document.querySelectorAll('.creation-card');
    creationCards.forEach(card => {
        const mandala = card.querySelector('.creation-mandala');
        
        card.addEventListener('mousemove', function(e) {
            // Subtle parallax effect on the mandala
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const offsetX = (x - centerX) / 20;
            const offsetY = (y - centerY) / 20;
            
            if (mandala) {
                mandala.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (mandala) {
                mandala.style.transform = 'translate(0, 0)';
            }
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    createParticles();
    animateOnScroll();
    setupMobileMenu();
    setupSmoothScrolling();
    setupInteractiveElements();
    
    // Add a subtle animation to the logo
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        logo.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    }
    
    // Add CSS for additional animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.03); }
            100% { transform: scale(1); }
        }
        
        .logo {
            transition: transform 0.3s ease;
        }
        
        .nav-links.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background: rgba(26, 26, 46, 0.95);
            padding: 1rem;
            backdrop-filter: blur(10px);
            z-index: 99;
        }
    `;
    document.head.appendChild(style);
}); 