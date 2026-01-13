/**
 * Intersection Observer Module
 * Handles card visibility and active navigation state
 */

import { OBSERVER_CONFIG, CLASSES } from '../config/constants.js';
import { addClass, removeClass, $ } from '../utils/dom.js';

/**
 * Initialize intersection observer for cards
 * @param {Element} scrollContainer - Root element for observer
 * @param {NodeList} cards - Card elements to observe
 * @param {NodeList} navLinks - Navigation links
 */
export function initIntersectionObserver(scrollContainer, cards, navLinks) {
    if (!cards.length || !navLinks.length) {
        console.warn('Cards or nav links not found for intersection observer');
        return;
    }

    const observerOptions = {
        root: scrollContainer,
        threshold: OBSERVER_CONFIG.THRESHOLD,
        rootMargin: OBSERVER_CONFIG.ROOT_MARGIN
    };

    const observer = new IntersectionObserver((entries) => {
        handleIntersection(entries, navLinks);
    }, observerOptions);

    // Observe all cards
    cards.forEach(card => observer.observe(card));

    // Return cleanup function
    return () => {
        cards.forEach(card => observer.unobserve(card));
        observer.disconnect();
    };
}

/**
 * Handle intersection changes
 * @param {IntersectionObserverEntry[]} entries 
 * @param {NodeList} navLinks 
 */
function handleIntersection(entries, navLinks) {
    entries.forEach(entry => {
        const id = entry.target.getAttribute('id');
        const correspondingLink = $(`nav a[href="#${id}"]`);

        if (entry.isIntersecting) {
            const ratio = entry.intersectionRatio;

            // Add visibility class when threshold met
            if (ratio >= OBSERVER_CONFIG.VISIBILITY_THRESHOLD) {
                addClass(entry.target, CLASSES.VISIBLE);

                // Update active nav link when fully visible
                if (ratio >= OBSERVER_CONFIG.ACTIVE_THRESHOLD) {
                    updateActiveNavLink(navLinks, correspondingLink);
                }
            }
        } else {
            removeClass(entry.target, CLASSES.VISIBLE);
        }
    });
}

/**
 * Update active navigation link
 * @param {NodeList} navLinks 
 * @param {Element} activeLink 
 */
function updateActiveNavLink(navLinks, activeLink) {
    navLinks.forEach(link => removeClass(link, CLASSES.ACTIVE));
    
    if (activeLink) {
        addClass(activeLink, CLASSES.ACTIVE);
    }
}