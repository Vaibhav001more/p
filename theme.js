/* ═══════════════════════════════════════
   InvestIQ v2 — Theme & Language Toggle
   File: js/theme.js
═══════════════════════════════════════ */

/* ── THEME TOGGLE (Dark / Light) ── */
function toggleTheme() {
  const html   = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  document.getElementById('themeBtn').textContent = isDark ? '🌙 Dark' : '☀️ Light';
  // Re-render all Chart.js charts with new theme colours
  if (typeof renderSipChart     === 'function') renderSipChart();
  if (typeof renderCompChart    === 'function') renderCompChart();
  if (typeof renderBudgetChart  === 'function') renderBudgetChart();
}

/* ── LANGUAGE TOGGLE (English / Hindi) ── */
let currentLang = 'en';

function toggleLang() {
  currentLang = currentLang === 'en' ? 'hi' : 'en';
  document.documentElement.setAttribute('data-lang', currentLang);
  document.getElementById('langBtn').textContent =
    currentLang === 'en' ? '🇮🇳 हिन्दी' : '🇬🇧 English';

  // Swap every element that carries data-en / data-hi attributes
  document.querySelectorAll('[data-en]').forEach(el => {
    const val = el.getAttribute('data-' + currentLang);
    if (!val) return;
    if (el.tagName === 'INPUT') {
      el.placeholder = val;
    } else {
      el.textContent = val;
    }
  });

  // Refresh budget tip text after language switch
  if (typeof updateBudget === 'function') updateBudget();
}

/* ── SCROLL REVEAL ── */
(function initReveal() {
  const obs = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    }),
    { threshold: 0.1 }
  );
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();
