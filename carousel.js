/**
 * ============================================
 * 3D HORSE CAROUSEL
 * Complete carousel functionality in one file
 * ============================================
 */

(function() {
    'use strict';

    // ============================================
    // CONFIGURATION
    // ============================================
    const CONFIG = {
        // Timing
        ANIMATION_DURATION: 600,
        CLICK_DEBOUNCE: 300,
        WHEEL_DEBOUNCE: 500,
        SWIPE_THRESHOLD: 50,

        // 3D Positions for cards
        POSITIONS: {
            CENTER: {
                transform: 'translateX(0) translateZ(0) rotateY(0deg) scale(1)',
                opacity: 1
            },
            FIRST_RIGHT: {
                transform: 'translateX(200px) translateZ(-120px) rotateY(-20deg) scale(0.88)',
                opacity: 0.8
            },
            FIRST_LEFT: {
                transform: 'translateX(-200px) translateZ(-120px) rotateY(20deg) scale(0.88)',
                opacity: 0.8
            },
            SECOND_RIGHT: {
                transform: 'translateX(350px) translateZ(-250px) rotateY(-30deg) scale(0.75)',
                opacity: 0.5
            },
            SECOND_LEFT: {
                transform: 'translateX(-350px) translateZ(-250px) rotateY(30deg) scale(0.75)',
                opacity: 0.5
            },
            HIDDEN: {
                translateX: 450,
                translateZ: -400,
                rotateY: 40,
                scale: 0.6,
                opacity: 0
            }
        },

        // CSS Classes
        CLASSES: {
            ACTIVE: 'active',
            VISIBLE: 'is-visible'
        },

        // Selectors
        SELECTORS: {
            CAROUSEL: '.horse-carousel',
            TRACK: '.carousel-track',
            CARDS: '.horse-card',
            PREV_BTN: '.carousel-prev',
            NEXT_BTN: '.carousel-next',
            INDICATORS: '.carousel-indicators',
            CAROUSEL_SECTION: '#games-carousel'
        }
    };


    // ============================================
    // STATE
    // ============================================
    let state = {
        currentIndex: 0,
        totalCards: 0,
        isAnimating: false,
        clickTimeout: null,
        wheelTimeout: null
    };


    // ============================================
    // DOM ELEMENTS
    // ============================================
    let elements = {
        carousel: null,
        track: null,
        cards: null,
        prevBtn: null,
        nextBtn: null,
        indicatorsContainer: null,
        dots: null
    };


    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    
    /**
     * Query single element
     */
    function $(selector, parent = document) {
        return parent.querySelector(selector);
    }

    /**
     * Query multiple elements
     */
    function $$(selector, parent = document) {
        return parent.querySelectorAll(selector);
    }

    /**
     * Add class to element
     */
    function addClass(element, className) {
        if (element) {
            element.classList.add(className);
        }
    }

    /**
     * Remove class from element
     */
    function removeClass(element, className) {
        if (element) {
            element.classList.remove(className);
        }
    }

    /**
     * Toggle class on element
     */
    function toggleClass(element, className, force) {
        if (element) {
            element.classList.toggle(className, force);
        }
    }

    /**
     * Check if element has class
     */
    function hasClass(element, className) {
        return element ? element.classList.contains(className) : false;
    }

    /**
     * Create element
     */
    function createElement(tag, className = '') {
        const el = document.createElement(tag);
        if (className) {
            el.className = className;
        }
        return el;
    }


    // ============================================
    // CAROUSEL CORE FUNCTIONS
    // ============================================

    /**
     * Initialize the carousel
     */
    function init() {
        // Get main carousel element
        elements.carousel = $(CONFIG.SELECTORS.CAROUSEL);
        
        if (!elements.carousel) {
            console.log('Carousel not found on this page');
            return;
        }

        // Get all required elements
        elements.track = $(CONFIG.SELECTORS.TRACK, elements.carousel);
        elements.cards = $$(CONFIG.SELECTORS.CARDS, elements.carousel);
        elements.prevBtn = $(CONFIG.SELECTORS.PREV_BTN, elements.carousel);
        elements.nextBtn = $(CONFIG.SELECTORS.NEXT_BTN, elements.carousel);
        elements.indicatorsContainer = $(CONFIG.SELECTORS.INDICATORS, elements.carousel);

        // Validate required elements
        if (!elements.track || !elements.cards.length) {
            console.warn('Carousel: Required elements not found');
            return;
        }

        // Set initial state
        state.totalCards = elements.cards.length;
        state.currentIndex = 0;

        // Setup carousel
        createIndicators();
        positionCards();
        attachEventListeners();

        console.log(`Carousel initialized with ${state.totalCards} cards`);
    }

    /**
     * Create indicator dots
     */
    function createIndicators() {
        if (!elements.indicatorsContainer) return;

        // Clear existing indicators
        elements.indicatorsContainer.innerHTML = '';

        // Create dots
        for (let i = 0; i < state.totalCards; i++) {
            const dot = createElement('span', i === 0 ? 'dot active' : 'dot');
            
            dot.addEventListener('click', () => {
                if (!state.isAnimating && i !== state.currentIndex) {
                    goToSlide(i);
                }
            });
            
            elements.indicatorsContainer.appendChild(dot);
        }

        // Store reference to dots
        elements.dots = $$('.dot', elements.indicatorsContainer);
    }

    /**
     * Calculate position for a card based on offset from center
     */
    function calculateCardPosition(offset) {
        const positions = CONFIG.POSITIONS;
        let transform = '';
        let opacity = 1;
        let zIndex = state.totalCards - Math.abs(offset);
        let isActive = false;

        switch (offset) {
            case 0:
                transform = positions.CENTER.transform;
                opacity = positions.CENTER.opacity;
                isActive = true;
                break;
            case 1:
                transform = positions.FIRST_RIGHT.transform;
                opacity = positions.FIRST_RIGHT.opacity;
                break;
            case -1:
                transform = positions.FIRST_LEFT.transform;
                opacity = positions.FIRST_LEFT.opacity;
                break;
            case 2:
                transform = positions.SECOND_RIGHT.transform;
                opacity = positions.SECOND_RIGHT.opacity;
                break;
            case -2:
                transform = positions.SECOND_LEFT.transform;
                opacity = positions.SECOND_LEFT.opacity;
                break;
            default:
                // Cards further away
                const direction = offset > 0 ? 1 : -1;
                const hidden = positions.HIDDEN;
                transform = `translateX(${direction * hidden.translateX}px) translateZ(${hidden.translateZ}px) rotateY(${direction * -hidden.rotateY}deg) scale(${hidden.scale})`;
                opacity = hidden.opacity;
                break;
        }

        return { transform, opacity, zIndex, isActive };
    }

    /**
     * Position all cards in 3D space
     */
    function positionCards() {
        elements.cards.forEach((card, index) => {
            // Calculate offset from current card
            let offset = index - state.currentIndex;

            // Handle wrapping for infinite loop effect
            if (offset > state.totalCards / 2) {
                offset -= state.totalCards;
            }
            if (offset < -state.totalCards / 2) {
                offset += state.totalCards;
            }

            // Get position values
            const { transform, opacity, zIndex, isActive } = calculateCardPosition(offset);

            // Apply styles using requestAnimationFrame for smooth rendering
            requestAnimationFrame(() => {
                card.style.transform = transform;
                card.style.opacity = opacity;
                card.style.zIndex = zIndex;
            });

            // Toggle active class
            toggleClass(card, CONFIG.CLASSES.ACTIVE, isActive);
        });

        // Update indicator dots
        updateIndicators();
    }

    /**
     * Update indicator dots
     */
    function updateIndicators() {
        if (!elements.dots) return;

        elements.dots.forEach((dot, index) => {
            toggleClass(dot, CONFIG.CLASSES.ACTIVE, index === state.currentIndex);
        });
    }

    /**
     * Go to specific slide
     */
    function goToSlide(index) {
        if (state.isAnimating) return;
        
        state.isAnimating = true;

        // Handle index wrapping
        if (index < 0) {
            state.currentIndex = state.totalCards - 1;
        } else if (index >= state.totalCards) {
            state.currentIndex = 0;
        } else {
            state.currentIndex = index;
        }

        // Update card positions
        positionCards();

        // Reset animation lock after transition
        setTimeout(() => {
            state.isAnimating = false;
        }, CONFIG.ANIMATION_DURATION);
    }

    /**
     * Go to next slide
     */
    function nextSlide() {
        goToSlide(state.currentIndex + 1);
    }

    /**
     * Go to previous slide
     */
    function prevSlide() {
        goToSlide(state.currentIndex - 1);
    }


    // ============================================
    // EVENT HANDLERS
    // ============================================

    /**
     * Attach all event listeners
     */
    function attachEventListeners() {
        attachButtonEvents();
        attachKeyboardEvents();
        attachTouchEvents();
        attachWheelEvents();
    }

    /**
     * Navigation button click events
     */
    function attachButtonEvents() {
        if (elements.nextBtn) {
            elements.nextBtn.addEventListener('click', () => {
                if (state.clickTimeout) return;
                
                nextSlide();
                
                state.clickTimeout = setTimeout(() => {
                    state.clickTimeout = null;
                }, CONFIG.CLICK_DEBOUNCE);
            });
        }

        if (elements.prevBtn) {
            elements.prevBtn.addEventListener('click', () => {
                if (state.clickTimeout) return;
                
                prevSlide();
                
                state.clickTimeout = setTimeout(() => {
                    state.clickTimeout = null;
                }, CONFIG.CLICK_DEBOUNCE);
            });
        }
    }

    /**
     * Keyboard navigation (arrow keys)
     */
    function attachKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            // Only respond when carousel section is visible
            const carouselSection = $(CONFIG.SELECTORS.CAROUSEL_SECTION);
            
            if (!carouselSection || !hasClass(carouselSection, CONFIG.CLASSES.VISIBLE)) {
                return;
            }

            if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextSlide();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevSlide();
            }
        });
    }

    /**
     * Touch/swipe events for mobile
     */
    function attachTouchEvents() {
        if (!elements.track) return;

        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let isSwiping = false;

        elements.track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
            isSwiping = true;
        }, { passive: true });

        elements.track.addEventListener('touchmove', (e) => {
            if (!isSwiping) return;

            const touchCurrentX = e.changedTouches[0].screenX;
            const touchCurrentY = e.changedTouches[0].screenY;

            // Cancel swipe if vertical movement is greater (user is scrolling)
            if (Math.abs(touchCurrentY - touchStartY) > Math.abs(touchCurrentX - touchStartX)) {
                isSwiping = false;
            }
        }, { passive: true });

        elements.track.addEventListener('touchend', (e) => {
            if (!isSwiping) return;

            touchEndX = e.changedTouches[0].screenX;
            
            const diff = touchStartX - touchEndX;

            // Check if swipe distance exceeds threshold
            if (Math.abs(diff) > CONFIG.SWIPE_THRESHOLD) {
                if (diff > 0) {
                    nextSlide(); // Swipe left = next
                } else {
                    prevSlide(); // Swipe right = prev
                }
            }

            isSwiping = false;
        }, { passive: true });
    }

    /**
     * Mouse wheel/trackpad events
     */
    function attachWheelEvents() {
        if (!elements.carousel) return;

        elements.carousel.addEventListener('wheel', (e) => {
            // Only respond when carousel section is visible
            const carouselSection = $(CONFIG.SELECTORS.CAROUSEL_SECTION);
            
            if (!carouselSection || !hasClass(carouselSection, CONFIG.CLASSES.VISIBLE)) {
                return;
            }

            // Handle horizontal scroll or shift+scroll
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) {
                e.preventDefault();

                if (state.wheelTimeout) return;

                if (e.deltaX > 0 || (e.shiftKey && e.deltaY > 0)) {
                    nextSlide();
                } else {
                    prevSlide();
                }

                state.wheelTimeout = setTimeout(() => {
                    state.wheelTimeout = null;
                }, CONFIG.WHEEL_DEBOUNCE);
            }
        }, { passive: false });
    }


    // ============================================
    // PUBLIC API (Optional)
    // ============================================
    
    // Expose methods globally if needed
    window.HorseCarousel = {
        init: init,
        next: nextSlide,
        prev: prevSlide,
        goTo: goToSlide,
        getCurrentIndex: () => state.currentIndex,
        getTotalCards: () => state.totalCards
    };


    // ============================================
    // INITIALIZE ON DOM READY
    // ============================================
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM already loaded
        init();
    }

})();
