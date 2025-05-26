// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false,
    offset: 50,
    delay: 100
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add active class to navigation links on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// Header scroll effect
let lastScrollTop = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scrolling down & past the header
        header.classList.add('scroll-down');
        header.classList.remove('scroll-up');
    } else {
        // Scrolling up
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
    }
    
    lastScrollTop = scrollTop;
});

// Fix skill progress bars animation
const animateSkillBars = () => {
    const skillCards = document.querySelectorAll('.skill-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target.querySelector('.skill-progress');
                if (progressBar) {
                    // Get the width from the style attribute
                    const targetWidth = progressBar.style.width;
                    
                    // First set width to 0
                    progressBar.style.width = '0%';
                    
                    // Then animate to the target width
                    setTimeout(() => {
                        progressBar.style.transition = 'width 1s ease-in-out';
                        progressBar.style.width = targetWidth;
                    }, 100);
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    skillCards.forEach(card => observer.observe(card));
};

// Enhanced Mobile navigation toggle
function initMobileNav() {
    console.log('Initializing mobile navigation');
    const navLinks = document.querySelector('.nav-links');
    const mobileToggle = document.querySelector('.mobile-toggle');
    let navOverlay = document.querySelector('.nav-overlay');
    
    if (!mobileToggle || !navLinks) {
        console.error('Mobile toggle or nav links not found');
        return;
    }
    
    // Create overlay if it doesn't exist
    if (!navOverlay) {
        navOverlay = document.createElement('div');
        navOverlay.className = 'nav-overlay';
        document.body.appendChild(navOverlay);
    }
    
    // Toggle menu on button click
    mobileToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Mobile toggle clicked');
        
        // Toggle active class
        navLinks.classList.toggle('active');
        navOverlay.classList.toggle('active');
        
        // Update the icon and prevent body scroll when menu is open
        if (navLinks.classList.contains('active')) {
            this.innerHTML = '<i class="fas fa-times"></i>';
            document.body.style.overflow = 'hidden';
        } else {
            this.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.style.overflow = '';
        }
    });
    
    // Handle menu item clicks - close menu when clicked
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
                navOverlay.classList.remove('active');
                mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
                document.body.style.overflow = '';
            }
        });
    });
    
    // Close menu when clicking on overlay
    navOverlay.addEventListener('click', function() {
        navLinks.classList.remove('active');
        navOverlay.classList.remove('active');
        mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
        document.body.style.overflow = '';
    });
    
    // Close menu when pressing Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            navOverlay.classList.remove('active');
            mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.style.overflow = '';
        }
    });
    
    // Handle resize events
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            navOverlay.classList.remove('active');
            mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.style.overflow = '';
        }
    });
}

// Add touch swipe functionality for mobile
function addSwipeSupport() {
    let touchStartX = 0;
    let touchEndX = 0;
    const navLinks = document.querySelector('.nav-links');
    const navOverlay = document.querySelector('.nav-overlay');
    const mobileToggle = document.querySelector('.mobile-toggle');
    
    if (!navLinks) return;
    
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
    
    function handleSwipe() {
        // Swipe right to open menu
        if (touchEndX - touchStartX > 100 && !navLinks.classList.contains('active')) {
            navLinks.classList.add('active');
            if (navOverlay) navOverlay.classList.add('active');
            if (mobileToggle) mobileToggle.innerHTML = '<i class="fas fa-times"></i>';
            document.body.style.overflow = 'hidden';
        }
        
        // Swipe left to close menu
        if (touchStartX - touchEndX > 100 && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            if (navOverlay) navOverlay.classList.remove('active');
            if (mobileToggle) mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.style.overflow = '';
        }
    }
}

// Add preloader
function addPreloader() {
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = `
        <div class="preloader-content">
            <div class="spinner"></div>
            <div class="loading-text">جاري التحميل...</div>
        </div>
    `;
    document.body.appendChild(preloader);
    
    window.addEventListener('load', function() {
        setTimeout(function() {
            preloader.style.opacity = '0';
            setTimeout(function() {
                preloader.style.display = 'none';
                document.body.classList.add('loaded');
            }, 500);
        }, 500);
    });
}

// Lazy load images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        console.log('Browser supports native lazy loading');
    } else {
        // Fallback for browsers that don't support lazy loading
        const lazyImageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('loading');
                    lazyImageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            lazyImageObserver.observe(img);
        });
    }
}

// When DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM content loaded');
    animateSkillBars();
    initMobileNav();
    addSwipeSupport();
    addPreloader();
    lazyLoadImages();
    
    // Add CSS for preloader
    const style = document.createElement('style');
    style.textContent = `
        .preloader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #ffffff;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            transition: opacity 0.5s ease;
        }
        
        .preloader-content {
            text-align: center;
        }
        
        .spinner {
            width: 50px;
            height: 50px;
            border: 5px solid rgba(65, 105, 225, 0.2);
            border-top-color: #4169e1;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 15px;
        }
        
        .loading-text {
            color: #0d2e63;
            font-weight: 600;
        }
        
        @keyframes spin {
            to {
                transform: rotate(360deg);
            }
        }
        
        body.loaded {
            animation: fadeIn 0.5s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
});

// Make sure to initialize again when window loads
window.addEventListener('load', function() {
    console.log('Window loaded');
}); 