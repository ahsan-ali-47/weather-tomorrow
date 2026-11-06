// Language Dropdown & Internationalization Controller
// js/language.js

function initLanguage() {
  const triggerBtn = document.getElementById('langTrigger');
  const modal = document.getElementById('langModal');
  const searchInput = document.getElementById('langSearchInput');
  const langList = document.getElementById('langList');
  const currentLangLabel = document.getElementById('currentLangLabel');

  if (!triggerBtn || !modal || !searchInput || !langList) return;

  // Restore saved language from localStorage
  const savedLang = localStorage.getItem('mausam_lang') || 'en';
  I18N.currentLang = savedLang;
  updateActiveBadge(savedLang);
  applyTranslations();

  // Populate language list
  function renderLanguages(filterText = '') {
    const q = filterText.toLowerCase().trim();
    const filtered = I18N.languages.filter(l =>
      l.name.toLowerCase().includes(q) ||
      l.native.toLowerCase().includes(q) ||
      l.code.toLowerCase().includes(q)
    );

    if (filtered.length === 0) {
      langList.innerHTML = `<li class="lang-empty">No languages match "${filterText}"</li>`;
      return;
    }

    langList.innerHTML = filtered.map(lang => `
      <li class="lang-item ${lang.code === I18N.currentLang ? 'is-selected' : ''}" data-code="${lang.code}">
        <span class="lang-badge-pill">${lang.badge}</span>
        <span class="lang-name">${lang.name}</span>
        <span class="lang-native">${lang.native}</span>
        ${lang.code === I18N.currentLang ? '<span class="lang-check"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg></span>' : ''}
      </li>
    `).join('');

    langList.querySelectorAll('.lang-item').forEach(el => {
      el.addEventListener('click', () => {
        const code = el.dataset.code;
        selectLanguage(code);
      });
    });
  }

  function selectLanguage(code) {
    I18N.currentLang = code;
    localStorage.setItem('mausam_lang', code);
    updateActiveBadge(code);
    applyTranslations();
    if (typeof Weather !== 'undefined' && Weather.lastRendered) {
      Weather.renderHeroCard(Weather.lastRendered.container, Weather.lastRendered.cityInfo, Weather.lastRendered.parsed);
    }
    closeModal();
  }

  function updateActiveBadge(code) {
    const langObj = I18N.languages.find(l => l.code === code) || I18N.languages[0];
    if (currentLangLabel) {
      const globeSvg = (typeof UI !== 'undefined' && UI.svg && UI.svg.globe)
        ? UI.svg.globe
        : '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>';
      currentLangLabel.innerHTML = `${globeSvg} <span>${langObj.native}</span>`;
    }
  }

  function openModal() {
    modal.classList.add('is-open');
    searchInput.value = '';
    renderLanguages();
    setTimeout(() => searchInput.focus(), 50);
  }

  function closeModal() {
    modal.classList.remove('is-open');
  }

  triggerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (modal.classList.contains('is-open')) {
      closeModal();
    } else {
      openModal();
    }
  });

  searchInput.addEventListener('input', () => {
    renderLanguages(searchInput.value);
  });

  // Close when clicking outside modal
  document.addEventListener('click', (e) => {
    if (!modal.contains(e.target) && !triggerBtn.contains(e.target)) {
      closeModal();
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  renderLanguages();
}

// Update DOM elements that carry data-i18n attributes
function applyTranslations() {
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.dataset.i18n;
    const translation = I18N.t(key);
    if (translation) {
      if (el.tagName === 'INPUT' && el.getAttribute('placeholder')) {
        el.setAttribute('placeholder', translation);
      } else {
        el.textContent = translation;
      }
    }
  });

  // Toggle RTL and language class for Urdu
  if (I18N.currentLang === 'ur') {
    document.body.classList.add('lang-ur');
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'ur');
  } else {
    document.body.classList.remove('lang-ur');
    document.documentElement.setAttribute('dir', 'ltr');
    document.documentElement.setAttribute('lang', I18N.currentLang || 'en');
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initLanguage, applyTranslations };
}
