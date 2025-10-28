/**
 * ServiLocal - JavaScript Global Base
 * Funcionalidad compartida por todas las páginas
 */

// Variables globales
let lastScrollY = window.scrollY;

const RESPONSIVE_MENU_WRAPPER_SELECTOR = '.navigation_container';
const RESPONSIVE_MENU_OPEN_CLASS = 'rm-opened';
const FAB_SELECTOR = '.fab';
const FAB_TOGGLE_SELECTOR = '.fab__toggle';
const FAB_MENU_SELECTOR = '.fab__menu';
const FAB_OPEN_CLASS = 'fab--open';

function closeMobileMenu() {
    const wrapper = document.querySelector(RESPONSIVE_MENU_WRAPPER_SELECTOR);
    if (!wrapper) return;

    const menuElement = wrapper.querySelector('.navbar-menu');
    if (!menuElement) return;

    if (menuElement.classList.contains(RESPONSIVE_MENU_OPEN_CLASS)) {
        const toggleButton = wrapper.querySelector('.rm-togglebutton');
        if (toggleButton) {
            toggleButton.click();
        } else {
            menuElement.classList.remove(RESPONSIVE_MENU_OPEN_CLASS);
            document.body.classList.remove('has-opened-menu');
        }
    }
}

function getUserMenuElements() {
    const userToggle = document.querySelector('.user-menu-toggle');
    const userDropdown = document.querySelector('.user-dropdown');

    if (!userToggle || !userDropdown) return null;
    return { userToggle, userDropdown };
}

function openUserMenu() {
    const elements = getUserMenuElements();
    if (!elements) return;

    const { userToggle, userDropdown } = elements;
    userDropdown.style.opacity = '1';
    userDropdown.style.visibility = 'visible';
    userDropdown.style.transform = 'translateY(0)';
    userToggle.setAttribute('aria-expanded', 'true');
}

function closeUserMenu() {
    const elements = getUserMenuElements();
    if (!elements) return;

    const { userToggle, userDropdown } = elements;
    userDropdown.style.opacity = '0';
    userDropdown.style.visibility = 'hidden';
    userDropdown.style.transform = 'translateY(-10px)';
    userToggle.setAttribute('aria-expanded', 'false');
}

function isUserMenuOpen() {
    const elements = getUserMenuElements();
    if (!elements) return false;

    return elements.userToggle.getAttribute('aria-expanded') === 'true';
}

function getFabElements() {
    const fab = document.querySelector(FAB_SELECTOR);
    if (!fab) return null;

    const toggle = fab.querySelector(FAB_TOGGLE_SELECTOR);
    const menu = fab.querySelector(FAB_MENU_SELECTOR);

    if (!toggle || !menu) return null;
    return { fab, toggle, menu };
}

function openFabMenu() {
    const elements = getFabElements();
    if (!elements) return;

    const { fab, toggle, menu } = elements;
    fab.classList.add(FAB_OPEN_CLASS);
    toggle.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-hidden', 'false');
}

function closeFabMenu(options = {}) {
    const elements = getFabElements();
    if (!elements) return;

    const { fab, toggle, menu } = elements;
    if (!fab.classList.contains(FAB_OPEN_CLASS)) return;

    fab.classList.remove(FAB_OPEN_CLASS);
    toggle.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');

    if (options.focusToggle) {
        toggle.focus();
    }
}

function isFabMenuOpen() {
    const elements = getFabElements();
    if (!elements) return false;

    return elements.fab.classList.contains(FAB_OPEN_CLASS);
}

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    initGlobalComponents();
    initNavigation();
    initScrollEffects();
    initAccessibility();
    initLoadingStates();
});

/**
 * Inicializar componentes globales
 */
function initGlobalComponents() {
    // Marcar página activa en navegación
    markActiveNavigation();
    
    // Inicializar tooltips si existen
    initTooltips();
    
    // Configurar lazy loading para imágenes
    initLazyLoading();
    
    // Inicializar botón flotante de chat
    initFloatingActionButton();
    
    console.log('ServiLocal: Componentes globales inicializados');
}

/**
 * Marcar navegación activa basada en la URL actual
 */
function markActiveNavigation() {
    const currentPath = window.location.pathname;
    const menuLinks = document.querySelectorAll('.menu-link');
    
    menuLinks.forEach(link => {
        link.classList.remove('active');
        
        const href = link.getAttribute('href');
        if (href && (currentPath.includes(href) || (href === 'index.html' && currentPath === '/'))) {
            link.classList.add('active');
        }
    });
}

/**
 * Navegación y menú móvil
 */
function initNavigation() {
    initResponsiveMenu();
    initSmoothScrolling();
    initUserMenu();
}

/**
 * Inicializar menú responsivo
 */
function initResponsiveMenu() {
    if (typeof responsivemenu === 'undefined') {
        console.warn('ServiLocal: responsivemenu no está disponible');
        return;
    }
    
    const wrapper = document.querySelector(RESPONSIVE_MENU_WRAPPER_SELECTOR);
    if (!wrapper || wrapper.classList.contains('rm-initiated')) return;
    
    const menuElement = wrapper.querySelector('.navbar-menu');
    if (!menuElement) return;
    
    const toggleContent = `
        <span class="rm-toggle-icon" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
        </span>
        <span class="sr-only">Menú</span>
    `;
    
    responsivemenu.init({
        wrapper,
        menu: menuElement,
        toggleclass: 'rm-togglebutton',
        toggleclosedclass: 'rm-togglebutton--open',
        toggletype: 'button',
        togglecontent: toggleContent.trim(),
        hideclass: 'rm-closed',
        openclass: 'rm-opened',
        openbodyclass: 'has-opened-menu',
        arrowNavigation: true,
        animateopenclass: 'is-opening',
        animatecloseclass: 'is-closing',
        animateduration: 200,
        subanimateopenclass: 'is-opening',
        subanimatecloseclass: 'is-closing',
        subanimateduration: 200
    });
    
    menuElement.addEventListener('click', (event) => {
        const link = event.target.closest('a');
        if (!link) return;
        
        const toggleButton = wrapper.querySelector('.rm-togglebutton');
        if (toggleButton && menuElement.classList.contains('rm-opened')) {
            toggleButton.click();
        }
    });
}

/**
 * Navegación suave
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetSelector = this.getAttribute('href');
            if (!targetSelector || targetSelector === '#' || !targetSelector.startsWith('#')) {
                return;
            }

            let target;
            try {
                target = document.querySelector(targetSelector);
            } catch (error) {
                console.warn('ServiLocal: selector de destino inválido', targetSelector, error);
                return;
            }
            
            if (target) {
                e.preventDefault();
                const header = document.querySelector('.global-header');
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Menú de usuario
 */
function initUserMenu() {
    const elements = getUserMenuElements();
    if (!elements) return;

    const { userToggle, userDropdown } = elements;
    
    // Toggle del menú de usuario
    userToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        
        if (isUserMenuOpen()) {
            closeUserMenu();
        } else {
            openUserMenu();
        }
    });
    
    // Cerrar al hacer click fuera
    document.addEventListener('click', function() {
        closeUserMenu();
    });
    
    // Prevenir cierre al hacer click dentro del dropdown
    userDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
    });
}

/**
 * Botón flotante de chat
 */
function initFloatingActionButton() {
    const elements = getFabElements();
    if (!elements) return;

    const { fab, toggle, menu } = elements;

    const handleToggleClick = (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (isFabMenuOpen()) {
            closeFabMenu();
        } else {
            openFabMenu();
        }
    };

    toggle.addEventListener('click', handleToggleClick);

    toggle.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeFabMenu();
            event.stopPropagation();
        }
    });

    fab.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    document.addEventListener('click', () => closeFabMenu());

    window.addEventListener('scroll', () => {
        if (isFabMenuOpen()) {
            closeFabMenu();
        }
    }, { passive: true });

    menu.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeFabMenu({ focusToggle: true });
            event.stopPropagation();
        }
    });
}

/**
 * Efectos de scroll
 */
function initScrollEffects() {
    const header = document.querySelector('.global-header');
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    
    // Throttle para optimizar performance
    let ticking = false;
    
    function updateOnScroll() {
        const currentScrollY = window.scrollY;
        
        // Efecto del header
        if (header) {
            if (currentScrollY > 100) {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = 'none';
            }
        }
        
        // Botón scroll to top
        if (scrollToTopBtn) {
            if (currentScrollY > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        }
        
        lastScrollY = currentScrollY;
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    });
    
    // Funcionalidad del botón scroll to top
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/**
 * Mejoras de accesibilidad
 */
function initAccessibility() {
    // Navegación por teclado
    document.addEventListener('keydown', function(e) {
        // Escape para cerrar menús
        if (e.key === 'Escape') {
            closeMobileMenu();
            closeUserMenu();
            closeFabMenu();
        }
        
        // Tab para mostrar indicadores de focus
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    // Remover indicadores de focus al usar mouse
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Anunciar cambios de página a screen readers
    announcePageChange();
}

/**
 * Anunciar cambios de página para screen readers
 */
function announcePageChange() {
    const pageTitle = document.title;
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = `Página cargada: ${pageTitle}`;
    
    document.body.appendChild(announcement);
    
    // Remover el anuncio después de un tiempo
    setTimeout(() => {
        if (announcement.parentNode) {
            announcement.parentNode.removeChild(announcement);
        }
    }, 1000);
}

/**
 * Estados de carga
 */
function initLoadingStates() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    // Ocultar overlay de carga inicial
    if (loadingOverlay) {
        setTimeout(() => {
            loadingOverlay.classList.remove('active');
        }, 500);
    }
    
    // Mostrar loading en navegación
    document.querySelectorAll('a[href$=".html"]').forEach(link => {
        link.addEventListener('click', function(e) {
            // Solo para enlaces internos
            if (this.hostname === window.location.hostname) {
                showLoadingOverlay();
            }
        });
    });
}

/**
 * Mostrar overlay de carga
 */
function showLoadingOverlay() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('active');
    }
}

/**
 * Ocultar overlay de carga
 */
function hideLoadingOverlay() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

/**
 * Tooltips
 */
function initTooltips() {
    const elementsWithTooltips = document.querySelectorAll('[title]');
    
    elementsWithTooltips.forEach(element => {
        const title = element.getAttribute('title');
        if (title) {
            element.setAttribute('aria-label', title);
            
            // Crear tooltip personalizado si es necesario
            element.addEventListener('mouseenter', function() {
                showTooltip(this, title);
            });
            
            element.addEventListener('mouseleave', function() {
                hideTooltip();
            });
        }
    });
}

/**
 * Mostrar tooltip
 */
function showTooltip(element, text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    tooltip.textContent = text;
    tooltip.style.cssText = `
        position: absolute;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        z-index: 10000;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s;
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
    
    setTimeout(() => {
        tooltip.style.opacity = '1';
    }, 10);
    
    // Guardar referencia para poder eliminarlo
    element._tooltip = tooltip;
}

/**
 * Ocultar tooltip
 */
function hideTooltip() {
    const tooltips = document.querySelectorAll('.custom-tooltip');
    tooltips.forEach(tooltip => {
        tooltip.style.opacity = '0';
        setTimeout(() => {
            if (tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
            }
        }, 200);
    });
}

/**
 * Lazy loading para imágenes
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if (images.length === 0) return;
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px'
    });
    
    images.forEach(img => {
        img.classList.add('lazy');
        imageObserver.observe(img);
    });
}

/**
 * Sistema de notificaciones global
 */
function showNotification(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `global-notification notification-${type}`;
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}" aria-hidden="true"></i>
            <span class="notification-message">${message}</span>
            <button class="notification-close" aria-label="Cerrar notificación">
                <i class="fas fa-times" aria-hidden="true"></i>
            </button>
        </div>
    `;
    
    // Estilos inline para las notificaciones
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
        border-left: 4px solid ${getNotificationColor(type)};
    `;
    
    document.body.appendChild(notification);
    
    // Mostrar notificación
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Cerrar notificación
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        closeNotification(notification);
    });
    
    // Auto-cerrar
    if (duration > 0) {
        setTimeout(() => {
            closeNotification(notification);
        }, duration);
    }
    
    return notification;
}

function closeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || icons.info;
}

function getNotificationColor(type) {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    return colors[type] || colors.info;
}

/**
 * Utilidades globales
 */

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Formatear fecha
function formatDate(date, options = {}) {
    const defaultOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    
    return new Intl.DateTimeFormat('es-ES', { ...defaultOptions, ...options }).format(date);
}

// Validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Obtener parámetros de URL
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    for (const [key, value] of params) {
        result[key] = value;
    }
    return result;
}

// Copiar al portapapeles
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showNotification('Copiado al portapapeles', 'success', 2000);
        return true;
    } catch (err) {
        console.error('Error al copiar:', err);
        showNotification('Error al copiar al portapapeles', 'error', 3000);
        return false;
    }
}

// Detectar dispositivo móvil
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Exponer funciones globales
window.ServiLocal = {
    showNotification,
    hideLoadingOverlay,
    showLoadingOverlay,
    copyToClipboard,
    formatDate,
    isValidEmail,
    getUrlParams,
    isMobileDevice,
    debounce,
    throttle,
    openUserMenu,
    closeUserMenu,
    isUserMenuOpen,
    closeMobileMenu,
    openFabMenu,
    closeFabMenu,
    isFabMenuOpen
};

// Log de inicialización
console.log('ServiLocal Global Base cargado correctamente');

// Service Worker para PWA (opcional)
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('SW registrado:', registration);
            })
            .catch(registrationError => {
                console.log('Error al registrar SW:', registrationError);
            });
    });
}
