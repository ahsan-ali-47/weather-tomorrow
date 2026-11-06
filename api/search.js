// Vercel Serverless Function Proxy for OpenStreetMap Nominatim Search
// api/search.js
const https = require('https');

const SITE_NAME = "Weather Tomorrow";
// Real contact email for the User-Agent (Nominatim requires an identifying
// contact; the literal CONTACT_EMAIL_HERE placeholder gets throttled/blocked).
const CONTACT_EMAIL = "weathertomorrow-service@outlook.com";
const USER_AGENT = `${SITE_NAME}/1.0 (${CONTACT_EMAIL})`;

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  const { q } = req.query || {};

  if (!q || typeof q !== 'string' || q.trim().length < 3) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ results: [], query: q || '' }));
  }

  const cleanQuery = q.trim();
  const targetUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleanQuery)}&addressdetails=1&limit=10`;

  const requestOptions = {
    headers: {
      'User-Agent': USER_AGENT,
      'Accept-Language': 'en'
    }
  };

  https.get(targetUrl, requestOptions, (apiRes) => {
    let body = '';
    apiRes.on('data', chunk => { body += chunk; });
    apiRes.on('end', () => {
      if (apiRes.statusCode !== 200) {
        res.statusCode = apiRes.statusCode;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ results: [], error: 'Nominatim error' }));
      }

      try {
        const rawResults = JSON.parse(body);

        // Sort suggestions by Nominatim 'importance' highest first
        rawResults.sort((a, b) => (parseFloat(b.importance) || 0) - (parseFloat(a.importance) || 0));

        // Format clean suggestions showing city, state, country
        const formatted = rawResults.map(item => {
          const addr = item.address || {};
          const cityName = addr.city || addr.town || addr.municipality || addr.village || addr.hamlet || addr.county || item.name || '';
          const stateName = addr.state || addr.province || addr.region || '';
          const countryName = addr.country || '';

          let mainText = item.name || cityName;
          let subText = [stateName, countryName].filter(Boolean).join(', ');
          if (!subText && item.display_name) {
            subText = item.display_name;
          }

          return {
            id: item.place_id,
            name: mainText,
            fullName: item.display_name,
            city: cityName,
            state: stateName,
            country: countryName,
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
            importance: item.importance,
            type: item.type
          };
        });

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
        res.setHeader('X-Attribution', 'Data (c) OpenStreetMap contributors, ODbL');
        res.end(JSON.stringify({ results: formatted, query: cleanQuery }));
      } catch (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ results: [], error: 'Failed parsing search response' }));
      }
    });
  }).on('error', (err) => {
    res.statusCode = 502;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ results: [], error: 'Failed connecting to search provider', details: err.message }));
  });
};

