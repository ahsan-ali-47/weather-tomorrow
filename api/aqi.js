// Vercel Serverless Function Proxy for OpenAQ API
// api/aqi.js
const https = require('https');

module.exports = async function handler(req, res) {
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

  // If coordinates are invalid, return unavailable
  if (isNaN(latitude) || isNaN(longitude)) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ available: false, message: 'Invalid coordinates' }));
  }

  // OpenAQ API key is server-side only from environment variable
  const apiKey = process.env.OPENAQ_API_KEY;

  if (!apiKey) {
    // When no key is provided, report available: false honestly - never invent numbers
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({
      available: false,
      message: 'OpenAQ API key not configured in environment (OPENAQ_API_KEY)'
    }));
  }

  // OpenAQ v3 locations endpoint with radius in meters (50km radius)
  const targetUrl = `https://api.openaq.org/v3/locations?coordinates=${latitude},${longitude}&radius=50000&limit=5`;

  const requestOptions = {
    headers: {
      'X-API-Key': apiKey,
      'Accept': 'application/json',
      'User-Agent': 'Weather Tomorrow/1.0'
    }
  };

  https.get(targetUrl, requestOptions, (apiRes) => {
    let body = '';
    apiRes.on('data', chunk => { body += chunk; });
    apiRes.on('end', () => {
      if (apiRes.statusCode !== 200) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ available: false, message: 'OpenAQ upstream returned status ' + apiRes.statusCode }));
      }

      try {
        const json = JSON.parse(body);
        const results = json.results || [];
        if (!results.length) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({ available: false, message: 'No stations found nearby' }));
        }

        // Find station with PM2.5 or PM10 sensors
        let stationData = null;
        for (const loc of results) {
          if (loc.sensors && loc.sensors.length > 0) {
            stationData = loc;
            break;
          }
        }

        if (!stationData) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({ available: false, message: 'No active sensor data available' }));
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'public, max-age=1800, s-maxage=1800');
        res.end(JSON.stringify({
          available: true,
          stationName: stationData.name,
          sensors: stationData.sensors,
          datetime: stationData.datetimeFirst || stationData.datetimeLast
        }));
      } catch (e) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ available: false, message: 'Failed parsing OpenAQ response' }));
      }
    });
  }).on('error', (err) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ available: false, message: 'Network error to OpenAQ: ' + err.message }));
  });
};

