(function () {
  const STORAGE_KEY = 'servilocal_cookie_consent';

  const hasConsent = () => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'accepted';
    } catch (error) {
      return false;
    }
  };

  const setConsent = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'accepted');
    } catch (error) {
      /* ignore storage errors caused by privacy modes */
    }
  };

  const createBanner = () => {
    const banner = document.createElement('div');
    banner.className = 'c-cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', 'Aviso de cookies');

    banner.innerHTML = `
      <p class="c-cookie-banner__message">
        Usamos cookies para mejorar tu experiencia, analizar el uso del sitio y mantener la plataforma segura. 
        Al aceptar, autorizás el uso de cookies según nuestras 
        <a class="c-cookie-banner__link" href="politicas.html">políticas de privacidad</a>.
      </p>
      <div class="c-cookie-banner__actions">
        <button type="button" class="c-cookie-banner__button" data-action="accept">Aceptar cookies</button>
        <a class="c-cookie-banner__link" href="politicas.html">Configurar más tarde</a>
      </div>
    `;

    const acceptButton = banner.querySelector('[data-action=\"accept\"]');
    acceptButton.addEventListener('click', () => {
      setConsent();
      banner.classList.remove('is-visible');
      banner.addEventListener(
        'transitionend',
        () => banner.remove(),
        { once: true }
      );
    });

    document.body.appendChild(banner);
    requestAnimationFrame(() => banner.classList.add('is-visible'));
  };

  const init = () => {
    if (!hasConsent()) {
      createBanner();
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
