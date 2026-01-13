/**
 * Scroll Handler Module
 * Manages scroll events and smooth scrolling behavior
 */

import { SCROLL_CONFIG, CLASSES } from '../config/constants.js';
import { addClass, removeClass } from '../utils/dom.js';

/**
 * Initialize scroll handling
 * @param {Element} scrollContainer - The scroll container element
 * @param {Element} nav - Navigation element
 */
export function initScrollHandler(scrollContainer, nav) {
    if (!scrollContainer) {
        console.warn('Scroll container not found');
        return;
    }

    let isScrolling = false;
    let scrollTimeout;

    const handleScroll = () => {
        // Set smooth scroll behavior while scrolling
        if (!isScrolling) {
            isScrolling = true;
            scrollContainer.style.scrollBehavior = 'smooth';
        }

        // Clear existing timeout
        clearTimeout(scrollTimeout);

        // Reset scrolling flag after delay
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
        }, SCROLL_CONFIG.SCROLL_TIMEOUT);

        // Update nav appearance based on scroll position
        updateNavOnScroll(scrollContainer, nav);
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });

    // Return cleanup function
    return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
        clearTimeout(scrollTimeout);
    };
}

/**
 * Update navigation appearance on scroll
 * @param {Element} scrollContainer 
 * @param {Element} nav 
 */
function updateNavOnScroll(scrollContainer, nav) {
    if (!nav) return;

    if (scrollContainer.scrollTop > SCROLL_CONFIG.NAV_SCROLL_THRESHOLD) {
        addClass(nav, CLASSES.SCROLLED);
    } else {
        removeClass(nav, CLASSES.SCROLLED);
    }
}

/**
 * Programmatic scroll to position
 * @param {Element} scrollContainer 
 * @param {number} position 
 * @param {Function} callback 
 */
export function scrollToPosition(scrollContainer, position, callback) {
    if (!scrollContainer) return;

    addClass(scrollContainer, CLASSES.SCROLLING_PROGRAMMATICALLY);

    scrollContainer.scrollTo({
        top: position,
        behavior: 'smooth'
    });

    setTimeout(() => {
        removeClass(scrollContainer, CLASSES.SCROLLING_PROGRAMMATICALLY);
        if (callback) callback();
    }, SCROLL_CONFIG.SCROLL_LOCK_DURATION);
}