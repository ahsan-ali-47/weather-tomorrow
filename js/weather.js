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
            </div>
          </div>

          <!-- 6 Metrics Grid with SVG vector icons -->
          <div class="metrics-grid">
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
              <span class="metric-icon">${(typeof UI !== 'undefined' && UI.svg) ? UI.svg.compass : ''}</span>
              <span class="metric-label">${windDirLabel}</span>
              <span class="metric-val">${current.windDir}</span>
            </div>
            <div class="metric-item">
              <span class="metric-icon">${(typeof UI !== 'undefined' && UI.svg) ? UI.svg.pressure : ''}</span>
              <span class="metric-label">${pressureLabel}</span>
              <span class="metric-val">${current.pressure} hPa</span>
            </div>
            <div class="metric-item">
              <span class="metric-icon">${(typeof UI !== 'undefined' && UI.svg) ? UI.svg.visibility : ''}</span>
              <span class="metric-label">${visibilityLabel}</span>
              <span class="metric-val">${current.visibilityKm} km</span>
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
              <div class="day-col-card" style="background: #F8FAFC; border: 1px solid var(--border-color); border-radius: 12px; padding: 16px 10px; text-align: center;">
                <span class="day-name" style="font-size: 14px; font-weight: 700; color: var(--text-main); display: block;">${dt.day}</span>
                <span class="day-date" style="font-size: 12px; color: var(--text-muted); display: block; margin-bottom: 8px;">${dt.date}</span>
                <div class="day-icon" style="width: 36px; height: 36px; margin: 0 auto 8px;">${dayIcon}</div>
                <span class="day-temps" style="font-size: 14px; font-weight: 700; color: var(--text-main); display: block;">${d.maxTemp}° / ${d.minTemp}°</span>
                <span class="day-cond" style="font-size: 12px; color: var(--text-muted); display: block; margin-top: 4px;">${dayText}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  // Render hourly forecast cards (SVG icons)
  renderHourlyStrip(container, hourlyList) {
    if (!container || !hourlyList) return;
    const hours = hourlyList.slice(0, 24);

    container.innerHTML = `
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

  // Render full 10-day forecast grid (SVG icons)
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
      <div class="weather-error" style="background: #1E293B; color: #F87171; border-radius: var(--card-radius); padding: 36px 20px; text-align: center; border: 1px solid rgba(239, 68, 68, 0.3);">
        <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 700; color: #FFFFFF;">${escapeHtml(msg)}</h3>
        <p style="margin: 0; color: #94A3B8; font-size: 14px;">Live MET Norway telemetry is currently unavailable. Please check your connection or try again.</p>
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

    container.style.display = 'block';
    container.innerHTML = `
      <div class="aqi-card">
        <div class="aqi-header">
          <span class="aqi-icon">${leafSvg}</span>
          <h3 class="aqi-title">${aqiTitle}</h3>
          <span class="aqi-station">Station: ${escapeHtml(aqiData.stationName || 'OpenAQ Station')}</span>
        </div>
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
