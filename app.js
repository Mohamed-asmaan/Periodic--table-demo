/**
 * CHEMISTRY EXAM REVISION TABLE - Main Application
 * =================================================
 * Vanilla JavaScript - No frameworks
 * Team: 5-6 members - each section can be owned by a member
 * 
 * Sections:
 * 1. State & localStorage
 * 2. Periodic table rendering
 * 3. Element click & detail panel
 * 4. Search
 * 5. Study mode
 * 6. Weak element tracking
 * 7. Quiz mode
 * 8. Progress tracking
 * 9. Element comparison
 * 10. First-time UX & continue learning
 */

/* ========== 1. STATE & LOCALSTORAGE ========== */

const STORAGE_KEYS = {
  PROFILE: 'chemistryRevision_profile',
  WELCOME_SEEN: 'chemistryRevision_welcomeSeen',
  WEAK_ELEMENTS: 'chemistryRevision_weakElements',
  LAST_VIEWED: 'chemistryRevision_lastViewed',
  STUDY_HIDDEN: 'chemistryRevision_studyHidden'
};

// App state
let state = {
  userName: null,
  userEmail: null,
  studyMode: false,
  studyHidden: {},
  weakElements: {},
  lastViewed: null,
  compareSelection: [],
  filterMode: 'all',      // 'all' | 'weak' | 'studied'
  filterPeriods: [],      // e.g. [1, 2, 3] - empty = all periods
  quizScore: 0,
  quizTotal: 0
};

// Load state from localStorage
function loadState() {
  try {
    const profile = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (profile) {
      const p = JSON.parse(profile);
      state.userName = p.name || null;
      state.userEmail = p.email || null;
    }

    const welcome = localStorage.getItem(STORAGE_KEYS.WELCOME_SEEN);
    if (!welcome) return; // First visit - profile modal will handle

    const weak = localStorage.getItem(STORAGE_KEYS.WEAK_ELEMENTS);
    if (weak) state.weakElements = JSON.parse(weak);

    const last = localStorage.getItem(STORAGE_KEYS.LAST_VIEWED);
    if (last) state.lastViewed = last;

    const hidden = localStorage.getItem(STORAGE_KEYS.STUDY_HIDDEN);
    if (hidden) state.studyHidden = JSON.parse(hidden);
  } catch (e) {
    console.warn('Could not load state:', e);
  }
}

// Save weak elements to localStorage
function saveWeakElements() {
  try {
    localStorage.setItem(STORAGE_KEYS.WEAK_ELEMENTS, JSON.stringify(state.weakElements));
  } catch (e) {
    console.warn('Could not save weak elements:', e);
  }
}

// Save last viewed element
function saveLastViewed(symbol) {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_VIEWED, symbol);
  } catch (e) {
    console.warn('Could not save last viewed:', e);
  }
}



/* ========== 2. PERIODIC TABLE RENDERING ========== */

// Element category for periodic table colors (standard IUPAC-style)
function getElementCategory(el) {
  const n = el.atomicNumber;
  const g = el.group;
  if (n === 1) return 'nonmetal';
  if (g === 1) return 'alkali';
  if (g === 2) return 'alkaline-earth';
  if (g >= 3 && g <= 12) return 'transition';
  if (n >= 57 && n <= 71) return 'lanthanide';
  if (n >= 89 && n <= 103) return 'actinide';
  if (g === 17) return 'halogen';
  if (g === 18) return 'noble-gas';
  if ([5, 14, 32, 33, 51, 52, 84].includes(n)) return 'metalloid';
  if (g >= 13 && g <= 16) return 'post-transition';
  return 'post-transition';
}

function getFilteredElements() {
  let elements = ELEMENTS;

  if (state.filterMode === 'weak') {
    elements = elements.filter(el => state.weakElements[el.symbol] === 'weak');
  }

  if (state.filterPeriods.length > 0) {
    elements = elements.filter(el => state.filterPeriods.includes(el.period));
  }

  return elements;
}

function renderPeriodicTable() {
  const container = document.getElementById('periodicTable');
  container.innerHTML = '';

  const elementsToShow = getFilteredElements();

  if (elementsToShow.length === 0) {
    const msg = state.filterMode === 'weak'
      ? 'No elements need practice. Toggle "Needs practice" on any element to add it here.'
      : 'No elements match the period filter.';
    container.innerHTML = `<p class="empty-message">${msg}</p>`;
    return;
  }

  // Create a grid map: (ypos, xpos) -> element
  const grid = {};
  elementsToShow.forEach(el => {
    const key = `${el.ypos}-${el.xpos}`;
    grid[key] = el;
  });

  // Grid: 18 cols x 10 rows (standard periodic table layout)
  for (let row = 1; row <= 10; row++) {
    for (let col = 1; col <= 18; col++) {
      const key = `${row}-${col}`;
      const element = grid[key];
      const cell = document.createElement('div');
      cell.className = 'element-cell';
      cell.setAttribute('role', 'gridcell');
      cell.dataset.symbol = element ? element.symbol : '';
      cell.dataset.xpos = col;
      cell.dataset.ypos = row;

      if (element) {
        const category = getElementCategory(element);
        cell.classList.add(`cat-${category}`);
        cell.innerHTML = `
          <span class="element-symbol">${element.symbol}</span>
          <span class="element-number">${element.atomicNumber}</span>
        `;
        cell.style.gridColumn = col;
        cell.style.gridRow = row;
        cell.tabIndex = 0;
        cell.addEventListener('click', () => handleElementClick(element));
        cell.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleElementClick(element);
          }
        });

        if (state.weakElements[element.symbol] === 'weak') {
          cell.classList.add('weak');
        }
      } else {
        cell.classList.add('empty');
        cell.style.visibility = 'hidden';
        cell.style.gridColumn = col;
        cell.style.gridRow = row;
      }

      container.appendChild(cell);
    }
  }
}

/* ========== 3. ELEMENT CLICK & DETAIL PANEL ========== */

function handleElementClick(element) {
  if (!element) return;

  saveLastViewed(element.symbol);
  renderDetailPanel(element);

  document.querySelectorAll('.element-cell.highlight').forEach(c => c.classList.remove('highlight'));
  const cell = document.querySelector(`[data-symbol="${element.symbol}"]`);
  if (cell) cell.classList.add('highlight');
}

function renderDetailPanel(element) {
  const content = document.getElementById('detailContent');
  const actions = document.getElementById('detailActions');

  const hide = state.studyHidden;
  const showAtomicNumber = !hide.atomicNumber;
  const showAtomicMass = !hide.atomicMass;
  const showElectronConfig = !hide.electronConfiguration;
  const showGroup = !hide.group;

  const isWeak = state.weakElements[element.symbol] === 'weak';

  content.innerHTML = `
    <h2>${element.name}</h2>
    <label class="needs-practice-toggle">
      <input type="checkbox" id="needsPracticeCheck" ${isWeak ? 'checked' : ''} data-symbol="${element.symbol}">
      <span class="toggle-slider"></span>
      <span class="toggle-label">Needs practice</span>
    </label>
    <div class="detail-row">
      <span class="detail-label">Symbol</span>
      <span class="detail-value">${element.symbol}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Atomic Number</span>
      <span class="detail-value ${showAtomicNumber ? '' : 'hidden'}">${showAtomicNumber ? element.atomicNumber : '???'}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Atomic Mass</span>
      <span class="detail-value ${showAtomicMass ? '' : 'hidden'}">${showAtomicMass ? element.atomicMass : '???'}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Group</span>
      <span class="detail-value ${showGroup ? '' : 'hidden'}">${showGroup ? (element.group ?? '—') : '???'}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Period</span>
      <span class="detail-value">${element.period}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Electron Configuration</span>
      <span class="detail-value ${showElectronConfig ? '' : 'hidden'}">${showElectronConfig ? element.electronConfiguration : '???'}</span>
    </div>
  `;

  actions.style.display = 'flex';
  actions.dataset.symbol = element.symbol;

  const toggle = content.querySelector('#needsPracticeCheck');
  if (toggle) {
    toggle.addEventListener('change', (e) => {
      const sym = e.target.dataset.symbol;
      if (e.target.checked) {
        state.weakElements[sym] = 'weak';
      } else {
        delete state.weakElements[sym];
      }
      saveWeakElements();
      updateProgressUI();
      document.querySelectorAll(`[data-symbol="${sym}"]`).forEach(c => c.classList.toggle('weak', e.target.checked));
    });
  }
}

/* ========== 4. SEARCH ========== */

function setupSearch() {
  const input = document.getElementById('searchInput');
  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();
    if (!query) {
      document.querySelectorAll('.element-cell').forEach(c => {
        c.classList.remove('highlight');
        c.classList.remove('hidden');
      });
      return;
    }

    const matches = ELEMENTS.filter(el =>
      el.name.toLowerCase().includes(query) ||
      el.symbol.toLowerCase().includes(query) ||
      String(el.atomicNumber).includes(query)
    );

    document.querySelectorAll('.element-cell').forEach(c => {
      const sym = c.dataset.symbol;
      const isMatch = matches.some(m => m.symbol === sym);
      c.classList.toggle('highlight', isMatch);
      c.classList.toggle('hidden', !isMatch && query.length >= 2);
    });
  });
}

/* ========== 5. STUDY MODE ========== */

function setupStudyMode() {
  const btn = document.getElementById('studyModeBtn');
  const options = document.getElementById('studyOptions');
  const checkboxes = ['hideAtomicNumber', 'hideAtomicMass', 'hideElectronConfig', 'hideGroup'];

  btn.addEventListener('click', () => {
    state.studyMode = !state.studyMode;
    options.style.display = state.studyMode ? 'block' : 'none';
    btn.textContent = state.studyMode ? 'Exit Study Mode' : 'Study Mode';

    if (state.studyMode) {
      state.studyHidden = {
        atomicNumber: document.getElementById('hideAtomicNumber').checked,
        atomicMass: document.getElementById('hideAtomicMass').checked,
        electronConfiguration: document.getElementById('hideElectronConfig').checked,
        group: document.getElementById('hideGroup').checked
      };
      try {
        localStorage.setItem(STORAGE_KEYS.STUDY_HIDDEN, JSON.stringify(state.studyHidden));
      } catch (e) {}
    }
  });

  checkboxes.forEach(id => {
    document.getElementById(id).addEventListener('change', () => {
      const key = id.replace('hide', '');
      state.studyHidden[key.charAt(0).toLowerCase() + key.slice(1)] = document.getElementById(id).checked;
      try {
        localStorage.setItem(STORAGE_KEYS.STUDY_HIDDEN, JSON.stringify(state.studyHidden));
      } catch (e) {}
      const sym = document.getElementById('detailActions')?.dataset?.symbol;
      if (sym) {
        const el = ELEMENTS.find(e => e.symbol === sym);
        if (el) renderDetailPanel(el);
      }
    });
  });

  document.getElementById('closeStudyMode').addEventListener('click', () => {
    state.studyMode = false;
    options.style.display = 'none';
    btn.textContent = 'Study Mode';
  });
}

/* ========== 6. WEAK ELEMENT TRACKING ========== */

function setupRevealAndWeak() {
  document.getElementById('revealBtn').addEventListener('click', () => {
    const sym = document.getElementById('detailActions')?.dataset?.symbol;
    if (!sym) return;

    state.weakElements[sym] = 'weak';
    saveWeakElements();

    const cell = document.querySelector(`[data-symbol="${sym}"]`);
    if (cell) cell.classList.add('weak');

    const el = ELEMENTS.find(e => e.symbol === sym);
    if (el) {
      state.studyHidden = {};
      renderDetailPanel(el);
    }
  });
}

function setupFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const periodCheckboxes = document.querySelectorAll('.period-filter');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.filterMode = btn.dataset.filter;
      renderPeriodicTable();
    });
  });

  periodCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      state.filterPeriods = Array.from(document.querySelectorAll('.period-filter:checked'))
        .map(c => parseInt(c.value, 10));
      renderPeriodicTable();
    });
  });
}

/* ========== 7. QUIZ MODE ========== */

function setupQuiz() {
  const modal = document.getElementById('quizModal');
  const questionEl = document.getElementById('quizQuestion');
  const optionsEl = document.getElementById('quizOptions');
  const scoreEl = document.getElementById('quizScore');
  const totalEl = document.getElementById('quizTotal');

  function getRandomElements(count) {
    const shuffled = [...ELEMENTS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  function startQuiz() {
    state.quizScore = 0;
    state.quizTotal = 0;
    askQuestion();
    modal.setAttribute('aria-hidden', 'false');
    modal.style.display = 'flex';
  }

  function askQuestion() {
    const correct = ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)];
    const others = ELEMENTS.filter(e => e.symbol !== correct.symbol)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    const options = [correct, ...others].sort(() => Math.random() - 0.5);

    const questionTypes = [
      { q: `Which element has atomic number ${correct.atomicNumber}?`, getAnswer: () => correct.name },
      { q: `What is the symbol for ${correct.name}?`, getAnswer: () => correct.symbol },
      { q: `What is the atomic mass of ${correct.name}?`, getAnswer: () => String(correct.atomicMass) }
    ];

    const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    questionEl.textContent = type.q;

    const answer = type.getAnswer();
    optionsEl.innerHTML = '';

    const displayOptions = type.q.includes('symbol')
      ? options.map(o => o.symbol)
      : type.q.includes('atomic mass')
        ? options.map(o => String(o.atomicMass))
        : options.map(o => o.name);

    displayOptions.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option';
      btn.textContent = opt;
      btn.addEventListener('click', () => {
        state.quizTotal++;
        const isCorrect = opt === answer;
        if (isCorrect) state.quizScore++;
        btn.classList.add(isCorrect ? 'correct' : 'wrong');
        optionsEl.querySelectorAll('.quiz-option').forEach(b => {
          b.disabled = true;
        });
        scoreEl.textContent = state.quizScore;
        totalEl.textContent = state.quizTotal;
        setTimeout(askQuestion, 1000);
      });
      optionsEl.appendChild(btn);
    });
  }

  document.getElementById('quizBtn').addEventListener('click', startQuiz);
  document.getElementById('quizClose').addEventListener('click', () => {
    modal.setAttribute('aria-hidden', 'true');
    modal.style.display = 'none';
  });
}

/* ========== 8. PROGRESS TRACKING ========== */

function updateProgressUI() {
  const count = Object.keys(state.weakElements).filter(s => state.weakElements[s] === 'weak').length;
  const el = document.getElementById('progressText');
  const fill = document.getElementById('progressFill');
  if (el) el.textContent = count === 0 ? '0 elements' : `${count} element${count > 1 ? 's' : ''}`;
  if (fill) fill.style.width = `${Math.min(100, count * 2)}%`;
}

/* ========== 9. ELEMENT COMPARISON ========== */

function renderComparisonTable() {
  const container = document.getElementById('comparisonTable');
  const hint = document.getElementById('comparisonHint');
  if (!container) return;

  if (state.compareSelection.length === 2) {
    const a = ELEMENTS.find(e => e.symbol === state.compareSelection[0]);
    const b = ELEMENTS.find(e => e.symbol === state.compareSelection[1]);
    if (a && b) {
      if (hint) hint.style.display = 'none';
      const catA = getElementCategory(a);
      const catB = getElementCategory(b);
      container.innerHTML = `
        <table class="compare-table">
          <thead>
            <tr>
              <th class="compare-prop-col">Property</th>
              <th class="compare-elem-col cat-${catA}">${a.symbol}<span class="compare-elem-name">${a.name}</span></th>
              <th class="compare-elem-col cat-${catB}">${b.symbol}<span class="compare-elem-name">${b.name}</span></th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Atomic Number</td><td>${a.atomicNumber}</td><td>${b.atomicNumber}</td></tr>
            <tr><td>Atomic Mass</td><td>${a.atomicMass}</td><td>${b.atomicMass}</td></tr>
            <tr><td>Group</td><td>${a.group ?? '—'}</td><td>${b.group ?? '—'}</td></tr>
            <tr><td>Period</td><td>${a.period}</td><td>${b.period}</td></tr>
            <tr class="compare-config-row"><td>Electron Config</td><td class="compare-config">${a.electronConfiguration}</td><td class="compare-config">${b.electronConfiguration}</td></tr>
          </tbody>
        </table>
      `;
    }
  } else if (state.compareSelection.length === 1) {
    const el = ELEMENTS.find(e => e.symbol === state.compareSelection[0]);
    if (hint) {
      hint.style.display = 'block';
      hint.textContent = `Selected: ${el ? el.name : '?'}. Now click another element in the table, then "Select for Comparison".`;
    }
    container.innerHTML = '';
  } else {
    if (hint) {
      hint.style.display = 'block';
      hint.textContent = '1. Click an element in the table → 2. Click "Select for Comparison" below → 3. Repeat for second element';
    }
    container.innerHTML = '';
  }
}

function setupComparison() {
  const panel = document.getElementById('comparisonPanel');
  const compareBtn = document.getElementById('compareBtn');
  const selectBtn = document.getElementById('compareSelectBtn');
  const closeBtn = document.getElementById('closeComparison');
  const clearBtn = document.getElementById('clearComparison');

  function showPanel() {
    panel.style.display = 'block';
  }

  compareBtn.addEventListener('click', () => {
    state.compareSelection = [];
    panel.style.display = 'block';
    renderComparisonTable();
    showPanel();
  });

  selectBtn.addEventListener('click', () => {
    const actionsEl = document.getElementById('detailActions');
    const sym = actionsEl?.dataset?.symbol;
    if (!sym) return;
    if (state.compareSelection.includes(sym)) return;
    if (state.compareSelection.length >= 2) return;
    state.compareSelection.push(sym);
    showPanel();
    renderComparisonTable();
  });

  clearBtn.addEventListener('click', () => {
    state.compareSelection = [];
    renderComparisonTable();
  });

  closeBtn.addEventListener('click', () => {
    panel.style.display = 'none';
    state.compareSelection = [];
  });
}

/* ========== 10. FIRST-TIME UX & CONTINUE LEARNING ========== */

// Email validation regex (simple but effective)
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setupProfileModal() {
  const modal = document.getElementById('profileModal');
  const form = document.getElementById('profileForm');
  const nameInput = document.getElementById('profileName');
  const emailInput = document.getElementById('profileEmail');
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');

  // Show profile modal if no profile saved
  if (!localStorage.getItem(STORAGE_KEYS.PROFILE)) {
    modal.setAttribute('aria-hidden', 'false');
    modal.style.display = 'flex';
  } else {
    updateHeaderWithProfile();
  }

  function clearErrors() {
    nameError.textContent = '';
    emailError.textContent = '';
    nameInput.classList.remove('input-error');
    emailInput.classList.remove('input-error');
  }

  function showError(field, message) {
    if (field === 'name') {
      nameError.textContent = message;
      nameInput.classList.add('input-error');
    } else {
      emailError.textContent = message;
      emailInput.classList.add('input-error');
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    let valid = true;

    if (!name) {
      showError('name', 'Name is required');
      valid = false;
    } else if (name.length < 2) {
      showError('name', 'Name must be at least 2 characters');
      valid = false;
    }

    if (!email) {
      showError('email', 'Email is required');
      valid = false;
    } else if (!isValidEmail(email)) {
      showError('email', 'Please enter a valid email address');
      valid = false;
    }

    if (!valid) return;

    // Save profile
    const profile = { name, email };
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    state.userName = name;
    state.userEmail = email;

    modal.setAttribute('aria-hidden', 'true');
    modal.style.display = 'none';
    updateHeaderWithProfile();

    // Show welcome tips modal if first time
    if (!localStorage.getItem(STORAGE_KEYS.WELCOME_SEEN)) {
      const welcomeModal = document.getElementById('welcomeModal');
      welcomeModal.setAttribute('aria-hidden', 'false');
      welcomeModal.style.display = 'flex';
    }
  });
}

function updateHeaderWithProfile() {
  const tagline = document.getElementById('headerTagline');
  if (state.userName && tagline) {
    tagline.textContent = `Welcome, ${state.userName} — periodic table study tool`;
  }
}

function setupWelcomeModal() {
  const modal = document.getElementById('welcomeModal');
  const closeBtn = document.getElementById('welcomeClose');

  // Only show if profile exists and welcome not seen
  if (localStorage.getItem(STORAGE_KEYS.PROFILE) && !localStorage.getItem(STORAGE_KEYS.WELCOME_SEEN)) {
    modal.setAttribute('aria-hidden', 'false');
    modal.style.display = 'flex';
  }

  closeBtn.addEventListener('click', () => {
    localStorage.setItem(STORAGE_KEYS.WELCOME_SEEN, 'true');
    modal.setAttribute('aria-hidden', 'true');
    modal.style.display = 'none';
  });
}

function setupContinueBanner() {
  const banner = document.getElementById('continueBanner');
  const nameEl = document.getElementById('continueElementName');
  const yesBtn = document.getElementById('continueYes');
  const dismissBtn = document.getElementById('continueDismiss');

  if (state.lastViewed) {
    const el = ELEMENTS.find(e => e.symbol === state.lastViewed);
    if (el) {
      nameEl.textContent = el.name;
      banner.style.display = 'flex';
    }
  }

  yesBtn.addEventListener('click', () => {
    if (state.lastViewed) {
      const el = ELEMENTS.find(e => e.symbol === state.lastViewed);
      if (el) handleElementClick(el);
    }
    banner.style.display = 'none';
  });

  dismissBtn.addEventListener('click', () => {
    banner.style.display = 'none';
  });
}

/* ========== INITIALIZATION ========== */

document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  loadState();
  renderPeriodicTable();
  updateProgressUI();
  setupSearch();
  setupStudyMode();
  setupRevealAndWeak();
  setupFilters();
  setupQuiz();
  setupComparison();
  setupProfileModal();
  setupWelcomeModal();
  setupContinueBanner();

  // Restore study hidden from localStorage
  if (Object.keys(state.studyHidden).length) {
    document.getElementById('hideAtomicNumber').checked = state.studyHidden.atomicNumber;
    document.getElementById('hideAtomicMass').checked = state.studyHidden.atomicMass;
    document.getElementById('hideElectronConfig').checked = state.studyHidden.electronConfiguration;
    document.getElementById('hideGroup').checked = state.studyHidden.group;
  }
});
