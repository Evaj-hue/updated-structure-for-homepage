/**
 * Modal Module
 * Handles guidebook modal functionality
 */

import { $, $$, addClass, removeClass, hasClass } from '../utils/dom.js';

/**
 * Initialize modal functionality
 */
export function initModal() {
    const modal = $('#guidebookModal');
    
    if (!modal) {
        return;
    }

    const elements = getModalElements(modal);
    
    // Attach event listeners
    attachModalEvents(modal, elements);
    
    // Initialize tabs
    initTabs(elements.tabBtns, elements.tabPanes);
}

/**
 * Get modal DOM elements
 * @param {Element} modal 
 * @returns {Object}
 */
function getModalElements(modal) {
    return {
        modal,
        openBtn: $('#openGuidebook'),
        closeBtn: $('#closeModal'),
        closeFooterBtn: $('#closeModalBtn'),
        tabBtns: $$('.tab-btn'),
        tabPanes: $$('.tab-pane')
    };
}

/**
 * Open modal
 * @param {Element} modal 
 */
export function openModal(modal) {
    if (!modal) return;
    
    addClass(modal, 'active');
    document.body.style.overflow = 'hidden';
}

/**
 * Close modal
 * @param {Element} modal 
 */
export function closeModal(modal) {
    if (!modal) return;
    
    removeClass(modal, 'active');
    document.body.style.overflow = '';
}

/**
 * Initialize tab switching
 * @param {NodeList} tabBtns 
 * @param {NodeList} tabPanes 
 */
function initTabs(tabBtns, tabPanes) {
    if (!tabBtns.length) return;

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            // Remove active from all
            tabBtns.forEach(b => removeClass(b, 'active'));
            tabPanes.forEach(p => removeClass(p, 'active'));
            
            // Add active to clicked
            addClass(btn, 'active');
            
            const targetPane = $(`#${targetTab}`);
            if (targetPane) {
                addClass(targetPane, 'active');
            }
        });
    });
}

/**
 * Attach modal event listeners
 * @param {Element} modal 
 * @param {Object} elements 
 */
function attachModalEvents(modal, elements) {
    const { openBtn, closeBtn, closeFooterBtn } = elements;

    // Open button
    if (openBtn) {
        openBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(modal);
        });
    }

    // Close button (X)
    if (closeBtn) {
        closeBtn.addEventListener('click', () => closeModal(modal));
    }

    // Close button (footer)
    if (closeFooterBtn) {
        closeFooterBtn.addEventListener('click', () => closeModal(modal));
    }

    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && hasClass(modal, 'active')) {
            closeModal(modal);
        }
    });
}