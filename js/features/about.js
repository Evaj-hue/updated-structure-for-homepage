/**
 * About Section Module
 * Handles about card click-to-expand on mobile
 */

import { $, addClass, removeClass, hasClass } from '../utils/dom.js';

/**
 * Initialize about section functionality
 */
export function initAbout() {
    const aboutCard = $('.about-card');
    
    if (!aboutCard) {
        return;
    }
    
    // Only enable click on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        attachAboutEvents(aboutCard);
    }
    
    console.log('About module initialized');
}

/**
 * Attach click events
 * @param {Element} aboutCard 
 */
function attachAboutEvents(aboutCard) {
    aboutCard.addEventListener('click', () => {
        if (hasClass(aboutCard, 'expanded')) {
            removeClass(aboutCard, 'expanded');
        } else {
            addClass(aboutCard, 'expanded');
        }
    });
    
    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.about-card')) {
            removeClass(aboutCard, 'expanded');
        }
    });
}