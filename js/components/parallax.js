/**
 * Parallax Effects Module
 * Creates depth effect on scroll
 */

import { PARALLAX_CONFIG } from '../config/constants.js';
import { $, throttleRAF } from '../utils/dom.js';

/**
 * Initialize parallax effect
 * @param {Element} scrollContainer 
 */
export function initParallax(scrollContainer) {
    if (!scrollContainer) {
        console.warn('Scroll container not found for parallax');
        return;
    }

    const layers = getParallaxLayers();
    
    if (!layers.hasLayers) {
        return;
    }

    // Create throttled scroll handler
    const handleParallax = throttleRAF(() => {
        updateParallaxLayers(scrollContainer.scrollTop, layers);
    });

    scrollContainer.addEventListener('scroll', handleParallax, { passive: true });

    // Return cleanup function
    return () => {
        scrollContainer.removeEventListener('scroll', handleParallax);
    };
}

/**
 * Get parallax layer elements
 * @returns {Object}
 */
function getParallaxLayers() {
    const layerFar = $('.layer-far');
    const layerMid = $('.layer-mid');
    const layerNear = $('.layer-near');

    return {
        far: layerFar,
        mid: layerMid,
        near: layerNear,
        hasLayers: !!(layerFar || layerMid || layerNear)
    };
}

/**
 * Update parallax layer positions
 * @param {number} scrollY 
 * @param {Object} layers 
 */
function updateParallaxLayers(scrollY, layers) {
    const { far, mid, near } = layers;
    const config = PARALLAX_CONFIG;

    if (far) {
        far.style.transform = `${config.LAYER_FAR.baseTransform} translateY(${scrollY * config.LAYER_FAR.speed}px)`;
    }

    if (mid) {
        mid.style.transform = `${config.LAYER_MID.baseTransform} translateY(${scrollY * config.LAYER_MID.speed}px)`;
    }

    if (near) {
        near.style.transform = `${config.LAYER_NEAR.baseTransform} translateY(${scrollY * config.LAYER_NEAR.speed}px)`;
    }
}