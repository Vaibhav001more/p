/* ═══════════════════════════════════════
   InvestIQ v2 — Risk Profile Quiz
   File: js/quiz.js
═══════════════════════════════════════ */

const questions = [
  {
    q: "If your investment dropped 20%, what would you do?",
    opts: [
      "Sell everything — I can't handle losing money.",
      "Feel worried but hold and wait for recovery.",
      "Stay calm — markets recover. I'd review my strategy.",
      "Buy more! It's a great discount opportunity."
    ]
  },
  {
    q: "What is your investment time horizon?",
    opts: [
      "Less than 1 year — I need the money soon.",
      "1–3 years — medium term goals.",
      "3–7 years — long term thinking.",
      "7+ years — I'm building generational wealth."
    ]
  },
  {
    q: "How much of your income can you invest monthly?",
    opts: [
      "Less than 5% — just starting out.",
      "5–10% — I'm trying to be consistent.",
      "10–20% — I'm serious about wealth building.",
      "20%+ — I live below my means intentionally."
    ]
  },
  {
    q: "What best describes your investment knowledge?",
    opts: [
      "Complete beginner — I don't know where to start.",
      "I know some basics — SIP, FD, etc.",
      "Intermediate — I understand stocks and mutual funds.",
      "Advanced — I follow markets and do own research."
    ]
  }
];

let curQ   = 0;
let scores = [];

function selectOpt(el, score) {
  document.querySelectorAll('.quiz-opt').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  scores[curQ] = score;
}

function nextQ() {
  if (scores[curQ] === undefined) { alert('Please select an answer!'); return; }
  if (curQ < questions.length - 1) { curQ++; loadQ(); }
  else { showResult(); }
}

function prevQ() {
  if (curQ > 0) { curQ--; loadQ(); }
}

function loadQ() {
  const q = questions[curQ];
  document.getElementById('quizQuestion').innerText = q.q;
  document.getElementById('quizQNum').innerText     = `Question ${curQ + 1} of ${questions.length}`;
  document.getElementById('quizProgressFill').style.width = ((curQ + 1) / questions.length * 100) + '%';

  document.getElementById('quizOptions').innerHTML = q.opts
    .map((o, i) => `
      <div class="quiz-opt${scores[curQ] === i ? ' selected' : ''}" onclick="selectOpt(this,${i})">
        <span class="opt-letter">${'ABCD'[i]}</span>${o}
      </div>`)
    .join('');

  document.getElementById('backBtn').style.opacity      = curQ === 0 ? '0.3' : '1';
  document.getElementById('backBtn').style.pointerEvents= curQ === 0 ? 'none' : 'auto';
  document.getElementById('nextBtn').innerText           = curQ === questions.length - 1 ? 'See Result →' : 'Next →';
}

function showResult() {
  const avg = scores.reduce((a, b) => a + b, 0) / questions.length;
  let emoji, title, desc;

  if      (avg < 1) { emoji = '🛡️'; title = 'Conservative Investor';    desc = 'You prioritize safety. Suggested: 70% Debt (FD/PPF), 20% Gold, 10% Large-cap Equity Funds.'; }
  else if (avg < 2) { emoji = '⚖️'; title = 'Moderate Investor';        desc = 'Balance of growth & safety. Suggested: 40% Debt, 40% Equity Mutual Funds, 20% Gold.'; }
  else if (avg < 3) { emoji = '📈'; title = 'Balanced Growth Investor'; desc = 'Comfortable with market fluctuations. Suggested: 60% Equity, 30% Debt, 10% Gold.'; }
  else              { emoji = '🚀'; title = 'Aggressive Investor';      desc = 'You chase high returns. Suggested: 80% Equity (small/mid-cap), 10% Crypto, 10% Gold.'; }

  document.getElementById('quizOptions').style.display  = 'none';
  document.getElementById('quizNav').style.display      = 'none';
  document.getElementById('quizResult').style.display   = 'block';
  document.getElementById('resultProfile').innerText    = emoji;
  document.getElementById('resultTitle').innerText      = title;
  document.getElementById('resultDesc').innerText       = desc;
}

function resetQuiz() {
  curQ = 0; scores = [];
  loadQ();
  document.getElementById('quizOptions').style.display = 'flex';
  document.getElementById('quizNav').style.display     = 'flex';
  document.getElementById('quizResult').style.display  = 'none';
}
