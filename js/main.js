/**
 * Main Application Entry Point
 * Initializes all modules when DOM is ready
 */

import { initScrollHandler } from './features/scroll-handler.js';
import { initIntersectionObserver } from './features/intersection-observer.js';
import { initNavigation } from './components/navigation.js';
import { initCarousel } from './components/carousel.js';
import { initParallax } from './components/parallax.js';
import { initModal } from './components/modal.js';
import { initServices } from './features/services.js';
import { initAbout } from './features/about.js';

document.addEventListener('DOMContentLoaded', function() {
    // Get shared DOM elements
    const scrollContainer = document.querySelector('.scroll-container');
    const navLinks = document.querySelectorAll('nav a');
    const cards = document.querySelectorAll('.card');
    const nav = document.querySelector('nav');

    // Initialize all modules
    initScrollHandler(scrollContainer, nav);
    initIntersectionObserver(scrollContainer, cards, navLinks);
    initNavigation(navLinks, scrollContainer);
    initCarousel();
    initParallax(scrollContainer);
    initModal();
    initServices();
    initAbout();
});