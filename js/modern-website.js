/**
 * Modern Website JavaScript
 * Funcionalidad interactiva y mejoras de UX
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas las funcionalidades
    initNavigation();
    initScrollEffects();
    initFormValidation();
    initAnimations();
    initAccessibility();
});

/**
 * Navegación móvil y efectos del header
 */
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');
    const navLinks = document.querySelectorAll('.navbar-menu a');
    
    // Toggle del menú móvil
    if (navbarToggle && navbarMenu) {
        navbarToggle.addEventListener('click', function() {
            navbarMenu.classList.toggle('active');
            
            // Actualizar aria-expanded
            const isExpanded = navbarMenu.classList.contains('active');
            navbarToggle.setAttribute('aria-expanded', isExpanded);
            
            // Animar hamburger
            navbarToggle.classList.toggle('active');
        });
    }
    
    // Cerrar menú al hacer click en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navbarMenu.classList.remove('active');
            navbarToggle.setAttribute('aria-expanded', 'false');
            navbarToggle.classList.remove('active');
        });
    });
    
    // Cerrar menú al hacer click fuera
    document.addEventListener('click', function(event) {
        if (!navbar.contains(event.target)) {
            navbarMenu.classList.remove('active');
            navbarToggle.setAttribute('aria-expanded', 'false');
            navbarToggle.classList.remove('active');
        }
    });
    
    // Scroll suave para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Efectos de scroll y botón scroll-to-top
 */
function initScrollEffects() {
    const header = document.querySelector('.header');
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    
    // Efecto del header al hacer scroll
    let lastScrollY = window.scrollY;
    
    function updateHeader() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Mostrar/ocultar botón scroll-to-top
        if (currentScrollY > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
        
        lastScrollY = currentScrollY;
    }
    
    // Throttle para optimizar performance
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                updateHeader();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Funcionalidad del botón scroll-to-top
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
 * Validación del formulario de contacto
 */
function initFormValidation() {
    const contactForm = document.querySelector('.contact-form');
    
    if (!contactForm) return;
    
    const formInputs = contactForm.querySelectorAll('input, select, textarea');
    
    // Validación en tiempo real
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
    
    // Validación al enviar el formulario
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        
        formInputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        if (isValid) {
            submitForm(contactForm);
        }
    });
    
    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        const errorElement = document.getElementById(`${fieldName}-error`);
        
        let isValid = true;
        let errorMessage = '';
        
        // Validaciones específicas por campo
        switch (fieldName) {
            case 'name':
                if (!value) {
                    errorMessage = 'El nombre es requerido';
                    isValid = false;
                } else if (value.length < 2) {
                    errorMessage = 'El nombre debe tener al menos 2 caracteres';
                    isValid = false;
                }
                break;
                
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) {
                    errorMessage = 'El email es requerido';
                    isValid = false;
                } else if (!emailRegex.test(value)) {
                    errorMessage = 'Por favor ingresa un email válido';
                    isValid = false;
                }
                break;
                
            case 'subject':
                if (!value) {
                    errorMessage = 'Por favor selecciona un tema';
                    isValid = false;
                }
                break;
                
            case 'message':
                if (!value) {
                    errorMessage = 'El mensaje es requerido';
                    isValid = false;
                } else if (value.length < 10) {
                    errorMessage = 'El mensaje debe tener al menos 10 caracteres';
                    isValid = false;
                }
                break;
        }
        
        // Mostrar/ocultar error
        if (errorElement) {
            errorElement.textContent = errorMessage;
            field.classList.toggle('error', !isValid);
        }
        
        return isValid;
    }
    
    function clearFieldError(field) {
        const errorElement = document.getElementById(`${field.name}-error`);
        if (errorElement) {
            errorElement.textContent = '';
            field.classList.remove('error');
        }
    }
    
    function submitForm(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Mostrar estado de carga
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
        form.classList.add('loading');
        
        // Simular envío (aquí iría la lógica real de envío)
        setTimeout(() => {
            // Mostrar mensaje de éxito
            showNotification('¡Mensaje enviado correctamente!', 'success');
            
            // Resetear formulario
            form.reset();
            
            // Restaurar botón
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            form.classList.remove('loading');
        }, 2000);
    }
}

/**
 * Animaciones de entrada (Intersection Observer)
 */
function initAnimations() {
    const animatedElements = document.querySelectorAll('.service-card, .portfolio-item, .stat-item');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Mejoras de accesibilidad
 */
function initAccessibility() {
    // Navegación por teclado mejorada
    document.addEventListener('keydown', function(e) {
        // Escape para cerrar menú móvil
        if (e.key === 'Escape') {
            const navbarMenu = document.querySelector('.navbar-menu');
            const navbarToggle = document.querySelector('.navbar-toggle');
            
            if (navbarMenu && navbarMenu.classList.contains('active')) {
                navbarMenu.classList.remove('active');
                navbarToggle.setAttribute('aria-expanded', 'false');
                navbarToggle.focus();
            }
        }
    });
    
    // Mejorar focus visible
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Skip links para navegación por teclado
    addSkipLinks();
}

/**
 * Agregar enlaces de salto para accesibilidad
 */
function addSkipLinks() {
    const skipLinks = document.createElement('div');
    skipLinks.className = 'skip-links';
    skipLinks.innerHTML = `
        <a href="#main-content" class="skip-link">Saltar al contenido principal</a>
        <a href="#navigation" class="skip-link">Saltar a la navegación</a>
    `;
    
    document.body.insertBefore(skipLinks, document.body.firstChild);
    
    // Estilos para skip links
    const style = document.createElement('style');
    style.textContent = `
        .skip-links {
            position: absolute;
            top: -100px;
            left: 0;
            z-index: 9999;
        }
        
        .skip-link {
            position: absolute;
            top: -100px;
            left: 10px;
            background: var(--primary-color);
            color: white;
            padding: 8px 16px;
            text-decoration: none;
            border-radius: 4px;
            transition: top 0.3s;
        }
        
        .skip-link:focus {
            top: 10px;
        }
    `;
    
    document.head.appendChild(style);
}

/**
 * Sistema de notificaciones
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" aria-label="Cerrar notificación">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Estilos para notificaciones
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                z-index: 9999;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                max-width: 400px;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 16px;
            }
            
            .notification-success {
                border-left: 4px solid #10b981;
            }
            
            .notification-error {
                border-left: 4px solid #ef4444;
            }
            
            .notification-info {
                border-left: 4px solid #3b82f6;
            }
            
            .notification-close {
                background: none;
                border: none;
                cursor: pointer;
                margin-left: auto;
                color: #6b7280;
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Mostrar notificación
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Cerrar notificación
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        closeNotification(notification);
    });
    
    // Auto-cerrar después de 5 segundos
    setTimeout(() => {
        closeNotification(notification);
    }, 5000);
    
    function closeNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

/**
 * Utilidades adicionales
 */

// Debounce function para optimizar eventos
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

// Throttle function para scroll events
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

// Detectar si el usuario prefiere movimiento reducido
function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Lazy loading para imágenes
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Inicializar lazy loading si hay imágenes lazy
if (document.querySelectorAll('img[data-src]').length > 0) {
    initLazyLoading();
}

// Service Worker para PWA (opcional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
