/* Weather Tomorrow — homepage live weather radar.
   Leaflet (free CDN) + RainViewer radar tiles (free, no API key) over an
   OpenStreetMap base layer. Loads lazily: Leaflet is only fetched when the
   radar section scrolls into view, so the homepage stays fast. If the map
   or the radar data cannot load, the section shows a short message instead
   of a broken map. Radar tiles always load fresh from the network. */
(function () {
  'use strict';

  var mapEl = document.getElementById('wt-radar-map');
  if (!mapEl) return;

  var playBtn = document.getElementById('wt-radar-play');
  var timeEl = document.getElementById('wt-radar-time');
  var updatedEl = document.getElementById('wt-radar-updated');
  var started = false;

  function showFallback(message) {
    mapEl.innerHTML = '<div class="wt-radar-fallback">' + message + '</div>';
    if (timeEl) timeEl.textContent = 'Unavailable';
    if (playBtn) playBtn.style.display = 'none';
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = function () { reject(new Error('Failed to load ' + src)); };
      document.head.appendChild(s);
    });
  }

  function formatTime(unixSeconds) {
    var d = new Date(unixSeconds * 1000);
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    return pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()) + ' UTC';
  }

  function initMap() {
    try {
      var map = L.map(mapEl, {
        center: [30.0, 70.0],
        zoom: 5,
        scrollWheelZoom: false,
        worldCopyJump: true
      });

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      fetch('https://api.rainviewer.com/public/weather-maps.json')
        .then(function (res) {
          if (!res.ok) throw new Error('RainViewer API error');
          return res.json();
        })
        .then(function (data) {
          var host = (data && data.host) || 'https://tilecache.rainviewer.com';
          var frames = ((data && data.radar && data.radar.past) || []).slice(-8);
          if (!frames.length) {
            showFallback('Live radar is temporarily unavailable. Please try again shortly.');
            return;
          }

          var layers = frames.map(function (frame) {
            return L.tileLayer(host + frame.path + '/256/{z}/{x}/{y}/2/1_1.png', {
              tileSize: 256,
              opacity: 0.6,
              zIndex: 10,
              maxZoom: 18
            });
          });

          var idx = layers.length - 1;
          var current = layers[idx].addTo(map);

          function show(i) {
            map.removeLayer(current);
            current = layers[i].addTo(map);
            if (timeEl) timeEl.textContent = 'Radar ' + formatTime(frames[i].time);
          }

          show(idx);
          if (updatedEl) updatedEl.textContent = 'Updated every 10 minutes';

          var timer = null;
          if (playBtn) {
            playBtn.addEventListener('click', function () {
              if (timer) {
                clearInterval(timer);
                timer = null;
                playBtn.innerHTML = '&#9654; Play';
                playBtn.setAttribute('aria-pressed', 'false');
              } else {
                timer = setInterval(function () {
                  idx = (idx + 1) % layers.length;
                  show(idx);
                }, 700);
                playBtn.innerHTML = '&#10074;&#10074; Pause';
                playBtn.setAttribute('aria-pressed', 'true');
              }
            });
          }
        })
        .catch(function () {
          showFallback('Live radar is temporarily unavailable. Please try again shortly.');
        });
    } catch (e) {
      showFallback('Live radar could not be loaded. Please try again shortly.');
    }
  }

  function start() {
    if (started) return;
    started = true;
    if (typeof L === 'undefined') {
      loadScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js')
        .then(initMap)
        .catch(function () {
          showFallback('Live radar could not be loaded. Please check your connection and try again.');
        });
    } else {
      initMap();
    }
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      if (entries.some(function (entry) { return entry.isIntersecting; })) {
        io.disconnect();
        start();
      }
    }, { rootMargin: '400px' });
    io.observe(mapEl);
  } else {
    start();
  }
})();
