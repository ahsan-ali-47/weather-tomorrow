// UI Helpers & Professional Vector SVG Icons (No Emojis)
// js/ui.js

const UI = {
  // SVG weather icons matching the reference design style
  icons: {
    sunny: `<svg class="w-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="16" fill="#FBBF24" />
      <g stroke="#F59E0B" stroke-width="4" stroke-linecap="round">
        <line x1="32" y1="4" x2="32" y2="10" />
        <line x1="32" y1="54" x2="32" y2="60" />
        <line x1="4" y1="32" x2="10" y2="32" />
        <line x1="54" y1="32" x2="60" y2="32" />
        <line x1="12" y1="12" x2="16.5" y2="16.5" />
        <line x1="47.5" y1="47.5" x2="52" y2="52" />
        <line x1="12" y1="52" x2="16.5" y2="47.5" />
        <line x1="47.5" y1="16.5" x2="52" y2="12" />
      </g>
    </svg>`,

    partlycloudy: `<svg class="w-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="26" cy="24" r="12" fill="#FBBF24" stroke="#F59E0B" stroke-width="2.5" />
      <path d="M22 48h26a10 10 0 0 0 1.5-19.8A14 14 0 0 0 24 26a12 12 0 0 0-2 23.8v-1.8z" fill="#E2E8F0" />
      <path d="M20 48h28a9 9 0 0 0 1-17.8A13 13 0 0 0 22 28a11 11 0 0 0-2 20z" fill="#FFFFFF" />
    </svg>`,

    cloudy: `<svg class="w-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 46h28a11 11 0 0 0 2-21.8A15 15 0 0 0 20 23a12 12 0 0 0-2 23z" fill="#94A3B8" />
      <path d="M16 46h28a10 10 0 0 0 1.5-19.8A14 14 0 0 0 18 24a11 11 0 0 0-2 22z" fill="#CBD5E1" />
    </svg>`,

    rain: `<svg class="w-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 38h28a10 10 0 0 0 1.5-19.8A14 14 0 0 0 20 16a11 11 0 0 0-2 22z" fill="#94A3B8" />
      <g stroke="#38BDF8" stroke-width="3.5" stroke-linecap="round">
        <line x1="22" y1="44" x2="18" y2="52" />
        <line x1="32" y1="44" x2="28" y2="52" />
        <line x1="42" y1="44" x2="38" y2="52" />
      </g>
    </svg>`,

    heavyrain: `<svg class="w-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 36h28a10 10 0 0 0 1.5-19.8A14 14 0 0 0 20 14a11 11 0 0 0-2 22z" fill="#475569" />
      <g stroke="#2563EB" stroke-width="4" stroke-linecap="round">
        <line x1="20" y1="42" x2="16" y2="54" />
        <line x1="30" y1="42" x2="26" y2="54" />
        <line x1="40" y1="42" x2="36" y2="54" />
      </g>
    </svg>`,

    thunder: `<svg class="w-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 34h28a10 10 0 0 0 1.5-19.8A14 14 0 0 0 20 12a11 11 0 0 0-2 22z" fill="#334155" />
      <path d="M34 32l-8 14h8l-4 14 12-16h-8l6-12z" fill="#FACC15" stroke="#EAB308" stroke-width="1.5" stroke-linejoin="round" />
    </svg>`,

    snow: `<svg class="w-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 36h28a10 10 0 0 0 1.5-19.8A14 14 0 0 0 20 14a11 11 0 0 0-2 22z" fill="#94A3B8" />
      <g stroke="#BAE6FD" stroke-width="3" stroke-linecap="round">
        <line x1="22" y1="44" x2="22" y2="50" />
        <line x1="19" y1="47" x2="25" y2="47" />
        <line x1="32" y1="44" x2="32" y2="50" />
        <line x1="29" y1="47" x2="35" y2="47" />
        <line x1="42" y1="44" x2="42" y2="50" />
        <line x1="39" y1="47" x2="45" y2="47" />
      </g>
    </svg>`,

    fog: `<svg class="w-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g stroke="#CBD5E1" stroke-width="4" stroke-linecap="round">
        <line x1="14" y1="24" x2="50" y2="24" />
        <line x1="10" y1="32" x2="54" y2="32" />
        <line x1="16" y1="40" x2="48" y2="40" />
        <line x1="12" y1="48" x2="52" y2="48" />
      </g>
    </svg>`,

    moon: `<svg class="w-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M44 38A18 18 0 1 1 26 20a14 14 0 0 0 18 18z" fill="#FDE047" stroke="#EAB308" stroke-width="2" />
    </svg>`
  },

  // Crisp Vector SVG System Icons (replacing all emojis)
  svg: {
    logo: `<svg viewBox="0 0 36 36" width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg" class="weather-tomorrow-logo" aria-hidden="true"><defs><linearGradient id="wtSunGrad" x1="6" y1="4" x2="22" y2="20" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#FDE047" /><stop offset="60%" stop-color="#F59E0B" /><stop offset="100%" stop-color="#EA580C" /></linearGradient><linearGradient id="wtCloudGrad" x1="8" y1="14" x2="28" y2="32" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#38BDF8" /><stop offset="50%" stop-color="#0EA5E9" /><stop offset="100%" stop-color="#2563EB" /></linearGradient></defs><circle cx="15" cy="13" r="8" fill="url(#wtSunGrad)" /><line x1="15" y1="2" x2="15" y2="4.5" stroke="#FBBF24" stroke-width="2" stroke-linecap="round" /><line x1="7.22" y1="5.22" x2="8.99" y2="6.99" stroke="#FBBF24" stroke-width="2" stroke-linecap="round" /><line x1="4" y1="13" x2="6.5" y2="13" stroke="#FBBF24" stroke-width="2" stroke-linecap="round" /><line x1="22.78" y1="5.22" x2="21.01" y2="6.99" stroke="#FBBF24" stroke-width="2" stroke-linecap="round" /><line x1="26" y1="13" x2="23.5" y2="13" stroke="#FBBF24" stroke-width="2" stroke-linecap="round" /><path d="M11 28h16a6 6 0 0 0 1.2-11.88A8.5 8.5 0 0 0 12.8 13.5 6.5 6.5 0 0 0 11 28z" fill="url(#wtCloudGrad)" /><path d="M12.8 13.5a8.5 8.5 0 0 1 14.5 3 5.98 5.98 0 0 1 .9 2.5c-.8-.5-2.2-.8-3.7-.8-3.8 0-6.7 1.8-8.2 4.3-.9-1.2-2.1-2.1-3.5-2.6.2-2.8 0-6.4 0-6.4z" fill="#BAE6FD" opacity="0.35" /></svg>`,
    pin: `<svg class="svg-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
    
    humidity: `<svg class="svg-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>`,
    
    wind: `<svg class="svg-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path></svg>`,
    
    compass: `<svg class="svg-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>`,
    
    pressure: `<svg class="svg-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path><path d="M16.2 7.8l-1.4 1.4"></path></svg>`,
    
    visibility: `<svg class="svg-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
    
    uv: `<svg class="svg-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`,
    
    calendar: `<svg class="svg-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
    
    clock: `<svg class="svg-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
    
    search: `<svg class="svg-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
    
    chart: `<svg class="svg-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>`,
    
    lightning: `<svg class="svg-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
    
    globe: `<svg class="svg-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`,
    
    target: `<svg class="svg-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>`,
    
    shield: `<svg class="svg-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4"></path></svg>`,
    
    leaf: `<svg class="svg-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path></svg>`,
    
    thermometer: `<svg class="svg-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path></svg>`,
    
    snowflake: `<svg class="svg-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line><line x1="4.93" y1="19.07" x2="19.07" y2="4.93"></line></svg>`,
    
    mail: `<svg class="svg-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
    
    phone: `<svg class="svg-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>`,
    
    document: `<svg class="svg-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,

    cloudSun: `<svg class="svg-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="M20 12h2"></path><path d="m19.07 4.93-1.41 1.41"></path><path d="M15.947 12.65a4 4 0 0 0-5.925-4.128"></path><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"></path></svg>`
  },

  getWeatherIcon: function(symbolCode) {
    if (!symbolCode) return this.icons.sunny;
    const lower = symbolCode.toLowerCase();

    if (lower.includes('thunder')) return this.icons.thunder;
    if (lower.includes('heavyrain')) return this.icons.heavyrain;
    if (lower.includes('rain') || lower.includes('shower')) return this.icons.rain;
    if (lower.includes('snow') || lower.includes('sleet')) return this.icons.snow;
    if (lower.includes('fog')) return this.icons.fog;
    if (lower.includes('partlycloudy') || lower.includes('fair')) return this.icons.partlycloudy;
    if (lower.includes('cloud')) return this.icons.cloudy;
    if (lower.includes('night') && lower.includes('clearsky')) return this.icons.moon;
    return this.icons.sunny;
  },

  degreesToCompass: function(deg) {
    if (deg === undefined || deg === null) return 'N';
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const idx = Math.round(deg / 22.5) % 16;
    return directions[idx];
  },

  msToKmh: function(ms) {
    if (ms === undefined || ms === null) return 0;
    return Math.round(ms * 3.6);
  },

  calculateFeelsLike: function(tempC, humidityPct, windSpeedMs) {
    if (tempC === undefined || tempC === null) return tempC;
    const e = (humidityPct / 100) * 6.105 * Math.exp((17.27 * tempC) / (237.7 + tempC));
    const v = windSpeedMs || 1;
    const at = tempC + 0.33 * e - 0.70 * v - 4.0;
    return Math.round(at);
  },

  formatHourLabel: function(isoString) {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
    } catch (e) {
      return '';
    }
  },

  formatDayDate: function(isoString) {
    try {
      const d = new Date(isoString);
      return {
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      };
    } catch (e) {
      return { day: '', date: '' };
    }
  }
};

// Radar layer pills interactive switcher
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', (e) => {
      const pill = e.target.closest('.radar-pill');
      if (pill) {
        const pillsWrap = pill.closest('.radar-layer-pills');
        if (pillsWrap) {
          pillsWrap.querySelectorAll('.radar-pill').forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
        }
      }
    });
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { UI };
}
