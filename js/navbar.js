(() => {
  const IDLE_TIMEOUT = 7000;
  let idleTimer;

  const navbar = document.querySelector('.c-navbar');
  if (!navbar) return;

  const clearIdleTimer = () => {
    if (idleTimer) {
      clearTimeout(idleTimer);
      idleTimer = undefined;
    }
  };

  const scheduleHide = () => {
    clearIdleTimer();
    idleTimer = setTimeout(() => {
      navbar.classList.add('c-navbar--hidden');
    }, IDLE_TIMEOUT);
  };

  const showNavbar = () => {
    if (navbar.classList.contains('c-navbar--hidden')) {
      navbar.classList.remove('c-navbar--hidden');
    }
    scheduleHide();
  };

  const handleScroll = () => {
    if (window.scrollY > 4) {
      navbar.classList.add('c-navbar--shadow');
    } else {
      navbar.classList.remove('c-navbar--shadow');
    }
    showNavbar();
  };

  const handleActivity = () => {
    showNavbar();
  };

  const handlePause = () => {
    clearIdleTimer();
  };

  const handleResume = () => {
    scheduleHide();
  };

  const init = () => {
    handleScroll();
    scheduleHide();

    const passiveEvents = ['mousemove', 'touchstart', 'wheel'];
    passiveEvents.forEach((eventName) => {
      window.addEventListener(eventName, handleActivity, { passive: true });
    });
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('scroll', handleScroll, { passive: true });

    navbar.addEventListener('mouseenter', handlePause);
    navbar.addEventListener('focusin', handlePause);
    navbar.addEventListener('mouseleave', handleResume);
    navbar.addEventListener('focusout', handleResume);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
