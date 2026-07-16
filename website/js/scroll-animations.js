/**
 * Scroll Animations Controller
 * Coordinates the 4-phase sticky narrative section reveals and SVG diagram animation triggers.
 */

document.addEventListener('DOMContentLoaded', () => {
    const narrativeSection = document.getElementById('hero-narrative');
    const narrativeSteps = document.querySelectorAll('.narrative-step');
    const visualWrappers = document.querySelectorAll('.visual-wrapper');

    // 1. Sticky Scroll Narrative Reveals
    function handleNarrativeScroll() {
        if (!narrativeSection) return;

        const rect = narrativeSection.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Check if the section is currently overlapping the viewport
        if (rect.top <= 0 && rect.bottom >= 0) {
            const totalScrollable = rect.height - viewportHeight;
            const scrolled = -rect.top;
            
            // Calculate ratio (0 to 1)
            let ratio = scrolled / totalScrollable;
            ratio = Math.max(0, Math.min(1, ratio));

            // Map ratio to 4 steps
            let activeStepIndex = 0;
            if (ratio >= 0 && ratio < 0.25) {
                activeStepIndex = 1;
            } else if (ratio >= 0.25 && ratio < 0.50) {
                activeStepIndex = 2;
            } else if (ratio >= 0.50 && ratio < 0.75) {
                activeStepIndex = 3;
            } else {
                activeStepIndex = 4;
            }

            // Update DOM states if step changes
            updateNarrativeDOM(activeStepIndex);
        } else if (rect.top > 0) {
            // Above scroller, ensure Phase 1 is selected
            updateNarrativeDOM(1);
        } else if (rect.bottom < 0) {
            // Below scroller, ensure Phase 4 is selected
            updateNarrativeDOM(4);
        }
    }

    function updateNarrativeDOM(stepIndex) {
        narrativeSteps.forEach((step, idx) => {
            const stepNum = parseInt(step.getAttribute('data-step'), 10);
            if (stepNum === stepIndex) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        visualWrappers.forEach((wrapper, idx) => {
            if (idx + 1 === stepIndex) {
                wrapper.classList.add('active');
            } else {
                wrapper.classList.remove('active');
            }
        });
    }

    // Bind scroll handler
    window.addEventListener('scroll', handleNarrativeScroll, { passive: true });
    // Run once on load to establish positions
    handleNarrativeScroll();


    // 2. Systems Architecture Diagram Animation Trigger
    const archDiagram = document.getElementById('arch-diagram');
    if (archDiagram) {
        const archObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    archDiagram.classList.add('scrolled-in');
                    // Once animated, we don't strictly need to un-animate
                    archObserver.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '0px 0px -20% 0px', // Trigger when 20% in view
            threshold: 0.15
        });

        archObserver.observe(archDiagram);
    }
});
