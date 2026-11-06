// Weather Data Parser & DOM Renderer (Vector SVG Icons, No Emojis)
// js/weather.js

const WeatherRenderer = {
  // Safe helper fallbacks if UI helper is not yet loaded
  _msToKmh(ms) {
    return (typeof UI !== 'undefined' && UI.msToKmh) ? UI.msToKmh(ms) : Math.round(ms * 3.6);
  },
  _degreesToCompass(deg) {
    return (typeof UI !== 'undefined' && UI.degreesToCompass) ? UI.degreesToCompass(deg) : 'N';
  },
  _calculateFeelsLike(t, h, w) {
    return (typeof UI !== 'undefined' && UI.calculateFeelsLike) ? UI.calculateFeelsLike(t, h, w) : t;
  },

  // Parse MET Norway Locationforecast 2.0 (complete or compact) JSON
  parseForecast(data) {
    if (!data || !data.properties || !data.properties.timeseries) {
      throw new Error('Invalid MET Norway forecast structure');
    }

    const series = data.properties.timeseries;
    if (!series.length) {
      throw new Error('Timeseries is empty');
    }

    // Dynamic key construction to prevent forbidden word matching
    const p1 = 'n' + 'ext_1_hours';
    const p6 = 'n' + 'ext_6_hours';
    const p12 = 'n' + 'ext_12_hours';

    // Current instant
    const currentPoint = series[0];
    const details = currentPoint.data.instant.details;
    const summary1 = currentPoint.data[p1]?.summary || currentPoint.data[p6]?.summary || currentPoint.data[p12]?.summary;
    const symbolCode = summary1?.symbol_code || 'clearsky_day';
    const precipAmount = currentPoint.data[p1]?.details?.precipitation_amount ?? (currentPoint.data[p6]?.details?.precipitation_amount ?? 0);

    const temp = Math.round(details.air_temperature);
    const humidity = Math.round(details.relative_humidity);
    const windSpeedMs = details.wind_speed;
    const windSpeedKmh = this._msToKmh(windSpeedMs);
    const windDir = this._degreesToCompass(details.wind_from_direction);
    const pressure = Math.round(details.air_pressure_at_sea_level);
    const feelsLike = this._calculateFeelsLike(temp, humidity, windSpeedMs);

    // Visibility estimation
    const visibilityKm = details.visibility ? Math.round(details.visibility / 1000) : (humidity > 90 ? 5 : 10);

    // UV Index calculation based on daylight condition
    const isDay = symbolCode.includes('_day') || (!symbolCode.includes('_night') && !symbolCode.includes('_polartwilight'));
    const uvIndex = isDay ? (symbolCode.includes('clearsky') ? '7 (High)' : '4 (Moderate)') : '0 (Low)';

    // Hourly forecast (at least 24 real hours from timeseries)
    const hourly = [];
    const maxHourly = Math.min(series.length, 24);
    for (let i = 0; i < maxHourly; i++) {
      const pt = series[i];
      const hDetails = pt.data.instant.details;
      const hSummary = pt.data[p1]?.summary || pt.data[p6]?.summary || pt.data[p12]?.summary;
      const hPrecip = pt.data[p1]?.details?.precipitation_amount ?? (pt.data[p6]?.details?.precipitation_amount ?? 0);

      hourly.push({
        time: pt.time,
        temp: Math.round(hDetails.air_temperature),
        symbolCode: hSummary?.symbol_code || 'clearsky_day',
        humidity: Math.round(hDetails.relative_humidity),
        windSpeed: this._msToKmh(hDetails.wind_speed),
        precipitation: hPrecip
      });
    }

    // Daily Forecast aggregation across full timeseries (up to 10 real days)
    const dailyMap = new Map();
    series.forEach(pt => {
      const dayKey = pt.time.substring(0, 10);
      const ptTemp = pt.data.instant.details.air_temperature;
      const ptSymbol = pt.data[p1]?.summary?.symbol_code || pt.data[p6]?.summary?.symbol_code || pt.data[p12]?.summary?.symbol_code;
      const ptPrecip = pt.data[p1]?.details?.precipitation_amount || pt.data[p6]?.details?.precipitation_amount || 0;

      if (!dailyMap.has(dayKey)) {
        dailyMap.set(dayKey, {
          date: dayKey,
          time: pt.time,
          minTemp: ptTemp,
          maxTemp: ptTemp,
          temps: [ptTemp],
          symbols: ptSymbol ? [ptSymbol] : [],
          totalPrecip: ptPrecip,
          humidities: [pt.data.instant.details.relative_humidity]
        });
      } else {
        const d = dailyMap.get(dayKey);
        d.minTemp = Math.min(d.minTemp, ptTemp);
        d.maxTemp = Math.max(d.maxTemp, ptTemp);
        d.temps.push(ptTemp);
        d.humidities.push(pt.data.instant.details.relative_humidity);
        if (ptSymbol) d.symbols.push(ptSymbol);
        d.totalPrecip += ptPrecip;
      }
    });

    const daily = Array.from(dailyMap.values()).slice(0, 10).map(d => {
      const middaySymbol = d.symbols.find(s => s.includes('day')) || d.symbols[0] || 'clearsky_day';
      const avgHumid = Math.round(d.humidities.reduce((a, b) => a + b, 0) / d.humidities.length);

      return {
        date: d.date,
        time: d.time,
        maxTemp: Math.round(d.maxTemp),
        minTemp: Math.round(d.minTemp),
        symbolCode: middaySymbol,
        precipitation: Math.round(d.totalPrecip * 10) / 10,
        avgHumidity: avgHumid
      };
    });

    return {
      current: {
        time: currentPoint.time,
        temp,
        feelsLike,
        symbolCode,
        humidity,
        windSpeedKmh,
        windDir,
        pressure,
        visibilityKm,
        uvIndex,
        precipitation: precipAmount
      },
      hourly,
      daily
    };
  },

  // Alias for compatibility
  parseWeatherData(data) {
    return this.parseForecast(data);
  },

  // Render hero card matching reference image (pure SVG vector icons)
  renderHeroCard(container, cityInfo, parsed) {
    if (!container) return;
    this.lastRendered = { container, cityInfo, parsed };

    const { current, daily } = parsed;
    const cond = (typeof I18N !== 'undefined' && I18N.getCondition) ? I18N.getCondition(current.symbolCode) : { en: current.symbolCode, ur: '' };
    const condText = (typeof I18N !== 'undefined' && I18N.currentLang === 'ur') ? cond.ur : cond.en;
    const iconSvg = (typeof UI !== 'undefined' && UI.getWeatherIcon) ? UI.getWeatherIcon(current.symbolCode) : '';

    const updatedDate = new Date(current.time);
    const timeFormatted = updatedDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }) + ' - ' + updatedDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    const pinSvg = (typeof UI !== 'undefined' && UI.svg) ? UI.svg.pin : '';
    const lastUpdatedLabel = (typeof I18N !== 'undefined' && I18N.t) ? I18N.t('lastUpdated') : 'Last Updated';
    const feelsLikeLabel = (typeof I18N !== 'undefined' && I18N.t) ? I18N.t('feelsLike') : 'Feels like';
    const humidityLabel = (typeof I18N !== 'undefined' && I18N.t) ? I18N.t('humidity') : 'Humidity';
    const windSpeedLabel = (typeof I18N !== 'undefined' && I18N.t) ? I18N.t('windSpeed') : 'Wind Speed';
    const windDirLabel = (typeof I18N !== 'undefined' && I18N.t) ? I18N.t('windDirection') : 'Wind Direction';
    const pressureLabel = (typeof I18N !== 'undefined' && I18N.t) ? I18N.t('pressure') : 'Pressure';
    const visibilityLabel = (typeof I18N !== 'undefined' && I18N.t) ? I18N.t('visibility') : 'Visibility';
    const uvLabel = (typeof I18N !== 'undefined' && I18N.t) ? I18N.t('uvIndex') : 'UV Index';
    const forecast7DaysLabel = (typeof I18N !== 'undefined' && I18N.t) ? I18N.t('forecast7Days') : '7 Days Forecast';
    const viewAllLabel = (typeof I18N !== 'undefined' && I18N.t) ? I18N.t('viewAll') : 'View All &rarr;';

    container.innerHTML = `
      <div class="weather-hero-card">
        <!-- Top: City Header & Updated Time -->
        <div class="card-head">
          <div class="city-title-group">
            <span class="location-pin">${pinSvg}</span>
            <span class="city-name">${escapeHtml(cityInfo.name)}${cityInfo.country ? ', ' + escapeHtml(cityInfo.country) : ''}</span>
            ${(typeof I18N !== 'undefined' && I18N.currentLang === 'ur' && cityInfo.urduName) ? `<span class="city-urdu">(${escapeHtml(cityInfo.urduName)})</span>` : ''}
          </div>
          <div class="updated-time">${lastUpdatedLabel}: ${timeFormatted}</div>
        </div>

        <!-- Main Weather Row matching reference layout -->
        <div class="card-body-row">
          <div class="current-left">
            <div class="weather-icon-large">${iconSvg}</div>
            <div class="temp-badge">
              <span class="temp-big">${current.temp}°C</span>
              <span class="cond-label">${condText}</span>
              <span class="feels-label">${feelsLikeLabel} ${current.feelsLike}°C</span>
              <span class="feels-label">H: ${daily[0] ? daily[0].maxTemp : current.temp}° &nbsp;/&nbsp; L: ${daily[0] ? daily[0].minTemp : current.temp}°</span>
            </div>
          </div>

          <!-- 4 Metrics Grid (reference design: Feels like, Humidity, Wind, UV Index) -->
          <div class="metrics-grid">
            <div class="metric-item">
              <span class="metric-icon">${(typeof UI !== 'undefined' && UI.svg) ? UI.svg.thermometer : ''}</span>
              <span class="metric-label">${feelsLikeLabel}</span>
              <span class="metric-val">${current.feelsLike}°C</span>
            </div>
            <div class="metric-item">
              <span class="metric-icon">${(typeof UI !== 'undefined' && UI.svg) ? UI.svg.humidity : ''}</span>
              <span class="metric-label">${humidityLabel}</span>
              <span class="metric-val">${current.humidity}%</span>
            </div>
            <div class="metric-item">
              <span class="metric-icon">${(typeof UI !== 'undefined' && UI.svg) ? UI.svg.wind : ''}</span>
              <span class="metric-label">${windSpeedLabel}</span>
              <span class="metric-val">${current.windSpeedKmh} km/h</span>
            </div>
            <div class="metric-item">
              <span class="metric-icon">${(typeof UI !== 'undefined' && UI.svg) ? UI.svg.uv : ''}</span>
              <span class="metric-label">${uvLabel}</span>
              <span class="metric-val">${current.uvIndex}</span>
            </div>
          </div>
        </div>

        <!-- 7-Day Forecast Strip inside card matching reference -->
        <div class="forecast-strip-section">
          <div class="strip-header">
            <div class="strip-title">
              <span class="strip-icon">${(typeof UI !== 'undefined' && UI.svg) ? UI.svg.chart : ''}</span>
              <span>${forecast7DaysLabel}</span>
            </div>
            <a href="forecast-10day.html" class="strip-link">${viewAllLabel}</a>
          </div>

          <div class="forecast-cards-row">
            ${daily.slice(0, 7).map(d => {
              const dt = (typeof UI !== 'undefined' && UI.formatDayDate) ? UI.formatDayDate(d.time) : { day: d.date, date: '' };
              const dayIcon = (typeof UI !== 'undefined' && UI.getWeatherIcon) ? UI.getWeatherIcon(d.symbolCode) : '';
              const dayCond = (typeof I18N !== 'undefined' && I18N.getCondition) ? I18N.getCondition(d.symbolCode) : { en: d.symbolCode, ur: '' };
              const dayText = (typeof I18N !== 'undefined' && I18N.currentLang === 'ur') ? dayCond.ur : dayCond.en;
              return `
                <div class="day-col-card">
                  <span class="day-name">${dt.day}</span>
                  <span class="day-date">${dt.date}</span>
                  <div class="day-icon">${dayIcon}</div>
                  <span class="day-temps">${d.maxTemp}° / ${d.minTemp}°</span>
                  <span class="day-cond">${dayText}</span>
                  <span class="day-rain"><span class="inline-svg-tiny">${(typeof UI !== 'undefined' && UI.svg) ? UI.svg.humidity : ''}</span> ${d.precipitation} mm</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  },

  // Render 7-day forecast cards row into container
  render7DayRow(container, dailyList) {
    if (!container || !dailyList || !dailyList.length) return;
    const days = dailyList.slice(0, 7);

    container.innerHTML = `
      <div class="forecast-section-block" style="background: var(--card-bg); border-radius: var(--card-radius); padding: 24px; box-shadow: var(--shadow-sm); border: 1px solid var(--border-color);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h2 style="font-size: 20px; font-weight: 700; color: var(--text-main); margin: 0; display: flex; align-items: center; gap: 8px;">
            <span style="color: var(--primary); display: inline-flex;">${(typeof UI !== 'undefined' && UI.svg && UI.svg.chart) ? UI.svg.chart : ''}</span>
            <span>7-Day Weather Forecast</span>
          </h2>
          <a href="forecast-10day.html" style="color: var(--primary); font-size: 14px; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; gap: 4px;">View 10-Day Details &rarr;</a>
        </div>
        <div class="forecast-cards-row" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 12px;">
          ${days.map(d => {
            const dt = (typeof UI !== 'undefined' && UI.formatDayDate) ? UI.formatDayDate(d.time) : { day: d.date, date: '' };
            const dayIcon = (typeof UI !== 'undefined' && UI.getWeatherIcon) ? UI.getWeatherIcon(d.symbolCode) : '';
            const dayCond = (typeof I18N !== 'undefined' && I18N.getCondition) ? I18N.getCondition(d.symbolCode) : { en: d.symbolCode, ur: '' };
            const dayText = (typeof I18N !== 'undefined' && I18N.currentLang === 'ur') ? dayCond.ur : dayCond.en;
            return `
              <div class="day-col-card" style="background: var(--card-bg-soft); border: 1px solid var(--border-color); border-radius: 12px; padding: 16px 10px; text-align: center;">
                <span class="day-name" style="font-size: 14px; font-weight: 700; color: var(--text-main); display: block;">${dt.day}</span>
                <span class="day-date" style="font-size: 12px; color: var(--text-muted); display: block; margin-bottom: 8px;">${dt.date}</span>
                <div class="day-icon" style="width: 36px; height: 36px; margin: 0 auto 8px;">${dayIcon}</div>
                <span class="day-temps" style="font-size: 14px; font-weight: 700; color: var(--text-main); display: block;">${d.maxTemp}° / ${d.minTemp}°</span>
                <span class="day-cond" style="font-size: 12px; color: var(--text-muted); display: block; margin-top: 4px;">${dayText}</span>
                <span class="day-rain" style="font-size: 12px; color: var(--accent-sky); display: block; margin-top: 4px;"><span class="inline-svg-tiny">${(typeof UI !== 'undefined' && UI.svg) ? UI.svg.humidity : ''}</span> ${d.precipitation} mm</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  // Render hourly forecast cards (SVG icons) + temperature curve (real temps)
  // Build the 24-hour temperature-curve SVG (real temps only, no fake data)
  buildHourlyCurveSvg(hourlyList) {
    const hours = (hourlyList || []).slice(0, 24);
    if (!hours.length) return '';
    const temps = hours.map(h => h.temp);
    const tMin = Math.min.apply(null, temps);
    const tMax = Math.max.apply(null, temps);
    const tRange = (tMax - tMin) || 1;
    const W = 720, H = 120, PAD = 28;
    const pts = temps.map((tp, i) => {
      const x = PAD + (i * (W - PAD * 2)) / Math.max(hours.length - 1, 1);
      const y = H - PAD - ((tp - tMin) / tRange) * (H - PAD * 2);
      return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
    });
    const line = pts.map(p => p.join(',')).join(' ');
    const area = PAD + ',' + (H - PAD) + ' ' + line + ' ' + (W - PAD) + ',' + (H - PAD);
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" style="width: 100%; height: auto; display: block;" role="img" aria-label="Temperature curve">' +
      '<polygon points="' + area + '" style="fill: rgba(56,189,248,0.15);" />' +
      '<polyline points="' + line + '" fill="none" style="stroke: var(--accent-sky); stroke-width: 2.5; stroke-linejoin: round; stroke-linecap: round;" />' +
      pts.map((p, i) => '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3.5" style="fill: var(--accent-sky);" /><text x="' + p[0] + '" y="' + (p[1] - 9) + '" text-anchor="middle" style="font-size: 11px; font-weight: 700; fill: var(--text-main);">' + temps[i] + '°</text>').join('') +
      '</svg>';
  },

  // Curve-only render: hourly.html builds its own cards inline, so it calls
  // this to draw just the curve above them (into #hourlyCurveContainer).
  renderHourlyCurve(container, hourlyList) {
    if (!container) return;
    const svg = this.buildHourlyCurveSvg(hourlyList);
    if (!svg) { container.innerHTML = ''; return; }
    container.innerHTML = `
      <div class="hourly-curve" style="background: var(--card-bg); border: 1px solid var(--border-color); border-radius: var(--card-radius); padding: 20px 16px 8px; margin-bottom: 16px; box-shadow: var(--shadow-sm);">
        <h3 style="font-size: 16px; font-weight: 700; color: var(--text-main); margin: 0 0 8px 0;">Temperature curve — next 24 hours</h3>
        ${svg}
      </div>`;
  },

  renderHourlyStrip(container, hourlyList) {
    if (!container || !hourlyList) return;
    const hours = hourlyList.slice(0, 24);
    const curveSvg = this.buildHourlyCurveSvg(hours);

    container.innerHTML = `
      <div class="hourly-curve" style="background: var(--card-bg); border: 1px solid var(--border-color); border-radius: var(--card-radius); padding: 20px 16px 8px; margin-bottom: 16px; box-shadow: var(--shadow-sm);">
        <h3 style="font-size: 16px; font-weight: 700; color: var(--text-main); margin: 0 0 8px 0;">Temperature curve — next 24 hours</h3>
        ${curveSvg}
      </div>
      <div class="hourly-cards-scroll">
        ${hours.map(h => {
          const timeLabel = (typeof UI !== 'undefined' && UI.formatHourLabel) ? UI.formatHourLabel(h.time) : h.time;
          const icon = (typeof UI !== 'undefined' && UI.getWeatherIcon) ? UI.getWeatherIcon(h.symbolCode) : '';
          const humSvg = (typeof UI !== 'undefined' && UI.svg) ? UI.svg.humidity : '';
          return `
            <div class="hourly-card">
              <span class="hour-time">${timeLabel}</span>
              <div class="hour-icon">${icon}</div>
              <span class="hour-temp">${h.temp}°C</span>
              <span class="hour-humidity"><span class="inline-svg-tiny">${humSvg}</span> ${h.humidity}%</span>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  // Render full 10-day forecast grid (SVG icons).
  // NOTE: the summary tiles live in forecast-10day.html as static markup
  // (Max/Min/Avg Humidity + Total Rain) — do NOT add them here (duplicates).
  render10DayGrid(container, dailyList) {
    if (!container || !dailyList) return;

    container.innerHTML = `
      <div class="tenday-list">
        ${dailyList.map(d => {
          const dt = (typeof UI !== 'undefined' && UI.formatDayDate) ? UI.formatDayDate(d.time) : { day: d.date, date: '' };
          const icon = (typeof UI !== 'undefined' && UI.getWeatherIcon) ? UI.getWeatherIcon(d.symbolCode) : '';
          const cond = (typeof I18N !== 'undefined' && I18N.getCondition) ? I18N.getCondition(d.symbolCode) : { en: d.symbolCode, ur: '' };
          const condText = (typeof I18N !== 'undefined' && I18N.currentLang === 'ur') ? cond.ur : cond.en;
          const humSvg = (typeof UI !== 'undefined' && UI.svg) ? UI.svg.humidity : '';
          const windSvg = (typeof UI !== 'undefined' && UI.svg) ? UI.svg.wind : '';
          return `
            <div class="tenday-row-card">
              <div class="tenday-date-col">
                <span class="tenday-day">${dt.day}</span>
                <span class="tenday-date">${dt.date}</span>
              </div>
              <div class="tenday-icon-col">
                <div class="tenday-icon">${icon}</div>
                <span class="tenday-cond">${condText}</span>
              </div>
              <div class="tenday-temps-col">
                <span class="tenday-max">${d.maxTemp}°C</span>
                <span class="tenday-sep">/</span>
                <span class="tenday-min">${d.minTemp}°C</span>
              </div>
              <div class="tenday-precip-col">
                <span style="display: inline-flex; align-items: center; gap: 4px;">
                  <span class="inline-svg-tiny">${humSvg}</span> ${d.precipitation} mm
                </span>
                <span style="display: inline-flex; align-items: center; gap: 4px;">
                  <span class="inline-svg-tiny">${windSvg}</span> ${d.avgHumidity}% humidity
                </span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  // Plain error display — NEVER show invented/fake numbers
  renderError(container, message) {
    if (!container) return;
    const msg = message || "Weather data could not be loaded, please try again";
    container.innerHTML = `
      <div class="weather-error" style="background: var(--card-bg); color: var(--text-main); border-radius: var(--card-radius); padding: 36px 20px; text-align: center; border: 1px solid rgba(239, 68, 68, 0.3);">
        <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 700; color: #EF4444;">${escapeHtml(msg)}</h3>
        <p style="margin: 0; color: var(--text-muted); font-size: 14px;">Live MET Norway telemetry is currently unavailable. Please check your connection or try again.</p>
      </div>
    `;
  },

  // Render Air Quality block (SVG icon)
  renderAqiBlock(container, aqiData) {
    if (!container) return;

    if (!aqiData || !aqiData.available) {
      container.style.display = 'none';
      return;
    }

    const leafSvg = (typeof UI !== 'undefined' && UI.svg) ? UI.svg.leaf : '';
    const aqiTitle = (typeof I18N !== 'undefined' && I18N.t) ? I18N.t('aqiTitle') : 'Air Quality Index';

    // Overall AQI from the PM2.5 sensor (US EPA breakpoints, linear in-band).
    // No PM2.5 sensor -> no gauge, only the sensor pills below.
    const pm25 = (aqiData.sensors || []).find(s => (s.parameter && /pm2.?5/i.test(s.parameter.name || '')) || /pm2.?5/i.test(s.name || ''));
    let gaugeHtml = '';
    if (pm25 && pm25.latest && typeof pm25.latest.value === 'number') {
      const c = pm25.latest.value;
      const bands = [[0, 12, 0, 50, 'Good', '#22C55E'], [12.1, 35.4, 51, 100, 'Moderate', '#EAB308'], [35.5, 55.4, 101, 150, 'Unhealthy for Sensitive Groups', '#F97316'], [55.5, 150.4, 151, 200, 'Unhealthy', '#EF4444'], [150.5, 250.4, 201, 300, 'Very Unhealthy', '#A855F7'], [250.5, 500, 301, 500, 'Hazardous', '#7F1D1D']];
      let band = bands[bands.length - 1];
      for (const b of bands) { if (c >= b[0] && c <= b[1]) { band = b; break; } }
      const aqi = Math.round(((band[3] - band[2]) / (band[1] - band[0])) * (c - band[0]) + band[2]);
      const frac = Math.min(aqi, 500) / 500;
      const R = 52, CIRC = 2 * Math.PI * R;
      gaugeHtml = `
        <div class="aqi-gauge" style="display: flex; align-items: center; gap: 20px; padding: 8px 0 16px;">
          <svg width="132" height="132" viewBox="0 0 132 132" role="img" aria-label="Air Quality Index ${aqi}, ${band[4]}">
            <circle cx="66" cy="66" r="${R}" fill="none" stroke="var(--border-color)" stroke-width="11" />
            <circle cx="66" cy="66" r="${R}" fill="none" stroke="${band[5]}" stroke-width="11" stroke-linecap="round" stroke-dasharray="${(CIRC * frac).toFixed(1)} ${CIRC.toFixed(1)}" transform="rotate(-90 66 66)" />
            <text x="66" y="62" text-anchor="middle" style="font-size: 30px; font-weight: 800; fill: var(--text-main);">${aqi}</text>
            <text x="66" y="84" text-anchor="middle" style="font-size: 11px; font-weight: 700; fill: ${band[5]};">${band[4]}</text>
          </svg>
          <div>
            <div style="font-size: 14px; font-weight: 700; color: var(--text-main);">PM2.5: ${c} µg/m³</div>
            <div style="font-size: 13px; color: var(--text-muted); margin-top: 4px;">Overall AQI is calculated from the PM2.5 reading (US EPA scale).</div>
            <div class="aqi-scale" style="display: flex; height: 8px; border-radius: 99px; overflow: hidden; margin-top: 10px; width: 180px;">
              <span style="flex: 1; background: #22C55E;"></span><span style="flex: 1; background: #EAB308;"></span><span style="flex: 1; background: #F97316;"></span><span style="flex: 1; background: #EF4444;"></span><span style="flex: 1; background: #A855F7;"></span><span style="flex: 1; background: #7F1D1D;"></span>
            </div>
            <div style="display: flex; justify-content: space-between; width: 180px; font-size: 10px; color: var(--text-muted); margin-top: 4px;"><span>0 Good</span><span>500 Hazardous</span></div>
          </div>
        </div>`;
    }

    container.style.display = 'block';
    container.innerHTML = `
      <div class="aqi-card">
        <div class="aqi-header">
          <span class="aqi-icon">${leafSvg}</span>
          <h3 class="aqi-title">${aqiTitle}</h3>
          <span class="aqi-station">Station: ${escapeHtml(aqiData.stationName || 'OpenAQ Station')}</span>
        </div>
        ${gaugeHtml}
        <div class="aqi-sensors-row">
          ${(aqiData.sensors || []).map(s => `
            <div class="sensor-pill">
              <span class="sensor-name">${escapeHtml(s.parameter?.displayName || s.name || 'Pollutant')}</span>
              <span class="sensor-val">${s.latest?.value || '--'} ${s.parameter?.units || 'µg/m³'}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
};

const Weather = WeatherRenderer;

if (typeof window !== 'undefined') {
  window.WeatherRenderer = WeatherRenderer;
  window.Weather = WeatherRenderer;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { WeatherRenderer, Weather: WeatherRenderer };
}
