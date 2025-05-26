/**
 * بورتفوليو مصطفى عبد الفتاح
 * JavaScript functionality for the portfolio page
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init();
    
    // Portfolio filtering
    initPortfolioFilter();
    
    // Portfolio item click events
    initPortfolioItemEvents();
    
    // Modal and lightbox functionality
    initModalEvents();
    
    // Initialize lazy loading
    initLazyLoading();
    
    // Initialize expand section buttons
    initExpandSectionButtons();
    
    // Initialize categories toggle button
    initCategoriesToggle();
});

/**
 * Initialize portfolio filtering
 */
function initPortfolioFilter() {
    const categories = document.querySelectorAll('.portfolio-category');
    const portfolioSections = document.querySelectorAll('.portfolio-section');
    
    // Add click event to filter buttons
    categories.forEach(category => {
        category.addEventListener('click', function() {
            // Remove active class from all buttons
            categories.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Show all sections if 'all' is selected, otherwise filter
            if (filter === 'all') {
                portfolioSections.forEach(section => {
                    section.style.display = 'block';
                    
                    // Reset expand section buttons
                    resetExpandSectionButtons();
                    
                    // Trigger AOS refresh for newly visible elements
                    setTimeout(() => {
                        AOS.refresh();
                    }, 100);
                });
            } else {
                portfolioSections.forEach(section => {
                    if (section.getAttribute('data-category') === filter) {
                        section.style.display = 'block';
                        
                        // Reset expand button for this section
                        resetSectionState(section);
                    } else {
                        section.style.display = 'none';
                    }
                });
                
                // Trigger AOS refresh for newly visible elements
                setTimeout(() => {
                    AOS.refresh();
                }, 100);
            }
            
            // Trigger lazy loading for newly visible images
            initLazyLoading();
        });
    });
}

/**
 * Initialize portfolio item click events
 */
function initPortfolioItemEvents() {
    const portfolioItems = document.querySelectorAll('.portfolio-item-behance');
    
    portfolioItems.forEach(item => {
        item.addEventListener('click', function() {
            const folder = this.getAttribute('data-folder');
            const index = parseInt(this.getAttribute('data-index'));
            const title = this.querySelector('h3').textContent;
            const description = this.querySelector('p') ? this.querySelector('p').textContent : '';
            
            openPortfolioModal(folder, index, title, description);
        });
    });
}

/**
 * Initialize modal and lightbox events
 */
function initModalEvents() {
    // Close modal when clicking the close button
    const modalClose = document.querySelector('.portfolio-modal-close');
    const modal = document.querySelector('.portfolio-modal');
    
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Re-enable scrolling
        });
    }
    
    // Close modal when clicking outside the content
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Re-enable scrolling
        }
    });
    
    // Lightbox functionality
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = lightbox.querySelector('img');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');
    
    // Close lightbox
    lightboxClose.addEventListener('click', function() {
        lightbox.style.display = 'none';
    });
    
    // Close lightbox when clicking outside
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
        }
    });
    
    // Set up navigation between lightbox images
    let currentImageIndex = 0;
    let lightboxImages = [];
    
    lightboxPrev.addEventListener('click', function() {
        if (currentImageIndex > 0) {
            currentImageIndex--;
            lightboxImg.src = lightboxImages[currentImageIndex];
        }
    });
    
    lightboxNext.addEventListener('click', function() {
        if (currentImageIndex < lightboxImages.length - 1) {
            currentImageIndex++;
            lightboxImg.src = lightboxImages[currentImageIndex];
        }
    });
}

/**
 * Initialize lazy loading for images
 */
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('.lazy-image');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    img.onload = function() {
                        img.classList.add('loaded');
                        const loader = img.parentNode.querySelector('.image-loader');
                        if (loader) {
                            loader.classList.add('hidden');
                        }
                    };
                    
                    img.src = src;
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        lazyImages.forEach(img => {
            const src = img.getAttribute('data-src');
            img.src = src;
            
            img.onload = function() {
                img.classList.add('loaded');
                const loader = img.parentNode.querySelector('.image-loader');
                if (loader) {
                    loader.classList.add('hidden');
                }
            };
        });
    }
}

/**
 * Initialize expand section buttons functionality
 */
function initExpandSectionButtons() {
    const expandButtons = document.querySelectorAll('.expand-section-btn');
    
    expandButtons.forEach(button => {
        const category = button.getAttribute('data-category');
        const section = document.querySelector(`.portfolio-section[data-category="${category}"]`);
        const items = Array.from(section.querySelectorAll('.portfolio-item-behance'));
        
        // Initially hide items beyond the first 3
        items.forEach((item, index) => {
            if (index >= 3) {
                item.style.display = 'none';
            }
        });
        
        // If there are 3 or fewer items, hide the expand button
        if (items.length <= 3) {
            button.classList.add('hidden');
        }
        
        button.addEventListener('click', function() {
            const hiddenItems = Array.from(section.querySelectorAll('.portfolio-item-behance[style="display: none;"]'));
            
            // If there are hidden items, show them
            if (hiddenItems.length > 0) {
                hiddenItems.forEach(item => {
                    item.style.display = 'block';
                });
                
                // Change button text and add expanded class
                button.textContent = 'عرض أقل';
                button.classList.add('expanded');
                
                // Trigger lazy loading for newly visible images
                initLazyLoading();
                
                // Highlight the newly shown items
                setTimeout(() => {
                    hiddenItems.forEach(item => {
                        item.classList.add('highlight-item');
                        setTimeout(() => {
                            item.classList.remove('highlight-item');
                        }, 1500);
                    });
                }, 300);
                
                // Refresh AOS animations
                setTimeout(() => {
                    AOS.refresh();
                }, 100);
            } else {
                // Hide items beyond the first 3
                items.forEach((item, index) => {
                    if (index >= 3) {
                        item.style.display = 'none';
                    }
                });
                
                // Change button text back and remove expanded class
                button.textContent = 'عرض المزيد من الأعمال';
                button.classList.remove('expanded');
                
                // Scroll back to the top of the section
                section.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

/**
 * Reset all expand section buttons to initial state
 */
function resetExpandSectionButtons() {
    const sections = document.querySelectorAll('.portfolio-section');
    sections.forEach(section => {
        resetSectionState(section);
    });
}

/**
 * Reset a section to its initial state
 * @param {HTMLElement} section - The section to reset
 */
function resetSectionState(section) {
    const items = Array.from(section.querySelectorAll('.portfolio-item-behance'));
    const expandBtn = section.querySelector('.expand-section-btn');
    
    if (expandBtn) {
        expandBtn.textContent = 'عرض المزيد من الأعمال';
        expandBtn.classList.remove('expanded');
        
        if (items.length <= 3) {
            expandBtn.classList.add('hidden');
        } else {
            expandBtn.classList.remove('hidden');
        }
    }
    
    // Show only the first 3 items
    items.forEach((item, index) => {
        if (index < 3) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

/**
 * Open portfolio modal with project details
 * @param {string} folder - Project folder name
 * @param {number} index - Starting image index
 * @param {string} title - Project title
 * @param {string} description - Project description
 */
function openPortfolioModal(folder, index, title, description) {
    const modal = document.querySelector('.portfolio-modal');
    const modalImages = modal.querySelector('.portfolio-modal-images');
    const modalTitle = modal.querySelector('.portfolio-modal-info h2');
    const modalDescription = modal.querySelector('.portfolio-modal-info p');
    const projectCategory = modal.querySelector('.project-category');
    
    // Clear previous images
    modalImages.innerHTML = '';
    
    // Set project details
    modalTitle.textContent = title;
    modalDescription.textContent = description || '';
    
    // Set category based on folder name
    let categoryName = '';
    switch (folder) {
        case 's1':
            categoryName = 'المنتجات';
            break;
        case 's2':
            categoryName = 'الأعمال';
            break;
        case 's3':
            categoryName = 'الصحة';
            break;
        case 's4':
            categoryName = 'الجمال';
            break;
        case 's5':
            categoryName = 'الأمان';
            break;
        case 's7':
            categoryName = 'السفر';
            break;
        case 's8':
            categoryName = 'الجمال';
            break;
    }
    projectCategory.textContent = categoryName;
    
    // Load images from the folder
    loadFolderImages(folder, modalImages);
    
    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
}

/**
 * Load images from a specific folder into the modal
 * @param {string} folder - Project folder name
 * @param {HTMLElement} container - Container to append images to
 */
function loadFolderImages(folder, container) {
    // For demonstration, we'll use the images we know exist in each folder
    // In a real project, you might fetch this data from a server
    let folderPath = `assets/images/portofolio/${folder}/`;
    let images = [];
    
    // Get images for each folder (based on the files we found earlier)
    switch (folder) {
        case 's1':
            images = [
                'WhatsApp Image 2025-05-25 at 4.42.07 PM.jpeg',
                'WhatsApp Image 2025-05-25 at 4.42.07 PM (1).jpeg',
                'WhatsApp Image 2025-05-25 at 4.42.07 PM (2).jpeg',
                'WhatsApp Image 2025-05-25 at 4.42.08 PM.jpeg',
                'WhatsApp Image 2025-05-25 at 4.42.08 PM (1).jpeg'
            ];
            break;
        case 's2':
            images = [
                'WhatsApp Image 2025-05-25 at 4.43.30 PM.jpeg',
                'WhatsApp Image 2025-05-25 at 4.43.31 PM.jpeg',
                'WhatsApp Image 2025-05-25 at 4.43.31 PM (1).jpeg',
                'WhatsApp Image 2025-05-25 at 4.43.31 PM (2).jpeg',
                'WhatsApp Image 2025-05-25 at 4.43.32 PM.jpeg'
            ];
            break;
        case 's3':
            images = [
                'WhatsApp Image 2025-05-25 at 4.45.02 PM.jpeg',
                'WhatsApp Image 2025-05-25 at 4.45.03 PM.jpeg',
                'WhatsApp Image 2025-05-25 at 4.45.10 PM.jpeg',
                'WhatsApp Image 2025-05-25 at 4.45.10 PM (1).jpeg',
                'WhatsApp Image 2025-05-25 at 4.45.11 PM.jpeg',
                'WhatsApp Image 2025-05-25 at 4.45.11 PM (1).jpeg'
            ];
            break;
        case 's4':
            images = [
                'WhatsApp Image 2025-05-25 at 4.47.00 PM.jpeg',
                'WhatsApp Image 2025-05-25 at 4.47.00 PM (1).jpeg',
                'WhatsApp Image 2025-05-25 at 4.47.02 PM.jpeg',
                'WhatsApp Image 2025-05-25 at 4.47.06 PM.jpeg',
                'WhatsApp Image 2025-05-25 at 4.47.07 PM.jpeg',
                'WhatsApp Image 2025-05-25 at 4.47.07 PM (1).jpeg'
            ];
            break;
        case 's5':
            images = [
                'WhatsApp Image 2025-05-25 at 4.55.34 PM.jpeg',
                'WhatsApp Image 2025-05-25 at 4.55.34 PM (1).jpeg',
                'WhatsApp Image 2025-05-25 at 4.55.34 PM (2).jpeg',
                'WhatsApp Image 2025-05-25 at 4.55.35 PM.jpeg',
                'WhatsApp Image 2025-05-25 at 4.55.35 PM (1).jpeg'
            ];
            break;
        case 's7':
            images = [
                'WhatsApp Image 2025-05-25 at 5.02.29 PM.jpeg',
                'WhatsApp Image 2025-05-25 at 5.03.33 PM.jpeg',
                'WhatsApp Image 2025-05-25 at 5.03.33 PM (1).jpeg',
                'WhatsApp Image 2025-05-25 at 5.03.33 PM (2).jpeg',
                'WhatsApp Image 2025-05-25 at 5.03.33 PM (3).jpeg'
            ];
            break;
        case 's8':
            images = [
                'WhatsApp Image 2025-05-25 at 5.04.23 PM.jpeg',
                'WhatsApp Image 2025-05-25 at 5.04.25 PM.jpeg',
                'WhatsApp Image 2025-05-25 at 5.04.26 PM.jpeg',
                'WhatsApp Image 2025-05-25 at 5.04.27 PM.jpeg',
                'WhatsApp Image 2025-05-25 at 5.04.27 PM (1).jpeg'
            ];
            break;
    }
    
    // Keep track of images for lightbox
    lightboxImages = images.map(img => folderPath + img);
    
    // Add images to container
    images.forEach((image, idx) => {
        const imgContainer = document.createElement('div');
        imgContainer.className = 'modal-image-container';
        
        const img = document.createElement('img');
        img.src = folderPath + image;
        img.alt = 'صورة المشروع';
        img.loading = 'lazy';
        
        imgContainer.appendChild(img);
        container.appendChild(imgContainer);
        
        // Add click event to open lightbox
        img.addEventListener('click', function() {
            openLightbox(folderPath + image, idx);
        });
    });
}

/**
 * Open lightbox with specific image
 * @param {string} imageSrc - Image source URL
 * @param {number} index - Image index in the gallery
 */
function openLightbox(imageSrc, index) {
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = lightbox.querySelector('img');
    
    // Set image and index
    lightboxImg.src = imageSrc;
    currentImageIndex = index;
    
    // Show lightbox
    lightbox.style.display = 'flex';
}

/**
 * Initialize categories toggle button functionality
 */
function initCategoriesToggle() {
    const toggleBtn = document.querySelector('.categories-toggle-btn');
    const hiddenCategories = document.querySelectorAll('.portfolio-category.mobile-hidden');
    
    if (toggleBtn && hiddenCategories.length > 0) {
        toggleBtn.addEventListener('click', function() {
            const isExpanded = toggleBtn.classList.contains('expanded');
            
            if (isExpanded) {
                // Collapse categories
                hiddenCategories.forEach(category => {
                    category.classList.add('mobile-hidden');
                    category.style.display = '';
                });
                toggleBtn.textContent = 'عرض المزيد';
                toggleBtn.classList.remove('expanded');
            } else {
                // Expand categories
                hiddenCategories.forEach(category => {
                    category.classList.remove('mobile-hidden');
                    category.style.display = 'block';
                });
                toggleBtn.textContent = 'عرض أقل';
                toggleBtn.classList.add('expanded');
            }
        });
        
        // Check screen size on window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                hiddenCategories.forEach(category => {
                    category.style.display = '';
                });
            } else {
                if (!toggleBtn.classList.contains('expanded')) {
                    hiddenCategories.forEach(category => {
                        category.style.display = '';
                    });
                }
            }
        });
    }
} 