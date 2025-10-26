/**
 * Script de interactividad para formularios en ServiLocal
 * Validación en vivo, feedback visual, y mejor UX
 */

(function() {
  'use strict';

  /**
   * Configuración de validación
   */
  const VALIDATION_CONFIG = {
    ubicacion: {
      minLength: 3,
      pattern: /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s\-,\.]+$/,
      message: 'Ingresá una ubicación válida (mínimo 3 caracteres, solo letras y espacios)'
    },
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Ingresá una dirección de email válida'
    },
    telefono: {
      pattern: /^[\+]?[\d\s\-\(\)]{10,15}$/,
      message: 'Ingresá un número de teléfono válido'
    },
    nombre: {
      minLength: 2,
      pattern: /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/,
      message: 'Ingresá un nombre válido (solo letras y espacios)'
    }
  };

  /**
   * Crear elemento de feedback para un campo
   */
  function createFeedbackElement(fieldId) {
    const feedback = document.createElement('div');
    feedback.id = `${fieldId}-feedback`;
    feedback.className = 'c-field-feedback';
    feedback.setAttribute('aria-live', 'polite');
    feedback.style.display = 'none';
    return feedback;
  }

  /**
   * Mostrar feedback de validación
   */
  function showFieldFeedback(field, message, isValid = false) {
    const fieldContainer = field.closest('.c-form-field');
    let feedback = fieldContainer.querySelector('.c-field-feedback');
    
    if (!feedback) {
      feedback = createFeedbackElement(field.id);
      fieldContainer.appendChild(feedback);
    }

    feedback.textContent = message;
    feedback.className = `c-field-feedback ${isValid ? 'c-field-feedback--success' : 'c-field-feedback--error'}`;
    feedback.style.display = 'block';
    
    // Actualizar atributos ARIA
    field.setAttribute('aria-describedby', feedback.id);
    field.setAttribute('aria-invalid', !isValid);

    // Anunciar a lectores de pantalla
    if (window.announceToScreenReader) {
      window.announceToScreenReader(message);
    }
  }

  /**
   * Ocultar feedback de validación
   */
  function hideFieldFeedback(field) {
    const fieldContainer = field.closest('.c-form-field');
    const feedback = fieldContainer.querySelector('.c-field-feedback');
    
    if (feedback) {
      feedback.style.display = 'none';
      field.removeAttribute('aria-describedby');
      field.removeAttribute('aria-invalid');
    }
  }

  /**
   * Validar un campo específico
   */
  function validateField(field) {
    const fieldType = field.type === 'email' ? 'email' : 
                     field.name === 'telefono' ? 'telefono' :
                     field.name === 'ubicacion' ? 'ubicacion' :
                     field.name === 'nombre' ? 'nombre' : null;

    if (!fieldType || !VALIDATION_CONFIG[fieldType]) {
      return true;
    }

    const value = field.value.trim();
    const config = VALIDATION_CONFIG[fieldType];

    // Campo vacío
    if (!value && field.hasAttribute('required')) {
      showFieldFeedback(field, 'Este campo es obligatorio', false);
      return false;
    }

    // Campo vacío pero no requerido
    if (!value) {
      hideFieldFeedback(field);
      return true;
    }

    // Validar longitud mínima
    if (config.minLength && value.length < config.minLength) {
      showFieldFeedback(field, config.message, false);
      return false;
    }

    // Validar patrón
    if (config.pattern && !config.pattern.test(value)) {
      showFieldFeedback(field, config.message, false);
      return false;
    }

    // Campo válido
    showFieldFeedback(field, '✓ Campo válido', true);
    return true;
  }

  /**
   * Mejorar el formulario de búsqueda
   */
  function enhanceSearchForm() {
    const searchForm = document.querySelector('form[role="search"]');
    if (!searchForm) return;

    const ubicacionField = searchForm.querySelector('#ubicacion');
    const submitButton = searchForm.querySelector('button[type="submit"]');
    const resultadosSection = document.querySelector('#resultados');

    // Validación en vivo para ubicación
    if (ubicacionField) {
      ubicacionField.addEventListener('blur', () => validateField(ubicacionField));
      ubicacionField.addEventListener('input', debounce(() => {
        if (ubicacionField.value.length >= 3) {
          validateField(ubicacionField);
        }
      }, 500));
    }

    // Mejorar envío del formulario
    if (submitButton) {
      searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar campos
        const fields = searchForm.querySelectorAll('input[required], select[required]');
        let isFormValid = true;
        
        fields.forEach(field => {
          if (!validateField(field)) {
            isFormValid = false;
          }
        });

        if (isFormValid) {
          // Simular búsqueda
          submitButton.disabled = true;
          submitButton.textContent = 'Buscando...';
          submitButton.setAttribute('aria-label', 'Búsqueda en progreso');

          if (window.announceToScreenReader) {
            window.announceToScreenReader('Búsqueda iniciada');
          }

          setTimeout(() => {
            // Restaurar botón
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-search c-icon-left" aria-hidden="true"></i>Buscar';
            submitButton.setAttribute('aria-label', 'Buscar servicios');

            // Actualizar resultados
            updateSearchResults(searchForm);
            
            // Scroll a resultados
            if (resultadosSection) {
              resultadosSection.scrollIntoView({ behavior: 'smooth' });
              resultadosSection.focus();
            }

            if (window.announceToScreenReader) {
              window.announceToScreenReader('Búsqueda completada. Revisa los resultados.');
            }
          }, 1500);
        } else {
          // Foco en primer campo con error
          const firstErrorField = searchForm.querySelector('[aria-invalid="true"]');
          if (firstErrorField) {
            firstErrorField.focus();
          }
        }
      });
    }
  }

  /**
   * Actualizar resultados de búsqueda (simulado)
   */
  function updateSearchResults(form) {
    const categoria = form.querySelector('#categoria')?.value;
    const ubicacion = form.querySelector('#ubicacion')?.value;
    const orden = form.querySelector('#orden')?.value;
    
    const resultCounter = document.querySelector('#resultados-count');
    if (resultCounter) {
      let resultText = '';
      
      if (categoria && categoria !== '') {
        resultText = `Mostrando profesionales de ${categoria}`;
      } else {
        resultText = 'Mostrando todos los profesionales';
      }
      
      if (ubicacion) {
        resultText += ` en ${ubicacion}`;
      }
      
      resultText += ` (${Math.floor(Math.random() * 8) + 1} encontrados)`;
      
      resultCounter.textContent = resultText;
    }
  }

  /**
   * Mejorar campos de autocompletado
   */
  function enhanceAutocomplete() {
    const ubicacionField = document.querySelector('#ubicacion');
    if (!ubicacionField) return;

    // Agregar atributos de autocompletado
    ubicacionField.setAttribute('autocomplete', 'address-level2');
    ubicacionField.setAttribute('spellcheck', 'false');

    // Lista de sugerencias comunes (simulado)
    const sugerenciasComunes = [
      'Buenos Aires, Argentina',
      'Ciudad de México, México',
      'Madrid, España',
      'Bogotá, Colombia',
      'Lima, Perú'
    ];

    // Crear datalist para sugerencias
    const datalist = document.createElement('datalist');
    datalist.id = 'ubicaciones-sugeridas';
    
    sugerenciasComunes.forEach(ubicacion => {
      const option = document.createElement('option');
      option.value = ubicacion;
      datalist.appendChild(option);
    });

    ubicacionField.setAttribute('list', 'ubicaciones-sugeridas');
    ubicacionField.parentNode.appendChild(datalist);
  }

  /**
   * Utility: Debounce function
   */
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

  /**
   * Inicializar mejoras de formularios
   */
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    try {
      enhanceSearchForm();
      enhanceAutocomplete();
      
      console.log('✓ Mejoras de formularios inicializadas');
    } catch (error) {
      console.error('Error al inicializar mejoras de formularios:', error);
    }
  }

  // Inicializar
  init();

})();