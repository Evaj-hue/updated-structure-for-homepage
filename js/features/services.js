/**
 * Services Module
 * Handles service list interactions and animations
 */

import { $, $$, addClass, removeClass, hasClass } from '../utils/dom.js';

/**
 * Initialize services functionality
 */
export function initServices() {
    const serviceItems = $$('.service-item');
    
    if (!serviceItems.length) {
        return;
    }
    
    attachServiceEvents(serviceItems);
    
    console.log('Services module initialized');
}

/**
 * Attach click events to service items
 * @param {NodeList} serviceItems 
 */
function attachServiceEvents(serviceItems) {
    serviceItems.forEach(item => {
        item.addEventListener('click', () => {
            handleServiceClick(item, serviceItems);
        });
    });
    
    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.service-item')) {
            closeAllServices(serviceItems);
        }
    });
}

/**
 * Handle service item click
 * @param {Element} clickedItem 
 * @param {NodeList} allItems 
 */
function handleServiceClick(clickedItem, allItems) {
    // Close all other items
    allItems.forEach(item => {
        if (item !== clickedItem) {
            removeClass(item, 'expanded');
        }
    });
    
    // Toggle current item
    if (hasClass(clickedItem, 'expanded')) {
        removeClass(clickedItem, 'expanded');
    } else {
        addClass(clickedItem, 'expanded');
    }
}

/**
 * Close all service items
 * @param {NodeList} serviceItems 
 */
function closeAllServices(serviceItems) {
    serviceItems.forEach(item => {
        removeClass(item, 'expanded');
    });
}