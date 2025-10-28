/**
 * PERFIL DATA - SERVILOCAL
 * Datos de ejemplo para los componentes del perfil
 */

const PerfilData = {
  
  // ============================================
  // DATOS DE PROYECTOS
  // ============================================
  
  projects: [
    {
      image: 'imagenes/perfilemuestra/mobile-app-design-mockup.jpg',
      alt: 'Diseño de Aplicación Móvil',
      title: 'Diseño de Aplicación Móvil'
    },
    {
      image: 'imagenes/perfilemuestra/brand-identity-design.png',
      alt: 'Diseño de Gestión de Marca',
      title: 'Diseño de Gestión de Marca'
    },
    {
      image: 'imagenes/perfilemuestra/digital-user-experience-design.jpg',
      alt: 'Experiencia de Usuario Digital',
      title: 'Experiencia de Usuario Digital'
    }
  ],
  
  // ============================================
  // DATOS DE PUBLICACIONES
  // ============================================
  
  publications: [
    {
      image: 'imagenes/perfilemuestra/modern-ui-design-trends.jpg',
      title: 'Tendencias en Diseño UX/UI para 2024',
      excerpt: 'Explorando las últimas tendencias en diseño de interfaces de usuario y experiencia para crear productos digitales modernos.',
      date: '2024-01-15',
      dateFormatted: 'Hace 2 semanas',
      link: '#'
    },
    {
      image: 'imagenes/perfilemuestra/effective-branding-strategies.jpg',
      title: 'Estrategias Efectivas de Branding',
      excerpt: 'Cómo construir una identidad de marca sólida que resuene con tu audiencia y destaque en el mercado.',
      date: '2024-01-10',
      dateFormatted: 'Hace 3 semanas',
      link: '#'
    },
    {
      image: 'imagenes/perfilemuestra/web-performance-optimization.jpg',
      title: 'Optimización de Rendimiento Web',
      excerpt: 'Técnicas y mejores prácticas para mejorar la velocidad y rendimiento de tu sitio web.',
      date: '2024-01-05',
      dateFormatted: 'Hace 1 mes',
      link: '#'
    }
  ],
  
  // ============================================
  // DATOS DE SERVICIOS (CARDS)
  // ============================================
  
  serviceCards: [
    {
      icon: 'fas fa-palette',
      title: 'Diseño Creativo',
      subtitle: 'Soluciones Visuales'
    },
    {
      icon: 'fas fa-code',
      title: 'Desarrollo Web',
      subtitle: 'Tecnología Moderna'
    },
    {
      icon: 'fas fa-bolt',
      title: 'Experiencia Digital',
      subtitle: 'Innovación'
    }
  ],
  
  // ============================================
  // DATOS DE SERVICIOS DETALLADOS
  // ============================================
  
  serviceDetails: [
    {
      title: 'Diseño UX/UI Completo',
      category: 'Diseño',
      price: '$1,500',
      unit: 'por proyecto',
      description: 'Diseño completo de interfaces de usuario y experiencia, incluyendo investigación, wireframes, prototipos y diseño visual final.',
      features: [
        'Investigación de usuarios',
        'Wireframes y prototipos',
        'Diseño visual completo'
      ]
    },
    {
      title: 'Desarrollo Web Responsive',
      category: 'Desarrollo',
      price: '$2,000',
      unit: 'por proyecto',
      description: 'Desarrollo de sitios web modernos y responsivos con las últimas tecnologías, optimizados para todos los dispositivos.',
      features: [
        'HTML5, CSS3, JavaScript',
        'Responsive Design',
        'Optimización SEO'
      ]
    },
    {
      title: 'Consultoría de Branding',
      category: 'Consultoría',
      price: '$800',
      unit: 'por sesión',
      description: 'Sesiones de consultoría para desarrollar y mejorar la identidad de marca de tu negocio.',
      features: [
        'Análisis de marca',
        'Estrategia de branding',
        'Guía de estilo'
      ]
    },
    {
      title: 'Mantenimiento Web',
      category: 'Soporte',
      price: '$500',
      unit: 'mensual',
      description: 'Servicio de mantenimiento continuo para mantener tu sitio web actualizado, seguro y funcionando perfectamente.',
      features: [
        'Actualizaciones regulares',
        'Soporte técnico',
        'Monitoreo de seguridad'
      ]
    }
  ],
  
  // ============================================
  // DATOS DE BADGES
  // ============================================
  
  badges: [
    'Diseño UX/UI',
    'Desarrollo Web',
    'Branding',
    'Consultoría'
  ],
  
  // ============================================
  // DATOS DE RATINGS
  // ============================================
  
  ratings: [
    {
      label: 'Calidad',
      value: '4.9',
      percentage: '98'
    },
    {
      label: 'Comunicación',
      value: '4.8',
      percentage: '96'
    },
    {
      label: 'Puntualidad',
      value: '4.7',
      percentage: '94'
    },
    {
      label: 'Profesionalismo',
      value: '5.0',
      percentage: '100'
    }
  ],
  
  // ============================================
  // DATOS DE RESEÑAS
  // ============================================
  
  reviews: [
    {
      name: 'María González',
      avatar: 'https://i.pravatar.cc/150?img=1',
      rating: 5,
      date: '2024-01-20',
      dateFormatted: 'Hace 1 semana',
      comment: 'Excelente profesional. El diseño superó todas mis expectativas y la comunicación fue impecable durante todo el proyecto.'
    },
    {
      name: 'Carlos Rodríguez',
      avatar: 'https://i.pravatar.cc/150?img=2',
      rating: 5,
      date: '2024-01-18',
      dateFormatted: 'Hace 1 semana',
      comment: 'Muy recomendable. Entregó el trabajo a tiempo y con una calidad excepcional. Sin duda volveré a trabajar con él.'
    },
    {
      name: 'Ana Martínez',
      avatar: 'https://i.pravatar.cc/150?img=3',
      rating: 4,
      date: '2024-01-15',
      dateFormatted: 'Hace 2 semanas',
      comment: 'Gran experiencia trabajando juntos. El resultado final fue muy profesional y exactamente lo que necesitaba.'
    }
  ],
  
  // ============================================
  // DATOS DE CONTACTO
  // ============================================
  
  contactInfo: [
    {
      icon: 'fas fa-envelope',
      label: 'Email',
      value: 'contacto@ejemplo.com',
      link: 'mailto:contacto@ejemplo.com'
    },
    {
      icon: 'fas fa-phone',
      label: 'Teléfono',
      value: '+52 123 456 7890',
      link: 'tel:+521234567890'
    },
    {
      icon: 'fas fa-map-marker-alt',
      label: 'Ubicación',
      value: 'Ciudad de México, México',
      link: null
    },
    {
      icon: 'fas fa-globe',
      label: 'Sitio Web',
      value: 'www.ejemplo.com',
      link: 'https://www.ejemplo.com'
    }
  ]
};

// Hacer los datos globalmente accesibles
window.PerfilData = PerfilData;
