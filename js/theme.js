/* Weather Tomorrow — Light / Dark theme toggle.
   Choice is saved in localStorage ('wt-theme'). Default is light.
   The <html data-theme> attribute is set by a tiny inline script in <head>
   (before the stylesheet loads) so there is no light-flash on dark. */
(function () {
  var STORAGE_KEY = 'wt-theme';
  var LIGHT_META = '#38BDF8';
  var DARK_META = '#0A1628';

  function getSavedTheme() {
    try {
      var t = localStorage.getItem(STORAGE_KEY);
      return (t === 'dark' || t === 'light') ? t : 'light';
    } catch (e) {
      return 'light';
    }
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? DARK_META : LIGHT_META);
    var btn = document.getElementById('themeToggle');
    if (btn) {
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      btn.setAttribute('title', theme === 'dark' ? 'Light mode' : 'Dark mode');
      var sun = btn.querySelector('.theme-icon-sun');
      var moon = btn.querySelector('.theme-icon-moon');
      if (sun) sun.style.display = theme === 'dark' ? 'block' : 'none';
      if (moon) moon.style.display = theme === 'dark' ? 'none' : 'block';
    }
  }

  function toggleTheme() {
    var current = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  function initTheme() {
    var btn = document.getElementById('themeToggle');
    if (btn) btn.addEventListener('click', toggleTheme);
    applyTheme(getSavedTheme());
  }

  if (typeof window !== 'undefined') {
    window.WTTheme = { init: initTheme, toggle: toggleTheme, apply: applyTheme };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initTheme);
    } else {
      initTheme();
    }
  }
})();
