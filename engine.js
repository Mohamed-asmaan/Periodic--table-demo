/**
 * engine.js - Decision logic (action plan generator)
 * Separated from UI. Returns structured action plans.
 */

// Step definitions: question id, question text, options
const STEPS = [
  {
    id: 1,
    question: 'Are you receiving any government subsidy?',
    options: [
      { value: 'yes_regularly', label: 'Yes, regularly' },
      { value: 'stopped_recently', label: 'It stopped recently' },
      { value: 'never_received', label: 'Never received' },
      { value: 'dont_know', label: "I don't know" }
    ]
  },
  {
    id: 2,
    question: 'Do you have a bank account linked with Aadhaar?',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
      { value: 'not_sure', label: 'Not sure' }
    ]
  },
  {
    id: 3,
    question: 'Do you know if DBT is enabled for your account?',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
      { value: 'not_sure', label: 'Not sure' }
    ]
  },
  {
    id: 4,
    question: 'How long since last subsidy?',
    options: [
      { value: 'within_month', label: 'Within last month' },
      { value: '1_3_months', label: '1–3 months ago' },
      { value: 'more_than_3', label: 'More than 3 months ago' },
      { value: 'never', label: 'Never received any' }
    ]
  }
];

// Returns next step or null if done (ready for result)
function getNextStep(currentStep, answers) {
  if (currentStep >= STEPS.length) return null;
  const step = STEPS[currentStep];
  if (step.id === 4 && !shouldShowStep4(answers)) return null;
  return step;
}

function shouldShowStep4(answers) {
  return answers[1] === 'stopped_recently';
}

// Main: evaluate answers and return action plan
function evaluate(answers) {
  const subsidyStatus = answers[1];
  const aadhaarLinked = answers[2];
  const dbtEnabled = answers[3];
  const lastSubsidy = answers[4];

  // Decision logic - returns { problem, steps, say, where, time }
  if (aadhaarLinked === 'no' || aadhaarLinked === 'not_sure') {
    return {
      problem: 'Your Aadhaar may not be linked to your bank account.',
      steps: [
        'Visit your bank branch',
        'Carry Aadhaar card and bank passbook',
        'Ask them to link Aadhaar to your account'
      ],
      say: 'I want to link my Aadhaar to my bank account for subsidy payments.',
      where: 'Your bank branch',
      time: '15–20 minutes'
    };
  }

  if (dbtEnabled === 'no' || dbtEnabled === 'not_sure') {
    return {
      problem: 'Your bank account is not mapped for DBT (Direct Benefit Transfer).',
      steps: [
        'Visit your bank branch',
        'Request Aadhaar seeding check',
        'Ask them to enable DBT mapping'
      ],
      say: 'I want to check if my Aadhaar is mapped for DBT through NPCI.',
      where: 'Your bank branch or nearest CSC',
      time: '10–20 minutes'
    };
  }

  if (subsidyStatus === 'stopped_recently') {
    return {
      problem: 'Your subsidy might be going to another account, or there is a delay.',
      steps: [
        'Check with your bank if DBT is active',
        'Visit nearest CSC or bank to verify account mapping',
        'Confirm your scheme is still active'
      ],
      say: 'My subsidy stopped. I want to verify my DBT mapping is correct.',
      where: 'Bank branch or nearest CSC',
      time: '15–30 minutes'
    };
  }

  if (subsidyStatus === 'never_received' || subsidyStatus === 'dont_know') {
    return {
      problem: 'You may need to apply for the scheme first, or your account setup is incomplete.',
      steps: [
        'Visit your bank and confirm Aadhaar + DBT are both done',
        'Check if you are enrolled in the scheme (ration, LPG, etc.)',
        'Visit CSC if you need help with scheme enrollment'
      ],
      say: 'I have never received subsidy. I want to check if my account is ready for DBT.',
      where: 'Bank branch or CSC',
      time: '20–30 minutes'
    };
  }

  return {
    problem: 'Your account appears to be set up. If you still have issues, verify at your bank.',
    steps: [
      'Visit bank to confirm DBT status',
      'Check scheme enrollment if subsidy stopped'
    ],
    say: 'I want to verify my DBT status is active.',
    where: 'Your bank branch',
    time: '10–15 minutes'
  };
}

// Expose for ui.js
window.engineSteps = STEPS;
window.engineEvaluate = evaluate;
window.engineGetStep = function (stepNum) {
  return STEPS[stepNum - 1] || null;
};
