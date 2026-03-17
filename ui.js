/**
 * ui.js - Rendering and step navigation
 * Handles: show step, handle choice, back, show result
 */

(function () {
  let currentStep = 1;
  let answers = {};

  function getStepQuestion() {
    return document.getElementById('step-question');
  }

  function getStepChoices() {
    return document.getElementById('step-choices');
  }

  function getBackBtn() {
    return document.getElementById('back-btn');
  }

  function getResultSection() {
    return document.getElementById('result-section');
  }

  function showStep(stepData) {
    const questionEl = getStepQuestion();
    const choicesEl = getStepChoices();
    const progressEl = document.getElementById('step-progress-text');

    if (!stepData) return;

    questionEl.textContent = stepData.question;
    const totalSteps = answers[1] === 'stopped_recently' ? 4 : 3;
    progressEl.textContent = 'Step ' + stepData.id + ' of ' + totalSteps;

    choicesEl.innerHTML = '';
    stepData.options.forEach(function (opt) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'choice-btn';
      btn.dataset.value = opt.value;
      btn.textContent = opt.label;
      choicesEl.appendChild(btn);
    });

    getBackBtn().disabled = currentStep === 1;
  }

  function showResult(actionPlan) {
    const stepSection = document.querySelector('.step-section');
    const resultSection = getResultSection();

    stepSection.hidden = true;
    resultSection.hidden = false;

    document.getElementById('result-problem').innerHTML =
      '<span class="result-label">Problem</span><p class="result-value">' + actionPlan.problem + '</p>';

    const stepsHtml = actionPlan.steps
      .map(function (s, i) {
        return '<li>' + s + '</li>';
      })
      .join('');
    document.getElementById('result-steps').innerHTML =
      '<span class="result-label">What to do</span><ol>' + stepsHtml + '</ol>';

    document.getElementById('result-say').innerHTML =
      '<span class="result-label">What to say</span><p class="result-value">"' + actionPlan.say + '"</p>';

    document.getElementById('result-where').innerHTML =
      '<span class="result-label">Where</span><p class="result-value">' + actionPlan.where + '</p>';

    document.getElementById('result-time').innerHTML =
      '<span class="result-label">Time</span><p class="result-value">' + actionPlan.time + '</p>';
  }

  function onChoiceClick(value) {
    answers[currentStep] = value;

    const nextStepNum = currentStep + 1;
    const showStep4 = answers[1] === 'stopped_recently' && currentStep === 3;

    if (currentStep === 3 && !showStep4) {
      const actionPlan = window.engineEvaluate(answers);
      showResult(actionPlan);
      return;
    }

    if (currentStep === 4) {
      const actionPlan = window.engineEvaluate(answers);
      showResult(actionPlan);
      return;
    }

    currentStep = nextStepNum;
    const stepData = window.engineGetStep(currentStep);
    showStep(stepData);
  }

  function onBackClick() {
    if (currentStep <= 1) return;
    currentStep--;
    delete answers[currentStep + 1];
    const stepData = window.engineGetStep(currentStep);
    showStep(stepData);
  }

  function onRestartClick() {
    currentStep = 1;
    answers = {};
    document.querySelector('.step-section').hidden = false;
    getResultSection().hidden = true;
    const stepData = window.engineGetStep(1);
    showStep(stepData);
  }

  function init() {
    const stepData = window.engineGetStep(1);
    showStep(stepData);

    getStepChoices().addEventListener('click', function (e) {
      const btn = e.target.closest('.choice-btn');
      if (btn) onChoiceClick(btn.dataset.value);
    });

    getBackBtn().addEventListener('click', onBackClick);
    document.getElementById('restart-btn').addEventListener('click', onRestartClick);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
