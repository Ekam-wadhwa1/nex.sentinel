/**
 * Router - Section Navigation & Header State Controller
 * Manages IntersectionObservers on page sections to update sticky menu active links,
 * and handles hash-routing logic for the recovery 404 panel and editing mode.
 */

document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    const sections = document.querySelectorAll('main > section, #evolution-scroll');
    const navLinks = document.querySelectorAll('.nav-link');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');

    // 1. Header scroll visual transformation (scrolled background blur)
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });

    // 2. IntersectionObserver to automatically update active nav state while scrolling
    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -40% 0px', // Trigger when section occupies screen central core
        threshold: 0.1
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                let id = entry.target.getAttribute('id');
                // Special mapping for scroller
                if (id === 'hero-narrative') {
                    // Highlight 'Home' or 'Project' depending on narrative context
                    // We map the storytelling to the Home item.
                    id = 'home';
                }
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // 3. Mobile Navigation Menu Toggle behavior
    if (menuToggle && navLinksContainer) {
        menuToggle.addEventListener('click', () => {
            navLinksContainer.classList.toggle('mobile-active');
            
            // Transform hamburger icon (change styling/paths)
            const icon = menuToggle.querySelector('svg');
            if (navLinksContainer.classList.contains('mobile-active')) {
                icon.innerHTML = '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>';
            } else {
                icon.innerHTML = '<line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>';
            }
        });

        // Close mobile nav when clicking a menu link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('mobile-active');
                const icon = menuToggle.querySelector('svg');
                icon.innerHTML = '<line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>';
            });
        });
    }

    // 4. Smooth Anchor Link Navigation click intercept
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerHeight = 70;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // 5. Hash Routing Logic for Visual Editor and 404 Recovery Console
    const checkRoute = () => {
        const hash = window.location.hash || '#home';
        const validHashes = ['#home', '#project', '#architecture', '#robots', '#about'];
        
        const errorView = document.getElementById('error-view');
        const standardLayout = document.getElementById('standard-layout');
        const editorToolbar = document.getElementById('editor-toolbar');
        
        if (hash === '#edit') {
            const isUnlocked = localStorage.getItem('sentinel_unlocked') === 'true';
            
            if (isUnlocked) {
                // Show standard layout, enable editing mode
                if (errorView) errorView.classList.add('hidden');
                if (standardLayout) standardLayout.classList.remove('hidden');
                
                document.body.classList.add('edit-enabled');
                if (editorToolbar) editorToolbar.classList.remove('hidden');
                
                // Enable inline content editing for data-edit-id tags (exclude images)
                const editables = document.querySelectorAll('[data-edit-id]');
                editables.forEach(el => {
                    if (el.tagName.toLowerCase() !== 'img') {
                        el.setAttribute('contenteditable', 'true');
                    }
                });
            } else {
                // Redirect user to error page since not authenticated
                window.location.hash = '#404';
            }
        } else if (validHashes.includes(hash)) {
            // Disable edit mode
            document.body.classList.remove('edit-enabled');
            if (editorToolbar) editorToolbar.classList.add('hidden');
            
            const editables = document.querySelectorAll('[data-edit-id]');
            editables.forEach(el => {
                el.removeAttribute('contenteditable');
            });
            
            if (errorView) errorView.classList.add('hidden');
            if (standardLayout) standardLayout.classList.remove('hidden');
            
            // Scroll to target section
            const targetElement = document.querySelector(hash);
            if (targetElement) {
                const headerHeight = 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        } else {
            // Treat unrecognized hashes as 404 Page Coordinates
            document.body.classList.remove('edit-enabled');
            if (editorToolbar) editorToolbar.classList.add('hidden');
            
            if (standardLayout) standardLayout.classList.add('hidden');
            if (errorView) errorView.classList.remove('hidden');
            
            // Focus Input field
            const keyInput = document.getElementById('override-key');
            if (keyInput) {
                keyInput.value = '';
                keyInput.focus();
            }
            
            // Reset feedback logs
            const errFeedback = document.getElementById('error-feedback');
            const successFeedback = document.getElementById('success-feedback');
            if (errFeedback) errFeedback.classList.add('hidden');
            if (successFeedback) successFeedback.classList.add('hidden');
        }
    };

    // Bind route changes
    window.addEventListener('hashchange', checkRoute);
    
    // Execute routing check on DOM bootstrap
    checkRoute();

    // 6. Keyboard Shortcut: Ctrl+Shift+Alt opens the 404 recovery terminal
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.altKey) {
            e.preventDefault();
            window.location.hash = '#404';
        }
    });
});
