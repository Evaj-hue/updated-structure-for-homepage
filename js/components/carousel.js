/**
 * 3D Horse Carousel Module
 * Handles carousel functionality with 3D transforms
 */

import { CAROUSEL_CONFIG, CLASSES } from '../config/constants.js';
import { $, $$, addClass, removeClass, toggleClass, createElement, hasClass } from '../utils/dom.js';

/**
 * Initialize the carousel
 */
export function initCarousel() {
    const carousel = $('.horse-carousel');
    
    if (!carousel) {
        return;
    }

    const elements = getCarouselElements(carousel);
    
    if (!elements) return;

    const state = createCarouselState(elements.horseCards.length);
    
    // Initialize
    createIndicators(elements.indicatorsContainer, state.totalCards, state, elements);
    positionCards(elements, state);
    
    // Attach event listeners
    attachCarouselEvents(carousel, elements, state);
}

/**
 * Get carousel DOM elements
 * @param {Element} carousel 
 * @returns {Object|null}
 */
function getCarouselElements(carousel) {
    const track = $('.carousel-track', carousel);
    const horseCards = $$('.horse-card', carousel);
    const prevBtn = $('.carousel-prev', carousel);
    const nextBtn = $('.carousel-next', carousel);
    const indicatorsContainer = $('.carousel-indicators', carousel);

    if (!track || !horseCards.length) {
        console.warn('Carousel elements not found');
        return null;
    }

    return {
        carousel,
        track,
        horseCards,
        prevBtn,
        nextBtn,
        indicatorsContainer,
        dots: null // Will be set after indicators are created
    };
}

/**
 * Create carousel state object
 * @param {number} totalCards 
 * @returns {Object}
 */
function createCarouselState(totalCards) {
    return {
        totalCards,
        currentIndex: 0,
        isAnimating: false,
        clickTimeout: null,
        wheelTimeout: null
    };
}

/**
 * Create indicator dots
 * @param {Element} container 
 * @param {number} count 
 * @param {Object} state 
 * @param {Object} elements 
 */
function createIndicators(container, count, state, elements) {
    if (!container) return;

    for (let i = 0; i < count; i++) {
        const dot = createElement('span', {
            className: i === 0 ? 'dot active' : 'dot'
        });
        
        dot.addEventListener('click', () => {
            if (!state.isAnimating && i !== state.currentIndex) {
                goToSlide(i, state, elements);
            }
        });
        
        container.appendChild(dot);
    }

    elements.dots = $$('.dot', container);
}

/**
 * Position cards in 3D space
 * @param {Object} elements 
 * @param {Object} state 
 */
function positionCards(elements, state) {
    const { horseCards, dots } = elements;
    const { currentIndex, totalCards } = state;
    const positions = CAROUSEL_CONFIG.POSITIONS;

    horseCards.forEach((card, index) => {
        let offset = index - currentIndex;

        // Handle wrapping
        if (offset > totalCards / 2) offset -= totalCards;
        if (offset < -totalCards / 2) offset += totalCards;

        const { transform, opacity, zIndex, isActive } = calculateCardPosition(offset, totalCards, positions);

        requestAnimationFrame(() => {
            card.style.transform = transform;
            card.style.opacity = opacity;
            card.style.zIndex = zIndex;
        });

        toggleClass(card, CLASSES.ACTIVE, isActive);
    });

    // Update indicators
    if (dots) {
        dots.forEach((dot, index) => {
            toggleClass(dot, CLASSES.ACTIVE, index === currentIndex);
        });
    }
}

/**
 * Calculate card position based on offset
 * @param {number} offset 
 * @param {number} totalCards 
 * @param {Object} positions 
 * @returns {Object}
 */
function calculateCardPosition(offset, totalCards, positions) {
    let transform = '';
    let opacity = 1;
    let zIndex = totalCards - Math.abs(offset);
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
            const direction = offset > 0 ? 1 : -1;
            const hidden = positions.HIDDEN;
            transform = `translateX(${direction * hidden.translateX}px) translateZ(${hidden.translateZ}px) rotateY(${direction * -hidden.rotateY}deg) scale(${hidden.scale})`;
            opacity = hidden.opacity;
            break;
    }

    return { transform, opacity, zIndex, isActive };
}

/**
 * Navigate to specific slide
 * @param {number} index 
 * @param {Object} state 
 * @param {Object} elements 
 */
function goToSlide(index, state, elements) {
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

    positionCards(elements, state);

    setTimeout(() => {
        state.isAnimating = false;
    }, CAROUSEL_CONFIG.ANIMATION_DURATION);
}

/**
 * Go to next slide
 * @param {Object} state 
 * @param {Object} elements 
 */
function nextSlide(state, elements) {
    goToSlide(state.currentIndex + 1, state, elements);
}

/**
 * Go to previous slide
 * @param {Object} state 
 * @param {Object} elements 
 */
function prevSlide(state, elements) {
    goToSlide(state.currentIndex - 1, state, elements);
}

/**
 * Attach all carousel event listeners
 * @param {Element} carousel 
 * @param {Object} elements 
 * @param {Object} state 
 */
function attachCarouselEvents(carousel, elements, state) {
    const { track, prevBtn, nextBtn } = elements;

    // Button click handlers with debounce
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (state.clickTimeout) return;
            nextSlide(state, elements);
            state.clickTimeout = setTimeout(() => {
                state.clickTimeout = null;
            }, CAROUSEL_CONFIG.CLICK_DEBOUNCE);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (state.clickTimeout) return;
            prevSlide(state, elements);
            state.clickTimeout = setTimeout(() => {
                state.clickTimeout = null;
            }, CAROUSEL_CONFIG.CLICK_DEBOUNCE);
        });
    }

    // Keyboard navigation
    attachKeyboardEvents(state, elements);

    // Touch events
    attachTouchEvents(track, state, elements);

    // Wheel events
    attachWheelEvents(carousel, state, elements);
}

/**
 * Attach keyboard event listeners
 * @param {Object} state 
 * @param {Object} elements 
 */
function attachKeyboardEvents(state, elements) {
    document.addEventListener('keydown', (e) => {
        const carouselSection = $('#games-carousel');
        
        if (carouselSection && hasClass(carouselSection, CLASSES.VISIBLE)) {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextSlide(state, elements);
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevSlide(state, elements);
            }
        }
    });
}

/**
 * Attach touch event listeners
 * @param {Element} track 
 * @param {Object} state 
 * @param {Object} elements 
 */
function attachTouchEvents(track, state, elements) {
    if (!track) return;

    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let isSwiping = false;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
        isSwiping = true;
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
        if (!isSwiping) return;
        
        const touchCurrentX = e.changedTouches[0].screenX;
        const touchCurrentY = e.changedTouches[0].screenY;
        
        // Cancel if vertical scroll
        if (Math.abs(touchCurrentY - touchStartY) > Math.abs(touchCurrentX - touchStartX)) {
            isSwiping = false;
        }
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        if (!isSwiping) return;
        
        touchEndX = e.changedTouches[0].screenX;
        
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > CAROUSEL_CONFIG.SWIPE_THRESHOLD) {
            if (diff > 0) {
                nextSlide(state, elements);
            } else {
                prevSlide(state, elements);
            }
        }
        
        isSwiping = false;
    }, { passive: true });
}

/**
 * Attach wheel event listeners
 * @param {Element} carousel 
 * @param {Object} state 
 * @param {Object} elements 
 */
function attachWheelEvents(carousel, state, elements) {
    carousel.addEventListener('wheel', (e) => {
        const carouselSection = $('#games-carousel');
        
        if (!carouselSection || !hasClass(carouselSection, CLASSES.VISIBLE)) return;

        // Handle horizontal scroll or shift+scroll
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) {
            e.preventDefault();
            
            if (state.wheelTimeout) return;
            
            if (e.deltaX > 0 || (e.shiftKey && e.deltaY > 0)) {
                nextSlide(state, elements);
            } else {
                prevSlide(state, elements);
            }
            
            state.wheelTimeout = setTimeout(() => {
                state.wheelTimeout = null;
            }, CAROUSEL_CONFIG.WHEEL_DEBOUNCE);
        }
    }, { passive: false });
}

// Export for external use if needed
export { goToSlide, nextSlide, prevSlide };