/**
 * flow.js - Interactive flow engine (decision tree)
 * Logic: Aadhaar linked → Bank seeded → DBT enabled → Result
 */

const FLOW_STATE = {
  aadhaarLinked: null,
  bankSeeded: null,
  dbtEnabled: null
};

function getFlowContainer() {
  return document.getElementById('flow-container');
}

function getStepElement(stepNumber) {
  return document.getElementById(`flow-step-${stepNumber}`);
}

function showStep(stepNumber) {
  const steps = document.querySelectorAll('.flow-step');
  steps.forEach(step => {
    step.classList.remove('active');
    step.setAttribute('hidden', '');
  });

  const target = getStepElement(stepNumber);
  if (target) {
    target.classList.add('active');
    target.removeAttribute('hidden');
  }
}

function showResult(status, reason, nextAction) {
  const resultEl = document.getElementById('flow-result');
  const cardEl = document.getElementById('result-card');
  const steps = document.querySelectorAll('.flow-step');

  steps.forEach(step => {
    step.classList.remove('active');
    step.setAttribute('hidden', '');
  });

  cardEl.className = 'result-card ' + (status === 'eligible' ? 'eligible' : 'action-required');
  cardEl.innerHTML = `
    <p class="result-status">${status === 'eligible' ? '✅ Eligible' : '⚠️ Action Required'}</p>
    <p class="result-reason">${reason}</p>
    <p class="result-next">${nextAction}</p>
  `;

  resultEl.classList.add('visible');
  resultEl.removeAttribute('hidden');
}

function hideResult() {
  const resultEl = document.getElementById('flow-result');
  resultEl.classList.remove('visible');
  resultEl.setAttribute('hidden', '');
}

function evaluateFlow() {
  const { aadhaarLinked, bankSeeded, dbtEnabled } = FLOW_STATE;

  if (aadhaarLinked === false) {
    showResult(
      'action',
      'Your Aadhaar is not linked to your bank account yet.',
      'Visit your bank branch and link your Aadhaar to your account.'
    );
    return;
  }

  if (bankSeeded === false) {
    showResult(
      'action',
      'Your bank is not connected for subsidy payments yet.',
      'Ask your bank if they support NPCI mapper. Some banks need time to set this up.'
    );
    return;
  }

  if (dbtEnabled === false) {
    showResult(
      'action',
      'DBT (Direct Benefit Transfer) is not turned on for your account.',
      'Visit your bank branch or use your bank app to enable DBT for subsidy payments.'
    );
    return;
  }

  if (aadhaarLinked && bankSeeded && dbtEnabled) {
    showResult(
      'eligible',
      'Your account is ready for government subsidy payments.',
      'You should receive subsidies directly in your bank account when eligible.'
    );
    return;
  }

  // Fallback - should not reach here in normal flow
  showResult(
    'action',
    'Please complete all steps to check your status.',
    'Answer the questions above to see what you need to do next.'
  );
}

function handleChoice(stepNumber, choice) {
  const isYes = choice === 'yes';

  if (stepNumber === 1) {
    FLOW_STATE.aadhaarLinked = isYes;
    if (!isYes) {
      evaluateFlow();
      return;
    }
    showStep(2);
  } else if (stepNumber === 2) {
    FLOW_STATE.bankSeeded = isYes;
    if (!isYes) {
      evaluateFlow();
      return;
    }
    showStep(3);
  } else if (stepNumber === 3) {
    FLOW_STATE.dbtEnabled = isYes;
    evaluateFlow();
  }
}

function initFlow() {
  FLOW_STATE.aadhaarLinked = null;
  FLOW_STATE.bankSeeded = null;
  FLOW_STATE.dbtEnabled = null;

  hideResult();
  showStep(1);

  document.querySelectorAll('.flow-choice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const step = btn.closest('.flow-step');
      if (!step) return;
      const stepNumber = parseInt(step.dataset.step, 10);
      const choice = btn.dataset.choice;
      handleChoice(stepNumber, choice);
    });
  });

  document.getElementById('flow-restart-btn').addEventListener('click', () => {
    initFlow();
  });
}
