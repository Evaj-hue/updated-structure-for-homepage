/**
 * Application Constants
 * Centralized configuration values
 */

export const SCROLL_CONFIG = {
    SCROLL_TIMEOUT: 150,
    NAV_SCROLL_THRESHOLD: 50,
    SCROLL_LOCK_DURATION: 1000
};

export const OBSERVER_CONFIG = {
    THRESHOLD: [0, 0.2, 0.4, 0.6, 0.8, 1],
    ROOT_MARGIN: '-10% 0px -10% 0px',
    VISIBILITY_THRESHOLD: 0.4,
    ACTIVE_THRESHOLD: 0.6
};

export const CAROUSEL_CONFIG = {
    ANIMATION_DURATION: 600,
    CLICK_DEBOUNCE: 300,
    WHEEL_DEBOUNCE: 500,
    SWIPE_THRESHOLD: 50,
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
    }
};

export const PARALLAX_CONFIG = {
    LAYER_FAR: {
        baseTransform: 'translateZ(-1500px) scale(2.5)',
        speed: 0.1
    },
    LAYER_MID: {
        baseTransform: 'translateZ(-1000px) scale(2)',
        speed: 0.15
    },
    LAYER_NEAR: {
        baseTransform: 'translateZ(-500px) scale(1.5)',
        speed: 0.2
    }
};

export const CLASSES = {
    SCROLLED: 'scrolled',
    ACTIVE: 'active',
    VISIBLE: 'is-visible',
    SCROLLING_PROGRAMMATICALLY: 'is-scrolling-programmatically'
};