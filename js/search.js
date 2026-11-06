// ============================================================
// Autocomplete Search Component with Rich Instant Suggestions
// js/search.js
// ============================================================

function initSearch(inputSelector, dropdownSelector, onSelect) {
  const input = document.querySelector(inputSelector);
  const dropdown = document.querySelector(dropdownSelector);

  if (!input || !dropdown) return;

  let debounceTimer = null;
  let activeIndex = -1;

  const pinSvg = (typeof UI !== 'undefined' && UI.svg && UI.svg.pin)
    ? UI.svg.pin
    : '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"></path><circle cx="12" cy="9" r="2.5"></circle></svg>';

  // Render default popular world cities suggestions
  function showDefaultSuggestions() {
    const list = (typeof CONFIG !== 'undefined' && CONFIG.FEATURED_CITIES)
      ? CONFIG.FEATURED_CITIES.slice(0, 8)
      : [
          { slug: 'london', name: 'London', country: 'United Kingdom', lat: 51.5074, lon: -0.1278 },
          { slug: 'new-york', name: 'New York', country: 'United States', lat: 40.7128, lon: -74.0060 },
          { slug: 'tokyo', name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503 },
          { slug: 'paris', name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522 },
          { slug: 'dubai', name: 'Dubai', country: 'United Arab Emirates', lat: 25.2048, lon: 55.2708 },
          { slug: 'sydney', name: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093 }
        ];

    const itemsHtml = list.map((item, idx) => `
      <li class="search-item" data-idx="${idx}" tabindex="0">
        <span class="search-icon">${pinSvg}</span>
        <div class="search-text">
          <span class="search-title">${escapeHtml(item.name)}</span>
          <span class="search-sub">${escapeHtml(item.country || 'Global City')} • Live Forecast</span>
        </div>
      </li>
    `).join('');

    dropdown.innerHTML = `
      <div class="search-header-title">Popular World Cities &amp; Destinations</div>
      <ul class="search-list">${itemsHtml}</ul>
      <div class="search-attribution">Type 3+ letters to search any city worldwide</div>
    `;
    dropdown.classList.add('is-open');

    dropdown.querySelectorAll('.search-item').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.dataset.idx, 10);
        handleSelection(list[idx]);
      });
    });
  }

  // Show suggestions when clicking or focusing on search input
  input.addEventListener('focus', () => {
    if (input.value.trim().length < 3) {
      showDefaultSuggestions();
    }
  });

  input.addEventListener('click', () => {
    if (input.value.trim().length < 3) {
      showDefaultSuggestions();
    }
  });

  // Debounced input search
  input.addEventListener('input', () => {
    const query = input.value.trim();
    clearTimeout(debounceTimer);
    activeIndex = -1;

    if (query.length < 3) {
      if (query.length === 0) {
        showDefaultSuggestions();
      } else {
        dropdown.innerHTML = `
          <div class="search-hint">Keep typing to search worldwide (minimum 3 characters)...</div>
        `;
        dropdown.classList.add('is-open');
      }
      return;
    }

    // Debounce 300ms
    debounceTimer = setTimeout(async () => {
      dropdown.innerHTML = '<div class="search-loading">Searching worldwide locations...</div>';
      dropdown.classList.add('is-open');

      const results = await API.searchCities(query);

      if (!results || results.length === 0) {
        dropdown.innerHTML = `
          <div class="search-empty">No locations found for "${escapeHtml(query)}"</div>
          <div class="search-attribution">Search data © OpenStreetMap contributors</div>
        `;
        return;
      }

      // Build suggestion list
      const listHtml = results.map((item, idx) => {
        const placeTitle = item.name || item.city || 'Unknown';
        const placeSub = [item.state, item.country].filter(Boolean).join(', ') || item.fullName;
        return `
          <li class="search-item" data-idx="${idx}" tabindex="0">
            <span class="search-icon">${pinSvg}</span>
            <div class="search-text">
              <span class="search-title">${escapeHtml(placeTitle)}</span>
              <span class="search-sub">${escapeHtml(placeSub)}</span>
            </div>
          </li>
        `;
      }).join('');

      dropdown.innerHTML = `
        <div class="search-header-title">Matching Locations (${results.length})</div>
        <ul class="search-list">
          ${listHtml}
        </ul>
        <div class="search-attribution">Search data © OpenStreetMap contributors</div>
      `;

      dropdown.querySelectorAll('.search-item').forEach(itemEl => {
        itemEl.addEventListener('click', () => {
          const idx = parseInt(itemEl.dataset.idx, 10);
          handleSelection(results[idx]);
        });
      });
    }, 300);
  });

  // Keyboard navigation (Arrow keys + Enter + Escape)
  input.addEventListener('keydown', (e) => {
    const items = dropdown.querySelectorAll('.search-item');
    if (!items.length || !dropdown.classList.contains('is-open')) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIndex = (activeIndex + 1) % items.length;
      updateActiveItem(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIndex = (activeIndex - 1 + items.length) % items.length;
      updateActiveItem(items);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && items[activeIndex]) {
        items[activeIndex].click();
      } else if (items.length > 0) {
        items[0].click();
      }
    } else if (e.key === 'Escape') {
      dropdown.classList.remove('is-open');
    }
  });

  function updateActiveItem(items) {
    items.forEach((item, i) => {
      if (i === activeIndex) {
        item.classList.add('is-active');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('is-active');
      }
    });
  }

  function handleSelection(place) {
    dropdown.classList.remove('is-open');
    input.value = place.name;

    if (onSelect) {
      onSelect(place);
      return;
    }

    // If city has pre-built page (e.g. london.html, new-york.html)
    const norm = (place.slug || place.name || place.city || '').toLowerCase().trim().replace(/\s+/g, '-');
    const matched = (typeof CONFIG !== 'undefined' && CONFIG.FEATURED_CITIES)
      ? CONFIG.FEATURED_CITIES.find(c => c.slug === norm || c.name.toLowerCase() === norm)
      : null;

    if (matched) {
      window.location.href = `${matched.slug}.html`;
    } else {
      const q = new URLSearchParams({
        name: place.name || place.city,
        lat: place.lat,
        lon: place.lon,
        country: place.country || '',
        state: place.state || place.region || ''
      });
      window.location.href = `city.html?${q.toString()}`;
    }
  }

  // Hook up Search button if adjacent to the input
  const searchBtn = input.parentElement ? input.parentElement.querySelector('button') : null;
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const firstItem = dropdown.querySelector('.search-item');
      if (dropdown.classList.contains('is-open') && firstItem) {
        firstItem.click();
      } else if (input.value.trim().length >= 3) {
        input.dispatchEvent(new Event('input'));
      } else {
        showDefaultSuggestions();
      }
    });
  }

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove('is-open');
    }
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initSearch };
}
