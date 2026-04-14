/* ═══════════════════════════════════════
   InvestIQ v2 — Glossary Search
   File: js/glossary.js
═══════════════════════════════════════ */

function filterGlossary() {
  const q = document.getElementById('glossarySearch').value.toLowerCase();
  document.querySelectorAll('.term-item').forEach(term => {
    term.style.display = term.innerText.toLowerCase().includes(q) ? '' : 'none';
  });
}
