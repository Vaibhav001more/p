/* ═══════════════════════════════════════
   InvestIQ v2 — FD vs SIP vs Gold
   File: js/comparison.js
═══════════════════════════════════════ */

let compChartInst = null;

function runComparison() {
  const P   = parseFloat(document.getElementById('compAmount').value) || 10000;
  const yrs = parseFloat(document.getElementById('compYears').value)  || 10;
  if (!P || !yrs || P < 1 || yrs < 1) return;

  function calcFV(rate) {
    const r = rate / 100 / 12;
    const n = yrs * 12;
    return P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  }

  const fdFV   = calcFV(7);
  const sipFV  = calcFV(12);
  const goldFV = calcFV(10);
  const invested = P * yrs * 12;

  // Clear previous winner badges and classes
  ['compFD', 'compSIP', 'compGold'].forEach(id => {
    const el = document.getElementById(id);
    el.classList.remove('winner');
    const b = el.querySelector('.comp-winner-badge');
    if (b) b.remove();
  });

  // Populate final values
  document.getElementById('fdFinal').innerText    = '₹' + Math.round(fdFV).toLocaleString('en-IN');
  document.getElementById('fdProfit').innerHTML   = 'Profit: <span class="green">+₹' + Math.round(fdFV   - invested).toLocaleString('en-IN') + '</span>';
  document.getElementById('sipFinal').innerText   = '₹' + Math.round(sipFV).toLocaleString('en-IN');
  document.getElementById('sipProfit').innerHTML  = 'Profit: <span class="green">+₹' + Math.round(sipFV  - invested).toLocaleString('en-IN') + '</span>';
  document.getElementById('goldFinal').innerText  = '₹' + Math.round(goldFV).toLocaleString('en-IN');
  document.getElementById('goldProfit').innerHTML = 'Profit: <span class="green">+₹' + Math.round(goldFV - invested).toLocaleString('en-IN') + '</span>';

  // Mark the winner card
  const winId  = sipFV >= goldFV && sipFV >= fdFV ? 'compSIP'
               : goldFV >= fdFV                   ? 'compGold'
               :                                    'compFD';
  const winCard = document.getElementById(winId);
  winCard.classList.add('winner');
  const badge = document.createElement('div');
  badge.className   = 'comp-winner-badge';
  badge.textContent = '🏆 Best Return';
  winCard.appendChild(badge);

  renderCompChart();
}

function renderCompChart() {
  const P   = parseFloat(document.getElementById('compAmount').value) || 10000;
  const yrs = parseFloat(document.getElementById('compYears').value)  || 10;

  const labels = [], fdData = [], sipData = [], goldData = [];
  for (let y = 1; y <= yrs; y++) {
    labels.push('Yr ' + y);
    const n = y * 12;
    fdData.push  (Math.round(P * ((Math.pow(1 +  7/100/12, n) - 1) / ( 7/100/12)) * (1 +  7/100/12)));
    sipData.push (Math.round(P * ((Math.pow(1 + 12/100/12, n) - 1) / (12/100/12)) * (1 + 12/100/12)));
    goldData.push(Math.round(P * ((Math.pow(1 + 10/100/12, n) - 1) / (10/100/12)) * (1 + 10/100/12)));
  }

  const isDark    = document.documentElement.getAttribute('data-theme') === 'dark';
  const textColor = isDark ? '#a5d6a7' : '#3d6b4a';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';
  const ctx       = document.getElementById('compChart').getContext('2d');

  if (compChartInst) compChartInst.destroy();
  compChartInst = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        { label: 'SIP (12%)',  data: sipData,  borderColor: '#00e676', backgroundColor: 'rgba(0,230,118,0.06)', fill: true, tension: 0.4, pointRadius: 0, borderWidth: 2.5 },
        { label: 'Gold (10%)', data: goldData, borderColor: '#ffd54f', backgroundColor: 'transparent', tension: 0.4, pointRadius: 0, borderWidth: 2 },
        { label: 'FD (7%)',    data: fdData,   borderColor: '#42a5f5', backgroundColor: 'transparent', tension: 0.4, pointRadius: 0, borderWidth: 2 }
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
document.getElementById('compAmount').addEventListener('input', runComparison);
document.getElementById('compYears').addEventListener('input',  runComparison);
