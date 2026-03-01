/**
 * Guitar Lessons Islington - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all functionality
    initMobileNav();
    initSmoothScroll();
    initScrollAnimations();
    initNavbarScroll();
    initFormValidation();
});

/**
 * Mobile Navigation Toggle
 */
function initMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    if (!navToggle || !navMenu) return;

    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
}

/**
 * Smooth Scrolling for Anchor Links
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            // Skip if it's just "#"
            if (href === '#') return;

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Scroll Animations using Intersection Observer
 */
function initScrollAnimations() {
    // Add animate-on-scroll class to elements
    const animatedElements = document.querySelectorAll(
        '.service-card, .pricing-card, .testimonial-card, .about-image, .about-content, .contact-info, .contact-form-wrapper'
    );

    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll');
    });

    // Create observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all animated elements
    animatedElements.forEach(el => observer.observe(el));
}

/**
 * Navbar Background on Scroll
 */
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add/remove scrolled class based on scroll position
        if (currentScroll > 100) {
            navbar.style.background = 'rgba(10, 10, 10, 0.98)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        }

        lastScroll = currentScroll;
    });
}

/**
 * Form Validation
 */
function initFormValidation() {
    const form = document.querySelector('#contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        const name = form.querySelector('#name');
        const email = form.querySelector('#email');
        const message = form.querySelector('#message');
        let isValid = true;

        // Clear previous errors
        clearErrors(form);

        // Validate name
        if (!name.value.trim()) {
            showError(name, 'Please enter your name');
            isValid = false;
        }

        // Validate email
        if (!email.value.trim()) {
            showError(email, 'Please enter your email');
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        }

        // Validate message
        if (!message.value.trim()) {
            showError(message, 'Please enter a message');
            isValid = false;
        }

        e.preventDefault();
        if (!isValid) return;

        const btn = form.querySelector('button[type="submit"]');
        btn.textContent = 'Sending...';
        btn.disabled = true;

        fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: { 'Accept': 'application/json' }
        }).then(response => {
            if (response.ok) {
                form.innerHTML = '<p style="text-align:center;font-size:1.2rem;color:var(--accent);padding:2rem 0;">Thanks for your message! I\'ll get back to you soon.</p>';
            } else {
                btn.textContent = 'Send Message';
                btn.disabled = false;
                alert('Something went wrong. Please try again.');
            }
        }).catch(() => {
            btn.textContent = 'Send Message';
            btn.disabled = false;
            alert('Something went wrong. Please try again.');
        });
    });
}

/**
 * Helper: Validate email format
 */
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Helper: Show form error
 */
function showError(input, message) {
    const formGroup = input.closest('.form-group');
    const error = document.createElement('span');
    error.className = 'form-error';
    error.textContent = message;
    error.style.cssText = 'color: #ff4444; font-size: 0.85rem; margin-top: 5px; display: block;';
    formGroup.appendChild(error);
    input.style.borderColor = '#ff4444';
}

/**
 * Helper: Clear form errors
 */
function clearErrors(form) {
    const errors = form.querySelectorAll('.form-error');
    errors.forEach(error => error.remove());

    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.style.borderColor = '';
    });
}

/**
 * Utility: Throttle function for scroll events
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
