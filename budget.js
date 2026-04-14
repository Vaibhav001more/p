/* ═══════════════════════════════════════
   InvestIQ v2 — Budget Planner
   File: js/budget.js
═══════════════════════════════════════ */

let budgetChartInst = null;
let currentRule     = '50-30-20';

function setRule(rule, btn) {
  currentRule = rule;
  document.querySelectorAll('.rule-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  if      (rule === '50-30-20') setSliders(50, 30, 10, 10);
  else if (rule === '60-20-20') setSliders(60, 20, 10, 10);
  // 'custom' → do nothing, let user slide freely
}

function setSliders(n, w, s, i) {
  document.getElementById('needsRange').value   = n;
  document.getElementById('wantsRange').value   = w;
  document.getElementById('savingsRange').value = s;
  document.getElementById('investRange').value  = i;
  updateBudget();
}

function syncSliders(changed) {
  let n = +document.getElementById('needsRange').value;
  let w = +document.getElementById('wantsRange').value;
  let s = +document.getElementById('savingsRange').value;
  let v = +document.getElementById('investRange').value;
  let total = n + w + s + v;

  if (total > 100) {
    const excess = total - 100;
    const others = ['needs', 'wants', 'savings', 'invest'].filter(x => x !== changed);
    let remaining = excess;
    for (const o of others) {
      const el     = document.getElementById(o + 'Range');
      const reduce = Math.min(+el.value, remaining);
      el.value   = +el.value - reduce;
      remaining -= reduce;
      if (remaining <= 0) break;
    }
  }
  updateBudget();
}

function updateBudget() {
  const income = parseFloat(document.getElementById('income').value) || 50000;
  const n = +document.getElementById('needsRange').value;
  const w = +document.getElementById('wantsRange').value;
  const s = +document.getElementById('savingsRange').value;
  const v = +document.getElementById('investRange').value;

  const fmt = x => '₹' + Math.round(income * x / 100).toLocaleString('en-IN');

  document.getElementById('needsPct').innerText  = n + '%';
  document.getElementById('needsAmt').innerText  = fmt(n);
  document.getElementById('wantsPct').innerText  = w + '%';
  document.getElementById('wantsAmt').innerText  = fmt(w);
  document.getElementById('savingsPct').innerText= s + '%';
  document.getElementById('savingsAmt').innerText= fmt(s);
  document.getElementById('investPct').innerText = v + '%';
  document.getElementById('investAmt').innerText = fmt(v);

  document.getElementById('bNeedsVal').innerText   = fmt(n);
  document.getElementById('bWantsVal').innerText   = fmt(w);
  document.getElementById('bSavingsVal').innerText = fmt(s);
  document.getElementById('bInvestVal').innerText  = fmt(v);

  // Contextual tip
  let tip = '';
  if      (v >= 20) tip = `🔥 Amazing! You're investing ${v}% of income. Your SIP of ${fmt(v)} will grow significantly!`;
  else if (v >= 10) tip = `💡 Good start! You're investing ${v}% (${fmt(v)}). Try to reach 20% for faster wealth growth.`;
  else if (v  >  0) tip = `⚠️ You're investing only ${v}% (${fmt(v)}). Cut wants and aim for 15–20%.`;
  else              tip = `🚨 No investments allocated! Start small — even 5% (${fmt(5)}) per month builds real wealth.`;

  document.getElementById('budTip').innerHTML = tip;
  renderBudgetChart();
}

function renderBudgetChart() {
  const income = parseFloat(document.getElementById('income').value) || 50000;
  const n = +document.getElementById('needsRange').value;
  const w = +document.getElementById('wantsRange').value;
  const s = +document.getElementById('savingsRange').value;
  const v = +document.getElementById('investRange').value;

  const isDark    = document.documentElement.getAttribute('data-theme') === 'dark';
  const textColor = isDark ? '#a5d6a7' : '#3d6b4a';
  const ctx       = document.getElementById('budgetChart').getContext('2d');

  if (budgetChartInst) budgetChartInst.destroy();
  budgetChartInst = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['🏠 Needs', '🎮 Wants', '💰 Savings', '📈 Invest'],
      datasets: [{
        data: [n, w, s, v],
        backgroundColor: ['#ef5350', '#ffd54f', '#42a5f5', '#00e676'],
        borderColor: 'transparent',
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      cutout: '72%',
      plugins: {
        legend: { position: 'right', labels: { color: textColor, font: { size: 11 }, boxWidth: 12, padding: 12 } },
        tooltip: { callbacks: { label: c => ` ${c.raw}% — ₹${Math.round(income * c.raw / 100).toLocaleString('en-IN')}` } }
      }
    }
  });
}
