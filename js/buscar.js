(() => {
  const form = document.querySelector('#form-busqueda');
  const resultsContainer = document.querySelector('#lista-resultados');
  const countElement = document.querySelector('#resultado-cantidad');
  const messageElement = document.querySelector('#resultado-mensaje');

  if (!form || !resultsContainer || !countElement || !messageElement) {
    return;
  }

  const normalize = (value = '') =>
    value
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();

  const RAW_PROVIDERS = [
    {
      id: 'carlos-jardineria',
      name: 'Carlos – Jardinería',
      category: 'Jardinería',
      rating: 4.7,
      highlights: ['+10 años de experiencia', 'Turnos express en 24 hs'],
      description:
        'Podado, diseño de jardines, sistemas de riego automático y mantenimiento estacional. Equipo propio y seguimiento por WhatsApp.',
      locations: ['Palermo', 'Belgrano', 'Núñez', 'Vicente López', 'CABA'],
      keywords: ['riego', 'paisajismo', 'jardines verticales'],
      priority: 1,
      profileUrl: 'proveedor.html',
      ctaLabel: 'Solicitar presupuesto',
      ctaUrl: 'contacto.html',
      secondaryCta: { label: 'Guardar', url: '#' },
    },
    {
      id: 'laura-limpieza',
      name: 'Laura – Limpieza Integral',
      category: 'Limpieza',
      rating: 5,
      highlights: ['Servicios residenciales y oficinas', 'Productos ecológicos'],
      description:
        'Limpieza profunda, post-mudanza y mantenimiento semanal. Equipamiento profesional y personal de confianza.',
      locations: ['Recoleta', 'Palermo', 'Microcentro', 'CABA'],
      keywords: ['limpieza profunda', 'mudanzas', 'oficinas'],
      priority: 2,
      profileUrl: 'proveedor.html',
      ctaLabel: 'Reservar limpieza',
      ctaUrl: 'contacto.html',
      secondaryCta: { label: 'Solicitar disponibilidad', url: 'contacto.html' },
    },
    {
      id: 'electrosecure',
      name: 'ElectroSecure',
      category: 'Electricidad',
      rating: 4.8,
      highlights: ['Electricistas matriculados', 'Diagnóstico en 48 hs'],
      description:
        'Instalaciones nuevas, tableros eléctricos, domótica y certificación de seguridad. Servicio 24/7 para emergencias.',
      locations: ['CABA', 'San Isidro', 'Martínez', 'Zona Norte'],
      keywords: ['domótica', 'tableros', 'matriculado'],
      priority: 3,
      profileUrl: 'proveedor.html',
      ctaLabel: 'Pedir visita técnica',
      ctaUrl: 'contacto.html',
    },
    {
      id: 'plomeros-247',
      name: 'Plomeros 24/7',
      category: 'Plomería',
      rating: 4.6,
      highlights: ['Respuesta en 30 minutos', 'Garantía escrita'],
      description:
        'Reparaciones urgentes, instalaciones de baños y cocinas, detección de fugas sin romper. Cobertura en todo CABA y GBA.',
      locations: ['CABA', 'Lanús', 'Lomas de Zamora', 'Avellaneda', 'GBA Sur'],
      keywords: ['plomería', 'fugas', 'urgencias'],
      priority: 4,
      profileUrl: 'proveedor.html',
      ctaLabel: 'Pedir un plomero',
      ctaUrl: 'contacto.html',
    },
    {
      id: 'construcciones-delta',
      name: 'Construcciones Delta',
      category: 'Construcción',
      rating: 4.4,
      highlights: ['Obra civil y remodelaciones', 'Equipo multidisciplinario'],
      description:
        'Proyectos llave en mano, reformas completas, dirección de obra y asesoría en materiales. Especialistas en viviendas familiares.',
      locations: ['Villa Urquiza', 'Saavedra', 'Olivos', 'Zona Norte'],
      keywords: ['remodelaciones', 'arquitectura', 'obra civil'],
      priority: 5,
      profileUrl: 'proveedor.html',
      ctaLabel: 'Solicitar presupuesto',
      ctaUrl: 'contacto.html',
    },
    {
      id: 'estudio-rios',
      name: 'Estudio Jurídico Ríos',
      category: 'Abogacía',
      rating: 4.9,
      highlights: ['Especialistas en laboral y familia', 'Consultas virtuales'],
      description:
        'Asesoramiento integral para casos laborales, familiares y comerciales. Representación en toda la provincia de Buenos Aires.',
      locations: ['San Isidro', 'Tigre', 'CABA'],
      keywords: ['abogado laboral', 'familia', 'comercial'],
      priority: 6,
      profileUrl: 'proveedor.html',
      ctaLabel: 'Agendar consulta',
      ctaUrl: 'contacto.html',
    },
    {
      id: 'estudio-contable-norte',
      name: 'Estudio Contable Norte',
      category: 'Contaduría',
      rating: 4.5,
      highlights: ['Planes para pymes y monotributo', 'Reportes mensuales'],
      description:
        'Gestión impositiva, sueldos, balances y auditorías internas. Plataforma online para compartir documentación segura.',
      locations: ['Vicente López', 'Olivos', 'Florida', 'San Isidro'],
      keywords: ['contabilidad', 'impuestos', 'monotributo'],
      priority: 7,
      profileUrl: 'proveedor.html',
      ctaLabel: 'Hablar con un contador',
      ctaUrl: 'contacto.html',
    },
    {
      id: 'vetcare-domicilio',
      name: 'VetCare a Domicilio',
      category: 'Veterinaria',
      rating: 4.8,
      highlights: ['Visitas a domicilio', 'Atención de urgencias'],
      description:
        'Vacunación, chequeos, laboratorio y emergencias para perros y gatos. Equipamiento portátil y seguimiento posconsulta.',
      locations: ['Caballito', 'Flores', 'Almagro', 'CABA'],
      keywords: ['veterinario', 'urgencias', 'mascotas'],
      priority: 8,
      profileUrl: 'proveedor.html',
      ctaLabel: 'Programar visita',
      ctaUrl: 'contacto.html',
    },
    {
      id: 'ferreteria-express',
      name: 'Ferretería Express 24/7',
      category: 'Ferretería',
      rating: 4.3,
      highlights: ['Envíos en 2 hs', 'Stock de herramientas premium'],
      description:
        'Catálogo completo de herramientas, tornillería y materiales de obra. Atención telefónica y pedidos por WhatsApp.',
      locations: ['Balvanera', 'Once', 'Almagro', 'CABA'],
      keywords: ['herramientas', 'materiales', 'envíos'],
      priority: 9,
      profileUrl: 'proveedor.html',
      ctaLabel: 'Hacer un pedido',
      ctaUrl: 'contacto.html',
    },
    {
      id: 'corralon-central',
      name: 'Corralón Central',
      category: 'Corralón',
      rating: 4.2,
      highlights: ['Entrega el mismo día', 'Asesoría en materiales'],
      description:
        'Materiales de construcción, áridos, placas y revestimientos. Planificación logística para obras pequeñas y medianas.',
      locations: ['La Plata', 'Berisso', 'Ensenada', 'GBA Sur'],
      keywords: ['materiales', 'corralón', 'obra'],
      priority: 10,
      profileUrl: 'proveedor.html',
      ctaLabel: 'Solicitar cotización',
      ctaUrl: 'contacto.html',
    },
    {
      id: 'mecanica-expres',
      name: 'Mecánica Exprés',
      category: 'Mecánica del automotor',
      rating: 4.6,
      highlights: ['Responde en menos de 2 hs', 'Servicio a domicilio'],
      description:
        'Diagnóstico computarizado, eléctricos y mecánica ligera a domicilio. Cobertura en toda el área metropolitana.',
      locations: ['Morón', 'Haedo', 'Ramos Mejía', 'CABA Oeste'],
      keywords: ['mecánica', 'automotor', 'auxilio'],
      priority: 11,
      profileUrl: 'proveedor.html',
      ctaLabel: 'Solicitar turno',
      ctaUrl: 'contacto.html',
      secondaryCta: { label: 'Compartir', url: '#' },
    },
    {
      id: 'jardines-urbanos',
      name: 'Jardines Urbanos Studio',
      category: 'Jardinería',
      rating: 4.9,
      highlights: ['Especialistas en terrazas verdes', 'Mantenimiento mensual'],
      description:
        'Diseño de terrazas, jardines verticales y sistemas de riego inteligentes. Planes corporativos y residenciales.',
      locations: ['Puerto Madero', 'Palermo', 'Centro', 'CABA'],
      keywords: ['jardines', 'terrazas', 'riego'],
      priority: 12,
      profileUrl: 'proveedor.html',
      ctaLabel: 'Agendar visita técnica',
      ctaUrl: 'contacto.html',
    },
  ];

  const providers = RAW_PROVIDERS.map((provider) => {
    const normalizedLocations = provider.locations.map((loc) => normalize(loc));
    const searchTokens = normalize(
      [
        provider.name,
        provider.description,
        provider.category,
        ...(provider.keywords || []),
        ...provider.locations,
      ].join(' ')
    );

    return {
      ...provider,
      normalizedLocations,
      searchTokens,
    };
  });

  const renderStars = (rating) => {
    const rounded = Math.round(rating);
    let stars = '';
    for (let i = 1; i <= 5; i += 1) {
      stars += i <= rounded ? '★' : '☆';
    }
    return stars;
  };

  const createResultCard = (provider) => {
    const article = document.createElement('article');
    article.className = 'c-result-card';
    article.innerHTML = `
      <div class="c-result-card__media" aria-hidden="true"></div>
      <div class="c-result-card__body">
        <header class="c-result-card__header">
          <h3 class="c-result-card__title">${provider.name}</h3>
          <div class="c-result-card__meta">
            <span class="c-rating" aria-hidden="true">${renderStars(provider.rating)}</span>
            <span class="c-rating__value">(${provider.rating.toFixed(1)})</span>
            ${provider.highlights.map((item) => `<span>${item}</span>`).join('')}
          </div>
        </header>
        <p class="texto-base u-no-margin">${provider.description}</p>
        <div class="c-result-card__actions">
          <a class="c-button" href="${provider.profileUrl}">Ver perfil</a>
          <a class="c-navbar__link" href="${provider.ctaUrl}">${provider.ctaLabel}</a>
          ${
            provider.secondaryCta
              ? `<a class="c-navbar__link" href="${provider.secondaryCta.url}">${provider.secondaryCta.label}</a>`
              : ''
          }
        </div>
      </div>
    `;
    return article;
  };

  const sortResults = (items, order, hasLocationFilter) => {
    const sorted = [...items];

    if (order === 'Mejor calificados') {
      sorted.sort(
        (a, b) => b.rating - a.rating || a.priority - b.priority
      );
      return sorted;
    }

    if (order === 'Más cercanos' && hasLocationFilter) {
      sorted.sort(
        (a, b) => b.locationScore - a.locationScore || b.rating - a.rating || a.priority - b.priority
      );
      return sorted;
    }

    sorted.sort((a, b) => a.priority - b.priority);
    return sorted;
  };

  const renderResults = (items, order, locationLabel) => {
    resultsContainer.innerHTML = '';
    countElement.textContent = items.length.toString();

    if (!items.length) {
      const empty = document.createElement('p');
      empty.className = 'c-result-list__empty texto-base';
      empty.textContent = locationLabel
        ? `No encontramos profesionales disponibles en ${locationLabel}. Probá con otra zona o ajustá los filtros.`
        : 'No encontramos resultados con los filtros seleccionados. Probá cambiando la categoría u orden.';
      resultsContainer.appendChild(empty);
      messageElement.textContent = 'No encontramos resultados con los filtros seleccionados.';
      return;
    }

    const fragment = document.createDocumentFragment();
    items.forEach((provider) => {
      fragment.appendChild(createResultCard(provider));
    });
    resultsContainer.appendChild(fragment);

    if (order === 'Más cercanos' && locationLabel) {
      messageElement.textContent = `Mostrando profesionales que trabajan en ${locationLabel}.`;
    } else if (order === 'Mejor calificados') {
      messageElement.textContent = 'Profesionales ordenados por mejores calificaciones de los usuarios.';
    } else {
      messageElement.textContent = 'Estas son nuestras recomendaciones destacadas para tu zona.';
    }
  };

  const handleSearch = (event) => {
    if (event) {
      event.preventDefault();
    }

    const categoryValue = form.elements.categoria.value;
    const locationInput = form.elements.ubicacion.value.trim();
    const locationNormalized = normalize(locationInput);
    const orderValue = form.elements.orden.value;

    const filtered = providers
      .map((provider) => {
        const matchesCategory = categoryValue === 'Todas' || provider.category === categoryValue;
        if (!matchesCategory) {
          return null;
        }

        let locationScore = 0;

        if (locationNormalized) {
          const exactMatch = provider.normalizedLocations.some(
            (loc) => loc === locationNormalized
          );
          const partialMatch = provider.normalizedLocations.some((loc) =>
            loc.includes(locationNormalized)
          );
          const keywordMatch = provider.searchTokens.includes(locationNormalized);

          if (exactMatch) {
            locationScore = 3;
          } else if (partialMatch) {
            locationScore = 2;
          } else if (keywordMatch) {
            locationScore = 1;
          } else {
            return null;
          }
        }

        return {
          ...provider,
          locationScore,
        };
      })
      .filter(Boolean);

    const ordered = sortResults(filtered, orderValue, Boolean(locationNormalized));
    renderResults(ordered, orderValue, locationInput);
  };

  form.addEventListener('submit', handleSearch);
  form.elements.categoria.addEventListener('change', handleSearch);
  form.elements.orden.addEventListener('change', handleSearch);
  form.elements.ubicacion.addEventListener('input', () => {
    window.clearTimeout(form.dataset.debounceId);
    const timeoutId = window.setTimeout(() => handleSearch(), 250);
    form.dataset.debounceId = timeoutId;
  });

  handleSearch();
})();
