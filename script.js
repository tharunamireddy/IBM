// Mobile Menu Toggle
function toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
}

// Toggle Solution/Answer Content
function toggleContent(button) {
    const content = button.nextElementSibling;
    content.classList.toggle('active');
    
    if (content.classList.contains('active')) {
        button.textContent = 'Hide Solution';
    } else {
        button.textContent = 'Show Solution';
    }
}

// Filter Questions by Difficulty
function filterQuestions(difficulty) {
    const questionCards = document.querySelectorAll('.question-card');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // Update active button
    filterBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filter cards
    questionCards.forEach(card => {
        if (difficulty === 'all') {
            card.style.display = 'block';
        } else {
            const cardDifficulty = card.getAttribute('data-difficulty');
            card.style.display = cardDifficulty === difficulty ? 'block' : 'none';
        }
    });
}

// Accordion Toggle
function toggleAccordion(header) {
    const accordionItem = header.parentElement;
    const isActive = accordionItem.classList.contains('active');
    
    // Close all accordion items
    document.querySelectorAll('.accordion-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Open clicked item if it wasn't active
    if (!isActive) {
        accordionItem.classList.add('active');
    }
}

// Switch Language Tabs
function switchLanguage(language) {
    // Update active tab
    const langTabs = document.querySelectorAll('.lang-tab');
    langTabs.forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    
    // Show corresponding content
    const langContents = document.querySelectorAll('.lang-content');
    langContents.forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${language}-content`).classList.add('active');
}

// Save Checklist Progress to LocalStorage
function saveProgress() {
    const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    const progress = Array.from(checkboxes).map(cb => cb.checked);
    localStorage.setItem('ibm-prep-checklist', JSON.stringify(progress));
    
    // Show feedback
    showNotification('Progress saved!');
}

// Load Checklist Progress from LocalStorage
function loadProgress() {
    const saved = localStorage.getItem('ibm-prep-checklist');
    if (saved) {
        const progress = JSON.parse(saved);
        const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
        checkboxes.forEach((cb, index) => {
            if (progress[index]) {
                cb.checked = true;
            }
        });
    }
}

// Show Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #0f62fe;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 4px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Smooth Scroll for Anchor Links
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

// Initialize on Page Load
document.addEventListener('DOMContentLoaded', function() {
    // Load saved progress for checklist
    loadProgress();
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const navLinks = document.getElementById('navLinks');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        
        if (navLinks && navLinks.classList.contains('active')) {
            if (!navLinks.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
                navLinks.classList.remove('active');
            }
        }
    });
    
    // Add scroll-to-top button
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '↑';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: #0f62fe;
        color: white;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        display: none;
        z-index: 1000;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: all 0.3s;
    `;
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollBtn);
    
    // Show/hide scroll button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollBtn.style.display = 'block';
        } else {
            scrollBtn.style.display = 'none';
        }
    });
    
    // Scroll to top on click
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Highlight code blocks (basic syntax highlighting)
    document.querySelectorAll('pre code').forEach(block => {
        // Simple syntax highlighting for comments
        let html = block.innerHTML;
        html = html.replace(/(\/\/.*)/g, '<span style="color: #6a9955;">$1</span>');
        html = html.replace(/(\/\*[\s\S]*?\*\/)/g, '<span style="color: #6a9955;">$1</span>');
        block.innerHTML = html;
    });
});

// Print functionality
function printPage() {
    window.print();
}

// Share functionality (if needed)
function sharePage() {
    if (navigator.share) {
        navigator.share({
            title: document.title,
            url: window.location.href
        }).catch(err => console.log('Error sharing:', err));
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
            showNotification('Link copied to clipboard!');
        });
    }
}