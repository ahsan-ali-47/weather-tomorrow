/* Weather Tomorrow PWA: registers the service worker and shows the
   floating "Install App" button when the browser says the site can be
   installed. No button is shown if the app is already installed. */
(function () {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js').catch(function () {});
    });
  }

  var deferredPrompt = null;

  function isInstalled() {
    return window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;
  }

  function showInstallButton() {
    if (isInstalled()) return;
    if (document.getElementById('pwa-install-btn')) return;
    var btn = document.createElement('button');
    btn.id = 'pwa-install-btn';
    btn.type = 'button';
    btn.textContent = 'Install App';
    btn.setAttribute('aria-label', 'Install Weather Tomorrow app');
    btn.style.cssText = 'position:fixed;right:16px;bottom:16px;z-index:9999;padding:12px 18px;border:none;border-radius:999px;background:#38BDF8;color:#fff;font-weight:700;font-size:15px;font-family:inherit;box-shadow:0 4px 14px rgba(0,0,0,.25);cursor:pointer;';
    btn.addEventListener('click', function () {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(function () {
        deferredPrompt = null;
        btn.remove();
      }).catch(function () {});
    });
    document.body.appendChild(btn);
  }

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;
    showInstallButton();
  });

  window.addEventListener('appinstalled', function () {
    deferredPrompt = null;
    var b = document.getElementById('pwa-install-btn');
    if (b) b.remove();
  });
})();
