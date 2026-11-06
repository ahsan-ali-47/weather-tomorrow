// ============================================================
// Country Navbar Selector Controller — Weather Tomorrow
// js/countries.js
// Clean country dropdown for navbar; no cities dropdown
// ============================================================

const CountryNav = {
  activeCountryCode: null,

  init() {
    const countryTrigger = document.getElementById('countryTrigger');
    const countryModal = document.getElementById('countryModal');
    const countrySearchInput = document.getElementById('countrySearchInput');
    const countryList = document.getElementById('countryList');

    if (!countryTrigger || !countryModal || !countryList) return;

    // Restore previously selected country from localStorage
    const saved = localStorage.getItem('weathertomorrow_selected_country');
    if (saved && typeof CONFIG !== 'undefined' && CONFIG.getCountry && CONFIG.getCountry(saved)) {
      CountryNav.activeCountryCode = saved;
    } else {
      CountryNav.activeCountryCode = null;
    }

    CountryNav.updateCountryUI();

    // Render countries list with filtering
    function renderCountries(filterText = '') {
      if (typeof CONFIG === 'undefined' || !CONFIG.COUNTRIES) return;
      const q = filterText.toLowerCase().trim();
      const filtered = CONFIG.COUNTRIES.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.capital.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q)
      );

      if (filtered.length === 0) {
        countryList.innerHTML = `<li class="lang-empty">No countries match "${escapeHtml(filterText)}"</li>`;
        return;
      }

      countryList.innerHTML = filtered.map(c => `
        <li class="lang-item ${c.code === CountryNav.activeCountryCode ? 'is-selected' : ''}" data-code="${c.code}">
          <span class="lang-badge-pill">${c.code}</span>
          <div style="display: flex; flex-direction: column; flex: 1;">
            <span class="lang-name">${escapeHtml(c.name)}</span>
            <span style="font-size: 11px; color: var(--text-muted);">${escapeHtml(c.region)} • Capital: ${escapeHtml(c.capital)}</span>
          </div>
          ${c.code === CountryNav.activeCountryCode ? '<span class="lang-check"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg></span>' : ''}
        </li>
      `).join('');

      countryList.querySelectorAll('.lang-item').forEach(el => {
        el.addEventListener('click', () => {
          const code = el.dataset.code;
          CountryNav.selectCountry(code);
        });
      });
    }

    function openCountryModal() {
      countryModal.classList.add('is-open');
      if (countrySearchInput) {
        countrySearchInput.value = '';
        setTimeout(() => countrySearchInput.focus(), 50);
      }
      renderCountries();
    }

    function closeCountryModal() {
      countryModal.classList.remove('is-open');
    }

    countryTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      // Close other open modals like language modal
      const langModal = document.getElementById('langModal');
      if (langModal) langModal.classList.remove('is-open');

      if (countryModal.classList.contains('is-open')) {
        closeCountryModal();
      } else {
        openCountryModal();
      }
    });

    if (countrySearchInput) {
      countrySearchInput.addEventListener('input', () => {
        renderCountries(countrySearchInput.value);
      });
    }

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!countryModal.contains(e.target) && !countryTrigger.contains(e.target)) {
        closeCountryModal();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeCountryModal();
      }
    });

    renderCountries();
  },

  selectCountry(code) {
    CountryNav.activeCountryCode = code;
    localStorage.setItem('weathertomorrow_selected_country', code);
    CountryNav.updateCountryUI();

    const countryModal = document.getElementById('countryModal');
    if (countryModal) countryModal.classList.remove('is-open');

    if (typeof CONFIG === 'undefined' || !CONFIG.getCountry) return;
    const countryObj = CONFIG.getCountry(code);
    if (!countryObj) return;

    // If on countries.html directory page, scroll smoothly to that country's section
    const countryCard = document.getElementById(`country-${code.toLowerCase()}`);
    if (countryCard) {
      countryCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      countryCard.style.outline = '3px solid #0284C7';
      setTimeout(() => { countryCard.style.outline = ''; }, 2500);
      return;
    }

    const firstCity = (countryObj.cities && countryObj.cities.length > 0)
      ? countryObj.cities[0]
      : { name: countryObj.capital, lat: countryObj.lat, lon: countryObj.lon, slug: countryObj.capital.toLowerCase().replace(/\s+/g, '-') };

    // If on homepage with live weather container, update weather to top city of selected country
    const weatherContainer = document.getElementById('weatherCardContainer');
    const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/');
    if (isHomePage && weatherContainer && typeof API !== 'undefined' && typeof Weather !== 'undefined') {
      const forecastContainer = document.getElementById('forecastContainer');
      const aqiContainer = document.getElementById('aqiContainer');

      API.getWeather(firstCity.lat, firstCity.lon).then(data => {
        if (data) {
          const parsed = Weather.parseWeatherData(data);
          Weather.renderHeroCard(weatherContainer, {
            slug: firstCity.slug || firstCity.name.toLowerCase().replace(/\s+/g, '-'),
            name: firstCity.name,
            country: countryObj.name,
            region: firstCity.region || countryObj.name,
            lat: firstCity.lat,
            lon: firstCity.lon
          }, parsed);
          if (forecastContainer) Weather.render7DayRow(forecastContainer, parsed.daily);
        }
      }).catch(err => console.error('Country weather switch error:', err));

      if (aqiContainer) {
        API.getAqi(firstCity.lat, firstCity.lon).then(aqiData => {
          Weather.renderAqiBlock(aqiContainer, aqiData);
        }).catch(() => {
          aqiContainer.style.display = 'none';
        });
      }
      return;
    }

    // Otherwise navigate to city weather
    const isPrebuilt = (CONFIG.FEATURED_CITIES || []).some(fc => fc.slug === firstCity.slug);
    if (isPrebuilt && firstCity.slug) {
      window.location.href = `${firstCity.slug}.html`;
    } else {
      window.location.href = `city.html?name=${encodeURIComponent(firstCity.name)}&lat=${firstCity.lat}&lon=${firstCity.lon}&country=${encodeURIComponent(countryObj.name)}`;
    }
  },

  updateCountryUI() {
    const label = document.getElementById('currentCountryLabel');
    if (!label) return;

    const globeSvg = (typeof UI !== 'undefined' && UI.svg && UI.svg.globe)
      ? UI.svg.globe
      : '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" class="svg-ico"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z"></path></svg>';

    if (!CountryNav.activeCountryCode || typeof CONFIG === 'undefined' || !CONFIG.getCountry) {
      label.innerHTML = `${globeSvg} <span>Select Country</span>`;
    } else {
      const countryObj = CONFIG.getCountry(CountryNav.activeCountryCode);
      const name = countryObj ? countryObj.name : 'Select Country';
      label.innerHTML = `${globeSvg} <span>${escapeHtml(name)}</span>`;
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  CountryNav.init();
});
