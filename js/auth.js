/**
 * Manejo básico de autenticación en el cliente para ServiLocal.
 * Guarda usuarios en localStorage, mantiene la sesión y permite iniciar con Google.
 */
(function() {
  'use strict';

  const USER_STORAGE_KEY = 'servilocal:users';
  const SESSION_STORAGE_KEY = 'servilocal:session';
  const PROTECTED_PAGES = new Set(['perfil.html']);
  const googleClientId = (document.querySelector('meta[name="google-signin-client_id"]')?.content || '').trim();
  let googleSdkPromise = null;
  let lastGoogleAction = 'login';

  document.addEventListener('DOMContentLoaded', () => {
    restorePersistedSession();
    initLoginForm();
    initRegisterForm();
    setupLogoutButton();
    enforceProtectedPages();
    hydrateProfilePage();
    initGoogleSignInButtons();
  });

  window.ServiLocalAuth = window.ServiLocalAuth || {};
  Object.assign(window.ServiLocalAuth, {
    getCurrentUser,
    logout,
    persistProfileUpdates
  });

  function getPageName() {
    const path = window.location.pathname.split('/').pop();
    return path || 'index.html';
  }

  function loadUsers() {
    try {
      return JSON.parse(localStorage.getItem(USER_STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveUsers(users) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
  }

  function normalizeEmail(value) {
    return (value || '').trim().toLowerCase();
  }

  function findUserByEmail(email) {
    const normalized = normalizeEmail(email);
    return loadUsers().find(user => normalizeEmail(user.email) === normalized);
  }

  function createSession(user, options = {}) {
    const sessionPayload = {
      id: user.id,
      fullName: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
      email: user.email,
      phone: user.phone || '',
      role: user.role || 'cliente',
      provider: user.provider || 'local',
      picture: user.picture || '',
      location: user.location || '',
      about: user.about || ''
    };

    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionPayload));

    if (options.remember) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionPayload));
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }

  function getCurrentUser() {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY) || localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  function restorePersistedSession() {
    if (!sessionStorage.getItem(SESSION_STORAGE_KEY)) {
      const persisted = localStorage.getItem(SESSION_STORAGE_KEY);
      if (persisted) {
        sessionStorage.setItem(SESSION_STORAGE_KEY, persisted);
      }
    }
  }

  function isSessionPersisted() {
    return Boolean(localStorage.getItem(SESSION_STORAGE_KEY));
  }

  function enforceProtectedPages() {
    if (PROTECTED_PAGES.has(getPageName()) && !getCurrentUser()) {
      window.location.href = 'login.html';
    }
  }

  function initLoginForm() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = normalizeEmail(form.email.value);
      const password = form.password.value.trim();
      const remember = form.querySelector('#remember')?.checked;

      if (!email || !password) {
        showFormStatus(form, 'Ingresá correo y contraseña.', false);
        return;
      }

      const storedUsers = loadUsers();
      const user = storedUsers.find(u => normalizeEmail(u.email) === email);

      if (!user) {
        showFormStatus(form, 'No encontramos una cuenta con ese correo.', false);
        return;
      }

      if (user.provider !== 'google' && user.password !== password) {
        showFormStatus(form, 'Contraseña incorrecta.', false);
        return;
      }

      setFormLoading(form, true);
      createSession(user, { remember });
      showFormStatus(form, 'Inicio de sesión exitoso. Redirigiendo…', true);
      setTimeout(() => window.location.href = 'perfil.html', 800);
    });
  }

  function initRegisterForm() {
    const form = document.getElementById('registerForm');
    if (!form) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const payload = {
        firstName: formData.get('firstName')?.trim(),
        lastName: formData.get('lastName')?.trim(),
        email: normalizeEmail(formData.get('email')),
        phone: formData.get('phone')?.trim(),
        role: formData.get('role'),
        password: formData.get('password')?.trim(),
        confirmPassword: formData.get('confirmPassword')?.trim(),
        terms: form.querySelector('#terms')?.checked
      };

      const errors = [];
      if (!payload.firstName) errors.push('Ingresá tu nombre.');
      if (!payload.lastName) errors.push('Ingresá tu apellido.');
      if (!payload.email) errors.push('Ingresá un correo válido.');
      if (!payload.phone) errors.push('Ingresá un teléfono de contacto.');
      if (!payload.role) errors.push('Elegí el tipo de cuenta.');
      if (!payload.password || payload.password.length < 6) errors.push('La contraseña debe tener al menos 6 caracteres.');
      if (payload.password !== payload.confirmPassword) errors.push('Las contraseñas no coinciden.');
      if (!payload.terms) errors.push('Debés aceptar los términos y condiciones.');

      if (errors.length) {
        showFormStatus(form, errors[0], false);
        return;
      }

      if (findUserByEmail(payload.email)) {
        showFormStatus(form, 'Ese correo ya está registrado.', false);
        return;
      }

      const users = loadUsers();
      const fullName = `${payload.firstName} ${payload.lastName}`.trim();
      const newUser = {
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        firstName: payload.firstName,
        lastName: payload.lastName,
        fullName,
        email: payload.email,
        phone: payload.phone,
        role: payload.role,
        password: payload.password,
        provider: 'local',
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      saveUsers(users);

      setFormLoading(form, true);
      showFormStatus(form, 'Cuenta creada con éxito. Preparando todo…', true);
      createSession(newUser, { remember: true });

      setTimeout(() => {
        form.reset();
        window.location.href = 'perfil.html';
      }, 900);
    });
  }

  function showFormStatus(form, message, isSuccess) {
    let status = form.querySelector('[data-form-status]');
    if (!status) {
      status = document.createElement('div');
      status.dataset.formStatus = 'true';
      status.className = 'c-field-feedback';
      status.setAttribute('role', 'status');
      form.prepend(status);
    }

    status.textContent = message;
    status.className = `c-field-feedback ${isSuccess ? 'c-field-feedback--success' : 'c-field-feedback--error'}`;
    status.style.display = 'block';
  }

  function setFormLoading(form, isLoading) {
    const submit = form.querySelector('button[type="submit"]');
    if (!submit) return;

    if (!submit.dataset.originalText) {
      submit.dataset.originalText = submit.textContent.trim();
    }

    submit.disabled = isLoading;
    submit.textContent = isLoading ? 'Procesando…' : submit.dataset.originalText;
  }

  function hydrateProfilePage() {
    if (getPageName() !== 'perfil.html') return;
    const user = getCurrentUser();
    if (!user) return;

    setTextContent('profile-heading', user.fullName);
    setTextContent('profileEmail', user.email);
    setTextContent('profileLocation', user.location || 'Ubicación no especificada');
    setTextContent('profileAbout', user.about || 'Actualizá tu descripción desde el panel de edición.');
    setTextContent('profileBio', user.about || 'Actualizá tu descripción desde el panel de edición.');
    setTextContent('displayName', user.fullName);
    setTextContent('displayEmail', user.email);
    setTextContent('displayPhone', user.phone || 'Sin teléfono');
    setTextContent('displayAccountType', formatRole(user.role));
    setTextContent('displayLocation', user.location || 'Ubicación no especificada');

    const avatar = document.getElementById('profileImage');
    if (avatar && user.picture) {
      avatar.src = user.picture;
    }
  }

  function setTextContent(id, value) {
    const node = document.getElementById(id);
    if (node && value) {
      node.textContent = value;
    }
  }

  function formatRole(role) {
    if (role === 'proveedor') return 'Proveedor';
    return 'Cliente';
  }

  function setupLogoutButton() {
    const logoutBtn = document.querySelector('[data-action="logout"]');
    if (!logoutBtn) return;

    logoutBtn.addEventListener('click', () => logout());
  }

  function logout() {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem(SESSION_STORAGE_KEY);
    window.location.href = 'login.html';
  }

  function persistProfileUpdates(updates = {}) {
    const session = getCurrentUser();
    if (!session) return;

    const users = loadUsers();
    const userIndex = users.findIndex(u => u.id === session.id);
    if (userIndex === -1) return;

    const updatedUser = {
      ...users[userIndex],
      fullName: updates.fullName || users[userIndex].fullName,
      email: normalizeEmail(updates.email) || users[userIndex].email,
      phone: updates.phone || users[userIndex].phone,
      location: updates.location || users[userIndex].location,
      about: updates.about || users[userIndex].about
    };

    if (updatedUser.fullName) {
      const parts = updatedUser.fullName.trim().split(' ');
      updatedUser.firstName = parts.shift() || updatedUser.firstName;
      updatedUser.lastName = parts.join(' ') || updatedUser.lastName;
    }

    users[userIndex] = updatedUser;
    saveUsers(users);
    createSession(updatedUser, { remember: isSessionPersisted() });
  }

  function initGoogleSignInButtons() {
    const containers = document.querySelectorAll('[data-google-button]');
    if (!containers.length) return;

    if (!googleClientId) {
      containers.forEach(container => {
        container.addEventListener('click', () => {
          showAuthMessage('Configurá tu Client ID de Google en el meta tag correspondiente.', false);
        });
      });
      return;
    }

    loadGoogleSdk()
      .then(() => {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleCredentialResponse,
          ux_mode: 'popup'
        });

        containers.forEach(container => {
          container.addEventListener('click', () => {
            lastGoogleAction = container.dataset.googleButton || 'login';
          }, { capture: true });

          container.innerHTML = '';
          window.google.accounts.id.renderButton(container, {
            type: 'standard',
            theme: 'outline',
            size: 'large',
            text: container.dataset.googleButton === 'register' ? 'signup_with' : 'signin_with',
            width: 220
          });
        });
      })
      .catch(() => {
        showAuthMessage('No pudimos cargar Google Sign-In. Intentalo más tarde.', false);
      });
  }

  function loadGoogleSdk() {
    if (googleSdkPromise) return googleSdkPromise;

    if (window.google && window.google.accounts && window.google.accounts.id) {
      googleSdkPromise = Promise.resolve();
      return googleSdkPromise;
    }

    googleSdkPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });

    return googleSdkPromise;
  }

  function handleGoogleCredentialResponse(response) {
    if (!response || !response.credential) {
      showAuthMessage('No recibimos las credenciales de Google.', false);
      return;
    }

    const payload = decodeGoogleCredential(response.credential);
    if (!payload?.email) {
      showAuthMessage('Google no devolvió un correo válido.', false);
      return;
    }

    const users = loadUsers();
    let user = users.find(u => normalizeEmail(u.email) === normalizeEmail(payload.email));

    if (user) {
      if (!user.picture && payload.picture) {
        user.picture = payload.picture;
        saveUsers(users);
      }
    } else {
      user = {
        id: payload.sub || (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())),
        firstName: payload.given_name || payload.name || 'Usuario',
        lastName: payload.family_name || '',
        fullName: payload.name || `${payload.given_name || ''} ${payload.family_name || ''}`.trim(),
        email: normalizeEmail(payload.email),
        phone: '',
        role: 'cliente',
        provider: 'google',
        picture: payload.picture || '',
        createdAt: new Date().toISOString()
      };
      users.push(user);
      saveUsers(users);
    }

    createSession(user, { remember: true });
    showAuthMessage(`Sesión iniciada con Google (${lastGoogleAction}).`, true);
    window.location.href = 'perfil.html';
  }

  function decodeGoogleCredential(token) {
    try {
      const payload = token.split('.')[1];
      const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
      const padded = normalized.padEnd(normalized.length + (4 - (normalized.length % 4 || 4)), '=');
      return JSON.parse(atob(padded));
    } catch {
      return null;
    }
  }

  function showAuthMessage(message, isSuccess) {
    const form = document.getElementById('loginForm') || document.getElementById('registerForm');
    if (form) {
      showFormStatus(form, message, isSuccess);
    } else if (window.announceToScreenReader) {
      window.announceToScreenReader(message);
    } else {
      console.log(message);
    }
  }
})();
