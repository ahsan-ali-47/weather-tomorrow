// Vercel Serverless Function Proxy for MET Norway Weather API
// api/weather.js
const https = require('https');
const fs = require('fs');
const path = require('path');

const SITE_NAME = "Weather Tomorrow";
const DEFAULT_CONTACT = "https://www.weathertomorrow.website"; // Site URL as the identifying contact (no email set).

// In-memory serverless cache (valid 10 minutes)
const serverCache = new Map();

function getContactEmail() {
  if (process.env.CONTACT_EMAIL && !process.env.CONTACT_EMAIL.includes('HERE')) {
    return process.env.CONTACT_EMAIL;
  }
  try {
    const configPath = path.resolve(__dirname, '../js/config.js');
    if (fs.existsSync(configPath)) {
      const content = fs.readFileSync(configPath, 'utf8');
      const match = content.match(/CONTACT_EMAIL\s*=\s*["']([^"']+)["']/);
      if (match && match[1] && !match[1].includes('HERE') && !match[1].includes('PLACEHOLDER')) {
        return match[1];
      }
    }
  } catch (e) {}
  return DEFAULT_CONTACT;
}

const contactEmail = getContactEmail();
const USER_AGENT = `${SITE_NAME}/1.0 (${contactEmail})`;

function fetchFromMet(urlPath) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.met.no',
      path: urlPath,
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'application/json'
      }
    };

    // Wall-clock deadline: req.setTimeout only covers the socket AFTER it
    // connects, so a slow DNS/TLS handshake could hang past it. This timer
    // bounds the whole attempt (connect + response) to 5s no matter what.
    let settled = false;
    const wallClock = setTimeout(() => {
      if (!settled) {
        settled = true;
        req.destroy();
        reject(new Error('MET Norway request timed out (wall-clock)'));
      }
    }, 5000);

    const req = https.get(options, (apiRes) => {
      let body = '';
      apiRes.on('data', chunk => { body += chunk; });
      apiRes.on('end', () => {
        if (settled) return;
        settled = true;
        clearTimeout(wallClock);
        resolve({
          statusCode: apiRes.statusCode,
          headers: apiRes.headers,
          body: body
        });
      });
    });

    req.on('error', (err) => {
      if (settled) return;
      settled = true;
      clearTimeout(wallClock);
      reject(err);
    });

    req.setTimeout(5000, () => {
      if (settled) return;
      settled = true;
      clearTimeout(wallClock);
      req.destroy();
      reject(new Error('MET Norway request timed out'));
    });
  });
}

// Resilient multi-endpoint fetch (compact first: ~38KB vs ~1.5MB for complete,
// so it rarely truncates on MET's Varnish and answers in ~1s; complete only
// as a fallback. Overall deadline keeps us inside Vercel's 10s Hobby limit.)
async function getValidMetForecast(lat, lon) {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);

  const rLat4 = latitude.toFixed(4);
  const rLon4 = longitude.toFixed(4);
  const rLat3 = latitude.toFixed(3);
  const rLon3 = longitude.toFixed(3);

  const attempts = [
    `/weatherapi/locationforecast/2.0/compact?lat=${rLat4}&lon=${rLon4}`,
    `/weatherapi/locationforecast/2.0/compact?lat=${rLat3}&lon=${rLon3}`,
    `/weatherapi/locationforecast/2.0/complete?lat=${rLat4}&lon=${rLon4}`,
    `/weatherapi/locationforecast/2.0/complete?lat=${rLat3}&lon=${rLon3}`
  ];

  const startedAt = Date.now();
  for (const urlPath of attempts) {
    if (Date.now() - startedAt > 9000) break; // overall deadline: Vercel Hobby kills at 10s
    try {
      const res = await fetchFromMet(urlPath);
      if (res.statusCode === 200 && res.body) {
        const parsed = JSON.parse(res.body);
        if (parsed.properties && parsed.properties.timeseries && parsed.properties.timeseries.length > 0) {
          return res.body;
        }
      }
    } catch (e) {
      // Try subsequent fallback endpoint
    }
  }
  return null;
}

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  const { lat, lon } = req.query || {};

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);

  if (isNaN(latitude) || isNaN(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: 'Valid lat (-90 to 90) and lon (-180 to 180) query parameters required' }));
  }

  const cacheKey = `${latitude.toFixed(3)},${longitude.toFixed(3)}`;

  // Return cached result if fresh (< 10 minutes)
  if (serverCache.has(cacheKey)) {
    const item = serverCache.get(cacheKey);
    if (Date.now() - item.time < 10 * 60 * 1000) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'public, max-age=1800, s-maxage=1800');
      res.setHeader('X-Data-Source', 'MET Norway Locationforecast 2.0 (cache)');
      return res.end(item.body);
    }
  }

  try {
    const validBody = await getValidMetForecast(latitude, longitude);

    if (validBody) {
      serverCache.set(cacheKey, { body: validBody, time: Date.now() });

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'public, max-age=1800, s-maxage=1800');
      res.setHeader('X-Data-Source', 'MET Norway Locationforecast 2.0');
      return res.end(validBody);
    }

    res.statusCode = 502;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({
      error: 'Upstream MET Norway service temporarily unavailable'
    }));
  } catch (err) {
    res.statusCode = 502;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({
      error: 'Failed to contact MET Norway upstream',
      details: err.message
    }));
  }
};
