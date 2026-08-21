/* =========================================================
   0. HELPERS
   ========================================================= */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.getElementById('year').textContent = new Date().getFullYear();

/* =========================================================
   1. NAV — mobile toggle + active-section highlight
   ========================================================= */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
}));

const sections = document.querySelectorAll('main section[id], .hero[id]');
const navAnchors = document.querySelectorAll('.nav__links a');
const spy = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + id);
      });
    }
  });
}, { rootMargin: '-40% 0px -50% 0px' });
sections.forEach(s => spy.observe(s));

/* =========================================================
   2. WAVEFORM DIVIDERS — one unique squiggle per section break
   ========================================================= */
function buildWaveformSVG(seed, amplitude) {
  const width = 880, height = 46, points = 60;
  let d = `M0 ${height / 2}`;
  let rand = mulberry32(seed);
  for (let i = 1; i <= points; i++) {
    const x = (width / points) * i;
    const damp = Math.sin((i / points) * Math.PI); // taper at edges
    const y = height / 2 + (rand() - 0.5) * amplitude * damp;
    d += ` L${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return `<svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
    <path d="${d}" fill="none" stroke="#C1502E" stroke-width="1.4" opacity="0.55"/>
  </svg>`;
}
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
document.querySelectorAll('.divider').forEach(div => {
  const seed = parseInt(div.dataset.divider, 10) * 977;
  div.innerHTML = buildWaveformSVG(seed, 34);
});

/* =========================================================
   3. HERO SEISMOGRAPH — live scrolling trace, reacts to cursor
   ========================================================= */
(function seismograph() {
  const canvas = document.getElementById('seismo');
  const ctx = canvas.getContext('2d');
  let width, height, dpr;
  let points = [];
  let mouseX = null, mouseInfluence = 0;

  function resize() {
    dpr = window.devicePixelRatio || 1;
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    points = new Array(Math.floor(width / 3)).fill(0);
  }
  window.addEventListener('resize', resize);
  resize();

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseInfluence = 1;
  });
  canvas.addEventListener('mouseleave', () => { mouseInfluence = 0; });

  let t = 0;
  function drawFrame() {
    t += 0.06;
    const step = 3;
    // shift points left, generate a new one on the right
    points.shift();
    let base = Math.sin(t) * 4 + Math.sin(t * 2.7) * 2;
    if (mouseX !== null) {
      const idxFromRight = points.length - 1;
      const distToMouse = Math.abs((width - idxFromRight * step) - mouseX);
      const boost = Math.max(0, 1 - distToMouse / 220) * 46 * mouseInfluence;
      base += (Math.random() - 0.5) * boost;
    }
    points.push(base);

    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    const midY = height / 2;
    points.forEach((p, i) => {
      const x = i * step;
      const y = midY + p;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    const grad = ctx.createLinearGradient(0, 0, width, 0);
    grad.addColorStop(0, 'rgba(226,168,61,0.15)');
    grad.addColorStop(0.7, 'rgba(226,168,61,0.9)');
    grad.addColorStop(1, 'rgba(226,168,61,1)');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.6;
    ctx.stroke();

    if (!prefersReducedMotion) requestAnimationFrame(drawFrame);
  }

  if (prefersReducedMotion) {
    // draw a single static gentle trace, no animation loop
    points = points.map((_, i) => Math.sin(i * 0.15) * 6);
    drawFrame();
  } else {
    requestAnimationFrame(drawFrame);
  }
})();

/* =========================================================
   4. DAILY PUZZLE ENGINE
   ========================================================= */
const PUZZLES = [
  {
    category: 'Sequence',
    question: "I open with 2, 3, 5, 8, 13, 21 … What number comes next in this Fibonacci-style chain?",
    answer: '34',
    hint: 'Each term is the sum of the two before it.'
  },
  {
    category: 'Logic',
    question: "A seismologist has 3 seismometers. Two always report true readings, one always reports false. You ask all three 'is the fault active?' and get: Yes, Yes, No. Is the fault active?",
    answer: 'yes',
    hint: 'Majority vote works when only one instrument lies.'
  },
  {
    category: 'Probability',
    question: "You roll two fair six-sided dice. What is the probability (as a fraction, e.g. 1/6) that the sum equals 7?",
    answer: '1/6',
    hint: 'There are 6 ways to make 7 out of 36 total outcomes.'
  },
  {
    category: 'Number theory',
    question: "I am the smallest number greater than 100 that is prime. What number am I?",
    answer: '101',
    hint: 'Check odd numbers just above 100 for divisibility.'
  },
  {
    category: 'Geo-logic',
    question: "A station records a P-wave at 10:00:00 and the matching S-wave at 10:00:08 (Vp = 6 km/s, Vs = 3.5 km/s). Using distance = Tdiff × (Vp×Vs)/(Vp−Vs), roughly how far away is the quake, in km (nearest whole number)?",
    answer: '67',
    hint: 'Plug Tdiff=8s into d = 8 × (6×3.5)/(6-3.5). Round to nearest whole km.'
  },
  {
    category: 'Riddle',
    question: "I have layers but I'm not a cake, I record time but I'm not a clock, and geologists read me like a book. What am I?",
    answer: 'sedimentary rock',
    hint: 'Think of what forms the Siwalik Basin.'
  },
  {
    category: 'Data science',
    question: "A dataset's mean is 50 and its median is 30. Is the distribution more likely left-skewed or right-skewed?",
    answer: 'right-skewed',
    hint: 'A long tail of high values pulls the mean above the median.'
  },
  {
    category: 'Sequence',
    question: "What is the next prime number after 97?",
    answer: '101',
    hint: 'Skip 98, 99, 100 — check divisibility from there.'
  },
  {
    category: 'Optimization',
    question: "A delivery van can carry 10 packages. You have 47 packages to deliver. What is the minimum number of trips needed?",
    answer: '5',
    hint: 'Divide 47 by 10 and round up.'
  },
  {
    category: 'Cipher',
    question: "In a Caesar cipher with shift +4 (A→E, B→F, C→G…), the word 'BIKE' becomes a new 4-letter string. What is it?",
    answer: 'fmoi',
    hint: 'Shift each letter forward 4 places: B→F, I→M, K→O, E→I.'
  }
];

function daysSinceEpoch() {
  const now = new Date();
  const utcMidnight = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.floor(utcMidnight / 86400000);
}
function dateKey(offsetDays = 0) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}
function puzzleForOffset(offsetDays) {
  const idx = ((daysSinceEpoch() + offsetDays) % PUZZLES.length + PUZZLES.length) % PUZZLES.length;
  return PUZZLES[idx];
}
function normalize(str) {
  return str.trim().toLowerCase().replace(/\s+/g, ' ');
}

const STORAGE_KEY = 'vk_puzzle_state_v1';
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { streak: 0, lastSolvedDate: null, solvedDates: [] };
  } catch (e) {
    return { streak: 0, lastSolvedDate: null, solvedDates: [] };
  }
}
function saveState(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
}

const puzzleCategory = document.getElementById('puzzleCategory');
const puzzleQuestion = document.getElementById('puzzleQuestion');
const puzzleForm = document.getElementById('puzzleForm');
const puzzleInput = document.getElementById('puzzleInput');
const puzzleFeedback = document.getElementById('puzzleFeedback');
const streakDisplay = document.getElementById('streakDisplay');
const hintBtn = document.getElementById('hintBtn');
const archiveToggle = document.getElementById('archiveToggle');
const archive = document.getElementById('archive');
const archiveList = document.getElementById('archiveList');

let state = loadState();
const today = puzzleForOffset(0);
const todayKey = dateKey(0);
const alreadySolvedToday = state.solvedDates.includes(todayKey);

function renderStreak() {
  streakDisplay.textContent = `🔥 ${state.streak} day streak`;
}
function renderPuzzle() {
  puzzleCategory.textContent = today.category;
  puzzleQuestion.textContent = today.question;
  renderStreak();
  if (alreadySolvedToday) {
    puzzleFeedback.textContent = "Already solved today — come back tomorrow for a new one.";
    puzzleFeedback.className = 'puzzle-card__feedback ok';
    puzzleInput.disabled = true;
    puzzleForm.querySelector('button').disabled = true;
  }
}
renderPuzzle();

puzzleForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (alreadySolvedToday) return;
  const guess = normalize(puzzleInput.value);
  const correct = normalize(today.answer);
  if (!guess) return;

  if (guess === correct) {
    // update streak: consecutive if yesterday was solved
    const yesterdayKey = dateKey(-1);
    if (state.lastSolvedDate === yesterdayKey) {
      state.streak += 1;
    } else if (state.lastSolvedDate !== todayKey) {
      state.streak = 1;
    }
    state.lastSolvedDate = todayKey;
    if (!state.solvedDates.includes(todayKey)) state.solvedDates.push(todayKey);
    saveState(state);
    renderStreak();
    puzzleFeedback.textContent = '✓ Correct! Streak updated. Come back tomorrow for the next one.';
    puzzleFeedback.className = 'puzzle-card__feedback ok';
    puzzleInput.disabled = true;
    puzzleForm.querySelector('button').disabled = true;
  } else {
    puzzleFeedback.textContent = '✗ Not quite — try again, or grab a hint.';
    puzzleFeedback.className = 'puzzle-card__feedback no';
  }
});

hintBtn.addEventListener('click', () => {
  puzzleFeedback.textContent = `💡 Hint: ${today.hint}`;
  puzzleFeedback.className = 'puzzle-card__feedback hint';
});

archiveToggle.addEventListener('click', () => {
  const isHidden = archive.hasAttribute('hidden');
  if (isHidden) {
    archiveList.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
      const p = puzzleForOffset(-i);
      const li = document.createElement('li');
      li.innerHTML = `<span class="archive__q">${dateKey(-i)} · ${p.category}</span><br>${p.question}<span class="archive__a">Answer: ${p.answer}</span>`;
      archiveList.appendChild(li);
    }
    archive.removeAttribute('hidden');
    archiveToggle.textContent = 'Past puzzles ↑';
  } else {
    archive.setAttribute('hidden', '');
    archiveToggle.textContent = 'Past puzzles ↓';
  }
});
