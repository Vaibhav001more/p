/* ═══════════════════════════════════════
   InvestIQ v2 — SIP Calculator
   File: js/calculator.js
═══════════════════════════════════════ */

let sipChartInst = null;

function calculate() {
  const P = parseFloat(document.getElementById('sipAmount').value)   || 5000;
  const r = parseFloat(document.getElementById('returnRate').value)  / 100 / 12;
  const n = parseFloat(document.getElementById('years').value)       * 12;

  const FV       = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  const invested = P * n;
  const returns  = FV - invested;

  document.getElementById('totalCorpus').innerText  = '₹' + Math.round(FV).toLocaleString('en-IN');
  document.getElementById('totalInvested').innerText= '₹' + Math.round(invested).toLocaleString('en-IN');
  document.getElementById('totalReturns').innerText = '₹' + Math.round(returns).toLocaleString('en-IN');
  document.getElementById('multiplier').innerText   = (FV / invested).toFixed(2) + 'x';

  renderSipChart();
}

function renderSipChart() {
  const P   = parseFloat(document.getElementById('sipAmount').value)  || 5000;
  const r   = parseFloat(document.getElementById('returnRate').value) / 100 / 12;
  const yrs = parseFloat(document.getElementById('years').value);

  const labels = [], inv = [], corpus = [];
  for (let y = 1; y <= yrs; y++) {
    const n  = y * 12;
    const fv = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    labels.push('Yr ' + y);
    inv.push(Math.round(P * n));
    corpus.push(Math.round(fv));
  }

  const isDark    = document.documentElement.getAttribute('data-theme') === 'dark';
  const textColor = isDark ? '#a5d6a7' : '#3d6b4a';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';
  const ctx       = document.getElementById('sipChart').getContext('2d');

  if (sipChartInst) sipChartInst.destroy();
  sipChartInst = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Total Corpus',
          data: corpus,
          borderColor: '#00e676',
          backgroundColor: 'rgba(0,230,118,0.08)',
          fill: true, tension: 0.4, pointRadius: 0, borderWidth: 2
        },
        {
          label: 'Amount Invested',
          data: inv,
          borderColor: isDark ? '#4a6650' : '#7aab85',
          backgroundColor: 'transparent',
          tension: 0.4, pointRadius: 0, borderWidth: 1.5,
          borderDash: [4, 4]
        }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { labels: { color: textColor, font: { size: 11 }, boxWidth: 12 } },
        tooltip: { callbacks: { label: c => ' ₹' + c.raw.toLocaleString('en-IN') } }
      },
      scales: {
        x: { ticks: { color: textColor, font: { size: 10 }, maxTicksLimit: 8 }, grid: { color: gridColor } },
        y: { ticks: { color: textColor, font: { size: 10 }, callback: v => '₹' + Math.round(v / 1000) + 'K' }, grid: { color: gridColor } }
      }
    }
  });
}

// Wire up event listeners
document.getElementById('sipAmount').addEventListener('input', calculate);
document.getElementById('returnRate').addEventListener('input', () => {
  document.getElementById('returnLabel').innerText = document.getElementById('returnRate').value + '%';
  calculate();
});
document.getElementById('years').addEventListener('input', () => {
  document.getElementById('yearLabel').innerText = document.getElementById('years').value + ' Years';
  calculate();
});
