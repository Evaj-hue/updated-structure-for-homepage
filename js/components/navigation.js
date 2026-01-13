/**
 * Navigation Module
 * Handles navigation click events and smooth scrolling to sections
 */

import { SCROLL_CONFIG } from '../config/constants.js';
import { scrollToPosition } from '../features/scroll-handler.js';
import { $ } from '../utils/dom.js';

/**
 * Initialize navigation functionality
 * @param {NodeList} navLinks - Navigation link elements
 * @param {Element} scrollContainer - Scroll container element
 */
export function initNavigation(navLinks, scrollContainer) {
    if (!navLinks.length || !scrollContainer) {
        console.warn('Navigation links or scroll container not found');
        return;
    }

    let scrollLock = false;

    const handleNavClick = (event) => {
        event.preventDefault();

        if (scrollLock) return;
        scrollLock = true;

        const targetId = event.currentTarget.getAttribute('href');
        const targetSection = $(targetId);

        if (targetSection) {
            const targetPosition = targetSection.offsetTop;
            
            scrollToPosition(scrollContainer, targetPosition, () => {
                scrollLock = false;
            });
        } else {
            scrollLock = false;
        }
    };

    // Attach click handlers
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });

    // Return cleanup function
    return () => {
        navLinks.forEach(link => {
            link.removeEventListener('click', handleNavClick);
        });
    };
}