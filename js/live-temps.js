// Live temperatures for country cards and country pages (MET Norway, free, no key).
// Fills every .wt-live group: [data-wt-temp], [data-wt-cond], [data-wt-icon].
// Batched (4 at a time) so a 20-card page does not hammer the proxy. Graceful
// "—" placeholder on any failure — never a fake number.
(function () {
  function fill(group, temp, condLabel, iconSvg) {
    const t = group.querySelector('[data-wt-temp]');
    const c = group.querySelector('[data-wt-cond]');
    const i = group.querySelector('[data-wt-icon]');
    if (t) t.textContent = (temp === null || temp === undefined) ? '—' : Math.round(temp) + '°C';
    if (c) c.textContent = condLabel || '';
    if (i) i.innerHTML = iconSvg || '';
  }

  async function loadOne(group) {
    const lat = parseFloat(group.dataset.lat);
    const lon = parseFloat(group.dataset.lon);
    if (isNaN(lat) || isNaN(lon)) { fill(group, null, '', ''); return; }
    try {
      if (typeof API === 'undefined' || typeof Weather === 'undefined') throw new Error('weather libs missing');
      const data = await API.getWeather(lat, lon);
      const parsed = Weather.parseWeatherData(data);
      const cur = parsed.current;
      let condLabel = cur.symbolCode;
      try {
        if (typeof I18N !== 'undefined' && I18N.getCondition) {
          const g = I18N.getCondition(cur.symbolCode);
          if (g && g.en) condLabel = g.en;
        }
      } catch (e) { /* keep symbol code */ }
      let iconSvg = '';
      try {
        if (typeof UI !== 'undefined' && UI.getWeatherIcon) iconSvg = UI.getWeatherIcon(cur.symbolCode);
      } catch (e) { /* no icon */ }
      fill(group, cur.temp, condLabel, iconSvg);
    } catch (e) {
      fill(group, null, '', '');
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    const groups = Array.prototype.slice.call(document.querySelectorAll('.wt-live'));
    if (!groups.length) return;
    let idx = 0;
    const workers = [];
    const n = Math.min(4, groups.length);
    for (let w = 0; w < n; w++) {
      workers.push((async function () {
        while (idx < groups.length) {
          const g = groups[idx++];
          await loadOne(g);
        }
      })());
    }
    Promise.all(workers).catch(function () { /* placeholders already shown */ });
  });
})();
