// Initialize AOS (Animate On Scroll) with performance optimizations
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS with a small delay for better performance
    setTimeout(() => {
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false,
    offset: 50,
            delay: 100,
            disable: window.innerWidth < 768 && 'mobile' // Disable on mobile for better performance
        });
    }, 100);
});

// Theme toggle functionality
function initThemeToggle() {
    const themeToggleBtn = document.querySelector('.theme-toggle');
    const htmlElement = document.documentElement;
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme');
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    
    // Theme colors for browser UI
    const lightThemeColor = '#1e3a8a'; // Deep Blue for light theme
    const darkThemeColor = '#007EA7';  // Bright blue for dark theme from new palette
    
    // Set initial theme based on localStorage or system preference
    if (currentTheme) {
        htmlElement.setAttribute('data-theme', currentTheme);
        updateThemeIcon(currentTheme);
        updateThemeColorMeta(currentTheme);
    } else if (prefersDarkScheme.matches) {
        htmlElement.setAttribute('data-theme', 'dark');
        updateThemeIcon('dark');
        updateThemeColorMeta('dark');
    }
    
    // Toggle theme when button is clicked
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function() {
            const currentTheme = htmlElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            // Apply theme transition animation
            htmlElement.classList.add('theme-transition');
            
            // Update theme
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Update icon and meta tag
            updateThemeIcon(newTheme);
            updateThemeColorMeta(newTheme);
            
            // Remove transition class after animation completes
            setTimeout(() => {
                htmlElement.classList.remove('theme-transition');
                
                // Refresh AOS animations when theme changes
                if (typeof AOS !== 'undefined') {
                    AOS.refresh();
                }
            }, 300);
        });
    }
    
    // Update theme icon based on current theme
    function updateThemeIcon(theme) {
        if (!themeToggleBtn) return;
        
        const icon = themeToggleBtn.querySelector('i');
        if (icon) {
            if (theme === 'dark') {
                icon.className = 'fas fa-sun';
                themeToggleBtn.setAttribute('title', 'التبديل إلى الوضع الفاتح');
            } else {
                icon.className = 'fas fa-moon';
                themeToggleBtn.setAttribute('title', 'التبديل إلى الوضع الداكن');
            }
        }
    }
    
    // Update theme-color meta tag for browser UI
    function updateThemeColorMeta(theme) {
        if (themeColorMeta) {
            themeColorMeta.setAttribute('content', theme === 'dark' ? darkThemeColor : lightThemeColor);
        }
    }
    
    // Listen for system theme changes
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            htmlElement.setAttribute('data-theme', newTheme);
            updateThemeIcon(newTheme);
            updateThemeColorMeta(newTheme);
        }
    });
}

// Smooth scroll for navigation links with performance optimization
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            // Use requestAnimationFrame for smoother scrolling
            requestAnimationFrame(() => {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
                });
            });
        }
    });
});

// Add active class to navigation links on scroll with throttle
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

// Throttle function to limit execution frequency
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Throttled scroll event handler
window.addEventListener('scroll', throttle(() => {
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
}, 100));

// Header scroll effect with throttle
let lastScrollTop = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', throttle(() => {
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
}, 100));

// Enhanced lazy loading for images
function enhancedLazyLoad() {
    // Use Intersection Observer for better performance
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                    }
                    
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '200px 0px', // Start loading images before they appear in viewport
            threshold: 0.01
        });
        
        // Convert all images with loading="lazy" to use our enhanced lazy loading
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            // Only use our custom lazy loading for browsers that don't support native lazy loading
            if (!('loading' in HTMLImageElement.prototype)) {
                const src = img.src;
                img.setAttribute('data-src', src);
                img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E'; // Tiny placeholder
                imageObserver.observe(img);
            }
        });
    }
}

// Fix skill progress bars animation with Intersection Observer
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
                    requestAnimationFrame(() => {
                        progressBar.style.transition = 'width 1s ease-in-out';
                        progressBar.style.width = targetWidth;
                    });
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    skillCards.forEach(card => observer.observe(card));
};

// Enhanced Mobile navigation toggle
function initMobileNav() {
    const navLinks = document.querySelector('.nav-links');
    const mobileToggle = document.querySelector('.mobile-toggle');
    let navOverlay = document.querySelector('.nav-overlay');
    
    if (!mobileToggle || !navLinks) {
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
}

// Add touch swipe functionality for mobile
function addSwipeSupport() {
    if (window.innerWidth > 768) return;
    
    let touchStartX = 0;
    let touchEndX = 0;
    const navLinks = document.querySelector('.nav-links');
    const navOverlay = document.querySelector('.nav-overlay');
    const mobileToggle = document.querySelector('.mobile-toggle');
    
    if (!navLinks) return;
    
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true }); // Passive event listener for better performance
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
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

// Add preloader with performance optimization
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
    
    // Remove preloader after page loads
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

// Side buttons animation with performance optimization
function initSideButtons() {
    const sideButtons = document.querySelectorAll('.side-button');
    
    if (sideButtons.length === 0) return;
    
    // Add staggered entrance animation
    sideButtons.forEach((button, index) => {
        button.style.animationDelay = `${index * 0.2}s`;
    });
    
    // Smooth scroll for contact button
    const contactButton = document.querySelector('.side-button.contact');
    if (contactButton) {
        contactButton.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Use requestAnimationFrame for smoother scrolling
                requestAnimationFrame(() => {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                });
            }
        });
    }
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add critical functionality first
    addPreloader();
    initMobileNav();
    initThemeToggle();
    
    // Defer non-critical functionality
    setTimeout(() => {
        animateSkillBars();
        enhancedLazyLoad();
        initSideButtons();
        
        // Add touch support only on mobile devices
        if ('ontouchstart' in window) {
            addSwipeSupport();
        }
    }, 100);
});

// Make sure to initialize again when window loads
window.addEventListener('load', function() {
    console.log('Window loaded');
}); 