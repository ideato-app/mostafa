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
                    
                    // Trigger AOS refresh for newly visible elements
                    setTimeout(() => {
                        AOS.refresh();
                    }, 100);
                });
            } else {
                portfolioSections.forEach(section => {
                    if (section.getAttribute('data-category') === filter) {
                        section.style.display = 'block';
                    } else {
                        section.style.display = 'none';
                    }
                });
                
                // Trigger AOS refresh for newly visible elements
                setTimeout(() => {
                    AOS.refresh();
                }, 100);
            }
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
            const description = this.querySelector('p').textContent;
            
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
    modalDescription.textContent = description;
    
    // Set category based on folder name
    let categoryName = '';
    switch (folder) {
        case 's1':
            categoryName = 'تصميم البراندات';
            break;
        case 's2':
            categoryName = 'الإعلانات التسويقية';
            break;
        case 's3':
            categoryName = 'تصاميم السوشيال ميديا';
            break;
        case 's4':
            categoryName = 'التغليف والمنتجات';
            break;
        case 's5':
            categoryName = 'الهويات البصرية';
            break;
        case 's7':
            categoryName = 'المطبوعات الإعلانية';
            break;
        case 's8':
            categoryName = 'تصميم الويب والتطبيقات';
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
                'WhatsApp Image 2025-05-25 at 4.45.11 PM (1).jpeg',
                'WhatsApp Image 2025-05-25 at 4.45.11 PM (2).jpeg',
                'WhatsApp Image 2025-05-25 at 4.45.11 PM (3).jpeg'
            ];
            break;
        case 's4':
            images = [
                'WhatsApp Image 2025-05-25 at 4.47.00 PM.jpeg',
                'WhatsApp Image 2025-05-25 at 4.47.00 PM (1).jpeg',
                'WhatsApp Image 2025-05-25 at 4.47.02 PM.jpeg',
                'WhatsApp Image 2025-05-25 at 4.47.06 PM.jpeg',
                'WhatsApp Image 2025-05-25 at 4.47.07 PM.jpeg',
                'WhatsApp Image 2025-05-25 at 4.47.07 PM (1).jpeg',
                'WhatsApp Image 2025-05-25 at 4.47.08 PM.jpeg',
                'WhatsApp Image 2025-05-25 at 4.47.08 PM (1).jpeg',
                'WhatsApp Image 2025-05-25 at 4.47.08 PM (2).jpeg',
                'WhatsApp Image 2025-05-25 at 4.47.09 PM.jpeg',
                'WhatsApp Image 2025-05-25 at 4.47.11 PM.jpeg',
                'WhatsApp Image 2025-05-25 at 4.47.11 PM (1).jpeg'
            ];
            break;
        case 's5':
            images = [
                'WhatsApp Image 2025-05-25 at 4.55.34 PM.jpeg',
                'WhatsApp Image 2025-05-25 at 4.55.34 PM (1).jpeg',
                'WhatsApp Image 2025-05-25 at 4.55.34 PM (2).jpeg',
                'WhatsApp Image 2025-05-25 at 4.55.35 PM.jpeg',
                'WhatsApp Image 2025-05-25 at 4.55.35 PM (1).jpeg',
                'WhatsApp Image 2025-05-25 at 4.55.35 PM (2).jpeg',
                'WhatsApp Image 2025-05-25 at 4.55.35 PM (3).jpeg',
                'WhatsApp Image 2025-05-25 at 4.55.35 PM (4).jpeg',
                'WhatsApp Image 2025-05-25 at 4.55.35 PM (5).jpeg',
                'WhatsApp Image 2025-05-25 at 4.55.36 PM.jpeg',
                'WhatsApp Image 2025-05-25 at 4.55.36 PM (1).jpeg',
                'WhatsApp Image 2025-05-25 at 4.55.36 PM (2).jpeg'
            ];
            break;
        case 's7':
            images = [
                'WhatsApp Image 2025-05-25 at 5.02.29 PM.jpeg',
                'WhatsApp Image 2025-05-25 at 5.03.33 PM.jpeg',
                'WhatsApp Image 2025-05-25 at 5.03.33 PM (1).jpeg',
                'WhatsApp Image 2025-05-25 at 5.03.33 PM (2).jpeg',
                'WhatsApp Image 2025-05-25 at 5.03.33 PM (3).jpeg',
                'WhatsApp Image 2025-05-25 at 5.03.35 PM.jpeg',
                'WhatsApp Image 2025-05-25 at 5.03.35 PM (1).jpeg',
                'WhatsApp Image 2025-05-25 at 5.03.36 PM.jpeg',
                'WhatsApp Image 2025-05-25 at 5.03.36 PM (1).jpeg',
                'WhatsApp Image 2025-05-25 at 5.03.36 PM (2).jpeg',
                'WhatsApp Image 2025-05-25 at 5.03.36 PM (3).jpeg',
                'WhatsApp Image 2025-05-25 at 5.03.37 PM.jpeg'
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
        const img = document.createElement('img');
        img.src = folderPath + image;
        img.alt = 'صورة المشروع';
        img.loading = 'lazy';
        container.appendChild(img);
        
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