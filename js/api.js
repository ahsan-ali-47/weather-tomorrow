// API Client for Weather, Search, and AQI Proxies
// js/api.js

const API = {
  weatherCache: new Map(),
  searchCache: new Map(),

  // Fetch live weather data via serverless proxy with multi-tier MET Norway fallback
  async getWeather(lat, lon) {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    const validLat = !isNaN(latitude) ? latitude : 51.5074;
    const validLon = !isNaN(longitude) ? longitude : -0.1278;
    const key = `${validLat.toFixed(3)},${validLon.toFixed(3)}`;

    // Check in-memory cache (valid for 10 minutes)
    if (this.weatherCache.has(key)) {
      const cached = this.weatherCache.get(key);
      if (Date.now() - cached.timestamp < 10 * 60 * 1000) {
        return cached.data;
      }
    }

    let data = null;
    const isFileProto = (typeof window !== 'undefined' && window.location && window.location.protocol === 'file:');

    // 1. Primary: Serverless proxy (/api/weather) when not running on file:// protocol
    // 10s abort so a slow proxy never hangs the page (Vercel Hobby kills at 10s anyway)
    if (!isFileProto) {
      try {
        const controller = new AbortController();
        const proxyTimer = setTimeout(() => controller.abort(), 10000);
        const response = await fetch(`/api/weather?lat=${validLat.toFixed(4)}&lon=${validLon.toFixed(4)}`, { signal: controller.signal });
        clearTimeout(proxyTimer);
        if (response.ok) {
          const json = await response.json();
          if (json && json.properties && json.properties.timeseries && json.properties.timeseries.length > 0) {
            data = json;
          }
        }
      } catch (proxyErr) {
        console.warn('Weather proxy unreachable, switching to direct MET Norway endpoint:', proxyErr.message);
      }
    }

    // 2. Direct Fallback: When on file:// protocol or if server proxy is unreachable
    // compact first (small ~38KB, fast); a bare browser User-Agent can be 403'd by
    // MET Norway, so this is a last resort, not the main path.
    if (!data) {
      const rLat4 = validLat.toFixed(4);
      const rLon4 = validLon.toFixed(4);
      const rLat3 = validLat.toFixed(3);
      const rLon3 = validLon.toFixed(3);

      const endpoints = [
        `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${rLat4}&lon=${rLon4}`,
        `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${rLat3}&lon=${rLon3}`,
        `https://api.met.no/weatherapi/locationforecast/2.0/complete?lat=${rLat4}&lon=${rLon4}`
      ];

      for (const url of endpoints) {
        try {
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), 8000);
          const res = await fetch(url, { signal: controller.signal });
          clearTimeout(timer);
          if (res.ok) {
            const json = await res.json();
            if (json && json.properties && json.properties.timeseries && json.properties.timeseries.length > 0) {
              data = json;
              break;
            }
          }
        } catch (e) {
          // Continue to subsequent fallback attempt
        }
      }
    }

    if (data && data.properties && data.properties.timeseries && data.properties.timeseries.length > 0) {
      this.weatherCache.set(key, { data, timestamp: Date.now() });
      return data;
    }

    throw new Error('Weather data could not be loaded, please try again');
  },

  // Autocomplete search via Nominatim proxy with direct fallback
  async searchCities(query) {
    if (!query || query.trim().length < 3) {
      return [];
    }

    const cleanQuery = query.trim().toLowerCase();
    if (this.searchCache.has(cleanQuery)) {
      return this.searchCache.get(cleanQuery);
    }

    const isFileProto = (typeof window !== 'undefined' && window.location && window.location.protocol === 'file:');
    let results = null;

    // 1. Primary: Nominatim proxy (/api/search)
    if (!isFileProto) {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(cleanQuery)}`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.results) {
            results = data.results;
          }
        }
      } catch (e) {
        console.warn('Search proxy error, using direct Nominatim fallback:', e.message);
      }
    }

    // 2. Direct Nominatim Fallback: For file:// or if proxy is offline
    if (!results) {
      try {
        const directUrl = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(cleanQuery)}`;
        const directRes = await fetch(directUrl);
        if (directRes.ok) {
          const raw = await directRes.json();
          if (Array.isArray(raw)) {
            raw.sort((a, b) => (b.importance || 0) - (a.importance || 0));
            results = raw.map(item => {
              const addr = item.address || {};
              const city = addr.city || addr.town || addr.village || addr.municipality || item.name;
              const country = addr.country || '';
              const state = addr.state || addr.province || addr.region || '';
              return {
                name: city || item.display_name.split(',')[0],
                fullName: item.display_name,
                city,
                country,
                state,
                lat: parseFloat(item.lat),
                lon: parseFloat(item.lon),
                importance: item.importance || 0
              };
            });
          }
        }
      } catch (e) {
        console.error('Direct Nominatim search error:', e.message);
      }
    }

    results = results || [];
    this.searchCache.set(cleanQuery, results);
    return results;
  },

  // AQI via OpenAQ proxy with safe fallback
  async getAqi(lat, lon) {
    const isFileProto = (typeof window !== 'undefined' && window.location && window.location.protocol === 'file:');
    if (!isFileProto) {
      try {
        const response = await fetch(`/api/aqi?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`);
        if (response.ok) {
          return await response.json();
        }
      } catch (err) {}
    }
    return { available: false };
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { API };
}
